<script setup lang="ts">
/**
 * Consulta de movimientos de caja (libro INGRESO/EGRESO) y saldo neto — EXCLUSIVO
 * Administrador (protegido también por middleware/auth.global.ts). Los movimientos de
 * origen RECAUDO se corrigen anulando el recibo asociado desde Recaudo; los de origen
 * NOVEDAD/DEPOSITO se corrigen aquí mismo con reverso manual (AUD-008), que es el único
 * mecanismo de corrección que tienen (no existe "anular novedad"/"anular liquidación").
 */
const { moneda, fecha } = useFormatoCO()

const saldoPorMedio = ref<{ efectivo: number; transferencia: number; sinMedio: number; total: number } | null>(null)
const cargandoSaldo = ref(true)

const {
  filtros,
  page,
  limit,
  total,
  lista: movimientos,
  cargando,
  error,
  cargar,
} = useListadoPaginado<any, { tipo: string; origen: string; medioPago: string; desde: string; hasta: string }>(
  ({ page, limit, filtros }) => useApiFetch<any>('/movimientos', { params: { ...filtros, page, limit } }),
  {
    filtrosIniciales: { tipo: '', origen: '', medioPago: '', desde: '', hasta: '' },
    limiteInicial: 15,
    mensajeError: 'No fue posible cargar los movimientos.',
  },
)

const columnas = [
  { key: 'creadoEn', label: 'Fecha' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'origen', label: 'Origen' },
  { key: 'medioPago', label: 'Medio' },
  { key: 'consecutivo', label: 'Consecutivo' },
  { key: 'concepto', label: 'Concepto' },
  { key: 'monto', label: 'Monto' },
  { key: 'acciones', label: '' },
]

// Reverso manual: solo tiene sentido ofrecerlo para movimientos de origen NOVEDAD/DEPOSITO
// que aún no son en sí mismos un reverso — RECAUDO se corrige anulando el recibo, y un
// reverso ya aplicado no puede volver a reversarse (el backend lo rechaza igual, esto es
// solo para no mostrar un botón que siempre fallaría).
function puedeReversar(row: any) {
  return (row.origen === 'NOVEDAD' || row.origen === 'DEPOSITO') && !row.esReverso
}

const modalReversar = ref(false)
const movimientoReversando = ref<any>(null)
const motivoReverso = ref('')
const reversando = ref(false)

function abrirReversar(row: any) {
  error.value = ''
  movimientoReversando.value = row
  motivoReverso.value = ''
  modalReversar.value = true
}

async function confirmarReversar() {
  if (!movimientoReversando.value || !motivoReverso.value) return
  reversando.value = true
  try {
    await useApiFetch(`/movimientos/${movimientoReversando.value.id}/reversar`, {
      method: 'PATCH',
      body: { motivo: motivoReverso.value },
    })
    modalReversar.value = false
    await Promise.all([cargar(), cargarSaldoPorMedio()])
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible reversar el movimiento.'
  } finally {
    reversando.value = false
  }
}

// Caja física (efectivo) y control de transferencias son magnitudes distintas (§14 de la
// especificación) — nunca deben mostrarse como un único "saldo de caja" mezclado.
async function cargarSaldoPorMedio() {
  cargandoSaldo.value = true
  try {
    saldoPorMedio.value = await useApiFetch<{
      efectivo: number
      transferencia: number
      sinMedio: number
      total: number
    }>('/movimientos/saldo-por-medio')
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible cargar el saldo por medio.'
  } finally {
    cargandoSaldo.value = false
  }
}

function reintentar() {
  cargar()
  cargarSaldoPorMedio()
}

onMounted(cargarSaldoPorMedio)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
      <h1 class="text-xl font-semibold text-slate-900">Movimientos de caja</h1>
      <div class="flex gap-3 flex-wrap">
        <UCard :ui="{ body: { padding: 'px-4 py-2' } }">
          <p class="text-xs text-slate-500">Caja física (efectivo)</p>
          <SharedSkeletonText v-if="cargandoSaldo" width-class="w-20" />
          <p
            v-else
            class="text-xl font-bold"
            :class="Number(saldoPorMedio?.efectivo) >= 0 ? 'text-emerald-600' : 'text-red-600'"
          >
            {{ moneda(saldoPorMedio?.efectivo ?? 0) }}
          </p>
        </UCard>
        <UCard :ui="{ body: { padding: 'px-4 py-2' } }">
          <p class="text-xs text-slate-500">Transferencias (banco)</p>
          <SharedSkeletonText v-if="cargandoSaldo" width-class="w-20" />
          <p
            v-else
            class="text-xl font-bold"
            :class="Number(saldoPorMedio?.transferencia) >= 0 ? 'text-emerald-600' : 'text-red-600'"
          >
            {{ moneda(saldoPorMedio?.transferencia ?? 0) }}
          </p>
        </UCard>
        <UCard
          v-if="!cargandoSaldo && saldoPorMedio?.sinMedio"
          :ui="{ body: { padding: 'px-4 py-2' } }"
          class="border-amber-300"
        >
          <p class="text-xs text-amber-600">Sin medio identificado</p>
          <p class="text-xl font-bold text-amber-600">{{ moneda(saldoPorMedio.sinMedio) }}</p>
        </UCard>
      </div>
    </div>

    <SharedErrorState v-if="error" :message="error" class="mb-4" @retry="reintentar" />
    <UAlert
      v-if="!cargandoSaldo && saldoPorMedio?.sinMedio"
      color="amber"
      variant="subtle"
      title="Hay movimientos sin medio de pago identificado"
      description="Corresponden a egresos de novedades/depósitos aún no ligados a un pago real con medio explícito. No están incluidos en caja física ni en transferencias — revísalos para no subestimar ninguno de los dos saldos."
      class="mb-4"
    />

    <UCard class="mb-4">
      <div class="flex flex-wrap gap-3">
        <USelectMenu v-model="filtros.tipo" :options="['', 'INGRESO', 'EGRESO']" placeholder="Tipo" class="w-40" />
        <USelectMenu
          v-model="filtros.origen"
          :options="['', 'RECAUDO', 'NOVEDAD', 'DEPOSITO', 'MANUAL']"
          placeholder="Origen"
          class="w-44"
        />
        <USelectMenu
          v-model="filtros.medioPago"
          :options="['', 'EFECTIVO', 'TRANSFERENCIA']"
          placeholder="Medio"
          class="w-40"
        />
        <UInput v-model="filtros.desde" type="date" class="w-40" />
        <UInput v-model="filtros.hasta" type="date" class="w-40" />
      </div>
    </UCard>

    <UCard>
      <UTable :rows="movimientos" :columns="columnas" :loading="cargando">
        <template #creadoEn-data="{ row }">{{ fecha(row.creadoEn) }}</template>
        <template #tipo-data="{ row }">
          <SharedStatusBadge domain="movimientoTipo" :value="row.tipo" />
        </template>
        <template #medioPago-data="{ row }">
          <span v-if="row.medioPago" class="text-sm text-slate-700">{{ row.medioPago }}</span>
          <span v-else class="text-xs text-amber-600">Sin identificar</span>
        </template>
        <template #consecutivo-data="{ row }">{{ row.consecutivo || '—' }}</template>
        <template #concepto-data="{ row }">
          <div>
            <p>{{ row.concepto }}</p>
            <p v-if="row.esReverso" class="text-xs text-amber-600">Reverso de otro movimiento</p>
          </div>
        </template>
        <template #monto-data="{ row }">{{ moneda(row.monto) }}</template>
        <template #acciones-data="{ row }">
          <UButton
            v-if="puedeReversar(row)"
            icon="i-heroicons-arrow-uturn-left"
            color="gray"
            variant="ghost"
            size="sm"
            @click="abrirReversar(row)"
          >
            Reversar
          </UButton>
        </template>
        <template #empty-state>
          <div class="text-center py-10 text-slate-400">
            <UIcon name="i-heroicons-arrows-right-left" class="w-10 h-10 mx-auto mb-2" />
            <p>No hay movimientos que coincidan con los filtros.</p>
          </div>
        </template>
      </UTable>

      <div class="flex justify-end mt-4">
        <UPagination v-model="page" :page-count="limit" :total="total" />
      </div>
    </UCard>

    <UModal v-model="modalReversar">
      <UCard>
        <template #header>
          <p class="font-semibold text-slate-900">Reversar movimiento</p>
        </template>
        <p class="text-sm text-slate-500 mb-3">
          Se creará un movimiento de signo contrario referenciando a
          <strong>{{ movimientoReversando?.consecutivo || movimientoReversando?.concepto }}</strong
          >. El movimiento original no se elimina.
        </p>
        <UFormGroup label="Motivo del reverso">
          <UTextarea v-model="motivoReverso" placeholder="Ej: error en el monto registrado" />
        </UFormGroup>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="modalReversar = false">Cancelar</UButton>
            <UButton color="red" :loading="reversando" :disabled="!motivoReverso" @click="confirmarReversar">
              Reversar movimiento
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
