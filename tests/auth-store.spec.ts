import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../stores/auth.store'

function stubLocalStorage(initial: Record<string, string> = {}) {
  const store = new Map<string, string>(Object.entries(initial))
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => {
      store.set(k, String(v))
    },
    removeItem: (k: string) => {
      store.delete(k)
    },
  })
  return store
}

describe('auth.store — restaurar()', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.unstubAllGlobals()
  })

  it('rehidrata una sesión válida', () => {
    stubLocalStorage({
      tamara_saenz_sesion: JSON.stringify({
        accessToken: 'a',
        refreshToken: 'r',
        usuario: { id: '1', email: 'x@y.com', rol: 'ADMINISTRADOR' },
      }),
    })
    const auth = useAuthStore()
    auth.restaurar()
    expect(auth.accessToken).toBe('a')
    expect(auth.esAdministrador).toBe(true)
  })

  it('no revienta y limpia la clave si el JSON está corrupto', () => {
    const store = stubLocalStorage({ tamara_saenz_sesion: '{ esto no es json' })
    const auth = useAuthStore()
    expect(() => auth.restaurar()).not.toThrow()
    expect(auth.accessToken).toBe('')
    expect(auth.usuario).toBeNull()
    expect(store.has('tamara_saenz_sesion')).toBe(false)
  })

  it('no hace nada si no hay clave guardada', () => {
    stubLocalStorage()
    const auth = useAuthStore()
    expect(() => auth.restaurar()).not.toThrow()
    expect(auth.isAuthenticated).toBe(false)
  })
})
