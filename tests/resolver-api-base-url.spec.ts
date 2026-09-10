import { describe, expect, it } from 'vitest'
import { resolverApiBaseUrl, validarHeadersProduccion } from '../utils/resolver-api-base-url'

describe('resolverApiBaseUrl', () => {
  it('devuelve la URL local por defecto fuera de producción', () => {
    expect(resolverApiBaseUrl(undefined, 'development')).toBe('http://localhost:3010/api/v1')
  })

  it('acepta una URL HTTPS de API en producción', () => {
    expect(resolverApiBaseUrl('https://api.tamarasaenz.com/api/v1', 'production')).toBe(
      'https://api.tamarasaenz.com/api/v1',
    )
  })

  it.each([
    undefined,
    '',
    'http://localhost:3010/api/v1',
    'https://api.tamarasaenz.com',
    'https://api.tamarasaenz.com/api/v1?debug=true',
  ])('rechaza una URL de API inválida en producción: %s', (url) => {
    expect(() => resolverApiBaseUrl(url, 'production')).toThrow()
  })

  it('acepta cabeceras con un backend real', () => {
    expect(() => validarHeadersProduccion('connect-src self https://api.tamarasaenz.com')).not.toThrow()
  })

  it('rechaza cabeceras con el placeholder del backend', () => {
    expect(() => validarHeadersProduccion('connect-src self https://BACKEND-DOMAIN.example')).toThrow(
      /BACKEND-DOMAIN\.example/,
    )
  })
})
