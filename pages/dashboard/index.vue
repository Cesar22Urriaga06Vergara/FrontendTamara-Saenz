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
  <div class="space-y-4">
    <SharedErrorState v-if="error" :message="error" :loading="cargando" @retry="cargar" />

    <!-- KPIs -->
    <div class="grid grid-cols-2 gap-3" :class="auth.esAdministrador ? 'lg:grid-cols-4' : 'sm:max-w-2xl'">
      <NuxtLink
        v-for="tile in tiles"
        :key="tile.label"
        :to="tile.to"
        :title="tile.ayuda"
        class="flex items-center gap-3 rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200 transition hover:shadow-sm hover:ring-marca-dorado"
      >
        <div class="shrink-0 rounded-lg p-2" :class="tile.chip">
          <UIcon :name="tile.icon" class="h-5 w-5" />
        </div>
        <div class="min-w-0">
          <p class="text-xs text-slate-500">{{ tile.label }}</p>
          <p class="text-xl font-bold leading-tight tabular-nums" :class="tile.valorClase">{{ tile.valor }}</p>
        </div>
      </NuxtLink>
    </div>

    <!-- Accesos rápidos -->
    <div class="flex flex-wrap items-center gap-2">
      <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Accesos rápidos</span>
      <UButton size="sm" color="amber" icon="i-heroicons-document-plus" to="/contratos/nuevo">Nuevo contrato</UButton>
      <UButton size="sm" color="gray" variant="soft" icon="i-heroicons-wrench-screwdriver" to="/novedades/nueva">
        Registrar novedad
      </UButton>
      <UButton size="sm" color="gray" variant="soft" icon="i-heroicons-user-plus" to="/clientes">Clientes</UButton>
      <UButton size="sm" color="gray" variant="soft" icon="i-heroicons-building-office-2" to="/inmuebles">
        Inmuebles
      </UButton>
      <UButton
        v-if="auth.esAdministrador"
        size="sm"
        color="gray"
        variant="soft"
        icon="i-heroicons-banknotes"
        to="/recaudo"
      >
        Ir a Recaudo
      </UButton>
    </div>

    <!-- Paneles -->
    <div
      class="grid grid-cols-1 gap-4"
      :class="auth.esAdministrador ? 'lg:grid-cols-2 xl:grid-cols-3' : 'sm:max-w-2xl'"
    >
      <!-- Requiere tu atención -->
      <UCard v-if="auth.esAdministrador" :ui="{ body: { padding: 'p-4 sm:p-4', base: 'lg:min-h-[12rem]' } }">
        <template #header>
          <p class="font-semibold text-slate-900">Requiere tu atención</p>
        </template>
        <ul class="divide-y divide-slate-100">
          <li v-for="fila in filasAtencion" :key="fila.label">
            <NuxtLink
              :to="fila.to"
              class="-mx-2 flex items-center justify-between gap-3 rounded px-2 py-2 hover:bg-slate-50"
            >
              <span class="flex items-center gap-2 text-sm" :class="fila.n > 0 ? 'text-slate-900' : 'text-slate-400'">
                <UIcon :name="fila.icon" class="h-4 w-4 shrink-0" />
                {{ fila.label }}
              </span>
              <span
                v-if="fila.n > 0"
                class="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold tabular-nums text-amber-700"
              >
                {{ fila.n }}
              </span>
              <span v-else class="shrink-0 text-xs text-slate-400">Sin pendientes</span>
            </NuxtLink>
          </li>
        </ul>
      </UCard>

      <!-- Novedades abiertas -->
      <UCard :ui="{ body: { padding: 'p-4 sm:p-4', base: 'lg:min-h-[12rem]' } }">
        <template #header>
          <div class="flex items-center justify-between">
            <p class="font-semibold text-slate-900">Novedades abiertas</p>
            <NuxtLink to="/novedades" class="text-xs text-amber-600 hover:underline">Ver todas</NuxtLink>
          </div>
        </template>
        <div v-if="cargandoNovedades" class="py-8 text-center text-sm text-slate-400">Cargando…</div>
        <div v-else-if="!novedadesRecientes.length" class="py-8 text-center text-sm text-slate-400">
          <UIcon name="i-heroicons-check-circle" class="mx-auto mb-1 h-6 w-6 text-slate-300" />
          No hay novedades abiertas pendientes de atención.
        </div>
        <ul v-else class="divide-y divide-slate-100">
          <li v-for="n in novedadesRecientes" :key="n.id" class="py-2 first:pt-0 last:pb-0">
            <div class="flex items-start justify-between gap-2">
              <p class="text-sm text-slate-900">{{ n.descripcion }}</p>
              <SharedStatusBadge domain="novedad" :value="n.estado" size="xs" />
            </div>
            <p class="mt-0.5 text-xs text-slate-500">
              {{ n.inmueble?.direccion }}
              <span v-if="n.inmueble?.barrio" class="text-slate-400">· {{ n.inmueble.barrio }}</span>
              · {{ fecha(n.fecha) }}
            </p>
          </li>
        </ul>
      </UCard>

      <!-- Últimos recibos -->
      <UCard v-if="auth.esAdministrador" :ui="{ body: { padding: 'p-4 sm:p-4', base: 'lg:min-h-[12rem]' } }">
        <template #header>
          <div class="flex items-center justify-between">
            <p class="font-semibold text-slate-900">Últimos recibos</p>
            <NuxtLink to="/recibos" class="text-xs text-amber-600 hover:underline">Ver todos</NuxtLink>
          </div>
        </template>
        <div v-if="cargandoRecibos" class="py-8 text-center text-sm text-slate-400">Cargando…</div>
        <div v-else-if="!recibosRecientes.length" class="py-8 text-center text-sm text-slate-400">
          Sin recibos emitidos todavía.
        </div>
        <ul v-else class="divide-y divide-slate-100">
          <li v-for="r in recibosRecientes" :key="r.id">
            <NuxtLink
              :to="`/recibos/${r.id}`"
              class="-mx-2 flex items-center justify-between gap-3 rounded px-2 py-2 hover:bg-slate-50"
            >
              <span class="min-w-0">
                <span class="block truncate text-sm text-slate-900">{{ r.contrato?.cliente?.nombreCompleto }}</span>
                <span class="block text-xs text-slate-500">{{ r.consecutivo }} · {{ fecha(r.creadoEn) }}</span>
              </span>
              <span class="shrink-0 text-sm font-semibold tabular-nums text-slate-900">{{ moneda(r.valorTotal) }}</span>
            </NuxtLink>
          </li>
        </ul>
      </UCard>
    </div>
  </div>
</template>
