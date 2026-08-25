<script setup lang="ts">
/** Consulta de trazabilidad — EXCLUSIVO Administrador. */
const { fecha } = useFormatoCO()

const {
  filtros,
  page,
  limit,
  total,
  lista: registros,
  cargando,
  error,
  cargar,
} = useListadoPaginado<any, { modulo: string; usuarioEmail: string; desde: string; hasta: string }>(
  ({ page, limit, filtros }) => useApiFetch<any>('/auditoria', { params: { ...filtros, page, limit } }),
  {
    filtrosIniciales: { modulo: '', usuarioEmail: '', desde: '', hasta: '' },
    limiteInicial: 20,
    mensajeError: 'No fue posible cargar los registros de auditoría.',
  },
)

const columnas = [
  { key: 'creadoEn', label: 'Fecha' },
  { key: 'modulo', label: 'Módulo' },
  { key: 'accion', label: 'Acción' },
  { key: 'usuarioEmail', label: 'Usuario' },
  { key: 'ruta', label: 'Ruta' },
]
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold text-slate-900 mb-4">Auditoría</h1>

    <SharedErrorState v-if="error" :message="error" class="mb-4" @retry="cargar" />

    <UCard class="mb-4">
      <div class="flex flex-wrap gap-3 items-end">
        <UInput v-model="filtros.modulo" placeholder="Filtrar por módulo (ej: RECAUDO)…" class="w-56" />
        <UInput v-model="filtros.usuarioEmail" placeholder="Filtrar por correo de usuario…" class="w-56" />
        <UFormGroup label="Desde" class="!mb-0">
          <UInput v-model="filtros.desde" type="date" class="w-40" />
        </UFormGroup>
        <UFormGroup label="Hasta" class="!mb-0">
          <UInput v-model="filtros.hasta" type="date" class="w-40" />
        </UFormGroup>
        <UButton
          v-if="filtros.modulo || filtros.usuarioEmail || filtros.desde || filtros.hasta"
          color="gray"
          variant="ghost"
          size="sm"
          icon="i-heroicons-x-mark"
          @click="Object.assign(filtros, { modulo: '', usuarioEmail: '', desde: '', hasta: '' })"
        >
          Limpiar filtros
        </UButton>
      </div>
    </UCard>

    <UCard>
      <UTable :rows="registros" :columns="columnas" :loading="cargando">
        <template #creadoEn-data="{ row }">{{ fecha(row.creadoEn) }}</template>
        <template #modulo-data="{ row }">
          <UBadge color="gray" variant="subtle">{{ row.modulo }}</UBadge>
        </template>
        <template #empty-state>
          <div class="text-center py-10 text-slate-400">
            <UIcon name="i-heroicons-shield-check" class="w-10 h-10 mx-auto mb-2" />
            <p>No hay registros de auditoría con estos filtros.</p>
          </div>
        </template>
      </UTable>

      <div class="flex justify-end mt-4">
        <UPagination v-model="page" :page-count="limit" :total="total" />
      </div>
    </UCard>
  </div>
</template>
