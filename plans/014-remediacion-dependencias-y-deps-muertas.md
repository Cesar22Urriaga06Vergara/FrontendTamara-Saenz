# Plan 014: Remediación de dependencias vulnerables + eliminación de dependencias muertas

> **ESTADO: TODO.** Generado por la skill `improve` (auditoría ronda 3, 2026-09-05). Primer
> `npm audit` sobre este repo. Cubre dos hallazgos que comparten `package.json`:
>
> - **S-4** — 3 vulnerabilidades moderadas de dependencias, nunca escaneadas.
> - **A-5** — `exceljs` y `file-saver` están en `dependencies` pero **no se importan en ningún
>   lado** (los exports pasan por `useApiFetch<Blob>`); son la causa de 2 de las 3
>   vulnerabilidades.
>
> Empareja con el **plan 014 del backend** (misma higiene). Conviene desplegarlos juntos.

## Status

- **Priority**: P2 (moderadas, herramienta interna) — pero el fix es barato y limpia 2 de 3.
- **Effort**: S (quitar 2 deps + `npm audit`)
- **Risk**: LOW — las deps a quitar no se usan; verificable con `grep` + `build` + `typecheck`.
- **Depends on**: plan 012 (ejecutar sobre `main`).
- **Category**: security / dependencies / tech-debt
- **Planned at**: commit `4d429b8` (rama `correccion-hallazgos-auditoria`), 2026-09-05

## Por qué importa

`npm audit` (2026-09-05) reporta **3 vulnerabilidades moderadas**:

| Paquete | Vía | Detalle |
|---|---|---|
| `@nuxt/ui` <4.8.1 | dependencia directa (`^2.17.0`) | GHSA-gj2h-2fpw-fhv9: `UAuthForm`/`UForm` omiten `method` en el markup SSR → si se envían antes de hidratar, van por GET y filtran credenciales en la URL. |
| `exceljs` ≥3.5.0 | dependencia directa (`^4.4.0`) | depende de una versión vulnerable de `uuid`. |
| `uuid` <11.1.1 | nested en `exceljs` | GHSA-w5hq-g745-h8pq: bounds check faltante cuando se pasa `buf`. |

Dos observaciones que cambian el enfoque:

1. **`exceljs` y `file-saver` NO se usan.** `grep -rn "exceljs\|file-saver\|FileSaver" --include='*.vue'
   --include='*.ts' .` (excluyendo `node_modules`) → **0 resultados**. Los reportes .xlsx se
   descargan como binario ya generado por el backend, vía `composables/useExcelExport.ts`
   (`useApiFetch<Blob>` + un `<a download>`), y los PDF vía `composables/usePdfDownload.ts`.
   Ninguno importa `exceljs` ni `file-saver`. Están en `package.json:19,20` como residuo.
   Quitarlos elimina las vulnerabilidades de `exceljs` y `uuid` de un plumazo y reduce el peso de
   `node_modules`.

2. **`@nuxt/ui` <4.8.1: el flag NO es directamente explotable aquí**, pero apunta a un problema
   real que sí existe. Este repo usa `@nuxt/ui` v2 **a propósito** (documentado en
   `ARCHITECTURE_AND_AUDIT.md` §4: migrar a v3/v4 obligaría a reescribir `UFormGroup`→`UFormField`,
   slots de tabla, etc.). Y **no usa `UForm` ni `UAuthForm`** en ningún lado
   (`grep -rn "UForm\b\|UAuthForm" --include='*.vue' .` → solo `UFormGroup`, que no está en el
   advisory). Así que el componente vulnerable de la librería no se instancia. **Pero**
   `pages/login.vue` reproduce el mismo patrón a mano (un `<form>` sin `method="post"`) — eso lo
   arregla el **plan 016**, no este. Aquí solo se decide qué hacer con el flag de `npm audit`.

`npm ci` corre con `npm warn using --force` por el `~/.npmrc` global del usuario (`force=true`) —
config de máquina, fuera del alcance de este repo, pero anotado.

## Estado actual

- `package.json` (`4d429b8`):
  ```jsonc
  "dependencies": {
    "@nuxt/ui": "^2.17.0",
    "@pinia/nuxt": "^0.5.1",
    "exceljs": "^4.4.0",     // <-- no se importa
    "file-saver": "^2.0.5",  // <-- no se importa
    "pinia": "^2.1.7",
    "vue": "^3.4.0"
  }
  ```
- No hay `@types/file-saver` en devDependencies (ya es una señal de que no se usa con tipos).
- `composables/useExcelExport.ts` — 17 líneas, `useApiFetch<Blob>` + `document.createElement('a')`.
  No importa nada de `exceljs`/`file-saver`.
- `composables/usePdfDownload.ts` — 14 líneas, `useApiFetch<Blob>` + `window.open`.
- No hay campo `overrides` en `package.json`.
- No hay `.github/` en el repo (sin CI) — el paso de `npm audit` en CI depende de que exista
  `ci.yml` (plan 012 Paso 7, o el plan aparte de S-11).

## Comandos que vas a necesitar

| Propósito | Comando | Éxito esperado |
|---|---|---|
| Auditar | `npm audit` | lista de vulnerabilidades |
| Buscar uso | `grep -rn "exceljs\|file-saver" --include='*.vue' --include='*.ts' .` | 0 resultados fuera de `node_modules` |
| Instalar | `npm ci` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Typecheck | `npm run typecheck` | exit 0 (1 warning `vue-tsc` preexistente tolerado) |
| Build | `npm run build` | exit 0 |
| Tests | `npm run test` | todos pasan |

## Alcance

**En alcance:**
- `package.json` + `package-lock.json`: quitar `exceljs` y `file-saver`; `npm audit fix` para lo
  que se pueda sin `--force`.
- `README.md`: si menciona exportación a Excel desde el frontend, corregir la afirmación (los
  reportes los genera el backend).
- (Si el plan 012 Paso 7 se hizo) `.github/workflows/ci.yml`: añadir `npm audit --audit-level=high`.
- Documentar la decisión sobre `@nuxt/ui` (aceptar el flag moderado, no migrar).

**Fuera de alcance (NO tocar):**
- Migrar `@nuxt/ui` v2 → v3/v4 — es un proyecto grande, deliberadamente evitado. No es este plan.
- `pages/login.vue` — el patrón `<form>` sin `method` es el **plan 016**.
- `composables/useExcelExport.ts` / `usePdfDownload.ts` — funcionan, no se tocan.
- Cualquier componente `.vue`.

## Pasos

### Paso 1: Confirmar que `exceljs` y `file-saver` no se usan

```bash
grep -rn "exceljs\|ExcelJS\|file-saver\|FileSaver\|saveAs" --include='*.vue' --include='*.ts' --include='*.mts' . | grep -v node_modules
```

**Verify**: 0 resultados (o solo comentarios/strings, nada que sea un `import`/`require`/uso real).

> Si aparece un uso real, **STOP** — el hallazgo A-5 sería incorrecto; reporta dónde y evalúa
> con el dueño si ese código debería usar el endpoint del backend en su lugar.

### Paso 2: Quitar las dependencias muertas

```bash
npm uninstall exceljs file-saver
npm ci
npm run lint && npm run typecheck && npm run build && npm run test
```

**Verify**: los 4 comandos en verde (typecheck con el warning preexistente conocido, no errores
nuevos). `grep -n '"exceljs"\|"file-saver"' package.json` → sin resultados.

### Paso 3: `npm audit fix` para el resto

```bash
npm audit
```

Tras el Paso 2, `exceljs` y `uuid` ya no deberían aparecer. Queda `@nuxt/ui`.

```bash
npm audit fix
```

**No uses `--force`** (`@nuxt/ui@4.11.0` es breaking y contradice la decisión de arquitectura).
`npm audit fix` sin `--force` probablemente no cambie nada para `@nuxt/ui`.

**Verify**: `npm audit` ahora lista **solo** `@nuxt/ui` (1 moderada) o nada.
`npm run build && npm run test` → verde.

### Paso 4: Documentar la decisión sobre `@nuxt/ui`

Crea `SECURITY.md` en la raíz del repo (o una sección en el README) con una nota corta:

```markdown
## Vulnerabilidades de dependencias aceptadas

- **`@nuxt/ui` < 4.8.1 (GHSA-gj2h-2fpw-fhv9, moderada)** — el advisory afecta a `UAuthForm` /
  `UForm`, componentes que este proyecto **no usa** (`grep -rn "UAuthForm\|UForm\b" --include='*.vue' .`
  → vacío; solo se usa `UFormGroup`, no afectado). Migrar a `@nuxt/ui` v4 es un cambio mayor
  deliberadamente pospuesto (ver `ARCHITECTURE_AND_AUDIT.md` §4). El patrón subyacente —un `<form>`
  que puede enviarse por GET antes de hidratar— se corrige de forma independiente en
  `pages/login.vue` (plan 016). Revisar en el próximo upgrade de Nuxt.
```

> Si el repo ya tiene un `SECURITY.md` o el `.gitignore` bloquea `*.md` que no sea `README.md`
> (revisa `.gitignore` — este repo tiene `**/*.md` + `!README.md`), pon la nota en el `README.md`
> en su lugar, o añade `!SECURITY.md` a `.gitignore`.

**Verify**: la nota existe y es legible; `git status` muestra el archivo trackeado.

### Paso 5: Revisar afirmaciones del README

```bash
grep -ni "excel\|xlsx\|exportar\|file-saver" README.md
```

Si el README dice que el frontend genera/usa Excel, corrígelo: *"Los reportes .xlsx los genera el
backend (`ExcelJS`); el frontend solo dispara la descarga del binario ya construido
(`useExcelExport` → `useApiFetch<Blob>`)."*

**Verify**: el README no atribuye generación de Excel al frontend.

### Paso 6: (Si existe `.github/workflows/ci.yml`) auditoría en CI

Añade tras `npm ci`:

```yaml
      - name: Auditoría de dependencias
        run: npm audit --audit-level=high
```

`--audit-level=high` para no fallar el CI por la moderada aceptada de `@nuxt/ui`.

**Verify**: `npm audit --audit-level=high` local → exit 0.

### Paso 7: Actualizar `plans/README.md`

Marca la fila del plan 014 como **DONE** con el hash del commit.

## Plan de pruebas

No hay lógica nueva. La verificación es:

- `npm run build` compila sin `exceljs`/`file-saver` → prueba de que no se usaban.
- `npm run test` (los 3 specs: `auth-store`, `use-borrador`, `depositos-liquidacion`) pasan.
- **Humo manual** con backend + frontend corriendo, como Administrador:
  1. `/reportes` → descargar cada uno de los reportes .xlsx → el archivo se descarga y abre en
     Excel/LibreOffice sin corromperse.
  2. `/recaudo` → registrar un pago → "Ver Carta" / "Ver Media Carta" → el PDF abre en pestaña nueva.
  Esto confirma que quitar las deps no rompió las descargas (que nunca dependieron de ellas).

## Criterios de cierre

TODOS deben cumplirse:

- [ ] `grep -n '"exceljs"\|"file-saver"' package.json` → sin resultados.
- [ ] `npm audit` → como mucho 1 moderada (`@nuxt/ui`), 0 altas/críticas.
- [ ] `npm run lint && npm run typecheck && npm run build && npm run test` → exit 0.
- [ ] Descarga manual de un reporte .xlsx y de un PDF de recibo → ambos funcionan.
- [ ] La decisión sobre `@nuxt/ui` está documentada (SECURITY.md o README).
- [ ] `plans/README.md` actualizado.

## STOP conditions

Detente y reporta si:

- El Paso 1 encuentra un uso real de `exceljs` o `file-saver`.
- Quitar las deps rompe `npm run build` o `npm run typecheck` con errores nuevos.
- `npm audit fix` quiere subir `@nuxt/ui`, `nuxt`, `vue` o `pinia` de major.
- Alguna descarga (.xlsx o PDF) se rompe tras el cambio (no debería — reporta y revierte).

## Notas de mantenimiento

- **Revisor:** el diff es solo `package.json` + `package-lock.json` + una nota de doc. Confirmar
  que no se tocó ningún `.vue` ni composable.
- Cuando llegue el momento de subir Nuxt/`@nuxt/ui` a v4 (proyecto aparte), este advisor de
  `@nuxt/ui` se resuelve solo. Hasta entonces, el plan 016 cubre el riesgo real (el `<form>` de
  login).
- Si en el futuro se quiere generar Excel/CSV en el cliente (p. ej. exportar una tabla filtrada
  sin ida al backend), reevaluar: `@nuxt/ui` no trae eso; se necesitaría volver a agregar una
  librería y volver a auditarla.
