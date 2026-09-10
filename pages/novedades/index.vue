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

const descargandoRecibo = ref<string | null>(null)
async function descargarReciboNovedad(row: any) {
  descargandoRecibo.value = row.id
  try {
    await usePdfDownload(`/documentos/novedades/${row.id}/pdf`, row.consecutivo)
  } finally {
    descargandoRecibo.value = null
  }
}

// ---- Cambiar estado del tablero (ABIERTA -> EN_SEGUIMIENTO -> CERRADA / ANULADA) ----
// El backend acepta cualquier estado destino mientras la novedad no esté ya concluida
// (`cambiarEstado`, novedades.service.ts), pero aquí solo se ofrecen las transiciones hacia
// adelante que documenta el propio tablero — nunca retroceder a un estado anterior. CERRAR/
// ANULAR con impactoFinanciero PENDIENTE queda oculto para Recepcionista (RDN-07), igual que
// el backend lo rechazaría con 403 si se forzara.
const modalEstado = ref(false)
const novedadCambiandoEstado = ref<any>(null)
const nuevoEstado = ref('')
const cambiandoEstado = ref(false)

function opcionesEstado(row: any | null): string[] {
  if (!row) return []
  const puedeConcluir = auth.esAdministrador || row.impactoFinanciero !== 'PENDIENTE'
  if (row.estado === 'ABIERTA') return puedeConcluir ? ['EN_SEGUIMIENTO', 'CERRADA', 'ANULADA'] : ['EN_SEGUIMIENTO']
  if (row.estado === 'EN_SEGUIMIENTO') return puedeConcluir ? ['CERRADA', 'ANULADA'] : []
  return []
}

function abrirCambiarEstado(row: any) {
  novedadCambiandoEstado.value = row
  nuevoEstado.value = ''
  error.value = ''
  modalEstado.value = true
}

async function confirmarCambiarEstado() {
  if (!novedadCambiandoEstado.value || !nuevoEstado.value) return
  cambiandoEstado.value = true
  try {
    await useApiFetch(`/novedades/${novedadCambiandoEstado.value.id}/estado`, {
      method: 'PATCH',
      body: { estado: nuevoEstado.value },
    })
    modalEstado.value = false
    error.value = ''
    await cargar()
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible cambiar el estado de la novedad.'
  } finally {
    cambiandoEstado.value = false
  }
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

// Revertir una aprobación financiera mal hecha, siempre que aún no se haya materializado en
// dinero (UX-NOV-01). El backend valida las precondiciones exactas y responde 400 con un
// mensaje claro si el cargo ya tiene pagos o el gasto ya fue pagado.
const modalRevertir = ref(false)
const novedadRevirtiendo = ref<any>(null)
const motivoRevertir = ref('')
const revirtiendo = ref(false)

function puedeRevertirAprobacion(row: any): boolean {
  return (
    row.impactoFinanciero === 'CARGO_ARRENDATARIO' ||
    (row.impactoFinanciero === 'GASTO_INMOBILIARIA' && !row.gastoPagado)
  )
}

function abrirRevertir(row: any) {
  novedadRevirtiendo.value = row
  motivoRevertir.value = ''
  error.value = ''
  modalRevertir.value = true
}

async function confirmarRevertir() {
  if (!novedadRevirtiendo.value || !motivoRevertir.value.trim()) return
  revirtiendo.value = true
  try {
    await useApiFetch(`/novedades/${novedadRevirtiendo.value.id}/revertir-aprobacion`, {
      method: 'PATCH',
      body: { motivo: motivoRevertir.value.trim() },
    })
    modalRevertir.value = false
    error.value = ''
    await cargar()
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible revertir la aprobación de la novedad.'
  } finally {
    revirtiendo.value = false
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
  // `key` sin puntos a propósito: un key anidado ("contrato.cliente.nombreCompleto") hace que
  // Vue interprete el punto del nombre del slot `#key-data` como un modificador de v-slot
  // (inválido, `vue/valid-v-slot`) — se resuelve el valor a mano en el slot de abajo.
  { key: 'clienteNombre', label: 'Cliente' },
  // Dirección + Barrio fusionadas en una sola columna ("Inmueble") — 2 columnas angostas por
  // separado sumaban más ancho que una sola con el mismo texto, y era la causa principal (junto
  // con Acciones) de que la tabla necesitara scroll horizontal en pantallas normales. `key` sin
  // puntos por la misma razón que `clienteNombre` (arriba): un key anidado rompe el nombre del
  // slot `#key-data`.
  { key: 'inmuebleTexto', label: 'Inmueble' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'fecha', label: 'Fecha' },
  { key: 'estado', label: 'Estado' },
  { key: 'impactoFinanciero', label: 'Impacto financiero' },
  { key: 'acciones', label: 'Acciones' },
]

// Acciones de aprobación/estado/pago colapsadas en un menú (mismo patrón que la columna
// Acciones de /recibos: un botón primario visible + un UDropdown para el resto) — antes eran
// hasta 4 botones con texto simultáneos (Administrador + novedad PENDIENTE), la causa principal
// del scroll horizontal en esta tabla. "Ver recibo" es la única acción que todos los roles usan
// siempre, por eso es la que se queda como botón visible; el resto es condicional por rol/estado.
function accionesNovedad(row: any): Array<Array<{ label: string; icon: string; click: () => void }>> {
  const grupos: Array<Array<{ label: string; icon: string; click: () => void }>> = []

  if (opcionesEstado(row).length) {
    grupos.push([{ label: 'Cambiar estado', icon: 'i-heroicons-arrow-path', click: () => abrirCambiarEstado(row) }])
  }

  const financieras: Array<{ label: string; icon: string; click: () => void }> = []
  if (auth.esAdministrador && row.impactoFinanciero === 'PENDIENTE') {
    financieras.push(
      {
        label: 'Cargo arrendatario',
        icon: 'i-heroicons-document-currency-dollar',
        click: () => abrirAprobacion(row, 'CARGO_ARRENDATARIO'),
      },
      {
        label: 'Gasto inmobiliaria',
        icon: 'i-heroicons-building-office-2',
        click: () => abrirAprobacion(row, 'GASTO_INMOBILIARIA'),
      },
    )
  }
  if (auth.esAdministrador && row.impactoFinanciero === 'GASTO_INMOBILIARIA' && !row.gastoPagado) {
    financieras.push({ label: 'Registrar pago', icon: 'i-heroicons-banknotes', click: () => abrirPago(row) })
  }
  if (auth.esAdministrador && puedeRevertirAprobacion(row)) {
    financieras.push({
      label: 'Revertir aprobación',
      icon: 'i-heroicons-arrow-uturn-left',
      click: () => abrirRevertir(row),
    })
  }
  if (financieras.length) grupos.push(financieras)

  return grupos
}

async function cargarBarrios() {
  barrios.value = await useApiFetch<string[]>('/inmuebles/barrios')
}

onMounted(cargarBarrios)
</script>

<template>
  <div class="space-y-5">
    <header class="surface-card overflow-hidden px-5 py-4 sm:px-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-600">Operación</p>
          <h2 class="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Novedades</h2>
        </div>

        <div class="flex items-center gap-3">
          <div class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600">
            <span class="font-medium text-slate-700">{{ total }} registros</span>
          </div>
          <UButton color="amber" icon="i-heroicons-plus" to="/novedades/nueva" class="!rounded-xl">Registrar novedad</UButton>
        </div>
      </div>
    </header>

    <div class="surface-card p-4 sm:p-5">
      <div class="mb-3 flex items-center justify-between gap-2">
        <p class="text-sm font-semibold text-slate-900">Filtros</p>
        <p class="text-xs text-slate-500">Ajusta la operación del tablero</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <USelectMenu
          v-model="filtros.barrio"
          :options="['', ...barrios]"
          placeholder="Barrio del inmueble"
          class="w-full sm:w-52"
        />
        <USelectMenu
          v-model="filtros.estado"
          :options="['', 'ABIERTA', 'EN_SEGUIMIENTO', 'CERRADA', 'ANULADA']"
          placeholder="Estado"
          class="w-full sm:w-48"
        />
        <UInput v-model="filtros.fechaDesde" type="date" class="w-full sm:w-40" />
        <UInput v-model="filtros.fechaHasta" type="date" class="w-full sm:w-40" />
      </div>
    </div>

    <div class="surface-card overflow-hidden">
      <UTable
        :rows="novedades"
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
        <template #clienteNombre-data="{ row }">
          {{ row.contrato?.cliente?.nombreCompleto ?? '—' }}
        </template>
        <template #inmuebleTexto-data="{ row }">
          {{ row.inmueble?.direccion ?? '' }} <span class="text-slate-400">({{ row.inmueble?.barrio ?? '' }})</span>
        </template>
        <template #fecha-data="{ row }">{{ fecha(row.fecha) }}</template>
        <template #estado-data="{ row }">
          <SharedStatusBadge domain="novedad" :value="row.estado" />
        </template>
        <template #impactoFinanciero-data="{ row }">
          <div class="flex flex-wrap items-center gap-1.5">
            <SharedStatusBadge domain="impactoFinanciero" :value="row.impactoFinanciero" size="xs" />
            <SharedStatusBadge
              v-if="row.impactoFinanciero === 'GASTO_INMOBILIARIA'"
              domain="gastoPagado"
              :value="row.gastoPagado"
              size="xs"
            />
          </div>
        </template>
        <template #acciones-data="{ row }">
          <div class="flex items-center gap-1.5">
            <UButton
              size="xs"
              color="gray"
              variant="ghost"
              icon="i-heroicons-eye"
              :loading="descargandoRecibo === row.id"
              @click="descargarReciboNovedad(row)"
            >
              Ver recibo
            </UButton>
            <UDropdown v-if="accionesNovedad(row).length" :items="accionesNovedad(row)">
              <UButton
                size="xs"
                color="gray"
                variant="soft"
                icon="i-heroicons-ellipsis-horizontal"
                aria-label="Más acciones"
              />
            </UDropdown>
          </div>
        </template>
        <template #empty-state>
          <div class="py-12 text-center text-slate-400">
            <UIcon name="i-heroicons-wrench-screwdriver" class="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <p>No hay novedades registradas con estos filtros.</p>
          </div>
        </template>
      </UTable>

      <div class="flex justify-end border-t border-slate-200 bg-slate-50/80 px-4 py-3">
        <UPagination v-model="page" :page-count="limit" :total="total" />
      </div>
    </div>

    <SharedErrorState v-if="error" :message="error" class="mt-4" @retry="cargar" />

    <!-- Modal de aprobación financiera — exclusivo Administrador -->
    <UModal v-model="modalAbierto">
      <UCard :ui="{ root: 'overflow-hidden rounded-2xl border border-slate-200 shadow-[0_28px_60px_-32px_rgba(15,23,42,0.7)]', body: { base: 'p-5 sm:p-6' }, header: { base: 'border-b border-slate-200 px-0 pb-4' }, footer: { base: 'border-t border-slate-200 px-0 pt-4' } }">
        <template #header>
          <div class="flex items-center gap-3">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
              <UIcon name="i-heroicons-document-currency-dollar" class="h-5 w-5 text-amber-600" />
            </span>
            <p class="font-semibold text-slate-900">
              {{
                tipoAprobacion === 'CARGO_ARRENDATARIO'
                  ? 'Aprobar cargo a arrendatario'
                  : 'Aprobar gasto de la inmobiliaria'
              }}
            </p>
          </div>
        </template>

        <div class="space-y-3">
          <p class="text-sm leading-6 text-slate-500">
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
            <UiMoneyInput v-model="montoAprobacion" />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="modalAbierto = false">Cancelar</UButton>
            <UButton
              color="amber"
              :loading="aprobando"
              :disabled="montoAprobacion <= 0 || !conceptoAprobacion.trim()"
              @click="confirmarAprobacion"
            >
              Confirmar aprobación
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Pago real de un gasto ya aprobado — exclusivo Administrador -->
    <UModal v-model="modalPago">
      <UCard :ui="{ root: 'overflow-hidden rounded-2xl border border-slate-200 shadow-[0_28px_60px_-32px_rgba(15,23,42,0.7)]', body: { base: 'p-5 sm:p-6' }, header: { base: 'border-b border-slate-200 px-0 pb-4' }, footer: { base: 'border-t border-slate-200 px-0 pt-4' } }">
        <template #header>
          <div class="flex items-center gap-3">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <UIcon name="i-heroicons-banknotes" class="h-5 w-5 text-red-600" />
            </span>
            <p class="font-semibold text-slate-900">Registrar pago del gasto</p>
          </div>
        </template>

        <div class="space-y-3">
          <p class="text-sm leading-6 text-slate-500">
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

    <!-- Revertir una aprobación financiera aún no materializada en dinero — exclusivo Administrador -->
    <UModal v-model="modalRevertir">
      <UCard :ui="{ root: 'overflow-hidden rounded-2xl border border-slate-200 shadow-[0_28px_60px_-32px_rgba(15,23,42,0.7)]', body: { base: 'p-5 sm:p-6' }, header: { base: 'border-b border-slate-200 px-0 pb-4' }, footer: { base: 'border-t border-slate-200 px-0 pt-4' } }">
        <template #header>
          <div class="flex items-center gap-3">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <UIcon name="i-heroicons-arrow-uturn-left" class="h-5 w-5 text-slate-600" />
            </span>
            <p class="font-semibold text-slate-900">Revertir aprobación</p>
          </div>
        </template>

        <div class="space-y-3">
          <p class="text-sm leading-6 text-slate-500">
            La novedad vuelve a <strong>impacto financiero pendiente</strong> para poder re-emitir el cargo o el gasto
            correcto. Solo procede si aún no se materializó en dinero: si el cargo ya tiene pagos, revierte el pago
            desde Recaudo primero; si el gasto ya fue pagado, revierte el movimiento desde Movimientos.
          </p>
          <UFormGroup label="Motivo" required>
            <UTextarea v-model="motivoRevertir" placeholder="Por qué se revierte esta aprobación" />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="modalRevertir = false">Cancelar</UButton>
            <UButton color="amber" :loading="revirtiendo" :disabled="!motivoRevertir.trim()" @click="confirmarRevertir">
              Revertir aprobación
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Cambiar estado del tablero -->
    <UModal v-model="modalEstado">
      <UCard :ui="{ root: 'overflow-hidden rounded-2xl border border-slate-200 shadow-[0_28px_60px_-32px_rgba(15,23,42,0.7)]', body: { base: 'p-5 sm:p-6' }, header: { base: 'border-b border-slate-200 px-0 pb-4' }, footer: { base: 'border-t border-slate-200 px-0 pt-4' } }">
        <template #header>
          <div class="flex items-center gap-3">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
              <UIcon name="i-heroicons-arrow-path" class="h-5 w-5 text-amber-600" />
            </span>
            <p class="font-semibold text-slate-900">Cambiar estado de la novedad</p>
          </div>
        </template>

        <div class="space-y-3">
          <p class="text-sm text-slate-500">
            Estado actual:
            <SharedStatusBadge domain="novedad" :value="novedadCambiandoEstado?.estado" size="xs" class="ml-1" />
          </p>
          <UFormGroup label="Nuevo estado">
            <USelectMenu v-model="nuevoEstado" :options="opcionesEstado(novedadCambiandoEstado)" />
          </UFormGroup>
          <UAlert
            v-if="nuevoEstado === 'CERRADA' || nuevoEstado === 'ANULADA'"
            color="amber"
            variant="subtle"
            title="Esta acción concluye la novedad."
            description="Una novedad CERRADA o ANULADA no admite más cambios de estado."
          />
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="modalEstado = false">Cancelar</UButton>
            <UButton color="amber" :loading="cambiandoEstado" :disabled="!nuevoEstado" @click="confirmarCambiarEstado">
              Confirmar
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
