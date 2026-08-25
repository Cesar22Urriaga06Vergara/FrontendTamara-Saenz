/**
 * Visibilidad del sidebar como drawer en viewports angostos (`<lg`). En `lg` y superiores el
 * sidebar sigue fijo como antes — este estado solo importa por debajo de ese breakpoint.
 * Compartido entre `Header.vue` (botón de menú) y `Sidebar.vue` (el propio drawer + su fondo).
 */
export function useSidebarMovil() {
  return useState<boolean>('sidebarMovilAbierto', () => false)
}
