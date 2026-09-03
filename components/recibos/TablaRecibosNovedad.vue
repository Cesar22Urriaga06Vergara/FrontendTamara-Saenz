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
  <div>
    <SharedErrorState v-if="error" :message="error" class="mb-4" @retry="cargar" />

    <UCard class="mb-4">
      <div class="flex flex-wrap gap-3">
        <USelectMenu
          v-model="filtros.barrio"
          :options="['', ...barrios]"
          placeholder="Barrio del inmueble"
          class="w-52"
        />
        <USelectMenu
          v-model="filtros.estado"
          :options="['', 'ABIERTA', 'EN_SEGUIMIENTO', 'CERRADA', 'ANULADA']"
          placeholder="Estado"
          class="w-48"
        />
        <UInput v-model="filtros.fechaDesde" type="date" class="w-40" />
        <UInput v-model="filtros.fechaHasta" type="date" class="w-40" />
      </div>
    </UCard>

    <UCard>
      <UTable :rows="novedades" :columns="columnas" :loading="cargando">
        <template #fecha-data="{ row }">{{ fecha(row.fecha) }}</template>
        <template #estado-data="{ row }">
          <SharedStatusBadge domain="novedad" :value="row.estado" />
        </template>
        <template #acciones-data="{ row }">
          <UButton size="xs" color="amber" variant="soft" icon="i-heroicons-eye" @click="verRecibo(row)"> Ver </UButton>
        </template>
        <template #empty-state>
          <div class="text-center py-10 text-slate-400">
            <UIcon name="i-heroicons-wrench-screwdriver" class="w-10 h-10 mx-auto mb-2" />
            <p>No hay recibos de novedad que coincidan con los filtros.</p>
          </div>
        </template>
      </UTable>

      <div class="flex justify-end mt-4">
        <UPagination v-model="page" :page-count="limit" :total="total" />
      </div>
    </UCard>
  </div>
</template>
