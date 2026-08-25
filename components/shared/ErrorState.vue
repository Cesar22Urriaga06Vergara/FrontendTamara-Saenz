<script setup lang="ts">
/**
 * Estado de error reutilizable para fallos de carga (listados, dashboards, fichas),
 * con acción "Reintentar" — sustituye al `UAlert` estático que antes dejaba al
 * usuario sin más opción que recargar toda la página. No se usa para errores de
 * guardado/envío de formulario (ahí "reintentar" ya es literalmente el mismo botón
 * de enviar, y duplicarlo sería confuso).
 */
withDefaults(
  defineProps<{
    message: string
    retryLabel?: string
    loading?: boolean
  }>(),
  { retryLabel: 'Reintentar' },
)

defineEmits<{ retry: [] }>()
</script>

<template>
  <UAlert color="red" variant="subtle" icon="i-heroicons-exclamation-triangle" :title="message">
    <template #description>
      <UButton
        size="xs"
        color="red"
        variant="soft"
        icon="i-heroicons-arrow-path"
        class="mt-2"
        :loading="loading"
        @click="$emit('retry')"
      >
        {{ retryLabel }}
      </UButton>
    </template>
  </UAlert>
</template>
