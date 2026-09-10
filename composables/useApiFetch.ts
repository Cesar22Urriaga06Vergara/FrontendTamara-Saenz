import { useAuthStore } from '~/stores/auth.store'
import { useEstadoConexion } from '~/composables/useEstadoConexion'

export type ApiFetchOptions = Record<string, unknown> & {
  headers?: Record<string, string>
  /**
   * Por defecto `useApiFetch` NO reintenta ante un fallo de red las peticiones
   * POST/PATCH/PUT/DELETE: si la red se corta DESPUÉS de enviar la petición, el resultado queda
   * DESCONOCIDO y reintentar podría duplicar la operación (p. ej. un segundo recibo de caja,
   * hallazgo S-6). Pásalo en `true` SOLO si la operación es idempotente de verdad en el backend
   * — p. ej. `/recaudo/pagos/simular` (no persiste nada) o `/obligaciones/generar-canones`
   * (salta los cánones que ya existen por índice único).
   */
  idempotente?: boolean
}

const MAX_REINTENTOS_RED = 3
const espera = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const METODOS_IDEMPOTENTES = new Set(['GET', 'HEAD', 'OPTIONS'])

function nuevoRequestId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') return globalThis.crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

/** Un fallo de red solo se reintenta si repetir la petición es seguro (GET, o `idempotente: true`). */
function esReintentable(options: ApiFetchOptions): boolean {
  if (options.idempotente === true) return true
  const metodo = String(options.method ?? 'GET').toUpperCase()
  return METODOS_IDEMPOTENTES.has(metodo)
}

/**
 * Se lanza cuando una mutación no idempotente falla por red: la petición pudo haber llegado al
 * backend y haberse ejecutado, o no — no hay forma de saberlo desde el cliente. La página debe
 * pedir al usuario que VERIFIQUE antes de reintentar, en vez de mostrar "falló" (que invita a
 * reintentar y duplicar).
 */
export class ErrorMutacionIncierta extends Error {
  readonly esMutacionIncierta = true
  constructor(
    readonly path: string,
    readonly causa: unknown,
  ) {
    super(
      'No se pudo confirmar si la operación se completó (se perdió la conexión al enviarla). ' +
        'Verificá en la pantalla antes de volver a intentar.',
    )
    this.name = 'ErrorMutacionIncierta'
  }
}

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
  const requestId = options.headers?.['x-request-id'] ?? nuevoRequestId()
  const { headers: headersPersonalizados, ...opcionesFetch } = options
  // Solo se registra en el contador global de `useEstadoConexion` la PRIMERA vez que esta
  // llamada concreta entra en su bucle de reintento — para no desbalancear iniciar/resolver.
  let registradaComoProblema = false

  const ejecutar = () =>
    $fetch<T>(path, {
      baseURL: config.public.apiBaseUrl,
      headers: {
        ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
        'x-request-id': requestId,
        ...(headersPersonalizados ?? {}),
      },
      ...opcionesFetch,
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

      if (esFalloDeRed(error) && esReintentable(options) && intentosRed < MAX_REINTENTOS_RED) {
        intentosRed++
        if (!registradaComoProblema) {
          registradaComoProblema = true
          conexion.iniciarIntento()
        }
        await espera(Math.min(1000 * 2 ** (intentosRed - 1), 5000)) // 1s, 2s, 4s (máx 5s)
        continue
      }

      // Fallo de red en una mutación NO idempotente: no se reintenta (evita el doble cobro).
      // Se marca la conexión como caída para el banner y se lanza un error tipado para que la
      // página muestre "verificá antes de reintentar" en vez de "falló".
      if (esFalloDeRed(error) && !esReintentable(options)) {
        conexion.iniciarIntento()
        conexion.resolverSinExito()
        throw new ErrorMutacionIncierta(path, error)
      }

      if (registradaComoProblema) conexion.resolverSinExito()
      throw error
    }
  }
}
