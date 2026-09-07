/**
 * Abre en una pestaña nueva del navegador un PDF vectorial (recibo de caja,
 * comprobante) generado por el backend (`/documentos/...`), para visualizarlo
 * e imprimirlo en pantalla sin forzar la descarga a disco.
 */
export async function usePdfDownload(path: string, _nombreArchivo: string) {
  const blob = await useApiFetch<Blob>(path, { responseType: 'blob' })

  const url = window.URL.createObjectURL(blob)
  window.open(url, '_blank')
  // El blob URL debe seguir vivo hasta que la pestaña nueva lo cargue; se revoca con
  // holgura para no dejarlo colgado (fuga) ni cortarlo antes de que el visor lo lea.
  setTimeout(() => window.URL.revokeObjectURL(url), 60_000)
}
