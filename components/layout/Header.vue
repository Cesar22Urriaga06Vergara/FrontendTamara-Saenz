<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

const auth = useAuthStore()
const cerrandoSesion = ref(false)
const route = useRoute()
const titulo = useTituloPagina()
const breadcrumb = useBreadcrumbPagina()
const sidebarAbierto = useSidebarMovil()

// Limpia el override dinámico (ej. "Recibo R-0001") al cambiar de ruta, para que no
// quede pegado al título de la siguiente página antes de que esta fije el suyo propio.
watch(
  () => route.path,
  () => (useTituloPaginaOverride().value = null),
)

async function salir() {
  cerrandoSesion.value = true
  await auth.cerrarSesion()
  await navigateTo('/login')
  cerrandoSesion.value = false
}
</script>

<template>
  <header
    class="h-16 flex items-center justify-between px-4 sm:px-6 bg-white border-b border-slate-200 sticky top-0 z-10"
  >
    <div class="min-w-0 flex items-center gap-2">
      <UButton
        icon="i-heroicons-bars-3"
        color="gray"
        variant="ghost"
        class="lg:hidden shrink-0"
        aria-label="Abrir menú"
        @click="sidebarAbierto = true"
      />
      <div class="min-w-0">
        <nav v-if="breadcrumb.length" class="flex items-center gap-1 text-xs text-slate-500 truncate">
          <template v-for="(item, i) in breadcrumb" :key="i">
            <NuxtLink v-if="item.to" :to="item.to" class="hover:text-amber-600">{{ item.label }}</NuxtLink>
            <span v-else>{{ item.label }}</span>
            <UIcon name="i-heroicons-chevron-right" class="w-3 h-3 shrink-0" />
          </template>
        </nav>
        <h1 class="text-lg font-semibold text-slate-900 truncate">{{ titulo }}</h1>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <UBadge :color="auth.esAdministrador ? 'amber' : 'gray'" variant="subtle">
        {{ auth.rol }}
      </UBadge>
      <UButton
        color="gray"
        variant="ghost"
        icon="i-heroicons-arrow-right-on-rectangle"
        :loading="cerrandoSesion"
        @click="salir"
      >
        Salir
      </UButton>
    </div>
  </header>
</template>
