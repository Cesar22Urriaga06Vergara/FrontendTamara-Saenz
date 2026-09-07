<script setup lang="ts">
/**
 * Previsualización del recaudo (Recibos §2): NO ejecuta la operación financiera todavía —
 * el contenido viene 100% de `POST /recaudo/pagos/simular` (mismo cálculo que el pago real,
 * sin persistir nada); solo al confirmar aquí se llama `/recaudo/pagos` de verdad.
 */
const { moneda } = useFormatoCO()

const props = defineProps<{
  modelValue: boolean
  cargando: boolean
  previsualizacion: any | null
  dejarExcedenteComoSaldoFavor: boolean
  registrando: boolean
}>()

defineEmits<{ 'update:modelValue': [boolean]; confirmar: [] }>()

// Canon/Novedad se distinguen por `obligacion.tipo`.
const totales = computed(() => {
  const acc = { canon: 0, novedad: 0 }
  for (const a of props.previsualizacion?.aplicaciones ?? []) {
    const monto = Number(a.monto || 0)
    if (a.obligacion?.tipo === 'NOVEDAD') acc.novedad += monto
    else acc.canon += monto
  }
  return acc
})
</script>

<template>
  <UModal
    :model-value="modelValue"
    :ui="{ width: 'sm:max-w-xl' }"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <UCard>
      <template #header>
        <p class="font-semibold text-slate-900">Previsualización del recaudo</p>
      </template>

      <Transition name="fade" mode="out-in">
        <div v-if="cargando" key="cargando" class="text-center py-10 text-slate-500">Calculando aplicación…</div>

        <div v-else-if="previsualizacion" key="resultado" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <p><span class="text-slate-500">Cliente:</span> {{ previsualizacion.contrato?.cliente?.nombreCompleto }}</p>
            <p><span class="text-slate-500">Inmueble:</span> {{ previsualizacion.contrato?.inmueble?.direccion }}</p>
            <p><span class="text-slate-500">Barrio:</span> {{ previsualizacion.contrato?.inmueble?.barrio || '—' }}</p>
            <p>
              <span class="text-slate-500">Monto recibido:</span>
              <span class="font-semibold tabular-nums text-slate-900">{{
                moneda(previsualizacion.valorTotalPago)
              }}</span>
            </p>
            <p class="sm:col-span-2">
              <span class="text-slate-500">Medio de pago:</span>
              {{
                previsualizacion.detallesPago
                  .map((d: any) => (d.medioPago === 'EFECTIVO' ? 'Efectivo' : 'Transferencia'))
                  .join(' + ')
              }}
            </p>
          </div>

          <div>
            <p class="text-sm font-medium text-slate-900 mb-2">Aplicación del dinero (Canon → Novedad)</p>
            <p v-if="!previsualizacion.aplicaciones.length" class="text-sm text-slate-400">
              El pago no alcanza a aplicarse a ninguna obligación pendiente.
            </p>
            <template v-else>
              <RecaudoResumenAplicaciones :totales="totales" class="mb-3" />
              <div class="overflow-x-auto rounded-lg border border-slate-500">
                <table class="min-w-full border-collapse text-sm">
                  <thead>
                    <tr class="text-slate-700">
                      <th class="border border-slate-400 px-2 py-1.5 text-center">Concepto</th>
                      <th class="border border-slate-400 px-2 py-1.5 text-center">Aplicado</th>
                      <th class="border border-slate-400 px-2 py-1.5 text-center">Saldo posterior</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(a, i) in previsualizacion.aplicaciones" :key="i" class="even:bg-slate-50">
                      <td class="border border-slate-400 px-2 py-1.5 text-slate-700">{{ a.obligacion?.concepto }}</td>
                      <td class="border border-slate-400 px-2 py-1.5 text-right tabular-nums text-slate-900">
                        {{ moneda(a.monto) }}
                      </td>
                      <td class="border border-slate-400 px-2 py-1.5 text-right tabular-nums text-slate-600">
                        {{ moneda(a.saldoPosterior) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </div>

          <UAlert
            v-if="Number(previsualizacion.excedente) > 0"
            color="amber"
            variant="subtle"
            :title="
              dejarExcedenteComoSaldoFavor
                ? `${moneda(previsualizacion.excedente)} quedarán como saldo a favor del contrato`
                : `Cambio a entregar: ${moneda(previsualizacion.excedente)}`
            "
          />
        </div>
      </Transition>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="$emit('update:modelValue', false)">Cancelar</UButton>
          <UButton
            color="amber"
            :loading="registrando"
            :disabled="cargando || !previsualizacion"
            @click="$emit('confirmar')"
          >
            Confirmar y generar recibo
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
