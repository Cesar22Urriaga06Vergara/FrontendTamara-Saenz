<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

/**
 * Modal de terminación de contrato, compartido por el listado (`pages/contratos/index.vue`)
 * y el detalle (`pages/contratos/[id].vue`). Hace el PATCH él mismo y emite `terminado` para
 * que el padre recargue lo que corresponda. La cartera pendiente solo se consulta si el
 * usuario es Administrador (`/obligaciones/...` es exclusivo de ese rol).
 */
const props = defineProps<{
  modelValue: boolean
  contrato: {
    id: string
    cliente?: { nombreCompleto?: string }
    inmueble?: { direccion?: string; barrio?: string }
    depositoGarantia?: number | string
    depositoLiquidadoEn?: string | null
  } | null
}>()
const emit = defineEmits<{ 'update:modelValue': [boolean]; terminado: [] }>()

const auth = useAuthStore()
const { moneda } = useFormatoCO()

const form = reactive({ fechaFin: '', motivoTerminacion: '' })
const procesando = ref(false)
const error = ref('')

const cargandoCartera = ref(false)
const obligaciones = ref<any[]>([])
const carteraTotal = computed(() =>
  obligaciones.value.reduce((s, o) => s + (Number(o.valorOriginal) - Number(o.valorAbonado)), 0),
)
const depositoPendiente = computed(() => {
  const valor = Number(props.contrato?.depositoGarantia ?? 0)
  return !props.contrato?.depositoLiquidadoEn && valor > 0 ? valor : 0
})

watch(
  () => props.modelValue,
  (abierto) => {
    if (!abierto) return
    form.fechaFin = new Date().toISOString().slice(0, 10)
    form.motivoTerminacion = ''
    error.value = ''
    obligaciones.value = []
    if (auth.esAdministrador && props.contrato?.id) cargarCartera()
  },
)

async function cargarCartera() {
  cargandoCartera.value = true
  try {
    obligaciones.value = await useApiFetch<any[]>(`/obligaciones/contrato/${props.contrato!.id}/pendientes`)
  } catch {
    // La cartera es contexto, no un bloqueante para poder terminar el contrato.
  } finally {
    cargandoCartera.value = false
  }
}

async function confirmar() {
  if (!props.contrato || !form.fechaFin || !form.motivoTerminacion.trim()) return
  procesando.value = true
  error.value = ''
  try {
    await useApiFetch(`/contratos/${props.contrato.id}/terminar`, {
      method: 'PATCH',
      body: { fechaFin: form.fechaFin, motivoTerminacion: form.motivoTerminacion.trim() },
    })
    emit('update:modelValue', false)
    emit('terminado')
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible terminar el contrato.'
  } finally {
    procesando.value = false
  }
}
</script>

<template>
  <UModal :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <UCard>
      <template #header>
        <p class="font-semibold text-slate-900">Terminar contrato</p>
        <p v-if="contrato" class="mt-0.5 text-sm text-slate-500">
          {{ contrato.cliente?.nombreCompleto }}
          <span v-if="contrato.inmueble?.direccion"> · {{ contrato.inmueble.direccion }}</span>
        </p>
      </template>

      <div class="space-y-4">
        <UAlert
          color="amber"
          variant="subtle"
          icon="i-heroicons-exclamation-triangle"
          title="Esta acción es irreversible."
          description="El inmueble vuelve a quedar disponible y se anula el canon ya generado para periodos posteriores a la fecha de fin."
        />

        <div
          v-if="auth.esAdministrador"
          class="space-y-1 rounded-md border border-slate-300 bg-slate-50 p-3 text-sm text-slate-700"
        >
          <Transition name="fade" mode="out-in">
            <SharedSkeletonText v-if="cargandoCartera" key="cargando" :lines="2" width-class="w-32" />
            <div v-else key="cartera" class="space-y-1">
              <p v-if="carteraTotal > 0">
                Cartera pendiente:
                <span class="font-semibold text-red-600">{{ moneda(carteraTotal) }}</span>
                <span class="text-slate-500"> — sigue cobrable desde Recaudo tras terminar.</span>
              </p>
              <p v-else class="text-slate-500">Sin cartera pendiente.</p>
              <p v-if="depositoPendiente > 0">
                Depósito de garantía:
                <span class="font-semibold text-slate-900">{{ moneda(depositoPendiente) }}</span>
                <span class="text-slate-500"> — se liquida aparte desde Recaudo.</span>
              </p>
            </div>
          </Transition>
        </div>

        <UFormGroup label="Fecha de fin" required>
          <UInput v-model="form.fechaFin" type="date" />
        </UFormGroup>
        <UFormGroup label="Motivo de terminación" required>
          <UTextarea
            v-model="form.motivoTerminacion"
            :rows="3"
            placeholder="Ej: el arrendatario entregó el inmueble el 28/08/2026"
          />
        </UFormGroup>

        <UAlert v-if="error" color="red" variant="subtle" :title="error" icon="i-heroicons-exclamation-triangle" />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="emit('update:modelValue', false)">Cancelar</UButton>
          <UButton
            color="red"
            :loading="procesando"
            :disabled="!form.fechaFin || !form.motivoTerminacion.trim()"
            @click="confirmar"
          >
            Terminar contrato
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
