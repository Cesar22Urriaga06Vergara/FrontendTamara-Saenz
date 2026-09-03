<script setup lang="ts">
/**
 * Módulo RECIBOS — permite consultar cualquier recibo histórico sin tener que volver al
 * cliente o al módulo de Recaudo para localizarlo. Abierto a ambos roles: Administrador ve
 * los recibos de caja (Recaudo, dato financiero, protegido también en el backend por
 * `RecaudoController`) además de los recibos de novedad; Recepcionista solo ve los recibos
 * de novedad (no tiene acceso a ningún endpoint de Recaudo).
 */
import { useAuthStore } from '~/stores/auth.store'

const auth = useAuthStore()
const { moneda, fecha } = useFormatoCO()

const {
  filtros,
  page,
  limit,
  total,
  lista: recibos,
  cargando,
  error,
  cargar,
} = useListadoPaginado<
  any,
  { busqueda: string; estado: string; medioPago: string; fechaDesde: string; fechaHasta: string }
>(({ page, limit, filtros }) => useApiFetch<any>('/recaudo/recibos', { params: { ...filtros, page, limit } }), {
  filtrosIniciales: { busqueda: '', estado: '', medioPago: '', fechaDesde: '', fechaHasta: '' },
  mensajeError: 'No fue posible cargar los recibos.',
  // Recepcionista no tiene acceso a este endpoint (RecaudoController es exclusivo
  // Administrador) — evita una petición que sabemos de antemano que será rechazada.
  inmediato: auth.esAdministrador,
})

const columnas = [
  { key: 'consecutivo', label: 'Número' },
  { key: 'creadoEn', label: 'Fecha' },
  { key: 'cliente', label: 'Cliente' },
  { key: 'contrato.inmueble.direccion', label: 'Dirección' },
  { key: 'contrato.inmueble.barrio', label: 'Barrio' },
  { key: 'valorTotal', label: 'Total' },
  { key: 'medioPago', label: 'Medio de pago' },
  { key: 'estado', label: 'Estado' },
  { key: 'acciones', label: 'Acciones' },
]

const pestanas = [
  { label: 'Recibos de caja', icon: 'i-heroicons-banknotes', slot: 'caja' },
  { label: 'Recibos de novedad', icon: 'i-heroicons-wrench-screwdriver', slot: 'novedad' },
]
const pestanaActiva = ref(0)

function mediosDePago(row: any): string {
  const medios = [...new Set((row.detallesPago || []).map((d: any) => d.medioPago))]
  if (medios.length === 0) return '—'
  if (medios.length === 1) return medios[0] === 'EFECTIVO' ? 'Efectivo' : 'Transferencia'
  return 'Mixto'
}

const descargando = ref<string | null>(null)
async function descargar(row: any, formato: 'CARTA' | 'MEDIA_CARTA') {
  descargando.value = row.id
  try {
    await usePdfDownload(`/documentos/recibos/${row.id}/pdf?formato=${formato}`, row.consecutivo)
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible abrir el PDF.'
  } finally {
    descargando.value = null
  }
}
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold text-slate-900 mb-4">Recibos</h1>

    <UTabs v-if="auth.esAdministrador" v-model="pestanaActiva" :items="pestanas">
      <template #caja>
        <SharedErrorState v-if="error" :message="error" class="my-4" @retry="cargar" />

        <UCard class="my-4">
          <div class="flex flex-wrap gap-3">
            <UInput
              v-model="filtros.busqueda"
              placeholder="Cédula, nombre del cliente o número de recibo…"
              icon="i-heroicons-magnifying-glass"
              class="w-72"
            />
            <USelectMenu
              v-model="filtros.estado"
              :options="['', 'EMITIDO', 'ANULADO']"
              placeholder="Estado"
              class="w-40"
            />
            <USelectMenu
              v-model="filtros.medioPago"
              :options="['', 'EFECTIVO', 'TRANSFERENCIA']"
              placeholder="Medio de pago"
              class="w-44"
            />
            <UInput v-model="filtros.fechaDesde" type="date" class="w-40" />
            <UInput v-model="filtros.fechaHasta" type="date" class="w-40" />
          </div>
        </UCard>

        <UCard>
          <UTable :rows="recibos" :columns="columnas" :loading="cargando">
            <template #consecutivo-data="{ row }">
              <span class="font-medium text-slate-900">{{ row.consecutivo }}</span>
            </template>
            <template #creadoEn-data="{ row }">{{ fecha(row.creadoEn) }}</template>
            <template #cliente-data="{ row }">
              <div>
                <p class="text-slate-900">{{ row.contrato?.cliente?.nombreCompleto }}</p>
                <p class="text-xs text-slate-500">{{ row.contrato?.cliente?.numeroDocumento }}</p>
              </div>
            </template>
            <template #valorTotal-data="{ row }">{{ moneda(row.valorTotal) }}</template>
            <template #medioPago-data="{ row }">{{ mediosDePago(row) }}</template>
            <template #estado-data="{ row }">
              <SharedStatusBadge domain="recibo" :value="row.estado" />
            </template>
            <template #acciones-data="{ row }">
              <div class="flex gap-1">
                <UButton size="xs" color="amber" variant="soft" icon="i-heroicons-eye" :to="`/recibos/${row.id}`">
                  Ver
                </UButton>
                <UDropdown
                  :items="[
                    [
                      { label: 'Ver Carta', click: () => descargar(row, 'CARTA') },
                      { label: 'Ver Media Carta', click: () => descargar(row, 'MEDIA_CARTA') },
                    ],
                  ]"
                >
                  <UButton
                    size="xs"
                    color="gray"
                    variant="soft"
                    icon="i-heroicons-eye"
                    :loading="descargando === row.id"
                    aria-label="Ver / Imprimir"
                  />
                </UDropdown>
              </div>
            </template>
            <template #empty-state>
              <div class="text-center py-10 text-slate-400">
                <UIcon name="i-heroicons-receipt-percent" class="w-10 h-10 mx-auto mb-2" />
                <p>No hay recibos que coincidan con los filtros.</p>
              </div>
            </template>
          </UTable>

          <div class="flex justify-end mt-4">
            <UPagination v-model="page" :page-count="limit" :total="total" />
          </div>
        </UCard>
      </template>

      <template #novedad>
        <RecibosTablaRecibosNovedad class="mt-4" />
      </template>
    </UTabs>

    <RecibosTablaRecibosNovedad v-else />
  </div>
</template>
