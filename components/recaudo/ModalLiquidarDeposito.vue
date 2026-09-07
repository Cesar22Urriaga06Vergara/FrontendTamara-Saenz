<script setup lang="ts">
/**
 * Liquidación de depósito de garantía (contrato ya TERMINADO) — DEP-01: los descuentos van
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
  depositoGarantia: number
  valorADevolver: number
  medios: string[]
  // `_key` es opcional: este modal también lo usa `pages/depositos/index.vue`, que no lo
  // provee (ahí el orden de filas nunca cambia dinámicamente) — cuando falta, la plantilla usa
  // el índice del `v-for` como antes, sin animación de entrada/salida pero sin romper nada.
  descuentos: Array<{ _key?: number; concepto: string; valor: number; tipo?: 'GENERAL' | 'DEUDA' }>
  form: { medioPago: string; referencia: string; observaciones: string }
  liquidando: boolean
}>()

defineEmits<{ 'update:modelValue': [boolean]; confirmar: [] }>()

// `_key` solo identifica la fila para el `TransitionGroup` de abajo — nunca viaja al backend
// (el padre reconstruye el objeto que sí se envía, solo con concepto/valor/tipo). Se deriva del
// máximo ya presente en el arreglo (en vez de un contador propio del componente) para no
// colisionar con el contador del padre, que crea la fila inicial y la del reset al abrir.
function agregarDescuento() {
  const siguiente = props.descuentos.reduce((max, d) => Math.max(max, d._key ?? 0), 0) + 1
  props.descuentos.push({ _key: siguiente, concepto: '', valor: 0, tipo: 'GENERAL' })
}

function quitarDescuento(i: number) {
  props.descuentos.splice(i, 1)
}
</script>

<template>
  <UModal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <UCard>
      <template #header>
        <p class="font-semibold text-slate-900">Liquidar depósito de garantía</p>
      </template>
      <div class="space-y-3">
        <p class="text-sm text-slate-600">
          Depósito de garantía disponible:
          <span class="font-medium tabular-nums">{{ moneda(depositoGarantia) }}</span>
        </p>

        <p class="text-sm font-medium text-slate-900">Descuentos (opcional)</p>
        <TransitionGroup name="fila" tag="div" class="space-y-3">
          <div
            v-for="(descuento, i) in descuentos"
            :key="descuento._key ?? i"
            class="flex flex-col gap-2 sm:flex-row sm:items-end"
          >
            <div class="flex-1">
              <label class="mb-1 block text-xs text-slate-500 sm:hidden">Concepto</label>
              <UInput v-model="descuento.concepto" placeholder="Concepto (ej: Aseo general)" class="w-full" />
            </div>
            <div class="w-full sm:w-32">
              <label class="mb-1 block text-xs text-slate-500 sm:hidden">Valor</label>
              <UiMoneyInput v-model="descuento.valor" placeholder="Valor" class="w-full" />
            </div>
            <div class="w-full sm:w-40">
              <label class="mb-1 block text-xs text-slate-500 sm:hidden">Tipo</label>
              <USelectMenu v-model="descuento.tipo" :options="['GENERAL', 'DEUDA']" class="w-full" />
            </div>
            <UButton
              v-if="descuentos.length > 1"
              color="red"
              variant="ghost"
              icon="i-heroicons-trash"
              aria-label="Quitar descuento"
              class="self-end"
              @click="quitarDescuento(i)"
            />
          </div>
        </TransitionGroup>
        <UButton size="xs" variant="soft" icon="i-heroicons-plus" @click="agregarDescuento">
          Agregar descuento
        </UButton>

        <p class="border-t border-slate-200 pt-2 text-sm text-slate-600">
          Valor a devolver (estimado):
          <span class="text-base font-semibold tabular-nums text-slate-900">{{ moneda(valorADevolver) }}</span>
        </p>
        <p v-if="descuentos.some((d) => d.tipo === 'DEUDA' && Number(d.valor) > 0)" class="text-xs text-slate-400">
          Los descuentos por deuda solo bajan de la devolución lo que alcanzan a abonar; el neto final lo confirma el
          sistema al liquidar.
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
          <UButton
            color="amber"
            :loading="liquidando"
            :disabled="valorADevolver > 0 && form.medioPago === 'TRANSFERENCIA' && !form.referencia"
            @click="$emit('confirmar')"
          >
            Liquidar
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped>
.fila-enter-active,
.fila-leave-active {
  transition: all 0.2s ease;
}
.fila-enter-from,
.fila-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.fila-leave-active {
  position: absolute;
}
</style>
