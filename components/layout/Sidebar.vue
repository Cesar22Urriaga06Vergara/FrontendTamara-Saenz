<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

const auth = useAuthStore()
const marca = useMarcaEmpresa()
const route = useRoute()
const abierto = useSidebarMovil()

// Cerrar el drawer al navegar (en desktop este estado no se usa, ver clases del <aside>).
watch(
  () => route.path,
  () => (abierto.value = false),
)

/**
 * Menú oficial (sección 5 del prompt): GENERAL, OPERACIÓN, DIRECTORIOS,
 * CONSULTA Y CONTROL, ADMINISTRACIÓN. Los ítems marcados soloAdmin se ocultan
 * completamente para el rol Recepcionista (no solo se deshabilitan).
 */
const secciones = computed(() => [
  {
    titulo: 'GENERAL',
    items: [{ label: 'Dashboard', icon: 'i-heroicons-squares-2x2', to: '/dashboard' }],
  },
  {
    titulo: 'OPERACIÓN',
    items: [
      { label: 'Contratos', icon: 'i-heroicons-document-text', to: '/contratos' },
      { label: 'Recaudo', icon: 'i-heroicons-banknotes', to: '/recaudo', soloAdmin: true },
      { label: 'Novedades', icon: 'i-heroicons-wrench-screwdriver', to: '/novedades' },
    ],
  },
  {
    titulo: 'DIRECTORIOS',
    items: [
      { label: 'Clientes', icon: 'i-heroicons-user-group', to: '/clientes' },
      { label: 'Codeudores', icon: 'i-heroicons-user-plus', to: '/codeudores' },
      { label: 'Inmuebles', icon: 'i-heroicons-building-office-2', to: '/inmuebles' },
    ],
  },
  {
    titulo: 'FINANZAS',
    items: [
      { label: 'Recibos', icon: 'i-heroicons-receipt-percent', to: '/recibos', soloAdmin: true },
      { label: 'Caja', icon: 'i-heroicons-calculator', to: '/caja', soloAdmin: true },
    ],
  },
  {
    titulo: 'CONSULTA Y CONTROL',
    items: [
      { label: 'Movimientos', icon: 'i-heroicons-arrows-right-left', to: '/movimientos', soloAdmin: true },
      { label: 'Reportes', icon: 'i-heroicons-chart-bar', to: '/reportes', soloAdmin: true },
      { label: 'Auditoría', icon: 'i-heroicons-shield-check', to: '/auditoria', soloAdmin: true },
    ],
  },
  {
    titulo: 'ADMINISTRACIÓN',
    items: [
      { label: 'Usuarios', icon: 'i-heroicons-cog-6-tooth', to: '/administracion', soloAdmin: true },
      { label: 'Configuración', icon: 'i-heroicons-cog-6-tooth', to: '/configuracion', soloAdmin: true },
    ],
  },
].map((s) => ({ ...s, items: s.items.filter((i) => !i.soloAdmin || auth.esAdministrador) })))
</script>

<template>
  <!-- Fondo del drawer: solo existe (y solo importa) por debajo de `lg`, donde el aside pasa
       de estar fijo en el layout a superponerse como overlay. -->
  <div
    v-if="abierto"
    class="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
    aria-hidden="true"
    @click="abierto = false"
  />

  <aside
    class="fixed inset-y-0 left-0 z-40 h-screen w-64 shrink-0 bg-slate-700 text-white flex flex-col transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:translate-x-0"
    :class="abierto ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="px-5 py-6 border-b border-slate-600/60 flex items-center gap-3">
      <img v-if="marca.logoSrc.value" :src="marca.logoSrc.value" alt="Logo" class="h-9 w-9 object-contain rounded shrink-0" />
      <div class="min-w-0 flex-1">
        <p class="font-bold text-lg leading-tight text-white truncate">{{ marca.nombre.value }}</p>
        <p class="text-xs text-amber-500 italic mt-0.5 truncate">{{ marca.slogan.value }}</p>
      </div>
      <UButton
        icon="i-heroicons-x-mark"
        color="gray"
        variant="ghost"
        size="sm"
        class="lg:hidden shrink-0"
        aria-label="Cerrar menú"
        @click="abierto = false"
      />
    </div>

    <nav class="flex-1 overflow-y-auto py-4 space-y-6">
      <div v-for="seccion in secciones" :key="seccion.titulo" v-show="seccion.items.length">
        <p class="px-5 mb-2 text-[11px] font-semibold tracking-wider text-slate-400">{{ seccion.titulo }}</p>
        <NuxtLink
          v-for="item in seccion.items"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-100 hover:bg-slate-600/60 hover:text-amber-500 transition-colors"
          active-class="bg-slate-900 text-amber-500 border-r-2 border-amber-600"
        >
          <UIcon :name="item.icon" class="w-5 h-5" />
          {{ item.label }}
        </NuxtLink>
      </div>
    </nav>

    <div class="px-5 py-4 border-t border-slate-600/60 text-xs text-slate-400">
      <p class="text-slate-200 font-medium">{{ auth.usuario?.email }}</p>
      <p>{{ auth.rol }}</p>
    </div>
  </aside>
</template>
