/**
 * Diccionario único de estado→color/etiqueta, consumido por `SharedStatusBadge`.
 * Centraliza los mapas `estadoColor` que antes se repetían en cada página
 * (Inmuebles, Contratos, Novedades, Recibos, Movimientos, Administración) —
 * cambiar el color de un estado aquí lo actualiza en todas las pantallas a la vez.
 * No introduce estados nuevos: solo documenta en un solo lugar los que cada
 * página ya usaba.
 */
export type ColorEstado = 'emerald' | 'amber' | 'orange' | 'red' | 'gray'

export interface EntradaEstado {
  color: ColorEstado
  label: string
}

export const ESTADOS: Record<string, Record<string, EntradaEstado>> = {
  contrato: {
    ACTIVO: { color: 'emerald', label: 'ACTIVO' },
    TERMINADO: { color: 'gray', label: 'TERMINADO' },
  },
  inmueble: {
    DISPONIBLE: { color: 'emerald', label: 'DISPONIBLE' },
    OCUPADO: { color: 'amber', label: 'OCUPADO' },
    MANTENIMIENTO: { color: 'orange', label: 'MANTENIMIENTO' },
    INACTIVO: { color: 'gray', label: 'INACTIVO' },
  },
  novedad: {
    ABIERTA: { color: 'amber', label: 'ABIERTA' },
    EN_SEGUIMIENTO: { color: 'orange', label: 'EN_SEGUIMIENTO' },
    CERRADA: { color: 'emerald', label: 'CERRADA' },
    ANULADA: { color: 'gray', label: 'ANULADA' },
  },
  impactoFinanciero: {
    PENDIENTE: { color: 'amber', label: 'Pendiente' },
    CARGO_ARRENDATARIO: { color: 'gray', label: 'Cargo arrendatario' },
    GASTO_INMOBILIARIA: { color: 'orange', label: 'Gasto inmobiliaria' },
  },
  gastoPagado: {
    true: { color: 'emerald', label: 'Pagado' },
    false: { color: 'amber', label: 'Pendiente de pago' },
  },
  recibo: {
    EMITIDO: { color: 'emerald', label: 'EMITIDO' },
    ANULADO: { color: 'red', label: 'ANULADO' },
  },
  obligacion: {
    PENDIENTE: { color: 'amber', label: 'PENDIENTE' },
    PARCIAL: { color: 'orange', label: 'PARCIAL' },
    PAGADA: { color: 'emerald', label: 'PAGADA' },
    ANULADA: { color: 'gray', label: 'ANULADA' },
  },
  movimientoTipo: {
    INGRESO: { color: 'emerald', label: 'INGRESO' },
    EGRESO: { color: 'red', label: 'EGRESO' },
  },
  activo: {
    true: { color: 'emerald', label: 'Activo' },
    false: { color: 'gray', label: 'Inactivo' },
  },
  rol: {
    ADMINISTRADOR: { color: 'amber', label: 'ADMINISTRADOR' },
    RECEPCIONISTA: { color: 'gray', label: 'RECEPCIONISTA' },
  },
}

/** Resuelve color+etiqueta para un dominio/valor; si no hay match, cae a gris mostrando el valor tal cual (nunca deja un badge sin color). */
export function resolverEstado(dominio: string, valor: string | boolean | null | undefined): EntradaEstado {
  const clave = String(valor)
  return ESTADOS[dominio]?.[clave] ?? { color: 'gray', label: clave }
}
