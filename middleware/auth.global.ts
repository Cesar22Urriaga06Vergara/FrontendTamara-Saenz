import { useAuthStore } from '~/stores/auth.store'

/**
 * Middleware global: protege todas las rutas excepto /login.
 * Además valida acceso por rol en rutas exclusivas de Administrador
 * (ej: /recaudo, /reportes) — el Recepcionista es redirigido con aviso.
 */
export default defineNuxtRouteMiddleware((to) => {
  // La sesión vive solo en localStorage (no hay cookies), así que en el paso de
  // SSR el store siempre está vacío. Validar aquí redirigiría a /login en cada
  // recarga aunque haya sesión real; se valida en el cliente tras hidratar.
  if (import.meta.server) return

  const auth = useAuthStore()

  const rutasPublicas = ['/login', '/registro']
  if (rutasPublicas.includes(to.path)) return

  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }

  // No existe pages/index.vue, así que "/" no matchea ninguna ruta: redirigir
  // explícitamente o Vue Router queda sin página que renderizar.
  if (to.path === '/') {
    return navigateTo('/dashboard')
  }

  const rutasSoloAdmin = [
    '/recaudo',
    '/reportes',
    '/administracion',
    '/configuracion',
    '/movimientos',
    '/auditoria',
    '/recibos',
    '/caja',
    '/cartera',
    '/gastos',
    '/depositos',
    '/transferencias',
  ]
  const esRutaAdmin = rutasSoloAdmin.some((r) => to.path.startsWith(r))
  if (esRutaAdmin && auth.rol !== 'ADMINISTRADOR') {
    return navigateTo('/dashboard')
  }
})
