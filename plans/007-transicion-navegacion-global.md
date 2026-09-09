# Plan 007: Transición de navegación global entre páginas

> **ESTADO: DONE.** Ver commit al final. Primera de 6 mejoras de dinamismo/UX pedidas por el
> dueño (auditoría de modales y vistas del 2026-09-04).

## Status

- **Priority**: P3 (pero el de mayor impacto/menor riesgo de la tanda — afecta el 100% de las
  pantallas)
- **Effort**: S
- **Risk**: LOW

## Why this matters

`nuxt.config.ts` no definía `app.pageTransition`; `app.vue` es solo
`<NuxtLayout><NuxtPage /></NuxtLayout>` sin `<Transition>` propio — cero transición entre las ~25
páginas del sistema, cada navegación era un corte seco. Único `<Transition>` real en todo el repo
hasta ahora: `components/shared/BannerReconexion.vue` (fade 0.2s) — plantilla de estilo replicada
aquí.

## Fix

- `nuxt.config.ts`: `pageTransition: { name: 'page', mode: 'out-in' }` dentro de la clave `app` ya
  existente (fusionado con `head`, no duplicado).
- `assets/css/main.css`: `.page-enter-active/.page-leave-active { transition: opacity 0.15s ease }`,
  `.page-enter-from/.page-leave-to { opacity: 0 }`. Duración corta a propósito (ERP de uso
  operativo diario).

## Verificación

- `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test` → exit 0 (12/12).
- `grep -rn "pageTransition" pages/` → 0 (ninguna página tenía una excepción previa que respetar).
- **Humo real**: login + navegación entre `/dashboard` → `/contratos` → `/recaudo` con backend y
  frontend reales corriendo. Confirmado por inspección de `document.styleSheets` que las 2 reglas
  CSS (`.page-enter-active`/`.page-leave-active` y `.page-enter-from`/`.page-leave-to`) están
  activas y coinciden exactamente con el `name: 'page'` configurado. Layout (sidebar/header)
  estable en las 3 navegaciones, sin parpadeo blanco ni salto visual.

## Nota operativa (no relacionada con este plan)

Durante el humo se descubrió que el puerto `:3001` (el de este proyecto) ya no estaba libre — lo
ocupaba un proceso de otro proyecto no relacionado (`C:\Users\urria\Frontend_Jordan_2026`),
aparentemente porque el servidor de este repo se había caído en algún punto entre turnos de
trabajo. Se dejó ese proceso ajeno intacto (no se tocó) y se corrió el humo de este plan (y de los
siguientes de esta tanda UX) contra el puerto `:3011`, con `CORS_ORIGIN` del backend ajustado
temporalmente a ese puerto para la duración de estas pruebas — se revierte a `:3001` al cerrar
toda la tanda de planes de UX.

## Maintenance notes

- Si una página necesita una transición distinta (ej. un wizard con pasos), se puede sobrescribir
  por página con `definePageMeta({ pageTransition: {...} })` sin tocar este config global.
