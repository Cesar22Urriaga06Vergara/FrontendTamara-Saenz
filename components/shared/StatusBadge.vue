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
  <Transition name="badge-pop" mode="out-in">
    <UBadge :key="entrada.label" :color="entrada.color" variant="subtle" :size="size">{{ entrada.label }}</UBadge>
  </Transition>
</template>

<style scoped>
.badge-pop-enter-active,
.badge-pop-leave-active {
  transition: all 0.15s ease;
}
.badge-pop-enter-from,
.badge-pop-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
