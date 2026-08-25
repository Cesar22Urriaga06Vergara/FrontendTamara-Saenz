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

function etiquetaConcepto(aplicacion: any): string {
  return aplicacion.concepto === 'MORA' ? 'Mora' : 'Capital'
}

// Canon/Novedad se distinguen por `obligacion.tipo` (el `concepto` de la aplicación solo dice
// CAPITAL/MORA, no a qué tipo de obligación se aplicó ese capital).
const totales = computed(() => {
  const acc = { canon: 0, novedad: 0, mora: 0 }
  for (const a of props.previsualizacion?.aplicaciones ?? []) {
    const monto = Number(a.monto || 0)
    if (a.concepto === 'MORA') acc.mora += monto
    else if (a.obligacion?.tipo === 'NOVEDAD') acc.novedad += monto
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

      <div v-if="cargando" class="text-center py-10 text-slate-500">Calculando aplicación…</div>

      <div v-else-if="previsualizacion" class="space-y-4">
        <div class="grid grid-cols-2 gap-2 text-sm">
          <p><span class="text-slate-500">Cliente:</span> {{ previsualizacion.contrato?.cliente?.nombreCompleto }}</p>
          <p><span class="text-slate-500">Inmueble:</span> {{ previsualizacion.contrato?.inmueble?.direccion }}</p>
          <p>
            <span class="text-slate-500">Monto recibido:</span>
            <span class="font-semibold text-slate-900">{{ moneda(previsualizacion.valorTotalPago) }}</span>
          </p>
          <p>
            <span class="text-slate-500">Medio de pago:</span>
            {{
              previsualizacion.detallesPago
                .map((d: any) => (d.medioPago === 'EFECTIVO' ? 'Efectivo' : 'Transferencia'))
                .join(' + ')
            }}
          </p>
        </div>

        <div>
          <p class="text-sm font-medium text-slate-900 mb-2">Aplicación del dinero (Canon → Novedad → Mora)</p>
          <p v-if="!previsualizacion.aplicaciones.length" class="text-sm text-slate-400">
            El pago no alcanza a aplicarse a ninguna obligación pendiente.
          </p>
          <template v-else>
            <RecaudoResumenAplicaciones :totales="totales" class="mb-3" />
            <table class="w-full text-sm">
              <thead>
                <tr class="text-left text-slate-500 border-b">
                  <th class="py-1.5 pr-2">Concepto</th>
                  <th class="py-1.5 pr-2">Tipo</th>
                  <th class="py-1.5 pr-2 text-right">Aplicado</th>
                  <th class="py-1.5 text-right">Saldo posterior</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(a, i) in previsualizacion.aplicaciones" :key="i" class="border-b last:border-0">
                  <td class="py-1.5 pr-2 text-slate-900">{{ a.obligacion?.concepto }}</td>
                  <td class="py-1.5 pr-2">
                    <UBadge :color="a.concepto === 'MORA' ? 'red' : 'gray'" variant="subtle" size="xs">{{
                      etiquetaConcepto(a)
                    }}</UBadge>
                  </td>
                  <td class="py-1.5 pr-2 text-right text-slate-900">{{ moneda(a.monto) }}</td>
                  <td class="py-1.5 text-right text-slate-600">{{ moneda(a.saldoPosterior) }}</td>
                </tr>
              </tbody>
            </table>
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
