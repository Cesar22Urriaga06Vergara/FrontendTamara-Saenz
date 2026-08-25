<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

/** Directorio de Clientes (arrendatarios). Búsqueda estricta por cédula/documento. */
const auth = useAuthStore()

const {
  filtros,
  page,
  limit,
  total,
  lista: clientes,
  cargando,
  error,
  cargar,
  modalAbierto,
  editando: clienteEditando,
  formulario,
  guardando,
  guardar,
  abrirCreacion,
  abrirEdicion,
  formularioValido,
  modalBajaAbierto,
  procesandoBaja,
  paraBaja: clienteParaBaja,
  confirmarBaja,
  ejecutarBaja,
  alternarActivo,
} = usePersonasDirectorio('clientes', 'cliente')

const columnas = [
  { key: 'numeroDocumento', label: 'Documento' },
  { key: 'nombreCompleto', label: 'Nombre completo' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'email', label: 'Correo' },
  { key: 'activo', label: 'Estado' },
  { key: 'acciones', label: '' },
]
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-semibold text-slate-900">Clientes</h1>
      <UButton color="amber" icon="i-heroicons-plus" @click="abrirCreacion">Nuevo cliente</UButton>
    </div>

    <SharedErrorState v-if="error" :message="error" class="mb-4" @retry="cargar" />

    <UCard class="mb-4">
      <UInput
        v-model="filtros.busqueda"
        placeholder="Buscar por cédula o nombre…"
        icon="i-heroicons-magnifying-glass"
        class="w-72"
      />
    </UCard>

    <UCard>
      <UTable :rows="clientes" :columns="columnas" :loading="cargando">
        <template #activo-data="{ row }">
          <SharedStatusBadge domain="activo" :value="row.activo" />
        </template>
        <template #acciones-data="{ row }">
          <UiTableRowActions
            v-if="auth.esAdministrador"
            :activo="row.activo"
            @editar="abrirEdicion(row)"
            @baja="confirmarBaja(row)"
            @reactivar="alternarActivo(row)"
          />
        </template>
        <template #empty-state>
          <div class="text-center py-10 text-slate-400">
            <UIcon name="i-heroicons-user-group" class="w-10 h-10 mx-auto mb-2" />
            <p>No hay clientes que coincidan con la búsqueda.</p>
          </div>
        </template>
      </UTable>

      <div v-if="!filtros.busqueda" class="flex justify-end mt-4">
        <UPagination v-model="page" :page-count="limit" :total="total" />
      </div>
    </UCard>

    <PersonasFormularioPersona
      v-model="modalAbierto"
      :formulario="formulario"
      :editando="!!clienteEditando"
      :guardando="guardando"
      :valido="formularioValido"
      titulo-creacion="Nuevo cliente"
      titulo-edicion="Editar cliente"
      label-creacion="Crear cliente"
      label-edicion="Guardar cambios"
      @guardar="guardar"
    />

    <UiConfirmModal
      v-model="modalBajaAbierto"
      title="Dar de baja"
      :message="`¿Confirma dar de baja a ${clienteParaBaja?.nombreCompleto}?`"
      :loading="procesandoBaja"
      color="red"
      @confirm="ejecutarBaja"
      @cancel="modalBajaAbierto = false"
    />
  </div>
</template>
