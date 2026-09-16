<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

const auth = useAuthStore()
const { moneda } = useFormatoCO()
const route = useRoute()

const columnas = [
  { key: 'tipoServicio', label: 'Servicio' },
  { key: 'inmueble', label: 'Inmueble' },
  { key: 'periodo', label: 'Período' },
  { key: 'numeroFactura', label: 'Factura' },
  { key: 'valor', label: 'Valor' },
  { key: 'responsablePago', label: 'Responsable' },
  { key: 'estadoPago', label: 'Estado' },
  { key: 'acciones', label: '' },
]

type ServicioPublico = {
  id: string
  tipoServicio: 'LUZ' | 'AGUA' | 'GAS'
  periodo: string
  numeroFactura: string
  valor: number
  responsablePago: 'PENDIENTE' | 'PROPIETARIO' | 'ARRENDATARIO'
  estadoPago: 'PENDIENTE' | 'PAGADO' | 'VENCIDO' | 'ANULADO'
  inmueble: { id: string; direccion: string; barrio: string }
  fechaEmision: string
  fechaVencimiento: string
  observaciones?: string | null
}

type FormularioServicio = {
  inmuebleId: string
  tipoServicio: 'LUZ' | 'AGUA' | 'GAS'
  periodo: string
  numeroFactura: string
  valor: number
  fechaEmision: string
  fechaVencimiento: string
  observaciones: string
}

const inmuebles = ref<Array<{ id: string; direccion: string; barrio: string; consecutivo?: string | null }>>([])
const modalAbierto = ref(false)
const guardando = ref(false)
const error = ref('')
const formulario = reactive<FormularioServicio>({
  inmuebleId: '',
  tipoServicio: 'LUZ',
  periodo: '',
  numeroFactura: '',
  valor: 0,
  fechaEmision: new Date().toISOString().slice(0, 10),
  fechaVencimiento: new Date().toISOString().slice(0, 10),
  observaciones: '',
})

const {
  filtros,
  page,
  limit,
  total,
  lista: servicios,
  cargando,
  cargar,
} = useListadoPaginado<ServicioPublico, { tipoServicio: string; inmuebleId: string }>(
  ({ page, limit, filtros }) =>
    useApiFetch<{ data: ServicioPublico[]; total: number }>('/servicios-publicos', {
      params: {
        page,
        limit,
        tipoServicio: filtros.tipoServicio || undefined,
        inmuebleId: filtros.inmuebleId || undefined,
      },
    }).then((res) => ({ data: res.data, total: res.total })),
  {
    filtrosIniciales: { tipoServicio: '', inmuebleId: String(route.query.inmuebleId || '') },
    limiteInicial: 10,
    mensajeError: 'No fue posible cargar los servicios públicos.',
  },
)

async function cargarInmuebles() {
  const respuesta = await useApiFetch<{
    data: Array<{ id: string; direccion: string; barrio: string; consecutivo?: string | null }>
  }>('/inmuebles', { params: { page: 1, limit: 200 } })
  inmuebles.value = respuesta.data
}

function resetearFormulario() {
  Object.assign(formulario, {
    inmuebleId: String(route.query.inmuebleId || ''),
    tipoServicio: 'LUZ',
    periodo: '',
    numeroFactura: '',
    valor: 0,
    fechaEmision: new Date().toISOString().slice(0, 10),
    fechaVencimiento: new Date().toISOString().slice(0, 10),
    observaciones: '',
  })
}

async function guardar() {
  error.value = ''
  if (!formulario.inmuebleId) {
    error.value = 'Selecciona el inmueble al que pertenece el recibo.'
    return
  }
  guardando.value = true
  try {
    await useApiFetch('/servicios-publicos', {
      method: 'POST',
      body: {
        inmuebleId: formulario.inmuebleId,
        tipoServicio: formulario.tipoServicio,
        periodo: formulario.periodo,
        numeroFactura: formulario.numeroFactura,
        valor: Number(formulario.valor),
        fechaEmision: formulario.fechaEmision,
        fechaVencimiento: formulario.fechaVencimiento,
        observaciones: formulario.observaciones || undefined,
      },
    })
    modalAbierto.value = false
    resetearFormulario()
    await cargar()
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible guardar el servicio público.'
  } finally {
    guardando.value = false
  }
}

async function aprobarResponsable(servicio: ServicioPublico) {
  if (!auth.esAdministrador) return
  try {
    await useApiFetch(`/servicios-publicos/${servicio.id}/aprobar-responsable`, {
      method: 'PATCH',
      body: {
        responsablePago: servicio.responsablePago === 'ARRENDATARIO' ? 'PROPIETARIO' : 'ARRENDATARIO',
        estadoPago: 'PAGADO',
      },
    })
    await cargar()
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible actualizar el responsable.'
  }
}

onMounted(async () => {
  await cargarInmuebles()
  await cargar()
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-semibold text-slate-900">Servicios públicos</h1>
      <UButton v-if="auth.esAdministrador" color="amber" icon="i-heroicons-plus" @click="modalAbierto = true">
        Nuevo recibo
      </UButton>
    </div>

    <UAlert v-if="error" color="red" variant="subtle" :title="error" class="mb-4" />

    <UCard class="mb-4">
      <div class="flex flex-wrap gap-3">
        <USelectMenu
          v-model="filtros.tipoServicio"
          :options="['', 'LUZ', 'AGUA', 'GAS']"
          placeholder="Tipo de servicio"
          class="w-52"
        />
      </div>
    </UCard>

    <UCard>
      <UTable :rows="servicios" :columns="columnas" :loading="cargando">
        <template #inmueble-data="{ row }">
          {{ row.inmueble?.direccion || '—' }}
          <div class="text-xs text-slate-500">{{ row.inmueble?.barrio || 'Sin barrio' }}</div>
        </template>
        <template #valor-data="{ row }">{{ moneda(row.valor) }}</template>
        <template #responsablePago-data="{ row }">
          <UBadge :color="row.responsablePago === 'PENDIENTE' ? 'amber' : 'green'" variant="subtle">
            {{ row.responsablePago }}
          </UBadge>
        </template>
        <template #estadoPago-data="{ row }">
          <SharedStatusBadge domain="servicioPublicoEstado" :value="row.estadoPago" />
        </template>
        <template #acciones-data="{ row }">
          <div class="flex gap-1">
            <UButton
              v-if="auth.esAdministrador"
              size="xs"
              color="amber"
              variant="soft"
              icon="i-heroicons-check"
              @click="aprobarResponsable(row)"
            >
              Aprobar
            </UButton>
          </div>
        </template>
        <template #empty-state>
          <div class="text-center py-10 text-slate-400">
            <UIcon name="i-heroicons-light-bulb" class="w-10 h-10 mx-auto mb-2" />
            <p>No hay recibos de servicios públicos.</p>
          </div>
        </template>
      </UTable>

      <div class="flex justify-end mt-4">
        <UPagination v-model="page" :page-count="limit" :total="total" />
      </div>
    </UCard>

    <UModal v-model="modalAbierto">
      <UCard>
        <template #header>
          <p class="font-semibold text-slate-900">Nuevo recibo público</p>
        </template>

        <UAlert v-if="error" color="red" variant="subtle" :title="error" class="mb-3" />

        <div class="grid grid-cols-2 gap-3">
          <UFormGroup label="Inmueble" class="col-span-2">
            <USelectMenu
              v-model="formulario.inmuebleId"
              :options="inmuebles.map((i) => ({ label: `${i.direccion} · ${i.barrio}`, value: i.id }))"
              value-attribute="value"
              option-attribute="label"
              placeholder="Selecciona un inmueble"
            />
          </UFormGroup>
          <UFormGroup label="Servicio">
            <USelectMenu v-model="formulario.tipoServicio" :options="['LUZ', 'AGUA', 'GAS']" />
          </UFormGroup>
          <UFormGroup label="Período">
            <UInput v-model="formulario.periodo" placeholder="2026-09" />
          </UFormGroup>
          <UFormGroup label="Factura" class="col-span-2">
            <UInput v-model="formulario.numeroFactura" />
          </UFormGroup>
          <UFormGroup label="Valor">
            <UiMoneyInput v-model="formulario.valor" />
          </UFormGroup>
          <UFormGroup label="Fecha emisión">
            <UInput v-model="formulario.fechaEmision" type="date" />
          </UFormGroup>
          <UFormGroup label="Fecha vencimiento">
            <UInput v-model="formulario.fechaVencimiento" type="date" />
          </UFormGroup>
          <UFormGroup label="Observaciones" class="col-span-2">
            <UTextarea v-model="formulario.observaciones" :rows="3" />
          </UFormGroup>
        </div>

        <div class="mt-4 flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="modalAbierto = false">Cancelar</UButton>
          <UButton color="amber" :loading="guardando" @click="guardar">Guardar</UButton>
        </div>
      </UCard>
    </UModal>
  </div>
</template>
