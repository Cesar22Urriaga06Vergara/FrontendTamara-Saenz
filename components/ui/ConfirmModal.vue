<script setup lang="ts">
/** Modal de confirmación reutilizable para acciones destructivas (ej: baja lógica). */
withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    loading?: boolean
    color?: 'red' | 'amber' | 'emerald' | 'gray'
  }>(),
  { confirmLabel: 'Confirmar', cancelLabel: 'Cancelar', color: 'red' },
)

const emit = defineEmits<{
  'update:modelValue': [boolean]
  confirm: []
  cancel: []
}>()

function cancelar() {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<template>
  <UModal :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <UCard>
      <template #header>
        <p class="font-semibold text-slate-900">{{ title }}</p>
      </template>
      <p class="text-sm text-slate-600">{{ message }}</p>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" :disabled="loading" @click="cancelar">{{ cancelLabel }}</UButton>
          <UButton :color="color" :loading="loading" @click="emit('confirm')">{{ confirmLabel }}</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
