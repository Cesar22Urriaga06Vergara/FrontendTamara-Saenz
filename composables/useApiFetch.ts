import { useAuthStore } from '~/stores/auth.store'

/**
 * Composable central para llamadas a la API.
 * Inyecta automáticamente el Bearer token, y ante un 401 intenta renovar la sesión
 * una vez y REINTENTA la petición original con el nuevo token antes de propagar el
 * error (si no reintentara, el usuario vería la operación fallar aunque la sesión
 * ya se haya renovado con éxito — AUD-023).
 */
export async function useApiFetch<T = any>(path: string, options: any = {}): Promise<T> {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const ejecutar = () =>
    $fetch<T>(path, {
      baseURL: config.public.apiBaseUrl,
      headers: {
        ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    })

  try {
    return await ejecutar()
  } catch (error: any) {
    if (error?.response?.status === 401 && auth.refreshToken) {
      const renovado = await auth.refrescarSesion()
      if (renovado) {
        return await ejecutar()
      }
      await auth.cerrarSesion()
      navigateTo('/login')
    }
    throw error
  }
}
