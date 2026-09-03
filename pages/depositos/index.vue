<script setup lang="ts">
/**
 * Depósitos de garantía: contratos terminados con depósito aún sin liquidar, e historial de
 * liquidaciones ya hechas. Antes solo se podía liquidar desde la ficha de un contrato en
 * Recaudo (uno a la vez, sin vista consolidada) — reutiliza el mismo modal de liquidación.
 * EXCLUSIVO Administrador.
 */
const { moneda, fecha } = useFormatoCO()

const seccion = ref<'pendientes' | 'liquidados'>('pendientes')

const {
  page: pagePendientes,
  limit: limitPendientes,
  total: totalPendientes,
  lista: pendientes,
  cargando: cargandoPendientes,
  error: errorPendientes,
  cargar: cargarPendientes,
} = useListadoPaginado<any>(
  ({ page, limit }) => useApiFetch<any>('/recaudo/depositos/pendientes', { params: { page, limit } }),
  { mensajeError: 'No fue posible cargar los depósitos pendientes de liquidar.' },
)

const {
  page: pageLiquidados,
  limit: limitLiquidados,
  total: totalLiquidados,
  lista: liquidados,
  cargando: cargandoLiquidados,
  error: errorLiquidados,
  cargar: cargarLiquidados,
} = useListadoPaginado<any>(
  ({ page, limit }) => useApiFetch<any>('/recaudo/depositos/liquidados', { params: { page, limit } }),
  { mensajeError: 'No fue posible cargar el historial de liquidaciones.' },
)

// ---- Liquidar depósito (mismo componente que usa Recaudo) ----
const medios = ['EFECTIVO', 'TRANSFERENCIA']
const modalLiquidar = ref(false)
const liquidando = ref(false)
const contratoLiquidando = ref<any>(null)
const descuentosDeposito = reactive([{ concepto: '', valor: 0, tipo: 'GENERAL' as 'GENERAL' | 'DEUDA' }])
const formLiquidar = reactive({ medioPago: 'EFECTIVO', referencia: '', observaciones: '' })

const totalDescuentosDeposito = computed(() => descuentosDeposito.reduce((acc, d) => acc + Number(d.valor || 0), 0))
const valorADevolver = computed(() =>
  Math.max(0, Number(contratoLiquidando.value?.depositoGarantia || 0) - totalDescuentosDeposito.value),
)

function abrirLiquidar(contrato: any) {
  contratoLiquidando.value = contrato
  descuentosDeposito.splice(0, descuentosDeposito.length, { concepto: '', valor: 0, tipo: 'GENERAL' })
  formLiquidar.medioPago = 'EFECTIVO'
  formLiquidar.referencia = ''
  formLiquidar.observaciones = ''
  modalLiquidar.value = true
}

async function confirmarLiquidar() {
  if (!contratoLiquidando.value) return
  liquidando.value = true
  try {
    const descuentos = descuentosDeposito
      .filter((d) => d.concepto && Number(d.valor) > 0)
      .map((d) => ({ concepto: d.concepto, valor: Number(d.valor), tipo: d.tipo ?? 'GENERAL' }))
    await useApiFetch(`/recaudo/contrato/${contratoLiquidando.value.id}/liquidar-deposito`, {
      method: 'POST',
      body: {
        descuentos: descuentos.length ? descuentos : undefined,
        medioPago: valorADevolver.value > 0 ? formLiquidar.medioPago : undefined,
        referencia: formLiquidar.referencia || undefined,
        observaciones: formLiquidar.observaciones || undefined,
      },
    })
    modalLiquidar.value = false
    await Promise.all([cargarPendientes(), cargarLiquidados()])
  } catch (e: any) {
    errorPendientes.value = e?.data?.message || 'No fue posible liquidar el depósito.'
  } finally {
    liquidando.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold text-slate-900 mb-4">Depósitos</h1>

    <div class="flex gap-2 mb-4">
      <UButton
        :color="seccion === 'pendientes' ? 'amber' : 'gray'"
        :variant="seccion === 'pendientes' ? 'solid' : 'soft'"
        @click="seccion = 'pendientes'"
      >
        Pendientes de liquidar
      </UButton>
      <UButton
        :color="seccion === 'liquidados' ? 'amber' : 'gray'"
        :variant="seccion === 'liquidados' ? 'solid' : 'soft'"
        @click="seccion = 'liquidados'"
      >
        Historial de liquidaciones
      </UButton>
    </div>

    <template v-if="seccion === 'pendientes'">
      <SharedErrorState v-if="errorPendientes" :message="errorPendientes" class="mb-4" @retry="cargarPendientes" />
      <UCard>
        <UTable
          :rows="pendientes"
          :columns="[
            { key: 'cliente', label: 'Arrendatario' },
            { key: 'inmueble.direccion', label: 'Dirección' },
            { key: 'inmueble.barrio', label: 'Barrio' },
            { key: 'fechaFin', label: 'Fecha de fin' },
            { key: 'depositoGarantia', label: 'Depósito de garantía' },
            { key: 'acciones', label: 'Acciones' },
          ]"
          :loading="cargandoPendientes"
        >
          <template #cliente-data="{ row }">{{ row.cliente?.nombreCompleto }}</template>
          <template #fechaFin-data="{ row }">{{ fecha(row.fechaFin) }}</template>
          <template #depositoGarantia-data="{ row }">
            <span class="font-semibold text-slate-900">{{ moneda(row.depositoGarantia) }}</span>
          </template>
          <template #acciones-data="{ row }">
            <UButton size="xs" color="amber" variant="soft" icon="i-heroicons-banknotes" @click="abrirLiquidar(row)">
              Liquidar
            </UButton>
          </template>
          <template #empty-state>
            <p class="text-center py-10 text-sm text-slate-400">No hay depósitos pendientes de liquidar.</p>
          </template>
        </UTable>
        <div class="flex justify-end mt-4">
          <UPagination v-model="pagePendientes" :page-count="limitPendientes" :total="totalPendientes" />
        </div>
      </UCard>
    </template>

    <template v-else>
      <SharedErrorState v-if="errorLiquidados" :message="errorLiquidados" class="mb-4" @retry="cargarLiquidados" />
      <UCard>
        <UTable
          :rows="liquidados"
          :columns="[
            { key: 'cliente', label: 'Arrendatario' },
            { key: 'inmueble.direccion', label: 'Dirección' },
            { key: 'inmueble.barrio', label: 'Barrio' },
            { key: 'depositoLiquidadoEn', label: 'Fecha de liquidación' },
            { key: 'descuentos', label: 'Descuentos' },
            { key: 'acciones', label: 'Acciones' },
          ]"
          :loading="cargandoLiquidados"
        >
          <template #cliente-data="{ row }">{{ row.cliente?.nombreCompleto }}</template>
          <template #depositoLiquidadoEn-data="{ row }">{{ fecha(row.depositoLiquidadoEn) }}</template>
          <template #descuentos-data="{ row }">
            <p v-if="!row.descuentos?.length" class="text-slate-400">Sin descuentos</p>
            <div v-else class="space-y-0.5">
              <p v-for="d in row.descuentos" :key="d.id" class="text-xs text-slate-600">
                {{ d.concepto }}: {{ moneda(d.valor) }}
              </p>
            </div>
          </template>
          <template #acciones-data="{ row }">
            <UButton size="xs" color="gray" variant="soft" icon="i-heroicons-eye" :to="`/contratos/${row.id}`">
              Ver contrato
            </UButton>
          </template>
          <template #empty-state>
            <p class="text-center py-10 text-sm text-slate-400">Todavía no hay liquidaciones registradas.</p>
          </template>
        </UTable>
        <div class="flex justify-end mt-4">
          <UPagination v-model="pageLiquidados" :page-count="limitLiquidados" :total="totalLiquidados" />
        </div>
      </UCard>
    </template>

    <RecaudoModalLiquidarDeposito
      v-model="modalLiquidar"
      :deposito-garantia="Number(contratoLiquidando?.depositoGarantia || 0)"
      :valor-a-devolver="valorADevolver"
      :medios="medios"
      :descuentos="descuentosDeposito"
      :form="formLiquidar"
      :liquidando="liquidando"
      @confirmar="confirmarLiquidar"
    />
  </div>
</template>
