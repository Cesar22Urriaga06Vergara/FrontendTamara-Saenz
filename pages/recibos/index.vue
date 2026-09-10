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
  <div class="space-y-5">
    <header class="surface-card overflow-hidden px-5 py-4 sm:px-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-600">Documentación</p>
          <h1 class="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Recibos</h1>
        </div>
        <div class="flex items-center gap-2 text-sm text-slate-600">
          <span class="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-medium">{{ auth.esAdministrador ? 'Administración' : 'Consulta' }}</span>
        </div>
      </div>
    </header>

    <div v-if="auth.esAdministrador" class="grid gap-3 sm:grid-cols-3">
      <div class="surface-card p-4">
        <p class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Vista</p>
        <p class="mt-2 text-lg font-semibold text-slate-900">Recibos de caja</p>
      </div>
      <div class="surface-card p-4">
        <p class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Registro</p>
        <p class="mt-2 text-lg font-semibold text-slate-900">{{ total || 0 }} resultados</p>
      </div>
      <div class="surface-card p-4">
        <p class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Acceso</p>
        <p class="mt-2 text-lg font-semibold text-slate-900">PDF y detalle</p>
      </div>
    </div>

    <UTabs v-if="auth.esAdministrador" v-model="pestanaActiva" :items="pestanas">
      <template #caja>
        <SharedErrorState v-if="error" :message="error" class="my-4" @retry="cargar" />

        <div class="surface-card p-4 sm:p-5">
          <div class="flex flex-wrap gap-3">
            <UInput
              v-model="filtros.busqueda"
              placeholder="Cédula, nombre del cliente o número de recibo…"
              icon="i-heroicons-magnifying-glass"
              class="w-full sm:w-72"
            />
            <USelectMenu
              v-model="filtros.estado"
              :options="['', 'EMITIDO', 'ANULADO']"
              placeholder="Estado"
              class="w-full sm:w-40"
            />
            <USelectMenu
              v-model="filtros.medioPago"
              :options="['', 'EFECTIVO', 'TRANSFERENCIA']"
              placeholder="Medio de pago"
              class="w-full sm:w-44"
            />
            <UInput v-model="filtros.fechaDesde" type="date" class="w-full sm:w-40" />
            <UInput v-model="filtros.fechaHasta" type="date" class="w-full sm:w-40" />
          </div>
        </div>

        <div class="surface-card overflow-hidden">
          <UTable
            :rows="recibos"
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
            <template #consecutivo-data="{ row }">
              <span class="font-semibold text-slate-900">{{ row.consecutivo }}</span>
            </template>
            <template #creadoEn-data="{ row }">{{ fecha(row.creadoEn) }}</template>
            <template #cliente-data="{ row }">
              <div>
                <p class="font-medium text-slate-900">{{ row.contrato?.cliente?.nombreCompleto }}</p>
                <p class="text-xs text-slate-500">{{ row.contrato?.cliente?.numeroDocumento }}</p>
              </div>
            </template>
            <template #valorTotal-data="{ row }"><span class="font-semibold tabular-nums text-slate-900">{{ moneda(row.valorTotal) }}</span></template>
            <template #medioPago-data="{ row }">{{ mediosDePago(row) }}</template>
            <template #estado-data="{ row }">
              <SharedStatusBadge domain="recibo" :value="row.estado" />
            </template>
            <template #acciones-data="{ row }">
              <div class="flex items-center gap-1.5">
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
              <div class="py-12 text-center text-slate-400">
                <UIcon name="i-heroicons-receipt-percent" class="mx-auto mb-3 h-10 w-10 text-slate-300" />
                <p>No hay recibos que coincidan con los filtros.</p>
              </div>
            </template>
          </UTable>

          <div class="flex justify-end border-t border-slate-200 bg-slate-50/80 px-4 py-3">
            <UPagination v-model="page" :page-count="limit" :total="total" />
          </div>
        </div>
      </template>

      <template #novedad>
        <RecibosTablaRecibosNovedad class="mt-4" />
      </template>
    </UTabs>

    <RecibosTablaRecibosNovedad v-else />
  </div>
</template>
