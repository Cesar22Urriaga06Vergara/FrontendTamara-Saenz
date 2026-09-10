<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

definePageMeta({ layout: false })

useHead({ title: 'Iniciar sesión · Tamara & Saenz' })

const auth = useAuthStore()
const marca = useMarcaEmpresa()

const email = ref('')
const password = ref('')
const mostrarPassword = ref(false)
const cargando = ref(false)
const error = ref('')
const erroresCampo = reactive({ email: '', password: '' })

// S-5: hasta que Vue hidrate la página, `@submit.prevent` no corre. Deshabilitar el submit
// hasta `onMounted` evita que un Enter/clic pre-hidratación dispare el envío nativo del <form>
// (que, aun siendo POST, recargaría la página sin sesión). Al montar, se habilita.
const montado = ref(false)
onMounted(() => {
  montado.value = true
})

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validar(): boolean {
  erroresCampo.email = !email.value
    ? 'El correo es obligatorio.'
    : !REGEX_EMAIL.test(email.value)
      ? 'Ingresa un correo válido.'
      : ''
  // El backend rechaza cualquier contraseña de menos de 6 caracteres (LoginDto @MinLength(6)),
  // así que se valida aquí también para no gastar un intento del límite de 5/min en un 400.
  erroresCampo.password = !password.value
    ? 'La contraseña es obligatoria.'
    : password.value.length < 6
      ? 'La contraseña debe tener al menos 6 caracteres.'
      : ''
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
    const status = e?.statusCode ?? e?.response?.status
    const msg = e?.data?.message
    const detalle = Array.isArray(msg) ? msg[0] : msg
    if (status === 429) {
      error.value = 'Demasiados intentos. Espera un minuto e inténtalo de nuevo.'
    } else if (status === 401) {
      error.value = 'Credenciales inválidas. Verifica tu correo y contraseña.'
    } else if (status === 400) {
      error.value = detalle || 'Revisa los datos ingresados.'
    } else if (!status) {
      error.value = 'No se pudo conectar con el servidor. Inténtalo más tarde.'
    } else {
      error.value = detalle || 'No fue posible iniciar sesión. Inténtalo más tarde.'
    }
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-marca-antracita p-4 sm:p-6">
    <!-- Fondo decorativo: silueta de casa + resplandor dorado + viñeta -->
    <div class="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
      <!-- Resplandor cálido detrás de la tarjeta -->
      <div
        class="absolute left-1/2 top-[40%] h-[62vmin] w-[100vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-marca-dorado/25 blur-[130px]"
      ></div>
      <div
        class="absolute left-1/2 top-[36%] h-[24vmin] w-[38vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-marca-dorado/30 blur-[80px]"
      ></div>
      <!-- Silueta de la casa (motivo del logo), nítida y tenue -->
      <svg
        class="absolute -right-16 -top-24 w-[560px] max-w-[72vw] text-marca-dorado/[0.12]"
        viewBox="0 0 240 200"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linejoin="round"
      >
        <path d="M18 92 L120 20 L222 92" stroke-linecap="round" />
        <path d="M44 78 L44 178 L196 178 L196 78" />
        <path d="M104 178 L104 120 L140 120 L140 178" />
      </svg>
      <svg
        class="absolute -bottom-24 -left-20 w-[420px] max-w-[60vw] text-marca-dorado/[0.06]"
        viewBox="0 0 240 200"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linejoin="round"
      >
        <path d="M18 92 L120 20 L222 92" stroke-linecap="round" />
        <path d="M44 78 L44 178 L196 178 L196 78" />
      </svg>
      <!-- Viñeta -->
      <div
        class="absolute inset-0"
        style="background: radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.6) 100%)"
      ></div>
    </div>

    <!-- Tarjeta de acceso -->
    <div class="relative z-10 w-full max-w-md">
      <div class="overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_-24px_rgba(0,0,0,0.7)] ring-1 ring-slate-200/80">
        <div class="h-1.5 w-full bg-gradient-to-r from-marca-dorado via-amber-400 to-marca-dorado-oscuro"></div>

        <div class="px-8 pb-9 pt-8 sm:px-10">
          <div class="flex flex-col items-center text-center">
            <div class="flex h-24 w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-200 sm:h-28">
              <img
                :src="marca.logoSrc.value || '/Logo.png'"
                :alt="marca.nombre.value"
                class="h-44 w-auto max-w-none object-contain sm:h-52"
              />
            </div>
            <h1 class="mt-5 text-2xl font-semibold tracking-tight text-slate-900">Iniciar sesión</h1>
            <p class="mt-1 text-sm text-slate-600">Accede al sistema operativo de gestión inmobiliaria.</p>
          </div>

          <!-- method="post" es el fallback si el form se envía antes de hidratar (S-5): las
               credenciales van en el cuerpo, nunca en la URL / logs / historial. El envío real
               siempre es POST por JS desde `ingresar()`; `@submit.prevent` lo intercepta. -->
          <form method="post" action="/login" class="mt-7 space-y-4" novalidate @submit.prevent="ingresar">
            <UFormGroup label="Correo electrónico" :error="erroresCampo.email">
              <UInput
                v-model="email"
                type="email"
                name="email"
                autocomplete="username"
                autofocus
                size="lg"
                placeholder="usuario@tamarasaenz.com"
                icon="i-heroicons-envelope"
                @update:model-value="erroresCampo.email = ''"
              />
            </UFormGroup>

            <UFormGroup label="Contraseña" :error="erroresCampo.password">
              <UInput
                v-model="password"
                :type="mostrarPassword ? 'text' : 'password'"
                name="password"
                autocomplete="current-password"
                size="lg"
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

            <UAlert
              v-if="error"
              color="red"
              variant="subtle"
              :title="error"
              icon="i-heroicons-exclamation-triangle"
              class="rounded-xl"
            />

            <UButton
              type="submit"
              block
              size="lg"
              :loading="cargando"
              :disabled="!montado || cargando"
              class="mt-2 !bg-gradient-to-r !from-marca-dorado !to-marca-dorado-oscuro !text-marca-antracita font-semibold shadow-[0_10px_24px_-12px_rgba(207,160,82,0.8)] focus-visible:!ring-2 focus-visible:!ring-marca-dorado focus-visible:!ring-offset-2"
            >
              Ingresar
            </UButton>
          </form>
        </div>
      </div>

      <p
        class="mt-6 flex flex-col items-center justify-center gap-1 text-center text-xs text-white/45 sm:flex-row sm:gap-2"
      >
        <span class="font-serif italic text-marca-dorado/90">"{{ marca.slogan.value }}"</span>
        <span class="hidden text-white/25 sm:inline">·</span>
        <span>© {{ new Date().getFullYear() }} {{ marca.nombre.value }}</span>
      </p>
    </div>
  </div>
</template>
