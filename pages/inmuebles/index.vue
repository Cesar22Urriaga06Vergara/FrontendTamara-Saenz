<script setup lang="ts">
const { moneda } = useFormatoCO()

const barrios = ref<string[]>([])

const {
  filtros,
  page,
  limit,
  total,
  lista: inmuebles,
  cargando,
  error,
  cargar,
} = useListadoPaginado<any, { busqueda: string; barrio: string; estado: string }>(
  ({ page, limit, filtros }) => useApiFetch<any>('/inmuebles', { params: { ...filtros, page, limit } }),
  { filtrosIniciales: { busqueda: '', barrio: '', estado: '' }, mensajeError: 'No fue posible cargar los inmuebles.' },
)

const columnas = [
  { key: 'consecutivo', label: 'No.' },
  { key: 'direccion', label: 'Dirección' },
  { key: 'barrio', label: 'Barrio' },
  { key: 'canonValor', label: 'Canon' },
  { key: 'depositoValor', label: 'Depósito' },
  { key: 'estado', label: 'Estado' },
  { key: 'acciones', label: '' },
]

// OCUPADO lo controla EXCLUSIVAMENTE el motor de estados de Contratos al crear/reactivar un
// contrato — el backend rechaza intentar fijarlo aquí (CONT-03). MANTENIMIENTO/INACTIVO se
// pueden alternar libremente en cualquier momento. DISPONIBLE solo se ofrece como destino
// manual cuando el inmueble está en MANTENIMIENTO/INACTIVO (ej: "terminó el mantenimiento"),
// nunca desde OCUPADO — el backend igual lo validaría contra un contrato ACTIVO, pero no
// tiene sentido ofrecerlo como flujo normal desde la UI.
const estadosEditables = ['MANTENIMIENTO', 'INACTIVO']

function opcionesEstado(inmueble: any): string[] {
  const opciones = [inmueble.estado, ...estadosEditables.filter((e) => e !== inmueble.estado)]
  if (inmueble.estado === 'MANTENIMIENTO' || inmueble.estado === 'INACTIVO') {
    opciones.push('DISPONIBLE')
  }
  return opciones
}

const modalAbierto = ref(false)
const inmuebleEditando = ref<any>(null)
const guardando = ref(false)
const formulario = reactive({
  direccion: '',
  barrio: '',
  canonValor: 0,
  depositoValor: 0,
  codigoEnergia: '',
  codigoAgua: '',
  codigoGas: '',
  observaciones: '',
  estado: '',
})

async function cargarBarrios() {
  barrios.value = await useApiFetch<string[]>('/inmuebles/barrios')
}

function resetearFormulario() {
  Object.assign(formulario, {
    direccion: '',
    barrio: '',
    canonValor: 0,
    depositoValor: 0,
    codigoEnergia: '',
    codigoAgua: '',
    codigoGas: '',
    observaciones: '',
    estado: '',
  })
}

function abrirCreacion() {
  error.value = ''
  inmuebleEditando.value = null
  resetearFormulario()
  modalAbierto.value = true
}

function abrirEdicion(inmueble: any) {
  error.value = ''
  inmuebleEditando.value = inmueble
  Object.assign(formulario, {
    direccion: inmueble.direccion,
    barrio: inmueble.barrio,
    canonValor: Number(inmueble.canonValor),
    depositoValor: inmueble.depositoValor != null ? Number(inmueble.depositoValor) : 0,
    codigoEnergia: inmueble.codigoEnergia || '',
    codigoAgua: inmueble.codigoAgua || '',
    codigoGas: inmueble.codigoGas || '',
    observaciones: inmueble.observaciones || '',
    estado: inmueble.estado,
  })
  modalAbierto.value = true
}

async function guardar() {
  error.value = ''
  guardando.value = true
  try {
    if (inmuebleEditando.value) {
      const body: Record<string, any> = {
        direccion: formulario.direccion,
        barrio: formulario.barrio,
        canonValor: formulario.canonValor,
        depositoValor: formulario.depositoValor,
        codigoEnergia: formulario.codigoEnergia || undefined,
        codigoAgua: formulario.codigoAgua || undefined,
        codigoGas: formulario.codigoGas || undefined,
        observaciones: formulario.observaciones || undefined,
      }
      // Solo se envía `estado` si el usuario lo cambió a una de las opciones que esta
      // pantalla ofreció para ese inmueble (ver `opcionesEstado`).
      if (
        opcionesEstado(inmuebleEditando.value).includes(formulario.estado) &&
        formulario.estado !== inmuebleEditando.value.estado
      ) {
        body.estado = formulario.estado
      }
      await useApiFetch(`/inmuebles/${inmuebleEditando.value.id}`, { method: 'PATCH', body })
    } else {
      await useApiFetch('/inmuebles', {
        method: 'POST',
        body: {
          direccion: formulario.direccion,
          barrio: formulario.barrio,
          canonValor: formulario.canonValor,
          depositoValor: formulario.depositoValor,
          codigoEnergia: formulario.codigoEnergia || undefined,
          codigoAgua: formulario.codigoAgua || undefined,
          codigoGas: formulario.codigoGas || undefined,
          observaciones: formulario.observaciones || undefined,
        },
      })
    }
    modalAbierto.value = false
    resetearFormulario()
    await cargar()
    await cargarBarrios()
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible guardar el inmueble.'
  } finally {
    guardando.value = false
  }
}

onMounted(cargarBarrios)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-semibold text-slate-900">Inmuebles</h1>
      <UButton color="amber" icon="i-heroicons-plus" @click="abrirCreacion">
        Nuevo inmueble
      </UButton>
    </div>

    <SharedErrorState v-if="error && !modalAbierto" :message="error" class="mb-4" @retry="cargar" />

    <UCard class="mb-4">
      <div class="flex flex-wrap gap-3">
        <UInput v-model="filtros.busqueda" placeholder="Buscar por dirección o barrio…" icon="i-heroicons-magnifying-glass" class="w-64" />
        <USelectMenu v-model="filtros.barrio" :options="['', ...barrios]" placeholder="Barrio" class="w-48" />
        <USelectMenu
          v-model="filtros.estado"
          :options="['', 'DISPONIBLE', 'OCUPADO', 'MANTENIMIENTO', 'INACTIVO']"
          placeholder="Estado"
          class="w-48"
        />
      </div>
    </UCard>

    <UCard>
      <UTable :rows="inmuebles" :columns="columnas" :loading="cargando">
        <template #consecutivo-data="{ row }">{{ row.consecutivo || '—' }}</template>
        <template #canonValor-data="{ row }">{{ moneda(row.canonValor) }}</template>
        <template #depositoValor-data="{ row }">{{ row.depositoValor != null ? moneda(row.depositoValor) : '—' }}</template>
        <template #estado-data="{ row }">
          <SharedStatusBadge domain="inmueble" :value="row.estado" />
        </template>
        <template #acciones-data="{ row }">
          <UButton
            icon="i-heroicons-pencil-square"
            color="gray"
            variant="ghost"
            size="sm"
            @click="abrirEdicion(row)"
          />
        </template>
        <template #empty-state>
          <div class="text-center py-10 text-slate-400">
            <UIcon name="i-heroicons-building-office-2" class="w-10 h-10 mx-auto mb-2" />
            <p>No hay inmuebles que coincidan con los filtros.</p>
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
          <p class="font-semibold text-slate-900">{{ inmuebleEditando ? 'Editar inmueble' : 'Nuevo inmueble' }}</p>
        </template>

        <UAlert v-if="error" color="red" variant="subtle" :title="error" class="mb-3" />

        <div class="grid grid-cols-2 gap-3">
          <UFormGroup label="Dirección" class="col-span-2">
            <UInput v-model="formulario.direccion" />
          </UFormGroup>
          <UFormGroup label="Barrio">
            <UInput v-model="formulario.barrio" />
          </UFormGroup>
          <UFormGroup v-if="inmuebleEditando" label="Estado">
            <USelectMenu v-model="formulario.estado" :options="opcionesEstado(inmuebleEditando)" />
          </UFormGroup>
          <UFormGroup label="Canon">
            <UInput v-model.number="formulario.canonValor" type="number" min="0" />
          </UFormGroup>
          <UFormGroup label="Depósito">
            <UInput v-model.number="formulario.depositoValor" type="number" min="0" />
          </UFormGroup>
          <UFormGroup label="Código energía">
            <UInput v-model="formulario.codigoEnergia" />
          </UFormGroup>
          <UFormGroup label="Código agua">
            <UInput v-model="formulario.codigoAgua" />
          </UFormGroup>
          <UFormGroup label="Código gas">
            <UInput v-model="formulario.codigoGas" />
          </UFormGroup>
          <UFormGroup label="Observaciones" class="col-span-2">
            <UTextarea v-model="formulario.observaciones" />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="modalAbierto = false">Cancelar</UButton>
            <UButton color="amber" :loading="guardando" @click="guardar">
              {{ inmuebleEditando ? 'Guardar cambios' : 'Crear inmueble' }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
