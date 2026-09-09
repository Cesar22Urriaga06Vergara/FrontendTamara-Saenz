# Plan 018: Error reporting con Sentry en el frontend

> **Executor instructions**: Sigue los pasos, verifica cada uno, respeta las STOP conditions.
> Actualiza `plans/README.md` al terminar.
>
> **Drift check**: `git diff --stat 45c4d2c..HEAD -- nuxt.config.ts package.json`

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: FE-017 (el `connect-src` de la CSP en `public/_headers` debe permitir el ingest de Sentry)
- **Category**: dx
- **Planned at**: commit `45c4d2c`, 2026-09-08

## Why this matters

El frontend no reporta errores. Un bug de JS en producción (un `undefined` en el cálculo de un
total, un componente que revienta, un `ErrorMutacionIncierta` mal manejado) solo lo ve el usuario
como una pantalla rota, y el equipo nunca se entera. Sentry captura los errores de Vue, las
promesas rechazadas sin manejar y los errores de red, con la ruta, el navegador y una traza.

## Estado actual

- `package.json`: no tiene `@sentry/*`. Scripts: `build` = `nuxt build`, `generate` = `nuxt generate`.
- `nuxt.config.ts`: `modules: ['@nuxt/ui', '@pinia/nuxt', '@nuxt/eslint']`. `runtimeConfig.public`
  tiene `apiBaseUrl`, `appName`, `appSlogan`.
- No hay `plugins/` con manejo de errores, ni `app:error` hook.
- `composables/useApiFetch.ts` — punto único de las llamadas HTTP; lanza `ErrorMutacionIncierta`
  para mutaciones no idempotentes que fallan por red (plan FE-015, ya en `main`).
- `stores/auth.store.ts` — usa `$fetch` directo para login/refresh/logout.

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Instalar | `npm install @sentry/nuxt` | exit 0 |
| Lint / typecheck | `npm run lint && npm run typecheck` | exit 0 (typecheck: warning `vue-tsc` preexistente tolerado) |
| Build | `npm run generate` | exit 0, genera `.output/public/` |
| Tests | `npm run test` | 22 verde (Sentry inactivo sin DSN) |

## Scope

**In scope**:
- `package.json`
- `nuxt.config.ts` (añadir `@sentry/nuxt/module` a `modules` + bloque `sentry`)
- `sentry.client.config.ts` (crear — config del SDK cliente)
- `public/_headers` (añadir el host de Sentry a `connect-src` de la CSP — lo creó FE-017)
- `README.md` (variable `NUXT_PUBLIC_SENTRY_DSN`), `PRODUCCION.md`, `plans/README.md`

**Out of scope**:
- Backend Sentry — es el plan 019 del repo backend.
- Session Replay (graba la sesión del usuario) — útil pero es cuota; déjalo desactivado o muy bajo.
- Source maps upload a Sentry — es un plus para des-minificar stack traces; se puede añadir después
  con `SENTRY_AUTH_TOKEN` en el build de Cloudflare (documéntalo como follow-up, no lo hagas ahora).

## Git workflow

- Branch: `feat/018-sentry-frontend`
- Conventional commits.

## Steps

### Step 1: Instalar

```bash
npm install @sentry/nuxt
```

**Verify**: `node -e "process.exit(require('./package.json').dependencies['@sentry/nuxt'] ? 0 : 1)"` → exit 0. `npm ci` sigue OK.

### Step 2: Registrar el módulo

En `nuxt.config.ts`:
- Añade `'@sentry/nuxt/module'` al array `modules`.
- Añade `runtimeConfig.public.sentryDsn: process.env.NUXT_PUBLIC_SENTRY_DSN || ''` dentro del
  `runtimeConfig.public` existente.
- Añade un bloque `sentry` a nivel raíz:
  ```ts
  sentry: {
    sourceMapsUploadOptions: { enabled: false }, // activar con SENTRY_AUTH_TOKEN más adelante
  },
  ```

**Verify**: `npm run typecheck` → exit 0 (salvo el warning preexistente). `grep -n "sentry" nuxt.config.ts` → módulo + dsn + bloque.

### Step 3: Config del cliente

Crea `sentry.client.config.ts` en la raíz:
```ts
import * as Sentry from '@sentry/nuxt'

const config = useRuntimeConfig()
const dsn = config.public.sentryDsn

if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.dev ? 'development' : 'production',
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    // No enviar el cuerpo de las peticiones (pueden llevar montos, cédulas).
    sendDefaultPii: false,
    // Ignorar el error "esperado" de mutación incierta (no es un bug, es un aviso al usuario).
    ignoreErrors: ['ErrorMutacionIncierta'],
  })
}
```

> Verifica en la doc de la versión instalada de `@sentry/nuxt` la forma exacta del archivo de
> config del cliente (algunas versiones usan `sentry.client.config.ts` con `useRuntimeConfig`,
> otras un plugin). Si difiere, sigue la doc de esa versión y **STOP y reporta** si el patrón no
> encaja con "init solo si hay DSN".

**Verify**: `npm run generate` → build exitoso, sin errores de Sentry en el log.

### Step 4: Permitir el ingest de Sentry en la CSP

En `public/_headers` (creado por el plan FE-017), en la línea `Content-Security-Policy`, en la
directiva `connect-src`, reemplaza el placeholder `<SENTRY_INGEST>` por
`https://*.ingest.sentry.io` (o el dominio exacto del DSN — la parte antes de `/api/`).

**Verify**: `grep -n "sentry" public/_headers` → aparece en `connect-src`.

### Step 5: Documentar

- `README.md`, sección de variables de Cloudflare Pages: añade `NUXT_PUBLIC_SENTRY_DSN` = *(DSN del proyecto Sentry frontend)*.
- `PRODUCCION.md`, `### OBS-2`: marca `[x]` el sub-ítem del frontend con "→ plan FE-018 (hecho)".

## Test plan

- `npm run test` → 22 verde (Sentry sin DSN no interfiere).
- `npm run generate` → sin errores.
- Prueba manual (opcional, requiere un DSN de prueba): setear `NUXT_PUBLIC_SENTRY_DSN`, `npm run dev`,
  provocar un error (un `throw` en un `onMounted` de una página temporal, o forzar un
  `undefined.foo`), y confirmar que el evento aparece en Sentry con la ruta y el stack.

## Done criteria

- [ ] `grep -n "@sentry/nuxt" nuxt.config.ts` → módulo registrado
- [ ] Existe `sentry.client.config.ts` que hace `init` solo si hay DSN
- [ ] `npm ci && npm run lint && npm run typecheck && npm run generate && npm run test` → todo verde
- [ ] Sin `NUXT_PUBLIC_SENTRY_DSN`, `npm run dev` arranca sin errores de Sentry
- [ ] `public/_headers` permite el host de Sentry en `connect-src`
- [ ] `git status` sin archivos fuera de "In scope"
- [ ] `plans/README.md` fila 018 y `PRODUCCION.md` OBS-2 actualizados

## STOP conditions

- `@sentry/nuxt` requiere `ssr: true` o un runtime de servidor para funcionar (algunas versiones
  tienen un `sentry.server.config.ts` obligatorio) — con `ssr: false` (plan FE-017) solo se
  necesita el cliente; si el módulo se queja de que falta la config de servidor, busca la opción
  para desactivar la parte server y **reporta** si no la hay.
- El módulo de Sentry rompe el build de `cloudflare-pages` (preset de Nitro) — reporta el error exacto.
- El API del SDK no coincide con los excerpts — sigue la doc de la versión instalada y reporta la diferencia.

## Maintenance notes

- Revisor: confirmar `sendDefaultPii: false`, `ignoreErrors: ['ErrorMutacionIncierta']`, y que
  `replaysSessionSampleRate: 0` (no grabar sesiones por defecto — es un ERP con datos financieros).
- Follow-up: subir source maps a Sentry en el build de Cloudflare (`SENTRY_AUTH_TOKEN` +
  `sourceMapsUploadOptions.enabled: true`) para des-minificar los stack traces de producción.
- Integrar con el `x-request-id` del backend (plan 020 del backend) cuando exista: mandar el
  header desde `useApiFetch` y adjuntarlo como tag en Sentry para correlacionar front y back.
