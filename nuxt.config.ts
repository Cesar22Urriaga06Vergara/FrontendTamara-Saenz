export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  devtools: { enabled: true },

  // @nuxt/ui v2 ya incluye y gestiona su propio pipeline de Tailwind (v3) internamente
  // via @nuxtjs/tailwindcss. Declarar ese módulo aparte aquí genera un conflicto de
  // resolución del import virtual '#tailwind-config/theme/colors' en tiempo de build.
  modules: ['@nuxt/ui', '@pinia/nuxt', '@nuxt/eslint'],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1',
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'Inversiones Tamara & Saenz S. En C.',
      appSlogan: process.env.NUXT_PUBLIC_APP_SLOGAN || 'Resolvemos tu situacion',
    },
  },

  ui: {
    global: true,
  },

  // @nuxt/ui instala automáticamente @nuxtjs/color-mode con preferencia "system":
  // en cualquier equipo con el SO/navegador en modo oscuro, <html> recibía la clase
  // "dark" y los componentes de Nuxt UI (UInput, USelectMenu, UDropdown, UTable,
  // UCard, UFormGroup...) conmutaban a sus estilos dark: internos mientras el resto
  // del ERP está codificado a mano en modo claro, dejando texto/bordes invisibles
  // en estado estático. Este ERP no tiene diseño de modo oscuro: se fija "light"
  // de forma incondicional para todo el sistema.
  //
  // "preference"/"fallback" solo definen el valor por defecto: el script de
  // arranque de @nuxtjs/color-mode prioriza SIEMPRE un valor ya existente en
  // localStorage (clave "nuxt-color-mode") por encima de esta config, así que
  // cualquier navegador que haya guardado "dark" antes de este fix lo seguirá
  // aplicando indefinidamente. Se renombra la storageKey para que ese valor
  // legado quede huérfano y el candado a "light" sea efectivo también ahí.
  colorMode: {
    preference: 'light',
    fallback: 'light',
    storageKey: 'tamara-saenz-color-mode-lock',
  },

  app: {
    head: {
      title: 'Tamara & Saenz | ERP Inmobiliario',
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    },
    // Fade corto (150ms): es un ERP de uso operativo diario (cajero/recepción) — una
    // transición larga se sentiría lenta en el uso repetitivo. `out-in` evita que la
    // página saliente y la entrante coexistan visualmente un instante.
    pageTransition: { name: 'page', mode: 'out-in' },
  },
})
