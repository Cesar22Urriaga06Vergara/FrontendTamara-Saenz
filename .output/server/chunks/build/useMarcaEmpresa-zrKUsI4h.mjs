import { b as useRuntimeConfig } from '../virtual/entry.mjs';
import { ref } from 'vue';

//#region composables/useMarcaEmpresa.ts
/**
* Marca de la empresa (nombre/slogan/logo) para el login (sin sesión) y el layout autenticado
* (visible también para Recepcionista). Usa `GET /empresa/publico` — endpoint público que no
* expone parámetros financieros — en vez de `GET /empresa` (exclusivo Administrador).
* Si aún no se ha subido un logo, o la petición falla, `logoSrc` queda en `null` y quien lo
* consuma debe mostrar su imagen estática de respaldo (`/Logo.png`).
*/
function useMarcaEmpresa() {
	const config = useRuntimeConfig();
	const logoSrc = ref(null);
	return {
		nombre: ref(config.public.appName),
		slogan: ref(config.public.appSlogan),
		logoSrc
	};
}

export { useMarcaEmpresa as u };
//# sourceMappingURL=useMarcaEmpresa-zrKUsI4h.mjs.map
