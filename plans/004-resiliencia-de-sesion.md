# Plan 004: La sesión sobrevive a cortes de red (no te echa al login)

> **Executor instructions**: Sigue el plan paso a paso, verifica cada paso, respeta las
> STOP conditions, actualiza `plans/README.md` al terminar.
>
> **Drift check (primero)**:
> `git diff --stat 53e3e19..HEAD -- stores/auth.store.ts composables/useApiFetch.ts layouts/default.vue`
> Si alguno cambió, compara con "Current state"; si no coincide, STOP.
>
> **Este plan reemplaza al plan `001-restaurar-sesion-tolerante-a-corrupcion.md`** (su fix es el
> Step 1 de aquí). Si el plan 001 ya se ejecutó, sáltate el Step 1 y márcalo como hecho.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none (reemplaza a 001)
- **Category**: bug / UX
- **Planned at**: commit `53e3e19`, 2026-09-03

## Why this matters

El dueño pidió: *"no quiero eso de recargar e iniciar sesión otra vez"* — que un corte de red o
del backend no lo eche al login. Hoy pasan tres cosas mal:

1. **`restaurar()` revienta con un `localStorage` corrupto** → la app no arranca (pantalla en
   blanco), aunque el dato de sesión ni es crítico.
2. **Cualquier fallo de red durante una petición se propaga como error** — el usuario ve
   "No fue posible ..." aunque la sesión sea válida y baste con reintentar.
3. **Un fallo al renovar el token por causa de red se trata igual que un token revocado**:
   `useApiFetch` llama `cerrarSesion()` + `navigateTo('/login')`. Es decir, un wifi que
   parpadea justo cuando expira el access token = te sacó de la sesión.

Tras este plan: datos corruptos no rompen el arranque; los fallos de red se reintentan de forma
transparente con un aviso "Reconectando…"; solo un **401 real** (token revocado/inválido) cierra
la sesión.

## Current state

### `stores/auth.store.ts` — `restaurar()` (sin try/catch)

```typescript
    restaurar() {
      if (import.meta.client) {
        const raw = localStorage.getItem('tamara_saenz_sesion')
        if (raw) {
          const data = JSON.parse(raw) as Partial<LoginResponse>
          this.accessToken = data.accessToken ?? ''
          this.refreshToken = data.refreshToken ?? ''
          this.usuario = data.usuario ?? null
        }
      }
    },
```

### `stores/auth.store.ts` — `refrescarSesion()` (tras la ronda 1, con dedupe)

```typescript
    async refrescarSesion(): Promise<boolean> {
      if (refrescoEnCurso) return refrescoEnCurso
      refrescoEnCurso = (async (): Promise<boolean> => {
        try {
          const config = useRuntimeConfig()
          const data = await $fetch<RefreshResponse>('/auth/refresh', {
            baseURL: config.public.apiBaseUrl,
            method: 'POST',
            body: { refreshToken: this.refreshToken },
          })
          this.accessToken = data.accessToken
          this.refreshToken = data.refreshToken
          this.usuario = data.usuario
          this.persistir()
          return true
        } catch {
          return false
        } finally {
          refrescoEnCurso = null
        }
      })()
      return refrescoEnCurso
    },
```

> Problema: el `catch` no distingue "el server respondió 401" (token revocado — hay que cerrar
> sesión) de "no se pudo llegar al server" (red — hay que mantener la sesión y reintentar).

### `composables/useApiFetch.ts` (completo)

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

### `layouts/default.vue` (completo)

```vue
<template>
  <div class="flex min-h-screen bg-slate-50">
    <LayoutSidebar />
    <div class="flex-1 flex flex-col min-w-0">
      <LayoutHeader />
      <main class="flex-1 min-w-0 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
```

### Repo conventions

- Pinia **option stores**. Composables en `composables/` (auto-import de Nuxt).
- Componentes de `@nuxt/ui` v2: `UAlert`, `UButton`, etc. Tema claro fijo (no clases `dark:`).
- `ofetch` (el `$fetch` de Nuxt) tira un `FetchError` con `.response?.status` en errores HTTP y
  **sin** `.response` (o con `.response` undefined) en errores de red / DNS / offline.
- Comentarios en español.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Lint | `npm run lint` | exit 0 |
| Typecheck | `npm run typecheck` | sin líneas `error TS` (el warning de `vue-router/volar` es preexistente) |
| Build | `npm run build` | exit 0, `Nuxt Nitro server built` |
| Tests | `npm run test` | exit 0 |

## Scope

**In scope**:
- `stores/auth.store.ts` (`restaurar`, `refrescarSesion`)
- `composables/useApiFetch.ts`
- `composables/useEstadoConexion.ts` (crear)
- `components/shared/BannerReconexion.vue` (crear)
- `layouts/default.vue` (montar el banner)
- `tests/auth-store.spec.ts` (crear) y `tests/use-api-fetch.spec.ts` (crear, si es viable — ver Step 5)

**Out of scope**:
- La duración de la sesión (backend) — es el plan `006` del repo backend.
- Guardar borradores de formulario — es el plan `005` de este repo.
- Reintentar ante un `503` del backend (los errores transitorios de BD) — follow-up del plan
  `001` del backend; se puede añadir al mismo `useApiFetch` más adelante.
- `plugins/auth.client.ts` — no cambia.

## Git workflow

- Rama: `advisor/004-resiliencia-de-sesion`.
- Commits por parte: (1) `restaurar` guard, (2) `useApiFetch` reintento + `refrescarSesion`,
  (3) banner de reconexión. Mensajes estilo repo.

## Steps

### Step 1: `restaurar()` tolera datos corruptos

Reemplazar el cuerpo de `restaurar()`:

```typescript
    restaurar() {
      if (!import.meta.client) return
      const raw = localStorage.getItem('tamara_saenz_sesion')
      if (!raw) return
      try {
        const data = JSON.parse(raw) as Partial<LoginResponse>
        this.accessToken = data.accessToken ?? ''
        this.refreshToken = data.refreshToken ?? ''
        this.usuario = data.usuario ?? null
      } catch {
        // localStorage corrupto: limpiar y arrancar como sesión no iniciada, en vez de dejar
        // caer el plugin de arranque y romper toda la app.
        localStorage.removeItem('tamara_saenz_sesion')
      }
    },
```

**Verify**: `npm run lint` → exit 0. `npm run typecheck` → sin `error TS`.

### Step 2: `refrescarSesion()` distingue 401 de fallo de red

Cambiar el `catch` interno para que devuelva un resultado de 3 estados en vez de un booleano.
Nueva firma: `Promise<'ok' | 'invalido' | 'sin-red'>`.

```typescript
    async refrescarSesion(): Promise<'ok' | 'invalido' | 'sin-red'> {
      if (refrescoEnCurso) return refrescoEnCurso
      refrescoEnCurso = (async (): Promise<'ok' | 'invalido' | 'sin-red'> => {
        try {
          const config = useRuntimeConfig()
          const data = await $fetch<RefreshResponse>('/auth/refresh', {
            baseURL: config.public.apiBaseUrl,
            method: 'POST',
            body: { refreshToken: this.refreshToken },
          })
          this.accessToken = data.accessToken
          this.refreshToken = data.refreshToken
          this.usuario = data.usuario
          this.persistir()
          return 'ok'
        } catch (e: unknown) {
          const status =
            typeof e === 'object' && e !== null && 'response' in e
              ? Number((e as { response?: { status?: number } }).response?.status)
              : undefined
          // 401/403 = el refresh token ya no sirve (revocado/expirado) → sesión inválida.
          // Sin status (error de red, DNS, offline) → no se pudo verificar; NO cerrar sesión.
          return status === 401 || status === 403 ? 'invalido' : 'sin-red'
        } finally {
          refrescoEnCurso = null
        }
      })()
      return refrescoEnCurso
    },
```

Actualizar el tipo `refrescoEnCurso` a nivel de módulo:
`let refrescoEnCurso: Promise<'ok' | 'invalido' | 'sin-red'> | null = null`.

**Verify**: `npm run typecheck` → sin `error TS` (habrá error en `useApiFetch` hasta el Step 3, es esperado — anótalo pero sigue).

### Step 3: `useApiFetch` reintenta ante fallos de red y solo cierra sesión con 401 real

Reescribir `useApiFetch` así (mantiene la firma pública):

```typescript
import { useAuthStore } from '~/stores/auth.store'
import { useEstadoConexion } from '~/composables/useEstadoConexion'

export type ApiFetchOptions = Record<string, unknown> & {
  headers?: Record<string, string>
}

const MAX_REINTENTOS_RED = 3
const espera = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function useApiFetch<T = unknown>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const config = useRuntimeConfig()
  const auth = useAuthStore()
  const conexion = useEstadoConexion()

  const ejecutar = () =>
    $fetch<T>(path, {
      baseURL: config.public.apiBaseUrl,
      headers: {
        ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
        ...(options.headers ?? {}),
      },
      ...options,
    })

  const statusDe = (error: unknown): number | undefined =>
    typeof error === 'object' && error !== null && 'response' in error
      ? Number((error as { response?: { status?: number } }).response?.status)
      : undefined

  // Un fallo SIN status HTTP (o 5xx de gateway) = problema de red/servidor no disponible:
  // reintentar con backoff antes de rendirse.
  const esFalloDeRed = (error: unknown): boolean => {
    const s = statusDe(error)
    return s === undefined || s === 502 || s === 503 || s === 504
  }

  let intentosRed = 0
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const resultado = await ejecutar()
      conexion.marcarEnLinea()
      return resultado
    } catch (error: unknown) {
      const status = statusDe(error)

      if (status === 401 && auth.refreshToken) {
        const resultado = await auth.refrescarSesion()
        if (resultado === 'ok') {
          continue // reintentar la petición original con el token nuevo
        }
        if (resultado === 'invalido') {
          await auth.cerrarSesion()
          await navigateTo('/login')
          throw error
        }
        // 'sin-red': no se pudo verificar el token; tratar como fallo de red y reintentar.
      }

      if (esFalloDeRed(error) && intentosRed < MAX_REINTENTOS_RED) {
        intentosRed++
        conexion.marcarReconectando()
        await espera(Math.min(1000 * 2 ** (intentosRed - 1), 5000)) // 1s, 2s, 4s (máx 5s)
        continue
      }

      if (esFalloDeRed(error)) conexion.marcarSinConexion()
      throw error
    }
  }
}
```

**Verify**: `npm run typecheck` → sin `error TS`. `npm run lint` → exit 0. `npm run build` → exit 0.

### Step 4: `useEstadoConexion` + banner

Crear `composables/useEstadoConexion.ts` — un store-lite compartido (módulo con estado reactivo):

```typescript
type EstadoConexion = 'en-linea' | 'reconectando' | 'sin-conexion'

const estado = ref<EstadoConexion>('en-linea')

export function useEstadoConexion() {
  return {
    estado: readonly(estado),
    marcarEnLinea: () => (estado.value = 'en-linea'),
    marcarReconectando: () => {
      if (estado.value === 'en-linea') estado.value = 'reconectando'
    },
    marcarSinConexion: () => (estado.value = 'sin-conexion'),
  }
}
```

Crear `components/shared/BannerReconexion.vue`:

```vue
<script setup lang="ts">
const { estado } = useEstadoConexion()
</script>

<template>
  <Transition name="fade">
    <div
      v-if="estado !== 'en-linea'"
      class="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white"
      :class="estado === 'reconectando' ? 'bg-amber-500' : 'bg-red-600'"
    >
      <UIcon :name="estado === 'reconectando' ? 'i-heroicons-arrow-path' : 'i-heroicons-wifi-slash'" class="h-4 w-4" :class="{ 'animate-spin': estado === 'reconectando' }" />
      <span>{{ estado === 'reconectando' ? 'Reconectando…' : 'Sin conexión. Reintenta cuando vuelva el internet — no perdiste nada.' }}</span>
    </div>
  </Transition>
</template>
```

Montar el banner en `layouts/default.vue`, dentro del `<div>` raíz, antes de `<LayoutSidebar />`:

```vue
  <div class="flex min-h-screen bg-slate-50">
    <SharedBannerReconexion />
    <LayoutSidebar />
    <!-- ... -->
```

> Nota: el auto-import de componentes de Nuxt nombra `components/shared/BannerReconexion.vue`
> como `SharedBannerReconexion`. Verifica que `components/shared/` ya usa ese prefijo (sí: hay
> `SharedErrorState`, `SharedStatusBadge`).

**Verify**: `npm run build` → exit 0. Arranca `npm run dev` y confirma que la app carga normal
(sin banner) cuando hay conexión.

### Step 5: Tests

**`tests/auth-store.spec.ts`** (crear) — mismo patrón del plan 001 (Pinia + `localStorage`
stubeado):
- `restaurar()` con JSON válido → rehidrata.
- `restaurar()` con JSON corrupto → no lanza, limpia la clave, sesión vacía.
- `restaurar()` sin clave → no-op.

**`tests/use-api-fetch.spec.ts`** (crear si es viable) — stubear `$fetch` global con `vi.stubGlobal`:
- Petición que resuelve a la primera → devuelve el resultado, `estado` queda `'en-linea'`.
- Petición que falla sin status 2 veces y luego resuelve → devuelve el resultado tras reintentar
  (verificar que `$fetch` se llamó 3 veces).
- Petición que devuelve 401 y `refrescarSesion` → `'invalido'` → llama `cerrarSesion` y
  `navigateTo('/login')` (stubear `navigateTo`).
- Petición que devuelve 401 y `refrescarSesion` → `'ok'` → reintenta y resuelve.

> Si stubear `$fetch` / `navigateTo` en el entorno `nuxt` de vitest resulta demasiado frágil
> (son auto-imports/globals de Nuxt), escribe solo el spec de `auth-store` y marca el de
> `use-api-fetch` como STOP/reporta — no inviertas más de ~30 min peleando con el entorno.

**Verify**: `npm run test` → exit 0, specs nuevos pasan.

### Step 6: Humo manual

`npm run dev` (:3001) + backend (:3000), login Administrador:

1. Navegar normal → sin banner, todo funciona.
2. En devtools, pestaña Network → "Offline". Navegar a otra página → aparece banner
   ámbar "Reconectando…", la petición reintenta. Volver a "Online" antes de agotar los
   reintentos → el banner desaparece y la página carga. **No** te mandó al login.
3. Offline + esperar a que se agoten los 3 reintentos → banner rojo "Sin conexión…". Volver
   online y navegar → se recupera. Sigues logueado.
4. Corromper el access token en `localStorage` (dejando el refresh válido) + recargar +
   navegar → renueva token de forma transparente (ya funcionaba tras ronda 1), sin login.

**Verify**: los 4 escenarios; en ninguno terminas en `/login` salvo que el refresh token sea
realmente inválido.

## Test plan

- `tests/auth-store.spec.ts`: 3 casos de `restaurar()`.
- `tests/use-api-fetch.spec.ts` (si viable): reintento de red, 401→inválido→logout, 401→ok→retry.
- Humo manual del Step 6 para los escenarios de red reales (devtools Offline).
- **Verificación**: `npm run test` → verde; humo manual OK.

## Done criteria

- [ ] `npm run lint` exit 0
- [ ] `npm run typecheck` sin líneas `error TS` nuevas
- [ ] `npm run build` exit 0
- [ ] `npm run test` exit 0; `tests/auth-store.spec.ts` existe y pasa
- [ ] `grep -n "try {" stores/auth.store.ts` → coincidencia dentro de `restaurar`
- [ ] `grep -n "'sin-red'\|'invalido'" stores/auth.store.ts` → coincidencias (refrescarSesion tri-estado)
- [ ] `grep -n "MAX_REINTENTOS_RED\|marcarReconectando" composables/useApiFetch.ts` → coincidencias
- [ ] `components/shared/BannerReconexion.vue` y `composables/useEstadoConexion.ts` existen
- [ ] `grep -n "SharedBannerReconexion" layouts/default.vue` → 1 coincidencia
- [ ] Humo manual Step 6: offline no te echa al login
- [ ] `git status --porcelain` sin archivos fuera del scope
- [ ] Fila en `plans/README.md` actualizada; marcar el plan `001` como REEMPLAZADO por este

## STOP conditions

- Alguno de los 4 archivos de "Current state" no coincide con los excerpts.
- `refrescarSesion` es llamado desde otro sitio además de `useApiFetch` con la expectativa de un
  booleano (romperías ese caller) — buscar con `grep -rn "refrescarSesion" .` antes del Step 2.
- Stubear `$fetch`/`navigateTo` en vitest es inviable en ~30 min → entregar solo el spec de
  `auth-store` y reportar.
- El humo manual del Step 6 **sí** te manda al login al ir offline → el flujo de `refrescarSesion`
  tri-estado no está enganchado bien; revisar el Step 3.
- `npm run test` no arranca.

## Maintenance notes

- **Reviewer**: el punto crítico es que **solo `'invalido'` (401/403 en el refresh) cierra la
  sesión**. Un `'sin-red'` NUNCA debe llamar `cerrarSesion()`. Revisar ese camino con lupa.
- **Interacción futura**: cuando se implemente el reintento ante `503` (errores transitorios de
  BD del backend, plan backend 001), va en el mismo `esFalloDeRed` — ya está contemplado (502/503/504).
- **Nota de UX**: el banner es `position: fixed; top: 0`. Si tapa contenido importante en móvil,
  ajustar el `padding-top` del `<main>` cuando el banner esté visible (follow-up menor).
- **Diferido**: escuchar los eventos `window.online` / `window.offline` para adelantarse al
  fallo (mostrar el banner antes de que una petición falle) — mejora aparte.
