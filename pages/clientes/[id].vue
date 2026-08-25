<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

/** Detalle de un cliente: datos de directorio + contratos donde figura como arrendatario. */
const route = useRoute()
const auth = useAuthStore()
const { fecha } = useFormatoCO()

const cargando = ref(true)
const cliente = ref<any>(null)
const error = ref('')

async function cargar() {
  cargando.value = true
  try {
    cliente.value = await useApiFetch<any>(`/clientes/${route.params.id}`)
    definirTituloDinamico(cliente.value.nombreCompleto)
    error.value = ''
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible cargar el cliente.'
  } finally {
    cargando.value = false
  }
}

// No existe un filtro `clienteId` en GET /contratos (solo `busqueda`, que hace LIKE contra
// numeroDocumento/nombreCompleto) — se usa el documento exacto como proxy, confiable porque
// el documento es único por persona (verificado en PersonasServiceBase.crear).
const {
  page: pageContratos,
  limit: limitContratos,
  total: totalContratos,
  lista: contratos,
  cargando: cargandoContratos,
  cargar: cargarContratos,
} = useListadoPaginado<any>(
  ({ page, limit }) =>
    useApiFetch<any>('/contratos', { params: { busqueda: cliente.value?.numeroDocumento, page, limit } }),
  { limiteInicial: 5, inmediato: false },
)

onMounted(async () => {
  await cargar()
  if (cliente.value) cargarContratos()
})

// ---- Editar (mismo formulario que clientes/index.vue) ----
const modalEditar = ref(false)
const guardando = ref(false)
const formulario = reactive({
  numeroDocumento: '',
  tipoDocumento: 'CC',
  nombreCompleto: '',
  email: '',
  telefono: '',
  direccion: '',
})

function abrirEdicion() {
  error.value = ''
  Object.assign(formulario, {
    numeroDocumento: cliente.value.numeroDocumento,
    tipoDocumento: cliente.value.tipoDocumento,
    nombreCompleto: cliente.value.nombreCompleto,
    email: cliente.value.email,
    telefono: cliente.value.telefono,
    direccion: cliente.value.direccion,
  })
  modalEditar.value = true
}

const formularioValido = computed(
  () =>
    formulario.numeroDocumento.trim().length > 0 &&
    formulario.nombreCompleto.trim().length > 0 &&
    (!formulario.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email)),
)

async function guardar() {
  error.value = ''
  guardando.value = true
  try {
    await useApiFetch(`/clientes/${route.params.id}`, { method: 'PATCH', body: formulario })
    modalEditar.value = false
    await cargar()
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible guardar el cliente.'
  } finally {
    guardando.value = false
  }
}

// ---- Dar de baja / reactivar (ADMIN, mismo patrón que clientes/index.vue) ----
const modalBaja = ref(false)
const procesandoBaja = ref(false)

async function ejecutarBaja() {
  error.value = ''
  procesandoBaja.value = true
  try {
    await useApiFetch(`/clientes/${route.params.id}`, { method: 'PATCH', body: { activo: false } })
    modalBaja.value = false
    await cargar()
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible dar de baja al cliente.'
  } finally {
    procesandoBaja.value = false
  }
}

async function reactivar() {
  error.value = ''
  try {
    await useApiFetch(`/clientes/${route.params.id}`, { method: 'PATCH', body: { activo: true } })
    await cargar()
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible reactivar al cliente.'
  }
}
</script>

<template>
  <div class="max-w-3xl">
    <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
      <div class="flex items-center gap-3">
        <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-left" to="/clientes">Volver</UButton>
        <h1 class="text-xl font-semibold text-slate-900">{{ cliente?.nombreCompleto || 'Cliente' }}</h1>
        <SharedStatusBadge v-if="cliente" domain="activo" :value="cliente.activo" />
      </div>
      <div v-if="cliente && auth.esAdministrador" class="flex gap-2">
        <UButton size="sm" color="gray" variant="soft" icon="i-heroicons-pencil-square" @click="abrirEdicion">
          Editar
        </UButton>
        <UButton
          v-if="cliente.activo"
          size="sm"
          color="red"
          variant="soft"
          icon="i-heroicons-trash"
          @click="modalBaja = true"
        >
          Dar de baja
        </UButton>
        <UButton v-else size="sm" color="emerald" variant="soft" icon="i-heroicons-arrow-path" @click="reactivar">
          Reactivar
        </UButton>
      </div>
    </div>

    <SharedErrorState v-if="error" :message="error" class="mb-4" @retry="cargar" />

    <div v-if="cargando" class="text-center py-16 text-slate-500">Cargando cliente…</div>

    <div v-else-if="cliente" class="space-y-4">
      <UCard>
        <template #header><p class="font-semibold text-slate-900">Datos de contacto</p></template>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <p>
            <span class="text-slate-500">Documento:</span> {{ cliente.tipoDocumento }} {{ cliente.numeroDocumento }}
          </p>
          <p><span class="text-slate-500">Teléfono:</span> {{ cliente.telefono || '—' }}</p>
          <p><span class="text-slate-500">Correo:</span> {{ cliente.email || '—' }}</p>
          <p><span class="text-slate-500">Dirección:</span> {{ cliente.direccion || '—' }}</p>
        </div>
      </UCard>

      <UCard>
        <template #header><p class="font-semibold text-slate-900">Contratos</p></template>
        <UTable
          :rows="contratos"
          :columns="[
            { key: 'inmueble', label: 'Inmueble' },
            { key: 'fechaInicio', label: 'Fecha inicio' },
            { key: 'estado', label: 'Estado' },
            { key: 'acciones', label: '' },
          ]"
          :loading="cargandoContratos"
        >
          <template #inmueble-data="{ row }">{{ row.inmueble?.direccion }} ({{ row.inmueble?.barrio }})</template>
          <template #fechaInicio-data="{ row }">{{ fecha(row.fechaInicio) }}</template>
          <template #estado-data="{ row }">
            <SharedStatusBadge domain="contrato" :value="row.estado" />
          </template>
          <template #acciones-data="{ row }">
            <UButton size="xs" color="amber" variant="soft" icon="i-heroicons-eye" :to="`/contratos/${row.id}`">
              Ver
            </UButton>
          </template>
          <template #empty-state>
            <p class="text-center py-6 text-sm text-slate-400">Sin contratos registrados.</p>
          </template>
        </UTable>
        <div v-if="totalContratos > limitContratos" class="flex justify-end mt-4">
          <UPagination v-model="pageContratos" :page-count="limitContratos" :total="totalContratos" />
        </div>
      </UCard>
    </div>

    <PersonasFormularioPersona
      v-model="modalEditar"
      :formulario="formulario"
      :editando="true"
      :guardando="guardando"
      :valido="formularioValido"
      titulo-creacion="Editar cliente"
      titulo-edicion="Editar cliente"
      label-creacion="Guardar cambios"
      label-edicion="Guardar cambios"
      @guardar="guardar"
    />

    <UiConfirmModal
      v-model="modalBaja"
      title="Dar de baja"
      :message="`¿Confirma dar de baja a ${cliente?.nombreCompleto}?`"
      :loading="procesandoBaja"
      color="red"
      @confirm="ejecutarBaja"
      @cancel="modalBaja = false"
    />
  </div>
</template>
