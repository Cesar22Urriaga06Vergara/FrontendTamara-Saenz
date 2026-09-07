import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useBorrador } from '../composables/useBorrador'

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

describe('useBorrador', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('detecta que hay un borrador guardado', () => {
    stubLocalStorage({ 'borrador:test': JSON.stringify({ datos: { a: 1 }, guardadoEn: 0 }) })
    const estado = ref({ a: 0 })
    const b = useBorrador(
      'borrador:test',
      () => estado.value,
      (d) => (estado.value = d as { a: number }),
    )
    b.detectar()
    expect(b.hayBorrador.value).toBe(true)
  })

  it('no detecta nada si no hay clave guardada', () => {
    stubLocalStorage()
    const estado = ref({ a: 0 })
    const b = useBorrador(
      'borrador:test',
      () => estado.value,
      (d) => (estado.value = d as { a: number }),
    )
    b.detectar()
    expect(b.hayBorrador.value).toBe(false)
  })

  it('restaurar() vuelca el borrador guardado en el estado del formulario', () => {
    stubLocalStorage({ 'borrador:test': JSON.stringify({ datos: { a: 42 }, guardadoEn: 0 }) })
    const estado = ref<{ a: number }>({ a: 0 })
    const b = useBorrador(
      'borrador:test',
      () => estado.value,
      (d) => (estado.value = d as { a: number }),
    )
    b.detectar()
    b.restaurar()
    expect(estado.value.a).toBe(42)
    expect(b.hayBorrador.value).toBe(false)
  })

  it('guarda con debounce cuando cambian los datos, tras detectar()', async () => {
    vi.useFakeTimers()
    const store = stubLocalStorage()
    const estado = ref({ a: 0 })
    const b = useBorrador(
      'borrador:test',
      () => estado.value,
      (d) => (estado.value = d as { a: number }),
      { esperaMs: 100 },
    )
    b.detectar() // quita el "suspendido" inicial
    estado.value = { a: 7 }
    await vi.advanceTimersByTimeAsync(150)
    expect(JSON.parse(store.get('borrador:test')!).datos.a).toBe(7)
    vi.useRealTimers()
  })

  it('no guarda nada antes de llamar a detectar() (evita pisar un borrador aún no ofrecido)', async () => {
    vi.useFakeTimers()
    const store = stubLocalStorage({ 'borrador:test': JSON.stringify({ datos: { a: 99 }, guardadoEn: 0 }) })
    const estado = ref({ a: 0 })
    useBorrador(
      'borrador:test',
      () => estado.value,
      (d) => (estado.value = d as { a: number }),
      { esperaMs: 50 },
    )
    // El watch inicial dispara al montar, con el formulario todavía en su valor por defecto.
    await vi.advanceTimersByTimeAsync(100)
    // No debe haber pisado el borrador guardado (a: 99) con el valor inicial (a: 0).
    expect(JSON.parse(store.get('borrador:test')!).datos.a).toBe(99)
    vi.useRealTimers()
  })

  it('limpiar() borra la clave y hayBorrador queda en false', () => {
    const store = stubLocalStorage({ 'borrador:test': 'x' })
    const b = useBorrador(
      'borrador:test',
      () => ({}),
      () => {},
    )
    b.limpiar()
    expect(store.has('borrador:test')).toBe(false)
    expect(b.hayBorrador.value).toBe(false)
  })

  it('no revienta si el borrador guardado está corrupto, y limpia la clave', () => {
    const store = stubLocalStorage({ 'borrador:test': '{ esto no es json' })
    const b = useBorrador(
      'borrador:test',
      () => ({}),
      () => {
        throw new Error('no debería llamarse con datos corruptos')
      },
    )
    b.detectar()
    expect(() => b.restaurar()).not.toThrow()
    expect(store.has('borrador:test')).toBe(false)
  })

  it('la clave puede ser dinámica (getter)', () => {
    const store = stubLocalStorage({ 'borrador:pago:c1': JSON.stringify({ datos: { a: 5 }, guardadoEn: 0 }) })
    const contratoId = ref('c1')
    const estado = ref({ a: 0 })
    const b = useBorrador(
      () => 'borrador:pago:' + contratoId.value,
      () => estado.value,
      (d) => (estado.value = d as { a: number }),
    )
    b.detectar()
    expect(b.hayBorrador.value).toBe(true)
    b.restaurar()
    expect(estado.value.a).toBe(5)
    expect(store.has('borrador:pago:c1')).toBe(true) // restaurar no borra, solo limpiar() lo hace
  })
})
