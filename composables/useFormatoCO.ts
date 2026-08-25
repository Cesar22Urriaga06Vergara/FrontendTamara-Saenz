/** Formato de moneda y fecha oficial Colombia (es-CO), según brand rules. */
export function useFormatoCO() {
  const moneda = (valor: number | string | null | undefined) => {
    const num = Number(valor ?? 0)
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(num)
  }

  const fecha = (valor: string | Date | null | undefined) => {
    if (!valor) return '—'
    const d = typeof valor === 'string' ? new Date(valor) : valor
    return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
  }

  return { moneda, fecha }
}
