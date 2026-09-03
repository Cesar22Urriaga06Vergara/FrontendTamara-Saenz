<script setup lang="ts">
/** Anulación de una obligación PENDIENTE generada por error (sin ningún abono aplicado). */
/* eslint-disable vue/no-mutating-props */
const { moneda, fecha } = useFormatoCO()

defineProps<{
  modelValue: boolean
  obligacion: any
  form: { motivo: string }
  anulando: boolean
}>()

defineEmits<{ 'update:modelValue': [boolean]; confirmar: [] }>()
</script>

<template>
  <UModal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <UCard>
      <template #header>
        <p class="font-semibold text-slate-900">Anular obligación</p>
      </template>
      <div class="space-y-3">
        <UAlert
          color="red"
          variant="subtle"
          title="Solo úsalo para corregir un error de generación."
          description="La obligación queda marcada ANULADA (no se borra) y deja de aparecer como cartera pendiente. Solo aplica si aún no tiene ningún abono aplicado."
        />
        <div class="text-sm text-slate-600">
          <p>
            <span class="text-slate-500">Concepto:</span> {{ obligacion?.concepto }} —
            <span class="font-medium tabular-nums">{{ moneda(obligacion?.valorOriginal) }}</span>
          </p>
          <p v-if="obligacion?.fechaVencimiento" class="text-xs text-slate-500">
            Vence {{ fecha(obligacion.fechaVencimiento) }}
          </p>
        </div>
        <UFormGroup label="Motivo de la anulación">
          <UTextarea v-model="form.motivo" />
        </UFormGroup>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="$emit('update:modelValue', false)">Cancelar</UButton>
          <UButton color="red" :loading="anulando" :disabled="!form.motivo" @click="$emit('confirmar')">
            Anular obligación
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
