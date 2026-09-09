# Plan 009: `<Transition>` interna en 2 modales (calculando→resultado)

> **ESTADO: DONE.** Ver commit al final. Tercera de 6 mejoras de dinamismo/UX de la auditoría del
> 2026-09-04.

## Status

- **Priority**: P3 · **Effort**: S · **Risk**: LOW

## Why this matters

Dos modales tienen un `v-if`/`v-else` binario entre "calculando" y "resultado", sin ninguna
transición — candidato directo para un fade suave sin tocar lógica de negocio:
- `components/recaudo/ModalPrevisualizacionPago.vue` (`cargando` → "Calculando aplicación…" /
  `previsualizacion` → el desglose completo).
- `components/contratos/ModalTerminar.vue` (`cargandoCartera` → skeleton (plan 008) / cartera +
  depósito pendiente).

(`ModalLiquidarDeposito.vue` "filas de descuento" queda fuera de este plan — no es un swap
binario, es una lista que crece/decrece, tratado en el siguiente plan con `TransitionGroup`.)

## Fix

`<Transition name="fade" mode="out-in">` envolviendo cada par `v-if`/`v-else(-if)`, con `key`
distinto por rama (`mode="out-in"` es obligatorio — sin él ambos estados podrían solaparse
visualmente). CSS del fade en `<style scoped>` de cada componente (mismo patrón ya usado en
`BannerReconexion.vue`, 150ms en vez de sus 200ms para ser consistente con el resto de esta tanda).

En `ModalTerminar.vue`, el branch `v-else` era un `<template>` con 3 `<p>` hermanos (sin un único
nodo raíz) — `<Transition>` exige que cada rama resuelva a un único elemento/componente. Se
cambió a un `<div v-else class="space-y-1">` envolviendo los mismos 3 párrafos (se replicó
`space-y-1` en el nuevo div para conservar exactamente el mismo espaciado visual entre ellos que
tenían antes como hijos directos del contenedor).

## Verificación

- `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test` → exit 0 (12/12).
- **Humo real** (backend+frontend reales): en `ModalTerminar`, una captura de pantalla justo tras
  abrir el modal capturó el frame de transición (texto borroso/superpuesto), confirmando la
  animación en curso. En `ModalPrevisualizacionPago` (contrato con obligación pendiente real,
  "Jorge Iván Ramírez Ospina"), se capturó directamente el estado "Calculando aplicación…" en
  pantalla (la llamada real a `/recaudo/pagos/simular` aún no había resuelto), seguido del
  contenido final correcto (cliente, inmueble, aplicación del dinero) — confirma el fade completo
  end-to-end con datos reales, sin cerrar la operación (se canceló el modal sin confirmar el pago).

## Maintenance notes

- Si se centraliza el CSS `.fade-*` como utilidad global (compartida entre `BannerReconexion`,
  este plan y el de transición de página), evaluarlo en una limpieza posterior — no bloquea nada
  mientras tanto (cada componente lo trae scoped, sin colisión de nombres entre sí).
