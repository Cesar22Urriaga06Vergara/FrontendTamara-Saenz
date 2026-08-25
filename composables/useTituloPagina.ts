export interface ItemBreadcrumb {
  label: string
  to?: string
}

interface EntradaTitulo {
  test: (path: string) => boolean
  titulo: string
  breadcrumb?: ItemBreadcrumb[]
}

/**
 * Título/breadcrumb del header derivados de `route.path`, no de un estado que cada página
 * tuviera que fijar en su `<script setup>`. Es deliberado: en SSR, `Header.vue` (dentro del
 * layout) se renderiza ANTES que el componente de la página, así que un `useState` fijado
 * desde la página llegaría tarde para el HTML servido (el header quedaría en su valor por
 * defecto). `route.path` en cambio ya está resuelto antes de renderizar cualquier componente
 * de la ruta, así que no depende de ese orden.
 */
const MAPA_TITULOS: EntradaTitulo[] = [
  { test: (p) => p === '/dashboard', titulo: 'Dashboard' },
  {
    test: (p) => p !== '/inmuebles' && p.startsWith('/inmuebles/'),
    titulo: 'Inmueble',
    breadcrumb: [{ label: 'Inmuebles', to: '/inmuebles' }],
  },
  { test: (p) => p === '/inmuebles', titulo: 'Inmuebles' },
  {
    test: (p) => p !== '/clientes' && p.startsWith('/clientes/'),
    titulo: 'Cliente',
    breadcrumb: [{ label: 'Clientes', to: '/clientes' }],
  },
  { test: (p) => p === '/clientes', titulo: 'Clientes' },
  { test: (p) => p === '/codeudores', titulo: 'Codeudores' },
  {
    test: (p) => p === '/contratos/nuevo',
    titulo: 'Nuevo contrato',
    breadcrumb: [{ label: 'Contratos', to: '/contratos' }],
  },
  {
    test: (p) => p !== '/contratos/nuevo' && p !== '/contratos' && p.startsWith('/contratos/'),
    titulo: 'Contrato',
    breadcrumb: [{ label: 'Contratos', to: '/contratos' }],
  },
  { test: (p) => p === '/contratos', titulo: 'Contratos' },
  {
    test: (p) => p === '/novedades/nueva',
    titulo: 'Registrar novedad',
    breadcrumb: [{ label: 'Novedades', to: '/novedades' }],
  },
  { test: (p) => p === '/novedades', titulo: 'Novedades' },
  { test: (p) => p === '/recaudo', titulo: 'Recaudo' },
  {
    test: (p) => p !== '/recibos' && p.startsWith('/recibos/'),
    titulo: 'Recibo',
    breadcrumb: [{ label: 'Recibos', to: '/recibos' }],
  },
  { test: (p) => p === '/recibos', titulo: 'Recibos' },
  { test: (p) => p === '/caja', titulo: 'Caja' },
  { test: (p) => p === '/cartera', titulo: 'Cartera' },
  { test: (p) => p === '/gastos', titulo: 'Gastos' },
  { test: (p) => p === '/depositos', titulo: 'Depósitos' },
  { test: (p) => p === '/transferencias', titulo: 'Transferencias' },
  { test: (p) => p === '/movimientos', titulo: 'Movimientos de caja' },
  { test: (p) => p === '/auditoria', titulo: 'Auditoría' },
  { test: (p) => p === '/reportes', titulo: 'Reportes' },
  { test: (p) => p === '/administracion', titulo: 'Administración' },
  { test: (p) => p === '/configuracion', titulo: 'Configuración' },
]

function resolverEntrada(path: string): EntradaTitulo | undefined {
  return MAPA_TITULOS.find((entrada) => entrada.test(path))
}

/** Override cliente-only para títulos que solo se conocen tras cargar datos (ej. el consecutivo de un Recibo). */
export function useTituloPaginaOverride() {
  return useState<string | null>('tituloPaginaOverride', () => null)
}

export function useTituloPagina() {
  const route = useRoute()
  const override = useTituloPaginaOverride()
  return computed(() => override.value ?? resolverEntrada(route.path)?.titulo ?? 'Panel')
}

export function useBreadcrumbPagina() {
  const route = useRoute()
  return computed(() => resolverEntrada(route.path)?.breadcrumb ?? [])
}

/** Llamado solo desde páginas que necesitan reemplazar el título estático con uno cargado en runtime (ej. `recibos/[id].vue`). */
export function definirTituloDinamico(titulo: string) {
  useTituloPaginaOverride().value = titulo
}
