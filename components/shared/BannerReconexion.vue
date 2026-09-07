<script setup lang="ts">
/**
 * Aviso global de conectividad. `useApiFetch` reintenta ante cortes de red/backend caído en
 * vez de propagar el error o cerrar la sesión — este banner es lo único que el usuario ve
 * mientras tanto, para que sepa que el sistema sigue trabajando y no perdió su sesión.
 */
const { estado } = useEstadoConexion()
</script>

<template>
  <Transition name="fade">
    <div
      v-if="estado !== 'en-linea'"
      class="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white"
      :class="estado === 'reconectando' ? 'bg-amber-500' : 'bg-red-600'"
    >
      <UIcon
        :name="estado === 'reconectando' ? 'i-heroicons-arrow-path' : 'i-heroicons-signal-slash'"
        class="h-4 w-4"
        :class="{ 'animate-spin': estado === 'reconectando' }"
      />
      <span>{{
        estado === 'reconectando'
          ? 'Reconectando…'
          : 'Sin conexión. Cuando vuelva el internet se reanuda solo — no perdiste nada.'
      }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
