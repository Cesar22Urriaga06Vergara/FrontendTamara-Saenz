<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

const auth = useAuthStore()
const { fecha } = useFormatoCO()

const barrios = ref<string[]>([])

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

const columnas = [
  { key: 'cliente', label: 'Arrendatario' },
  { key: 'inmueble', label: 'Inmueble / Barrio' },
  { key: 'fechaInicio', label: 'Fecha inicio' },
  { key: 'estado', label: 'Estado' },
  { key: 'acciones', label: '' },
]

async function cargarBarrios() {
  barrios.value = await useApiFetch<string[]>('/inmuebles/barrios')
}

// ---- Terminar contrato: pide fecha de fin + motivo. Una deuda pendiente NO se
// cancela ni se pierde al terminar — sigue cobrable desde Recaudo (regla de negocio). ----
const modalTerminar = ref(false)
const contratoTerminando = ref<any>(null)
const formTerminar = reactive({ fechaFin: '', motivoTerminacion: '' })
const terminando = ref(false)

function abrirTerminar(row: any) {
  error.value = ''
  contratoTerminando.value = row
  formTerminar.fechaFin = new Date().toISOString().slice(0, 10)
  formTerminar.motivoTerminacion = ''
  modalTerminar.value = true
}

async function confirmarTerminar() {
  if (!contratoTerminando.value) return
  terminando.value = true
  try {
    await useApiFetch(`/contratos/${contratoTerminando.value.id}/terminar`, {
      method: 'PATCH',
      body: { fechaFin: formTerminar.fechaFin, motivoTerminacion: formTerminar.motivoTerminacion },
    })
    modalTerminar.value = false
    await cargar()
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible terminar el contrato.'
  } finally {
    terminando.value = false
  }
}

// ---- Reactivar contrato: única transición TERMINADO → ACTIVO (§6.6), EXCLUSIVA
// Administrador (gate también server-side), motivo obligatorio y trazado en el
// historial del contrato — nunca se pierde la fecha/motivo de la terminación original. ----
const modalReactivar = ref(false)
const contratoReactivando = ref<any>(null)
const formReactivar = reactive({ motivo: '' })
const reactivando = ref(false)

function abrirReactivar(row: any) {
  error.value = ''
  contratoReactivando.value = row
  formReactivar.motivo = ''
  modalReactivar.value = true
}

async function confirmarReactivar() {
  if (!contratoReactivando.value || !formReactivar.motivo) return
  reactivando.value = true
  try {
    await useApiFetch(`/contratos/${contratoReactivando.value.id}/reactivar`, {
      method: 'PATCH',
      body: { motivo: formReactivar.motivo },
    })
    modalReactivar.value = false
    await cargar()
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible reactivar el contrato.'
  } finally {
    reactivando.value = false
  }
}

onMounted(cargarBarrios)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-semibold text-slate-900">Contratos</h1>
      <UButton color="amber" icon="i-heroicons-plus" to="/contratos/nuevo"> Nuevo contrato </UButton>
    </div>

    <UCard class="mb-4">
      <div class="flex flex-wrap gap-3">
        <UInput
          v-model="filtros.busqueda"
          placeholder="Cédula o nombre del arrendatario…"
          icon="i-heroicons-magnifying-glass"
          class="w-64"
        />
        <USelectMenu
          v-model="filtros.barrio"
          :options="['', ...barrios]"
          placeholder="Barrio del inmueble"
          class="w-52"
        />
        <UInput v-model="filtros.fechaDesde" type="date" class="w-40" />
        <UInput v-model="filtros.fechaHasta" type="date" class="w-40" />
        <USelectMenu
          v-model="filtros.estado"
          :options="['', 'ACTIVO', 'TERMINADO']"
          placeholder="Estado"
          class="w-44"
        />
      </div>
    </UCard>

    <UCard>
      <UTable :rows="contratos" :columns="columnas" :loading="cargando">
        <template #cliente-data="{ row }">
          <div>
            <p class="font-medium text-slate-900">{{ row.cliente?.nombreCompleto }}</p>
            <p class="text-xs text-slate-500">{{ row.cliente?.numeroDocumento }}</p>
          </div>
        </template>
        <template #inmueble-data="{ row }">
          <div>
            <p class="text-slate-900">{{ row.inmueble?.direccion }}</p>
            <p class="text-xs text-slate-500">{{ row.inmueble?.barrio }}</p>
          </div>
        </template>
        <template #fechaInicio-data="{ row }">{{ fecha(row.fechaInicio) }}</template>
        <template #estado-data="{ row }">
          <SharedStatusBadge domain="contrato" :value="row.estado" />
        </template>
        <template #acciones-data="{ row }">
          <div class="flex gap-2">
            <UButton size="xs" color="amber" variant="soft" icon="i-heroicons-eye" :to="`/contratos/${row.id}`">
              Ver
            </UButton>
            <UButton v-if="row.estado === 'ACTIVO'" size="xs" color="red" variant="soft" @click="abrirTerminar(row)">
              Terminar
            </UButton>
            <!-- Reactivar: exclusiva Administrador, solo desde TERMINADO (§6.6) -->
            <UButton
              v-if="auth.esAdministrador && row.estado === 'TERMINADO'"
              size="xs"
              color="emerald"
              variant="soft"
              @click="abrirReactivar(row)"
            >
              Reactivar
            </UButton>
          </div>
        </template>
        <template #empty-state>
          <div class="text-center py-10 text-slate-400">
            <UIcon name="i-heroicons-document-text" class="w-10 h-10 mx-auto mb-2" />
            <p>No hay contratos que coincidan con los filtros.</p>
          </div>
        </template>
      </UTable>

      <div class="flex justify-end mt-4">
        <UPagination v-model="page" :page-count="limit" :total="total" />
      </div>
    </UCard>

    <SharedErrorState v-if="error" :message="error" class="mt-4" @retry="cargar" />

    <!-- Terminar contrato -->
    <UModal v-model="modalTerminar">
      <UCard>
        <template #header>
          <p class="font-semibold text-slate-900">Terminar contrato</p>
        </template>
        <div class="space-y-3">
          <UAlert
            color="amber"
            variant="subtle"
            title="Esta acción es irreversible."
            description="Si el contrato tiene saldo pendiente, seguirá siendo cobrable desde Recaudo; no se cancela ni se pierde al terminar."
          />
          <UFormGroup label="Fecha de fin">
            <UInput v-model="formTerminar.fechaFin" type="date" />
          </UFormGroup>
          <UFormGroup label="Motivo de terminación">
            <UTextarea v-model="formTerminar.motivoTerminacion" />
          </UFormGroup>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="modalTerminar = false">Cancelar</UButton>
            <UButton
              color="red"
              :loading="terminando"
              :disabled="!formTerminar.fechaFin || !formTerminar.motivoTerminacion"
              @click="confirmarTerminar"
            >
              Terminar contrato
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Reactivar contrato -->
    <UModal v-model="modalReactivar">
      <UCard>
        <template #header>
          <p class="font-semibold text-slate-900">Reactivar contrato</p>
        </template>
        <div class="space-y-3">
          <UAlert
            color="emerald"
            variant="subtle"
            title="El contrato volverá a ACTIVO."
            description="El inmueble vuelve a quedar ocupado. La fecha y el motivo de la terminación original se conservan en el historial del contrato."
          />
          <UFormGroup label="Motivo de la reactivación">
            <UTextarea v-model="formReactivar.motivo" placeholder="Ej: el cliente decidió continuar el arrendamiento" />
          </UFormGroup>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="modalReactivar = false">Cancelar</UButton>
            <UButton
              color="emerald"
              :loading="reactivando"
              :disabled="!formReactivar.motivo"
              @click="confirmarReactivar"
            >
              Reactivar contrato
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
