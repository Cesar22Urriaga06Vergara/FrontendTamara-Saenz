import { useAuthStore } from '~/stores/auth.store'
import { useEstadoConexion } from '~/composables/useEstadoConexion'

export type ApiFetchOptions = Record<string, unknown> & {
  headers?: Record<string, string>
}

const MAX_REINTENTOS_RED = 3
const espera = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function statusDe(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) return undefined
  // `FetchError` de ofetch declara `response`/`status` como propiedades propias incluso cuando
  // valen `undefined` (fallo de red, sin respuesta HTTP real) — por eso NO basta con `'response'
  // in error` ni con `Number(x)` a secas: `Number(undefined)` da `NaN`, y `NaN !== undefined`
  // rompe la distinción "sin status = fallo de red" que usa `esFalloDeRed`.
  const status =
    (error as { response?: { status?: unknown }; status?: unknown }).response?.status ??
    (error as { status?: unknown }).status
  return typeof status === 'number' ? status : undefined
}

/** Sin status HTTP (red/DNS/offline) o 5xx de gateway: el servidor no es alcanzable ahora mismo. */
function esFalloDeRed(error: unknown): boolean {
  const status = statusDe(error)
  return status === undefined || status === 502 || status === 503 || status === 504
}

/**
 * Composable central para llamadas a la API.
 * Inyecta automáticamente el Bearer token. Ante un 401 renueva la sesión y reintenta la
 * petición original (para que el usuario no vea la operación fallar aunque la sesión ya se
 * haya renovado — AUD-023). Ante un corte de red o un backend momentáneamente caído,
 * reintenta con backoff en vez de propagar el error o cerrar la sesión — solo un 401/403
 * REAL en la renovación (refresh token revocado/expirado) cierra la sesión.
 */
export async function useApiFetch<T = unknown>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const config = useRuntimeConfig()
  const auth = useAuthStore()
  const conexion = useEstadoConexion()
  // Solo se registra en el contador global de `useEstadoConexion` la PRIMERA vez que esta
  // llamada concreta entra en su bucle de reintento — para no desbalancear iniciar/resolver.
  let registradaComoProblema = false

  const ejecutar = () =>
    $fetch<T>(path, {
      baseURL: config.public.apiBaseUrl,
      headers: {
        ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
        ...(options.headers ?? {}),
      },
      ...options,
    })

  let intentosRed = 0
  for (;;) {
    try {
      const resultado = await ejecutar()
      if (registradaComoProblema) conexion.resolverConExito()
      return resultado
    } catch (error: unknown) {
      const status = statusDe(error)

      if (status === 401 && auth.refreshToken) {
        const resultado = await auth.refrescarSesion()
        if (resultado === 'ok') continue // reintentar la petición original con el token nuevo
        if (resultado === 'invalido') {
          if (registradaComoProblema) conexion.resolverSinExito()
          await auth.cerrarSesion()
          await navigateTo('/login')
          throw error
        }
        // 'sin-red': no se pudo verificar el refresh token — se trata como fallo de red abajo.
      }

      if (esFalloDeRed(error) && intentosRed < MAX_REINTENTOS_RED) {
        intentosRed++
        if (!registradaComoProblema) {
          registradaComoProblema = true
          conexion.iniciarIntento()
        }
        await espera(Math.min(1000 * 2 ** (intentosRed - 1), 5000)) // 1s, 2s, 4s (máx 5s)
        continue
      }

      if (registradaComoProblema) conexion.resolverSinExito()
      throw error
    }
  }
}
