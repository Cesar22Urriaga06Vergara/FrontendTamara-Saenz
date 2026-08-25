<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

/**
 * Dashboard: métricas + accesos rápidos + actividad reciente que necesita atención. Todo se
 * arma con endpoints que ya existían para otras pantallas (novedades, recibos) — no se agregó
 * ningún endpoint nuevo de agregación en el backend para este rediseño, así que no hay
 * gráficos ni "próximos vencimientos" globales: esos requerirían datos que hoy solo existen
 * por contrato (`/obligaciones/contrato/:id/pendientes`), no una vista consolidada.
 */
definePageMeta({ middleware: [] })

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

// ---- Novedades abiertas recientes (visible para ambos roles) ----
const cargandoNovedades = ref(true)
const novedadesRecientes = ref<any[]>([])

async function cargarNovedadesRecientes() {
  cargandoNovedades.value = true
  try {
    const data = await useApiFetch<any>('/novedades', { params: { estado: 'ABIERTA', limit: 5 } })
    novedadesRecientes.value = data.data
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
  cargarNovedadesRecientes()
  cargarRecibosRecientes()
})
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold text-slate-900 mb-4">Dashboard</h1>

    <SharedErrorState v-if="error" :message="error" class="mb-4" @retry="cargar" />

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <UCard>
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-lg bg-slate-100 text-slate-600">
            <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-xs text-slate-500">Contratos activos</p>
            <p class="text-2xl font-bold text-slate-900">{{ metricas.contratosActivos }}</p>
          </div>
        </div>
      </UCard>

      <UCard v-if="auth.esAdministrador">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-lg bg-amber-50 text-amber-600">
            <UIcon name="i-heroicons-banknotes" class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-slate-500">Cartera total</p>
            <p class="text-2xl font-bold text-amber-600 truncate">{{ moneda(metricas.carteraTotal) }}</p>
          </div>
        </div>
        <p class="text-xs text-slate-400 mt-2">Saldo de capital pendiente, sin mora.</p>
      </UCard>

      <UCard v-if="auth.esAdministrador">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
            <UIcon name="i-heroicons-arrow-trending-up" class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-slate-500">Recaudo mes actual</p>
            <p class="text-2xl font-bold text-emerald-600 truncate">{{ moneda(metricas.recaudoMesActual) }}</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-lg bg-orange-50 text-orange-600">
            <UIcon name="i-heroicons-wrench-screwdriver" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-xs text-slate-500">Novedades abiertas</p>
            <p class="text-2xl font-bold text-orange-600">{{ metricas.novedadesAbiertas }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <UCard class="mb-6">
      <template #header><p class="font-semibold text-slate-900">Accesos rápidos</p></template>
      <div class="flex flex-wrap gap-3">
        <UButton color="amber" icon="i-heroicons-document-plus" to="/contratos/nuevo">Nuevo contrato</UButton>
        <UButton color="gray" variant="soft" icon="i-heroicons-wrench-screwdriver" to="/novedades/nueva">
          Registrar novedad
        </UButton>
        <UButton color="gray" variant="soft" icon="i-heroicons-user-plus" to="/clientes">Clientes</UButton>
        <UButton color="gray" variant="soft" icon="i-heroicons-building-office-2" to="/inmuebles">Inmuebles</UButton>
        <UButton v-if="auth.esAdministrador" color="gray" variant="soft" icon="i-heroicons-banknotes" to="/recaudo">
          Ir a Recaudo
        </UButton>
      </div>
    </UCard>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <p class="font-semibold text-slate-900">Novedades abiertas</p>
            <NuxtLink to="/novedades" class="text-xs text-amber-600 hover:underline">Ver todas</NuxtLink>
          </div>
        </template>
        <div v-if="cargandoNovedades" class="text-sm text-slate-400">Cargando…</div>
        <p v-else-if="!novedadesRecientes.length" class="text-sm text-slate-400">
          No hay novedades abiertas pendientes de atención.
        </p>
        <div v-else class="space-y-2">
          <div v-for="n in novedadesRecientes" :key="n.id" class="text-sm border-b last:border-0 pb-2">
            <div class="flex justify-between items-start gap-2">
              <p class="text-slate-900">{{ n.descripcion }}</p>
              <SharedStatusBadge domain="novedad" :value="n.estado" size="xs" />
            </div>
            <p class="text-xs text-slate-500">
              {{ n.inmueble?.direccion }} ({{ n.inmueble?.barrio }}) · {{ fecha(n.fecha) }}
            </p>
          </div>
        </div>
      </UCard>

      <UCard v-if="auth.esAdministrador">
        <template #header>
          <div class="flex items-center justify-between">
            <p class="font-semibold text-slate-900">Últimos recibos</p>
            <NuxtLink to="/recibos" class="text-xs text-amber-600 hover:underline">Ver todos</NuxtLink>
          </div>
        </template>
        <div v-if="cargandoRecibos" class="text-sm text-slate-400">Cargando…</div>
        <p v-else-if="!recibosRecientes.length" class="text-sm text-slate-400">Sin recibos emitidos todavía.</p>
        <div v-else class="space-y-2">
          <NuxtLink
            v-for="r in recibosRecientes"
            :key="r.id"
            :to="`/recibos/${r.id}`"
            class="flex justify-between items-center text-sm border-b last:border-0 pb-2 hover:bg-slate-50 -mx-1 px-1 rounded"
          >
            <div>
              <p class="text-slate-900">{{ r.contrato?.cliente?.nombreCompleto }}</p>
              <p class="text-xs text-slate-500">Recibo {{ r.consecutivo }} · {{ fecha(r.creadoEn) }}</p>
            </div>
            <span class="font-semibold text-slate-900">{{ moneda(r.valorTotal) }}</span>
          </NuxtLink>
        </div>
      </UCard>
    </div>

    <p class="text-xs text-slate-400 mt-6">Bienvenido/a, {{ auth.usuario?.email }} — Rol: {{ auth.rol }}</p>
  </div>
</template>
