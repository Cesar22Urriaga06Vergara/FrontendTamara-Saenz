<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

/** Directorio de Codeudores (soporte N:M con Contrato). Búsqueda estricta por cédula/documento. */
const auth = useAuthStore()

const {
  filtros,
  page,
  limit,
  total,
  lista: codeudores,
  cargando,
  error,
  cargar,
  modalAbierto,
  editando: codeudorEditando,
  formulario,
  guardando,
  guardar,
  abrirCreacion,
  abrirEdicion,
  formularioValido,
  modalBajaAbierto,
  procesandoBaja,
  paraBaja: codeudorParaBaja,
  confirmarBaja,
  ejecutarBaja,
  alternarActivo,
  reactivando,
} = usePersonasDirectorio('codeudores', 'codeudor')

const columnas = [
  { key: 'numeroDocumento', label: 'Documento' },
  { key: 'nombreCompleto', label: 'Nombre completo' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'email', label: 'Correo' },
  { key: 'activo', label: 'Estado' },
  { key: 'acciones', label: 'Acciones' },
]
</script>

<template>
  <div>
    <div class="flex justify-end mb-4">
      <UButton color="amber" icon="i-heroicons-plus" @click="abrirCreacion">Nuevo codeudor</UButton>
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
      <UTable :rows="codeudores" :columns="columnas" :loading="cargando">
        <template #activo-data="{ row }">
          <SharedStatusBadge domain="activo" :value="row.activo" />
        </template>
        <template #acciones-data="{ row }">
          <UiTableRowActions
            v-if="auth.esAdministrador"
            :activo="row.activo"
            :disabled="reactivando"
            @editar="abrirEdicion(row)"
            @baja="confirmarBaja(row)"
            @reactivar="alternarActivo(row)"
          />
        </template>
        <template #empty-state>
          <div class="text-center py-10 text-slate-400">
            <UIcon name="i-heroicons-user-plus" class="w-10 h-10 mx-auto mb-2" />
            <p>No hay codeudores que coincidan con la búsqueda.</p>
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
      :editando="!!codeudorEditando"
      :guardando="guardando"
      :valido="formularioValido"
      titulo-creacion="Nuevo codeudor"
      titulo-edicion="Editar codeudor"
      label-creacion="Crear codeudor"
      label-edicion="Guardar cambios"
      @guardar="guardar"
    />

    <UiConfirmModal
      v-model="modalBajaAbierto"
      title="Dar de baja"
      :message="`¿Confirma dar de baja a ${codeudorParaBaja?.nombreCompleto}?`"
      :loading="procesandoBaja"
      color="red"
      @confirm="ejecutarBaja"
      @cancel="modalBajaAbierto = false"
    />
  </div>
</template>
