# Plan 005: No perder lo escrito si se cae la página o la red (borradores)

> **Executor instructions**: Sigue el plan paso a paso. Verifica cada paso. Respeta las
> STOP conditions. Actualiza `plans/README.md` al terminar.
>
> **Drift check (primero)**:
> `git diff --stat 53e3e19..HEAD -- pages/recaudo/index.vue pages/contratos/nuevo.vue pages/novedades/nueva.vue composables/usePersonasDirectorio.ts`
> Si alguno cambió, compara con "Current state" antes de cablear ese formulario.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none (independiente del plan 004, aunque van juntos conceptualmente)
- **Category**: UX / bug
- **Planned at**: commit `53e3e19`, 2026-09-03

## Why this matters

El dueño pidió: *"integrar el guardar procesos si la página o la red de internet se cae"*.
Ejemplo real: el cajero está registrando un pago con 3 medios, o una liquidación de depósito con
varios descuentos, o creando un contrato (formulario largo), y se cierra el navegador / se va el
wifi / se recarga la página por accidente. **Hoy pierde todo y empieza de cero.**

Decisión del dueño (confirmada): **solo recuperar el borrador**. Nada se envía automáticamente.
Al volver, el formulario aparece con lo que había escrito y el usuario pulsa "Registrar/Guardar"
cuando quiera. Es lo seguro para operaciones de dinero — cero riesgo de doble cobro o de aplicar
un pago con fecha/saldo equivocados.

## Current state

### No existe ningún mecanismo de borrador hoy

Los formularios guardan su estado en `ref()` / `reactive()` normales, en memoria — se pierde al
recargar. La única persistencia en `localStorage` es la sesión (`auth.store`) y el bloqueo de
color-mode.

### Formularios objetivo y su estado (para cablear)

| Formulario | Archivo | Estado a persistir |
|---|---|---|
| Registrar pago | `pages/recaudo/index.vue` | `detallesPago` (reactive array), `dejarExcedenteComoSaldoFavor` (ref) |
| Liquidar depósito | `pages/recaudo/index.vue` | `descuentosDeposito` (reactive array), `formLiquidar` (reactive: medioPago, referencia, observaciones) |
| Crear contrato | `pages/contratos/nuevo.vue` | `fechaInicio`, `diaPago`+`diaPagoEditadoManualmente`, `depositoGarantia`, `medioPagoDeposito`, `referenciaDeposito`, y los ids de cliente/codeudores/inmueble seleccionados (revisar los nombres exactos de esos refs) |
| Registrar novedad | `pages/novedades/nueva.vue` | `descripcion`, `fecha`, `observaciones`, id del inmueble seleccionado, id del contrato relacionado |
| Crear/editar persona | `composables/usePersonasDirectorio.ts` | `formulario` (reactive) — **solo en modo creación**, no edición |

### Composable de debounce existente (patrón a seguir para el estilo)

`composables/useBusquedaAutomatica.ts`:

```typescript
export function useBusquedaAutomatica(termino: Ref<string>, buscar: () => void, esperaMs = 400) {
  let temporizador: ReturnType<typeof setTimeout> | null = null
  watch(termino, () => {
    if (temporizador) clearTimeout(temporizador)
    if (!termino.value) return
    temporizador = setTimeout(buscar, esperaMs)
  })
}
```

### Repo conventions

- Composables en `composables/` (auto-import). Pinia option stores.
- Guardas `import.meta.client` para todo lo que toca `localStorage`.
- `@nuxt/ui` v2: `UAlert` (con `color`, `variant="subtle"`, slot de acción). Tema claro fijo.
- Comentarios en español.
- Limpieza de temporizadores/watchers al desmontar (`onScopeDispose` / `onBeforeUnmount`) —
  `useBusquedaAutomatica` **no** lo hace hoy; el nuevo composable **sí** debe.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Lint | `npm run lint` | exit 0 |
| Typecheck | `npm run typecheck` | sin líneas `error TS` (warning de `vue-router/volar` preexistente, ignóralo) |
| Build | `npm run build` | exit 0 |
| Tests | `npm run test` | exit 0 |

## Scope

**In scope**:
- `composables/useBorrador.ts` (crear)
- `pages/recaudo/index.vue` (pago + liquidación)
- `pages/contratos/nuevo.vue`
- `pages/novedades/nueva.vue`
- `composables/usePersonasDirectorio.ts`
- `tests/use-borrador.spec.ts` (crear)

**Out of scope**:
- Cola offline / auto-envío — **explícitamente descartado** por el dueño. NO lo implementes.
- Sincronización de borradores entre pestañas o dispositivos — no.
- Persistir la **previsualización** de un pago (`previsualizacion` / `ultimoRecibo`) — no es
  entrada del usuario, se recalcula.
- El formulario de **edición** de persona/inmueble — solo creación (editar ya tiene los datos
  del backend; un borrador viejo podría pisar cambios reales).
- `pages/inmuebles/*` — el formulario de inmueble es simple y de bajo riesgo de pérdida; si
  sobra tiempo se puede añadir con el mismo patrón, pero no es obligatorio en este plan.

## Git workflow

- Rama: `advisor/005-borradores-de-formulario`.
- Commits: (1) el composable + su test, (2..N) un commit por formulario cableado. Mensajes
  estilo repo, ej: `FE-5: borrador en el formulario de registrar pago`.

## Steps

### Step 1: El composable `useBorrador`

Crear `composables/useBorrador.ts`. API:

```typescript
interface OpcionesBorrador {
  /** ms de espera tras el último cambio antes de guardar. Default 800. */
  esperaMs?: number
}

/**
 * Persiste el estado de un formulario en localStorage mientras el usuario escribe, y lo
 * ofrece de vuelta si vuelve a la pantalla tras un cierre/recarga/corte de red.
 *
 * SOLO recupera el borrador — nunca envía nada. El usuario confirma el envío manualmente y,
 * cuando el envío tiene éxito, se llama `limpiar()`.
 *
 * @param clave  clave namespaced y estable para este formulario+contexto. Ej:
 *               `'borrador:pago:' + contratoId`, `'borrador:contrato-nuevo'`.
 *               Puede ser un getter para claves que dependen de estado reactivo.
 * @param leer   devuelve el estado actual del formulario como objeto plano serializable.
 * @param aplicar recibe un objeto guardado y lo vuelca en los refs/reactive del formulario.
 */
export function useBorrador(
  clave: string | (() => string),
  leer: () => Record<string, unknown>,
  aplicar: (datos: Record<string, unknown>) => void,
  opciones: OpcionesBorrador = {},
) {
  const claveActual = () => (typeof clave === 'function' ? clave() : clave)
  const hayBorrador = ref(false)
  let temporizador: ReturnType<typeof setTimeout> | null = null
  let suspendido = true // no guardar hasta después de la restauración inicial

  const guardarAhora = () => {
    if (!import.meta.client || suspendido) return
    try {
      localStorage.setItem(claveActual(), JSON.stringify({ datos: leer(), guardadoEn: Date.now() }))
    } catch {
      /* localStorage lleno o no disponible: el borrador es best-effort, no romper el formulario */
    }
  }

  const limpiar = () => {
    if (import.meta.client) localStorage.removeItem(claveActual())
    hayBorrador.value = false
  }

  /** Llamar en onMounted del formulario. Detecta si hay un borrador guardado. */
  const detectar = () => {
    if (!import.meta.client) return
    const raw = localStorage.getItem(claveActual())
    hayBorrador.value = !!raw
    suspendido = false
  }

  /** El usuario aceptó recuperar el borrador. */
  const restaurar = () => {
    if (!import.meta.client) return
    try {
      const raw = localStorage.getItem(claveActual())
      if (raw) aplicar(JSON.parse(raw).datos)
    } catch {
      limpiar()
    }
    hayBorrador.value = false
  }

  // Auto-guardado con debounce mientras cambian los datos.
  watch(leer, () => {
    if (temporizador) clearTimeout(temporizador)
    temporizador = setTimeout(guardarAhora, opciones.esperaMs ?? 800)
  }, { deep: true })

  onScopeDispose(() => {
    if (temporizador) clearTimeout(temporizador)
  })

  return { hayBorrador, detectar, restaurar, limpiar }
}
```

Notas de diseño:
- `suspendido` evita que el `watch` inicial (que dispara al montar) pise el borrador guardado
  antes de que el usuario decida si restaurarlo.
- `watch(leer, ..., { deep: true })` — `leer` es una función que devuelve un objeto; Vue la trata
  como getter y hace deep-watch del resultado.
- No auto-restaura: expone `hayBorrador` para que el formulario muestre un aviso con botón.

**Verify**: `npm run typecheck` → sin `error TS`. `npm run lint` → exit 0.

### Step 2: Test del composable

Crear `tests/use-borrador.spec.ts` (patrón: `tests/depositos-liquidacion.spec.ts` para el estilo
vitest; `localStorage` stubeado como en el plan 004):

```typescript
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useBorrador } from '../composables/useBorrador'

// stub de localStorage en memoria (igual que en tests/auth-store.spec.ts)

describe('useBorrador', () => {
  beforeEach(() => { /* stub localStorage limpio, vi.useFakeTimers() */ })

  it('detecta que hay un borrador guardado', () => {
    localStorage.setItem('borrador:test', JSON.stringify({ datos: { a: 1 }, guardadoEn: 0 }))
    const estado = ref({ a: 0 })
    const b = useBorrador('borrador:test', () => estado.value, (d) => (estado.value = d as any))
    b.detectar()
    expect(b.hayBorrador.value).toBe(true)
  })

  it('restaura el borrador en el estado del formulario', () => {
    localStorage.setItem('borrador:test', JSON.stringify({ datos: { a: 42 }, guardadoEn: 0 }))
    const estado = ref<{ a: number }>({ a: 0 })
    const b = useBorrador('borrador:test', () => estado.value, (d) => (estado.value = d as any))
    b.detectar(); b.restaurar()
    expect(estado.value.a).toBe(42)
  })

  it('guarda con debounce al cambiar los datos', async () => {
    const estado = ref({ a: 0 })
    const b = useBorrador('borrador:test', () => estado.value, () => {}, { esperaMs: 100 })
    b.detectar() // quita `suspendido`
    estado.value.a = 7
    await new Promise((r) => setTimeout(r, 150))
    expect(JSON.parse(localStorage.getItem('borrador:test')!).datos.a).toBe(7)
  })

  it('limpiar() borra la clave', () => {
    localStorage.setItem('borrador:test', 'x')
    const b = useBorrador('borrador:test', () => ({}), () => {})
    b.limpiar()
    expect(localStorage.getItem('borrador:test')).toBeNull()
  })

  it('no revienta si el borrador guardado está corrupto', () => {
    localStorage.setItem('borrador:test', '{ corrupto')
    const b = useBorrador('borrador:test', () => ({}), () => { throw new Error('no debería llegar') })
    b.detectar()
    expect(() => b.restaurar()).not.toThrow()
    expect(localStorage.getItem('borrador:test')).toBeNull()
  })
})
```

> Si el `watch` deep sobre un getter no dispara bien bajo el entorno de test, ajusta el test para
> pasar un `reactive` directamente en vez de `() => estado.value`, o marca ese caso concreto como
> STOP y reporta — los otros 4 tests son los importantes.

**Verify**: `npx vitest run use-borrador` → los tests pasan.

### Step 3: Cablear "Registrar pago" (`pages/recaudo/index.vue`)

Este es el formulario más crítico. Patrón a replicar en los demás:

1. Importar/usar `useBorrador` (auto-import). Clave dependiente del contrato:
   `() => 'borrador:pago:' + (contratoSeleccionado.value?.id ?? 'sin-contrato')`.
2. `leer`: `() => ({ detallesPago: [...detallesPago], dejarExcedenteComoSaldoFavor: dejarExcedenteComoSaldoFavor.value })`.
3. `aplicar`: reemplaza el contenido de `detallesPago` (`splice`) y setea `dejarExcedenteComoSaldoFavor.value`.
4. En `onMounted` / cuando se selecciona un contrato (dentro de `seleccionarContrato`, tras
   cargar la ficha): llamar `borrador.detectar()`.
5. En la plantilla, encima del formulario de pago, un aviso cuando `borrador.hayBorrador`:

```vue
<UAlert
  v-if="borradorPago.hayBorrador.value"
  color="amber"
  variant="subtle"
  icon="i-heroicons-document-text"
  title="Tienes un pago a medio registrar guardado"
>
  <template #actions>
    <UButton size="xs" color="amber" @click="borradorPago.restaurar()">Recuperar</UButton>
    <UButton size="xs" color="gray" variant="ghost" @click="borradorPago.limpiar()">Descartar</UButton>
  </template>
</UAlert>
```

6. En `registrarPago()`, **tras el éxito** (donde ya se limpia `detallesPago` en la ronda 1),
   añadir `borradorPago.limpiar()`.
7. En `volverAlListado()`, NO limpiar el borrador (el usuario podría querer volver a él); pero sí
   llamar `borrador.detectar()` de nuevo al re-seleccionar el contrato.

**Verify**: `npm run build` → exit 0. `npm run lint` → exit 0. Humo: llenar 2 medios de pago,
recargar la página, volver a /recaudo y seleccionar el mismo contrato → aparece el aviso;
"Recuperar" → los 2 medios vuelven.

### Step 4: Cablear "Liquidar depósito" (`pages/recaudo/index.vue`)

Mismo patrón. Clave: `() => 'borrador:liquidar:' + (contratoSeleccionado.value?.id ?? '')`.
`leer`: `{ descuentosDeposito: [...descuentosDeposito], formLiquidar: { ...formLiquidar } }`.
`aplicar`: `splice` sobre `descuentosDeposito` + `Object.assign(formLiquidar, datos.formLiquidar)`.
`detectar()` al abrir el modal (`abrirLiquidarDeposito`). `limpiar()` tras éxito en
`confirmarLiquidarDeposito`. El aviso va dentro del modal `ModalLiquidarDeposito` o justo antes
de abrirlo — lo más simple: un `UAlert` en la página que se muestre si `hayBorrador` y el
contrato está TERMINADO.

**Verify**: `npm run build` → exit 0. Humo: añadir 2 descuentos, recargar, reabrir el modal →
aviso → recuperar.

### Step 5: Cablear "Crear contrato" (`pages/contratos/nuevo.vue`)

Clave fija: `'borrador:contrato-nuevo'`. `leer` y `aplicar` sobre los refs listados en "Current
state" (revisar los nombres exactos abriendo el archivo — hay refs de selección de
cliente/codeudores/inmueble que hay que incluir). `detectar()` en `onMounted`. Aviso arriba del
formulario. `limpiar()` tras crear con éxito (donde hoy hace `navigateTo`).

**Verify**: `npm run build`. Humo: llenar medio formulario, recargar, volver a /contratos/nuevo
→ aviso → recuperar.

### Step 6: Cablear "Registrar novedad" (`pages/novedades/nueva.vue`)

Clave: `'borrador:novedad-nueva'`. Estado: `descripcion`, `fecha`, `observaciones`, + ids de
inmueble/contrato seleccionados. Mismo patrón.

### Step 7: Cablear "Crear persona" (`composables/usePersonasDirectorio.ts`)

**Solo modo creación.** Clave: `() => 'borrador:persona:' + recurso` (`clientes` o `codeudores`).
`leer`: `{ ...formulario }`. `aplicar`: `Object.assign(formulario, datos)`. `detectar()` cuando
se abre el modal de creación (`abrirCreacion`). `limpiar()` en `guardar()` tras éxito y también
en `resetearFormulario()` si se cancela — decidir: probablemente **no** limpiar al cancelar (que
el borrador sobreviva a un cierre accidental del modal). El aviso va dentro del
`FormularioPersona` o como prop.

> Este es el más fiddly por ser un composable compartido. Si te lleva más de lo razonable,
> entrégalo como STOP y reporta — los formularios de las páginas (Steps 3-6) son la mayor parte
> del valor.

**Verify**: `npm run build` → exit 0. `npm run test` → exit 0.

### Step 8: Suite + humo integral

**Verify**: `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test` → todos verdes.
Humo manual: para cada formulario cableado, llenar → recargar (F5) → volver → el aviso aparece y
"Recuperar" restaura los datos; "Descartar" los borra; enviar con éxito borra el borrador.

## Test plan

- `tests/use-borrador.spec.ts`: detectar, restaurar, guardar con debounce, limpiar, tolerar
  corrupto (5 casos).
- **Humo manual por formulario** (Step 8) — no hay infra para test de integración de páginas Nuxt
  completas en este repo, así que el humo es la verificación de cada cableado.
- **Verificación**: `npm run test` verde + humo de los 5-6 formularios.

## Done criteria

- [ ] `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test` → todos exit 0
- [ ] `composables/useBorrador.ts` existe; `tests/use-borrador.spec.ts` pasa
- [ ] `grep -rn "useBorrador" pages/ composables/` → al menos 4 formularios cableados (pago,
      liquidación, contrato-nuevo, novedad-nueva); persona es opcional
- [ ] Cada formulario cableado: `limpiar()` se llama tras el envío exitoso (`grep` de `.limpiar()`)
- [ ] Humo Step 8: recargar a mitad de un formulario y recuperar funciona en los 4-5 formularios
- [ ] `grep -rn "cola\|queue\|auto-env\|autoSend" composables/useBorrador.ts` → 0 (no se implementó cola)
- [ ] `git status --porcelain` sin archivos fuera del scope
- [ ] Fila en `plans/README.md` actualizada

## STOP conditions

- Un formulario objetivo no coincide con "Current state" (refactorizado desde que se escribió
  este plan) — re-mapear su estado antes de cablearlo, o reportar si es muy distinto.
- El `watch` deep sobre el getter de `leer` no dispara en el entorno de test → ajustar el test
  (pasar `reactive` directo) o reportar ese caso.
- El cableado del composable compartido `usePersonasDirectorio` (Step 7) se complica → entregar
  Steps 1-6 y reportar el 7.
- Restaurar un borrador viejo introduce un bug visible (p. ej. un `detallesPago` con forma
  distinta a la actual rompe el render) → añadir validación de forma en `aplicar` o reportar.

## Maintenance notes

- **Reviewer**: confirmar que **nada se auto-envía** — `useBorrador` solo lee/escribe
  `localStorage`, nunca llama `useApiFetch`. Y que `limpiar()` se invoca tras cada envío exitoso
  (si no, el borrador viejo reaparece la próxima vez).
- **Claves con datos sensibles**: los borradores de pago contienen montos, no datos personales
  fuertes ni tokens. Aceptable en `localStorage` para una herramienta interna. Si en el futuro un
  formulario incluye datos sensibles (documento, teléfono), evaluar cifrado o TTL corto.
- **TTL**: los borradores no expiran. Si se acumulan (una clave por contrato), añadir un barrido
  al arrancar que borre los `borrador:*` con `guardadoEn` de hace más de N días. Follow-up menor.
- **Interacción con el plan 004**: son complementarios — 004 evita que un corte de red te saque;
  005 evita que pierdas lo escrito si aun así se recarga la página. Ninguno depende del otro.
