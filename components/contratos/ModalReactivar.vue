<script setup lang="ts">
/**
 * Modal de reactivación de contrato (TERMINADO → ACTIVO, §6.6 — exclusivo Administrador),
 * compartido por el listado y el detalle. Hace el PATCH y emite `reactivado`.
 */
const props = defineProps<{
  modelValue: boolean
  contrato: { id: string; cliente?: { nombreCompleto?: string }; inmueble?: { direccion?: string } } | null
}>()
const emit = defineEmits<{ 'update:modelValue': [boolean]; reactivado: [] }>()

const motivo = ref('')
const procesando = ref(false)
const error = ref('')

watch(
  () => props.modelValue,
  (abierto) => {
    if (!abierto) return
    motivo.value = ''
    error.value = ''
  },
)

async function confirmar() {
  if (!props.contrato || !motivo.value.trim()) return
  procesando.value = true
  error.value = ''
  try {
    await useApiFetch(`/contratos/${props.contrato.id}/reactivar`, {
      method: 'PATCH',
      body: { motivo: motivo.value.trim() },
    })
    emit('update:modelValue', false)
    emit('reactivado')
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible reactivar el contrato.'
  } finally {
    procesando.value = false
  }
}
</script>

<template>
  <UModal :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <UCard
      :ui="{
        root: 'overflow-hidden rounded-2xl border border-slate-200 shadow-[0_28px_60px_-32px_rgba(15,23,42,0.7)]',
        body: { base: 'p-5 sm:p-6' },
        header: { base: 'border-b border-slate-200 px-0 pb-4' },
        footer: { base: 'border-t border-slate-200 px-0 pt-4' },
      }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
            <UIcon name="i-heroicons-arrow-path" class="h-5 w-5 text-emerald-600" />
          </span>
          <div>
            <p class="font-semibold text-slate-900">Reactivar contrato</p>
            <p v-if="contrato" class="mt-0.5 text-sm text-slate-500">
              {{ contrato.cliente?.nombreCompleto }}
              <span v-if="contrato.inmueble?.direccion"> · {{ contrato.inmueble.direccion }}</span>
            </p>
          </div>
        </div>
      </template>

      <div class="space-y-4">
        <UAlert
          color="emerald"
          variant="subtle"
          icon="i-heroicons-arrow-path"
          title="El contrato vuelve a ACTIVO."
          description="El inmueble vuelve a quedar ocupado. La fecha y el motivo de la terminación original se conservan en el historial."
        />
        <UFormGroup label="Motivo de la reactivación" required>
          <UTextarea v-model="motivo" :rows="3" placeholder="Ej: el arrendatario decidió continuar el arrendamiento" />
        </UFormGroup>
        <UAlert v-if="error" color="red" variant="subtle" :title="error" icon="i-heroicons-exclamation-triangle" />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="emit('update:modelValue', false)">Cancelar</UButton>
          <UButton color="emerald" :loading="procesando" :disabled="!motivo.trim()" @click="confirmar">
            Reactivar contrato
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
