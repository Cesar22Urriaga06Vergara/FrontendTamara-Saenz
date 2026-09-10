const API_BASE_URL_LOCAL = 'http://localhost:3010/api/v1'
const PLACEHOLDER_BACKEND = 'BACKEND-DOMAIN.example'

function validarUrlApiProduccion(valor: string): string {
  let url: URL
  try {
    url = new URL(valor)
  } catch {
    throw new Error('NUXT_PUBLIC_API_BASE_URL debe ser una URL válida en producción.')
  }

  const hostnameLocal = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  if (
    url.protocol !== 'https:' ||
    hostnameLocal ||
    !/^\/api(?:\/|$)/.test(url.pathname) ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  ) {
    throw new Error('NUXT_PUBLIC_API_BASE_URL debe ser una URL HTTPS de API sin query ni credenciales.')
  }

  return valor
}

/** Resuelve la API sin permitir que un build de producción apunte accidentalmente a localhost. */
export function resolverApiBaseUrl(valor: string | undefined, entorno = process.env.NODE_ENV): string {
  if (entorno !== 'production') return valor || API_BASE_URL_LOCAL
  if (!valor?.trim()) {
    throw new Error('Falta NUXT_PUBLIC_API_BASE_URL para el build de producción.')
  }
  return validarUrlApiProduccion(valor.trim())
}

/** Impide publicar la CSP de Cloudflare mientras conserve el dominio de documentación. */
export function validarHeadersProduccion(contenido: string): void {
  if (contenido.includes(PLACEHOLDER_BACKEND)) {
    throw new Error(`public/_headers conserva el placeholder ${PLACEHOLDER_BACKEND}.`)
  }
}
