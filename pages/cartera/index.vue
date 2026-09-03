<script setup lang="ts">
/**
 * Cartera consolidada: toda obligación con saldo de capital por cobrar, de cualquier contrato
 * — antes solo existía como reporte Excel (§Reportes) o por contrato individual (ficha de
 * recaudo en Recaudo). EXCLUSIVO Administrador. No duplica ningún cálculo: `GET /obligaciones`
 * es la misma fuente que usa Recaudo. Sin costo de mora (retirado el 2026-09-01).
 */
const { moneda, fecha } = useFormatoCO()

const {
  page,
  limit,
  total,
  lista: obligaciones,
  cargando,
  error,
  cargar,
} = useListadoPaginado<any>(({ page, limit }) => useApiFetch<any>('/obligaciones', { params: { page, limit } }), {
  mensajeError: 'No fue posible cargar la cartera.',
})

const totalPagina = computed(() =>
  obligaciones.value.reduce((acc, o) => acc + (Number(o.valorOriginal) - Number(o.valorAbonado)), 0),
)
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold text-slate-900 mb-4">Cartera</h1>

    <SharedErrorState v-if="error" :message="error" class="mb-4" @retry="cargar" />

    <UCard>
      <UTable
        :rows="obligaciones"
        :columns="[
          { key: 'cliente', label: 'Arrendatario' },
          { key: 'contrato.inmueble.direccion', label: 'Dirección' },
          { key: 'contrato.inmueble.barrio', label: 'Barrio' },
          { key: 'tipo', label: 'Tipo' },
          { key: 'fechaVencimiento', label: 'Vencimiento' },
          { key: 'saldo', label: 'Saldo por cobrar' },
          { key: 'acciones', label: 'Acciones' },
        ]"
        :loading="cargando"
      >
        <template #cliente-data="{ row }">
          <div>
            <p class="text-slate-900">{{ row.contrato?.cliente?.nombreCompleto }}</p>
            <p class="text-xs text-slate-500">{{ row.contrato?.cliente?.numeroDocumento }}</p>
          </div>
        </template>
        <template #tipo-data="{ row }">
          <UBadge :color="row.tipo === 'CANON' ? 'gray' : 'amber'" variant="subtle" size="xs">{{ row.tipo }}</UBadge>
        </template>
        <template #fechaVencimiento-data="{ row }">{{ fecha(row.fechaVencimiento) }}</template>
        <template #saldo-data="{ row }">
          <span class="font-semibold text-slate-900">
            {{ moneda(Number(row.valorOriginal) - Number(row.valorAbonado)) }}
          </span>
        </template>
        <template #acciones-data="{ row }">
          <div class="flex flex-nowrap items-center justify-center gap-2">
            <UButton
              size="xs"
              color="amber"
              icon="i-heroicons-banknotes"
              :to="`/recaudo?contratoId=${row.contrato?.id}`"
            >
              Cobrar
            </UButton>
            <UButton
              size="xs"
              color="gray"
              variant="soft"
              icon="i-heroicons-eye"
              :to="`/contratos/${row.contrato?.id}`"
            >
              Ver contrato
            </UButton>
          </div>
        </template>
        <template #empty-state>
          <div class="text-center py-10 text-slate-400">
            <UIcon name="i-heroicons-banknotes" class="w-10 h-10 mx-auto mb-2" />
            <p>No hay cartera vencida por cobrar.</p>
          </div>
        </template>
      </UTable>

      <div class="flex items-center justify-between mt-4">
        <p class="text-xs text-slate-500">
          Total de esta página: <span class="font-medium">{{ moneda(totalPagina) }}</span>
        </p>
        <UPagination v-model="page" :page-count="limit" :total="total" />
      </div>
    </UCard>
  </div>
</template>
