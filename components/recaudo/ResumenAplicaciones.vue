<script setup lang="ts">
/**
 * Resumen visual de a qué se aplicó el dinero, agrupado en el orden de aplicación del sistema
 * (Canon → Novedad, ver ObligacionesService/RecaudoService) — complementa (no reemplaza) la
 * tabla detallada línea por línea que ya existe en Recaudo y en el detalle de Recibo.
 */
const { moneda } = useFormatoCO()

defineProps<{ totales: { canon: number; novedad: number } }>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <div class="rounded-lg border border-slate-300 p-3">
      <p class="text-xs text-slate-500">Canon</p>
      <p class="text-lg font-semibold tabular-nums text-slate-900">{{ moneda(totales.canon) }}</p>
    </div>
    <div class="rounded-lg border border-slate-300 p-3">
      <p class="text-xs text-slate-500">Novedad</p>
      <p class="text-lg font-semibold tabular-nums text-slate-900">{{ moneda(totales.novedad) }}</p>
    </div>
  </div>
</template>
