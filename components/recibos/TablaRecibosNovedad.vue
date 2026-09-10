<script setup lang="ts">
/**
 * Recibos de novedad: no existe una entidad "recibo" propia para Novedades — el PDF
 * ("recibo de reporte de novedad", documento de control interno sin efecto financiero) se
 * genera al vuelo desde el registro de la Novedad. Esta tabla reutiliza `GET /novedades`
 * (abierto a ambos roles) solo para localizar y ver/imprimir ese PDF — las acciones de
 * aprobar/registrar pago siguen siendo exclusivas de `/novedades`, aquí no se ofrecen.
 */
const { fecha } = useFormatoCO()

const barrios = ref<string[]>([])

const {
  filtros,
  page,
  limit,
  total,
  lista: novedades,
  cargando,
  error,
  cargar,
} = useListadoPaginado<any, { barrio: string; estado: string; fechaDesde: string; fechaHasta: string }>(
  ({ page, limit, filtros }) => useApiFetch<any>('/novedades', { params: { ...filtros, page, limit } }),
  {
    filtrosIniciales: { barrio: '', estado: '', fechaDesde: '', fechaHasta: '' },
    mensajeError: 'No fue posible cargar los recibos de novedad.',
  },
)

const columnas = [
  { key: 'consecutivo', label: 'No.' },
  // `key` sin puntos a propósito: ver comentario equivalente en pages/novedades/index.vue
  // (un key anidado rompe el nombre del slot `#key-data`, Vue lo lee como modificador de v-slot).
  { key: 'clienteNombre', label: 'Cliente' },
  { key: 'inmueble.direccion', label: 'Dirección' },
  { key: 'inmueble.barrio', label: 'Barrio' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'fecha', label: 'Fecha' },
  { key: 'estado', label: 'Estado' },
  { key: 'acciones', label: 'Acciones' },
]

async function cargarBarrios() {
  barrios.value = await useApiFetch<string[]>('/inmuebles/barrios')
}

async function verRecibo(row: any) {
  await usePdfDownload(`/documentos/novedades/${row.id}/pdf`, row.consecutivo)
}

onMounted(cargarBarrios)
</script>

<template>
  <div class="space-y-4">
    <div class="grid gap-3 sm:grid-cols-3">
      <div class="surface-card p-4">
        <p class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Tipo</p>
        <p class="mt-2 text-lg font-semibold text-slate-900">Novedades</p>
      </div>
      <div class="surface-card p-4">
        <p class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Resultado</p>
        <p class="mt-2 text-lg font-semibold text-slate-900">{{ total || 0 }} registros</p>
      </div>
      <div class="surface-card p-4">
        <p class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Reporte</p>
        <p class="mt-2 text-lg font-semibold text-slate-900">PDF</p>
      </div>
    </div>

    <SharedErrorState v-if="error" :message="error" class="mb-0" @retry="cargar" />

    <div class="surface-card p-4 sm:p-5">
      <div class="flex flex-wrap gap-3">
        <USelectMenu
          v-model="filtros.barrio"
          :options="['', ...barrios]"
          placeholder="Barrio del inmueble"
          class="w-full sm:w-52"
        />
        <USelectMenu
          v-model="filtros.estado"
          :options="['', 'ABIERTA', 'EN_SEGUIMIENTO', 'CERRADA', 'ANULADA']"
          placeholder="Estado"
          class="w-full sm:w-48"
        />
        <UInput v-model="filtros.fechaDesde" type="date" class="w-full sm:w-40" />
        <UInput v-model="filtros.fechaHasta" type="date" class="w-full sm:w-40" />
      </div>
    </div>

    <div class="surface-card overflow-hidden">
      <UTable
        :rows="novedades"
        :columns="columnas"
        :loading="cargando"
        :ui="{
          base: 'min-w-full',
          thead: 'bg-slate-50',
          th: { base: 'text-slate-600 font-semibold uppercase tracking-[0.12em] text-[10px] px-4 py-3' },
          td: { base: 'px-4 py-3 text-sm text-slate-700 border-b border-slate-100' },
          tr: { base: 'even:bg-slate-50/70' },
        }"
      >
        <template #clienteNombre-data="{ row }">
          {{ row.contrato?.cliente?.nombreCompleto ?? '—' }}
        </template>
        <template #fecha-data="{ row }">{{ fecha(row.fecha) }}</template>
        <template #estado-data="{ row }">
          <SharedStatusBadge domain="novedad" :value="row.estado" />
        </template>
        <template #acciones-data="{ row }">
          <UButton size="xs" color="amber" variant="soft" icon="i-heroicons-eye" @click="verRecibo(row)"> Ver </UButton>
        </template>
        <template #empty-state>
          <div class="py-12 text-center text-slate-400">
            <UIcon name="i-heroicons-wrench-screwdriver" class="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <p>No hay recibos de novedad que coincidan con los filtros.</p>
          </div>
        </template>
      </UTable>

      <div class="flex justify-end border-t border-slate-200 bg-slate-50/80 px-4 py-3">
        <UPagination v-model="page" :page-count="limit" :total="total" />
      </div>
    </div>
  </div>
</template>
