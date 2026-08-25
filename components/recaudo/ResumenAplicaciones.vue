<script setup lang="ts">
/**
 * Resumen visual de a qué se aplicó el dinero, agrupado en las 3 categorías del orden de
 * aplicación del sistema (Canon → Novedad → Mora, ver ObligacionesService/RecaudoService) —
 * complementa (no reemplaza) la tabla detallada línea por línea que ya existe en Recaudo y en
 * el detalle de Recibo.
 */
const { moneda } = useFormatoCO()

defineProps<{ totales: { canon: number; novedad: number; mora: number } }>()
</script>

<template>
  <div class="grid grid-cols-3 gap-3">
    <div class="rounded-lg border border-slate-200 p-3">
      <p class="text-xs text-slate-500">Canon</p>
      <p class="text-lg font-semibold text-slate-900">{{ moneda(totales.canon) }}</p>
    </div>
    <div class="rounded-lg border border-slate-200 p-3">
      <p class="text-xs text-slate-500">Novedad</p>
      <p class="text-lg font-semibold text-slate-900">{{ moneda(totales.novedad) }}</p>
    </div>
    <div class="rounded-lg border border-red-200 bg-red-50 p-3">
      <p class="text-xs text-red-600">Mora</p>
      <p class="text-lg font-semibold text-red-700">{{ moneda(totales.mora) }}</p>
    </div>
  </div>
</template>
