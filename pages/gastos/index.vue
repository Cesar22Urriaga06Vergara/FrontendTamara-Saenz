<script setup lang="ts">
/**
 * Gastos de la inmobiliaria: novedades ya aprobadas con impactoFinanciero=GASTO_INMOBILIARIA
 * (a diferencia de CARGO_ARRENDATARIO, que se cobra al arrendatario y vive en Cartera/Recaudo).
 * APROBADO ≠ PAGADO (NOV-01) — esta pantalla es donde se registra el pago real, igual que ya
 * podía hacerse desde Novedades; aquí queda como módulo propio enfocado solo en gastos.
 * EXCLUSIVO Administrador.
 */
const { moneda, fecha } = useFormatoCO()

const {
  filtros,
  page,
  limit,
  total,
  lista: gastos,
  cargando,
  error,
  cargar,
} = useListadoPaginado<any, { gastoPagado: string }>(
  ({ page, limit, filtros }) =>
    useApiFetch<any>('/novedades', {
      params: {
        impactoFinanciero: 'GASTO_INMOBILIARIA',
        gastoPagado: filtros.gastoPagado || undefined,
        page,
        limit,
      },
    }),
  { filtrosIniciales: { gastoPagado: '' }, mensajeError: 'No fue posible cargar los gastos.' },
)

const modalPago = ref(false)
const gastoPagando = ref<any>(null)
const medioPago = ref<'EFECTIVO' | 'TRANSFERENCIA' | ''>('')
const referenciaPago = ref('')
const pagando = ref(false)

function abrirPago(row: any) {
  gastoPagando.value = row
  medioPago.value = ''
  referenciaPago.value = ''
  error.value = ''
  modalPago.value = true
}

async function confirmarPago() {
  if (!gastoPagando.value || !medioPago.value) return
  pagando.value = true
  try {
    await useApiFetch(`/novedades/${gastoPagando.value.id}/pagar-gasto-inmobiliaria`, {
      method: 'PATCH',
      body: { medioPago: medioPago.value, referencia: referenciaPago.value || undefined },
    })
    modalPago.value = false
    await cargar()
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible registrar el pago del gasto.'
  } finally {
    pagando.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold text-slate-900 mb-4">Gastos</h1>

    <SharedErrorState v-if="error" :message="error" class="mb-4" @retry="cargar" />

    <UCard class="mb-4">
      <USelectMenu
        v-model="filtros.gastoPagado"
        :options="[
          { label: 'Todos', value: '' },
          { label: 'Pendientes de pago', value: 'false' },
          { label: 'Pagados', value: 'true' },
        ]"
        value-attribute="value"
        option-attribute="label"
        placeholder="Estado de pago"
        class="w-52"
      />
    </UCard>

    <UCard>
      <UTable
        :rows="gastos"
        :columns="[
          { key: 'descripcion', label: 'Concepto' },
          { key: 'inmueble.direccion', label: 'Dirección' },
          { key: 'inmueble.barrio', label: 'Barrio' },
          { key: 'montoAprobado', label: 'Monto' },
          { key: 'gastoPagado', label: 'Estado' },
          { key: 'acciones', label: 'Acciones' },
        ]"
        :loading="cargando"
      >
        <template #descripcion-data="{ row }">
          <div>
            <p class="text-slate-900">{{ row.descripcion }}</p>
            <p class="text-xs text-slate-500">{{ fecha(row.fecha) }}</p>
          </div>
        </template>
        <template #montoAprobado-data="{ row }">{{ moneda(row.montoAprobado) }}</template>
        <template #gastoPagado-data="{ row }">
          <SharedStatusBadge domain="gastoPagado" :value="row.gastoPagado" />
        </template>
        <template #acciones-data="{ row }">
          <UButton
            v-if="!row.gastoPagado"
            size="xs"
            color="red"
            variant="soft"
            icon="i-heroicons-banknotes"
            @click="abrirPago(row)"
          >
            Registrar pago
          </UButton>
        </template>
        <template #empty-state>
          <div class="text-center py-10 text-slate-400">
            <UIcon name="i-heroicons-receipt-percent" class="w-10 h-10 mx-auto mb-2" />
            <p>No hay gastos que coincidan con el filtro.</p>
          </div>
        </template>
      </UTable>

      <div class="flex justify-end mt-4">
        <UPagination v-model="page" :page-count="limit" :total="total" />
      </div>
    </UCard>

    <UModal v-model="modalPago">
      <UCard>
        <template #header>
          <p class="font-semibold text-slate-900">Registrar pago del gasto</p>
        </template>
        <div class="space-y-3">
          <p class="text-sm text-slate-600">
            {{ gastoPagando?.descripcion }} —
            <span class="font-semibold text-slate-900">{{ moneda(gastoPagando?.montoAprobado) }}</span>
          </p>
          <UFormGroup label="Medio de pago">
            <USelectMenu
              v-model="medioPago"
              :options="['EFECTIVO', 'TRANSFERENCIA']"
              placeholder="Selecciona el medio"
            />
          </UFormGroup>
          <UFormGroup v-if="medioPago === 'TRANSFERENCIA'" label="Referencia">
            <UInput v-model="referenciaPago" placeholder="Número de transacción" />
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
