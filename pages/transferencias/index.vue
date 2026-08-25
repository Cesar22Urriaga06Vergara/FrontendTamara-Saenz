<script setup lang="ts">
/**
 * Vista de movimientos filtrada exclusivamente a medioPago=TRANSFERENCIA — mismo backend que
 * Movimientos (GET /movimientos ya soportaba este filtro), como módulo propio en vez de
 * fusionado (decisión confirmada: separar Cartera/Gastos/Depósitos/Transferencias). El reverso
 * manual sigue el mismo criterio: solo NOVEDAD/DEPOSITO, nunca RECAUDO (se corrige anulando el
 * recibo) ni un reverso ya aplicado.
 */
const { moneda, fecha } = useFormatoCO()

const saldoTransferencia = ref<number | null>(null)
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
} = useListadoPaginado<any, { tipo: string; origen: string; desde: string; hasta: string }>(
  ({ page, limit, filtros }) =>
    useApiFetch<any>('/movimientos', { params: { ...filtros, medioPago: 'TRANSFERENCIA', page, limit } }),
  {
    filtrosIniciales: { tipo: '', origen: '', desde: '', hasta: '' },
    limiteInicial: 15,
    mensajeError: 'No fue posible cargar las transferencias.',
  },
)

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
    await Promise.all([cargar(), cargarSaldo()])
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible reversar el movimiento.'
  } finally {
    reversando.value = false
  }
}

async function cargarSaldo() {
  cargandoSaldo.value = true
  try {
    const data = await useApiFetch<{ transferencia: number }>('/movimientos/saldo-por-medio')
    saldoTransferencia.value = data.transferencia
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible cargar el saldo de transferencias.'
  } finally {
    cargandoSaldo.value = false
  }
}

function reintentar() {
  cargar()
  cargarSaldo()
}

onMounted(cargarSaldo)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
      <h1 class="text-xl font-semibold text-slate-900">Transferencias</h1>
      <UCard :ui="{ body: { padding: 'px-4 py-2' } }">
        <p class="text-xs text-slate-500">Saldo control bancario</p>
        <p v-if="cargandoSaldo" class="text-sm text-slate-400">Cargando…</p>
        <p
          v-else
          class="text-xl font-bold"
          :class="Number(saldoTransferencia) >= 0 ? 'text-emerald-600' : 'text-red-600'"
        >
          {{ moneda(saldoTransferencia ?? 0) }}
        </p>
      </UCard>
    </div>

    <SharedErrorState v-if="error" :message="error" class="mb-4" @retry="reintentar" />

    <UCard class="mb-4">
      <div class="flex flex-wrap gap-3">
        <USelectMenu v-model="filtros.tipo" :options="['', 'INGRESO', 'EGRESO']" placeholder="Tipo" class="w-40" />
        <USelectMenu
          v-model="filtros.origen"
          :options="['', 'RECAUDO', 'NOVEDAD', 'DEPOSITO', 'MANUAL']"
          placeholder="Origen"
          class="w-44"
        />
        <UInput v-model="filtros.desde" type="date" class="w-40" />
        <UInput v-model="filtros.hasta" type="date" class="w-40" />
      </div>
    </UCard>

    <UCard>
      <UTable
        :rows="movimientos"
        :columns="[
          { key: 'creadoEn', label: 'Fecha' },
          { key: 'tipo', label: 'Tipo' },
          { key: 'origen', label: 'Origen' },
          { key: 'consecutivo', label: 'Consecutivo' },
          { key: 'concepto', label: 'Concepto' },
          { key: 'monto', label: 'Monto' },
          { key: 'acciones', label: '' },
        ]"
        :loading="cargando"
      >
        <template #creadoEn-data="{ row }">{{ fecha(row.creadoEn) }}</template>
        <template #tipo-data="{ row }">
          <SharedStatusBadge domain="movimientoTipo" :value="row.tipo" />
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
            <p>No hay transferencias que coincidan con los filtros.</p>
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
