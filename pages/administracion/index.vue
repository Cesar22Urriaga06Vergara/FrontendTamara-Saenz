<script setup lang="ts">
/**
 * Panel de Administración — EXCLUSIVO Administrador (protegido por middleware global).
 * Gestión de Usuarios (RBAC). Los parámetros globales de Empresa (mora, horizonte de
 * canon, datos corporativos, logo) se editan únicamente desde /configuracion — antes
 * se duplicaban aquí, generando dos pantallas para el mismo recurso (H9).
 */

// ---- Usuarios ----
const {
  page: paginaUsuarios,
  limit: limiteUsuarios,
  total: totalUsuarios,
  lista: usuarios,
  cargando: cargandoUsuarios,
  error: errorUsuarios,
  cargar: cargarUsuarios,
} = useListadoPaginado<any>(({ page, limit }) => useApiFetch<any>('/usuarios', { params: { page, limit } }), {
  mensajeError: 'No fue posible cargar los usuarios.',
})

const columnasUsuarios = [
  { key: 'nombreCompleto', label: 'Nombre' },
  { key: 'email', label: 'Correo' },
  { key: 'rol', label: 'Rol' },
  { key: 'activo', label: 'Estado' },
  { key: 'acciones', label: '' },
]

const modalUsuarioAbierto = ref(false)
const nuevoUsuario = reactive({ nombreCompleto: '', email: '', password: '', rol: 'RECEPCIONISTA' })
const creandoUsuario = ref(false)

async function crearUsuario() {
  errorUsuarios.value = ''
  creandoUsuario.value = true
  try {
    await useApiFetch('/usuarios', { method: 'POST', body: nuevoUsuario })
    modalUsuarioAbierto.value = false
    Object.assign(nuevoUsuario, { nombreCompleto: '', email: '', password: '', rol: 'RECEPCIONISTA' })
    await cargarUsuarios()
  } catch (e: any) {
    errorUsuarios.value = e?.data?.message || 'No fue posible crear el usuario.'
  } finally {
    creandoUsuario.value = false
  }
}

// Desactivar un usuario pide confirmación (acción sensible); reactivar es directo,
// igual al patrón ya usado en Clientes/Codeudores (baja confirma, reactivar no).
const modalDesactivarAbierto = ref(false)
const usuarioParaDesactivar = ref<any>(null)
const desactivando = ref(false)

function alternarActivo(usuario: any) {
  errorUsuarios.value = ''
  if (usuario.activo) {
    usuarioParaDesactivar.value = usuario
    modalDesactivarAbierto.value = true
    return
  }
  activarUsuario(usuario)
}

async function activarUsuario(usuario: any) {
  errorUsuarios.value = ''
  try {
    await useApiFetch(`/usuarios/${usuario.id}`, { method: 'PATCH', body: { activo: true } })
    await cargarUsuarios()
  } catch (e: any) {
    errorUsuarios.value = e?.data?.message || 'No fue posible activar el usuario.'
  }
}

async function confirmarDesactivar() {
  if (!usuarioParaDesactivar.value) return
  errorUsuarios.value = ''
  desactivando.value = true
  try {
    await useApiFetch(`/usuarios/${usuarioParaDesactivar.value.id}`, { method: 'PATCH', body: { activo: false } })
    modalDesactivarAbierto.value = false
    await cargarUsuarios()
  } catch (e: any) {
    errorUsuarios.value = e?.data?.message || 'No fue posible desactivar el usuario.'
  } finally {
    desactivando.value = false
  }
}

// ---- Reseteo de contraseña ----
const modalPasswordAbierto = ref(false)
const usuarioParaPassword = ref<any>(null)
const nuevaPassword = ref('')
const restableciendoPassword = ref(false)

function abrirResetPassword(usuario: any) {
  errorUsuarios.value = ''
  usuarioParaPassword.value = usuario
  nuevaPassword.value = ''
  modalPasswordAbierto.value = true
}

async function confirmarResetPassword() {
  if (!usuarioParaPassword.value || nuevaPassword.value.length < 8) return
  restableciendoPassword.value = true
  try {
    await useApiFetch(`/usuarios/${usuarioParaPassword.value.id}/password`, {
      method: 'PATCH',
      body: { nuevaPassword: nuevaPassword.value },
    })
    modalPasswordAbierto.value = false
  } catch (e: any) {
    errorUsuarios.value = e?.data?.message || 'No fue posible restablecer la contraseña.'
  } finally {
    restableciendoPassword.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold text-slate-900">Administración</h1>
      <UButton color="gray" variant="soft" icon="i-heroicons-cog-6-tooth" to="/configuracion">
        Parámetros de la empresa
      </UButton>
    </div>

    <!-- Usuarios -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <p class="font-semibold text-slate-900">Usuarios (RBAC)</p>
          <UButton color="amber" icon="i-heroicons-plus" size="sm" @click="modalUsuarioAbierto = true">
            Nuevo usuario
          </UButton>
        </div>
      </template>

      <SharedErrorState v-if="errorUsuarios" :message="errorUsuarios" class="mb-3" @retry="cargarUsuarios" />

      <UTable :rows="usuarios" :columns="columnasUsuarios" :loading="cargandoUsuarios">
        <template #rol-data="{ row }">
          <SharedStatusBadge domain="rol" :value="row.rol" />
        </template>
        <template #activo-data="{ row }">
          <UButton size="xs" :color="row.activo ? 'emerald' : 'gray'" variant="soft" @click="alternarActivo(row)">
            {{ row.activo ? 'Activo' : 'Inactivo' }}
          </UButton>
        </template>
        <template #acciones-data="{ row }">
          <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-key" @click="abrirResetPassword(row)">
            Restablecer contraseña
          </UButton>
        </template>
        <template #empty-state>
          <div class="text-center py-10 text-slate-400">
            <UIcon name="i-heroicons-users" class="w-10 h-10 mx-auto mb-2" />
            <p>No hay usuarios registrados.</p>
          </div>
        </template>
      </UTable>

      <div class="flex justify-end mt-4">
        <UPagination v-model="paginaUsuarios" :page-count="limiteUsuarios" :total="totalUsuarios" />
      </div>
    </UCard>

    <!-- Modal nuevo usuario -->
    <UModal v-model="modalUsuarioAbierto">
      <UCard>
        <template #header><p class="font-semibold text-slate-900">Nuevo usuario</p></template>
        <div class="space-y-3">
          <UFormGroup label="Nombre completo">
            <UInput v-model="nuevoUsuario.nombreCompleto" />
          </UFormGroup>
          <UFormGroup label="Correo electrónico">
            <UInput v-model="nuevoUsuario.email" type="email" />
          </UFormGroup>
          <UFormGroup label="Contraseña temporal">
            <UInput v-model="nuevoUsuario.password" type="password" />
          </UFormGroup>
          <UFormGroup label="Rol">
            <USelectMenu v-model="nuevoUsuario.rol" :options="['ADMINISTRADOR', 'RECEPCIONISTA']" />
          </UFormGroup>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="modalUsuarioAbierto = false">Cancelar</UButton>
            <UButton color="amber" :loading="creandoUsuario" @click="crearUsuario">Crear usuario</UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Modal restablecer contraseña -->
    <UModal v-model="modalPasswordAbierto">
      <UCard>
        <template #header>
          <p class="font-semibold text-slate-900">Restablecer contraseña — {{ usuarioParaPassword?.nombreCompleto }}</p>
        </template>
        <UFormGroup label="Nueva contraseña (mínimo 8 caracteres)">
          <UInput v-model="nuevaPassword" type="password" />
        </UFormGroup>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="modalPasswordAbierto = false">Cancelar</UButton>
            <UButton
              color="amber"
              :loading="restableciendoPassword"
              :disabled="nuevaPassword.length < 8"
              @click="confirmarResetPassword"
            >
              Restablecer
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <UiConfirmModal
      v-model="modalDesactivarAbierto"
      title="Desactivar usuario"
      :message="`¿Confirma desactivar a ${usuarioParaDesactivar?.nombreCompleto}? No podrá iniciar sesión hasta que se reactive.`"
      confirm-label="Desactivar"
      :loading="desactivando"
      color="red"
      @confirm="confirmarDesactivar"
      @cancel="modalDesactivarAbierto = false"
    />
  </div>
</template>
