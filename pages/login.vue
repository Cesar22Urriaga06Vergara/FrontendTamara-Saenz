<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

definePageMeta({ layout: false })

const auth = useAuthStore()
const config = useRuntimeConfig()
const marca = useMarcaEmpresa()

const email = ref('')
const password = ref('')
const mostrarPassword = ref(false)
const cargando = ref(false)
const error = ref('')
const erroresCampo = reactive({ email: '', password: '' })

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validar(): boolean {
  erroresCampo.email = !email.value
    ? 'El correo es obligatorio.'
    : !REGEX_EMAIL.test(email.value)
      ? 'Ingresa un correo válido.'
      : ''
  erroresCampo.password = !password.value ? 'La contraseña es obligatoria.' : ''
  return !erroresCampo.email && !erroresCampo.password
}

async function ingresar() {
  error.value = ''
  if (!validar()) return

  cargando.value = true
  try {
    await auth.iniciarSesion(email.value, password.value)
    await navigateTo('/dashboard')
  } catch (e: any) {
    error.value = e?.data?.message || 'Credenciales inválidas. Verifica tu correo y contraseña.'
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Franja izquierda: marca (split-screen) -->
    <div
      class="hidden lg:flex w-1/2 bg-marca-antracita text-white flex-col justify-between p-12 relative overflow-hidden"
    >
      <div class="absolute inset-0 opacity-10 bg-gradient-to-br from-marca-dorado to-transparent"></div>
      <div class="relative z-10">
        <p class="text-2xl font-bold tracking-tight">{{ config.public.appName }}</p>
      </div>
      <div class="relative z-10">
        <p class="text-4xl font-serif italic text-marca-dorado leading-tight">"{{ config.public.appSlogan }}"</p>
        <p class="mt-4 text-slate-400 text-sm max-w-sm">
          Control centralizado de recaudo, contratos y novedades operativas de todo el portafolio inmobiliario.
        </p>
      </div>
      <p class="relative z-10 text-xs text-slate-500">
        © {{ new Date().getFullYear() }} — Todos los derechos reservados.
      </p>
    </div>

    <!-- Franja derecha: formulario -->
    <div class="flex-1 flex items-center justify-center bg-slate-50 p-8">
      <div class="w-full max-w-sm">
        <img
          :src="marca.logoSrc.value || '/Logo.png'"
          alt="Inversiones Tamara & Saenz"
          class="h-20 w-auto mx-auto mb-8"
        />

        <h2 class="text-2xl font-semibold text-slate-900 mb-1 text-center">Iniciar sesión</h2>
        <p class="text-sm text-slate-600 mb-6 text-center">Ingresa tus credenciales para continuar.</p>

        <form class="space-y-4" novalidate @submit.prevent="ingresar">
          <UFormGroup label="Correo electrónico" :error="erroresCampo.email">
            <UInput
              v-model="email"
              type="email"
              placeholder="usuario@tamarasaenz.com"
              icon="i-heroicons-envelope"
              @update:model-value="erroresCampo.email = ''"
            />
          </UFormGroup>

          <UFormGroup label="Contraseña" :error="erroresCampo.password">
            <UInput
              v-model="password"
              :type="mostrarPassword ? 'text' : 'password'"
              placeholder="••••••••"
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

          <UAlert v-if="error" color="red" variant="subtle" :title="error" icon="i-heroicons-exclamation-triangle" />

          <UButton
            type="submit"
            block
            size="lg"
            :loading="cargando"
            class="!bg-marca-dorado hover:!bg-marca-dorado-oscuro !text-marca-antracita font-semibold focus-visible:!ring-marca-dorado"
          >
            Ingresar
          </UButton>

          <p class="text-center text-sm text-slate-500">
            ¿Primera vez que usas el sistema?
            <NuxtLink to="/registro" class="font-medium text-marca-dorado-oscuro hover:underline"
              >Crear cuenta de Administrador</NuxtLink
            >
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
