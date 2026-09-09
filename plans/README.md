# Implementation Plans — Frontend Tamara & Saenz

Generados por la skill `improve` el 2026-09-03, tras la ronda 1 de correcciones de auditoría
(rama `correccion-hallazgos-auditoria`, ya mergeable). Cubren lo que quedó **fuera** de esa
ronda, más lo que el dueño pidió después (resiliencia de sesión + borradores de formulario).

Cada ejecutor: lee el plan completo antes de empezar, respeta sus STOP conditions, actualiza tu
fila al terminar. Los planes son auto-contenidos.

**Planned against commit**: `53e3e19` (planes 002–013, ronda 2) · `4d429b8` (planes 014–016, ronda 3).

## Orden de ejecución y estado

| Plan | Título | Prioridad | Esfuerzo | Riesgo | Depende de | Estado |
|------|--------|-----------|----------|--------|------------|--------|
| ~~001~~ | ~~`restaurar()` tolera un `localStorage` corrupto~~ | — | — | — | — | **REEMPLAZADO por 004** (su fix es el Step 1 de 004) |
| 002 | Descargas de PDF/Excel renuevan el token si expiró | P2 | S | LOW | — | **DONE** (commit `4ac3594`) |
| 003 | Limpieza de documentación del frontend | P3 | S | LOW | — | **DONE** (commit `eb67d0a`) |
| 004 | Resiliencia de sesión (corte de red no te echa al login) | P1 | M | MED | — | **DONE** (commit `324385c`) |
| 005 | Borradores de formulario (no perder lo escrito) | P1 | M | MED | — | **DONE** (commit `4c30fdd`) |
| 006 | Columna Cliente ausente en el listado de Novedades (ronda 2) | P2 | S | LOW | BE-010 | **DONE** (commit `8a9132a`) |
| 007 | Transición de navegación global entre páginas (ronda 2, UX) | P3 | S | LOW | — | **DONE** (commit `6d576bb`) |
| 008 | Skeleton loader reutilizable (ronda 2, UX) | P2 | M | LOW | — | **DONE** (commit `a6fd417`) |
| 009 | `<Transition>` interna en 2 modales calculando→resultado (ronda 2, UX) | P3 | S | LOW | — | **DONE** (commit `6d1950b`) |
| 010 | `<TransitionGroup>` en 3 formularios con filas dinámicas (ronda 2, UX) | P3 | S | LOW-MED | — | **DONE** (commit `e4953e7`) |
| 011 | Jerarquía visual por color en `ConfirmModal.vue` (ronda 2, UX) | P3 | S | LOW | — | **DONE** (commit `2ac8f49`) |
| 012 | La tabla de Novedades exigía scroll horizontal (ronda 2, ad-hoc) | P3 | S | LOW | — | **DONE** (commit `f8409da`) |
| 013 | Transición en `SharedStatusBadge` al cambiar de valor (ronda 2, UX) | P4 | S | LOW | — | **DONE** (commit `d8177bf`) |

Valores de estado: TODO · IN PROGRESS · DONE · BLOCKED (razón) · REJECTED (motivo) · REEMPLAZADO.

Los planes vivos (002, 003, 004, 005) son **independientes** (tocan archivos distintos). Orden
sugerido por prioridad: 004 → 005 → 002 → 003.

## Notas de dependencia

- **004** absorbe al antiguo **001** (el guard de `restaurar()` es su Step 1). No ejecutes 001
  por separado.
- **004** (frontend) empareja con el plan **006 del repo backend** (sesión de 1 día): 006 acorta
  la sesión a ~1 día, 004 hace que un corte de red no la termine antes de tiempo. Desplegar juntos.
- **002** (descargas con refresh de token) y el plan **001 del backend** (errores 503): al
  mergear ambos, `useApiFetch` ya reintenta descargas ante 502/503/504 (el plan 004 lo contempla).
- **004** y **005** son complementarios pero **no** dependen entre sí: 004 evita que te saquen,
  005 evita que pierdas lo escrito si aun así se recarga la página.

---

## Ronda 3 — auditoría 2026-09-05 (primera tanda: seguridad y configuración)

Generados por `improve` tras la auditoría exhaustiva de las 4 dimensiones. Primera tanda "limpia":
solo seguridad/config, esfuerzo S–M, riesgo LOW–MED, **sin decisiones de negocio**.

| Plan | Título | Prioridad | Esfuerzo | Riesgo | Depende de | Estado |
|------|--------|-----------|----------|--------|------------|--------|
| — | **PASO 0** — Merge de las ramas de corrección a `main` (coordinado) | P0 | S | MED | — | **DONE** (merge `61505a8`; ver `BackendTamara-Saenz/plans/012`) |
| 014 | Remediación de dependencias vulnerables + eliminación de deps muertas `exceljs`/`file-saver` (S-4, A-5) | P2 | S | LOW | 012 | **DONE parcial** (2026-09-09) — deps muertas fuera + `overrides` js-yaml/svgo + `npm audit` en CI. **Pinia `^2`→`^4` (para `.nvmrc` LTS) queda para FE-014b.** |
| 015 | `useApiFetch` no debe reintentar mutaciones no idempotentes ante fallo de red (S-6) | P1 | S–M | MED | 012 | **DONE** |
| 016 | `pages/login.vue` sin fuga de credenciales por envío pre-hidratación (S-5) | P1 | S | LOW | 012 | **DONE** |

---

## Ronda 4 — Bloqueantes de producción (2026-09-08, stack: Railway + Cloudflare)

Generados por `improve` (variante `plan`) a partir de `BackendTamara-Saenz/PRODUCCION.md`.
**Planned against commit `45c4d2c`.** Deploy: frontend en **Cloudflare Pages** (SPA estática),
backend + MySQL 8 en **Railway**.

| Plan | Título | Prioridad | Esfuerzo | Riesgo | Depende de | Estado |
|------|--------|-----------|----------|--------|------------|--------|
| 017 | Configurar el despliegue en Cloudflare Pages (`ssr: false` + preset) + cabeceras de seguridad (`public/_headers`) | P1 | M | LOW-MED | — | **DONE** (2026-09-09) — output `dist/`; `_redirects` SPA; `.nvmrc`=24 |
| 018 | Error reporting con Sentry en el frontend | P1 | S | LOW | 017 (CSP `connect-src`) | **DONE** (2026-09-09) — `@sentry/vue` (no `@sentry/nuxt`, SPA); plugin `.client` gateado por DSN |
| 019 | Eliminar el "dinero como string" del frontend (D-1) — quitar `Number()` disperso y uniones `number \| string` | P2 | M | LOW-MED | **plan 021 del repo backend** | **TODO** |

### Orden y dependencias (ronda 4)

- ~~**017**~~ · ~~**018**~~ **HECHOS** (2026-09-09).
- **019** NO debe ejecutarse hasta que el **plan 021 del repo backend** (transformer `decimal ↔ number`,
  ya MERGEADO 2026-09-09) esté **DESPLEGADO** — antes de eso, el API prod devuelve montos como string
  y quitar los `Number()` rompería las sumas. El Paso 0 del plan 019 lo verifica con `curl`.
  **Bloqueado hasta el primer deploy del backend.**

### Ejecución de 017 (2026-09-09, rama `deploy/017-cloudflare-headers`)

- `nuxt.config.ts`: `ssr: false` + `nitro.preset: 'cloudflare-pages'`.
- **Nuxt 4 genera el output en `dist/`** (no `.output/public/` como asumía el plan). `npm run generate`
  produce `dist/{index.html,200.html,404.html,_nuxt/,_headers,_redirects,_routes.json}`.
- **`public/_redirects` = `/*  /index.html  200`** (nuevo): sin esto Nitro emite `/* /404.html 404`
  y los deep links de la SPA (`/contratos/123`) devolvían 404. Verificado en navegador: `/contratos/nuevo`
  entrado directo → sirve el shell y el router de Vue toma el control (redirige a login sin token). ✓
- `public/_headers` (nuevo): CSP + HSTS + `X-Frame-Options: DENY` + `X-Content-Type-Options` +
  `Referrer-Policy` + `Permissions-Policy`. `connect-src` con placeholders `.example` (comentario `#`
  arriba + paso en el README) para el backend y Sentry. `script-src 'unsafe-inline'` = concesión
  conocida (Nuxt inyecta el payload de hidratación inline; Pages estático no puede poner nonce).
- `.nvmrc` = **`24`** (no `20`): el lockfile no resuelve con npm ≤ 10; mismo motivo que el CI.
  `engines.node` = `>=20` (piso blando). FE-014 (regenerar lock) permitirá bajar.
- `package.json` `engines`, README sección "Despliegue (Cloudflare Pages)".
- Verificado: `npm ci` + `npm run lint` + `npm run typecheck` + `npm run test` (22) + `npm run generate`
  + preview en navegador (login renderiza, `@nuxt/ui` OK, sin errores JS/hidratación; los
  `ERR_CONNECTION_REFUSED` al API son esperados sin backend). Deep link con `serve -s` → 200.

### Ejecución de 018 (2026-09-09, rama `feat/018-sentry-frontend`)

- **`@sentry/vue` en vez de `@sentry/nuxt`**: `@sentry/nuxt` envuelve `@sentry/node` para el
  servidor, que en una SPA estática (`ssr: false`) + preset `cloudflare-pages` no existe y choca.
  `@sentry/vue` directo es el camino correcto para cliente-only.
- **Versión pineada a `10.73.0`** (exacta, no `^`): `@sentry/nuxt`/`@sentry/vue` `10.74.0` está
  **roto en el registro** (depende de `@sentry/browser@10.74.0`, que no está publicado). Matchea
  `@sentry/nestjs@10.73.0` del backend.
- `plugins/sentry.client.ts` (`.client` → nunca corre en SSR): `defineNuxtPlugin({ enforce: 'pre' })`,
  `Sentry.init` **solo si `NUXT_PUBLIC_SENTRY_DSN`**. `app: nuxtApp.vueApp` + `browserTracingIntegration({ router })`.
  `replaysSessionSampleRate: 0`, `sendDefaultPii: false`, `ignoreErrors: ['ErrorMutacionIncierta']`.
- `nuxt.config.ts`: `runtimeConfig.public.sentryDsn`.
- `public/_headers`: `connect-src` gana `https://*.ingest*.sentry.io` (+ regionales us/de) y
  `worker-src 'self' blob:`.
- **CI del frontend NO corre `npm audit`** — las 5 vulnerabilidades pre-existentes (`@nuxt/ui`
  S-5, `exceljs`/`uuid` muertos, `js-yaml`, `svgo`) son de FE-014, no de este plan (Sentry añade 0).
- Verificado: `npm ci` + lint + typecheck + test (22) + `npm run generate` (sin errores de Sentry).

### Ejecución de 014 (2026-09-09, rama `chore/fe-014-deps`) — PARCIAL

- **`exceljs` + `file-saver` eliminados** (dead deps confirmados: `grep` de imports → 0). Mata las
  moderadas de `exceljs`/`uuid`.
- **`overrides`** `js-yaml: ^4.3.2` (dev, vía `@nuxt/eslint`→typegen) y `svgo: ^4.1.0` (dev, vía
  `nuxt`→vite-builder→cssnano). Ambos advisories `high` publicados hacia 2026-09-09 — deps de
  build, no runtime-reachable. `npm audit` → **1 moderada** (`@nuxt/ui`, aceptada), 0 high/critical.
- **`.github/workflows/ci.yml`**: paso `npm audit --audit-level=high` tras `npm ci`.
- `@nuxt/ui` moderada documentada como aceptada en el README (no migrar a v4 ahora; `pages/login.vue`
  ya cubrió el riesgo real en FE-016). README: reportes .xlsx los genera el backend.
- Verificado: `npm ci` + lint + typecheck + build + test (22) + `npm audit --audit-level=high` (exit 0).
- **NO hecho — FE-014b**: subir `pinia ^2` → `^4` + `@pinia/nuxt` `^0.5` → `^1` (el `nuxt@4.5`
  bundlea `vue-router@5`, cuyo peer opcional pide `pinia 3||4`; por eso `npm ci` solo resuelve con
  npm 11 / Node 24 y `.nvmrc` no puede bajar a LTS). Es un major de Pinia (1 solo store,
  `auth.store.ts`, con test) — riesgo bajo pero es cambio de major: merece OK del dueño y su PR.

### Emparejamiento con el backend

- **017** ↔ **plan 015 del backend** (Railway): `NUXT_PUBLIC_API_BASE_URL` = dominio de Railway;
  `CORS_ORIGIN` del backend = dominio de Cloudflare Pages.
- **017** (`_headers`) ↔ **plan 018 del backend** (CSP): misma tanda de hardening de cabeceras.
- **018** (Sentry FE) ↔ **plan 019 del backend** (Sentry BE).
- **019** ← **plan 021 del backend** (dependencia dura).

### Ejecución de 015 y 016 (2026-09-07, rama `fe15-useapifetch-mutaciones`)

**FE-015 (S-6 — doble cobro):** `useApiFetch` gana `esReintentable(options)`: ante un fallo de red
solo reintenta GET/HEAD/OPTIONS o lo marcado `idempotente: true`. Una mutación no idempotente que
falla por red lanza `ErrorMutacionIncierta` (exportada) sin reintentar. `/recaudo/pagos/simular` y
`/obligaciones/generar-canones` (en `recaudo` y `configuracion`) marcados `idempotente: true`.
`recaudo` (registrarPago, liquidarDeposito) y `contratos/nuevo` muestran "verificá antes de
reintentar" (aviso ámbar, no error rojo) ante `esMutacionIncierta`. Nuevo `tests/use-api-fetch.spec.ts`
(7 casos; `$fetch` se mockea con `mockNuxtImport`, no `stubGlobal`). El reintento tras 401 no cambia.

**FE-016 (S-5 — credenciales en la URL):** `pages/login.vue` — el `<form>` gana `method="post"`
(fallback antes de hidratar → POST, no GET con `?password=` en la URL) y el botón submit queda
`:disabled="!montado"` hasta `onMounted`. `@submit.prevent` intacto para el flujo hidratado normal.

> **CI del frontend añadido en el PASO 0** (`.github/workflows/ci.yml`, commits `c39f065`/
> `9af3e09`/`72c1811`; hallazgo S-11 parcialmente cerrado). Corre `npm ci` + `nuxt prepare` +
> lint + typecheck + build + test en push/PR a `main`, con **Node 24** (npm 11) porque el
> lockfile no resuelve con npm 10. Primer run verde: `34077294907`.

Hallazgos cubiertos: **S-6** doble cobro por reintento de POST · **S-5** credenciales en la URL
por GET pre-hidratación · **S-4** 3 vulnerabilidades de deps · **A-5** `exceljs`/`file-saver`
sin usar.

### Notas de dependencia (ronda 3)

- El **merge de esta rama a `main`** se coordina con el del backend — está descrito en
  `BackendTamara-Saenz/plans/012` (Pasos 2, 3, 6, 7). No hay un plan 013 nuevo en este repo:
  013 ya existe (ronda 2). La primera tanda de ronda 3 arranca en **014**.
- **014, 015, 016 son independientes entre sí** (tocan `package.json` / `useApiFetch.ts` /
  `login.vue` respectivamente).
- **014** empareja con el plan **014 del backend** (misma higiene de dependencias; desplegar juntos).
- **015** complementa el plan **001 del backend** (BD transitoria → 503) — ver sus Notas.
- **016** cubre el riesgo real detrás del advisor `@nuxt/ui <4.8.1` que **014** documenta como aceptado.

### Hallazgos de la ronda 3 NO incluidos en esta tanda (frontend)

| Hallazgo | Sev | Por qué no ahora |
|---|---|---|
| **A-2** ~13 sitios con enums de negocio duplicados (`['EFECTIVO','TRANSFERENCIA']` en 7 archivos, etc.) | MED | Extraer a `useEnums`/constantes. Bajo riesgo; va junto con el tipado compartido. Ya estaba en "NO planeados" de la ronda 2 — la ronda 3 confirma que creció. |
| **A-4** `useListadoPaginado` doble `cargar()` + sin guarda de respuesta obsoleta | LOW | Ya en "NO planeados" de la ronda 2. Plan propio con test. |
| **D-1** El FE absorbe el dinero-como-string con `Number()` disperso y uniones `number \| string` | MED | El fix real es del backend (transformer decimal↔number) + tipos generados. Plan de backend + siguiente tanda. |
| **P-6** Todo el fetching es cliente (0 `useAsyncData`); el SSR renderiza cáscaras skeleton | — | Sugerencia de arquitectura: evaluar `ssr: false` (SPA). Decisión del dueño, plan/spike aparte. |
| **P-7** Dashboard dispara ~6 requests en `onMounted` | LOW | Endpoint de agregación en el backend. Plan aparte. |
| **Refetch dentro del `try` de la mutación** en 8 páginas | MED | Ya en "NO planeados" de la ronda 2. Mecánico pero merece revisión página por página. |
| **Sin CSP / cabeceras** en `nuxt.config.ts` (tokens en `localStorage`) | MED | Ya en "NO planeados" de la ronda 2. Va en pareja con Helmet del backend. |

## Hallazgos considerados y NO planeados en esta tanda

Reales, dejados fuera por decisión del dueño:

| Hallazgo | Por qué no ahora |
|---|---|
| **Sin CSP ni cabeceras de seguridad en `nuxt.config.ts`** (tokens en `localStorage` → riesgo XSS) | M, riesgo MED. Requiere `routeRules` de Nitro o el módulo `nuxt-security` + probar que no rompe `@nuxt/ui` ni el `<img src>` del logo cross-origin. Va en pareja con el plan 004 del backend (Helmet). Plan propio. |
| **Patrón "refetch dentro del `try` de la mutación"** en `caja`, `movimientos`, `depositos`, `recibos/[id]`, `novedades` (3×), `administracion` (3×) | M. Ya se arregló en `recaudo/index.vue` (ronda 1, hallazgo B2a) con el helper `refrescarTrasOperacion`. Replicar a las otras 8 páginas es mecánico pero merece revisión página por página. Plan propio. |
| **51 usos de `any` en 8 módulos financieros** | L. La solución real es generar tipos desde el OpenAPI del backend — sin eso, tipar a mano se desactualiza. Bloqueado por la decisión de arquitectura de tipos compartidos. |
| **~13 sitios con enums de negocio duplicados** como arrays de strings | M. Extraer a un módulo de constantes/`useEnums`. Bajo riesgo, valor medio; va junto con el tipado. |
| **Cobertura de tests: 1 solo spec trivial** | L. El de mayor valor a mediano plazo. Requiere montar infra de test de composables/stores (los planes 001/004/005 la inician con `auth-store.spec` y `use-borrador.spec`) y luego la batería de recaudo. Proyecto en sí. |
| **`useListadoPaginado`: doble `cargar()` al cambiar filtros con página ≠ 1; sin guarda de respuesta obsoleta** | M, riesgo MED (toca el composable que usan casi todos los listados). Parpadeo ocasional, no corrupción. Plan propio con test. |
| **Comentario obsoleto en `middleware/auth.global.ts:23` + `pages/index.vue` redundante** | Trivial. Se pliega en cualquier plan que toque el middleware. |
| **Pestaña "Recibos de caja" visible a Recepcionista en `/recibos`** | S. Es intencional (listado dual-rol), pero la pestaña de caja queda vacía para Recepcionista. Fix menor: ocultarla cuando `!auth.esAdministrador`. Plan propio pequeño. |
| **Módulo Propietarios sin UI** (`inmuebles` nunca envía `propietarioId`) | L. **Bloqueado por decisión de negocio §I** (¿se construye el módulo de cuenta del propietario?). No planeable hasta que el dueño responda. |

## Decisiones de negocio pendientes (para el dueño)

Ver el `plans/README.md` del repo backend para la lista completa (D11 permisos Recepcionista,
§I propietarios/comisiones, §A fechas de pago, §C medios de pago, §D terminación). Bloquean
funcionalidad futura del frontend (sobre todo la UI de Propietarios y cualquier cambio al motor
de fechas de canon).
