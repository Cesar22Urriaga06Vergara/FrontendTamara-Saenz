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

  it('rechaza el dominio raíz de Render sin /api/v1 en producción', () => {
    expect(() => resolverApiBaseUrl('https://backendtamara-saenz.onrender.com', 'production')).toThrow()
  })

  it.each([
    undefined,
    '',
    'http://localhost:3010/api/v1',
    'https://api.tamarasaenz.com',
    'https://backendtamara-saenz.onrender.com/api',
    'https://api.tamarasaenz.com/api/v1?debug=true',
  ])('rechaza una URL de API inválida en producción: %s', (url) => {
    expect(() => resolverApiBaseUrl(url, 'production')).toThrow()
  })

  it('acepta cabeceras con el backend real de Render', () => {
    expect(() =>
      validarHeadersProduccion('connect-src self https://backendtamara-saenz.onrender.com'),
    ).not.toThrow()
  })

  it('rechaza cabeceras con un host de ejemplo en producción', () => {
    expect(() => validarHeadersProduccion('connect-src self https://api.example.test')).toThrow(
      /host de backend no válido/i,
    )
  })
})
