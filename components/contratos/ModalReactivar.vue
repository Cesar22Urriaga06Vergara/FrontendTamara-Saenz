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
    <UCard>
      <template #header>
        <p class="font-semibold text-slate-900">Reactivar contrato</p>
        <p v-if="contrato" class="mt-0.5 text-sm text-slate-500">
          {{ contrato.cliente?.nombreCompleto }}
          <span v-if="contrato.inmueble?.direccion"> · {{ contrato.inmueble.direccion }}</span>
        </p>
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
