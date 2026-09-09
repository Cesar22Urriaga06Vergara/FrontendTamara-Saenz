# Frontend — Inversiones Tamara & Saenz S. En C. (ERP Inmobiliario)

Nuxt 4 + Vue 3 + Nuxt UI (v2) + Pinia (RBAC).

## ✅ Verificado end-to-end (13 de agosto de 2026)

Se corrió `npm install` real y `npx nuxt build` real contra este código — no es texto sin
probar. Se encontró y corrigió **1 bug de integración real**:

- **Conflicto de Tailwind**: el `nuxt.config.ts` original declaraba `@nuxtjs/tailwindcss` Y
  `@nuxt/ui` como módulos separados. `@nuxt/ui` (v2.22.3, la versión que instala `^2.17.0`)
  ya incluye y gestiona su propio pipeline de Tailwind v3 internamente — declarar el módulo
  de Tailwind aparte generaba un error de build (`Rolldown failed to resolve import
  '#tailwind-config/theme/colors'`). Se quitó `@nuxtjs/tailwindcss` de `package.json` y de
  `modules` en `nuxt.config.ts`; `@nuxt/ui` se encarga de todo.

**Nota sobre versiones de Nuxt UI**: el super-prompt original pedía "Tailwind CSS 4", pero
`@nuxt/ui` v2 (con el que están escritos todos los componentes: `UTable` con slots
`#col-data`, `UFormGroup`, `USelectMenu`, etc.) usa Tailwind v3 internamente. La v3 de
`@nuxt/ui` sí usa Tailwind v4, pero cambia la API de varios componentes (`UFormGroup` →
`UFormField`, `UTable` usa slots `#col-cell` en vez de `#col-data`, entre otros). Migrar a
esa versión implicaría reescribir las tablas y formularios de todas las páginas. Se dejó
en v2 (estable, Tailwind v3) para no romper el código ya escrito y probado. Si prefieres
Tailwind v4 real, avísame y hago la migración completa a Nuxt UI v3.

Después del fix, `npx nuxt build` genera el bundle completo sin errores, y el servidor de
producción (`node .output/server/index.mjs`) responde correctamente: `/login` da `200`,
`/dashboard` redirige `302` a login por el middleware de auth (sin sesión), sin errores 500.

## Incluido en esta entrega (Fase 1)
- Identidad visual completa (paleta corporativa, slogan, formato CO de moneda/fecha).
- `login.vue`: split-screen con branding.
- Store de autenticación (`auth.store.ts`) con JWT + refresh token + RBAC por rol.
- Middleware global que protege rutas y oculta/bloquea las exclusivas de Administrador
  (Recaudo, Reportes, Administración) para el rol Recepcionista.
- Sidebar con el menú oficial (GENERAL, OPERACIÓN, DIRECTORIOS, CONSULTA Y CONTROL, ADMINISTRACIÓN),
  filtrado dinámicamente según el rol.
- Composables: `useApiFetch` (con manejo de 401/refresh), `usePdfDownload`, `useExcelExport`, `useFormatoCO`.
- Páginas: `dashboard`, `inmuebles` (tabla filtrable por barrio/estado), `contratos`
  (tabla filtrable por cédula/nombre, barrio, rango de fecha inicio, estado), `novedades`
  (tabla filtrable por barrio/estado/fecha + punto de aprobación financiera visible solo a Admin).

### Pendientes de fases siguientes
Ninguno. Las dos notas que estaban aquí (selector de contrato en `/novedades/nueva` y
filtros de rango de fecha en `/auditoria`) ya estaban implementadas en el código — se
verificó en navegador el 2026-08-20 (Chrome real, sesión de Administrador): `/novedades/nueva`
muestra el campo "Contrato relacionado (opcional)" con los contratos del inmueble seleccionado
en cuanto se elige un inmueble, y `/auditoria` filtra en servidor por rango `desde`/`hasta`
con inputs de fecha nativos y botón "Limpiar filtros". Esta sección solo no se había
actualizado tras implementarlos.

## Reglas de negocio confirmadas 2026-08-18 — RBAC Recepcionista vs Administrador
Ver detalle completo en `README.md` del backend y en `ARCHITECTURE_AND_AUDIT.md` (raíz de cada repo)
(AUD-002, AUD-007, AUD-035 a AUD-037). Regla general: **lo operativo/técnico es de
Recepcionista, lo contable es exclusivo de Administrador**. Recaudo, Reportes, Administración
y la ficha de recaudo del contrato siguen exclusivos de Administrador (sin cambio). Ya
implementado en este frontend:
- `pages/inmuebles/index.vue`: "Nuevo inmueble" y "Editar" visibles para cualquier usuario
  autenticado; el backend controla el acceso real (AUD-036).
- `pages/contratos/index.vue`: columna de acciones con "Reactivar"/"Terminar"
  (según el estado del contrato), con modal de motivo/fecha para terminar, y
  confirmación (`UiConfirmModal`) para reactivar. Accesible a Recepcionista y Administrador
  (AUD-035).
- `pages/novedades/index.vue`: botón "Recibo" que descarga el recibo de reporte de novedad
  (`GET /documentos/novedades/:id/pdf`) vía `usePdfDownload`, accesible a Recepcionista y
  Administrador (AUD-037).

## Fase 3 (2026-08-18) — cerrada (AUD-022 a AUD-029)

- `composables/useApiFetch.ts`: reintenta la petición original una vez tras renovar sesión por
  401, en vez de dejar que el error se propague igual (AUD-023).
- Manejo de errores (`error` ref + `UAlert`) agregado en `administracion`, `configuracion`,
  `clientes`, `codeudores`, `recaudo`, `dashboard`, `reportes` y `auditoria` — antes fallaban en
  silencio ante cualquier error del backend (AUD-022).
- `components/layout/Sidebar.vue`: se retiró "Buscador Global" (enlace roto a una ruta
  inexistente); se agregó "Movimientos" (`soloAdmin`) (AUD-024, AUD-029).
- `clientes/index.vue` y `codeudores/index.vue`: acciones de Editar/Baja/Reactivar ocultas para
  Recepcionista con `v-if="auth.esAdministrador"` (AUD-025).
- `novedades/nueva.vue`: el selector de contrato relacionado ahora filtra por `inmuebleId` en
  vez de `barrio` + `limit=5` (AUD-026).
- `administracion/index.vue`: desactivar un usuario ahora pide confirmación
  (`UiConfirmModal`); `recaudo/index.vue`: botones de descarga PDF con protección de doble clic
  (AUD-027).
- `recaudo/index.vue`: botón "Liquidar depósito" en la ficha de recaudo de un contrato
  `TERMINADO`; `configuracion/index.vue`: tarjeta "Generación de canon" con disparo manual;
  página nueva `pages/movimientos/index.vue` (listado + saldo neto, `soloAdmin`) (AUD-029).

## Fase 4 (2026-08-18) — cerrada (AUD-030, AUD-031)

`middleware/auth.global.ts`: se agregó `/auditoria` a `rutasSoloAdmin` — un Recepcionista que
navegue directo a esa URL ahora es redirigido a `/dashboard`, igual que con `/recaudo` (AUD-030).
AUD-031 (validación de `impactoFinanciero` al anular una novedad) se resolvió enteramente en el
backend (`NovedadesService.cambiarEstado()`); no requirió cambios en este frontend. El cambio de
estado del tablero de novedades (`ABIERTA` → `EN_SEGUIMIENTO` → `CERRADA`/`ANULADA`) se hace desde
`pages/novedades/index.vue` (botón "Cambiar estado"), que invoca `PATCH /novedades/:id/estado`.

## Retiro del costo de mora + alineación con el backend (2026-09-01)

El backend retiró el **costo de mora / interés por retraso** (los cobros son netos por canon de
arrendamiento) y aplicó fixes contables. Sincronización de este frontend:

- **`configuracion/index.vue`**: se quitó la sección "Parámetros de mora" (días de gracia,
  % mora mensual) — el `PATCH /empresa` rechazaba esos campos con 400. Queda "Horizonte de
  cánones".
- **`cartera/index.vue`**: se quitó la columna "Mora"; el "Total" (que sumaba
  `valorMoraAcumulada`, ahora `undefined` → `NaN` → `$ 0`) se colapsó en una sola columna
  "Saldo por cobrar" = capital pendiente.
- **`contratos/nuevo.vue`**: nuevo campo **"Medio de pago del depósito"** (+ referencia si es
  transferencia), obligatorio cuando el depósito en custodia es > 0 — el backend ahora registra
  el depósito como un `Movimiento` INGRESO al firmar (hallazgo B5) y exige su medio de pago.
- **Aplicación del dinero** (`ResumenAplicaciones.vue`, `ModalPrevisualizacionPago.vue`,
  `recibos/[id].vue`): se quitó la columna "Tipo (Capital/Mora)" y la caja "Mora" del resumen —
  todo abono es de capital. El orden mostrado pasa de "Canon → Novedad → Mora" a "Canon → Novedad".
- Cálculos de cartera pendiente en `recaudo/index.vue`, `contratos/[id].vue` y `ModalTerminar.vue`
  ya no suman `valorMoraAcumulada`.

## Novedades de esta última entrega
- `dashboard/index.vue` ahora consume `GET /dashboard` con datos reales.
- `recaudo/index.vue`: búsqueda de contrato, ficha de recaudo, pago mixto y descarga de PDF.
- `reportes/index.vue`: centro de descarga de reportes .xlsx (los genera el backend con `ExcelJS`;
  el frontend solo dispara la descarga del binario — `useExcelExport` → `useApiFetch<Blob>`).
- `contratos/nuevo.vue`: creación de contrato 100% por búsqueda estricta (Cliente, Codeudores N:M, Inmueble disponible), sin captura de datos de personas inline.
- `administracion/index.vue`: CRUD de Usuarios (RBAC). Los parámetros de Empresa se editan en `configuracion/index.vue`.
- `clientes/index.vue`, `codeudores/index.vue`: directorios con búsqueda por cédula y alta rápida.
- `auditoria/index.vue`: consulta de trazabilidad con filtros por módulo y usuario.

## Puesta en marcha

```bash
npm install
cp .env.example .env      # y apunta NUXT_PUBLIC_API_BASE_URL a tu backend
npm run dev                # http://localhost:3011
```

## Despliegue (Cloudflare Pages)

App **SPA estática** (`ssr: false` + `nitro.preset: 'cloudflare-pages'`, ver `nuxt.config.ts`).
Todo el data-fetching ya es del lado cliente, así que no hay Workers ni runtime de Node.

### Configuración en el dashboard de Cloudflare Pages
| Ajuste | Valor |
|---|---|
| Framework preset | Nuxt (o "None") |
| Build command | `npm run generate` |
| Build output directory | **`dist`** |
| Node version | la de `.nvmrc` (hoy `24` — ver nota) |

Variables de entorno de build:
- `NUXT_PUBLIC_API_BASE_URL` = `https://<servicio-backend>.up.railway.app/api/v1`
- `NUXT_PUBLIC_SENTRY_DSN` = *(DSN del proyecto Sentry frontend — plan FE-018; vacío = desactivado)*
- `NUXT_PUBLIC_APP_NAME` / `NUXT_PUBLIC_APP_SLOGAN` (opcionales)

> **Node 24 en `.nvmrc`**: el `package-lock.json` (lockfileVersion 3, npm 11) no resuelve con
> `npm ci` bajo npm 10 (Node ≤ 22) — el mismo motivo por el que el CI usa Node 24. El plan
> **FE-014** (regenerar el lockfile) permitirá bajar a una LTS.

### Antes del primer deploy
1. En `public/_headers`, `connect-src`: reemplazar `https://BACKEND-DOMAIN.example` por el dominio
   real del backend en Railway. Para Sentry están los comodines `*.ingest*.sentry.io` — idealmente
   cámbialos por el host exacto de tu DSN; si no usas Sentry, bórralos (y el `worker-src`).
2. En el backend (Railway), `CORS_ORIGIN` = el dominio de Cloudflare Pages (sin barra final).
3. Dominio propio en Cloudflare (DNS + Pages custom domain).

### Error reporting (Sentry — plan FE-018)
`plugins/sentry.client.ts` inicializa `@sentry/vue` **solo si** `NUXT_PUBLIC_SENTRY_DSN` está
definido. Sin DSN es inerte (dev/test). No graba sesiones (`replaysSessionSampleRate: 0`), no
manda PII, e ignora `ErrorMutacionIncierta` (aviso al usuario, no bug).
Follow-up: subir source maps a Sentry en el build de Cloudflare (`SENTRY_AUTH_TOKEN`) para
des-minificar los stack traces.

`public/_redirects` (`/* /index.html 200`) hace que los deep links de la SPA (`/contratos/123`)
sirvan el shell en vez de 404. `public/_headers` lleva CSP, HSTS, `X-Frame-Options: DENY`,
`X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`.

## Vulnerabilidades de dependencias aceptadas (plan FE-014)

- **`@nuxt/ui` < 4.8.1 (GHSA-gj2h-2fpw-fhv9, moderada)** — afecta a `UAuthForm` / `UForm`,
  componentes que este proyecto **no usa** (solo `UFormGroup`, no afectado). Migrar a `@nuxt/ui`
  v4 es un cambio mayor pospuesto (ver `ARCHITECTURE_AND_AUDIT.md` §4). El patrón subyacente
  —`<form>` enviable por GET antes de hidratar— ya se corrigió en `pages/login.vue` (plan FE-016).
  El CI audita con `--audit-level=high`, así que esta moderada no lo bloquea.

Deps muertas `exceljs` / `file-saver` **eliminadas** (FE-014): los reportes .xlsx los genera el
**backend** (`ExcelJS`); el frontend solo dispara la descarga del binario ya construido
(`useExcelExport` → `useApiFetch<Blob>`). Los `js-yaml` / `svgo` vulnerables (deps de build) van
por `overrides` en `package.json`.

## Notas de diseño
- Colores: `amber-600` (primario/dorado), `slate-700` (estructural), `slate-900` (texto), `slate-50` (fondo).
- Badges semánticos: `emerald-600` activo/disponible, `amber-600` terminado,
  `orange-600` mantenimiento, `slate-400` inactivo/anulado.
- Todas las tablas usan `<UTable>` + `<UPagination>` con barra de filtros combinados, tal como
  especifica la sección 5 del super-prompt.

## Limpieza de documentación (2026-09-04)

Corregidas afirmaciones obsoletas en esta bitácora: no existe acción "Suspender" de contrato
(estado SUSPENDIDO eliminado); la UI de cambio de estado de novedades SÍ existe
(`PATCH /novedades/:id/estado`); refs a `AUDITORIA_FUNCIONAL_COMPLETA.md` → `ARCHITECTURE_AND_AUDIT.md`.
