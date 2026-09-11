# ARCHITECTURE_AND_AUDIT.md — Frontend (Inversiones Tamara & Saenz S. En C.)

**Documento oficial único de arquitectura y auditoría del frontend.** Consolida y reemplaza:
`AUDITORIA_UI_UX_FRONTEND.md` y `AUDITORIA_INTEGRAL_UX_UI_FRONTEND.md`. No reemplaza `README.md`
(bitácora viva de cambios) ni `AGENTS.md` (reglas de trabajo para agentes) — ambos siguen vigentes e
independientes. Tampoco reemplaza `ESPECIFICACION_UI_UX_PAGINA_POR_PAGINA.md` (58 secciones, vive en
la raíz de este repo — la copia duplicada que existía mal ubicada en el repo backend, dentro de
`documentacion/backendocu/frontendocu/`, ya se borró en la ronda de limpieza de documentación del
backend) — sigue siendo la especificación de UI/UX de referencia y no un documento de auditoría.

Metodología idéntica a la del documento de backend: verificación directa de código el 2026-09-03, no
copia de auditorías previas. Donde el código contradice una auditoría anterior, se indica explícitamente.

> Fe de erratas 2026-09-04: §3 (`/recibos/` con barra final, el listado no queda gateado admin-only),
> §16 (`fecha()` verificada, sin bug de timezone), §22 (confirmado: sin CSP ni cabeceras de seguridad).

> **Línea base verificada el 2026-09-10:** `npm test` pasa con **31 tests en 6 archivos**; `npm run
> lint`, `npm run typecheck` y `npm run build` pasan. `vue-router` se declaró explícitamente como
> dependencia de desarrollo para que `vue-tsc` pueda resolver su plugin Volar desde la raíz. La deuda de
> tipado de respuestas API descrita más abajo continúa vigente. El build de producción ahora falla si
> `NUXT_PUBLIC_API_BASE_URL` falta o no es una URL HTTPS de API, o si `public/_headers` conserva un host
> de backend no válido para producción.

---

## 1. Resumen ejecutivo

Frontend Nuxt 4 + Vue 3 + `@nuxt/ui` v2 + Pinia para la misma herramienta interna de arrendamientos que el
backend documentado en `/backend/ARCHITECTURE_AND_AUDIT.md`. Cobertura funcional amplia: 17 áreas de
página (login, dashboard, clientes, codeudores, inmuebles, contratos, recaudo, recibos, cartera, novedades,
gastos, caja, movimientos, transferencias, reportes, configuración, administración, auditoría).

Las dos auditorías previas de frontend (`AUDITORIA_UI_UX_FRONTEND.md` y
`AUDITORIA_INTEGRAL_UX_UI_FRONTEND.md`, ambas de una fase anterior del proyecto) describen un frontend
bastante menos maduro del que existe hoy: varias páginas de detalle, el módulo de Cartera, Gastos,
Depósitos, Transferencias y Administración que esas auditorías marcaban como faltantes **ya existen y
están implementadas** al momento de esta verificación. Ambas quedan clasificadas como **HISTÓRICO /
SUSTANCIALMENTE SUPERADO**.

Los hallazgos reales que sí siguen vigentes hoy son consistentes y menos numerosos: uso extendido de `any`
en los módulos financieros más sensibles, ausencia casi total de pruebas automatizadas (un solo archivo de
test en todo el frontend), y una acción del backend (reversión de aprobación de novedad) que la UI no
expone. Ninguno de estos tres es, por sí solo, un riesgo de pérdida de dinero — son deuda técnica y de
cobertura de pruebas en una herramienta interna de un equipo pequeño.

## 2. Estado actual

El proyecto compila (`nuxt build`/`nuxt dev` implícitos por la naturaleza de Nuxt 4) y tiene Vitest
configurado y funcional (`"test": "vitest run"` en `package.json`), con 5 archivos de prueba y 22 tests
verificados el 2026-09-10. El 2026-09-01 se hizo una limpieza coordinada con el backend para retirar toda
referencia visual a mora (ver README, sección "Retiro del costo de mora + alineación con el backend").

## 3. Arquitectura real

Nuxt 4 con el layout de carpetas estándar: `pages/` (ruteo por archivo), `components/` (organizados por
dominio: `contratos/`, `personas/`, `recaudo/`, `recibos/`, `layout/`, `shared/`, `ui/`), `stores/`
(Pinia), `middleware/` (`auth.global.ts`, ejecución en cada navegación), composables (`useApiFetch`,
`useListadoPaginado`, `useFormatoCO`, `usePersonasDirectorio`, entre otros — inventario parcial, ver §29).

`middleware/auth.global.ts`: no-op en servidor (SSR), gatea cliente por autenticación y por rol —
mantiene un arreglo `rutasSoloAdmin` que incluye `/recaudo`, `/reportes`, `/administracion`, `/configuracion`,
`/movimientos`, `/auditoria`, `/recibos/` (**con barra final**), `/caja`, `/cartera`, `/gastos`,
`/depositos`, `/transferencias`. El check es `to.path.startsWith(r)`: como la entrada es `/recibos/`
y no `/recibos`, el listado `/recibos` (dual-rol: muestra solo recibos de novedad al Recepcionista)
**NO** queda gateado como exclusivo-admin — es intencional, solo lo son las rutas hijas tipo
`/recibos/:id`. Verificado por lectura completa del archivo (47 líneas).

## 4. Stack tecnológico

| Capa | Tecnología | Nota |
|---|---|---|
| Framework | Nuxt 4 | Confirmado en README y `package.json` (`^4.0.0`) |
| UI | Vue 3 + `@nuxt/ui` v2 | Deliberadamente **no** migrado a v3 (evitaría reescribir `UFormGroup`→`UFormField`, `#col-data`→`#col-cell`, etc.) |
| Estado | Pinia | |
| Estilos | Tailwind, gestionado internamente por `@nuxt/ui` | **No** vía `@nuxtjs/tailwindcss` separado — esa combinación causó un error de build real, ya corregido (13-ago-2026, ver README) |
| Testing | Vitest + `@vue/test-utils` + `@nuxt/test-utils` + `happy-dom` | Wired y funcional; solo 1 spec real |

## 5. Componentes

Inventario confirmado por listado de directorio (no todos leídos en profundidad):

- `layout/`: `Header.vue`, `Sidebar.vue`.
- `contratos/`: `ModalReactivar.vue`, `ModalTerminar.vue`.
- `personas/`: `FormularioPersona.vue` (compartido entre Clientes y Codeudores).
- `recaudo/`: `ModalAnularObligacion.vue`, `ModalLiquidarDeposito.vue`, `ModalPrevisualizacionPago.vue`, `ResumenAplicaciones.vue`.
- `recibos/`: `TablaRecibosNovedad.vue`.
- `shared/`: `ErrorState.vue`, `StatusBadge.vue` — componentes genéricos reutilizados de forma consistente (`SharedErrorState`, `SharedStatusBadge`) en prácticamente todas las páginas leídas.
- `ui/`: `ConfirmModal.vue`, `MoneyInput.vue`, `TableRowActions.vue`.

`ModalLiquidarDeposito.vue` fue leído completo: expone selector de tipo de descuento
(`USelectMenu` con opciones `['GENERAL', 'DEUDA']`) por cada línea de descuento — esto **refuta**
directamente el hallazgo "crítico" de `# AUDITORIA_SISTEMA.md` que decía que el frontend no permitía
elegir el tipo (ver detalle de reconciliación en §24 y en el documento de backend §21).

## 6. Rutas / páginas

17 áreas confirmadas por listado de directorio de `pages/`: `login`, `dashboard`, `clientes` (+`[id]`),
`codeudores`, `inmuebles` (+`[id]`), `contratos` (+`[id]`, `nuevo`), `recaudo`, `recibos` (+`[id]`),
`cartera`, `novedades` (+`nueva`), `gastos`, `caja`, `movimientos`, `transferencias`, `reportes`,
`configuracion`, `administracion`, `auditoria`. `propietarios` **no aparece como página independiente**
en el listado de `pages/` confirmado — el CRUD de propietarios existe en el backend, pero no se confirmó
una página dedicada en frontend; el selector de propietario aparece embebido en formularios de inmueble
según los documentos previos. **NO DETERMINADO con certeza total** — no se leyó `pages/inmuebles/[id].vue`
ni `nuevo.vue` de inmuebles en esta pasada para confirmar si el CRUD completo de propietario vive ahí o si
falta una pantalla dedicada.

Páginas leídas completas en esta auditoría: `contratos/index.vue`, `clientes/index.vue`,
`cartera/index.vue`, `administracion/index.vue`, `configuracion/index.vue`. El resto se confirmó por
existencia/tamaño de archivo, no por lectura línea a línea — ver cobertura exacta en §27.

## 7. Estado (Pinia)

`stores/auth.store.ts` (114 líneas, leído completo): persiste sesión en `localStorage` bajo la clave
`tamara_saenz_sesion`, nunca persiste la contraseña. `cerrarSesion()` tiene un `catch` vacío documentado
(hallazgo histórico AUD-012) — confirmado que sigue así; es una decisión consciente (no bloquear el logout
del cliente aunque la invalidación en servidor falle), documentada como tal en comentarios.

Las auditorías previas mencionaban 3 stores de Pinia no usados, recomendados para eliminar — el estado
actual de esos stores **no fue re-verificado archivo por archivo** en esta pasada (se confirmó
indirectamente por lo que reportaba `AUDITORIA_INTEGRAL_UX_UI_FRONTEND.md` como ya resuelto, pero no se
volvió a listar el directorio `stores/` completo). **NO DETERMINADO con certeza total.**

## 8. Servicios / composables

Confirmados por uso repetido en el código leído: `useApiFetch` (wrapper de fetch autenticado con manejo de
refresh token), `useListadoPaginado` (paginación estándar, usado en Contratos, Clientes, Cartera,
Administración/Usuarios), `useFormatoCO` (formato de moneda/fecha colombiano — `moneda()`, `fecha()`),
`usePersonasDirectorio` (lógica compartida de CRUD para Clientes/Codeudores, incluyendo edición, baja,
reactivación). No se leyó el código interno de ninguno de estos composables — se confirmó su
comportamiento por cómo se consumen desde las páginas, no por lectura directa de su implementación.
**NO DETERMINADO** el detalle interno exacto de cada uno.

## 9. Integración con la API

`useApiFetch` centraliza las llamadas HTTP con el backend (bearer token, refresco ante expiración, según
`# AUDITORIA_SISTEMA.md` §14.1 y confirmado indirectamente por el patrón de uso en todas las páginas
leídas). No existe cliente generado desde OpenAPI/Swagger ni paquete de tipos compartido — se confirma el
patrón `useApiFetch<any>(...)` en múltiples páginas (p. ej. `administracion/index.vue`,
`novedades relacionadas`), lo que es la causa raíz del hallazgo de tipado débil (§20).

## 10. Flujo de datos

Patrón consistente en las páginas CRUD leídas (Contratos, Clientes, Administración/Usuarios): composable
de listado paginado (`useListadoPaginado`) → tabla (`UTable`) con slots por columna → modal de
creación/edición → `useApiFetch` con método explícito → recarga de la lista tras éxito. Acciones sensibles
(desactivar usuario, dar de baja cliente) piden confirmación vía `UiConfirmModal`; acciones reversibles
(reactivar) no piden confirmación — patrón deliberado y consistente en todo el código leído.

## 11. Formularios y validaciones

Los formularios usan `@nuxt/ui` (`UFormGroup`, `UInput`, `USelectMenu`, `UTextarea`) sin una capa de
validación de esquema centralizada visible en el código leído (no se encontró Zod/Yup ni
`class-validator`-equivalente en frontend); la validación es manual por campo (p. ej.
`formularioValido` computado en `usePersonasDirectorio`, no leído en detalle) o por `:disabled` condicional
en el botón de envío (p. ej. `ModalLiquidarDeposito.vue`: deshabilita "Liquidar" si hay devolución por
transferencia sin referencia). **NO DETERMINADO** si existe una librería de validación de esquema en algún
formulario no leído.

## 12. UX funcional

- Patrón de acciones consistente: "Ver" siempre disponible; "Editar"/"Baja"/"Reactivar" gateadas por
  `auth.esAdministrador` donde el rol lo exige (confirmado en Clientes; se asume el mismo patrón en
  Codeudores por el uso del mismo composable `usePersonasDirectorio`, aunque `codeudores/index.vue` no fue
  leído línea a línea en esta pasada — **PROBABLE, no confirmado directamente**).
  RECEPCIONISTA sí puede crear clientes/codeudores/inmuebles/contratos, terminar contratos y registrar
  novedades — no editar. Esto coincide con la especificación de negocio vigente (§3.2), y **contradice**
  una "regla de negocio confirmada" citada por `AUDITORIA_UI_UX_FRONTEND.md` (hallazgo P1-01, que asumía
  que Recepcionista sí debía poder editar) — ver reconciliación en §24.
- Búsqueda con debounce en el listado de Contratos — mejora no documentada en ninguna auditoría previa,
  encontrada directamente en el código (`contratos/index.vue`).
- Generación manual de canon disponible desde Configuración, con modal de confirmación explícito y texto
  de advertencia ("Esta acción crea deuda cobrable de forma masiva") — buen ejemplo de UX defensiva para
  una acción de alto impacto.

## 13. Seguridad (frontend)

- Ningún dato sensible (contraseña, tokens de refresh) se persiste fuera de lo estrictamente necesario en
  `localStorage` (`auth.store.ts`, confirmado por lectura completa).
- La subida de logo restringe el `accept` del `<input type="file">` a `image/png,image/jpeg` —
  **coincide exactamente** con lo que el backend permite (`empresa.controller.ts`, `MIME_PERMITIDOS`),
  contradiciendo el hallazgo histórico de que la UI ofrecía SVG.
- Gating de rutas por rol vía middleware global (`auth.global.ts`) es defensa en profundidad de UX, no de
  seguridad real — la seguridad real vive en el backend (`RolesGuard`, fail-closed); esto es correcto
  arquitectónicamente (nunca confiar en el frontend para autorización), y así está documentado en el propio
  código backend.

## 14. Autenticación y autorización (frontend)

`middleware/auth.global.ts`: no-op en SSR (evita falsos negativos de hidratación), en cliente valida sesión
y redirige si la ruta requiere Administrador y el usuario no lo es. `auth.store.ts` expone
`esAdministrador` como el punto único de verdad para gating de UI, consumido consistentemente en las
páginas leídas (Clientes, Administración, layout de Sidebar por inferencia).

## 15. Manejo de errores

Patrón consistente en todas las páginas leídas: `try/catch` alrededor de cada llamada `useApiFetch`,
mensaje de error tomado de `e?.data?.message` con un fallback genérico en español, mostrado vía
`SharedErrorState` con botón de reintento (`@retry`). Es un patrón repetido casi idéntico en Contratos,
Clientes, Cartera, Administración — buena señal de consistencia, no de código duplicado accidental (mismo
componente compartido).

## 16. Fechas

`useFormatoCO().fecha()` centraliza el formato de fecha visual. **VERIFICADO — sin bug de timezone**:
`composables/useFormatoCO.ts` detecta el formato `YYYY-MM-DD` (columnas `type: 'date'` del backend,
sin hora) y construye el `Date` con sus componentes Y-M-D directos (`new Date(año, mes-1, día)`, hora
local), exactamente el mismo patrón seguro que usa el backend — nunca pasa ese string crudo al
constructor `new Date(string)` (que lo interpretaría como medianoche UTC y, en Bogotá UTC-5, mostraría
el día calendario anterior).

## 17. Dinero / cálculos

`useFormatoCO().moneda()` centraliza el formato visual; los cálculos de dinero reales (aplicación de pago,
saldo a favor, descuentos de depósito) viven exclusivamente en el backend — el frontend solo muestra el
resultado (`ModalPrevisualizacionPago.vue`/`ResumenAplicaciones.vue` consumen la respuesta de
`POST /recaudo/pagos/simular`, no reimplementan la lógica). Esto es correcto: garantiza que la
previsualización y el pago real usen exactamente la misma función de negocio (`calcularPlanAplicacion()`
del backend), sin riesgo de que el frontend calcule algo distinto.

## 18. Problemas de integración Backend↔Frontend

- **Tipado**: uso extendido de `any` en los módulos más sensibles (recaudo, administración) — confirmado
  directamente en el código (`useListadoPaginado<any>`, `useApiFetch<any>`). Sin cliente generado desde
  OpenAPI, cualquier cambio de forma en la respuesta del backend puede romper el frontend en tiempo de
  ejecución sin que TypeScript lo detecte en tiempo de compilación. **CONFIRMADO, SIGUE VIGENTE**,
  severidad **MEDIA** dado que es una herramienta interna con equipo pequeño (el radio de explosión de un
  cambio de contrato roto es bajo, pero el costo de detectarlo tarde es real).
- **`ModalLiquidarDeposito.vue` vs. backend**: alineados hoy (ambos soportan tipo de descuento) — el
  hallazgo histórico de desalineación está **corregido**.
- **`configuracion/index.vue` vs. `empresa.controller.ts`**: alineados hoy (`saldoInicialCaja` expuesto en
  ambos lados, MIME de logo idéntico en ambos lados).
- **`novedades/index.vue` vs. `novedades.controller.ts`**: **desalineados** — el backend expone
  `PATCH /novedades/:id/revertir-aprobacion` y el frontend no tiene ningún control para invocarlo
  (confirmado por búsqueda de texto "revertir" sin resultados en el archivo completo). Ver UX-NOV-01 en el
  documento de backend §18, mismo hallazgo desde este lado.

## 19. Rendimiento

No se auditó performance de renderizado ni tamaño de bundle. Observación de diseño: `useListadoPaginado`
se usa consistentemente para listados grandes (Contratos, Clientes, Cartera, Usuarios), evitando cargar
todo el dataset de una vez — patrón correcto. Los listados no paginados del lado backend (§16 del
documento de backend: propietarios/todos, inmuebles/disponibles, barrios) se consumen desde el frontend
para poblar selectores de formulario, lo cual es razonable mientras el volumen sea bajo.

## 20. Testing

**Gap real y confirmado**: Vitest está correctamente configurado (`@vue/test-utils`, `@nuxt/test-utils`,
`happy-dom`, script `test` en `package.json`) pero solo existe **un** archivo de prueba en todo el
frontend: `tests/depositos-liquidacion.spec.ts`. El hallazgo histórico "TEST-01: 0% cobertura" es **falso
hoy en el sentido literal** (sí hay infraestructura y al menos un test corriendo), pero **sustancialmente
sigue vigente en espíritu**: no hay pruebas para los flujos más sensibles (registrar pago, simular pago,
excedente/saldo a favor, anular recibo, permisos por rol, arqueo de caja). Reclasificado como
**PARCIALMENTE CORREGIDO**, no CORREGIDO — la infraestructura existe, la cobertura real no.

## 21. Bugs encontrados (aún vigentes, confirmados en esta pasada)

1. **UX-NOV-01** (mismo hallazgo que en el documento de backend, visto desde este lado): la acción de
   revertir aprobación de una novedad, disponible en el backend, no tiene ningún control en
   `novedades/index.vue`. Severidad **BAJA**.
2. **Gap de cobertura de pruebas en flujos financieros críticos** (§20) — no es un bug de comportamiento
   sino un riesgo de regresión no detectada. Severidad **MEDIA** dado que recaudo es el módulo más grande
   y crítico del sistema (819 líneas en el backend) y solo tiene un spec de frontend, sobre depósitos, no
   sobre el flujo de pago general.

No se encontraron bugs de comportamiento incorrecto (cálculo erróneo, estado inconsistente en pantalla)
en las páginas leídas directamente.

## 22. Vulnerabilidades

Ninguna encontrada en el código leído. El frontend no maneja secretos más allá del token de sesión en
`localStorage` (aceptable para una SPA de este tipo). **CONFIRMADO** — leído `nuxt.config.ts` completo:
no define `routeRules` ni cabeceras de seguridad vía Nitro, ni el módulo `nuxt-security` (`modules` es
solo `['@nuxt/ui', '@pinia/nuxt', '@nuxt/eslint']`). No hay CSP ni cabeceras de seguridad configuradas
en el servidor Nuxt — riesgo real dado que los tokens viven en `localStorage`. *(El fix es un plan
aparte — routeRules de Nitro o `nuxt-security` — no de esta limpieza de documentación.)*

## 23. Deuda técnica

- Uso extendido de `any` en módulos financieros (§18) — el hallazgo de deuda técnica más consistente y
  repetido en las tres fuentes históricas, confirmado de forma independiente en esta pasada.
- Ausencia de contratos TypeScript generados desde el backend.
- Cobertura de pruebas mínima en flujos críticos (§20).
- Enums de negocio (estados de contrato, tipos de obligación, medios de pago, tipos de descuento) se
  duplican manualmente como arrays de strings en el frontend (p. ej. `['GENERAL', 'DEUDA']` en
  `ModalLiquidarDeposito.vue`, `['ADMINISTRADOR', 'RECEPCIONISTA']` en `administracion/index.vue`) en vez
  de importarse desde un paquete compartido — confirmado directamente, consistente con la ausencia de
  tipos compartidos.

## 24. Hallazgos históricos: reconciliación

**`AUDITORIA_UI_UX_FRONTEND.md`**: auditoría de cumplimiento contra la especificación UI/UX y el mockup.
Documenta hallazgos P1-01 a P1-07 y P2-01 a P2-09, con una auditoría página por página que en el material
entregado solo cubre Login/Registro/Dashboard/Inmuebles (el resto del archivo, ~62KB, no fue leído
completo en esta pasada — ver §27). De lo verificable:

- **P1-01** ("Recepcionista no puede editar Clientes/Codeudores, contradiciendo regla de negocio
  confirmada"): la especificación de negocio vigente hoy (`ESPECIFICACION_MAESTRA_NEGOCIO.md` §3.2) dice
  explícitamente que Recepcionista **no** edita. El comportamiento actual del código coincide con la
  especificación vigente. **Reclasificado: el hallazgo original está OBSOLETO** — probablemente la "regla
  de negocio confirmada" que citaba era una versión anterior de la especificación que luego cambió. Esto se
  deja como una discrepancia documental a validar con el dueño de negocio (§28), no como un bug a corregir.
- Elementos "faltantes" que las auditorías previas señalaban (páginas de detalle, Cartera, Gastos,
  Depósitos, Transferencias, Administración, `StatusBadge`, `useListadoPaginado`, limpieza de stores no
  usados): **todos confirmados como implementados** hoy, por existencia directa de archivo y/o lectura de
  contenido.
- Clasificación: **HISTÓRICO / SUSTANCIALMENTE SUPERADO.**

**`AUDITORIA_INTEGRAL_UX_UI_FRONTEND.md`**: auditoría de calidad "sin techo", recomienda componentes y
composables compartidos — varios de los recomendados (`useListadoPaginado`, `SharedStatusBadge`,
`SharedErrorState`) están **confirmados en uso real** hoy. Misma clasificación:
**HISTÓRICO / SUSTANCIALMENTE SUPERADO.**

Ninguna de las dos auditorías fue leída al 100% (cada una tiene entre 62KB y 80KB; se leyeron los primeros
~150 renglones de cada una más las secciones de recomendaciones ya verificadas indirectamente por
comparación de código). El resto de cada documento **no fue re-verificado línea a línea** — ver §27.

## 25. Riesgos

1. El riesgo estructural de mayor superficie es el mismo que en backend: ausencia de tipado compartido
   (§18, §23) — no causa bugs por sí solo, pero elimina la red de seguridad de compilación ante cambios de
   contrato de API.
2. Cobertura de pruebas mínima en el módulo financiero más grande y crítico (recaudo) es el segundo riesgo
   de mayor superficie — cualquier regresión en la aplicación de pagos, saldo a favor o liquidación de
   depósito no sería detectada automáticamente antes de llegar a producción.
3. Riesgo bajo, aislado: `UX-NOV-01` — no expone una capacidad ya protegida por el backend, así que el
   peor caso es un Administrador que no puede revertir una aprobación sin pasarlo por soporte/base de
   datos directamente.

## 26. Dependencias críticas

`nuxt` (^4.0.0), `vue` 3.x, `@nuxt/ui` v2.x (deliberadamente no v3), `pinia`, `vitest`,
`@vue/test-utils`, `@nuxt/test-utils`, `happy-dom`. No se ejecutó auditoría de vulnerabilidades de
dependencias — **NO DETERMINADO**.

## 27. Estado de la auditoría

Cobertura profunda y verificada por lectura directa: `auth.store.ts`, `middleware/auth.global.ts`,
`pages/contratos/index.vue`, `pages/clientes/index.vue`, `pages/cartera/index.vue`,
`pages/administracion/index.vue`, `pages/configuracion/index.vue`,
`components/recaudo/ModalLiquidarDeposito.vue`, búsqueda de texto dirigida en
`pages/novedades/index.vue`. `package.json` leído completo.

Cobertura NO alcanzada en esta pasada (declarado explícitamente): el resto de páginas de detalle y
`nuevo`/`nueva` (inmuebles, contratos, novedades, recibos), `pages/dashboard/index.vue`,
`pages/movimientos/index.vue`, `pages/caja/index.vue`, `pages/transferencias/index.vue`,
`pages/gastos/index.vue`, `pages/codeudores/index.vue`, `pages/depositos/index.vue`,
`pages/recaudo/index.vue` (32KB, el archivo más grande de todo el frontend, no leído — candidato de
mayor prioridad para una siguiente pasada dado que es la pantalla de mayor complejidad financiera),
`pages/reportes/index.vue`, `pages/auditoria/index.vue`, `components/layout/Sidebar.vue`,
`components/layout/Header.vue`, `components/contratos/ModalReactivar.vue` y `ModalTerminar.vue`,
`components/recaudo/ModalAnularObligacion.vue` y `ModalPrevisualizacionPago.vue` y
`ResumenAplicaciones.vue`, `components/recibos/TablaRecibosNovedad.vue`, `components/ui/*`, todos los
composables en detalle interno, `nuxt.config.ts`, `app.config.ts`, `tailwind.config.ts`,
`ESPECIFICACION_UI_UX_PAGINA_POR_PAGINA.md` completo, y el resto (>80%) de ambas auditorías UX/UI previas.

## 28. Preguntas / incertidumbres abiertas

1. La discrepancia entre el hallazgo histórico P1-01 (que asumía que Recepcionista debía poder editar
   Clientes/Codeudores) y la especificación de negocio vigente (que dice que no) — **requiere confirmación
   del dueño de negocio** sobre cuál es la regla correcta hoy; el código actual sigue la especificación
   vigente, pero como con la contradicción §10/§11 del lado backend, esto amerita una decisión de negocio
   explícita, no solo inferencia de código.
2. ¿Existe una página dedicada de Propietarios en frontend, o el CRUD vive embebido en formularios de
   Inmueble? — **NO DETERMINADO**, no confirmado en esta pasada (§6).
3. Contenido interno de `useApiFetch`, `useListadoPaginado`, `usePersonasDirectorio` y `useFormatoCO`:
   **NO DETERMINADO** en detalle — se infirió su comportamiento por consumo, no por lectura de
   implementación.
4. `pages/recaudo/index.vue` (32KB, la pantalla más grande y financieramente más crítica del frontend) no
   fue leída — es el candidato de mayor prioridad si se requiere certeza total sobre la UI de recaudo antes
   de la fase de corrección.

## 29. Qué NO debe asumirse

- **No asumir** que las auditorías previas de UI/UX (`AUDITORIA_UI_UX_FRONTEND.md`,
  `AUDITORIA_INTEGRAL_UX_UI_FRONTEND.md`) describen el estado actual del frontend — describen una fase muy
  anterior del proyecto; la mayoría de sus hallazgos de "página faltante" o "componente faltante" ya no
  aplican.
- **No asumir** que Recepcionista debería poder editar Clientes/Codeudores solo porque una auditoría
  antigua lo daba por hecho — la especificación de negocio vigente y el código actual dicen lo contrario;
  esto requiere confirmación de negocio, no un cambio de código unilateral.
- **No asumir** que existe cobertura de pruebas real en los flujos financieros del frontend solo porque
  Vitest está configurado — solo hay un spec, sobre depósitos.
- **No asumir** que `ESPECIFICACION_UI_UX_PAGINA_POR_PAGINA.md` vive en el repo correcto — está físicamente
  dentro del repo backend (`documentacion/backendocu/frontendocu/`), un problema de organización a
  corregir en una limpieza de housekeeping, no de contenido.
- **No asumir** que el archivo `story.md`, encontrado en la misma carpeta `frontendocu/` dentro del repo
  backend, tiene alguna relación con este sistema — es contenido huérfano de un proyecto no relacionado
  ("Cat_Lily", un guion de video), confirmado por lectura completa; candidato de eliminación segura una vez
  se verifique que nada lo referencia.
- **No modificar código, componentes, rutas, dependencias ni configuración a partir de este documento sin
  una fase de corrección separada y explícitamente autorizada** — este documento es
  DESCUBRIR → DOCUMENTAR → VALIDAR, no CORREGIR.
