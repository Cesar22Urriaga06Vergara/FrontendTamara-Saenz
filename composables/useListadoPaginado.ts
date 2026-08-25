export interface ResultadoPagina<T> {
  data: T[]
  total: number
}

export interface OpcionesListadoPaginado<F extends Record<string, any>> {
  /** Valores iniciales de los filtros (búsqueda, estado, fechas, etc). Puede ser `{}` si el listado no filtra. */
  filtrosIniciales?: F
  limiteInicial?: number
  mensajeError?: string
  /** Si es `false`, no carga automáticamente al montar (para listados que dependen de datos externos, ej. un id de ruta). */
  inmediato?: boolean
}

/**
 * Centraliza el patrón `page/limit/total/cargando/error/filtros + watch + cargar()` que antes
 * se reescribía a mano en cada listado (Inmuebles, Contratos, Novedades, Recibos, Movimientos,
 * Auditoría, Caja, Administración...). Quien la usa solo aporta la función que realmente sabe
 * pedir esa página de datos al backend — la composable no asume ninguna forma de endpoint.
 */
export function useListadoPaginado<T = any, F extends Record<string, any> = Record<string, any>>(
  cargarPagina: (contexto: { page: number; limit: number; filtros: F }) => Promise<ResultadoPagina<T>>,
  opciones: OpcionesListadoPaginado<F> = {},
) {
  const filtros = reactive({ ...(opciones.filtrosIniciales ?? {}) }) as F
  const page = ref(1)
  const limit = ref(opciones.limiteInicial ?? 10)
  const total = ref(0)
  const lista = ref<T[]>([]) as Ref<T[]>
  // Arranca en `true` (no en `false`) para igualar el comportamiento de las implementaciones
  // manuales previas: la tabla debe mostrar su estado de carga desde el primer render, no un
  // "vacío" momentáneo mientras `onMounted` todavía no ha corrido (onMounted nunca se ejecuta
  // durante SSR, así que sin esto el HTML servido mostraría el empty-state en vez del loading).
  const cargando = ref(true)
  const error = ref('')

  async function cargar() {
    cargando.value = true
    try {
      const resultado = await cargarPagina({ page: page.value, limit: limit.value, filtros })
      lista.value = resultado.data
      total.value = resultado.total
      error.value = ''
    } catch (e: any) {
      error.value = e?.data?.message || opciones.mensajeError || 'No fue posible cargar los datos.'
    } finally {
      cargando.value = false
    }
  }

  // Cualquier cambio en los filtros vuelve a la página 1 (mismo comportamiento que las
  // implementaciones manuales previas) antes de recargar.
  watch(
    () => ({ ...filtros }),
    () => {
      page.value = 1
      cargar()
    },
  )
  watch(page, cargar)

  if (opciones.inmediato !== false) onMounted(cargar)

  return { filtros, page, limit, total, lista, cargando, error, cargar }
}
