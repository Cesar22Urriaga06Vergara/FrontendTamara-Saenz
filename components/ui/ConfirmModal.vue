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

// Mapas explícitos (no interpolación de string tipo `text-${color}-500`): Tailwind JIT solo
// genera en el build las clases que aparecen como literales completos en el código.
const ICONO_POR_COLOR: Record<'red' | 'amber' | 'emerald' | 'gray', string> = {
  red: 'i-heroicons-exclamation-triangle',
  amber: 'i-heroicons-exclamation-triangle',
  emerald: 'i-heroicons-check-circle',
  gray: 'i-heroicons-information-circle',
}
const CLASE_ICONO_POR_COLOR: Record<'red' | 'amber' | 'emerald' | 'gray', string> = {
  red: 'text-red-500',
  amber: 'text-amber-500',
  emerald: 'text-emerald-500',
  gray: 'text-slate-500',
}

function cancelar() {
  emit('cancel')
  emit('update:modelValue', false)
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
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <UIcon :name="ICONO_POR_COLOR[color]" class="h-5 w-5 shrink-0" :class="CLASE_ICONO_POR_COLOR[color]" />
          </span>
          <p class="font-semibold text-slate-900">{{ title }}</p>
        </div>
      </template>
      <p class="text-sm leading-6 text-slate-600">{{ message }}</p>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" :disabled="loading" @click="cancelar">{{ cancelLabel }}</UButton>
          <UButton :color="color" :loading="loading" @click="emit('confirm')">{{ confirmLabel }}</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
