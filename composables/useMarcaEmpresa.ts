/**
 * Marca de la empresa (nombre/slogan/logo) para el login (sin sesión) y el layout autenticado
 * (visible también para Recepcionista). Usa `GET /empresa/publico` — endpoint público que no
 * expone parámetros financieros — en vez de `GET /empresa` (exclusivo Administrador).
 * Si aún no se ha subido un logo, o la petición falla, `logoSrc` queda en `null` y quien lo
 * consuma debe mostrar su imagen estática de respaldo (`/Logo.png`).
 */
export function useMarcaEmpresa() {
  const config = useRuntimeConfig()
  const logoSrc = ref<string | null>(null)
  const nombre = ref<string>(config.public.appName as string)
  const slogan = ref<string>(config.public.appSlogan as string)

  onMounted(async () => {
    try {
      const data = await $fetch<any>('/empresa/publico', { baseURL: config.public.apiBaseUrl })
      if (data?.nombre) nombre.value = data.nombre
      if (data?.slogan) slogan.value = data.slogan
      if (data?.logoUrl) {
        const origenApi = new URL(config.public.apiBaseUrl as string).origin
        logoSrc.value = `${origenApi}${data.logoUrl}`
      }
    } catch {
      // Sin marca configurada aún (o backend no disponible en este momento): se mantienen
      // los valores por defecto de runtimeConfig y logoSrc queda en null.
    }
  })

  return { nombre, slogan, logoSrc }
}
