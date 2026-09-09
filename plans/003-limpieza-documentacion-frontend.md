# Plan 003: Limpieza de documentación del frontend

> **Executor instructions**: Sigue el plan. Este plan **solo toca archivos `.md`**, nunca
> código. Verifica cada paso con `grep`. Respeta las STOP conditions. Actualiza
> `plans/README.md` al terminar.
>
> **Drift check (primero)**: `git diff --stat 53e3e19..HEAD -- README.md`
> Si `README.md` tiene cambios sin commitear que no son tuyos, STOP.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: docs
- **Planned at**: commit `53e3e19`, 2026-09-03

## Why this matters

El `README.md` del frontend (bitácora) tiene afirmaciones que **el código actual contradice**:

- Describe una columna de acciones `"Suspender"/"Reactivar"/"Terminar"` y modales para
  "terminar y suspender" en `pages/contratos/index.vue` — **no existe "Suspender"**. Los
  únicos modales son `components/contratos/ModalTerminar.vue` y `ModalReactivar.vue` (el estado
  `SUSPENDIDO` fue eliminado del backend).
- Dice literalmente: *"no existe ninguna UI que invoque `PATCH /novedades/:id/estado`"* — **falso**:
  `pages/novedades/index.vue` tiene el botón "Cambiar estado" → `confirmarCambiarEstado()` →
  `useApiFetch('/novedades/${id}/estado', { method: 'PATCH', ... })`.
- Menciona badges semánticos para estados `suspendido`/`en_terminación` — estados que no existen.
- Referencia dos veces un archivo `AUDITORIA_FUNCIONAL_COMPLETA.md` que **no existe** en ninguno
  de los dos repos.

Además, `ARCHITECTURE_AND_AUDIT.md` (la fuente de verdad de auditoría del frontend, hoy **fuera
de git** porque `.gitignore` excluye `**/*.md`) tiene un par de imprecisiones menores.

Cada contradicción es una trampa para el siguiente agente que lea la bitácora.

## Current state

### `README.md` — líneas con afirmaciones a corregir

- **Línea 53**: `Ver detalle completo en `README.md` del backend y en `AUDITORIA_FUNCIONAL_COMPLETA.md``
- **Líneas 60-61**: `- `pages/contratos/index.vue`: columna de acciones con "Suspender"/"Reactivar"/"Terminar" / (según el estado del contrato), con modal de motivo/fecha para terminar y suspender, y`
- **Línea 68**: `## Fase 3 (2026-08-18) — cerrada (AUD-022 a AUD-029 de `AUDITORIA_FUNCIONAL_COMPLETA.md`)`
- **Línea ~93-94**: una frase que termina en `existe ninguna UI que invoque `PATCH /novedades/:id/estado`.` — hay que leer el párrafo completo para reemplazarlo con sentido.
- **Línea 135**: `- Badges semánticos: `emerald-600` activo/disponible, `amber-600` suspendido/en_terminación,`

### Realidad del código (para escribir la corrección)

- `pages/contratos/index.vue` → acciones "Reactivar" y "Terminar" (modales
  `components/contratos/ModalReactivar.vue` y `ModalTerminar.vue`). Sin "Suspender".
- `pages/novedades/index.vue` → sí invoca `PATCH /novedades/:id/estado` (botón "Cambiar estado",
  función `confirmarCambiarEstado`).
- Estados de contrato: solo `ACTIVO` / `TERMINADO`.

### Archivos de doc del frontend

| Ruta | En git | Estado |
|---|---|---|
| `README.md` | **sí** | bitácora — afirmaciones falsas, corregir |
| `AGENTS.md` | no (`**/*.md`) | reglas de agente — **vigente, no tocar** |
| `ARCHITECTURE_AND_AUDIT.md` | no | fuente de verdad de auditoría — errata menor, Step 3 |
| `ESPECIFICACION_UI_UX_PAGINA_POR_PAGINA.md` | no | spec de UI/UX de referencia — **no tocar contenido** |

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Verificar corrección | `grep -n "Suspender\|suspendido\|AUDITORIA_FUNCIONAL_COMPLETA\|ninguna UI que invoque" README.md` | 0 coincidencias al terminar |
| Ver estado | `git status` | solo `README.md` (los otros `.md` están gitignored) |

> No hay build/test que corra sobre `.md`. Verificación por `grep` + lectura.

## Scope

**In scope** (solo documentación):
- `README.md` (correcciones factuales)
- `ARCHITECTURE_AND_AUDIT.md` (errata — está fuera de git pero se edita igual)

**Out of scope**:
- **Cualquier archivo de código** (`.vue`, `.ts`).
- `AGENTS.md` — vigente.
- `ESPECIFICACION_UI_UX_PAGINA_POR_PAGINA.md` — es spec de referencia; no se toca su contenido.
- El `README.md` del **backend** y su copia de `ESPECIFICACION_UI_UX` — van en el plan 005 del
  repo backend.
- Decidir si `ARCHITECTURE_AND_AUDIT.md` debe entrar a git — es una decisión del dueño (ver
  Maintenance notes).

## Git workflow

- Rama: `advisor/003-limpieza-documentacion-frontend`.
- Un commit: `FE-docs: corregir afirmaciones obsoletas en el README`.
- `ARCHITECTURE_AND_AUDIT.md` está gitignored — se edita pero no aparecerá en `git add`.

## Steps

### Step 1: Corregir el `README.md`

Ediciones puntuales (buscar la cadena, reemplazar). No reescribas secciones enteras.

| Buscar | Reemplazar por |
|---|---|
| `y en `AUDITORIA_FUNCIONAL_COMPLETA.md`` (línea 53) | `y en `ARCHITECTURE_AND_AUDIT.md` (raíz de cada repo)` |
| `AUD-022 a AUD-029 de `AUDITORIA_FUNCIONAL_COMPLETA.md`` (línea 68) | `AUD-022 a AUD-029` |
| `columna de acciones con "Suspender"/"Reactivar"/"Terminar"` | `columna de acciones con "Reactivar"/"Terminar"` |
| `con modal de motivo/fecha para terminar y suspender, y` | `con modal de motivo/fecha para terminar, y` |
| `suspendido/en_terminación` (línea 135) | `terminado` |

Para el párrafo de la **línea ~93-94** (`... no existe ninguna UI que invoque `PATCH /novedades/:id/estado`.`):
leer el párrafo completo. Si afirma que esa UI **no existe / está pendiente**, reemplazar la
afirmación por: *"el cambio de estado del tablero de novedades (`ABIERTA` → `EN_SEGUIMIENTO` →
`CERRADA`/`ANULADA`) se hace desde `pages/novedades/index.vue` (botón 'Cambiar estado'), que
invoca `PATCH /novedades/:id/estado`."* Mantén el resto del párrafo.

Al final del `README.md`, añadir una entrada de bitácora:

```
## Limpieza de documentación (2026-XX-XX)

Corregidas afirmaciones obsoletas en esta bitácora: no existe acción "Suspender" de contrato
(estado SUSPENDIDO eliminado); la UI de cambio de estado de novedades SÍ existe
(`PATCH /novedades/:id/estado`); refs a `AUDITORIA_FUNCIONAL_COMPLETA.md` → `ARCHITECTURE_AND_AUDIT.md`.
```

**Verify**:
- `grep -n "Suspender\|suspendido\|en_terminación\|AUDITORIA_FUNCIONAL_COMPLETA\|ninguna UI que invoque" README.md` → 0 coincidencias.

### Step 2: (opcional, si aplica) revisar el resto del README por menciones de "Fase N"

El README lista "Fases" con estados "cerrada". No las toques salvo que contengan una de las
afirmaciones falsas de arriba. Si encuentras otra afirmación que el código claramente contradice
(p. ej. "página X no implementada" y la página existe), corrígela con el mismo criterio y
anótala en la entrada de bitácora del Step 1. Si tienes dudas sobre si algo es falso, **déjalo**
y anótalo para revisión — no es una STOP condition, solo no adivines.

### Step 3: Errata en `ARCHITECTURE_AND_AUDIT.md`

Este archivo está fuera de git — se edita igual. Correcciones:

- **§3** (o donde liste `rutasSoloAdmin`): donde dice que el array "incluye `recibos`", precisar
  que la entrada real es `'/recibos/'` **con barra final**, y que por eso `/recibos` (el
  listado, dual-rol) NO queda gateado como solo-admin — es intencional (el listado muestra solo
  recibos de novedad al Recepcionista), pero conviene documentarlo explícito.
- **§16** (fechas / `useFormatoCO`): el riesgo de timezone en `fecha()` está como "NO
  REPRODUCIDO / candidato a verificar". **Ya se verificó**: `composables/useFormatoCO.ts`
  parsea `YYYY-MM-DD` con componentes Y-M-D directos (no `new Date(string)`), igual que el
  backend — **no hay bug**. Reclasificar a "VERIFICADO — sin bug de timezone".
- **§22** (CSP / cabeceras): estaba como "NO DETERMINADO". Confirmar: `nuxt.config.ts` **no**
  define `routeRules` ni cabeceras de seguridad Nitro ni un módulo `nuxt-security`. Reclasificar
  a "CONFIRMADO — no hay CSP ni cabeceras de seguridad configuradas (los tokens viven en
  `localStorage`)". *(El fix es un plan aparte, no de este.)*
- Añadir al principio: `> Fe de erratas 2026-XX-XX: §3 (recibos con barra final), §16 (fecha() verificada, sin bug), §22 (confirmado: sin CSP).`

**Verify**: `grep -n "NO REPRODUCIDO.*timezone\|riesgo.*timezone" ARCHITECTURE_AND_AUDIT.md` → 0
(o dentro de un bloque marcado como resuelto).

## Test plan

No aplica (documentación). Verificación:

- `grep -n "Suspender\|AUDITORIA_FUNCIONAL_COMPLETA\|ninguna UI que invoque" README.md` → 0
- Lectura final del diff de `README.md`: solo correcciones factuales, ninguna sección
  reescrita entera, ninguna afirmación nueva sin respaldo en el código.

## Done criteria

- [ ] `grep -n "Suspender\|suspendido\|en_terminación" README.md` → 0
- [ ] `grep -n "AUDITORIA_FUNCIONAL_COMPLETA" README.md` → 0
- [ ] `grep -n "ninguna UI que invoque" README.md` → 0
- [ ] `README.md` menciona `ARCHITECTURE_AND_AUDIT.md` al menos 1 vez
- [ ] `ARCHITECTURE_AND_AUDIT.md` §16 ya no marca el timezone de `fecha()` como pendiente
- [ ] Ningún archivo `.vue`/`.ts` modificado (`git status --porcelain | grep -E '\.(vue|ts)$'` vacío)
- [ ] Fila en `plans/README.md` actualizada

## STOP conditions

- `README.md` no coincide con "Current state" (las líneas citadas cambiaron).
- Al reemplazar el párrafo de la línea ~93, el contexto hace que la corrección no encaje
  gramaticalmente — reformula con cuidado o reporta.
- Encuentras en el README una afirmación que **no puedes verificar** contra el código en pocos
  minutos — déjala como está y anótala; no la borres ni la "corrijas" adivinando.
- Cualquier archivo de código aparece modificado.

## Maintenance notes

- **Reviewer**: leer el diff completo del `README.md`; confirmar que solo se corrigió lo falso y
  que la nueva entrada de bitácora es precisa.
- **Decisión del dueño** (no la resuelve este plan): `ARCHITECTURE_AND_AUDIT.md`, `AGENTS.md` y
  `ESPECIFICACION_UI_UX_PAGINA_POR_PAGINA.md` están **fuera de control de versiones** porque el
  `.gitignore` tiene `**/*.md`. Una "fuente de verdad" sin git es frágil (no hay historial, no
  se revisa en PRs, se pierde si alguien limpia el working tree). Decidir si se añade una
  excepción `!ARCHITECTURE_AND_AUDIT.md` (y `!AGENTS.md`) al `.gitignore`.
- **Diferido**: la falta de CSP / cabeceras de seguridad (§22) es un hallazgo real — su fix es
  un plan aparte (routeRules de Nitro o `nuxt-security`), no este.
