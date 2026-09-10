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
const secciones = computed(() =>
  [
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
        { label: 'Recibos', icon: 'i-heroicons-receipt-percent', to: '/recibos' },
        { label: 'Caja', icon: 'i-heroicons-calculator', to: '/caja', soloAdmin: true },
        { label: 'Cartera', icon: 'i-heroicons-banknotes', to: '/cartera', soloAdmin: true },
        { label: 'Gastos', icon: 'i-heroicons-receipt-refund', to: '/gastos', soloAdmin: true },
        { label: 'Depósitos', icon: 'i-heroicons-lock-closed', to: '/depositos', soloAdmin: true },
      ],
    },
    {
      titulo: 'CONSULTA Y CONTROL',
      items: [
        { label: 'Movimientos', icon: 'i-heroicons-arrows-right-left', to: '/movimientos', soloAdmin: true },
        { label: 'Transferencias', icon: 'i-heroicons-building-library', to: '/transferencias', soloAdmin: true },
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
  ].map((s) => ({ ...s, items: s.items.filter((i) => !i.soloAdmin || auth.esAdministrador) })),
)
</script>

<template>
  <div
    v-if="abierto"
    class="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
    aria-hidden="true"
    @click="abierto = false"
  />

  <aside
    class="fixed inset-y-0 left-0 z-40 flex h-screen w-72 shrink-0 flex-col border-r border-slate-700/80 bg-slate-950 text-slate-100 shadow-[0_30px_80px_-30px_rgba(2,6,23,0.9)] transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:translate-x-0"
    :class="abierto ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="border-b border-slate-700/80 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 px-5 py-5">
      <div class="flex items-center gap-3">
        <div class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
          <img
            v-if="marca.logoSrc.value"
            :src="marca.logoSrc.value"
            alt="Logo"
            class="h-8 w-8 object-contain"
          />
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-base font-semibold tracking-tight text-white">{{ marca.nombre.value }}</p>
          <p class="mt-0.5 truncate text-[11px] italic text-amber-400">{{ marca.slogan.value }}</p>
        </div>
        <UButton
          icon="i-heroicons-x-mark"
          color="gray"
          variant="ghost"
          size="sm"
          class="shrink-0 lg:hidden"
          aria-label="Cerrar menú"
          @click="abierto = false"
        />
      </div>
    </div>

    <nav class="flex-1 space-y-5 overflow-y-auto py-4">
      <div v-for="seccion in secciones" v-show="seccion.items.length" :key="seccion.titulo" class="px-2">
        <p class="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{{ seccion.titulo }}</p>
        <div class="space-y-1">
          <NuxtLink
            v-for="item in seccion.items"
            :key="item.to"
            :to="item.to"
            class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-200 transition-all duration-200 hover:bg-slate-800/80 hover:text-amber-300"
            active-class="bg-gradient-to-r from-amber-500/15 to-slate-800 text-amber-300 ring-1 ring-inset ring-amber-400/40"
          >
            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/80 text-slate-300 transition group-hover:bg-amber-500/15 group-hover:text-amber-300">
              <UIcon :name="item.icon" class="h-4 w-4 shrink-0" />
            </span>
            <span>{{ item.label }}</span>
          </NuxtLink>
        </div>
      </div>
    </nav>

    <div class="border-t border-slate-700/80 bg-slate-900/80 px-4 py-4">
      <p class="truncate text-sm font-medium text-slate-100">{{ auth.usuario?.email }}</p>
      <div class="mt-2 flex items-center justify-between gap-2">
        <p class="text-[10px] uppercase tracking-[0.2em] text-slate-400">{{ auth.rol }}</p>
        <span class="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]"></span>
      </div>
    </div>
  </aside>
</template>
