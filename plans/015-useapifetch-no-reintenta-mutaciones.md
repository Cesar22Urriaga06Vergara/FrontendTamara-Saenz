# Plan 015: `useApiFetch` no debe reintentar mutaciones no idempotentes ante fallo de red

> **ESTADO: TODO.** Generado por la skill `improve` (auditoría ronda 3, 2026-09-05). Hallazgo
> **S-6**. Riesgo de **doble cobro / doble movimiento de caja**.

## Status

- **Priority**: P1 (integridad financiera — puede duplicar un recibo real)
- **Effort**: S-M (cambio localizado en `useApiFetch.ts` + un spec + revisión de llamadores)
- **Risk**: MED — `useApiFetch` es el punto único de todas las llamadas HTTP; un cambio mal hecho
  afecta a toda la app. Mitigado con tests y con un rollout conservador (dejar de reintentar es
  más seguro que seguir reintentando).
- **Depends on**: plan 012 (ejecutar sobre `main`). Complementa el plan 001 del backend
  (errores de BD transitorios → 503) — ver Notas.
- **Category**: bug / security (integridad de datos)
- **Planned at**: commit `4d429b8` (rama `correccion-hallazgos-auditoria`), 2026-09-05

## Por qué importa

`composables/useApiFetch.ts` reintenta automáticamente **cualquier** petición —incluidas las
mutaciones— ante un fallo de red:

```ts
// useApiFetch.ts:8
const MAX_REINTENTOS_RED = 3

// useApiFetch.ts:23-27
/** Sin status HTTP (red/DNS/offline) o 5xx de gateway: el servidor no es alcanzable ahora mismo. */
function esFalloDeRed(error: unknown): boolean {
  const status = statusDe(error)
  return status === undefined || status === 502 || status === 503 || status === 504
}

// useApiFetch.ts:76-84  (dentro del for(;;) que envuelve TODA petición)
if (esFalloDeRed(error) && intentosRed < MAX_REINTENTOS_RED) {
  intentosRed++
  if (!registradaComoProblema) {
    registradaComoProblema = true
    conexion.iniciarIntento()
  }
  await espera(Math.min(1000 * 2 ** (intentosRed - 1), 5000)) // 1s, 2s, 4s
  continue
}
```

**El escenario de doble cobro** (`pages/recaudo/index.vue:366-394`, `registrarPago`):

1. El cajero confirma un pago → `useApiFetch('/recaudo/pagos', { method: 'POST', body })`.
2. La petición **llega al backend**, que dentro de su transacción crea el `ReciboCaja`, aplica el
   abono a las obligaciones y genera los `Movimiento` de caja (uno por medio de pago).
3. Antes de que la respuesta HTTP vuelva al navegador, se cae la red / el navegador pierde
   conexión un instante → `$fetch` lanza un error **sin `status`** (`statusDe` → `undefined`).
4. `esFalloDeRed` devuelve `true` → `useApiFetch` **espera 1s y reintenta el POST**.
5. El backend recibe el segundo POST. **No tiene ninguna guarda de idempotencia**
   (`recaudo.service.ts:46` — `registrarPago` no recibe ni valida ninguna clave de idempotencia).
   Crea un **segundo recibo** con nuevo consecutivo, aplica el pago otra vez (a las mismas
   obligaciones si aún tienen saldo, o a las siguientes), genera **más movimientos de caja**.
6. Resultado: el cliente pagó una vez, el sistema registró dos recibos y descuadró la caja.

Lo mismo aplica a `POST /recaudo/contrato/:id/liquidar-deposito` (`recaudo.service.ts:567`) —
doble egreso de devolución de depósito.

La mitigación de la ronda 1 (**B2a**, `refrescarTrasOperacion` + `avisoRefresco`) resuelve un
problema **distinto**: que un fallo del *refetch de pantalla posterior* se muestre como "pago
fallido". No toca el reintento de la *mutación en sí*, que es este hallazgo.

Los métodos GET (listados, fichas) sí son seguros de reintentar — son idempotentes por
definición HTTP. El problema es exclusivo de POST/PATCH/PUT/DELETE.

## Estado actual

- `composables/useApiFetch.ts` — 90 líneas. Firma:
  `export async function useApiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T>`.
  `ApiFetchOptions = Record<string, unknown> & { headers?: Record<string, string> }`.
- `ejecutar()` (línea 45-53) hace `$fetch<T>(path, { baseURL, headers, ...options })`. El método
  viaja en `options.method` (string tipo `'POST'` / `'PATCH'`; ausente = GET).
- El bucle `for (;;)` (línea 56-89) maneja 3 caminos: éxito, `401` → `auth.refrescarSesion()` →
  `continue`, y `esFalloDeRed` → backoff → `continue`.
- Llamadas que son mutaciones (verificado con `grep -rn "method: '\(POST\|PATCH\|PUT\|DELETE\)'"`):
  - `pages/recaudo/index.vue`: `/recaudo/pagos/simular` (POST, **idempotente** — no persiste),
    `/recaudo/pagos` (POST, **NO idempotente**), `/obligaciones/:id/anular` (PATCH),
    `/recaudo/contrato/:id/liquidar-deposito` (POST, **NO idempotente**),
    `/obligaciones/generar-canones` (POST, **idempotente** — el backend salta lo que ya existe).
  - `pages/contratos/nuevo.vue`: `/contratos` (POST, **NO idempotente**).
  - `pages/caja/index.vue`: `/caja/arqueos` (POST — crea un snapshot; un doble arqueo son 2
    registros con el mismo saldo esperado, redundante pero no corrupción).
  - `usePersonasDirectorio.ts`: `/{clientes,codeudores}` (POST), `/{clientes,codeudores}/:id`
    (PATCH). Crear dos veces → el backend responde 409 (documento duplicado). PATCH es idempotente.
  - `pages/novedades/index.vue`: varios PATCH de aprobación/estado — el backend valida el estado
    y rechaza el segundo (`validarAprobable`, "ya fue resuelta financieramente").
  - `pages/administracion/index.vue`: `/usuarios` (POST), `/usuarios/:id` (PATCH),
    `/usuarios/:id/password` (PATCH).
  - `stores/auth.store.ts`: usa `$fetch` directo (NO `useApiFetch`) para login/refresh/logout —
    fuera del alcance de este cambio.
- `useEstadoConexion` (`composables/useEstadoConexion.ts`) — singleton con contador
  `iniciarIntento` / `resolverConExito` / `resolverSinExito`, consumido por
  `components/shared/BannerReconexion.vue`.

## Comandos que vas a necesitar

| Propósito | Comando | Éxito esperado |
|---|---|---|
| Lint | `npm run lint` | exit 0 |
| Typecheck | `npm run typecheck` | exit 0 (1 warning `vue-tsc` preexistente tolerado) |
| Build | `npm run build` | exit 0 |
| Tests | `npm run test` | todos pasan |
| Test filtrado | `npm run test -- use-api-fetch` | el spec nuevo pasa |

## Alcance

**En alcance:**
- `composables/useApiFetch.ts` — gatear el reintento por idempotencia del método.
- `tests/use-api-fetch.spec.ts` (nuevo) — cubrir el comportamiento por método.
- `pages/recaudo/index.vue` — pasar `{ idempotente: true }` a `simularPago` y `generarCanones`
  (opt-in para las mutaciones que SÍ son seguras de reintentar), y mejorar el mensaje de error de
  `registrarPago`/`confirmarLiquidarDeposito` para el caso "resultado desconocido".
- (Opcional) `pages/contratos/nuevo.vue` — mismo mensaje mejorado para `crearContrato`.

**Fuera de alcance (NO tocar):**
- `stores/auth.store.ts` (usa `$fetch` directo; login/refresh son un caso aparte).
- El reintento tras `401` → `refrescarSesion()` — ese SÍ se mantiene para todos los métodos (un
  401 significa que la petición nunca se procesó).
- La lógica del backend / idempotency keys — sería un plan de backend aparte (ver Notas).
- `useEstadoConexion` / `BannerReconexion`.

## Pasos

### Paso 1: Añadir el tipo de opción y la detección de idempotencia

En `composables/useApiFetch.ts`:

```ts
export type ApiFetchOptions = Record<string, unknown> & {
  headers?: Record<string, string>
  /**
   * Por defecto, `useApiFetch` NO reintenta ante fallo de red las peticiones con método
   * POST/PATCH/PUT/DELETE, porque un corte de red tras enviar la petición deja el resultado
   * DESCONOCIDO y reintentar podría duplicar la operación (p. ej. un recibo de caja).
   * Pásalo en `true` SOLO si la operación es idempotente de verdad en el backend
   * (p. ej. `/recaudo/pagos/simular`, que no persiste nada; `/obligaciones/generar-canones`,
   * que salta lo que ya existe).
   */
  idempotente?: boolean
}

const METODOS_IDEMPOTENTES = new Set(['GET', 'HEAD', 'OPTIONS'])

function esReintentable(options: ApiFetchOptions): boolean {
  if (options.idempotente === true) return true
  const metodo = String(options.method ?? 'GET').toUpperCase()
  return METODOS_IDEMPOTENTES.has(metodo)
}
```

### Paso 2: Gatear el reintento de red por idempotencia

En el bloque `if (esFalloDeRed(error) && intentosRed < MAX_REINTENTOS_RED)` (línea ~76):

```ts
if (esFalloDeRed(error) && intentosRed < MAX_REINTENTOS_RED && esReintentable(options)) {
  // ... reintento con backoff (sin cambios) ...
  continue
}

// Nuevo: si es un fallo de red en una mutación NO idempotente, no reintentamos —
// pero sí lo registramos para el banner de reconexión y lanzamos un error tipado
// para que la página pueda mostrar "resultado desconocido, verifica antes de reintentar".
if (esFalloDeRed(error) && !esReintentable(options)) {
  conexion.iniciarIntento()
  conexion.resolverSinExito()
  throw new ErrorMutacionIncierta(path, error)
}
```

Define `ErrorMutacionIncierta` en el mismo archivo (o en `composables/errores.ts` si prefieres):

```ts
export class ErrorMutacionIncierta extends Error {
  readonly esMutacionIncierta = true
  constructor(
    readonly path: string,
    readonly causa: unknown,
  ) {
    super(
      'No se pudo confirmar si la operación se completó (se perdió la conexión después de enviarla). ' +
        'Verifica en la pantalla antes de volver a intentar.',
    )
    this.name = 'ErrorMutacionIncierta'
  }
}
```

> Cuida el balance del contador de `useEstadoConexion`: `iniciarIntento()` incrementa,
> `resolverSinExito()` decrementa. Llamarlos en par (como arriba) mantiene el contador
> consistente. Revisa que en el camino de éxito (`if (registradaComoProblema) conexion.resolverConExito()`)
> no quede descuadrado — para una mutación no idempotente `registradaComoProblema` nunca se
> pone en `true` (ese flag solo se activa dentro del bloque de reintento), así que el camino de
> éxito no toca el contador. Correcto.

**Verify**: `npm run typecheck && npm run build` → exit 0.

### Paso 3: Marcar las mutaciones idempotentes conocidas como opt-in

En `pages/recaudo/index.vue`:

- `abrirConfirmarPago` (línea ~350), la llamada a `/recaudo/pagos/simular`:
  ```ts
  previsualizacion.value = await useApiFetch<PrevisualizacionPago>('/recaudo/pagos/simular', {
    method: 'POST',
    idempotente: true, // no persiste nada; seguro de reintentar
    body: { ... },
  })
  ```
- `generarCanones` (línea ~165), la llamada a `/obligaciones/generar-canones`:
  ```ts
  resultadoCanon.value = await useApiFetch<{ generadas: number }>('/obligaciones/generar-canones', {
    method: 'POST',
    idempotente: true, // el backend salta los canones que ya existen (clave única)
  })
  ```

**Verify**: `grep -n "idempotente: true" pages/recaudo/index.vue` → 2 resultados.

### Paso 4: Mensaje claro en las páginas para el "resultado desconocido"

En `pages/recaudo/index.vue`, `registrarPago` y `confirmarLiquidarDeposito`, el `catch (e: any)`
actual hace `error.value = e?.data?.message || 'No fue posible registrar el pago.'`. Ese mensaje
invita a reintentar. Distingue el caso incierto:

```ts
} catch (e: any) {
  if (e?.esMutacionIncierta) {
    avisoRefresco.value =
      'Se perdió la conexión al enviar el pago. NO lo vuelvas a registrar sin antes revisar ' +
      'la lista de recibos / la ficha del contrato: puede que sí se haya guardado.'
    return
  }
  error.value = e?.data?.message || 'No fue posible registrar el pago.'
  return
} finally {
  registrandoPago.value = false
}
await refrescarTrasOperacion()
```

Usa `avisoRefresco` (el aviso ámbar, no bloqueante) en vez de `error` (la alerta roja de "falló"),
porque el punto es justamente que **no sabemos** si falló.

> Aplica el mismo patrón en `confirmarLiquidarDeposito` (líneas ~506-533) y, si quieres,
> en `pages/contratos/nuevo.vue` `crearContrato` (un contrato duplicado lo bloquea el índice
> único de inmueble activo, así que el riesgo ahí es menor, pero el mensaje sigue siendo más
> honesto).

**Verify**: `npm run typecheck && npm run build && npm run lint` → exit 0.

### Paso 5: Actualizar `plans/README.md`

Marca la fila del plan 015 como **DONE** con el hash del commit.

## Plan de pruebas

**`tests/use-api-fetch.spec.ts` (nuevo)** — sigue el patrón de `tests/use-borrador.spec.ts`
(mockea lo externo, prueba el composable en aislamiento). Mockea `$fetch` (con `vi.fn()` y
`vi.stubGlobal`), `useRuntimeConfig`, `useAuthStore`, `useEstadoConexion`, `navigateTo`.

Casos:

1. **GET con fallo de red** → `$fetch` rechaza sin `status` 2 veces, luego resuelve →
   `useApiFetch('/x')` termina devolviendo el valor; `$fetch` fue llamado 3 veces.
2. **POST con fallo de red (sin `idempotente`)** → `$fetch` rechaza sin `status` →
   `useApiFetch('/x', { method: 'POST' })` **rechaza con `ErrorMutacionIncierta`**; `$fetch` fue
   llamado **1 sola vez** (no reintentó).
3. **POST con `idempotente: true` y fallo de red** → reintenta igual que un GET (3 llamadas).
4. **POST que devuelve 503** → (decisión de diseño, ver STOP) — documenta el comportamiento
   elegido en el test.
5. **401 en un POST** → llama a `auth.refrescarSesion()` (mock devuelve `'ok'`) y reintenta la
   petición original **una vez** (esto NO cambia con este plan; el test lo fija como regresión).
6. **PATCH con fallo de red** → mismo que caso 2 (no reintenta, `ErrorMutacionIncierta`).

**Comando:** `npm run test` → todos pasan (3 specs previos + el nuevo).

**Humo manual** (backend + frontend, como Administrador): con las DevTools abiertas, en la
pestaña Network activa "Offline" justo después de hacer clic en "Confirmar y generar recibo".
Comprueba que:
- La app **no** reintenta el POST (0 reintentos en Network).
- Aparece el aviso ámbar "Se perdió la conexión… verifica antes de reintentar", no la alerta roja.
- Al volver a "Online" y recargar, si el recibo se había guardado, aparece en la lista (y el
  cajero sabe que NO debe re-registrarlo).

## Criterios de cierre

TODOS deben cumplirse:

- [ ] `npm run lint && npm run typecheck && npm run build && npm run test` → exit 0.
- [ ] `tests/use-api-fetch.spec.ts` existe y sus ≥6 casos pasan.
- [ ] Con la red en "Offline", un `POST /recaudo/pagos` desde la UI produce exactamente **1**
      request (no 2-4) en la pestaña Network.
- [ ] `grep -n "idempotente" composables/useApiFetch.ts` → el tipo y la función existen.
- [ ] `grep -rn "esMutacionIncierta\|ErrorMutacionIncierta" pages/ composables/` → usado en
      `useApiFetch.ts` y manejado en al menos `pages/recaudo/index.vue`.
- [ ] Los GET siguen reintentando (caso 1 del spec).
- [ ] `plans/README.md` actualizado.

## STOP conditions

Detente y reporta si:

- Decidir el comportamiento para `503`/`504` en mutaciones no es trivial en el contexto real:
  el backend mapea `ER_LOCK_DEADLOCK`/`ER_LOCK_WAIT_TIMEOUT` → 503 (transacción abortada, seguro
  de reintentar) pero un `504` de gateway puede significar "sigue procesando" (NO seguro). El
  default conservador de este plan es **no reintentar ninguna mutación salvo opt-in**; si el
  dueño quiere reintentar mutaciones ante 502/503 (no 504, no `undefined`), documenta esa
  variante y ajústala — pero nunca reintentes ante `status === undefined` en una mutación.
- Algún llamador de `useApiFetch` con método mutante depende hoy del reintento para funcionar
  (p. ej. una pantalla que carga datos con un POST de búsqueda) — `grep -rn "method: 'POST'"` y
  revisa cada uno; si alguno es una lectura disfrazada de POST, márcalo `idempotente: true`.
- El contador de `useEstadoConexion` queda descuadrado (el banner se queda pegado) tras el
  cambio — revisa el balance `iniciarIntento`/`resolver*` en todos los caminos.

## Notas de mantenimiento

- **Revisor:** el corazón del cambio son ~15 líneas en `useApiFetch.ts`. Verificar que (a) el
  reintento tras 401 sigue intacto para todos los métodos, (b) los GET siguen reintentando,
  (c) ninguna mutación reintenta ante `status === undefined`.
- **Seguimiento (plan de backend, no urgente):** idempotency keys reales. El frontend genera un
  UUID por intento de operación y lo manda en un header `Idempotency-Key`; el backend guarda
  `(key → resultado)` y devuelve el resultado cacheado si llega la misma key dos veces. Eso
  permitiría volver a reintentar mutaciones con seguridad. Es un proyecto en sí; este plan es la
  mitigación barata mientras tanto.
- Este plan y el plan **001 del backend** (errores de BD transitorios → 503) interactúan: tras
  mergear 001, un deadlock del backend devuelve 503 con transacción ya abortada. Si más adelante
  se decide reintentar mutaciones ante 503 (variante del STOP de arriba), ese caso concreto es
  seguro *porque* 001 garantiza el rollback. Documenta la dependencia si tomas esa ruta.
