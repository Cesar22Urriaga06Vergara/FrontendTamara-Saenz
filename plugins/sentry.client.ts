import * as Sentry from '@sentry/vue'

/**
 * Error reporting del frontend (plan FE-018). App SPA estática (`ssr: false`) → solo cliente,
 * con `@sentry/vue` directo (no `@sentry/nuxt`, que arrastra `@sentry/node` para un servidor
 * que aquí no existe y choca con el preset `cloudflare-pages`).
 *
 * Sin `NUXT_PUBLIC_SENTRY_DSN` no hace nada: seguro en local y en cualquier entorno sin configurar.
 */
export default defineNuxtPlugin({
  name: 'sentry',
  enforce: 'pre',
  setup(nuxtApp) {
    const dsn = useRuntimeConfig().public.sentryDsn
    if (!dsn) return

    Sentry.init({
      app: nuxtApp.vueApp,
      dsn,
      environment: import.meta.dev ? 'development' : 'production',
      integrations: [Sentry.browserTracingIntegration({ router: useRouter() })],
      tracesSampleRate: 0.1,
      // No grabar la sesión: es un ERP con datos financieros (cédulas, montos).
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,
      // No enviar PII (IP, cookies) ni cuerpos de petición.
      sendDefaultPii: false,
      // `ErrorMutacionIncierta` (FE-015) es un aviso al usuario, no un bug: no lo reportes.
      ignoreErrors: ['ErrorMutacionIncierta'],
    })
  },
})
