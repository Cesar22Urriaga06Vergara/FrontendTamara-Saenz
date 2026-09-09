# Plan 016: `pages/login.vue` — evitar la fuga de credenciales por envío pre-hidratación

> **ESTADO: TODO.** Generado por la skill `improve` (auditoría ronda 3, 2026-09-05). Hallazgo
> **S-5**. Relacionado con el advisor de `@nuxt/ui` (GHSA-gj2h-2fpw-fhv9) del plan 014, pero es
> código propio, no de la librería.

## Status

- **Priority**: P1 (fuga de credenciales — contraseñas en claro en logs de acceso / historial)
- **Effort**: S (una página, ~5 líneas)
- **Risk**: LOW
- **Depends on**: plan 012 (ejecutar sobre `main`). Independiente del plan 014.
- **Category**: security
- **Planned at**: commit `4d429b8` (rama `correccion-hallazgos-auditoria`), 2026-09-05

## Por qué importa

`pages/login.vue:126` renderiza un formulario nativo:

```html
<form class="mt-7 space-y-4" novalidate @submit.prevent="ingresar">
```

- **No tiene `action` ni `method`.** El default de un `<form>` HTML es `method="GET"` al
  **mismo URL** (`/login`).
- El único botón de tipo submit está en la línea 168-176 (`<UButton type="submit" ...>Ingresar</UButton>`).
- `@submit.prevent="ingresar"` evita el envío nativo **solo después de que Vue hidrata la página**.

Nuxt 4 sirve esta página con SSR (no hay `ssr: false` en `nuxt.config.ts`, ni
`definePageMeta({ ssr: false })` en la página). Entre que el HTML llega al navegador y que el
bundle de Vue termina de hidratar, hay una ventana (típicamente 100 ms – 2 s, más en equipos o
redes lentas) en la que el `<form>` es un formulario HTML puro. Si el usuario escribe sus
credenciales y pulsa **Enter** (o hace clic en "Ingresar") en esa ventana:

1. El navegador hace un **`GET /login?email=usuario@x.com&password=SuClaveReal`**.
2. La contraseña queda en: la barra de direcciones, el **historial del navegador**, los **logs de
   acceso del servidor** (nginx/Nitro/lo que sirva el frontend), y el header `Referer` de la
   siguiente petición.
3. El `@submit.prevent` hidratado nunca llega a ejecutarse para ese primer envío.

Es una ventana corta y de baja probabilidad, pero la consecuencia (contraseñas de un sistema
financiero en logs con retención y acceso de operaciones) es alta, y el arreglo es trivial.

`npm audit` marca `@nuxt/ui <4.8.1` por exactamente esta clase de bug en `UAuthForm`/`UForm` —
componentes que este proyecto **no usa** (usa un `<form>` a mano). El plan 014 documenta ese flag
como aceptado; **este plan arregla la instancia real del problema.**

## Estado actual

- `pages/login.vue` — 190 líneas. `<script setup lang="ts">` con:
  - `definePageMeta({ layout: false })` (línea 4).
  - `email`, `password`, `mostrarPassword`, `cargando`, `error`, `erroresCampo` refs.
  - `validar()` (línea 20) — valida email y longitud de contraseña, llena `erroresCampo`.
  - `ingresar()` (línea 36) — `if (!validar()) return`, `cargando = true`,
    `await auth.iniciarSesion(...)`, `await navigateTo('/dashboard')`, `catch` con manejo de
    429/401/400/red.
- El `<form>` (línea 126): `class="mt-7 space-y-4" novalidate @submit.prevent="ingresar"`.
- Los `<UInput>` de email (línea 128) y password (línea 142) con `name="email"` / `name="password"`
  y `autocomplete` correctos.
- `<UButton type="submit" block size="lg" :loading="cargando" ...>Ingresar</UButton>` (línea 168).
- `stores/auth.store.ts` `iniciarSesion()` usa `$fetch` POST a `/auth/login` — el envío real
  siempre es POST y por JS; el problema es exclusivamente el fallback nativo del `<form>`.
- `nuxt.config.ts` — sin `ssr: false`, sin `routeRules`.

## Comandos que vas a necesitar

| Propósito | Comando | Éxito esperado |
|---|---|---|
| Lint | `npm run lint` | exit 0 |
| Typecheck | `npm run typecheck` | exit 0 (1 warning `vue-tsc` preexistente tolerado) |
| Build | `npm run build` | exit 0 |
| Tests | `npm run test` | todos pasan |
| Dev server | `npm run dev` | levanta en `:3011` |

## Alcance

**En alcance:**
- `pages/login.vue` — el `<form>` y (opcionalmente) el estado del botón submit hasta que monte.
- (Opcional) `tests/login.spec.ts` (nuevo) o extender un spec existente.

**Fuera de alcance (NO tocar):**
- `stores/auth.store.ts` — el envío real ya es POST por JS.
- `nuxt.config.ts` — pasar toda la app a `ssr: false` es una decisión de arquitectura (sugerida
  en la auditoría como P-6) y un plan aparte; este plan arregla el síntoma sin ese cambio.
- La lógica de `validar()` / `ingresar()` / manejo de errores.
- El resto del markup decorativo de la página.

## Pasos

### Paso 1: Dar al `<form>` un método seguro

Cambia la etiqueta de apertura del `<form>` (línea 126):

```html
<!-- ANTES -->
<form class="mt-7 space-y-4" novalidate @submit.prevent="ingresar">

<!-- DESPUÉS -->
<form method="post" action="/login" class="mt-7 space-y-4" novalidate @submit.prevent="ingresar">
```

`method="post"` garantiza que, si el formulario se envía antes de hidratar, el navegador haga un
**POST** (el cuerpo no va en la URL) en vez de un GET con las credenciales en el query string.
`action="/login"` hace que ese POST vuelva a la propia página de login (Nitro responde el HTML de
`/login` a un POST desconocido; el usuario ve la página recargada, sin sesión, y reintenta —
molesto pero **sin fuga**).

> Alternativa más estricta si prefieres que un envío pre-hidratación no haga *nada*: `action="#"`.
> Recarga con un `#` al final del URL, sin navegación real. Elige una y déjala; `method="post"`
> es lo esencial.

### Paso 2: (Recomendado) deshabilitar el submit hasta que la página monte

Añade un ref y actívalo en `onMounted`, y úsalo para deshabilitar el botón:

```ts
// en <script setup>
const montado = ref(false)
onMounted(() => {
  montado.value = true
})
```

```html
<!-- botón submit (línea ~168) -->
<UButton
  type="submit"
  block
  size="lg"
  :loading="cargando"
  :disabled="!montado || cargando"
  ...
>
  Ingresar
</UButton>
```

Antes de hidratar, el HTML servido renderiza el botón deshabilitado (`disabled`), así que un clic
no envía nada. Al montar, `montado` pasa a `true` y el botón se habilita. Combinado con el Paso 1,
es defensa en profundidad: el botón no envía pre-hidratación, y si alguien fuerza un submit por
Enter, va por POST y no filtra.

> Esto NO rompe el flujo normal: para cuando el usuario termina de escribir email + contraseña,
> la página lleva mucho tiempo montada.

**Verify**: `npm run typecheck && npm run build` → exit 0.

### Paso 3: Verificación manual del HTML servido

```bash
npm run build && npm run preview   # o npm run dev
curl -s http://localhost:3011/login | grep -o '<form[^>]*>'
```

**Verify**: el `<form>` servido incluye `method="post"`. Si hiciste el Paso 2, el
`curl ... | grep -o '<button[^>]*type="submit"[^>]*>'` (o busca `Ingresar`) muestra el atributo
`disabled` en el HTML servido.

Prueba de la fuga en sí, con el dev server corriendo y **JS deshabilitado en el navegador**
(DevTools → Command Palette → "Disable JavaScript"), recargar `/login`, escribir credenciales de
prueba y pulsar Enter:
- **Antes del fix**: la URL cambia a `/login?email=...&password=...`.
- **Después del fix**: la URL no expone las credenciales (POST); la página simplemente se recarga.

Vuelve a habilitar JS y confirma que el login normal sigue funcionando (POST por `$fetch`,
redirección a `/dashboard`).

### Paso 4: Actualizar `plans/README.md`

Marca la fila del plan 016 como **DONE** con el hash del commit.

## Plan de pruebas

**Test (opcional pero recomendado):** `tests/login.spec.ts`, montando `pages/login.vue` con
`@vue/test-utils` + `mountSuspended` de `@nuxt/test-utils` (patrón del repo). Casos:

1. El `<form>` renderizado tiene el atributo `method="post"`.
2. (Si se hizo el Paso 2) el botón submit está `disabled` en el render inicial y se habilita tras
   `await nextTick()` / `flushPromises()` (simulando el `onMounted`).
3. Regresión: al enviar el formulario con email/password válidos y JS activo, se llama a
   `auth.iniciarSesion` con esos valores y no se produce navegación nativa
   (`@submit.prevent` intacto).

Si montar la página completa es costoso por los SVG decorativos, un test más chico que solo
verifique el string del `<form>` con `wrapper.find('form').attributes('method')` es suficiente.

**Comando:** `npm run test` → todos pasan.

## Criterios de cierre

TODOS deben cumplirse:

- [ ] `npm run lint && npm run typecheck && npm run build && npm run test` → exit 0.
- [ ] `grep -n '<form' pages/login.vue` → la etiqueta incluye `method="post"`.
- [ ] Con JS deshabilitado, enviar el formulario de `/login` NO pone las credenciales en la URL.
- [ ] Con JS habilitado, el login normal funciona (POST a `/auth/login`, redirección a `/dashboard`).
- [ ] (Si se hizo el Paso 2) el HTML servido de `/login` tiene el botón submit `disabled`.
- [ ] `plans/README.md` actualizado.

## STOP conditions

Detente y reporta si:

- `action="/login"` con `method="post"` provoca que Nitro devuelva un 405/error feo en vez del
  HTML de la página ante un POST pre-hidratación — prueba `action="#"` en su lugar, o
  `@submit` sin `.prevent` + un handler que llame `e.preventDefault()` explícito (mismo efecto,
  distinto encuadre).
- El Paso 2 (`:disabled="!montado"`) hace que en algún navegador el botón quede permanentemente
  deshabilitado (indicaría que `onMounted` no corre — muy improbable en una página cliente, pero
  si pasa, quita el Paso 2 y quédate con el Paso 1, que es el que cierra la fuga).
- Descubres que `/login` ya se sirve como SPA (`ssr: false` en algún lado) — entonces la ventana
  de hidratación es distinta (no hay HTML pre-renderizado con el form activo); el fix sigue
  siendo correcto y barato, aplícalo igual y anótalo.

## Notas de mantenimiento

- **Revisor:** confirmar que `@submit.prevent` sigue presente (es lo que evita el POST nativo una
  vez hidratado) y que `method="post"` es el fallback para antes de eso.
- Si en el futuro se adopta `ssr: false` para toda la app (sugerencia P-6 de la auditoría: es un
  ERP interno tras login, el SSR no aporta y complica), esta clase de problema desaparece de
  raíz — pero el `method="post"` no estorba y se queda.
- El advisor de `@nuxt/ui <4.8.1` en `npm audit` seguirá apareciendo hasta el upgrade a v4; el
  plan 014 lo documenta como aceptado precisamente porque este plan cubre la instancia real.
