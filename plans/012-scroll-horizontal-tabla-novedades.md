# Plan 012: La tabla de Novedades exigía scroll horizontal

> **ESTADO: DONE.** Ver commit al final. Ad-hoc, pedido por el dueño en el mismo hilo de trabajo
> de la ronda 2.

## Status

- **Priority**: P3 · **Effort**: S · **Risk**: LOW

## Why this matters

`pages/novedades/index.vue` (la vista operativa de Recepción/Administrador, no el tab de solo
lectura de `/recibos`) tenía 9 columnas — `No. / Cliente / Dirección / Barrio / Descripción /
Fecha / Estado / Impacto financiero / Acciones` — y la celda de Acciones podía mostrar **hasta 4
botones con texto simultáneos** para un Administrador viendo una novedad `PENDIENTE` ("Ver
recibo", "Cambiar estado", "Cargo arrendatario", "Gasto inmobiliaria"). La suma de ambas cosas
forzaba scroll horizontal en resoluciones de escritorio normales. El dueño sospechaba de la
columna Acciones — confirmado como la causa principal, junto con tener Dirección y Barrio como
2 columnas separadas en vez de 1.

## Fix

1. **Dirección + Barrio fusionadas en una sola columna "Inmueble"** (`Calle X #Y-Z (Barrio)`),
   mismo formato que ya usa `PdfNovedadService` para el mismo dato. `key` sin puntos
   (`inmuebleTexto`, no `inmueble.direccion`) por la misma razón que la columna `clienteNombre`
   del plan 006: un `key` anidado rompe el nombre del slot `#key-data` (`vue/valid-v-slot`).
2. **Acciones colapsadas**: se queda solo "Ver recibo" como botón visible (la única acción que
   todos los roles usan siempre, para toda novedad); el resto (Cambiar estado, Cargo
   arrendatario, Gasto inmobiliaria, Registrar pago, Revertir aprobación — todas condicionales
   por rol/estado) se mueven a un `UDropdown` con un botón disparador de solo ícono
   (`i-heroicons-ellipsis-horizontal`), agrupado en 2 secciones (Cambiar estado / acciones
   financieras) — mismo patrón ya establecido en `pages/recibos/index.vue` (botón "Ver" +
   `UDropdown` de icono para "Ver Carta"/"Ver Media Carta"), no un componente nuevo.
   - El dropdown solo se muestra si `accionesNovedad(row).length` — si ninguna acción aplica (ej.
     una novedad `CERRADA` con `GASTO_INMOBILIARIA` ya pagado, sin nada más que hacer), no
     aparece un botón "…" muerto — mismo comportamiento de antes (solo "Ver recibo").
   - Se pierde el color por acción (antes "Registrar pago" era rojo, "Cargo arrendatario" ámbar,
     etc.) — es la misma pérdida que ya acepta `TableRowActions.vue` (Editar/Dar de baja en el
     mismo dropdown, sin color), consistente con el resto del repo: los ítems de un `UDropdown` no
     llevan color individual aquí, solo ícono + etiqueta.

## Verificación

- `npm run lint && npm run typecheck && npm run build && npm run test` → exit 0 (12/12 tests).
- **Humo real** en `/novedades` (backend+frontend reales, 3 novedades reales del seed cubriendo
  los 3 escenarios de impacto financiero):
  - Medido con JS en la página: el `<table>` pasó de necesitar scroll horizontal real a un
    `scrollWidth` de apenas 2px sobre el `clientWidth` del wrapper (913 vs 911, a 1280×720) — un
    residuo de redondeo por DPI, no un desbordamiento perceptible.
  - `NOV-000003` (PENDIENTE, ABIERTA): el dropdown muestra 2 grupos — [Cambiar estado] y [Cargo
    arrendatario, Gasto inmobiliaria] — y clic en "Cambiar estado" abre el modal correcto con el
    estado actual de esa fila (ABIERTA), confirmando que el `row` se pasa bien al `click` de cada
    ítem.
  - `NOV-000002` (CARGO_ARRENDATARIO, CERRADA): el dropdown muestra solo "Revertir aprobación"
    (sin "Cambiar estado", porque `CERRADA` no tiene transiciones hacia adelante).
  - `NOV-000001` (GASTO_INMOBILIARIA, pagado, CERRADA): sin dropdown en absoluto (nada aplica),
    solo "Ver recibo" — igual que antes del cambio.
  - Columna "Inmueble" renderiza `direccion (barrio)` correctamente en las 3 filas.

## Maintenance notes

- Si se agrega una acción nueva a la tabla, decidir primero si es "universal" (queda como botón
  visible, como "Ver recibo") o condicional por rol/estado (va a `accionesNovedad()`) — no volver
  a apilar botones de texto sueltos en la celda, es la causa original de este problema.
- `components/recibos/TablaRecibosNovedad.vue` (el tab de solo lectura de `/recibos`) tiene un
  problema de forma similar pero mucho más leve (Acciones ahí es un solo botón) — no se tocó en
  este plan porque no era la tabla que el dueño reportó; si en el futuro también necesita el
  scroll, aplicar el mismo criterio de fusionar Dirección+Barrio ahí.
