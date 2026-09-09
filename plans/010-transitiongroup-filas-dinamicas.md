# Plan 010: `<TransitionGroup>` en 3 formularios con filas dinámicas

> **ESTADO: DONE.** Ver commit al final. Cuarta de 6 mejoras de dinamismo/UX de la auditoría del
> 2026-09-04 — la más delicada de la tanda (riesgo LOW-MED).

## Status

- **Priority**: P3 · **Effort**: S · **Risk**: LOW-MED

## Why this matters

`@nuxt/ui` v2's `<UTable>` usa `:key="index"` internamente en su `<tbody>` fijo, sin slot
reemplazable (confirmado leyendo el código fuente instalado) — no es viable envolverlo en
`TransitionGroup`, se descarta explícitamente. Los candidatos reales son 3 listas ya
implementadas como HTML plano: `detallesPago` (formulario de pago, `pages/recaudo/index.vue`),
`descuentos` de liquidación de depósito (`ModalLiquidarDeposito.vue`, mutado desde el padre) y
`codeudoresSeleccionados` (`pages/contratos/nuevo.vue`, ya con `id` estable del backend).

## Hallazgos reales durante la implementación (más allá de lo previsto en el plan original)

1. **`detallesPago` se envía completo al backend** (`POST /recaudo/pagos` y `/pagos/simular`) sin
   ningún mapeo — confirmado en el DTO (`RegistrarPagoDto`) que usa
   `@ValidateNested({ each: true }) @Type(() => DetallePagoInput)`, lo que hace que el
   `whitelist: true` + `forbidNonWhitelisted: true` global se aplique **por cada item del
   arreglo**. Agregar `_key` sin más habría hecho que **cada pago real fallara con 400** (el
   flujo financiero más crítico del sistema). Se agregó `detallesPagoParaEnviar()` que excluye
   `_key` explícitamente antes de armar el body en ambos endpoints.
2. **`ModalLiquidarDeposito.vue` se usa en 2 páginas** (`pages/recaudo/index.vue` — con el fix de
   este plan — y `pages/depositos/index.vue`, que no participa de este plan). Se hizo `_key`
   **opcional** en el prop (`_key?: number`) con fallback al índice (`descuento._key ?? i`) para
   no forzar cambios en el segundo consumidor.
3. **Riesgo de colisión de `_key` entre padre e hijo**: `agregarDescuento()` vive DENTRO de
   `ModalLiquidarDeposito.vue` (muta la prop `descuentos` directamente, patrón ya usado en el
   repo), mientras que la fila inicial y el reset-al-abrir usan un contador **del padre**
   (`pages/recaudo/index.vue`). Dos contadores independientes arrancando en 0 podrían producir
   `_key` duplicados. Se resolvió haciendo que el hijo derive su siguiente `_key` del **máximo ya
   presente en el arreglo** (`Math.max(...) + 1`) en vez de mantener su propio contador — se
   autocorrige sin importar el estado del contador del padre.
4. `descuentosDeposito`, a diferencia de `detallesPago`, **no** necesitó una función de
   "stripping" — `confirmarLiquidarDeposito()` ya reconstruye el objeto a mano
   (`{ concepto, valor, tipo }`) antes de enviarlo, así que `_key` nunca viaja al backend ahí.

## Fix

- `detallesPago`/`descuentosDeposito`: factory (`nuevaFilaDetalle()`/`nuevoDescuento()`) con
  contador incremental para `_key`; los 2-3 sitios de creación (inicial, reset, restauración de
  borrador) migrados a usar la factory. Restauración de un borrador viejo (guardado antes de
  `_key`) asigna una nueva de forma defensiva (`d._key ?? contador++`) en vez de asumir que existe.
- `codeudoresSeleccionados`: ya tenía `id` estable, sin cambios de datos.
- Los 3 `v-for` envueltos en `<TransitionGroup name="fila"|"chip" tag="div" class="...">`
  (conservando las clases de layout existentes en el `tag`), `:key` cambiado de índice a la
  propiedad estable. CSS en `<style scoped>` de cada archivo: `opacity` + `translateY`/`scale`,
  200ms, con `.{name}-leave-active { position: absolute }` para que las filas restantes no salten
  mientras la saliente se desvanece.

## Verificación

- `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test` → exit 0 (12/12, incluido
  `use-borrador.spec.ts` del plan 005, no afectado por el cambio de forma de `detallesPago`).
- **Humo real** (backend+frontend reales, contrato con obligación pendiente real): en
  `/contratos/nuevo`, chip de codeudor agregado y quitado correctamente. En `/recaudo`, 3 filas de
  medio de pago agregadas, la del medio eliminada — las 2 restantes se reacomodaron sin
  duplicados ni saltos (confirmado por conteo de botones "Quitar" en el DOM). Confirmado además
  que un borrador de pago con 2 filas se restaura correctamente y sigue permitiendo eliminar una
  fila sin colisión de `_key`. `pages/depositos/index.vue` (el otro consumidor de
  `ModalLiquidarDeposito.vue`, sin `_key`) sigue cargando sin error. No se pudo probar
  interactivamente el `TransitionGroup` de `descuentos` en el flujo de `/recaudo` por falta de un
  contrato `TERMINADO` con depósito en los datos de prueba (misma limitación ya documentada en
  BE-008/PDF) — el código sigue el mismo patrón ya probado en `detallesPago`.

## Nota operativa (no relacionada con este plan)

Durante el humo se descubrió que, además del conflicto de puerto `:3001` ya anotado en el plan
007, el mismo proyecto ajeno (`Frontend_Jordan_2026`, un "Sistema de Control Interno JORDAN") **
también** ocupaba el puerto `:3000` — específicamente en `[::1]:3000` (IPv6 loopback), mientras
el backend de este proyecto escuchaba en `0.0.0.0:3000`/`[::]:3000`. Esto causaba que peticiones a
`http://localhost:3000` resolvieran de forma intermitente al servidor equivocado (devolviendo HTML
de la otra app en vez de JSON de esta API), manifestándose como fallos de red aleatorios en el
frontend. Se movió el backend de este proyecto a `:3010` (`.env` → `PORT=3010`, frontend →
`NUXT_PUBLIC_API_BASE_URL=http://localhost:3010/api/v1`) para el resto de esta tanda de pruebas —
ambos cambios en archivos gitignored, no afectan el repo.

**Decisión final del dueño (2026-09-04): los puertos quedan permanentes** — backend en `:3010`,
frontend en `:3011` — en vez de revertir a `:3000`/`:3001` cuando el otro proyecto libere el
puerto. Se actualizaron los defaults reales del código (no solo el `.env` gitignored) para que
esto sea el comportamiento de fábrica del proyecto, no un workaround temporal:
- Backend: `.env.example` (`PORT`/`CORS_ORIGIN`), `src/main.ts` (fallback de `config.get(...)`
  para ambos), `README.md` (URL de Swagger).
- Frontend: `.env.example` (`NUXT_PUBLIC_API_BASE_URL`), `nuxt.config.ts` (fallback de
  `apiBaseUrl`), `package.json` (`"dev": "nuxt dev --port 3011"`), `README.md`.

## Maintenance notes

- **Reviewer**: el punto más importante a revisar es que `detallesPagoParaEnviar()` se usa en
  **ambos** sitios donde se arma el body (`simular` y `pagos`) — si se agrega un tercer lugar que
  envíe `detallesPago` en el futuro, debe pasar por la misma función.
