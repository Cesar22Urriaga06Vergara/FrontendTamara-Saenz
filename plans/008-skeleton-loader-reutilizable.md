# Plan 008: Skeleton loader reutilizable reemplazando el string "Cargando…"

> **ESTADO: DONE.** Ver commit al final. Segunda de 6 mejoras de dinamismo/UX de la auditoría del
> 2026-09-04.

## Status

- **Priority**: P2 · **Effort**: M · **Risk**: LOW

## Why this matters

Cuando hay `<UTable>`, el loading ya usa el spinner nativo de Nuxt UI (`:loading`, funcional, no se
toca). Cuando NO hay `<UTable>` (tarjetas de saldo, paneles de dashboard, fichas de detalle), el
"loading" era literalmente el string `"Cargando…"` en texto plano gris — repetido de forma casi
idéntica en 9 archivos. Re-verificado con `grep` (más completo que el catálogo inicial de la
auditoría, que había encontrado 7 de los 9): también se encontró el mismo patrón en
`pages/configuracion/index.vue` y en dos variantes "inline" (`pages/contratos/index.vue`,
`pages/recaudo/index.vue:536` — un ternario de una sola línea en vez de un `v-if`/`v-else` de dos
párrafos separados).

## Fix

- Nuevo `components/shared/SkeletonText.vue` (auto-importado como `SharedSkeletonText`, mismo
  patrón que `SharedErrorState`/`SharedStatusBadge`): placeholder `animate-pulse`, props
  `lines`/`widthClass`.
- Cableado en 9 archivos / 16 sitios:
  - `pages/caja/index.vue` (4 tarjetas de saldo)
  - `pages/dashboard/index.vue` (2 paneles de lista, `:lines="3"`)
  - `pages/movimientos/index.vue` (2 tarjetas de saldo)
  - `pages/transferencias/index.vue` (1 tarjeta de saldo)
  - `pages/contratos/[id].vue` (2: "Resumen financiero" `:lines="3"`, "Historial de estado" `:lines="2"`)
  - `components/contratos/ModalTerminar.vue` (1: "Consultando cartera…", `:lines="2"`)
  - `pages/configuracion/index.vue` (1, gate de página completa, `:lines="4"` — no estaba en el
    catálogo original, mismo patrón exacto)
  - `pages/contratos/index.vue` (1, contador inline "X contratos" — restructurado de un ternario
    de una línea a `v-if`/`v-else`)
  - `pages/recaudo/index.vue` (2: contador "X contratos con cartera vencida" — mismo
    restructurado —, y "Cargando ficha de recaudo…" → `:lines="4"`)

## Scope

**In scope**: los 9 archivos + el componente nuevo, listados arriba.

**Out of scope** (deliberado, ya está bien resuelto): `<UTable :loading="...">` — spinner nativo
de Nuxt UI, funcional, no se toca. "Familia B" (loaders de página completa en `clientes/[id].vue`,
`inmuebles/[id].vue`, `recibos/[id].vue`) — quedó fuera, ver Maintenance notes.

## Verificación

- `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test` → exit 0 (12/12).
- **Humo real**: navegación por las 7 páginas afectadas con backend+frontend reales — todas
  cargan y muestran los datos reales correctamente (confirma que el `v-else` de cada par sigue
  funcionando exactamente igual que antes). La red local es demasiado rápida para capturar el
  estado transitorio de "cargando" en una captura de pantalla (resuelve en <50ms); la verificación
  del propio placeholder se apoya en que el componente compila y en que cada `v-if` apunta
  exactamente al mismo flag reactivo que ya gateaba el contenido real antes del cambio — un
  swap de rama sin lógica nueva.
- De paso, se confirmó visualmente (en `/configuracion` y en el sidebar) que el fix de BE-009
  (`&` sin corromper) se ve correcto en producción de datos reales, no solo en el PDF.

## Maintenance notes

- **Familia B** (loaders de página completa en `pages/clientes/[id].vue`, `pages/inmuebles/[id].vue`,
  `pages/recibos/[id].vue`) queda como deuda menor, no se abordó en esta pasada (opcional según el
  plan original, no bloqueaba el Done).
- Se detectó (no relacionado con este plan) que el puerto `:3001` de este proyecto fue ocupado por
  un proceso ajeno (`Frontend_Jordan_2026`); el humo de este plan y del anterior (FE-007) se corrió
  contra `:3011` con el `CORS_ORIGIN` del backend ajustado temporalmente — se revierte al cerrar
  toda la tanda de UX.
