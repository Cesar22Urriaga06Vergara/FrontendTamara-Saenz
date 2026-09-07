interface OpcionesBorrador {
  /** ms de espera tras el último cambio antes de guardar. Default 800. */
  esperaMs?: number
}

/**
 * Persiste el estado de un formulario en localStorage mientras el usuario escribe, y lo
 * ofrece de vuelta si vuelve a la pantalla tras un cierre/recarga/corte de red.
 *
 * SOLO recupera el borrador — nunca envía nada. El usuario confirma el envío manualmente y,
 * cuando el envío tiene éxito, se llama `limpiar()`.
 *
 * @param clave  clave namespaced y estable para este formulario+contexto. Ej:
 *               `'borrador:pago:' + contratoId`, `'borrador:contrato-nuevo'`.
 *               Puede ser un getter para claves que dependen de estado reactivo.
 * @param leer   devuelve el estado actual del formulario como objeto plano serializable.
 * @param aplicar recibe un objeto guardado y lo vuelca en los refs/reactive del formulario.
 */
export function useBorrador(
  clave: string | (() => string),
  leer: () => Record<string, unknown>,
  aplicar: (datos: Record<string, unknown>) => void,
  opciones: OpcionesBorrador = {},
) {
  const claveActual = () => (typeof clave === 'function' ? clave() : clave)
  const hayBorrador = ref(false)
  let temporizador: ReturnType<typeof setTimeout> | null = null
  // No guardar hasta después de `detectar()`: evita que el watch inicial (que dispara al
  // montar, con el formulario todavía vacío) pise un borrador ya guardado antes de que el
  // usuario decida si quiere recuperarlo.
  let suspendido = true

  const guardarAhora = () => {
    if (!import.meta.client || suspendido) return
    try {
      localStorage.setItem(claveActual(), JSON.stringify({ datos: leer(), guardadoEn: Date.now() }))
    } catch {
      // localStorage lleno o no disponible: el borrador es best-effort, no debe romper el formulario.
    }
  }

  const limpiar = () => {
    if (import.meta.client) localStorage.removeItem(claveActual())
    hayBorrador.value = false
  }

  /** Llamar en onMounted (o al abrir el formulario/modal). Detecta si hay un borrador guardado. */
  const detectar = () => {
    if (!import.meta.client) {
      suspendido = false
      return
    }
    const raw = localStorage.getItem(claveActual())
    hayBorrador.value = !!raw
    suspendido = false
  }

  /** El usuario aceptó recuperar el borrador. */
  const restaurar = () => {
    if (!import.meta.client) return
    try {
      const raw = localStorage.getItem(claveActual())
      if (raw) aplicar((JSON.parse(raw) as { datos: Record<string, unknown> }).datos)
    } catch {
      limpiar()
    }
    hayBorrador.value = false
  }

  // Auto-guardado con debounce mientras cambian los datos.
  watch(
    leer,
    () => {
      if (temporizador) clearTimeout(temporizador)
      temporizador = setTimeout(guardarAhora, opciones.esperaMs ?? 800)
    },
    { deep: true },
  )

  onScopeDispose(() => {
    if (temporizador) clearTimeout(temporizador)
  })

  // `hayBorrador` solo debe cambiar a través de detectar()/restaurar()/limpiar(), nunca por
  // mutación directa del consumidor.
  return { hayBorrador: readonly(hayBorrador), detectar, restaurar, limpiar }
}
