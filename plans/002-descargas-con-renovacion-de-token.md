# Plan 002: Las descargas de PDF/Excel renuevan el token si expiró

> **Executor instructions**: Sigue el plan, verifica cada paso, respeta las STOP conditions,
> actualiza `plans/README.md` al terminar.
>
> **Drift check (primero)**:
> `git diff --stat 53e3e19..HEAD -- composables/usePdfDownload.ts composables/useExcelExport.ts composables/useApiFetch.ts`
> Si alguno cambió, compara con "Current state"; si no coincide, STOP.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `53e3e19`, 2026-09-03

## Why this matters

`useApiFetch` (el wrapper HTTP central) maneja el 401: si el access token expiró, renueva la
sesión y **reintenta** la petición. Pero `usePdfDownload` y `useExcelExport` **no pasan por
`useApiFetch`** — usan `$fetch` directo con el header `Authorization` puesto a mano. Consecuencia:

- Si el access token expiró (dura 15 min) y el usuario le da a "Descargar recibo" / "Exportar
  cartera", la petición devuelve **401 y la descarga falla** — aunque la sesión sea perfectamente
  válida y renovable. El usuario ve un error y tiene que recargar la página.
- `usePdfDownload` además hace `window.URL.createObjectURL(blob)` y **nunca** `revokeObjectURL` —
  cada PDF que se abre deja un blob URL vivo hasta que se recargue la página (fuga menor).

`useExcelExport` **sí** hace `revokeObjectURL` (está bien en ese aspecto); solo le falta el
manejo de token.

El fix: enrutar ambas descargas por `useApiFetch` (que ya sabe renovar el token) y revocar el
blob URL en `usePdfDownload`.

## Current state

### `composables/useApiFetch.ts` (completo — el wrapper que SÍ maneja el 401)

```typescript
import { useAuthStore } from '~/stores/auth.store'

export type ApiFetchOptions = Record<string, unknown> & {
  headers?: Record<string, string>
}

export async function useApiFetch<T = unknown>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const ejecutar = () =>
    $fetch<T>(path, {
      baseURL: config.public.apiBaseUrl,
      headers: {
        ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
        ...(options.headers ?? {}),
      },
      ...options,
    })

  try {
    return await ejecutar()
  } catch (error: unknown) {
    const status = typeof error === 'object' && error !== null && 'response' in error ? Number((error as { response?: { status?: number } }).response?.status) : undefined
    if (status === 401 && auth.refreshToken) {
      const renovado = await auth.refrescarSesion()
      if (renovado) {
        return await ejecutar()
      }
      await auth.cerrarSesion()
      await navigateTo('/login')
    }
    throw error
  }
}
```

> `useApiFetch` hace spread de `...options` sobre la config de `$fetch`, así que acepta
> `responseType: 'blob'`, `params`, etc. sin cambios.

### `composables/usePdfDownload.ts` (completo)

```typescript
import { useAuthStore } from '~/stores/auth.store'

export async function usePdfDownload(path: string, _nombreArchivo: string) {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const blob = await $fetch<Blob>(path, {
    baseURL: config.public.apiBaseUrl,
    headers: { Authorization: `Bearer ${auth.accessToken}` },
    responseType: 'blob',
  })

  const url = window.URL.createObjectURL(blob as Blob)
  window.open(url, '_blank')
}
```

### `composables/useExcelExport.ts` (completo)

```typescript
import { useAuthStore } from '~/stores/auth.store'

export async function useExcelExport(path: string, nombreArchivo: string, params: Record<string, any> = {}) {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const blob = await $fetch<Blob>(path, {
    baseURL: config.public.apiBaseUrl,
    headers: { Authorization: `Bearer ${auth.accessToken}` },
    params,
    responseType: 'blob',
  })

  const url = window.URL.createObjectURL(blob as Blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nombreArchivo.endsWith('.xlsx') ? nombreArchivo : `${nombreArchivo}.xlsx`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
```

### Consumidores (para verificar que no rompes nada)

- `usePdfDownload`: `pages/recaudo/index.vue` (`descargarPdf`), `pages/recibos/[id].vue`,
  `pages/novedades/index.vue` (`descargarReciboNovedad`). Firma: `usePdfDownload(path, nombreArchivo)`.
- `useExcelExport`: `pages/reportes/index.vue`. Firma:
  `useExcelExport(path, nombreArchivo, params?)`.

**La firma pública de ambos composables NO cambia.**

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Lint | `npm run lint` | exit 0 |
| Typecheck | `npm run typecheck` | sin líneas `error TS` (el warning de `vue-router/volar` es preexistente) |
| Build | `npm run build` | exit 0 |
| Tests | `npm run test` | exit 0 |

## Scope

**In scope**:
- `composables/usePdfDownload.ts`
- `composables/useExcelExport.ts`

**Out of scope**:
- `composables/useApiFetch.ts` — ya funciona, no se toca.
- Las páginas que consumen los composables — la firma no cambia.
- Cambiar `window.open` por una descarga forzada en `usePdfDownload` — es un cambio de
  comportamiento deliberado (el PDF se abre para ver/imprimir en pantalla, ver el docstring).
  NO lo cambies.

## Git workflow

- Rama: `advisor/002-descargas-con-renovacion-de-token`.
- Un commit: `FE-3: descargas de PDF/Excel pasan por useApiFetch (renuevan token)`.

## Steps

### Step 1: `usePdfDownload` → `useApiFetch` + revoke

```typescript
export async function usePdfDownload(path: string, _nombreArchivo: string) {
  const blob = await useApiFetch<Blob>(path, { responseType: 'blob' })

  const url = window.URL.createObjectURL(blob)
  window.open(url, '_blank')
  // El blob URL debe seguir vivo hasta que la pestaña nueva lo cargue; se revoca con
  // holgura para no dejarlo colgado (fuga) ni cortarlo antes de que el visor lo lea.
  setTimeout(() => window.URL.revokeObjectURL(url), 60_000)
}
```

Notas:
- `useApiFetch` es un auto-import de Nuxt (está en `composables/`), no hace falta importarlo.
- Se pueden quitar los imports de `useAuthStore` y el uso de `useRuntimeConfig` si quedan sin
  uso (verifícalo — probablemente sí).

**Verify**: `npm run typecheck` → sin `error TS`. `npm run lint` → exit 0.

### Step 2: `useExcelExport` → `useApiFetch`

```typescript
export async function useExcelExport(path: string, nombreArchivo: string, params: Record<string, any> = {}) {
  const blob = await useApiFetch<Blob>(path, { responseType: 'blob', params })

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nombreArchivo.endsWith('.xlsx') ? nombreArchivo : `${nombreArchivo}.xlsx`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
```

- Quitar imports/usos sin uso (`useAuthStore`, `useRuntimeConfig`).

**Verify**: `npm run typecheck` → sin `error TS`. `npm run lint` → exit 0. `npm run build` → exit 0.

### Step 3: Verificación manual (no hay infra de test para esto)

Con el backend corriendo (`http://localhost:3000`) y el frontend en dev (`npm run dev`, :3001),
login como Administrador:

1. Ir a **/reportes**, descargar cualquier `.xlsx` → el archivo se descarga.
2. Ir a **/recaudo**, registrar un pago (o abrir un recibo existente en **/recibos**), pulsar
   "Descargar PDF" → se abre el PDF en pestaña nueva.
3. **Simular token expirado**: en devtools console, `JSON.parse(localStorage.tamara_saenz_sesion)`
   → tomar el objeto, poner `accessToken` a `"corrupto"`, `localStorage.setItem('tamara_saenz_sesion', JSON.stringify(obj))`,
   **recargar**. Repetir el paso 1 → la descarga **debe funcionar igual** (useApiFetch renueva el
   token de forma transparente), sin mandar al usuario a `/login`.

**Verify**: los 3 pasos funcionan; el paso 3 no expulsa a login.

### Step 4: Suite

**Verify**: `npm run test` → exit 0 (sin specs nuevos, solo regresión).

## Test plan

- **Sin specs nuevos.** El repo no tiene infraestructura para testear composables que dependen de
  `$fetch` / `useRuntimeConfig` / `window.URL` de forma aislada, y montarla excede este plan.
- La verificación es el **humo manual del Step 3**, que es el caso exacto que este plan arregla.
- Regresión: `npm run test` sigue en verde (1 archivo).

## Done criteria

- [ ] `npm run lint` exit 0
- [ ] `npm run typecheck` sin líneas `error TS` nuevas
- [ ] `npm run build` exit 0
- [ ] `npm run test` exit 0
- [ ] `grep -n "\\$fetch" composables/usePdfDownload.ts composables/useExcelExport.ts` → **0** coincidencias
- [ ] `grep -n "useApiFetch" composables/usePdfDownload.ts composables/useExcelExport.ts` → 1+ en cada uno
- [ ] `grep -n "revokeObjectURL" composables/usePdfDownload.ts` → 1+ coincidencia
- [ ] Step 3 humo manual: descarga funciona con token expirado, sin expulsión a `/login`
- [ ] `git status --porcelain` solo lista los 2 composables
- [ ] Fila en `plans/README.md` actualizada

## STOP conditions

- Alguno de los composables no coincide con "Current state".
- `useApiFetch` con `responseType: 'blob'` no devuelve un `Blob` (devuelve texto o un objeto) —
  reportar; puede que `$fetch` necesite el `responseType` en otra posición del spread.
- El humo manual del Step 3 sigue expulsando a `/login` — significa que el flujo de refresh de
  `useApiFetch` tiene un problema aparte; reportar (no es de este plan arreglarlo).
- `npm run test` no arranca.

## Maintenance notes

- **Reviewer**: confirmar que la firma pública de ambos composables no cambió (los 4 sitios que
  los llaman no se tocan) y que `useExcelExport` sigue revocando el URL inmediatamente (su
  descarga es síncrona vía `<a download>`, no necesita el `setTimeout` de `usePdfDownload`).
- **Interacción futura**: si `useApiFetch` deja de hacer spread ciego de `...options`, revisar
  que `responseType`/`params` sigan llegando a `$fetch`.
- **Nota**: `usePdfDownload` abre `window.open` tras un `await` — algunos navegadores con
  bloqueo de popups agresivo pueden bloquearlo porque se perdió el "user gesture". Es
  preexistente y no lo arregla este plan; si se vuelve un problema real, la solución es abrir la
  pestaña ANTES del await (`const w = window.open(); ... ; w.location = url`).
