# Plan 019: Eliminar el "dinero como string" del frontend (D-1)

> **Executor instructions**: Sigue los pasos, verifica cada uno, respeta las STOP conditions.
> **Este plan solo debe ejecutarse DESPUÉS de que el plan 021 del repo backend esté mergeado en
> `main`** (el backend ya devuelve los montos como `number`). Actualiza `plans/README.md` al terminar.
>
> **Drift check**: `git diff --stat 45c4d2c..HEAD -- pages/ composables/ components/`

## Status

- **Priority**: P2 (limpieza; el riesgo real lo cierra el backend)
- **Effort**: M
- **Risk**: LOW-MED (toca muchos archivos de UI; mitigado porque `Number(number)` es no-op y los tests + typecheck son gate)
- **Depends on**: **plan 021 del repo backend** (transformer `decimal ↔ number`). Sin eso, quitar
  los `Number()` rompería las sumas (concatenaría strings).
- **Category**: tech-debt
- **Planned at**: commit `45c4d2c`, 2026-09-08

## Why this matters

El backend serializaba los montos `DECIMAL` como **string** ("500000.00"). El frontend lo
compensa con `Number(...)` disperso en ~15 archivos y tipos `number | string` en las interfaces de
`pages/recaudo/index.vue` (líneas 20, 29, 30, 34, 38, 40, 72). Eso es frágil: un `Number()`
olvidado da `"500000" + "1000" = "5000001000"` en una suma, o `NaN`. El plan 021 del backend hace
que el API devuelva `number` de verdad; este plan **elimina la compensación** del frontend para
que el tipo sea honesto y no haya que recordar envolver cada lectura.

## Estado actual

`Number(...)` sobre campos de monto (confirmar con
`grep -rn "Number(" --include=*.vue --include=*.ts pages/ composables/ components/ | grep -v spec`):
- `pages/caja/index.vue` — líneas 69, 74, 99, 100, 133, 151
- `pages/cartera/index.vue` — 23, 59
- `pages/contratos/[id].vue` — 38, 252
- `pages/depositos/index.vue` — 48, 52, 69, 70, 188
- `pages/inmuebles/index.vue` — 95, 96
- `pages/inmuebles/[id].vue` — 75, 76
- `pages/movimientos/index.vue` — 117, 128
- (revisa la lista completa; puede haber más en `dashboard`, `recibos`, `novedades`)

Tipos `number | string` (confirmar con `grep -rn "number | string\|number|string" --include=*.vue --include=*.ts pages/ composables/`):
- `pages/recaudo/index.vue` — líneas 20, 29, 30, 34, 38, 40, 72

Ojo: **NO** todos los `Number()` son de dinero. Estos NO se tocan:
- `pages/contratos/nuevo.vue:99,108` → `Number(nuevaFecha.slice(8,10))` (día del mes, de un string de fecha)
- Cualquier `Number()` sobre un valor de un `<input>` (el DOM siempre da string) — p. ej.
  `pages/depositos/index.vue:48,69,70` si `d.valor` viene de un `v-model` de input. **Verifica el
  origen de cada uno**: si es un campo de formulario, el `Number()` se queda.

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Lint / typecheck | `npm run lint && npm run typecheck` | exit 0 (warning `vue-tsc` preexistente tolerado) |
| Build | `npm run build` | exit 0 |
| Tests | `npm run test` | 22 verde |

## Scope

**In scope**:
- `pages/recaudo/index.vue` (quitar `| string` de las 7 interfaces)
- Los archivos de la lista de `Number()` de arriba — **solo** los `Number()` que envuelven datos
  que vienen del API (no de inputs)
- `composables/useFormatoCO.ts` (o donde esté `moneda()` — si acepta `number | string`, estréchalo a `number`)
- `PRODUCCION.md`, `plans/README.md`

**Out of scope**:
- `Number()` sobre valores de `<input>` / `v-model` — el DOM da string, ese `Number()` es correcto.
- `Number()` sobre resultados de `slice()` de fechas.
- Los tipos `any` del frontend en general (hallazgo aparte) — este plan solo quita `| string` de
  los montos.
- Cambiar `moneda()` / el formato de visualización.

## Git workflow

- Branch: `chore/019-limpiar-dinero-string`
- Un commit por archivo o grupo pequeño.

## Steps

### Step 0: Confirmar que el backend ya devuelve `number`

Con el backend corriendo (o revisando el PR del plan 021 del backend ya mergeado):
```bash
curl -s <API>/api/v1/contratos/<id>/ficha-recaudo -H "Authorization: Bearer <token>" | python -m json.tool | grep -iE "canon|saldo|valor"
```
**Verify**: los montos aparecen como `123456.78` (número), NO como `"123456.78"` (string).
Si siguen siendo string, **STOP** — el plan 021 del backend no está desplegado; no continúes.

### Step 1: Estrechar los tipos en `pages/recaudo/index.vue`

En las interfaces (líneas ~20-72), cambia cada `number | string` a `number`. Ejemplo:
```ts
// antes
canonValor?: number | string
// después
canonValor?: number
```

**Verify**: `npm run typecheck` → puede aparecer NUEVOS errores donde el código asumía string
(p. ej. `.toString()` sobre el campo, o `Number(campo)` que ahora es redundante). Anótalos — se
arreglan en el Paso 2.

### Step 2: Quitar los `Number()` redundantes, archivo por archivo

Para cada `Number(x)` de la lista:
1. Averigua el origen de `x`. Si viene de una respuesta del API (una `ref` poblada por
   `useApiFetch`, una prop, un item de una lista del API) → **quita el `Number(...)`**, deja `x`.
2. Si viene de un `<input>` / `v-model` / `route.params` / `slice()` → **déjalo**.

Tras cada archivo: `npm run typecheck && npm run test`.

Ejemplos:
- `pages/cartera/index.vue:23` → `acc + (o.valorOriginal - o.valorAbonado)` (vienen del API)
- `pages/inmuebles/index.vue:95` → `canonValor: inmueble.canonValor` (viene del API) — pero ojo:
  si `inmueble` aquí es el **formulario de edición** cuyos campos son de `<input>`, el `Number()`
  se queda. Lee el contexto.
- `pages/depositos/index.vue:48` → `d.valor` es de un `v-model` de descuento → **se queda**.
  `pages/depositos/index.vue:52` → `contratoLiquidando.value?.depositoGarantia` es del API → **se quita**.

### Step 3: Estrechar `moneda()` si aplica

Busca la función de formato de moneda (`grep -rn "export function moneda\|const moneda" composables/ utils/`).
Si su firma es `moneda(valor: number | string)`, cámbiala a `moneda(valor: number | null | undefined)`
y ajusta el cuerpo (quita el `Number(valor)` interno si lo tiene).

**Verify**: `npm run typecheck` → exit 0 (salvo el warning preexistente).

### Step 4: Documentar

- `PRODUCCION.md`, `### DATA-1`: marca `[x]` el sub-ítem del frontend ("limpiar los `Number()` y
  las uniones") con "→ plan FE-019 (hecho)".

## Test plan

- `npm run test` → 22 verde. Los specs existentes de recaudo/depósitos (`depositos-liquidacion.spec.ts`,
  `use-api-fetch.spec.ts`) cubren parte.
- Añade a `tests/` (o a un spec existente de un componente que muestre montos) un caso: dado un
  objeto del API con `valorOriginal: 500000` (number), el total renderizado es `"$ 500.000"` (o el
  formato que use `moneda()`), y `valorOriginal - valorAbonado` da un `number`, no un string.
- `npm run typecheck` → sin errores nuevos (el objetivo es que el tipo `number` sea consistente).

## Done criteria

- [ ] `grep -rn "number | string\|number|string" --include=*.vue --include=*.ts pages/ composables/` → sin resultados (o solo casos justificados y comentados)
- [ ] `npm run lint && npm run typecheck && npm run build && npm run test` → todo verde
- [ ] Los `Number()` restantes en los archivos tocados son SOLO sobre valores de `<input>`/rutas/fechas (revisar el diff)
- [ ] Un test afirma que un monto del API se usa como `number` en una resta/suma
- [ ] `git status` sin archivos fuera de "In scope"
- [ ] `plans/README.md` fila 019 y `PRODUCCION.md` DATA-1 actualizados

## STOP conditions

- El Paso 0 muestra que el API todavía devuelve montos como string → el plan 021 del backend no
  está desplegado. NO continúes.
- Quitar un `Number()` hace fallar un test con una concatenación de strings → ese campo específico
  todavía llega como string del API; revisa si el backend lo cubre (puede ser un agregado
  `getRawOne` que el transformer del backend no toca — ver Maintenance notes del plan 021 del backend).
- `npm run typecheck` arroja >10 errores nuevos tras estrechar los tipos → el alcance es mayor de
  lo estimado; reporta la lista antes de seguir.

## Maintenance notes

- Revisor: cada `Number()` quitado en el diff debe ser sobre datos del API; cada `Number()` que se
  queda debe ser sobre un `<input>`/ruta/fecha. Es el chequeo clave.
- Algunos agregados del backend (`SUM` vía `getRawOne`) siguen devolviendo string aun con el
  transformer del plan 021 — si un campo específico sigue llegando string, es esperado y su
  `Number()` en el frontend se queda (documéntalo con un comentario `// agregado SQL: llega como string`).
- Con los tipos ya honestos, el siguiente paso natural es generar los tipos del API desde el
  OpenAPI del backend (hallazgo A-1) para no volver a divergir.
