import { useAuthStore } from '~/stores/auth.store'

/** Rehidrata la sesión desde localStorage al cargar la app (evita perder la sesión al refrescar). */
export default defineNuxtPlugin(() => {
  useAuthStore().restaurar()
})
