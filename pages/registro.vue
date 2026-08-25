<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

/**
 * Registro del primer Administrador (bootstrap de producción con la base de datos en
 * blanco, ver `AuthController.registroInicial`): solo funciona mientras el sistema no
 * tenga ningún usuario creado. Si ya existe alguno, el backend responde 403 y esta
 * página lo explica en vez de dejar el formulario reintentable indefinidamente.
 */
definePageMeta({ layout: false })

const auth = useAuthStore()
const marca = useMarcaEmpresa()

const nombreCompleto = ref('')
const email = ref('')
const password = ref('')
const confirmarPassword = ref('')
const mostrarPassword = ref(false)
const cargando = ref(false)
const error = ref('')
const yaNoDisponible = ref(false)
const erroresCampo = reactive({ nombreCompleto: '', email: '', password: '', confirmarPassword: '' })

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validar(): boolean {
  erroresCampo.nombreCompleto = !nombreCompleto.value.trim() ? 'El nombre es obligatorio.' : ''
  erroresCampo.email = !email.value
    ? 'El correo es obligatorio.'
    : !REGEX_EMAIL.test(email.value)
      ? 'Ingresa un correo válido.'
      : ''
  erroresCampo.password = !password.value
    ? 'La contraseña es obligatoria.'
    : password.value.length < 8
      ? 'Debe tener al menos 8 caracteres.'
      : ''
  erroresCampo.confirmarPassword = confirmarPassword.value !== password.value ? 'Las contraseñas no coinciden.' : ''
  return !erroresCampo.nombreCompleto && !erroresCampo.email && !erroresCampo.password && !erroresCampo.confirmarPassword
}

async function registrar() {
  error.value = ''
  if (!validar()) return

  cargando.value = true
  try {
    await auth.registrarInicial(nombreCompleto.value, email.value, password.value)
    await navigateTo('/dashboard')
  } catch (e: any) {
    if (e?.response?.status === 403) yaNoDisponible.value = true
    error.value = e?.data?.message || 'No fue posible crear la cuenta.'
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex">
    <div class="hidden lg:flex w-1/2 bg-[#1A1A1A] text-white flex-col justify-between p-12 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10 bg-gradient-to-br from-[#CFA052] to-transparent"></div>
      <div class="relative z-10">
        <p class="text-2xl font-bold tracking-tight">{{ marca.nombre.value }}</p>
      </div>
      <div class="relative z-10">
        <p class="text-4xl font-serif italic text-[#CFA052] leading-tight">"{{ marca.slogan.value }}"</p>
        <p class="mt-4 text-[#9AA0A8] text-sm max-w-sm">
          Configura la cuenta de Administrador con la que operarás el sistema por primera vez.
        </p>
      </div>
      <p class="relative z-10 text-xs text-[#6B6F75]">© {{ new Date().getFullYear() }} — Todos los derechos reservados.</p>
    </div>

    <div class="flex-1 flex items-center justify-center bg-slate-50 p-8">
      <div class="w-full max-w-sm">
        <img :src="marca.logoSrc.value || '/Logo.png'" alt="Logo de la empresa" class="h-20 w-auto mx-auto mb-8" />

        <h2 class="text-2xl font-semibold text-slate-900 mb-1 text-center">Crear cuenta de Administrador</h2>
        <p class="text-sm text-slate-600 mb-6 text-center">
          Disponible solo una vez, para configurar el sistema al entrar a producción.
        </p>

        <UAlert
          v-if="yaNoDisponible"
          color="amber"
          variant="subtle"
          icon="i-heroicons-exclamation-triangle"
          title="El registro inicial ya no está disponible"
          description="El sistema ya tiene al menos un usuario creado. Pide una cuenta a un Administrador existente."
          class="mb-4"
        />

        <form v-else class="space-y-4" @submit.prevent="registrar" novalidate>
          <UFormGroup label="Nombre completo" :error="erroresCampo.nombreCompleto">
            <UInput
              v-model="nombreCompleto"
              placeholder="Ej: María Sáenz"
              icon="i-heroicons-user"
              @update:model-value="erroresCampo.nombreCompleto = ''"
            />
          </UFormGroup>

          <UFormGroup label="Correo electrónico" :error="erroresCampo.email">
            <UInput
              v-model="email"
              type="email"
              placeholder="admin@tamarasaenz.com"
              icon="i-heroicons-envelope"
              @update:model-value="erroresCampo.email = ''"
            />
          </UFormGroup>

          <UFormGroup label="Contraseña" :error="erroresCampo.password">
            <UInput
              v-model="password"
              :type="mostrarPassword ? 'text' : 'password'"
              placeholder="Mínimo 8 caracteres"
              icon="i-heroicons-lock-closed"
              @update:model-value="erroresCampo.password = ''"
            >
              <template #trailing>
                <UButton
                  :icon="mostrarPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                  color="gray"
                  variant="link"
                  :padded="false"
                  class="pointer-events-auto"
                  :aria-label="mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                  @click="mostrarPassword = !mostrarPassword"
                />
              </template>
            </UInput>
          </UFormGroup>

          <UFormGroup label="Confirmar contraseña" :error="erroresCampo.confirmarPassword">
            <UInput
              v-model="confirmarPassword"
              :type="mostrarPassword ? 'text' : 'password'"
              placeholder="Repite la contraseña"
              icon="i-heroicons-lock-closed"
              @update:model-value="erroresCampo.confirmarPassword = ''"
            />
          </UFormGroup>

          <UAlert v-if="error" color="red" variant="subtle" :title="error" icon="i-heroicons-exclamation-triangle" />

          <UButton
            type="submit"
            block
            size="lg"
            :loading="cargando"
            class="!bg-[#CFA052] hover:!bg-[#B98D42] !text-[#1A1A1A] font-semibold focus-visible:!ring-[#CFA052]"
          >
            Crear cuenta y entrar
          </UButton>

          <p class="text-center text-sm text-slate-500">
            ¿Ya tienes cuenta?
            <NuxtLink to="/login" class="font-medium text-[#B98D42] hover:underline">Iniciar sesión</NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
