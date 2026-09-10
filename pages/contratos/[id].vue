<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

/**
 * Detalle de un contrato. `GET /contratos/:id` es visible para cualquier rol autenticado
 * (datos del arrendatario/inmueble/codeudores), pero ficha financiera, historial de recibos e
 * historial de cambios de estado son EXCLUSIVO Administrador en el backend (`@Roles`) — esas
 * secciones ni siquiera se piden si el usuario no es Administrador, para no disparar 403s.
 */
const route = useRoute()
const auth = useAuthStore()
const { moneda, fecha } = useFormatoCO()

const cargando = ref(true)
const contrato = ref<any>(null)
const error = ref('')

async function cargar() {
  cargando.value = true
  try {
    contrato.value = await useApiFetch<any>(`/contratos/${route.params.id}`)
    definirTituloDinamico(`Contrato — ${contrato.value.cliente?.nombreCompleto ?? ''}`)
    error.value = ''
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible cargar el contrato.'
  } finally {
    cargando.value = false
  }
}

// ---- Ficha financiera (saldo a favor, depósito, obligaciones pendientes) ----
const cargandoFicha = ref(false)
const ficha = ref<any>(null)
const errorFicha = ref('')

const carteraPendiente = computed(() =>
  (ficha.value?.obligacionesPendientes ?? []).reduce(
    (s: number, o: any) => s + (Number(o.valorOriginal) - Number(o.valorAbonado)),
    0,
  ),
)

async function cargarFicha() {
  if (!auth.esAdministrador) return
  cargandoFicha.value = true
  try {
    ficha.value = await useApiFetch<any>(`/contratos/${route.params.id}/ficha-recaudo`)
    errorFicha.value = ''
  } catch (e: any) {
    errorFicha.value = e?.data?.message || 'No fue posible cargar la ficha financiera.'
  } finally {
    cargandoFicha.value = false
  }
}

// ---- Historial de cambios de estado ----
const cargandoHistorial = ref(false)
const historial = ref<any[]>([])

async function cargarHistorial() {
  if (!auth.esAdministrador) return
  cargandoHistorial.value = true
  try {
    historial.value = await useApiFetch<any[]>(`/contratos/${route.params.id}/historial`)
  } catch {
    // No bloquea el resto de la página — el historial es un complemento, no el dato principal.
  } finally {
    cargandoHistorial.value = false
  }
}

// ---- Recibos del contrato ----
const {
  page: pageRecibos,
  limit: limitRecibos,
  total: totalRecibos,
  lista: recibos,
  cargando: cargandoRecibos,
  cargar: cargarRecibos,
} = useListadoPaginado<any>(
  ({ page, limit }) => useApiFetch<any>(`/recaudo/contrato/${route.params.id}/recibos`, { params: { page, limit } }),
  { limiteInicial: 5, inmediato: false },
)

function cargarSeccionesAdmin() {
  cargarFicha()
  cargarHistorial()
  cargarRecibos()
}

onMounted(async () => {
  await cargar()
  if (auth.esAdministrador) cargarSeccionesAdmin()
})

// ---- Terminar / reactivar (modales compartidos con el listado) ----
const modalTerminar = ref(false)
const modalReactivar = ref(false)

function recargarTrasCambio() {
  cargar()
  if (auth.esAdministrador) {
    cargarFicha()
    cargarHistorial()
  }
}

const recibosColumnas = [
  { key: 'consecutivo', label: 'Número' },
  { key: 'creadoEn', label: 'Fecha', class: 'whitespace-nowrap', rowClass: 'whitespace-nowrap' },
  {
    key: 'valorTotal',
    label: 'Valor',
    class: 'whitespace-nowrap',
    rowClass: 'whitespace-nowrap text-right tabular-nums',
  },
  { key: 'estado', label: 'Estado', class: 'whitespace-nowrap', rowClass: 'whitespace-nowrap text-center' },
  { key: 'acciones', label: '', class: 'whitespace-nowrap', rowClass: 'whitespace-nowrap' },
]
</script>

<template>
  <div class="max-w-6xl space-y-5">
    <header class="surface-card px-5 py-4 sm:px-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-start gap-3">
          <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-left" to="/contratos">Volver</UButton>
          <div>
            <p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-600">Contrato</p>
            <div v-if="contrato" class="mt-2 flex items-center gap-2">
              <p class="text-xl font-semibold text-slate-900">{{ contrato.cliente?.nombreCompleto }}</p>
              <SharedStatusBadge domain="contrato" :value="contrato.estado" />
            </div>
          </div>
        </div>

        <div v-if="contrato" class="flex flex-wrap gap-2">
          <UButton
            v-if="contrato.estado === 'ACTIVO' && auth.esAdministrador"
            size="sm"
            color="amber"
            icon="i-heroicons-banknotes"
            :to="`/recaudo?contratoId=${contrato.id}`"
          >
            Ir a Recaudo
          </UButton>
          <UButton v-if="contrato.estado === 'ACTIVO'" size="sm" color="red" variant="soft" @click="modalTerminar = true">
            Terminar
          </UButton>
          <UButton
            v-if="auth.esAdministrador && contrato.estado === 'TERMINADO'"
            size="sm"
            color="emerald"
            variant="soft"
            @click="modalReactivar = true"
          >
            Reactivar
          </UButton>
        </div>
      </div>
    </header>

    <SharedErrorState v-if="error" :message="error" class="mb-4" @retry="cargar" />

    <div v-if="cargando" class="py-16 text-center text-slate-500">Cargando contrato…</div>

    <div v-else-if="contrato" class="space-y-5">
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div class="surface-card p-4">
          <p class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Canon</p>
          <p class="mt-3 text-2xl font-semibold tabular-nums text-slate-900">{{ moneda(contrato.canonValor) }}</p>
        </div>
        <div class="surface-card p-4">
          <p class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Fecha inicio</p>
          <p class="mt-3 text-lg font-semibold text-slate-900">{{ fecha(contrato.fechaInicio) }}</p>
        </div>
        <div class="surface-card p-4">
          <p class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Día de pago</p>
          <p class="mt-3 text-lg font-semibold text-slate-900">{{ contrato.diaPago }}</p>
        </div>
        <div class="surface-card p-4">
          <p class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Inmueble</p>
          <p class="mt-3 text-base font-semibold text-slate-900">{{ contrato.inmueble?.direccion || '—' }}</p>
        </div>
      </div>

      <div class="surface-card p-4 sm:p-5">
        <p class="mb-4 font-semibold text-slate-900">Datos del contrato</p>
        <dl class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <dt class="text-xs font-medium uppercase tracking-wide text-slate-400">Arrendatario</dt>
            <dd class="mt-1 text-sm text-slate-900">{{ contrato.cliente?.nombreCompleto }}</dd>
            <dd class="text-xs text-slate-500">{{ contrato.cliente?.numeroDocumento }}</dd>
          </div>
          <div>
            <dt class="text-xs font-medium uppercase tracking-wide text-slate-400">Dirección</dt>
            <dd class="mt-1 text-sm text-slate-900">{{ contrato.inmueble?.direccion }}</dd>
          </div>
          <div>
            <dt class="text-xs font-medium uppercase tracking-wide text-slate-400">Barrio</dt>
            <dd class="mt-1 text-sm text-slate-900">{{ contrato.inmueble?.barrio || '—' }}</dd>
          </div>
          <div>
            <dt class="text-xs font-medium uppercase tracking-wide text-slate-400">Fecha de fin</dt>
            <dd class="mt-1 text-sm text-slate-900">{{ contrato.fechaFin ? fecha(contrato.fechaFin) : '—' }}</dd>
          </div>
          <div v-if="contrato.motivoTerminacion" class="sm:col-span-2 xl:col-span-4">
            <dt class="text-xs font-medium uppercase tracking-wide text-slate-400">Motivo de terminación</dt>
            <dd class="mt-1 text-sm text-slate-900">{{ contrato.motivoTerminacion }}</dd>
          </div>
        </dl>
      </div>

      <div class="grid items-start gap-4 lg:grid-cols-2">
        <div class="surface-card p-4 sm:p-5">
          <p class="mb-3 font-semibold text-slate-900">Codeudores</p>
          <p v-if="!contrato.codeudores?.length" class="text-sm text-slate-400">Sin codeudores registrados.</p>
          <div v-else class="flex flex-wrap gap-2">
            <UBadge v-for="c in contrato.codeudores" :key="c.id" color="amber" variant="subtle">
              {{ c.nombreCompleto }} — {{ c.numeroDocumento }}
            </UBadge>
          </div>
        </div>

        <template v-if="auth.esAdministrador">
          <SharedErrorState v-if="errorFicha" :message="errorFicha" @retry="cargarFicha" />
          <div v-else class="surface-card p-4 sm:p-5">
            <p class="mb-3 font-semibold text-slate-900">Resumen financiero</p>
            <SharedSkeletonText v-if="cargandoFicha" :lines="3" />
            <div v-else-if="ficha" class="space-y-4">
              <dl class="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <dt class="text-xs font-medium uppercase tracking-wide text-slate-400">Saldo a favor</dt>
                  <dd class="mt-1 text-sm font-semibold tabular-nums text-emerald-600">{{ moneda(ficha.saldoAFavor) }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium uppercase tracking-wide text-slate-400">Depósito</dt>
                  <dd class="mt-1 text-sm tabular-nums text-slate-900">{{ moneda(ficha.depositoGarantia) }}</dd>
                </div>
                <div class="col-span-2">
                  <dt class="text-xs font-medium uppercase tracking-wide text-slate-400">Cartera pendiente</dt>
                  <dd
                    class="mt-1 text-sm font-semibold tabular-nums"
                    :class="carteraPendiente > 0 ? 'text-red-600' : 'text-slate-900'"
                  >
                    {{ moneda(carteraPendiente) }}
                  </dd>
                </div>
              </dl>
              <div>
                <p class="mb-2 text-sm font-medium text-slate-900">Obligaciones pendientes</p>
                <p v-if="!ficha.obligacionesPendientes?.length" class="text-sm text-slate-400">Sin obligaciones pendientes.</p>
                <ul v-else class="space-y-2">
                  <li
                    v-for="o in ficha.obligacionesPendientes"
                    :key="o.id"
                    class="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs"
                  >
                    <span class="text-slate-600">{{ o.concepto }} · vence {{ fecha(o.fechaVencimiento) }}</span>
                    <span class="shrink-0 text-right font-medium tabular-nums text-slate-900">
                      {{ moneda(Number(o.valorOriginal) - Number(o.valorAbonado)) }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </template>
      </div>

      <template v-if="auth.esAdministrador">
        <div class="surface-card p-4 sm:p-5">
          <p class="mb-3 font-semibold text-slate-900">Recibos emitidos</p>
          <UTable :rows="recibos" :columns="recibosColumnas" :loading="cargandoRecibos">
            <template #creadoEn-data="{ row }">{{ fecha(row.creadoEn) }}</template>
            <template #valorTotal-data="{ row }">{{ moneda(row.valorTotal) }}</template>
            <template #estado-data="{ row }">
              <SharedStatusBadge domain="recibo" :value="row.estado" />
            </template>
            <template #acciones-data="{ row }">
              <UButton size="xs" color="amber" variant="soft" icon="i-heroicons-eye" :to="`/recibos/${row.id}`">
                Ver
              </UButton>
            </template>
            <template #empty-state>
              <p class="py-6 text-center text-sm text-slate-400">Sin recibos emitidos para este contrato.</p>
            </template>
          </UTable>
          <div v-if="totalRecibos > limitRecibos" class="mt-4 flex justify-end">
            <UPagination v-model="pageRecibos" :page-count="limitRecibos" :total="totalRecibos" />
          </div>
        </div>

        <div class="surface-card p-4 sm:p-5">
          <p class="mb-3 font-semibold text-slate-900">Historial de estado</p>
          <SharedSkeletonText v-if="cargandoHistorial" :lines="2" />
          <p v-else-if="!historial.length" class="text-sm text-slate-400">Sin cambios de estado registrados.</p>
          <ul v-else class="space-y-2 text-sm">
            <li v-for="h in historial" :key="h.id" class="border-b border-slate-200 pb-2 last:border-0">
              <p class="text-slate-900">
                {{ h.estadoAnterior }} → {{ h.estadoNuevo }}
                <span class="text-xs text-slate-400">({{ fecha(h.creadoEn) }} · {{ h.usuarioEmail }})</span>
              </p>
              <p v-if="h.motivo" class="text-xs text-slate-500">{{ h.motivo }}</p>
            </li>
          </ul>
        </div>
      </template>
    </div>

    <ContratosModalTerminar v-model="modalTerminar" :contrato="contrato" @terminado="recargarTrasCambio" />
    <ContratosModalReactivar v-model="modalReactivar" :contrato="contrato" @reactivado="recargarTrasCambio" />
  </div>
</template>
