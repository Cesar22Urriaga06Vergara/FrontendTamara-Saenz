type EstadoConexion = 'en-linea' | 'reconectando' | 'sin-conexion'

const estado = ref<EstadoConexion>('en-linea')
let intentosActivos = 0
let temporizadorAutoOcultar: ReturnType<typeof setTimeout> | null = null

function limpiarAutoOcultar() {
  if (temporizadorAutoOcultar) {
    clearTimeout(temporizadorAutoOcultar)
    temporizadorAutoOcultar = null
  }
}

/**
 * Estado de conectividad compartido por toda la app (módulo singleton — no un store, no
 * necesita persistirse ni ser SSR-aware). `useApiFetch` lo actualiza; `BannerReconexion` lo
 * consume para avisar sin echar al usuario de la sesión.
 *
 * Se lleva un CONTADOR de peticiones actualmente en su propio bucle de reintento, no solo "el
 * último evento": con varias peticiones concurrentes (p. ej. el layout carga la marca de la
 * empresa Y la página carga su listado a la vez), una que se recupera no debe limpiar el
 * banner si otra sigue luchando, y una que agota sus reintentos y nunca se vuelve a invocar
 * sola (como la marca de la empresa, que solo se pide una vez al montar el layout) no debe
 * dejar el banner en rojo para siempre — cada pantalla ya tiene su propio botón "Reintentar"
 * para esa parte puntual, así que el aviso global se retira solo a los pocos segundos si nadie
 * más sigue reintentando activamente.
 */
export function useEstadoConexion() {
  return {
    estado: readonly(estado),
    /** Llamar UNA vez, la primera vez que una petición concreta entra en su bucle de reintento. */
    iniciarIntento: () => {
      intentosActivos++
      limpiarAutoOcultar()
      if (estado.value === 'en-linea') estado.value = 'reconectando'
    },
    /** Llamar cuando esa petición concreta finalmente tiene éxito. */
    resolverConExito: () => {
      intentosActivos = Math.max(0, intentosActivos - 1)
      limpiarAutoOcultar()
      if (intentosActivos === 0) estado.value = 'en-linea'
    },
    /** Llamar cuando esa petición concreta agota sus reintentos y se rinde. */
    resolverSinExito: () => {
      intentosActivos = Math.max(0, intentosActivos - 1)
      if (intentosActivos > 0) return // otras siguen luchando: no bajar el aviso todavía
      estado.value = 'sin-conexion'
      limpiarAutoOcultar()
      temporizadorAutoOcultar = setTimeout(() => {
        if (intentosActivos === 0) estado.value = 'en-linea'
      }, 4000)
    },
  }
}
