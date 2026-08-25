import { useAuthStore } from '~/stores/auth.store'

/**
 * Abre en una pestaña nueva del navegador un PDF vectorial (recibo de caja,
 * comprobante) generado por el backend (`/documentos/...`), para visualizarlo
 * e imprimirlo en pantalla sin forzar la descarga a disco.
 */
export async function usePdfDownload(path: string, _nombreArchivo: string) {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const blob = await $fetch<Blob>(path, {
    baseURL: config.public.apiBaseUrl,
    headers: { Authorization: `Bearer ${auth.accessToken}` },
    responseType: 'blob',
  })

  const url = window.URL.createObjectURL(blob as Blob)
  window.open(url, '_blank')
}
