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
  <header class="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 px-4 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:px-6">
    <div class="flex h-16 items-center justify-between gap-3">
      <div class="flex min-w-0 items-center gap-2">
        <UButton
          icon="i-heroicons-bars-3"
          color="gray"
          variant="ghost"
          class="shrink-0 lg:hidden"
          aria-label="Abrir menú"
          @click="sidebarAbierto = true"
        />
        <div class="min-w-0">
          <nav v-if="breadcrumb.length" class="flex items-center gap-1 truncate text-[11px] font-medium text-slate-500">
            <template v-for="(item, i) in breadcrumb" :key="i">
              <NuxtLink v-if="item.to" :to="item.to" class="transition-colors hover:text-amber-600">{{ item.label }}</NuxtLink>
              <span v-else>{{ item.label }}</span>
              <UIcon name="i-heroicons-chevron-right" class="h-3 w-3 shrink-0" />
            </template>
          </nav>
          <h1 class="truncate text-lg font-semibold tracking-tight text-slate-900">{{ titulo }}</h1>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <UBadge
          :color="auth.esAdministrador ? 'amber' : 'gray'"
          variant="subtle"
          class="hidden sm:inline-flex"
        >
          {{ auth.rol }}
        </UBadge>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-arrow-right-on-rectangle"
          :loading="cerrandoSesion"
          class="font-medium text-slate-700 hover:text-slate-900"
          @click="salir"
        >
          Salir
        </UButton>
      </div>
    </div>
  </header>
</template>
