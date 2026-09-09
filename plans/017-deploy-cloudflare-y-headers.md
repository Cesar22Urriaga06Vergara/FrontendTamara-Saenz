# Plan 017: Configurar el despliegue en Cloudflare Pages + cabeceras de seguridad

> **Executor instructions**: Sigue los pasos, verifica cada uno, respeta las STOP conditions.
> Al terminar actualiza `plans/README.md`.
>
> **Drift check**: `git diff --stat 45c4d2c..HEAD -- nuxt.config.ts package.json public/`

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW-MED (cambia el target de build de Nuxt; hay que probar el output)
- **Depends on**: none. Empareja con el plan 015 del backend (Railway) — el `CORS_ORIGIN` del
  backend tiene que ser el dominio que resulte de este plan.
- **Category**: dx / security
- **Planned at**: commit `45c4d2c`, 2026-09-08

## Why this matters

El frontend nunca se ha desplegado. El dueño eligió **Cloudflare Pages**. Hoy:
- `nuxt.config.ts` no fija ningún preset de Nitro → `nuxt build` produce el output de Node por
  defecto, que no es lo que Cloudflare Pages sirve.
- `nuxt.config.ts` no tiene **ninguna cabecera de seguridad** (hallazgo S-2 / SEC-2). Con los
  tokens JWT en `localStorage`, la falta de CSP amplía la superficie de un XSS.
- No hay pin de versión de Node (`engines` / `.nvmrc`) — el CI de Pages podría usar una versión
  distinta a la del CI de GitHub (que usa Node 24).

Este plan deja el repo **listo para conectar a Cloudflare Pages** (el operador hace la conexión
del repo en el dashboard de Cloudflare).

## Estado actual

- `nuxt.config.ts`: `defineNuxtConfig({ compatibilityDate: '2026-01-01', devtools: {...}, modules: ['@nuxt/ui','@pinia/nuxt','@nuxt/eslint'], css: ['~/assets/css/main.css'], runtimeConfig: { public: { apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3010/api/v1', appName: ..., appSlogan: ... } }, ui: { global: true }, colorMode: {...}, app: { head: {...}, pageTransition: {...} } })`.
  **No hay `nitro`, `routeRules`, ni `ssr`.**
- `package.json`: scripts `build` = `nuxt build`, `generate` = `nuxt generate`, `preview` = `nuxt preview`. **No `engines`.**
- `.github/workflows/ci.yml`: `node-version: '24'`, corre `npm ci` → `nuxt prepare` → lint → typecheck → build → test.
- `public/`: contiene `Logo.png` (assets estáticos servidos tal cual).
- No hay `public/_headers`, `.nvmrc`, `wrangler.toml`.
- Todo el data-fetching es del lado cliente (no hay `useAsyncData`) — el SSR solo renderiza
  cáscaras skeleton (hallazgo P-6).

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Instalar | `npm ci` | exit 0 |
| Lint / typecheck | `npm run lint && npm run typecheck` | exit 0 (typecheck: 1 warning `vue-tsc` preexistente tolerado) |
| Build (SPA) | `npm run generate` | genera `.output/public/` con `index.html` + assets |
| Preview local | `npx serve .output/public` (o `npm run preview`) | la app carga y el login funciona contra un backend |
| Tests | `npm run test` | 22 verde |

## Scope

**In scope**:
- `nuxt.config.ts` (añadir `ssr: false` + `nitro.preset` + `routeRules` de headers, o `public/_headers`)
- `public/_headers` (crear — cabeceras de seguridad de Cloudflare Pages)
- `package.json` (`engines`)
- `.nvmrc` (crear)
- `README.md` (sección Despliegue), `PRODUCCION.md`, `plans/README.md`

**Out of scope**:
- Migrar el fetching a `useAsyncData` / evaluar SSR real — este plan hace **SPA** (`ssr: false`),
  que es lo más simple y coherente con P-6 (ya todo es cliente). SSR en Workers es un spike aparte.
- `stores/auth.store.ts` — cómo se guardan los tokens no cambia aquí.
- El backend — su deploy es el plan 015 del repo backend.

## Git workflow

- Branch: `deploy/017-cloudflare-headers`
- Conventional commits.

## Steps

### Step 1: Pasar la app a SPA y fijar el preset de Cloudflare

En `nuxt.config.ts`, añade al objeto de config:
```ts
ssr: false,
nitro: {
  preset: 'cloudflare-pages',
},
```

> `ssr: false` + `cloudflare-pages` produce un sitio **estático** (`.output/public/`) que Pages
> sirve desde su CDN, sin Workers. Es el camino sin sorpresas: no hay APIs de Node en runtime, no
> hay límites de tamaño de Worker, el fetching ya era todo cliente.

**Verify**: `npm run generate` → termina con "✔ ... prerendered" y existe `.output/public/index.html`.
`npx serve .output/public -l 4173` y abrir `http://localhost:4173` → la app carga (mostrará error
de red al llamar al API si no hay backend — es esperado; lo que se valida es que el HTML/JS carga).

### Step 2: Cabeceras de seguridad — `public/_headers`

Crea `public/_headers` (Cloudflare Pages lo lee automáticamente):
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://<BACKEND_DOMAIN> https://<SENTRY_INGEST>; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

> - `script-src 'unsafe-inline'`: Nuxt inyecta el payload de hidratación como script inline. Sin un
>   nonce (que Pages estático no puede generar por request) hace falta. Es aceptable para un ERP
>   interno tras login; documéntalo.
> - `connect-src` debe listar el dominio del **backend en Railway** y el **ingest de Sentry** (si
>   se hace el plan 018). Déjalos como placeholders `<BACKEND_DOMAIN>` / `<SENTRY_INGEST>` y añade
>   una nota en el README de que hay que reemplazarlos con los dominios reales antes del primer deploy.
> - `img-src ... https:`: el logo de empresa se sirve desde el backend (`/uploads/empresa/...`),
>   otro origen.

**Verify**: `cat public/_headers` muestra el bloque. Tras `npm run generate`,
`cat .output/public/_headers` → el archivo se copió al output.

### Step 3: `engines` y `.nvmrc`

En `package.json`, después de `"private": true`:
```json
"engines": { "node": ">=20" },
```
> El CI de GitHub usa Node 24 (por el problema de `npm ci` con npm 10, ver plan FE-014). Cloudflare
> Pages permite fijar la versión con `.nvmrc` o la variable `NODE_VERSION`. Usa `.nvmrc` con `20`
> **solo si** el `npm ci` de Pages funciona; si falla igual que en GitHub con npm 10, usa `22`.
> Prueba local: `npm ci` con Node 20 → si falla con `Missing: pinia@...`, pon `.nvmrc` = `22` y
> añade una nota de que el plan FE-014 debe regenerar el lockfile para poder bajar a 20.

Crea `.nvmrc` con una línea: `20` (o `22`, según lo anterior).

**Verify**: `node -e "process.exit(require('./package.json').engines?.node ? 0 : 1)"` → exit 0. `cat .nvmrc`.

### Step 4: Documentar el despliegue

En `README.md`, sección `## Despliegue (Cloudflare Pages)`:
```markdown
## Despliegue (Cloudflare Pages)

App SPA estática (`ssr: false`, ver `nuxt.config.ts`). Cloudflare Pages sirve `.output/public/`.

### Configuración en el dashboard de Cloudflare Pages
- Framework preset: **Nuxt** (o "None" con build command manual)
- Build command: `npm run generate`
- Build output directory: `.output/public`
- Node version: la de `.nvmrc`
- Variables de entorno de build:
  - `NUXT_PUBLIC_API_BASE_URL` = `https://<servicio-backend>.up.railway.app/api/v1`
  - `NUXT_PUBLIC_APP_NAME` = `Inversiones Tamara & Saenz S. En C.` (opcional)
  - `NUXT_PUBLIC_APP_SLOGAN` = `Resolvemos tu situacion` (opcional)

### Antes del primer deploy
1. En `public/_headers`, reemplazar `<BACKEND_DOMAIN>` con el dominio real del backend en Railway
   y `<SENTRY_INGEST>` con el del proyecto Sentry (o quitar esa parte si no se usa Sentry aún).
2. En el backend (Railway), setear `CORS_ORIGIN` = el dominio de Cloudflare Pages (sin barra final).
3. Configurar el dominio propio en Cloudflare (DNS + Pages custom domain).
```

En `PRODUCCION.md`:
- `### DEPLOY-1`, sub-ítems del frontend (Nitro preset, SSR vs SPA → SPA) → `[x]` "→ plan FE-017".
- `### SEC-2`, sub-ítem "cabeceras de seguridad del frontend" → `[x]` "→ plan FE-017".

**Verify**: `grep -c "Cloudflare Pages\|_headers\|NUXT_PUBLIC_API_BASE_URL" README.md` → ≥ 3.

## Test plan

No hay lógica nueva. Verificación:
- `npm run lint && npm run typecheck && npm run test` → sin cambios (22 verde).
- `npm run generate` → `.output/public/` con `index.html`, `_headers`, y `_nuxt/` assets.
- `npx serve .output/public` → la app monta en el navegador (revisa la consola: no debe haber
  errores de JS; los errores de red al API son esperados sin backend).
- Opcional: `npx wrangler pages dev .output/public` para simular Pages localmente y verificar que
  `_headers` se aplica (mirar las response headers en DevTools).

## Done criteria

- [ ] `grep -n "ssr: false\|cloudflare-pages" nuxt.config.ts` → ambos presentes
- [ ] `npm run generate` produce `.output/public/index.html` y `.output/public/_headers`
- [ ] `public/_headers` tiene CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- [ ] `npm run lint && npm run typecheck && npm run test` → exit 0, 22 verde
- [ ] `package.json` tiene `engines.node`; existe `.nvmrc`
- [ ] `git status` sin archivos fuera de "In scope"
- [ ] `plans/README.md` fila 017 y `PRODUCCION.md` DEPLOY-1/SEC-2 actualizados

## STOP conditions

- `npm run generate` falla con `ssr: false` por algún componente que usa APIs de servidor — busca
  el error, y si es un `useAsyncData`/`useFetch` con `{ server: true }` explícito, reporta.
- Algún `@nuxt/ui` componente deja de renderizar en SPA (no debería — `@nuxt/ui` v2 es cliente-first).
- El `npm ci` de Cloudflare Pages falla con el mismo `Missing: pinia@...` que el CI de GitHub con
  npm 10 y subir el `.nvmrc` a `22` no lo arregla — coordina con el plan FE-014 (regenerar lockfile).
- La CSP rompe `@nuxt/ui` (estilos) o la carga del logo — afloja SOLO la directiva que el error del
  navegador señale, documentándolo.

## Maintenance notes

- Revisor: confirmar que `connect-src` de la CSP lista el backend y Sentry, y nada más amplio.
- Si algún día se necesita SSR real (SEO no aplica a un ERP tras login, así que probablemente no),
  cambiar a `ssr: true` + preset `cloudflare-pages` con Workers y revisar límites.
- `_headers` es específico de Cloudflare Pages; si se cambia de host, migrar a la config equivalente.
- El `'unsafe-inline'` en `script-src` es la concesión conocida; si Nuxt/Nitro soporta CSP con
  nonce en Pages en el futuro, endurecerlo.
