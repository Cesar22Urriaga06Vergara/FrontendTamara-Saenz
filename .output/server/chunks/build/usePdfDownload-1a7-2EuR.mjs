import { a as useAuthStore, $ as $fetch$1, b as useRuntimeConfig } from '../virtual/entry.mjs';

//#region composables/usePdfDownload.ts
/**
* Abre en una pestaña nueva del navegador un PDF vectorial (recibo de caja,
* comprobante) generado por el backend (`/documentos/...`), para visualizarlo
* e imprimirlo en pantalla sin forzar la descarga a disco.
*/
async function usePdfDownload(path, _nombreArchivo) {
	const config = useRuntimeConfig();
	const auth = useAuthStore();
	const blob = await $fetch$1(path, {
		baseURL: config.public.apiBaseUrl,
		headers: { Authorization: `Bearer ${auth.accessToken}` },
		responseType: "blob"
	});
	const url = (void 0).URL.createObjectURL(blob);
	(void 0).open(url, "_blank");
}

export { usePdfDownload as u };
//# sourceMappingURL=usePdfDownload-1a7-2EuR.mjs.map
