<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

/**
 * Dashboard: panel de aterrizaje compacto — KPIs + accesos rápidos + lo que necesita
 * atención hoy. Todo se arma con endpoints que ya existían para otras pantallas
 * (dashboard, novedades, recibos, depósitos); no se agregó ningún endpoint de agregación
 * nuevo, así que no hay gráficos ni "próximos vencimientos" globales.
 */
const auth = useAuthStore()
const { moneda, fecha } = useFormatoCO()

const cargando = ref(true)
const error = ref('')
const metricas = ref({
  carteraTotal: 0,
  contratosActivos: 0,
  novedadesAbiertas: 0,
  recaudoMesActual: 0,
})

async function cargar() {
  cargando.value = true
  try {
    const operativas = await useApiFetch<any>('/dashboard')
    metricas.value = { ...metricas.value, ...operativas }

    // Las cifras de dinero viven en un endpoint separado, protegido con @Roles(ADMINISTRADOR)
    // en el backend — solo se consulta si el usuario es Administrador.
    if (auth.esAdministrador) {
      const financieras = await useApiFetch<any>('/dashboard/financiero')
      metricas.value = { ...metricas.value, ...financieras }
    }
    error.value = ''
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible cargar las métricas del dashboard.'
  } finally {
    cargando.value = false
  }
}

// ---- Tiles de KPI (clicables hacia su módulo) ----
const tiles = computed(() => {
  const t: Array<{
    label: string
    valor: string | number
    icon: string
    chip: string
    valorClase: string
    to: string
    ayuda?: string
  }> = [
    {
      label: 'Contratos activos',
      valor: metricas.value.contratosActivos,
      icon: 'i-heroicons-document-text',
      chip: 'bg-slate-100 text-slate-600',
      valorClase: 'text-slate-900',
      to: '/contratos',
    },
  ]
  if (auth.esAdministrador) {
    t.push(
      {
        label: 'Cartera total',
        valor: moneda(metricas.value.carteraTotal),
        icon: 'i-heroicons-banknotes',
        chip: 'bg-amber-50 text-amber-600',
        valorClase: 'text-amber-600',
        to: '/cartera',
        ayuda: 'Saldo de capital vencido por cobrar.',
      },
      {
        label: 'Recaudo mes actual',
        valor: moneda(metricas.value.recaudoMesActual),
        icon: 'i-heroicons-arrow-trending-up',
        chip: 'bg-emerald-50 text-emerald-600',
        valorClase: 'text-emerald-600',
        to: '/recaudo',
      },
    )
  }
  t.push({
    label: 'Novedades abiertas',
    valor: metricas.value.novedadesAbiertas,
    icon: 'i-heroicons-wrench-screwdriver',
    chip: 'bg-orange-50 text-orange-600',
    valorClase: 'text-orange-600',
    to: '/novedades',
  })
  return t
})

// ---- Requiere tu atención (EXCLUSIVO Administrador) ----
const atencion = ref({ depositosPendientes: 0, gastosSinPagar: 0 })

async function cargarAtencion() {
  if (!auth.esAdministrador) return
  try {
    // `total` del listado paginado = conteo, sin traer las filas (limit: 1).
    const [dep, gastos] = await Promise.all([
      useApiFetch<any>('/recaudo/depositos/pendientes', { params: { limit: 1 } }),
      useApiFetch<any>('/novedades', {
        params: { impactoFinanciero: 'GASTO_INMOBILIARIA', gastoPagado: false, limit: 1 },
      }),
    ])
    atencion.value = { depositosPendientes: dep.total ?? 0, gastosSinPagar: gastos.total ?? 0 }
  } catch {
    // Widget secundario — un fallo aquí no debe tapar el resto del dashboard.
  }
}

const filasAtencion = computed(() => [
  {
    label: 'Depósitos por liquidar',
    n: atencion.value.depositosPendientes,
    to: '/depositos',
    icon: 'i-heroicons-lock-closed',
  },
  {
    label: 'Gastos aprobados sin pagar',
    n: atencion.value.gastosSinPagar,
    to: '/gastos',
    icon: 'i-heroicons-receipt-refund',
  },
  {
    label: 'Novedades abiertas',
    n: metricas.value.novedadesAbiertas,
    to: '/novedades',
    icon: 'i-heroicons-wrench-screwdriver',
  },
])

// ---- Novedades abiertas recientes (visible para ambos roles) ----
const cargandoNovedades = ref(true)
const novedadesRecientes = ref<any[]>([])

async function cargarNovedadesRecientes() {
  cargandoNovedades.value = true
  try {
    // La tarjeta de métrica cuenta ABIERTA + EN_SEGUIMIENTO (ver dashboard.service.ts), pero
    // el endpoint /novedades solo filtra por un único estado a la vez — se piden ambos por
    // separado y se combinan aquí para que la lista no excluya EN_SEGUIMIENTO silenciosamente.
    const [abiertas, enSeguimiento] = await Promise.all([
      useApiFetch<any>('/novedades', { params: { estado: 'ABIERTA', limit: 5 } }),
      useApiFetch<any>('/novedades', { params: { estado: 'EN_SEGUIMIENTO', limit: 5 } }),
    ])
    novedadesRecientes.value = [...abiertas.data, ...enSeguimiento.data]
      .sort((a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime())
      .slice(0, 5)
  } catch {
    // Widget secundario — un fallo aquí no debe tapar el resto del dashboard con un error.
  } finally {
    cargandoNovedades.value = false
  }
}

// ---- Últimos recibos emitidos (EXCLUSIVO Administrador, mismo endpoint de pages/recibos) ----
const cargandoRecibos = ref(false)
const recibosRecientes = ref<any[]>([])

async function cargarRecibosRecientes() {
  if (!auth.esAdministrador) return
  cargandoRecibos.value = true
  try {
    const data = await useApiFetch<any>('/recaudo/recibos', { params: { estado: 'EMITIDO', limit: 5 } })
    recibosRecientes.value = data.data
  } catch {
    // Igual que arriba: widget secundario, no bloquea el dashboard.
  } finally {
    cargandoRecibos.value = false
  }
}

onMounted(() => {
  cargar()
  cargarAtencion()
  cargarNovedadesRecientes()
  cargarRecibosRecientes()
})
</script>

<template>
  <div class="space-y-6">
    <SharedErrorState v-if="error" :message="error" :loading="cargando" @retry="cargar" />

    <header class="surface-card overflow-hidden px-5 py-4 sm:px-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Panel operativo</p>
          <h2 class="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h2>
        </div>
        <div class="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600">
          <span class="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Sistema activo
        </div>
      </div>
    </header>

    <div class="grid grid-cols-2 gap-3" :class="auth.esAdministrador ? 'lg:grid-cols-4' : 'sm:max-w-2xl'">
      <NuxtLink
        v-for="tile in tiles"
        :key="tile.label"
        :to="tile.to"
        :title="tile.ayuda"
        class="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-[0_20px_36px_-24px_rgba(217,119,6,0.45)]"
      >
        <div class="flex items-center justify-between gap-3">
          <div class="shrink-0 rounded-xl p-2.5" :class="tile.chip">
            <UIcon :name="tile.icon" class="h-5 w-5" />
          </div>
          <span class="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
            Módulo
          </span>
        </div>
        <div class="mt-4 min-w-0">
          <p class="text-xs font-medium text-slate-500">{{ tile.label }}</p>
          <p class="mt-1 text-xl font-bold leading-tight tabular-nums text-slate-900" :class="tile.valorClase">
            {{ tile.valor }}
          </p>
        </div>
      </NuxtLink>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_12px_28px_-30px_rgba(15,23,42,0.75)]">
      <div class="flex flex-wrap items-center gap-2">
        <span class="mr-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Accesos rápidos</span>
        <UButton size="sm" color="amber" icon="i-heroicons-document-plus" to="/contratos/nuevo" class="!rounded-xl">Nuevo contrato</UButton>
        <UButton size="sm" color="gray" variant="soft" icon="i-heroicons-wrench-screwdriver" to="/novedades/nueva" class="!rounded-xl">
          Registrar novedad
        </UButton>
        <UButton size="sm" color="gray" variant="soft" icon="i-heroicons-user-plus" to="/clientes" class="!rounded-xl">Clientes</UButton>
        <UButton size="sm" color="gray" variant="soft" icon="i-heroicons-building-office-2" to="/inmuebles" class="!rounded-xl">
          Inmuebles
        </UButton>
        <UButton
          v-if="auth.esAdministrador"
          size="sm"
          color="gray"
          variant="soft"
          icon="i-heroicons-banknotes"
          to="/recaudo"
          class="!rounded-xl"
        >
          Recaudo
        </UButton>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <div v-if="auth.esAdministrador" class="surface-card p-4">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-slate-900">Requiere tu atención</p>
            <p class="text-xs text-slate-500">Tareas con impacto operativo</p>
          </div>
          <span class="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-700">
            {{ filasAtencion.filter((fila) => fila.n > 0).length }} pendientes
          </span>
        </div>
        <ul class="space-y-2">
          <li v-for="fila in filasAtencion" :key="fila.label">
            <NuxtLink
              :to="fila.to"
              class="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 transition hover:border-amber-200 hover:bg-amber-50/40"
            >
              <span class="flex items-center gap-2 text-sm text-slate-700" :class="fila.n > 0 ? 'text-slate-800' : 'text-slate-400'">
                <UIcon :name="fila.icon" class="h-4 w-4 shrink-0" />
                {{ fila.label }}
              </span>
              <span
                v-if="fila.n > 0"
                class="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold tabular-nums text-amber-800"
              >
                {{ fila.n }}
              </span>
              <span v-else class="shrink-0 text-xs text-slate-400">Sin pendientes</span>
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div class="surface-card p-4">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-slate-900">Novedades abiertas</p>
            <p class="text-xs text-slate-500">Seguimiento de operación</p>
          </div>
          <NuxtLink to="/novedades" class="text-xs font-medium text-amber-600 hover:underline">Ver todas</NuxtLink>
        </div>
        <SharedSkeletonText v-if="cargandoNovedades" :lines="3" class="py-2" />
        <div v-else-if="!novedadesRecientes.length" class="flex min-h-[140px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center text-sm text-slate-400">
          <UIcon name="i-heroicons-check-circle" class="mb-2 h-6 w-6 text-slate-300" />
          No hay novedades pendientes.
        </div>
        <ul v-else class="space-y-3">
          <li v-for="n in novedadesRecientes" :key="n.id" class="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
            <div class="flex items-start justify-between gap-3">
              <p class="text-sm font-medium text-slate-800">{{ n.descripcion }}</p>
              <SharedStatusBadge domain="novedad" :value="n.estado" size="xs" />
            </div>
            <p class="mt-2 text-xs text-slate-500">
              {{ n.inmueble?.direccion }}
              <span v-if="n.inmueble?.barrio" class="text-slate-400">· {{ n.inmueble.barrio }}</span>
              · {{ fecha(n.fecha) }}
            </p>
          </li>
        </ul>
      </div>

      <div v-if="auth.esAdministrador" class="surface-card p-4">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-slate-900">Últimos recibos</p>
            <p class="text-xs text-slate-500">Operaciones recientes</p>
          </div>
          <NuxtLink to="/recibos" class="text-xs font-medium text-amber-600 hover:underline">Ver todos</NuxtLink>
        </div>
        <SharedSkeletonText v-if="cargandoRecibos" :lines="3" class="py-2" />
        <div v-else-if="!recibosRecientes.length" class="flex min-h-[140px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center text-sm text-slate-400">
          Sin recibos emitidos todavía.
        </div>
        <ul v-else class="space-y-2">
          <li v-for="r in recibosRecientes" :key="r.id">
            <NuxtLink
              :to="`/recibos/${r.id}`"
              class="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 transition hover:border-slate-300 hover:bg-slate-100"
            >
              <span class="min-w-0">
                <span class="block truncate text-sm font-medium text-slate-800">{{ r.contrato?.cliente?.nombreCompleto }}</span>
                <span class="mt-0.5 block text-xs text-slate-500">{{ r.consecutivo }} · {{ fecha(r.creadoEn) }}</span>
              </span>
              <span class="shrink-0 text-sm font-semibold tabular-nums text-slate-900">{{ moneda(r.valorTotal) }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
