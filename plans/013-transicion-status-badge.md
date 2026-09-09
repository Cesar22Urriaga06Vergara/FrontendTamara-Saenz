# Plan 013: Transición en `SharedStatusBadge` al cambiar de valor

> **ESTADO: DONE.** Ver commit al final. Sexta y última de las 6 mejoras de dinamismo/UX de la
> auditoría del 2026-09-04.

## Status

- **Priority**: P4 · **Effort**: S · **Risk**: LOW

## Why this matters

`components/shared/StatusBadge.vue` (usado como `SharedStatusBadge` en ~10 vistas: Contratos,
Inmuebles, Novedades, Recibos, Movimientos...) renderizaba el `<UBadge>` sin transición — un
cambio de estado en vivo (ej. una novedad ABIERTA→EN_SEGUIMIENTO tras confirmar una acción, sin
recargar la página) era instantáneo, sin ningún indicio visual de que algo cambió. Es un
componente centralizado — un solo cambio se propaga automáticamente a las ~10 vistas que ya lo
usan.

## Fix

- `<UBadge>` envuelto en `<Transition name="badge-pop" mode="out-in">`, con `:key="entrada.label"`
  (la transición dispara cuando cambia el LABEL resuelto, no el `value` crudo — evita retrigger
  si `resolverEstado` alguna vez normaliza distintos `value` al mismo label).
- CSS (`<style scoped>`, mismo criterio de 150ms ya usado en `BannerReconexion.vue` y los 2
  modales del plan 009): `opacity` + `scale(0.9)`.
- `mode="out-in"` evaluado contra el STOP condition original ("si se usa dentro de `<UTable>` y
  produce un salto de layout notorio, degradar a `mode="default"`") — no aplica: el badge no
  cambia de ALTURA entre estados (solo de ancho, por el largo distinto de cada etiqueta), así que
  no hay salto de layout perceptible dentro de una celda de tabla.

## Verificación

- `npm run lint && npm run typecheck && npm run build && npm run test` → exit 0 (12/12 tests).
- **Humo real**: cambiado el estado de `NOV-000003` (novedad real del seed) de ABIERTA a
  EN_SEGUIMIENTO desde `/novedades`, sin recargar la página — el badge de la fila se actualizó
  correctamente al nuevo valor/color, sin error de consola nuevo (los únicos errores en consola
  son entradas viejas de CORS contra el puerto `:3000`, ya diagnosticadas como residuo del buffer
  de consola de sesiones anteriores a la migración de puertos, no relacionadas con este cambio).
  Revertido el estado de `NOV-000003` a `ABIERTA` directamente en MariaDB después de la prueba,
  para no dejar el dato de seed mutado (la transición de estado de una novedad no tiene camino de
  regreso por la UI/API una vez avanza).

## Maintenance notes

- Si algún consumidor de `SharedStatusBadge` llegara a necesitar `mode="default"` en vez de
  `out-in` (por ejemplo, dentro de una tabla muy densa donde el ancho variable sí se sintiera
  brusco), es un cambio de una sola línea en este archivo — no hace falta tocar los ~10 consumidores.
