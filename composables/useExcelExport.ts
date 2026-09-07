/**
 * Descarga un reporte .xlsx generado por el backend (`/reportes/...` o `/documentos/...`).
 * Los reportes financieros SIEMPRE se generan en el servidor (fuente de la verdad);
 * este composable solo dispara la descarga del binario ya construido.
 */
export async function useExcelExport(path: string, nombreArchivo: string, params: Record<string, any> = {}) {
  const blob = await useApiFetch<Blob>(path, { responseType: 'blob', params })

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nombreArchivo.endsWith('.xlsx') ? nombreArchivo : `${nombreArchivo}.xlsx`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
