<script setup lang="ts">
/**
 * Placeholder de carga reutilizable — sustituye al texto plano "Cargando…" que se repetía
 * idéntico en tarjetas de saldo, fichas y paneles sin `<UTable>` (que sí trae su propio
 * spinner nativo vía `:loading`). Con `lines > 1` simula varias filas (ej. un panel de lista).
 */
withDefaults(defineProps<{ lines?: number; widthClass?: string }>(), { lines: 1, widthClass: 'w-24' })
</script>

<template>
  <div class="space-y-1.5" role="status" aria-label="Cargando">
    <div
      v-for="i in lines"
      :key="i"
      class="h-4 animate-pulse rounded bg-slate-200"
      :class="i === lines ? widthClass : 'w-full'"
    />
  </div>
</template>
