<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

definePageMeta({ middleware: [] })

const auth = useAuthStore()
const { moneda } = useFormatoCO()

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

onMounted(cargar)
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold text-slate-900 mb-4">Dashboard</h1>

    <SharedErrorState v-if="error" :message="error" class="mb-4" @retry="cargar" />

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard>
        <template #header><p class="text-sm text-slate-500">Contratos activos</p></template>
        <p class="text-3xl font-bold text-slate-900">{{ metricas.contratosActivos }}</p>
      </UCard>

      <UCard v-if="auth.esAdministrador">
        <template #header><p class="text-sm text-slate-500">Cartera total</p></template>
        <p class="text-3xl font-bold text-amber-600">{{ moneda(metricas.carteraTotal) }}</p>
        <p class="text-xs text-slate-400 mt-1">Saldo de capital pendiente, sin mora. Ver reporte de cartera para el detalle con mora.</p>
      </UCard>

      <UCard v-if="auth.esAdministrador">
        <template #header><p class="text-sm text-slate-500">Recaudo mes actual</p></template>
        <p class="text-3xl font-bold text-emerald-600">{{ moneda(metricas.recaudoMesActual) }}</p>
      </UCard>

      <UCard>
        <template #header><p class="text-sm text-slate-500">Novedades abiertas</p></template>
        <p class="text-3xl font-bold text-orange-600">{{ metricas.novedadesAbiertas }}</p>
      </UCard>
    </div>

    <p class="text-xs text-slate-400 mt-6">
      Bienvenido/a, {{ auth.usuario?.email }} — Rol: {{ auth.rol }}
    </p>
  </div>
</template>
