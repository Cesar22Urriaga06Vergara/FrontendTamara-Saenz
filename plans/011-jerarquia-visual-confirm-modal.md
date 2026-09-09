# Plan 011: Jerarquía visual por color en `ConfirmModal.vue`

> **ESTADO: DONE.** Ver commit al final. Quinta de 6 mejoras de dinamismo/UX de la auditoría del
> 2026-09-04 (riesgo LOW).

## Status

- **Priority**: P3 · **Effort**: S · **Risk**: LOW

## Why this matters

`components/ui/ConfirmModal.vue` ya soportaba `color: 'red'|'amber'|'emerald'|'gray'`, pero solo lo
aplicaba al botón de confirmar — el header (título + icono) era idéntico sin importar la severidad
real de la acción (dar de baja un cliente vs. generar cánones masivamente vs. una confirmación
neutra). Es el único modal de confirmación genérico reutilizado de forma consistente en 6 vistas
(Clientes ×2, Codeudores, Administración, Configuración, Recaudo) — reforzarlo aquí se propaga
automáticamente a las 6.

## Verificación previa (confirma el alcance, sin sorpresas)

`grep -rn "<UiConfirmModal"` confirmó los 6 consumidores reales y que **todos** pasan `color="red"`
o `color="amber"` únicamente — ninguno usa `emerald`/`gray` hoy, pero el prop ya los declaraba, así
que el mapa de iconos/clases cubre los 4 desde el día uno (no hace falta esperar a un consumidor
real para soportarlos).

## Fix

- Dos mapas explícitos de literales completos en `<script setup>` (`ICONO_POR_COLOR`,
  `CLASE_ICONO_POR_COLOR`), **no** interpolación de string tipo `` `text-${color}-500` `` — Tailwind
  JIT solo genera en el build las clases que aparecen como literal completo en el código fuente; una
  clase construida en runtime no se generaría y el color simplemente no se vería en producción
  (el build igual pasaría sin error, lo que lo hace un bug silencioso fácil de introducir sin darse
  cuenta).
  - `red`/`amber` → `i-heroicons-exclamation-triangle` (ícono de advertencia ya usado en el resto
    del repo para estos 2 colores).
  - `emerald` → `i-heroicons-check-circle` (confirmación positiva).
  - `gray` → `i-heroicons-information-circle` (neutro).
- Header del `UCard` envuelto en un `div.flex.items-center.gap-2` con un `<UIcon>` antes del
  título, coloreado según el mapa.
- Cero cambios de lógica: mismos props, mismos emits, mismo comportamiento de botones.

## Verificación

- `npm run lint && npm run typecheck && npm run build && npm run test` → exit 0 (12/12 tests, sin
  relación con este componente pero confirma que nada se rompió).
- **Humo real**: abierto el modal en 2 consumidores con colores distintos —
  `/clientes/[id]` → "Dar de baja" (rojo, ícono de advertencia rojo visible) y `/configuracion` →
  "Generar cánones pendientes" (ámbar, mismo ícono en ámbar). Ambos cerrados con "Cancelar" sin
  disparar la acción real (confirmado que el cliente seguía "Activo" y que no se generaron cánones).

## Maintenance notes

- Si se agrega un nuevo valor a la unión de `color` en el futuro, hay que agregarlo a **ambos**
  mapas (`ICONO_POR_COLOR` y `CLASE_ICONO_POR_COLOR`) — TypeScript ya lo exige porque son
  `Record<'red'|'amber'|'emerald'|'gray', string>` tipados sobre la misma unión del prop.
