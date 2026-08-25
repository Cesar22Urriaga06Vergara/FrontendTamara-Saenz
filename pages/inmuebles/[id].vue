<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

/** Detalle de un inmueble: datos del inmueble + historial de contratos sobre él. */
const route = useRoute()
const auth = useAuthStore()
const { moneda, fecha } = useFormatoCO()

const cargando = ref(true)
const inmueble = ref<any>(null)
const error = ref('')

async function cargar() {
  cargando.value = true
  try {
    inmueble.value = await useApiFetch<any>(`/inmuebles/${route.params.id}`)
    definirTituloDinamico(inmueble.value.direccion)
    error.value = ''
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible cargar el inmueble.'
  } finally {
    cargando.value = false
  }
}

// `inmuebleId` sí es un filtro soportado por GET /contratos (a diferencia de clienteId).
const {
  page: pageContratos,
  limit: limitContratos,
  total: totalContratos,
  lista: contratos,
  cargando: cargandoContratos,
  cargar: cargarContratos,
} = useListadoPaginado<any>(
  ({ page, limit }) => useApiFetch<any>('/contratos', { params: { inmuebleId: route.params.id, page, limit } }),
  { limiteInicial: 5, inmediato: false },
)

onMounted(async () => {
  await cargar()
  cargarContratos()
})

// Mismo criterio que pages/inmuebles/index.vue (§ estado editable) — MANTENIMIENTO/INACTIVO
// se alternan libremente; DISPONIBLE solo se ofrece viniendo de esos dos, nunca desde OCUPADO
// (OCUPADO lo controla exclusivamente el motor de estados de Contratos, CONT-03).
const estadosEditables = ['MANTENIMIENTO', 'INACTIVO']
const opcionesEstado = computed(() => {
  if (!inmueble.value) return []
  const opciones = [inmueble.value.estado, ...estadosEditables.filter((e) => e !== inmueble.value.estado)]
  if (inmueble.value.estado === 'MANTENIMIENTO' || inmueble.value.estado === 'INACTIVO') opciones.push('DISPONIBLE')
  return opciones
})

// ---- Editar ----
const modalEditar = ref(false)
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

function abrirEdicion() {
  error.value = ''
  Object.assign(formulario, {
    direccion: inmueble.value.direccion,
    barrio: inmueble.value.barrio,
    canonValor: Number(inmueble.value.canonValor),
    depositoValor: inmueble.value.depositoValor != null ? Number(inmueble.value.depositoValor) : 0,
    codigoEnergia: inmueble.value.codigoEnergia || '',
    codigoAgua: inmueble.value.codigoAgua || '',
    codigoGas: inmueble.value.codigoGas || '',
    observaciones: inmueble.value.observaciones || '',
    estado: inmueble.value.estado,
  })
  modalEditar.value = true
}

async function guardar() {
  error.value = ''
  guardando.value = true
  try {
    const body: Record<string, any> = {
      direccion: formulario.direccion,
      barrio: formulario.barrio,
      codigoEnergia: formulario.codigoEnergia || undefined,
      codigoAgua: formulario.codigoAgua || undefined,
      codigoGas: formulario.codigoGas || undefined,
      observaciones: formulario.observaciones || undefined,
    }
    // RDN-06: solo Administrador puede cambiar canon/depósito (ver pages/inmuebles/index.vue).
    if (auth.esAdministrador) {
      body.canonValor = formulario.canonValor
      body.depositoValor = formulario.depositoValor
    }
    if (opcionesEstado.value.includes(formulario.estado) && formulario.estado !== inmueble.value.estado) {
      body.estado = formulario.estado
    }
    await useApiFetch(`/inmuebles/${route.params.id}`, { method: 'PATCH', body })
    modalEditar.value = false
    await cargar()
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible guardar el inmueble.'
  } finally {
    guardando.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl">
    <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
      <div class="flex items-center gap-3">
        <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-left" to="/inmuebles">Volver</UButton>
        <h1 class="text-xl font-semibold text-slate-900">{{ inmueble?.direccion || 'Inmueble' }}</h1>
        <SharedStatusBadge v-if="inmueble" domain="inmueble" :value="inmueble.estado" />
      </div>
      <UButton
        v-if="inmueble"
        size="sm"
        color="gray"
        variant="soft"
        icon="i-heroicons-pencil-square"
        @click="abrirEdicion"
      >
        Editar
      </UButton>
    </div>

    <SharedErrorState v-if="error" :message="error" class="mb-4" @retry="cargar" />

    <div v-if="cargando" class="text-center py-16 text-slate-500">Cargando inmueble…</div>

    <div v-else-if="inmueble" class="space-y-4">
      <UCard>
        <template #header><p class="font-semibold text-slate-900">Datos del inmueble</p></template>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <p><span class="text-slate-500">Barrio:</span> {{ inmueble.barrio }}</p>
          <p><span class="text-slate-500">Consecutivo:</span> {{ inmueble.consecutivo || '—' }}</p>
          <p><span class="text-slate-500">Canon:</span> {{ moneda(inmueble.canonValor) }}</p>
          <p>
            <span class="text-slate-500">Depósito:</span>
            {{ inmueble.depositoValor != null ? moneda(inmueble.depositoValor) : '—' }}
          </p>
          <p><span class="text-slate-500">Energía:</span> {{ inmueble.codigoEnergia || 'No registrado' }}</p>
          <p><span class="text-slate-500">Agua:</span> {{ inmueble.codigoAgua || 'No registrado' }}</p>
          <p><span class="text-slate-500">Gas:</span> {{ inmueble.codigoGas || 'No registrado' }}</p>
          <p v-if="inmueble.observaciones" class="col-span-2">
            <span class="text-slate-500">Observaciones:</span> {{ inmueble.observaciones }}
          </p>
        </div>
      </UCard>

      <UCard>
        <template #header><p class="font-semibold text-slate-900">Historial de contratos</p></template>
        <UTable
          :rows="contratos"
          :columns="[
            { key: 'cliente', label: 'Arrendatario' },
            { key: 'fechaInicio', label: 'Fecha inicio' },
            { key: 'estado', label: 'Estado' },
            { key: 'acciones', label: '' },
          ]"
          :loading="cargandoContratos"
        >
          <template #cliente-data="{ row }">{{ row.cliente?.nombreCompleto }}</template>
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
            <p class="text-center py-6 text-sm text-slate-400">Sin contratos registrados sobre este inmueble.</p>
          </template>
        </UTable>
        <div v-if="totalContratos > limitContratos" class="flex justify-end mt-4">
          <UPagination v-model="pageContratos" :page-count="limitContratos" :total="totalContratos" />
        </div>
      </UCard>
    </div>

    <UModal v-model="modalEditar">
      <UCard>
        <template #header>
          <p class="font-semibold text-slate-900">Editar inmueble</p>
        </template>
        <div class="grid grid-cols-2 gap-3">
          <UFormGroup label="Dirección" class="col-span-2">
            <UInput v-model="formulario.direccion" />
          </UFormGroup>
          <UFormGroup label="Barrio">
            <UInput v-model="formulario.barrio" />
          </UFormGroup>
          <UFormGroup label="Estado">
            <USelectMenu v-model="formulario.estado" :options="opcionesEstado" />
          </UFormGroup>
          <template v-if="auth.esAdministrador">
            <UFormGroup label="Canon">
              <UiMoneyInput v-model="formulario.canonValor" />
            </UFormGroup>
            <UFormGroup label="Depósito">
              <UiMoneyInput v-model="formulario.depositoValor" />
            </UFormGroup>
          </template>
          <p v-else class="col-span-2 text-xs text-slate-500">
            Canon: {{ moneda(formulario.canonValor) }} · Depósito: {{ moneda(formulario.depositoValor) }} — solo
            Administrador puede modificarlos.
          </p>
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
            <UButton color="gray" variant="ghost" @click="modalEditar = false">Cancelar</UButton>
            <UButton color="amber" :loading="guardando" @click="guardar">Guardar cambios</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
