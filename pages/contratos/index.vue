<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

const auth = useAuthStore()
const { fecha, moneda } = useFormatoCO()

const barrios = ref<string[]>([])
const opcionesBarrio = computed(() => [
  { label: 'Todos los barrios', value: '' },
  ...barrios.value.map((b) => ({ label: b, value: b })),
])
const opcionesEstado = [
  { label: 'Todos los estados', value: '' },
  { label: 'ACTIVO', value: 'ACTIVO' },
  { label: 'TERMINADO', value: 'TERMINADO' },
]

const {
  filtros,
  page,
  limit,
  total,
  lista: contratos,
  cargando,
  error,
  cargar,
} = useListadoPaginado<
  any,
  { busqueda: string; barrio: string; fechaDesde: string; fechaHasta: string; estado: string }
>(({ page, limit, filtros }) => useApiFetch<any>('/contratos', { params: { ...filtros, page, limit } }), {
  filtrosIniciales: { busqueda: '', barrio: '', fechaDesde: '', fechaHasta: '', estado: '' },
  mensajeError: 'No fue posible cargar los contratos.',
})

// Buscador con debounce: `useListadoPaginado` recarga ante cualquier cambio de `filtros`, así
// que se escribe en un ref intermedio y solo se vuelca a `filtros.busqueda` tras una pausa
// (evita una petición por cada tecla — hallazgo P3-06 de la auditoría).
const busquedaInput = ref(filtros.busqueda)
let debounceBusqueda: ReturnType<typeof setTimeout> | undefined
watch(busquedaInput, (valor) => {
  clearTimeout(debounceBusqueda)
  debounceBusqueda = setTimeout(() => {
    filtros.busqueda = valor.trim()
  }, 300)
})
onBeforeUnmount(() => clearTimeout(debounceBusqueda))

const columnas = [
  { key: 'cliente', label: 'Arrendatario', class: 'w-[18%]' },
  { key: 'inmueble.direccion', label: 'Dirección', class: 'w-[22%]' },
  { key: 'inmueble.barrio', label: 'Barrio', class: 'w-[12%]' },
  {
    key: 'canonValor',
    label: 'Canon',
    class: 'w-[11%] whitespace-nowrap',
    rowClass: 'whitespace-nowrap text-right tabular-nums',
  },
  { key: 'fechaInicio', label: 'Inicio', class: 'w-[10%] whitespace-nowrap', rowClass: 'whitespace-nowrap' },
  {
    key: 'estado',
    label: 'Estado',
    class: 'w-[9%] whitespace-nowrap',
    rowClass: 'whitespace-nowrap text-center',
  },
  { key: 'acciones', label: 'Acciones', class: 'w-[14%] whitespace-nowrap', rowClass: 'whitespace-nowrap' },
]

function verContrato(row: any) {
  navigateTo(`/contratos/${row.id}`)
}

async function cargarBarrios() {
  barrios.value = await useApiFetch<string[]>('/inmuebles/barrios')
}

// Terminar / reactivar comparten los modales con `contratos/[id].vue`
// (`components/contratos/ModalTerminar.vue` / `ModalReactivar.vue`), que hacen el PATCH y
// emiten al terminar/reactivar para recargar el listado.
const contratoAccion = ref<any>(null)
const modalTerminar = ref(false)
const modalReactivar = ref(false)

function abrirTerminar(row: any) {
  contratoAccion.value = row
  modalTerminar.value = true
}
function abrirReactivar(row: any) {
  contratoAccion.value = row
  modalReactivar.value = true
}

onMounted(cargarBarrios)
</script>

<template>
  <div class="space-y-5">
    <header class="surface-card overflow-hidden px-5 py-4 sm:px-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-600">Operación</p>
          <h2 class="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Contratos</h2>
        </div>

        <div class="flex items-center gap-3">
          <div class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600">
            <span v-if="cargando" class="inline-flex items-center gap-2">
              <UIcon name="i-heroicons-arrow-path" class="h-4 w-4 animate-spin" />
              Cargando…
            </span>
            <span v-else class="font-medium text-slate-700">{{ total }} {{ total === 1 ? 'contrato' : 'contratos' }}</span>
          </div>
          <UButton color="amber" icon="i-heroicons-plus" to="/contratos/nuevo" class="!rounded-xl">Nuevo contrato</UButton>
        </div>
      </div>
    </header>

    <div class="surface-card p-4 sm:p-5">
      <div class="flex flex-wrap items-end gap-3">
        <UInput
          v-model="busquedaInput"
          placeholder="Cédula o nombre del arrendatario…"
          icon="i-heroicons-magnifying-glass"
          class="w-full sm:w-64"
        />
        <USelectMenu
          v-model="filtros.barrio"
          :options="opcionesBarrio"
          value-attribute="value"
          option-attribute="label"
          placeholder="Barrio del inmueble"
          class="w-full sm:w-52"
        />
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-500">Inicio desde</label>
          <UInput v-model="filtros.fechaDesde" type="date" class="w-full sm:w-40" />
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-500">Inicio hasta</label>
          <UInput v-model="filtros.fechaHasta" type="date" class="w-full sm:w-40" />
        </div>
        <USelectMenu
          v-model="filtros.estado"
          :options="opcionesEstado"
          value-attribute="value"
          option-attribute="label"
          placeholder="Estado"
          class="w-full sm:w-44"
        />
      </div>
    </div>

    <SharedErrorState v-if="error" :message="error" class="mb-4" @retry="cargar" />

    <div class="surface-card overflow-hidden">
      <UTable
        :rows="contratos"
        :columns="columnas"
        :loading="cargando"
        :ui="{
          base: 'min-w-full',
          thead: 'bg-slate-50',
          th: { base: 'text-slate-600 font-semibold uppercase tracking-[0.12em] text-[10px] px-4 py-3' },
          td: { base: 'px-4 py-3 text-sm text-slate-700 border-b border-slate-100' },
          tr: { base: 'even:bg-slate-50/70', active: 'cursor-pointer hover:!bg-amber-50/70' },
        }"
        @select="verContrato"
      >
        <template #cliente-data="{ row }">
          <div>
            <p class="font-semibold text-slate-900">{{ row.cliente?.nombreCompleto }}</p>
            <p class="text-xs text-slate-500">{{ row.cliente?.numeroDocumento }}</p>
          </div>
        </template>
        <template #canonValor-data="{ row }">{{ moneda(row.canonValor) }}</template>
        <template #fechaInicio-data="{ row }">{{ fecha(row.fechaInicio) }}</template>
        <template #estado-data="{ row }">
          <SharedStatusBadge domain="contrato" :value="row.estado" />
        </template>
        <template #acciones-data="{ row }">
          <div class="flex flex-nowrap items-center justify-center gap-2">
            <UButton
              size="xs"
              color="amber"
              variant="soft"
              icon="i-heroicons-eye"
              :to="`/contratos/${row.id}`"
              @click.stop
            >
              Ver
            </UButton>
            <UButton
              v-if="row.estado === 'ACTIVO'"
              size="xs"
              color="red"
              variant="soft"
              @click.stop="abrirTerminar(row)"
            >
              Terminar
            </UButton>
            <UButton
              v-if="auth.esAdministrador && row.estado === 'TERMINADO'"
              size="xs"
              color="emerald"
              variant="soft"
              @click.stop="abrirReactivar(row)"
            >
              Reactivar
            </UButton>
          </div>
        </template>
        <template #empty-state>
          <div class="py-12 text-center text-slate-400">
            <UIcon name="i-heroicons-document-text" class="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <p>No hay contratos que coincidan con los filtros.</p>
          </div>
        </template>
      </UTable>

      <div v-if="total > limit" class="flex justify-end border-t border-slate-200 bg-slate-50/80 px-4 py-3">
        <UPagination v-model="page" :page-count="limit" :total="total" />
      </div>
    </div>

    <ContratosModalTerminar v-model="modalTerminar" :contrato="contratoAccion" @terminado="cargar" />
    <ContratosModalReactivar v-model="modalReactivar" :contrato="contratoAccion" @reactivado="cargar" />
  </div>
</template>
