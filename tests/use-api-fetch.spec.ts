import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useApiFetch, ErrorMutacionIncierta } from '../composables/useApiFetch'
import { useAuthStore } from '../stores/auth.store'

// `$fetch` es un auto-import de Nuxt (`#build/fetch.mjs`), no un global → se intercepta con
// `mockNuxtImport`, no con `vi.stubGlobal`.
const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn() }))
mockNuxtImport('$fetch', () => fetchMock)

/**
 * S-6: `useApiFetch` NO debe reintentar mutaciones no idempotentes ante un fallo de red
 * (podría duplicar un recibo de caja). Los GET, y las mutaciones marcadas `idempotente: true`,
 * sí se reintentan con backoff.
 *
 * Se usa el store y `useEstadoConexion` reales (como `auth-store.spec.ts`); solo se stubea
 * `$fetch`. Los reintentos usan `setTimeout` real → se controlan con fake timers.
 */

/** Error de red (sin `status`) tal como lo lanza ofetch cuando no hay respuesta HTTP. */
function errorRed() {
  return Object.assign(new Error('network'), { response: undefined, status: undefined })
}
function errorHttp(status: number) {
  return Object.assign(new Error(String(status)), { response: { status }, status })
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.useRealTimers()
  fetchMock.mockReset()
  const auth = useAuthStore()
  auth.accessToken = 'tok'
  auth.refreshToken = 'ref'
})

describe('useApiFetch — reintento por idempotencia (S-6)', () => {
  it('envía un x-request-id estable durante toda la operación y sus reintentos', async () => {
    fetchMock.mockRejectedValueOnce(errorRed()).mockResolvedValueOnce({ ok: 1 })
    vi.useFakeTimers()
    const p = useApiFetch('/dashboard')
    await vi.runAllTimersAsync()
    await expect(p).resolves.toEqual({ ok: 1 })

    const primeraPeticion = fetchMock.mock.calls[0]![1]
    const segundaPeticion = fetchMock.mock.calls[1]![1]
    const primerRequestId = primeraPeticion.headers['x-request-id']

    expect(primerRequestId).toEqual(expect.any(String))
    expect(primerRequestId).toBe(segundaPeticion.headers['x-request-id'])
  })

  it('combina headers personalizados con autenticación y correlación', async () => {
    fetchMock.mockResolvedValueOnce({ ok: 1 })

    await expect(useApiFetch('/dashboard', { headers: { 'x-client': 'web' } })).resolves.toEqual({ ok: 1 })

    const headers = fetchMock.mock.calls[0]![1].headers
    expect(headers.Authorization).toBe('Bearer tok')
    expect(headers['x-client']).toBe('web')
    expect(headers['x-request-id']).toEqual(expect.any(String))
  })

  it('GET: reintenta ante fallo de red y termina devolviendo el valor', async () => {
    fetchMock.mockRejectedValueOnce(errorRed()).mockRejectedValueOnce(errorRed()).mockResolvedValueOnce({ ok: 1 })
    vi.useFakeTimers()
    const p = useApiFetch('/x')
    await vi.runAllTimersAsync()
    await expect(p).resolves.toEqual({ ok: 1 })
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('POST sin `idempotente`: NO reintenta, lanza ErrorMutacionIncierta, 1 sola llamada', async () => {
    fetchMock.mockRejectedValue(errorRed())
    await expect(useApiFetch('/recaudo/pagos', { method: 'POST' })).rejects.toBeInstanceOf(ErrorMutacionIncierta)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('POST con `idempotente: true`: reintenta igual que un GET', async () => {
    fetchMock.mockRejectedValueOnce(errorRed()).mockRejectedValueOnce(errorRed()).mockResolvedValueOnce({ ok: 1 })
    vi.useFakeTimers()
    const p = useApiFetch('/recaudo/pagos/simular', { method: 'POST', idempotente: true })
    await vi.runAllTimersAsync()
    await expect(p).resolves.toEqual({ ok: 1 })
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('POST que recibe 503: tampoco se reintenta (default conservador), ErrorMutacionIncierta', async () => {
    fetchMock.mockRejectedValue(errorHttp(503))
    await expect(useApiFetch('/recaudo/pagos', { method: 'POST' })).rejects.toBeInstanceOf(ErrorMutacionIncierta)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('401 en un POST: renueva sesión y reintenta la petición original una vez', async () => {
    const auth = useAuthStore()
    vi.spyOn(auth, 'refrescarSesion').mockResolvedValueOnce('ok')
    fetchMock.mockRejectedValueOnce(errorHttp(401)).mockResolvedValueOnce({ ok: 1 })
    await expect(useApiFetch('/recaudo/pagos', { method: 'POST' })).resolves.toEqual({ ok: 1 })
    expect(auth.refrescarSesion).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('PATCH sin `idempotente`: mismo comportamiento que POST (no reintenta)', async () => {
    fetchMock.mockRejectedValue(errorRed())
    await expect(useApiFetch('/obligaciones/1/anular', { method: 'PATCH' })).rejects.toBeInstanceOf(
      ErrorMutacionIncierta,
    )
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('GET agota los reintentos: propaga el error de red original, no ErrorMutacionIncierta', async () => {
    fetchMock.mockRejectedValue(errorRed())
    vi.useFakeTimers()
    const p = useApiFetch('/x').catch((e) => e)
    await vi.runAllTimersAsync()
    const err = await p
    expect(err).not.toBeInstanceOf(ErrorMutacionIncierta)
    expect(fetchMock).toHaveBeenCalledTimes(1 + 3) // intento inicial + 3 reintentos
  })
})
