<script setup lang="ts">
/**
 * Liquidación de depósito en custodia (contrato ya TERMINADO) — DEP-01: los descuentos van
 * desglosados por concepto/valor (no un número agregado), y la devolución exige medio de pago
 * cuando efectivamente queda saldo por devolver.
 *
 * `descuentos`/`form` son los objetos `reactive()` que ya viven en el padre — se pasan por
 * referencia a propósito (mismo patrón que `PersonasFormularioPersona`), por eso se mutan
 * aquí directamente en vez de emitir un evento por campo.
 */
/* eslint-disable vue/no-mutating-props */
const { moneda } = useFormatoCO()

const props = defineProps<{
  modelValue: boolean
  depositoCustodia: number
  valorADevolver: number
  medios: string[]
  descuentos: Array<{ concepto: string; valor: number }>
  form: { medioPago: string; referencia: string; observaciones: string }
  liquidando: boolean
}>()

defineEmits<{ 'update:modelValue': [boolean]; confirmar: [] }>()

function agregarDescuento() {
  props.descuentos.push({ concepto: '', valor: 0 })
}

function quitarDescuento(i: number) {
  props.descuentos.splice(i, 1)
}
</script>

<template>
  <UModal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <UCard>
      <template #header>
        <p class="font-semibold text-slate-900">Liquidar depósito en custodia</p>
      </template>
      <div class="space-y-3">
        <p class="text-sm text-slate-600">
          Depósito en custodia disponible: <span class="font-medium">{{ moneda(depositoCustodia) }}</span>
        </p>

        <p class="text-sm font-medium text-slate-900">Descuentos (opcional)</p>
        <div v-for="(descuento, i) in descuentos" :key="i" class="flex gap-2 items-center">
          <UInput v-model="descuento.concepto" placeholder="Concepto (ej: Aseo general)" class="flex-1" />
          <UiMoneyInput v-model="descuento.valor" placeholder="Valor" class="w-32" />
          <UButton
            v-if="descuentos.length > 1"
            color="red"
            variant="ghost"
            icon="i-heroicons-trash"
            aria-label="Quitar descuento"
            @click="quitarDescuento(i)"
          />
        </div>
        <UButton size="xs" variant="soft" icon="i-heroicons-plus" @click="agregarDescuento">
          Agregar descuento
        </UButton>

        <p class="text-sm text-slate-600 pt-2 border-t">
          Valor a devolver: <span class="font-semibold text-slate-900">{{ moneda(valorADevolver) }}</span>
        </p>

        <template v-if="valorADevolver > 0">
          <UFormGroup label="Medio de pago de la devolución">
            <USelectMenu v-model="form.medioPago" :options="medios" />
          </UFormGroup>
          <UFormGroup v-if="form.medioPago === 'TRANSFERENCIA'" label="Referencia">
            <UInput v-model="form.referencia" placeholder="Número de transacción" />
          </UFormGroup>
        </template>

        <UFormGroup label="Observaciones (opcional)">
          <UTextarea v-model="form.observaciones" />
        </UFormGroup>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="$emit('update:modelValue', false)">Cancelar</UButton>
          <UButton color="amber" :loading="liquidando" @click="$emit('confirmar')">Liquidar</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
