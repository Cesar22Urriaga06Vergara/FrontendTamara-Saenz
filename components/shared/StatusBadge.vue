<script setup lang="ts">
/**
 * Badge de estado centralizado: resuelve color + etiqueta desde `useEstados`
 * en vez de que cada página mantenga su propio mapa `estadoColor`. Siempre
 * combina color + texto (nunca depende solo del color, por accesibilidad).
 */
const props = withDefaults(
  defineProps<{
    domain: string
    value: string | boolean | null | undefined
    size?: 'xs' | 'sm' | 'md' | 'lg'
  }>(),
  { size: undefined },
)

const entrada = computed(() => resolverEstado(props.domain, props.value))
</script>

<template>
  <UBadge :color="entrada.color" variant="subtle" :size="size">{{ entrada.label }}</UBadge>
</template>
