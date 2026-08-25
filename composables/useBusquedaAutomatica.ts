/**
 * Dispara `buscar` automáticamente mientras el usuario escribe (debounce), sin reemplazar
 * el disparo explícito por Enter/clic que ya tiene cada buscador — solo evita que el usuario
 * tenga que confirmar manualmente para ver resultados.
 */
export function useBusquedaAutomatica(termino: Ref<string>, buscar: () => void, esperaMs = 400) {
  let temporizador: ReturnType<typeof setTimeout> | null = null

  watch(termino, () => {
    if (temporizador) clearTimeout(temporizador)
    if (!termino.value) return
    temporizador = setTimeout(buscar, esperaMs)
  })
}
