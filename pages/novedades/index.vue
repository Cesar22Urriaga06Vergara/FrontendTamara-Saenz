<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

const auth = useAuthStore()
const { fecha, moneda } = useFormatoCO()

const modalAbierto = ref(false)
const novedadEnAprobacion = ref<any>(null)
const tipoAprobacion = ref<'CARGO_ARRENDATARIO' | 'GASTO_INMOBILIARIA' | null>(null)
const montoAprobacion = ref(0)
const conceptoAprobacion = ref('')
const aprobando = ref(false)

function abrirAprobacion(row: any, tipo: 'CARGO_ARRENDATARIO' | 'GASTO_INMOBILIARIA') {
  novedadEnAprobacion.value = row
  tipoAprobacion.value = tipo
  montoAprobacion.value = 0
  conceptoAprobacion.value = row.descripcion
  modalAbierto.value = true
}

async function descargarReciboNovedad(row: any) {
  await usePdfDownload(`/documentos/novedades/${row.id}/pdf`, row.consecutivo)
}

async function confirmarAprobacion() {
  if (!novedadEnAprobacion.value || !tipoAprobacion.value) return
  aprobando.value = true
  try {
    const ruta =
      tipoAprobacion.value === 'CARGO_ARRENDATARIO' ? 'aprobar-cargo-arrendatario' : 'aprobar-gasto-inmobiliaria'
    await useApiFetch(`/novedades/${novedadEnAprobacion.value.id}/${ruta}`, {
      method: 'PATCH',
      body: { monto: montoAprobacion.value, concepto: conceptoAprobacion.value },
    })
    modalAbierto.value = false
    error.value = ''
    await cargar()
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible aprobar el impacto financiero de la novedad.'
  } finally {
    aprobando.value = false
  }
}

// Pago real de un gasto de inmobiliaria ya aprobado — separado de la aprobación (NOV-01):
// aprobar NO mueve dinero, solo este paso lo hace, y exige indicar el medio real.
const modalPago = ref(false)
const novedadPagando = ref<any>(null)
const medioPago = ref<'EFECTIVO' | 'TRANSFERENCIA' | ''>('')
const referenciaPago = ref('')
const pagando = ref(false)

function abrirPago(row: any) {
  novedadPagando.value = row
  medioPago.value = ''
  referenciaPago.value = ''
  error.value = ''
  modalPago.value = true
}

async function confirmarPago() {
  if (!novedadPagando.value || !medioPago.value) return
  pagando.value = true
  try {
    await useApiFetch(`/novedades/${novedadPagando.value.id}/pagar-gasto-inmobiliaria`, {
      method: 'PATCH',
      body: { medioPago: medioPago.value, referencia: referenciaPago.value || undefined },
    })
    modalPago.value = false
    error.value = ''
    await cargar()
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible registrar el pago del gasto.'
  } finally {
    pagando.value = false
  }
}

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
    mensajeError: 'No fue posible cargar las novedades.',
  },
)

const columnas = [
  { key: 'consecutivo', label: 'No.' },
  { key: 'inmueble', label: 'Inmueble / Barrio' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'fecha', label: 'Fecha' },
  { key: 'estado', label: 'Estado' },
  { key: 'impactoFinanciero', label: 'Impacto financiero' },
  { key: 'acciones', label: '' },
]

async function cargarBarrios() {
  barrios.value = await useApiFetch<string[]>('/inmuebles/barrios')
}

onMounted(cargarBarrios)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-semibold text-slate-900">Novedades</h1>
      <UButton color="amber" icon="i-heroicons-plus" to="/novedades/nueva"> Registrar novedad </UButton>
    </div>

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
        <template #inmueble-data="{ row }">
          <div>
            <p class="text-slate-900">{{ row.inmueble?.direccion }}</p>
            <p class="text-xs text-slate-500">{{ row.inmueble?.barrio }}</p>
          </div>
        </template>
        <template #fecha-data="{ row }">{{ fecha(row.fecha) }}</template>
        <template #estado-data="{ row }">
          <SharedStatusBadge domain="novedad" :value="row.estado" />
        </template>
        <template #impactoFinanciero-data="{ row }">
          <span class="text-xs text-slate-500">{{ row.impactoFinanciero }}</span>
          <SharedStatusBadge
            v-if="row.impactoFinanciero === 'GASTO_INMOBILIARIA'"
            domain="gastoPagado"
            :value="row.gastoPagado"
            size="xs"
            class="ml-1"
          />
        </template>
        <template #acciones-data="{ row }">
          <div class="flex gap-2">
            <UButton
              size="xs"
              color="gray"
              variant="ghost"
              icon="i-heroicons-document-arrow-down"
              @click="descargarReciboNovedad(row)"
            >
              Recibo
            </UButton>
            <!-- Punto de aprobación financiera: exclusivo Administrador -->
            <template v-if="auth.esAdministrador && row.impactoFinanciero === 'PENDIENTE'">
              <UButton size="xs" color="amber" variant="soft" @click="abrirAprobacion(row, 'CARGO_ARRENDATARIO')">
                Cargo arrendatario
              </UButton>
              <UButton size="xs" color="orange" variant="soft" @click="abrirAprobacion(row, 'GASTO_INMOBILIARIA')">
                Gasto inmobiliaria
              </UButton>
            </template>
            <!-- Pago real del gasto ya aprobado: único paso que mueve dinero (NOV-01) -->
            <UButton
              v-if="auth.esAdministrador && row.impactoFinanciero === 'GASTO_INMOBILIARIA' && !row.gastoPagado"
              size="xs"
              color="red"
              variant="soft"
              icon="i-heroicons-banknotes"
              @click="abrirPago(row)"
            >
              Registrar pago
            </UButton>
          </div>
        </template>
        <template #empty-state>
          <div class="text-center py-10 text-slate-400">
            <UIcon name="i-heroicons-wrench-screwdriver" class="w-10 h-10 mx-auto mb-2" />
            <p>No hay novedades registradas con estos filtros.</p>
          </div>
        </template>
      </UTable>

      <div class="flex justify-end mt-4">
        <UPagination v-model="page" :page-count="limit" :total="total" />
      </div>
    </UCard>

    <SharedErrorState v-if="error" :message="error" class="mt-4" @retry="cargar" />

    <!-- Modal de aprobación financiera — exclusivo Administrador -->
    <UModal v-model="modalAbierto">
      <UCard>
        <template #header>
          <p class="font-semibold text-slate-900">
            {{
              tipoAprobacion === 'CARGO_ARRENDATARIO'
                ? 'Aprobar cargo a arrendatario'
                : 'Aprobar gasto de la inmobiliaria'
            }}
          </p>
        </template>

        <div class="space-y-3">
          <p class="text-sm text-slate-500">
            {{
              tipoAprobacion === 'CARGO_ARRENDATARIO'
                ? 'Se generará una obligación tipo NOVEDAD, cobrable en el próximo recaudo del contrato.'
                : 'El gasto quedará asumido por la inmobiliaria y pendiente de pago. Todavía NO se mueve dinero: el movimiento de caja se genera aparte, al registrar el pago real.'
            }}
          </p>
          <UFormGroup label="Concepto">
            <UInput v-model="conceptoAprobacion" />
          </UFormGroup>
          <UFormGroup label="Monto">
            <UInput v-model.number="montoAprobacion" type="number" />
          </UFormGroup>
          <p class="text-xs text-slate-400">{{ montoAprobacion > 0 ? moneda(montoAprobacion) : '' }}</p>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="modalAbierto = false">Cancelar</UButton>
            <UButton color="amber" :loading="aprobando" :disabled="montoAprobacion <= 0" @click="confirmarAprobacion">
              Confirmar aprobación
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Pago real de un gasto ya aprobado — exclusivo Administrador -->
    <UModal v-model="modalPago">
      <UCard>
        <template #header>
          <p class="font-semibold text-slate-900">Registrar pago del gasto</p>
        </template>

        <div class="space-y-3">
          <p class="text-sm text-slate-500">
            Se generará el movimiento de caja tipo EGRESO por
            <strong>{{ moneda(novedadPagando?.montoAprobado) }}</strong
            >. Este es el único paso que mueve dinero.
          </p>
          <UFormGroup label="Medio de pago">
            <USelectMenu
              v-model="medioPago"
              :options="['EFECTIVO', 'TRANSFERENCIA']"
              placeholder="Selecciona el medio"
            />
          </UFormGroup>
          <UFormGroup v-if="medioPago === 'TRANSFERENCIA'" label="Referencia / número de transacción">
            <UInput v-model="referenciaPago" placeholder="Opcional" />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="modalPago = false">Cancelar</UButton>
            <UButton color="red" :loading="pagando" :disabled="!medioPago" @click="confirmarPago">
              Confirmar pago
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
