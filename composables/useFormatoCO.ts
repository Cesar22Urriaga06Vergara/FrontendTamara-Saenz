/** Formato de moneda y fecha oficial Colombia (es-CO), según brand rules. */
export function useFormatoCO() {
  const moneda = (valor: number | string | null | undefined) => {
    const num = Number(valor ?? 0)
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(Number.isNaN(num) ? 0 : num)
  }

  const fecha = (valor: string | Date | null | undefined) => {
    if (!valor) return '—'
    // Columnas `type: 'date'` del backend llegan como "YYYY-MM-DD" (sin hora). `new
    // Date("YYYY-MM-DD")` las interpreta como medianoche UTC, que en zonas horarias
    // negativas (Bogotá, UTC-5) cae en el día calendario anterior al formatear en hora
    // local — mismo bug que el backend resolvió con `fechaLocalDesdeString`. Se parsean
    // los componentes Y-M-D directamente para evitar el parseo ISO-UTC del constructor.
    const soloFecha = typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(valor)
    const d = soloFecha
      ? new Date(Number(valor.slice(0, 4)), Number(valor.slice(5, 7)) - 1, Number(valor.slice(8, 10)))
      : typeof valor === 'string'
        ? new Date(valor)
        : valor
    if (Number.isNaN(d.getTime())) return '—'
    return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
  }

  return { moneda, fecha }
}
