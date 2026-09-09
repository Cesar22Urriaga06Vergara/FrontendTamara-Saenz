# Plan 006: Columna Cliente ausente en el listado de Novedades (cross-repo)

> **ESTADO: DONE.** Ver commit al final. Contraparte backend: ver
> `BackendTamara-Saenz/plans/010-columna-cliente-novedades.md`.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: BE-010 (backend) — el `GET /novedades` debe incluir `contrato.cliente` primero.

## Why this matters

`pages/novedades/index.vue` y `components/recibos/TablaRecibosNovedad.vue` nunca tuvieron columna
de Cliente en su tabla — confirmado con `git log -p --follow` desde el primer commit de cada uno,
no es una regresión. Contradice `ESPECIFICACION_UI_UX_PAGINA_POR_PAGINA.md:607`
(`Fecha | Cliente/Inmueble | Descripción | Tipo | Estado | Acciones`).

## Fix

Columna nueva `{ key: 'clienteNombre', label: 'Cliente' }` en ambos archivos (entre "No." y
"Dirección"), con un slot `#clienteNombre-data` que resuelve
`row.contrato?.cliente?.nombreCompleto ?? '—'`.

## Hallazgo técnico durante la implementación: `key` con puntos rompe el nombre del slot

El primer intento usó `{ key: 'contrato.cliente.nombreCompleto', ... }` (mismo patrón que ya usan
`inmueble.direccion`/`inmueble.barrio`, que **no** tienen slot custom, solo el acceso automático
de valor de `UTable`). Al intentar darle un slot custom (`#contrato.cliente.nombreCompleto-data`,
necesario para el fallback `—` cuando no hay contrato), ESLint rechazó el template con
`vue/valid-v-slot: 'v-slot' directive doesn't support any modifier` — Vue interpreta cualquier
punto después del nombre de un slot como un modificador (igual que `v-on`/`v-bind`), y `v-slot` no
soporta modificadores. Se resolvió con un `key` alias sin puntos (`clienteNombre`) y resolviendo
la ruta anidada a mano dentro del slot.

## Scope

**In scope**: `pages/novedades/index.vue`, `components/recibos/TablaRecibosNovedad.vue`.

**Out of scope**: cualquier otro archivo — la firma de `GET /novedades` ya traía todo lo necesario
tras el fix de BE-010.

## Verificación

- `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test` → exit 0 (12/12, sin
  cambios de comportamiento en tests existentes).
- **Humo real** (backend + frontend corriendo, login Administrador): en `/novedades` y en
  "Recibos de novedad" (`/recibos`), las 2 novedades con contrato muestran el nombre del cliente;
  se registró una tercera novedad real sin contrato asociado y la columna mostró `—` correctamente,
  sin errores de consola nuevos.

## Maintenance notes

- Si en el futuro se necesita otra columna con ruta anidada que además requiera un slot custom
  (no solo mostrar el valor tal cual), replicar el patrón del alias plano — no el `key` con puntos.
