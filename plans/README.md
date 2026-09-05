# Implementation Plans — Frontend Tamara & Saenz

Generados por la skill `improve` el 2026-09-03, tras la ronda 1 de correcciones de auditoría
(rama `correccion-hallazgos-auditoria`, ya mergeable). Cubren lo que quedó **fuera** de esa
ronda, más lo que el dueño pidió después (resiliencia de sesión + borradores de formulario).

Cada ejecutor: lee el plan completo antes de empezar, respeta sus STOP conditions, actualiza tu
fila al terminar. Los planes son auto-contenidos.

**Planned against commit**: `53e3e19` (rama `correccion-hallazgos-auditoria`).

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
| 008 | Skeleton loader reutilizable (ronda 2, UX) | P2 | M | LOW | — | **DONE** (commit `<pendiente>`) |

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
