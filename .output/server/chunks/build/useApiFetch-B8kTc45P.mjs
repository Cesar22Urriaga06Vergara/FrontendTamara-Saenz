import { a as useAuthStore, n as navigateTo, $ as $fetch$1, b as useRuntimeConfig } from '../virtual/entry.mjs';

//#region composables/useApiFetch.ts
/**
* Composable central para llamadas a la API.
* Inyecta automáticamente el Bearer token, y ante un 401 intenta renovar la sesión
* una vez y REINTENTA la petición original con el nuevo token antes de propagar el
* error (si no reintentara, el usuario vería la operación fallar aunque la sesión
* ya se haya renovado con éxito — AUD-023).
*/
async function useApiFetch(path, options = {}) {
	const config = useRuntimeConfig();
	const auth = useAuthStore();
	const ejecutar = () => $fetch$1(path, {
		baseURL: config.public.apiBaseUrl,
		headers: {
			...auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {},
			...options.headers || {}
		},
		...options
	});
	try {
		return await ejecutar();
	} catch (error) {
		if (error?.response?.status === 401 && auth.refreshToken) {
			if (await auth.refrescarSesion()) return await ejecutar();
			await auth.cerrarSesion();
			navigateTo("/login");
		}
		throw error;
	}
}

export { useApiFetch as u };
//# sourceMappingURL=useApiFetch-B8kTc45P.mjs.map
