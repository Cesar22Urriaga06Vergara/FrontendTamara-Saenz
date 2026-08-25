<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

/** Directorio de Codeudores (soporte N:M con Contrato). Búsqueda estricta por cédula/documento. */
const auth = useAuthStore()
const codeudores = ref<any[]>([])
const cargando = ref(true)
const busqueda = ref('')
const error = ref('')
const page = ref(1)
const limit = ref(10)
const total = ref(0)

const columnas = [
  { key: 'numeroDocumento', label: 'Documento' },
  { key: 'nombreCompleto', label: 'Nombre completo' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'email', label: 'Correo' },
  { key: 'activo', label: 'Estado' },
  { key: 'acciones', label: '' },
]

const modalAbierto = ref(false)
const codeudorEditando = ref<any>(null)
const formulario = reactive({ numeroDocumento: '', tipoDocumento: 'CC', nombreCompleto: '', email: '', telefono: '', direccion: '' })
const guardando = ref(false)

const modalBajaAbierto = ref(false)
const procesandoBaja = ref(false)
const codeudorParaBaja = ref<any>(null)

async function cargar() {
  cargando.value = true
  try {
    if (busqueda.value) {
      // Búsqueda por texto: hasta 20 resultados, sin paginación de servidor.
      codeudores.value = await useApiFetch<any[]>('/codeudores/buscar', { params: { documento: busqueda.value, nombre: busqueda.value } })
      total.value = codeudores.value.length
    } else {
      // Sin búsqueda activa: directorio completo, paginado en servidor.
      const data = await useApiFetch<any>('/codeudores', { params: { page: page.value, limit: limit.value } })
      codeudores.value = data.data
      total.value = data.total
    }
    error.value = ''
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible cargar los codeudores.'
  } finally {
    cargando.value = false
  }
}

function resetearFormulario() {
  Object.assign(formulario, { numeroDocumento: '', tipoDocumento: 'CC', nombreCompleto: '', email: '', telefono: '', direccion: '' })
}

function abrirCreacion() {
  codeudorEditando.value = null
  resetearFormulario()
  modalAbierto.value = true
}

function abrirEdicion(codeudor: any) {
  codeudorEditando.value = codeudor
  Object.assign(formulario, {
    numeroDocumento: codeudor.numeroDocumento,
    tipoDocumento: codeudor.tipoDocumento,
    nombreCompleto: codeudor.nombreCompleto,
    email: codeudor.email,
    telefono: codeudor.telefono,
    direccion: codeudor.direccion,
  })
  modalAbierto.value = true
}

async function guardar() {
  error.value = ''
  guardando.value = true
  try {
    if (codeudorEditando.value) {
      await useApiFetch(`/codeudores/${codeudorEditando.value.id}`, { method: 'PATCH', body: formulario })
    } else {
      await useApiFetch('/codeudores', { method: 'POST', body: formulario })
    }
    modalAbierto.value = false
    resetearFormulario()
    await cargar()
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible guardar el codeudor.'
  } finally {
    guardando.value = false
  }
}

function confirmarBaja(codeudor: any) {
  codeudorParaBaja.value = codeudor
  modalBajaAbierto.value = true
}

async function ejecutarBaja() {
  error.value = ''
  procesandoBaja.value = true
  try {
    await useApiFetch(`/codeudores/${codeudorParaBaja.value.id}`, { method: 'PATCH', body: { activo: false } })
    modalBajaAbierto.value = false
    await cargar()
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible dar de baja al codeudor.'
  } finally {
    procesandoBaja.value = false
  }
}

async function alternarActivo(codeudor: any) {
  error.value = ''
  try {
    await useApiFetch(`/codeudores/${codeudor.id}`, { method: 'PATCH', body: { activo: true } })
    await cargar()
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible reactivar al codeudor.'
  }
}

const formularioValido = computed(
  () =>
    formulario.numeroDocumento.trim().length > 0 &&
    formulario.nombreCompleto.trim().length > 0 &&
    (!formulario.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email)),
)

watch(busqueda, () => {
  page.value = 1
  cargar()
})
watch(page, cargar)
onMounted(cargar)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-semibold text-slate-900">Codeudores</h1>
      <UButton color="amber" icon="i-heroicons-plus" @click="abrirCreacion">Nuevo codeudor</UButton>
    </div>

    <SharedErrorState v-if="error" :message="error" class="mb-4" @retry="cargar" />

    <UCard class="mb-4">
      <UInput v-model="busqueda" placeholder="Buscar por cédula o nombre…" icon="i-heroicons-magnifying-glass" class="w-72" />
    </UCard>

    <UCard>
      <UTable :rows="codeudores" :columns="columnas" :loading="cargando">
        <template #activo-data="{ row }">
          <SharedStatusBadge domain="activo" :value="row.activo" />
        </template>
        <template #acciones-data="{ row }">
          <UiTableRowActions
            v-if="auth.esAdministrador"
            :activo="row.activo"
            @editar="abrirEdicion(row)"
            @baja="confirmarBaja(row)"
            @reactivar="alternarActivo(row)"
          />
        </template>
        <template #empty-state>
          <div class="text-center py-10 text-slate-400">
            <UIcon name="i-heroicons-user-plus" class="w-10 h-10 mx-auto mb-2" />
            <p>No hay codeudores que coincidan con la búsqueda.</p>
          </div>
        </template>
      </UTable>

      <div v-if="!busqueda" class="flex justify-end mt-4">
        <UPagination v-model="page" :page-count="limit" :total="total" />
      </div>
    </UCard>

    <UModal v-model="modalAbierto">
      <UCard>
        <template #header>
          <p class="font-semibold text-slate-900">{{ codeudorEditando ? 'Editar codeudor' : 'Nuevo codeudor' }}</p>
        </template>
        <div class="grid grid-cols-2 gap-3">
          <UFormGroup label="Tipo documento">
            <USelectMenu v-model="formulario.tipoDocumento" :options="['CC', 'CE', 'NIT', 'PAS']" />
          </UFormGroup>
          <UFormGroup label="Número documento" required>
            <UInput v-model="formulario.numeroDocumento" />
          </UFormGroup>
          <UFormGroup label="Nombre completo" class="col-span-2" required>
            <UInput v-model="formulario.nombreCompleto" />
          </UFormGroup>
          <UFormGroup label="Correo">
            <UInput v-model="formulario.email" type="email" />
          </UFormGroup>
          <UFormGroup label="Teléfono">
            <UInput v-model="formulario.telefono" />
          </UFormGroup>
          <UFormGroup label="Dirección" class="col-span-2">
            <UInput v-model="formulario.direccion" />
          </UFormGroup>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="modalAbierto = false">Cancelar</UButton>
            <UButton color="amber" :loading="guardando" :disabled="!formularioValido" @click="guardar">
              {{ codeudorEditando ? 'Guardar cambios' : 'Crear codeudor' }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <UiConfirmModal
      v-model="modalBajaAbierto"
      title="Dar de baja"
      :message="`¿Confirma dar de baja a ${codeudorParaBaja?.nombreCompleto}?`"
      :loading="procesandoBaja"
      color="red"
      @confirm="ejecutarBaja"
      @cancel="modalBajaAbierto = false"
    />
  </div>
</template>
