# Auditoría Integral del Frontend + Plan de Acción
## Inversiones Tamara & Saenz S.E.N.C.

**Encuadre de esta auditoría:** a diferencia de la auditoría de cumplimiento previa (`AUDITORIA_UI_UX_FRONTEND.md`), este informe **no protege nada por el solo hecho de que ya funcione**. Cada pantalla, incluidas las que ya cumplen la especificación y manejan dinero correctamente, se evalúa buscando una versión superior en UX, UI, arquitectura, accesibilidad, responsive y mantenibilidad. Lo único que se preserva sin negociación son las **garantías de negocio**: integridad financiera, autorización, trazabilidad, estados válidos y reglas de aplicación de dinero — y solo su *comportamiento*, no necesariamente su *presentación actual*.

Esta etapa **no modifica código**. Es inspección, comparación, priorización y diseño de plan.

**Fuentes:** repositorio completo de `FrontendTamara-Saenz` (26 archivos de código inspeccionados), `ESPECIFICACION_UI_UX_PAGINA_POR_PAGINA.md`, el mockup de 11 tarjetas de referencia, el logo/identidad ya incorporados, y las reglas de negocio ya confirmadas por el usuario en sesiones previas de este proyecto (roles, estados de Contrato, política de excedente, patrón de trazabilidad financiera) — estas últimas se tratan como restricciones de negocio válidas, no como algo a re-litigar.

---

# 1. Resumen ejecutivo

El frontend actual resuelve correctamente el problema financiero difícil (recaudo, caja, trazabilidad) pero **no ha llegado a su techo de calidad** en ninguna de las dimensiones evaluadas — ni siquiera en las áreas mejor construidas. Tres ideas centrales:

1. **La corrección funcional y la calidad de experiencia son ejes distintos.** El sistema es funcionalmente sólido (~80% de cumplimiento financiero) pero visualmente y arquitectónicamente se quedó en "funciona" en vez de llegar a "es la mejor forma de hacerlo". Ejemplo: la previsualización de Recaudo es técnicamente ejemplar (se calcula en backend), pero su presentación no resuelve tan bien como podría la pregunta explícita de la especificación — "¿Canon, Novedad y Mora se entienden inmediatamente?" — porque solo distingue "Capital" vs. "Mora", no los tres conceptos.
2. **La arquitectura tiene una deuda de duplicación sistemática, no solo puntual.** El mismo patrón (búsqueda + filtros + paginación + tabla + mapa de color de estado) está reescrito a mano en al menos 10 páginas distintas, con variaciones menores entre copias. No es un problema de "un archivo desordenado": es una decisión de arquitectura ausente (no existe un composable de listado paginado, ni un `StatusBadge`, ni un `FilterBar`).
3. **Hay decisiones de producto reales sin resolver que determinan cuánto del trabajo de mejora es "pulir" y cuánto es "construir".** La más grande: si Obligaciones, Cartera, Gastos, Depósitos y Transferencias deben ser módulos propios (como en la especificación y el mockup) o si la fusión actual dentro de Recaudo/Novedades/Movimientos es, en sí misma, la arquitectura de información correcta para este negocio. Este informe **no toma esa decisión** — la aísla como bloqueante en la sección 19 y en la Fase 3 del plan.

**Lectura de negocio:** no se necesita una reescritura. Se necesita (a) una capa de componentes y patrones compartidos que hoy no existe, (b) llevar el detalle de entidades (Contrato, Cliente, Inmueble) de "no existe" a "existe", (c) resolver el responsive real, y (d) una decisión explícita de producto sobre el mapa de módulos financieros. Con esos cuatro movimientos, el sistema pasa de "funciona bien para quien ya lo conoce" a "se explica solo".

---

# 2. Diagnóstico general

| Eje | Diagnóstico | Techo de mejora disponible |
|---|---|---|
| Corrección funcional | Alta — sin bugs financieros detectados, sin botones "Eliminar" genéricos, sin ediciones en sitio de registros financieros | Bajo — no es aquí donde está el mayor valor de mejora |
| Experiencia (UX) | Media — los flujos son correctos pero lineales y con fricción evitable (búsquedas que exigen Enter/clic, sin autocompletar, sin accesos directos entre módulos relacionados) | Alto |
| Interfaz (UI) | Media-alta — paleta e identidad correctas y centralizadas, pero cada pantalla decide por sí misma cómo pintar un estado o un monto | Alto |
| Arquitectura de información | Media-baja — múltiples módulos de la especificación fusionados sin una decisión explícita documentada de que esa fusión es definitiva | Alto (depende de decisión de producto) |
| Mantenibilidad | Media — sin código muerto peligroso, pero con duplicación sistemática y stores de Pinia sin conectar | Alto |
| Responsive | Baja — diseñado desktop-first sin adaptación real a tablet/móvil | Alto |
| Accesibilidad | Media — buena base semántica (`UFormGroup`, badges color+texto) pero inconsistente en botones de ícono | Medio |
| Seguridad percibida (permisos en UI) | Alta, con una regresión puntual verificada (Clientes/Codeudores) | Bajo, salvo esa corrección puntual |

**Conclusión del diagnóstico:** el mayor retorno de inversión no está en "arreglar lo que está mal" (hay poco de eso) sino en **construir la capa de consistencia que nunca se construyó** — componentes compartidos, páginas de detalle, y responsive real — y en **tomar la decisión de producto pendiente sobre módulos financieros** antes de seguir construyendo sobre la fusión actual sin haberla validado explícitamente.

---

# 3. Arquitectura actual

**Stack:** Nuxt 3 (Vue 3 + file-based routing) + `@nuxt/ui` (Tailwind) + Pinia + TypeScript ligero (tipos `any` en la mayoría de datos de API).

**Estructura de carpetas:**
```
pages/            19 páginas reales, organizadas por módulo (carpeta = módulo)
components/
  layout/         Sidebar.vue, Header.vue
  ui/             ConfirmModal.vue, TableRowActions.vue
composables/      useApiFetch, useFormatoCO, useMarcaEmpresa, useExcelExport, usePdfDownload
stores/           auth.store.ts (en uso), contratos.store.ts, novedades.store.ts, filtros.store.ts (NINGUNO en uso)
middleware/       auth.global.ts (única fuente de verdad de rutas exclusivas de Administrador)
layouts/          default.vue (Sidebar + Header + slot, sin variantes)
```

**Patrones ya establecidos y consistentes (evaluados como CORRECTAMENTE ESTRUCTURADO):**
- `useApiFetch`: inyecta el Bearer token y reintenta automáticamente tras refrescar sesión en un 401 — patrón centralizado y bien resuelto, usado en el 100% de las llamadas.
- `useFormatoCO`: formato de moneda y fecha centralizado — usado consistentemente en todas las pantallas que muestran dinero.
- `useMarcaEmpresa`: resuelve nombre/slogan/logo desde un endpoint público, con fallback estático — reutilizado en Login, Registro y Sidebar sin duplicación.
- `middleware/auth.global.ts`: única fuente de verdad para rutas exclusivas de Administrador (`rutasSoloAdmin`), consumida además por el filtrado del Sidebar — dos consumidores, una sola definición real de qué es "admin-only" a nivel de negocio (el arreglo del Sidebar es una lista de etiquetas visuales, pero el middleware es quien realmente bloquea).

**Patrones DUPLICADOS (mismo problema resuelto N veces, de forma independiente):**
- Paginación + filtros + carga: reescrito de cero en Inmuebles, Clientes, Codeudores, Contratos, Novedades, Recibos, Movimientos, Auditoría, Caja (arqueos), Administración (usuarios) — 10 copias del mismo patrón `page/limit/total/cargando/filtros + watch + cargar()`.
- Mapas `estadoColor: Record<string, color>`: 6 copias (Inmuebles, Contratos, Novedades, Recibos, Movimientos, Caja).
- Modal de crear/editar con `reactive(formulario)` + `resetearFormulario()` + `abrirCreacion()/abrirEdicion()`: patrón casi idéntico entre Clientes y Codeudores (más de 100 líneas prácticamente calcadas entre los dos archivos).

**CÓDIGO SIN USO (frágil por definición — nadie lo prueba porque nadie lo ejecuta):**
- `stores/contratos.store.ts`, `stores/novedades.store.ts`, `stores/filtros.store.ts`: definidos, nunca importados. Es deuda técnica de alto riesgo silencioso: si un desarrollador futuro los retoma asumiendo que están conectados, introducirá una segunda fuente de verdad sin darse cuenta.

**OPORTUNIDAD DE REFACTORIZACIÓN de mayor impacto:** extraer un composable `useListadoPaginado(endpoint, filtrosIniciales)` que encapsule el 90% del patrón duplicado arriba. Esto no es limpieza cosmética: reduce de ~10 implementaciones a 1 el lugar donde se corrige un bug de paginación o se cambia el comportamiento de búsqueda.

**FRÁGIL (podría causar problemas futuros aunque hoy funcione):**
- `Header.vue` expone un slot `#titulo` que ninguna página usa — cualquier intento futuro de "personalizar el título por página" fallará silenciosamente porque el mecanismo ya existe pero está desconectado, y quien lo encuentre asumirá que ya funciona.
- Clientes/Codeudores/Inmuebles/Contratos no tienen ruta de detalle — toda navegación relacionada (ej. "ver el contrato de este cliente") no tiene a dónde apuntar, lo que empuja a soluciones ad hoc (como el enlace directo `/recaudo?contratoId=` desde el detalle de un Recibo) que funcionan pero no son un patrón generalizable a otras relaciones entre entidades.

**RIESGOSO (podría afectar operaciones sensibles si se toca sin cuidado):**
- El candado de estado `OCUPADO` en Inmuebles y la derivación del día de pago en Contrato Nuevo (ambos documentados con comentarios `CONT-03`/`CONT-04` en el propio código) son reglas sutiles que darían la impresión de ser simples `if` a un refactor apresurado.

---

# 4. Arquitectura recomendada

No se recomienda cambiar de framework ni de librería de componentes — `@nuxt/ui` + Tailwind ya está bien alineado con la identidad de marca (`app.config.ts` fija `primary: amber, gray: slate`). Se recomienda **completar** la arquitectura, no reemplazarla:

## 4.1 Rutas
Agregar páginas de detalle como rutas dinámicas, siguiendo el patrón que Recibos ya demuestra que funciona bien en este proyecto (`pages/recibos/[id].vue`):
- `pages/contratos/[id].vue` — máxima prioridad (ver Fase 2).
- `pages/clientes/[id].vue`, `pages/inmuebles/[id].vue` — prioridad media.
- `pages/codeudores/[id].vue` — solo si el negocio confirma que se necesita más allá del modal actual (bajo impacto, dado que Codeudor es una entidad simple).

## 4.2 Componentes compartidos nuevos
| Componente | Reemplaza | Prioridad |
|---|---|---|
| `components/shared/StatusBadge.vue` | 6 mapas `estadoColor` duplicados | Alta |
| `components/shared/PageHeader.vue` | Markup de `<h1>` + botón de acción repetido en 19 páginas | Alta |
| `components/shared/ErrorState.vue` (con botón "Reintentar") | `UAlert` estático sin acción, repetido en 19 páginas | Alta |
| `components/shared/FilterBar.vue` (slot-based) | Filtros duplicados en Inmuebles/Contratos/Novedades/Recibos/Movimientos | Media |
| `components/shared/MoneyValue.vue` | Decisiones de color de dinero repetidas en cada pantalla | Media |
| `components/shared/Breadcrumbs.vue` | Inexistente hoy | Media |
| `components/shared/ExportButton.vue` | Lógica inline en Reportes | Baja |

## 4.3 Composables nuevos
- `composables/useListadoPaginado.ts`: encapsula `page/limit/total/cargando/error/filtros + watch + cargar()`. Es el cambio de arquitectura de mayor apalancamiento de todo este informe — toca 10 páginas pero con riesgo bajo (es extracción, no reescritura de lógica).
- `utils/estados.ts` (o `composables/useEstados.ts`): diccionario único `{ dominio: { estado: { color, label } } }` consumido por `StatusBadge`.

## 4.4 Stores de Pinia
**Decisión recomendada:** eliminar `contratos.store.ts`, `novedades.store.ts` y `filtros.store.ts`. No hay evidencia en el dominio de que dos componentes necesiten compartir simultáneamente la lista de contratos o de novedades (no hay, por ejemplo, un widget de "contratos recientes" en otra pantalla que necesite el mismo estado que el listado principal) — el problema real que estos stores intentaban resolver es el de listado paginado repetido, y ese problema se resuelve mejor con el composable `useListadoPaginado` (§4.3) que con Pinia, porque un composable no implica estado global persistente entre navegaciones (evita mostrar datos obsoletos de una página anterior al volver a entrar). Marcado como **REFACTORIZAR**, riesgo bajo (los stores no están conectados a nada, así que eliminarlos no cambia ningún comportamiento observable).

## 4.5 Layout
Extender `layouts/default.vue` para soportar un sidebar tipo drawer en móvil (ver sección 8) y para que cada página inyecte su título real en el header (resolviendo el slot muerto de §3).

---

# 5. Auditoría visual

**Layout:** sidebar de ancho fijo, header simple, contenido con `padding` uniforme (`p-6`) — consistente en las 19 páginas. **MEJORAR:** no hay breadcrumb ni indicador de sección activa más allá del resaltado del ítem del sidebar; en pantallas con muchos niveles de contexto (ej. Recaudo → ficha de un contrato específico) el usuario pierde de vista "cómo llegó aquí" si navega por enlace directo (como el que ofrece Recibo → "Ver ficha del contrato").

**Tipografía:** jerarquía simple pero funcional (`text-xl font-semibold` para títulos de página, `text-sm`/`text-xs` para metadatos) — consistente. **MEJORAR:** los montos de dinero no tienen una jerarquía tipográfica diferenciada de otros números (mismo peso/tamaño que un conteo o una fecha en varias tarjetas del Dashboard y Caja), lo que reduce el "golpe de vista" que una cifra financiera debería tener.

**Color:** paleta de marca (`#CFA052` dorado, `#4A4D52` grafito, `#1A1A1A` antracita) centralizada en `tailwind.config.ts` y espejada en `app.config.ts` de Nuxt UI — **CONSERVAR**, es una implementación ejemplar de "usar correctamente la identidad ya incorporada" tal como pide la Fuente 4. Los colores de estado (verde/ámbar/rojo/gris) son consistentes entre páginas a pesar de estar duplicados en código (ver §3) — el resultado visual final es correcto, el problema es solo de mantenibilidad, no de percepción del usuario hoy.

**Componentes:** botones, inputs, selects, modales y tablas usan consistentemente los primitivos de `@nuxt/ui` sin overrides visuales salvo en Login/Registro (donde se fuerza el color exacto de marca con `!bg-[#CFA052]` en vez de `color="amber"` de Nuxt UI). **MEJORAR:** esa inconsistencia puntual (hardcodear el hex en vez de usar el token `amber` ya mapeado a la marca) es menor pero vale la pena unificar — si la marca cambia de tono dorado, Login/Registro no se actualizarían junto con el resto.

**Densidad:** el Dashboard es el único lugar con densidad **insuficiente** (4 tarjetas simples, mucho espacio en blanco sin uso informativo) frente al resto del sistema, que tiende a una densidad correcta (tablas con la información necesaria, sin tarjetas decorativas). No se detectó saturación visual en ninguna pantalla — al contrario, el problema dominante es sub-utilización del espacio en Dashboard.

---

# 6. Auditoría UX

Aplicando las preguntas de la especificación a los flujos reales:

| Pregunta | Evaluación transversal |
|---|---|
| ¿El usuario sabe dónde está? | Parcial — el sidebar resalta la sección activa, pero el header no confirma el título de la página (slot muerto), y no hay breadcrumb para contexto anidado (ej. "Recaudo > Contrato C-00123"). |
| ¿Entiende qué está viendo? | Sí en general — las tablas tienen encabezados claros y los badges combinan color+texto. |
| ¿Sabe cuál es la acción principal? | Sí — cada listado tiene un botón primario (`color="amber"`) claramente distinguido de las acciones secundarias (`variant="ghost"/"soft"`). |
| ¿Sabe qué ocurrirá al ejecutar la acción? | Sí en operaciones financieras (alertas explícitas antes de confirmar); **mejorable** en acciones de bajo riesgo como "Editar", donde no hay problema, pero tampoco valor agregado. |
| ¿Puede cometer errores fácilmente? | Riesgo bajo pero no nulo: los inputs de dinero son `<UInput type="number">` sin formato de miles en vivo — es fácil digitar `50000` en vez de `500000` sin que la interfaz lo resalte hasta ver el total. |
| ¿El sistema previene esos errores? | Parcial — previene errores de estado (no se puede fijar `OCUPADO` manualmente, no se puede reactivar sin motivo) pero no previene errores de digitación de montos. |
| ¿Recibe feedback? | Sí en éxito (alertas verdes, recibo con excedente explicado) y en error (mensaje del backend); **falta** feedback de "reintentar" (ver §16, P1-06 de la auditoría previa, que se mantiene vigente). |
| ¿Puede recuperarse de un error? | Sí en operaciones financieras (anular/reversar); parcial en errores de red (debe recargar la página completa, no solo reintentar la petición). |
| ¿Puede entender el estado actual de una entidad? | Sí a nivel de badge; **no** a nivel de historial — sin página de detalle no hay forma de ver "cómo llegó" una obligación o un contrato a su estado actual, salvo yendo a Auditoría y filtrando manualmente. |
| ¿Llega rápido a la siguiente acción? | Mixto — Recaudo permite llegar desde un Recibo a la ficha del contrato en un clic (buen ejemplo a replicar); pero no hay atajo equivalente desde Clientes/Inmuebles hacia sus contratos u obligaciones. |
| ¿La cantidad de pasos es razonable? | Sí en general. Contrato Nuevo tiene 4 bloques bien organizados, pero **le falta** el paso de vista previa final que la especificación pide explícitamente (§16) y que el propio patrón de Recaudo demuestra que el proyecto ya sabe construir bien. |
| ¿Existe una forma mejor de realizar la misma tarea? | Sí, puntualmente: la búsqueda de cliente/codeudor/inmueble en varios formularios exige presionar Enter o clic en "Buscar" — un patrón de autocompletar-mientras-se-escribe (debounce) reduciría fricción sin cambiar el backend. |

---

# 7. Auditoría de navegación

(Se mantiene válida la comparación de la auditoría previa; se agrega aquí el análisis de **experiencia** de navegación, no solo de nomenclatura.)

**Navegación entre entidades relacionadas — el punto más débil:** hoy, para ir de un Cliente a sus Contratos, o de un Inmueble a su Contrato activo, no existe un enlace directo — el usuario debe volver a buscar manualmente en el módulo correspondiente. La única excepción bien resuelta es Recibo → "Ver ficha del contrato" (enlace directo con `contratoId` en la query string). **Recomendación:** generalizar ese patrón de enlace-por-id en cuanto existan páginas de detalle (Fase 2), en vez de construir un mecanismo de navegación distinto para cada relación.

**Agrupación del sidebar:** funcionalmente clara (GENERAL/OPERACIÓN/DIRECTORIOS/FINANZAS/CONSULTA Y CONTROL/ADMINISTRACIÓN) pero mezcla dos criterios de agrupación distintos — "tipo de entidad" (DIRECTORIOS) y "tipo de proceso" (OPERACIÓN, FINANZAS) — lo cual es razonable mientras el número de módulos sea pequeño, pero se volverá confuso si se agregan Cartera/Gastos/Depósitos/Transferencias sin decidir antes en qué grupo caen conceptualmente. **DECISIÓN DE PRODUCTO PENDIENTE**, ligada a la sección 19.

**Nombres:** "Usuarios" en el sidebar apunta a la ruta `/administracion` — nombre de ruta heredado de una refactorización anterior (el propio código lo documenta: "antes se duplicaban aquí"). No genera confusión visible al usuario final, pero sí a cualquier desarrollador que navegue el código buscando "dónde está Usuarios".

---

# 8. Auditoría responsive

| Breakpoint | Estado actual | Qué debería mejorar exactamente |
|---|---|---|
| Desktop (≥1024px) | Correcto — sidebar fijo de 256px, tablas con todas las columnas, formularios en grillas de 2-3 columnas | Nivel de pulido ya aceptable; mejoras aquí son de refinamiento (Fase 6), no estructurales |
| Tablet (768-1023px) | Sin adaptación — mismo layout que desktop, columnas empiezan a competir por espacio en formularios de 3 columnas (ej. Configuración: "Días de gracia / % Mora / Horizonte") | Reducir a 2 columnas en este breakpoint; evaluar sidebar compacto (solo íconos) en vez de sidebar completo |
| Móvil (<768px) | Roto — el sidebar de 256px fijo no colapsa, no hay drawer, no hay botón de menú en el header; las tablas no tienen versión de tarjetas y dependen del scroll horizontal nativo de `UTable` | Implementar drawer + botón de menú (bloqueante para cualquier uso móvil real); definir un patrón de "tabla a tarjetas" para las ~13 tablas del sistema, aplicándolo primero donde el uso móvil sea más probable (Recaudo, Novedades — flujos de campo) |

**Dinero en móvil:** no se pudo evaluar en un viewport real (auditoría de código, no interactiva), pero por construcción (`UInput type="number"` de ancho fijo dentro de flexboxes con `class="w-40"` etc.) es probable que varios formularios (el de detalles de pago en Recaudo, por ejemplo, con 3 campos en fila) no colapsen a una columna en pantallas angostas. **Marcar para verificación visual antes de la Fase 5.**

---

# 9. Auditoría de accesibilidad

| Elemento | Cumple | Detalle |
|---|---|---|
| Labels de formulario | Sí | `UFormGroup label="..."` genera asociación label/input correctamente en el 100% de los formularios revisados |
| Contraste | Sí | Paleta slate/amber sobre fondos blancos/slate-50 cumple contraste razonable; no se detectaron combinaciones de texto claro sobre fondo claro |
| Estados no dependientes solo del color | Sí | Todos los `StatusBadge` ad hoc combinan color + texto |
| `aria-label` en botones de ícono | Parcial | Presente y bien implementado en el toggle mostrar/ocultar contraseña (Login/Registro); **ausente** en el botón de editar de Inmuebles, en el dropdown de `TableRowActions`, y en los botones de descarga de PDF con solo ícono en algunas tablas |
| Foco visible | No verificable desde código estático | Depende de los estilos por defecto de `@nuxt/ui`, que generalmente incluyen `focus-visible` — se recomienda verificación visual/manual antes de la Fase 5 |
| Navegación por teclado | No verificable desde código estático | Los componentes de Nuxt UI (`UModal`, `UDropdown`, `USelectMenu`) tienen soporte de teclado por defecto; no se detectó ningún `@click` sin equivalente de teclado que rompa ese soporte |
| Mensajes de error asociados al campo | Parcial | Login/Registro sí asocian error por campo (`erroresCampo.email`, etc.); el resto de formularios (Cliente, Codeudor, Inmueble, Contrato) solo muestran un `UAlert` general de error de guardado, sin señalar qué campo específico falló |

**Prioridad de mejora de accesibilidad:** replicar el patrón de validación por campo de Login/Registro en los formularios de Cliente/Codeudor/Inmueble (hoy solo validan mínimamente con `formularioValido` sin mensajes específicos por campo).

---

# 10. Auditoría de permisos

(Confirma y profundiza la auditoría previa.)

El patrón de doble capa (middleware de router + `v-if` en UI) es la decisión de arquitectura de permisos correcta y **debe conservarse como patrón**, aunque su ejecución tenga un defecto puntual:

- **Defecto verificado:** en Clientes y Codeudores, `TableRowActions` (Editar + Dar de baja/Reactivar) está envuelto en un único `v-if="auth.esAdministrador"`, ocultando Editar a Recepcionista — contradice la regla de negocio confirmada de que Recepcionista puede editar estas entidades. Clasificado **MEJORAR** (es un ajuste de una línea de condición, no un rediseño).
- **Patrón correcto a replicar en cualquier módulo nuevo:** separar siempre la visibilidad de cada acción según su propia regla de rol, en vez de agrupar varias acciones bajo una sola condición — el defecto anterior existe precisamente porque se agrupó "Editar" y "Dar de baja" bajo la misma condición cuando tienen dueños de decisión distintos.
- **No verificable desde el frontend:** la regla de que "Recepcionista no puede concluir una Novedad con impacto financiero pendiente" no tiene una acción de "cerrar novedad" visible en absoluto en `pages/novedades/index.vue` — puede estar resuelta enteramente en backend (aceptable, dado que "la seguridad real es responsabilidad del backend"), pero si existe una acción de cierre en alguna otra parte de la UI no cubierta por esta auditoría, debe verificarse que respete esa regla.

---

# 11. Auditoría financiera

Se reevalúan las operaciones financieras bajo el lente "funciona, pero ¿es la mejor experiencia posible?", no solo "¿es correcta?".

| Operación | Corrección (Datos→Revisión→Confirmación→Resultado) | Presentación financiera | Calificación |
|---|---|---|---|
| Registrar recaudo | Excelente — previsualización calculada en backend, nunca en cliente | Buena, mejorable — Canon/Novedad/Mora no aparecen como conceptos explícitos y diferenciados (solo Capital/Mora); la relación entre "dinero recibido" y "cómo se distribuyó" exige leer una tabla en vez de un resumen visual inmediato | MEJORAR (presentación), CONSERVAR (lógica) |
| Anular recibo | Correcta, con advertencia clara del efecto exacto | Buena — el mensaje de anulación es un estándar a replicar en otras pantallas | CONSERVAR |
| Terminar / Reactivar contrato | Correcta, con motivo obligatorio y explicación del efecto | Buena | CONSERVAR, con oportunidad menor: mostrar en el mismo modal el saldo pendiente actual del contrato (hoy hay que salir a Recaudo para verlo), para que la advertencia "seguirá siendo cobrable" tenga una cifra concreta al lado |
| Liquidar depósito | Correcta — descuentos desglosados, devolución condicionada | Buena | CONSERVAR |
| Reversar movimiento | Correcta, con explicación de que el original no se borra | Buena | CONSERVAR |
| Registrar arqueo de caja | Correcta en flujo; **incompleta** frente a la especificación (observación no obligatoria con diferencia≠0) | Buena — diferencia calculada en vivo con color según signo | MEJORAR |
| Aprobar cargo/gasto de Novedad | Correcta — nunca muestra "Pagado" al aprobar | Buena | CONSERVAR |

**Sobre "¿Canon/Novedad/Mora se entienden inmediatamente?" (pregunta explícita de la especificación, §15):** la respuesta honesta es **parcialmente**. El usuario puede inferirlo leyendo la columna "Concepto" de la tabla de aplicación (que trae el nombre real de la obligación, ej. "Canon Mayo 2025"), pero el sistema no ofrece un resumen agregado de "cuánto del pago fue a Canon, cuánto a Novedad, cuánto a Mora" — que es exactamente el formato de 3 líneas que pide el mockup textual de la especificación. Esto se clasifica **MEJORAR**, no **REEMPLAZAR**: la tabla detallada actual es más informativa para pagos que tocan varias obligaciones a la vez (algo que el formato de 3 líneas fijas no podría representar bien), así que la solución recomendada es **agregar** un resumen de 3 totales encima de la tabla detallada, no sustituir la tabla.

---

# 12. Auditoría página por página

> Aplicando la plantilla de 16 puntos de la sección 27 del prompt maestro. Se agrupan Clientes/Codeudores por compartir exactamente el mismo patrón y los mismos hallazgos.

## Login (`pages/login.vue`)
1. **Objetivo actual:** autenticar al usuario.
2. **Estado actual:** split-screen marca/formulario, validación de campo, mostrar/ocultar contraseña.
3. **Qué funciona bien:** validación por campo con mensajes específicos; `aria-label` correcto en el toggle de contraseña; identidad visual fuerte.
4. **Qué puede mejorar:** no diferencia "sesión expirada" de "credenciales inválidas" (ambos casos redirigen aquí con el mismo formulario en blanco).
5. **Qué falta:** mensaje contextual de sesión expirada (§6 de la especificación).
6. **Qué sobra:** nada.
7. **Problemas de UX:** ninguno relevante.
8. **Problemas de UI:** color de marca hardcodeado en hex (`!bg-[#CFA052]`) en vez de usar el token `amber` ya mapeado — inconsistencia menor frente al resto del sistema.
9. **Arquitectura:** correcta, usa `useMarcaEmpresa` sin duplicar lógica.
10. **Responsive:** correcto — el panel de marca se oculta bajo `lg`.
11. **Accesibilidad:** buena, mejor que el promedio del sistema.
12. **Permisos:** N/A (pública).
13. **Acciones:** Ingresar (única, clara).
14. **Recomendación de diseño futuro:** añadir detección de "sesión expirada" vía query param o estado dedicado; usar el token de color en vez del hex.
15. **Tipo de cambio:** MEJORAR.
16. **Prioridad:** P3.

## Registro inicial (`pages/registro.vue`)
1-2. Bootstrap del primer Administrador, bloqueado automáticamente si ya existe algún usuario.
3. **Qué funciona bien:** manejo elegante del caso "ya no disponible" (403 explicado, no un error crudo).
4. **Qué puede mejorar:** mismo hardcode de color que Login.
5-6. Sin faltantes ni sobrantes relevantes.
7-8. UX/UI sólidas, mismo nivel que Login.
9. Arquitectura correcta.
10. Responsive correcto.
11. Accesibilidad igual a Login.
12. Permisos: pública, con lógica de "solo una vez" correctamente resuelta en backend.
13. Acciones: Crear cuenta (única).
14. **Recomendación:** ninguna funcional; alinear color con token de marca.
15. **Tipo de cambio:** CONSERVAR.
16. **Prioridad:** P3.

## Dashboard (`pages/dashboard/index.vue`)
1. **Objetivo actual:** responder "¿cómo está el negocio hoy?".
2. **Estado actual:** 4 tarjetas numéricas (contratos activos, cartera total [admin], recaudo del mes [admin], novedades abiertas).
3. **Qué funciona bien:** separación correcta de cifras financieras por rol (solo se piden al backend si `esAdministrador`).
4. **Qué puede mejorar:** todo — es la página con mayor brecha entre lo que podría comunicar y lo que comunica hoy.
5. **Qué falta:** cartera por antigüedad, ingresos vs. egresos, accesos rápidos (nuevo contrato/cliente/inmueble/recaudo/novedad/gasto), alertas accionables (obligaciones vencidas, gastos aprobados sin pagar, novedades pendientes).
6. **Qué sobra:** nada — al contrario, sobra espacio en blanco sin usar.
7. **Problemas de UX:** el usuario debe visitar 3-4 módulos distintos para tener una imagen completa del día.
8. **Problemas de UI:** densidad insuficiente para una pantalla de aterrizaje.
9. **Arquitectura:** `definePageMeta({ middleware: [] })` no tiene efecto real (el middleware global igual corre) — código confuso, no un hueco de seguridad.
10. **Responsive:** grilla `sm:grid-cols-2 lg:grid-cols-4` correcta en su alcance actual.
11. **Accesibilidad:** sin problemas propios más allá de los transversales.
12. **Permisos:** correctos.
13. **Acciones:** ninguna acción rápida disponible hoy — todo es de solo lectura.
14. **Recomendación de diseño futuro:** rediseñar como panel de control real, reutilizando endpoints que ya existen en otros módulos (Movimientos, Reportes) en vez de crear cálculos nuevos.
15. **Tipo de cambio:** REEMPLAZAR (la solución actual no es suficientemente buena para el rol de esta pantalla).
16. **Prioridad:** P1.

## Inmuebles (`pages/inmuebles/index.vue`)
1-2. Listado con filtros, modal crear/editar, control de transiciones de estado.
3. **Qué funciona bien:** el candado sobre `OCUPADO` (impide fijarlo manualmente) es una regla de negocio bien traducida a UI — ningún control permite una acción que el backend rechazaría.
4. **Qué puede mejorar:** la acción de fila es un único ícono de lápiz sin texto ni `aria-label`; poco descubrible para un usuario nuevo.
5. **Qué falta:** acción "Ver" / "Ver contrato" (§8); columna "Contrato"; página de detalle con historial de ocupación.
6. **Qué sobra:** nada.
7. **Problemas de UX:** no hay forma de saber, desde este listado, qué contrato ocupa un inmueble `OCUPADO` sin ir a buscarlo en Contratos.
8. **Problemas de UI:** ninguno grave.
9. **Arquitectura:** correcta; filtros duplicados con otras páginas (ver §3).
10. **Responsive:** modal de formulario en grilla de 2 columnas sin colapso a 1 en móvil.
11. **Accesibilidad:** falta `aria-label` en el botón de editar.
12. **Permisos:** correctos (sin restricción, coincide con la regla confirmada).
13. **Acciones:** solo Editar; falta Ver/Ver contrato.
14. **Recomendación:** construir detalle de Inmueble (Fase 2) y enlazarlo desde aquí.
15. **Tipo de cambio:** MEJORAR (listado) + CREAR (detalle).
16. **Prioridad:** P2.

## Clientes (`pages/clientes/index.vue`) y Codeudores (`pages/codeudores/index.vue`)
1-2. Directorios con búsqueda estricta por documento/nombre, modal crear/editar, baja lógica con confirmación, reactivación directa.
3. **Qué funciona bien:** baja lógica trazada (nunca elimina), búsqueda clara, formularios simples y validados mínimamente.
4. **Qué puede mejorar:** el modal de creación/edición es idéntico entre ambas páginas — buen candidato a un único componente `FormularioPersona` parametrizado por rol de negocio (cliente/codeudor).
5. **Qué falta:** columnas "Contratos"/"Cartera" (solo en Clientes, §12); acciones "Crear contrato"/"Ir a cartera"; página de detalle con historial.
6. **Qué sobra:** nada.
7. **Problemas de UX:** ninguno adicional a los transversales.
8. **Problemas de UI:** ninguno propio.
9. **Arquitectura:** ~100 líneas casi calcadas entre los dos archivos — candidato claro a extraer un componente/composable compartido.
10. **Responsive:** grilla de 2 columnas en el modal sin colapso móvil.
11. **Accesibilidad:** falta mensaje de error por campo (a diferencia de Login).
12. **Permisos:** **defecto verificado** — Editar oculto a Recepcionista junto con Dar de baja bajo el mismo `v-if`.
13. **Acciones:** Editar/Dar de baja/Reactivar mal agrupadas en permisos (ver §10).
14. **Recomendación:** separar el `v-if` de Editar del de Dar de baja; extraer componente compartido `FormularioPersona`; construir detalle de Cliente (no urgente para Codeudor).
15. **Tipo de cambio:** MEJORAR (permisos, urgente) + REFACTORIZAR (duplicación de formulario).
16. **Prioridad:** P1 (permisos) / P3 (refactor de formulario).

## Contratos — listado (`pages/contratos/index.vue`)
1-2. Listado con filtros completos, Terminar y Reactivar como modales bien resueltos.
3. **Qué funciona bien:** las dos transiciones de estado (ACTIVO/TERMINADO) y sus reglas coinciden exactamente con lo confirmado; el modal de Terminar advierte que la deuda sigue cobrable; el de Reactivar exige motivo.
4. **Qué puede mejorar:** el modal de Terminar podría mostrar el saldo pendiente actual del contrato junto a la advertencia (hoy es un texto genérico sin cifra).
5. **Qué falta:** página de detalle (Resumen/Canon/Depósito/Obligaciones/Recaudo/Historial, §17) — la ausencia de mayor costo UX de todo el sistema, porque Contrato es la entidad financiera central.
6. **Qué sobra:** nada.
7. **Problemas de UX:** sin detalle, "ver el historial de un contrato" no tiene una respuesta en la UI.
8. **Problemas de UI:** ninguno propio.
9. **Arquitectura:** filtros duplicados (ver §3); store `contratos.store.ts` sin usar, mientras esta página reimplementa la misma lógica localmente.
10. **Responsive:** filtros en `flex flex-wrap` — se adapta razonablemente, pero no se probó en viewport real.
11. **Accesibilidad:** correcta en lo transversal.
12. **Permisos:** correctos y verificados contra la regla confirmada.
13. **Acciones:** Terminar (todos los roles) y Reactivar (solo Administrador) — bien resueltas.
14. **Recomendación:** construir detalle de Contrato como primera prioridad de la Fase 2; mostrar saldo pendiente en el modal de Terminar.
15. **Tipo de cambio:** CONSERVAR (lógica de estados) + CREAR (detalle) + MEJORAR (modal de Terminar).
16. **Prioridad:** P1.

## Contratos — nuevo (`pages/contratos/nuevo.vue`)
1-2. Formulario por bloques (Arrendatario → Codeudor(es) → Inmueble → Datos del contrato), 100% por búsqueda de entidades existentes.
3. **Qué funciona bien:** el manejo del día de pago (derivado de la fecha de inicio hasta edición manual) es un detalle bien pensado y digno de replicarse en otros campos similares.
4. **Qué puede mejorar:** falta el paso de vista previa final que la especificación exige (§16) y que el propio proyecto ya sabe construir bien (ver el patrón de Recaudo).
5. **Qué falta:** paso de "Vista previa" antes de "Crear contrato".
6. **Qué sobra:** nada.
7. **Problemas de UX:** el usuario pasa de "Datos del contrato" directo a "Crear contrato" sin una última oportunidad de revisar todo junto.
8. **Problemas de UI:** ninguno propio.
9. **Arquitectura:** correcta, bloques bien organizados con `FormSection` implícito (patrón `UCard` numerado).
10. **Responsive:** grilla de 3 columnas en "Datos del contrato" sin colapso móvil evidente.
11. **Accesibilidad:** correcta en lo transversal.
12. **Permisos:** correctos (sin restricción, coincide con la regla confirmada).
13. **Acciones:** Crear contrato (única, con validación de completitud vía `puedeCrear`).
14. **Recomendación:** añadir paso de vista previa reutilizando los datos ya en memoria (sin llamada adicional al backend).
15. **Tipo de cambio:** MEJORAR.
16. **Prioridad:** P2.

## Novedades — listado (`pages/novedades/index.vue`)
1-2. Listado con filtros, descarga de recibo de novedad, aprobación financiera y registro de pago separados.
3. **Qué funciona bien:** separación estricta aprobación/pago (aprobar nunca mueve dinero, nunca muestra "Pagado" al aprobar) — coincide exactamente con la regla de negocio confirmada y con §26 de la especificación.
4. **Qué puede mejorar:** la fila mezcla visualmente estado del ciclo de vida (ABIERTA/CERRADA) con estado financiero (impacto financiero + pagado/pendiente) en dos badges consecutivos — funcional pero podría organizarse con mejor jerarquía (ej. el estado financiero como sub-badge dentro de la celda de estado, no como columna aparte).
5. **Qué falta:** una vista filtrada de "gastos pendientes de pago" a través de todos los inmuebles (hoy hay que escanear visualmente la tabla completa).
6. **Qué sobra:** nada.
7. **Problemas de UX:** ninguno grave.
8. **Problemas de UI:** doble badge por fila en la columna de impacto financiero, algo denso.
9. **Arquitectura:** filtros y `estadoColor` duplicados (ver §3); `novedades.store.ts` sin usar.
10. **Responsive:** filtros en `flex flex-wrap`, no verificado en viewport real.
11. **Accesibilidad:** correcta en lo transversal.
12. **Permisos:** correctos y verificados (aprobación/pago exclusivos de Administrador; registro y descarga de recibo abiertos a ambos roles).
13. **Acciones:** Recibo (todos), Cargo arrendatario/Gasto inmobiliaria (Administrador, solo si pendiente), Registrar pago (Administrador, solo si aprobado y no pagado) — todas correctamente condicionadas por estado.
14. **Recomendación:** vista/filtro de "Gastos pendientes de pago" reutilizando este mismo endpoint; simplificar la presentación del doble badge.
15. **Tipo de cambio:** CONSERVAR (lógica) + MEJORAR (presentación).
16. **Prioridad:** P2.

## Novedades — nueva (`pages/novedades/nueva.vue`)
1-2. Formulario simple sin campos financieros (inmueble → contrato opcional → descripción → fecha → responsable sugerido).
3. **Qué funciona bien:** el texto "Este registro NO genera ningún impacto financiero..." es exactamente el tipo de mensaje de consecuencia visible que pide §2.1 de la especificación.
4. **Qué puede mejorar:** la búsqueda de inmueble exige Enter/clic; un autocompletar con debounce reduciría fricción en un flujo que probablemente se usa "en campo".
5-6. Sin faltantes ni sobrantes relevantes.
7. UX clara y honesta sobre el alcance del formulario.
8. UI simple y correcta.
9. Arquitectura correcta.
10. Responsive: grilla de 2 columnas en "Fecha/Responsable" sin verificar colapso móvil.
11. Accesibilidad correcta en lo transversal.
12. Permisos correctos (abierto a ambos roles).
13. Acciones: Registrar novedad (única).
14. **Recomendación:** autocompletar de búsqueda con debounce.
15. **Tipo de cambio:** MEJORAR (fricción de búsqueda) + CONSERVAR (alcance y mensaje).
16. **Prioridad:** P3.

## Recaudo (`pages/recaudo/index.vue`)
1-2. Búsqueda de contrato → ficha de recaudo → registro de pago mixto → previsualización server-side → confirmación → recibo.
3. **Qué funciona bien:** la previsualización se calcula en backend con el mismo método que el pago real — garantía de integridad superior a lo exigido por la especificación; manejo explícito y honesto del excedente (cambio vs. saldo a favor, decisión del usuario, no un default silencioso).
4. **Qué puede mejorar:** presentación de Canon/Novedad/Mora (ver §11); la búsqueda de contrato exige Enter/clic; no hay un resumen persistente de "cuánto llevo registrado hoy" si el operador atiende varios pagos seguidos.
5. **Qué falta:** resumen de 3 totales (Canon/Novedad/Mora) antes de la tabla detallada de aplicación.
6. **Qué sobra:** nada — el nivel de detalle actual es apropiado, no excesivo.
7. **Problemas de UX:** ninguno grave; oportunidades de refinamiento, no correcciones.
8. **Problemas de UI:** el badge Capital/Mora es binario donde podría ser un poco más informativo (Canon/Novedad/Mora).
9. **Arquitectura:** correcta y ejemplar en el manejo de la previsualización.
10. **Responsive:** el formulario de "detalles de pago" (medio + monto + referencia en fila) es candidato a romperse en móvil — no verificado en viewport real.
11. **Accesibilidad:** correcta en lo transversal.
12. **Permisos:** correctos — módulo completo exclusivo de Administrador, coincide con la regla confirmada.
13. **Acciones:** Buscar, Confirmar y emitir recibo, Anular obligación, Liquidar depósito, Descargar PDF — todas correctamente condicionadas por estado del contrato/obligación.
14. **Recomendación:** agregar resumen de 3 totales Canon/Novedad/Mora; considerar autocompletar en la búsqueda de contrato.
15. **Tipo de cambio:** CONSERVAR (lógica, con marca de **RIESGO DE NEGOCIO — REQUIERE VALIDACIÓN** si cualquier cambio tocara el cálculo de aplicación) + MEJORAR (presentación).
16. **Prioridad:** P2.

## Recibos — listado (`pages/recibos/index.vue`)
1-2. Listado independiente de recibos históricos, filtros completos, descarga PDF en dos formatos.
3. **Qué funciona bien:** módulo completo y bien resuelto, sin defectos detectados.
4. **Qué puede mejorar:** la columna "Medio de pago" colapsa varios medios a la etiqueta "Mixto" sin detalle en la fila — el usuario debe entrar al detalle para saber la mezcla exacta.
5-6. Sin faltantes ni sobrantes relevantes.
7-8. UX/UI correctas.
9. Arquitectura duplica el patrón de filtros/paginación (ver §3).
10. Responsive no verificado en viewport real.
11. Accesibilidad correcta en lo transversal.
12. Permisos correctos (exclusivo Administrador).
13. Acciones: Ver, descargar PDF (Carta/Media Carta) — correctas.
14. **Recomendación:** tooltip o desglose corto en la celda "Mixto" (ej. "Efectivo + Transferencia") sin necesidad de entrar al detalle.
15. **Tipo de cambio:** CONSERVAR + MEJORAR (detalle menor).
16. **Prioridad:** P3.

## Recibo — detalle (`pages/recibos/[id].vue`)
1-2. Datos del recibo, medios de pago, tabla de aplicación, anulación con motivo, enlace a la ficha del contrato.
3. **Qué funciona bien:** ejemplo de página de detalle bien resuelta en este proyecto (el único que existe) — patrón a replicar exactamente para Contrato/Cliente/Inmueble; el mensaje de anulación ("El recibo NUNCA se elimina...") es el estándar de trazabilidad más claro de todo el sistema.
4. **Qué puede mejorar:** mismo punto de Canon/Novedad/Mora que en Recaudo.
5-6. Sin faltantes ni sobrantes relevantes.
7-8. UX/UI ejemplares.
9. Arquitectura correcta — es la plantilla a copiar para futuras páginas de detalle.
10. Responsive: `max-w-3xl` centrado, probablemente aceptable en móvil sin cambios.
11. Accesibilidad correcta en lo transversal.
12. Permisos correctos (exclusivo Administrador).
13. Acciones: Anular (condicionada a `estado === 'EMITIDO'`), Descargar PDF — correctas.
14. **Recomendación:** usar esta página como plantilla arquitectónica para el detalle de Contrato.
15. **Tipo de cambio:** CONSERVAR.
16. **Prioridad:** — (referencia positiva, no requiere acción).

## Caja (`pages/caja/index.vue`)
1-2. Saldo esperado en vivo, historial de arqueos, registro de arqueo con diferencia calculada.
3. **Qué funciona bien:** patrón "esperado / contado / diferencia" resuelto casi al pie de la letra de §31; color de diferencia según signo.
4. **Qué puede mejorar:** observación no obligatoria cuando hay diferencia ≠ 0, a pesar de que la especificación lo exige explícitamente.
5. **Qué falta:** validación condicional de observación obligatoria.
6. **Qué sobra:** nada.
7. **Problemas de UX:** un arqueo con diferencia puede guardarse sin ninguna explicación escrita, lo que en el futuro dificulta entender por qué hubo un faltante/sobrante.
8. **Problemas de UI:** ninguno propio.
9. **Arquitectura:** duplica el patrón de paginación (ver §3).
10. **Responsive:** grilla `sm:grid-cols-2 lg:grid-cols-4` correcta en su alcance actual.
11. **Accesibilidad:** correcta en lo transversal.
12. **Permisos:** correctos (exclusivo Administrador).
13. **Acciones:** Registrar arqueo (única) — correcta salvo la validación faltante.
14. **Recomendación:** hacer el campo de observaciones obligatorio cuando `diferenciaPreview !== 0`.
15. **Tipo de cambio:** MEJORAR.
16. **Prioridad:** P2.

## Movimientos (`pages/movimientos/index.vue`)
1-2. Libro de movimientos con filtros, saldo por medio (efectivo/transferencia/sin identificar), reverso manual condicionado.
3. **Qué funciona bien:** separación estricta de caja física y transferencias en tarjetas independientes (nunca un "saldo de caja" mezclado); aviso honesto de "dinero sin medio identificado" — ejemplo de honestidad de datos que debería generalizarse.
4. **Qué puede mejorar:** es, funcionalmente, el módulo "Transferencias" de la especificación fusionado con el libro general — si el negocio decide separar Transferencias (§19), esta página es la base de la que se extraería esa vista, no algo que deba reconstruirse desde cero.
5. **Qué falta:** vista dedicada de Transferencias si la decisión de producto (§19) confirma que debe existir por separado.
6. **Qué sobra:** nada.
7-8. UX/UI correctas y ejemplares en honestidad de datos.
9. Arquitectura duplica el patrón de paginación/filtros.
10. Responsive: tarjetas de saldo en `flex flex-wrap`, razonable.
11. Accesibilidad correcta en lo transversal.
12. Permisos correctos (exclusivo Administrador).
13. Acciones: Reversar (condicionado a origen NOVEDAD/DEPOSITO y no ser ya un reverso) — correcta.
14. **Recomendación:** mantener como está hasta resolver la decisión de producto de §19; si se separa Transferencias, extraer un filtro/vista de esta misma fuente de datos.
15. **Tipo de cambio:** CONSERVAR, con nota de **DECISIÓN DE PRODUCTO PENDIENTE** sobre su alcance futuro.
16. **Prioridad:** — (bloqueado por decisión de producto).

## Auditoría (`pages/auditoria/index.vue`)
1-2. Tabla con filtros (módulo, usuario, fechas), columnas Fecha/Módulo/Acción/Usuario/Ruta.
3. **Qué funciona bien:** filtros útiles para investigación puntual.
4. **Qué puede mejorar:** no hay detalle expandible por registro (valor anterior/nuevo, motivo, entidad).
5. **Qué falta:** vista de detalle por registro (§38) — aunque ya se confirmó en sesión previa que el patrón de anular/reversar + motivo obligatorio satisface la trazabilidad sin necesitar columnas valorAnterior/valorNuevo en una tabla central, por lo que este faltante se degrada a baja prioridad.
6-8. Sin sobrantes; UX/UI simples y correctas para su propósito actual.
9. Arquitectura duplica el patrón de paginación/filtros.
10. Responsive no verificado.
11. Accesibilidad correcta en lo transversal.
12. Permisos correctos (exclusivo Administrador).
13. Acciones: ninguna (solo lectura) — correcto para un módulo de auditoría.
14. **Recomendación:** no invertir aquí salvo pedido explícito del negocio, dado el contexto de la decisión ya tomada sobre trazabilidad.
15. **Tipo de cambio:** CONSERVAR.
16. **Prioridad:** P3.

## Reportes (`pages/reportes/index.vue`)
1-2. 4 tarjetas de exportación a Excel (Contratos, Cartera consolidada, Recaudo, Inmuebles por barrio).
3. **Qué funciona bien:** descarga directa y rápida, sin pasos innecesarios; mensaje honesto de que los reportes reflejan el estado más reciente.
4. **Qué puede mejorar:** sin vista previa en pantalla antes de exportar (§34 la pide) — puede ser una decisión válida de "rapidez sobre exhaustividad" (principio de la especificación), no necesariamente un defecto.
5. **Qué falta:** catálogo más amplio (Obligaciones, Movimiento de caja, Transferencias, Novedades, Gastos como reportes separados, §33).
6. **Qué sobra:** nada.
7-8. UX/UI simples, correctas, sin fricción.
9. Arquitectura correcta, sin duplicación relevante (usa `useExcelExport` centralizado).
10. Responsive: grilla `sm:grid-cols-2`, razonable.
11. Accesibilidad correcta en lo transversal.
12. Permisos correctos (exclusivo Administrador).
13. Acciones: Exportar a Excel (por tarjeta) — correcta.
14. **Recomendación:** ampliar catálogo de reportes cuando existan los módulos correspondientes (ligado a la decisión de §19); evaluar si conviene vista previa en pantalla o mantener la descarga directa (decisión de producto menor, bajo riesgo cualquiera de las dos).
15. **Tipo de cambio:** CONSERVAR + CREAR (reportes adicionales, condicionado a decisión de producto).
16. **Prioridad:** P3.

## Administración — Usuarios (`pages/administracion/index.vue`)
1-2. CRUD de usuarios (crear, activar/desactivar con confirmación, restablecer contraseña).
3. **Qué funciona bien:** patrón de confirmación consistente con Clientes/Codeudores (baja confirma, reactivación no); restablecimiento de contraseña como acción separada y explícita.
4. **Qué puede mejorar:** sin vista de "permisos efectivos" por usuario (§36) — de bajo impacto real dado que el sistema tiene solo 2 roles, cada uno con un conjunto de permisos ya comunicado por el badge de rol.
5-6. Sin faltantes de alto impacto ni sobrantes.
7-8. UX/UI correctas.
9. Arquitectura duplica el patrón de paginación.
10. Responsive no verificado.
11. Accesibilidad correcta en lo transversal.
12. Permisos correctos (exclusivo Administrador).
13. Acciones: crear, activar/desactivar, restablecer contraseña — correctas y bien condicionadas.
14. **Recomendación:** ninguna urgente.
15. **Tipo de cambio:** CONSERVAR.
16. **Prioridad:** P3.

## Configuración (`pages/configuracion/index.vue`)
1-2. Datos de empresa, parámetros de mora, generación manual de canon, subida de logo con preview.
3. **Qué funciona bien:** el modal de confirmación de generación de canon explica el efecto exacto ("crea deuda cobrable de forma masiva") antes de ejecutar — el mejor ejemplo de advertencia de acción destructiva de todo el sistema; separación correcta de Usuarios (evita duplicar gestión del mismo recurso, según el propio comentario del código).
4. **Qué puede mejorar:** nada urgente.
5-6. Sin faltantes ni sobrantes relevantes.
7-8. UX/UI ejemplares.
9. Arquitectura correcta, sin duplicación relevante.
10. Responsive: grilla `sm:grid-cols-3` en parámetros de mora, razonable.
11. Accesibilidad correcta en lo transversal.
12. Permisos correctos (exclusivo Administrador).
13. Acciones: Guardar cambios, Generar cánones, Subir logo — todas correctamente confirmadas cuando son sensibles.
14. **Recomendación:** ninguna.
15. **Tipo de cambio:** CONSERVAR.
16. **Prioridad:** — (referencia positiva).

---

# 13. Auditoría de componentes

| Componente de la especificación | Estado | Clasificación |
|---|---|---|
| PageHeader | No existe, patrón repetido manualmente | CREAR |
| Breadcrumbs | No existe | CREAR |
| SearchBar | Resuelto ad hoc con `UInput` en cada página, sin debounce | REESTRUCTURAR (extraer + agregar debounce) |
| FilterBar | Lógica duplicada en 5+ páginas | REFACTORIZAR |
| DataTable | `UTable` de Nuxt UI usado directamente y de forma consistente | CONSERVAR (no requiere envoltorio propio salvo para la variante "tarjetas en móvil") |
| StatusBadge | 6 mapas de color duplicados | REFACTORIZAR |
| MoneyValue | `useFormatoCO` bien centralizado para el formato; color/énfasis decidido por página | REFACTORIZAR (envolver el composable existente en un componente) |
| SummaryCard | Cubierto ad hoc con `UCard` | CONSERVAR |
| Tabs | No usado (no hay detalle) | CREAR (al construir páginas de detalle) |
| DetailSection | No existe | CREAR |
| ConfirmDialog | `ConfirmModal.vue` bien resuelto y reutilizado en 4 pantallas | CONSERVAR |
| OperationWizard | Resuelto ad hoc pero correctamente en Recaudo | MEJORAR (formalizar como patrón si se replica en Contrato Nuevo) |
| OperationSummary | Parcialmente presente (ficha de recaudo, resumen de recibo) sin componente propio | REESTRUCTURAR |
| AuditTimeline | No existe | DECISIÓN DE PRODUCTO (ver nota en la página de Auditoría, §12) |
| EmptyState | Resuelto manualmente vía `#empty-state` en cada tabla, consistente | CONSERVAR |
| ErrorState (con Reintentar) | No existe — solo `UAlert` estático | CREAR |
| SkeletonTable | No usado; se usa el spinner nativo de `UTable` | CONSERVAR (bajo impacto priorizar aquí) |
| FormSection | Resuelto con `UCard` + encabezado numerado en Contrato Nuevo | CONSERVAR (buen patrón, replicar) |
| MoneyInput | No existe; `UInput type="number"` sin formato de miles en vivo | MEJORAR |
| DateInput | `UInput type="date"` nativo, consistente | CONSERVAR |
| ReferenceInput | Resuelto correctamente como campo condicional en 3 módulos | CONSERVAR |
| ExportButton | Lógica inline en Reportes | REFACTORIZAR (bajo impacto) |

**Duplicación de formulario de persona (Cliente/Codeudor):** hallazgo adicional no listado en el catálogo de la especificación — ambos formularios son casi idénticos y son candidatos a un componente `FormularioPersona` parametrizado. Clasificación: REFACTORIZAR.

---

# 14. Auditoría de acciones y estados

**Estados verificados contra la especificación y contra las reglas de negocio ya confirmadas:**

| Entidad | Estados en el frontend | ¿Coincide con lo permitido? |
|---|---|---|
| Contrato | ACTIVO, TERMINADO | Sí — exactamente los 2 estados confirmados, sin invención |
| Inmueble | DISPONIBLE, OCUPADO, MANTENIMIENTO, INACTIVO | No está en la especificación genérica (que no detalla estados de Inmueble más allá de "ocupado/disponible"), pero es una extensión razonable del dominio real, no una invención arbitraria — MANTENIMIENTO e INACTIVO resuelven casos operativos reales |
| Novedad | ABIERTA, EN_SEGUIMIENTO, CERRADA, ANULADA + impactoFinanciero (PENDIENTE/CARGO_ARRENDATARIO/GASTO_INMOBILIARIA) | Diverge del vocabulario simplificado de la especificación genérica (PENDIENTE) — **DECISIÓN DE PRODUCTO** ya materializada en el dominio real; no se recomienda "simplificar" sin evaluar si EN_SEGUIMIENTO cumple una función operativa real que la especificación genérica no anticipó |
| Recibo | EMITIDO, ANULADO | Coincide con el patrón de nunca eliminar, solo anular |
| Movimiento | INGRESO, EGRESO (+ `esReverso` como bandera, no como estado) | Correcto y simple |

**Acciones por entidad y estado — verificación exhaustiva de que ninguna acción inválida es ofrecida:**

| Entidad | Estado | Acciones ofrecidas | ¿Correctas? |
|---|---|---|---|
| Contrato | ACTIVO | Terminar | Correcta; falta enlace directo a "Registrar recaudo"/"Registrar novedad" como accesos rápidos de fila (hoy son módulos separados a los que se llega buscando de nuevo) |
| Contrato | TERMINADO | Reactivar (solo Administrador) | Correcta; falta "Ver historial"/"Ver obligaciones" como acción directa (sin detalle de Contrato no hay a dónde apuntar) |
| Cliente/Codeudor | activo | Editar, Dar de baja (ambas mal restringidas a Administrador) | Editar debería estar abierta a Recepcionista |
| Cliente/Codeudor | inactivo | Reactivar (mal restringida a Administrador) | Debería estar abierta a Recepcionista si Editar también lo está |
| Inmueble | cualquiera | Editar | Correcta; falta Ver/Ver contrato |
| Novedad | impacto PENDIENTE | Cargo arrendatario / Gasto inmobiliaria (Administrador) | Correcta |
| Novedad | GASTO_INMOBILIARIA no pagado | Registrar pago (Administrador) | Correcta, refuerza aprobar≠pagar |
| Recibo | EMITIDO | Anular | Correcta |
| Recibo | ANULADO | Solo lectura + PDF | Correcta — ninguna acción sobre un recibo ya anulado |
| Movimiento | NOVEDAD/DEPOSITO, no reverso | Reversar | Correcta |
| Movimiento | RECAUDO | Ninguna directa (se corrige anulando el recibo) | Correcta — evita duplicar el mecanismo de corrección |

**Verificación explícita del anti-patrón prohibido:** no se encontró ningún botón "Eliminar" genérico en ninguna de las 19 páginas. Todas las bajas son lógicas (`activo:false`) o trazadas (anular/reversar + motivo obligatorio). Este es uno de los puntos donde el sistema ya cumple el estándar más alto posible — clasificado **CONSERVAR** sin reservas.

---

# 15. Hallazgos P0

No se identificaron hallazgos que cumplan el criterio P0 (error financiero real, pérdida de información, violación grave de permisos con impacto de negocio, pérdida de trazabilidad). El hallazgo más cercano a esa severidad —la fusión/ausencia de módulos financieros completos— se trata como **DECISIÓN DE PRODUCTO PENDIENTE** (sección 19) en vez de P0, porque no es un defecto de lo construido sino una pregunta abierta sobre qué se debió construir.

---

# 16. Hallazgos P1

| ID | Hallazgo | Tipo de cambio |
|---|---|---|
| P1-01 | Recepcionista no puede editar/dar de baja Clientes ni Codeudores (solo crear) | MEJORAR |
| P1-02 | Sidebar sin drawer móvil, sin botón de menú | CREAR |
| P1-03 | Header nunca muestra el título real de la página (slot muerto) | REFACTORIZAR |
| P1-04 | Sin página de detalle de Contrato (ni de Cliente/Inmueble) | CREAR |
| P1-05 | Dashboard muy por debajo de su potencial como panel de control | REEMPLAZAR |
| P1-06 | Ninguna tabla ofrece "Reintentar" en su estado de error | CREAR |

---

# 17. Hallazgos P2

| ID | Hallazgo | Tipo de cambio |
|---|---|---|
| P2-01 | Stores de Pinia sin usar (`contratos`, `novedades`, `filtros`) | REFACTORIZAR (eliminar, ver §4.4) |
| P2-02 | Patrón de paginación/filtros duplicado en ~10 páginas | REFACTORIZAR (extraer `useListadoPaginado`) |
| P2-03 | `StatusBadge` inexistente, 6 mapas de color duplicados | REFACTORIZAR |
| P2-04 | Recaudo/Recibo no muestran resumen explícito Canon/Novedad/Mora | MEJORAR |
| P2-05 | Caja: observación no obligatoria con diferencia ≠ 0 | MEJORAR |
| P2-06 | Inmuebles: falta acción Ver/Ver contrato | CREAR (depende de P1-04) |
| P2-07 | Formulario de Cliente/Codeudor duplicado casi al 100% | REFACTORIZAR |
| P2-08 | Contrato Nuevo sin paso de vista previa | MEJORAR |
| P2-09 | Falta validación de error por campo en formularios de Cliente/Codeudor/Inmueble (a diferencia de Login) | MEJORAR |

---

# 18. Hallazgos P3

| ID | Hallazgo | Tipo de cambio |
|---|---|---|
| P3-01 | Color de marca hardcodeado en hex en Login/Registro en vez del token `amber` | REFACTORIZAR |
| P3-02 | Botones de solo-ícono sin `aria-label` (editar en Inmuebles, dropdowns) | MEJORAR |
| P3-03 | `MoneyInput` sin formato de miles en vivo | MEJORAR |
| P3-04 | Recibos: celda "Mixto" sin desglose corto en la fila | MEJORAR |
| P3-05 | Novedades: doble badge por fila (ciclo de vida + impacto financiero) algo denso | MEJORAR |
| P3-06 | Búsquedas sin autocompletar/debounce (Contrato Nuevo, Novedad Nueva, Recaudo) | MEJORAR |
| P3-07 | `middleware: []` sin efecto real en Dashboard | REFACTORIZAR (limpiar) |
| P3-08 | Administración: sin vista de "permisos efectivos" por usuario | CREAR (bajo impacto, 2 roles) |
| P3-09 | Reportes: catálogo más reducido que el de la especificación | CREAR (condicionado a decisión de producto) |

---

# 19. Decisiones de producto pendientes

Estas son las preguntas que **no puede responder una auditoría técnica** — requieren una decisión de negocio antes de que el plan de acción pueda ejecutarse con certeza en las áreas que dependen de ellas.

### DP-01 — ¿Se separan Obligaciones, Cartera, Gastos, Depósitos y Transferencias en módulos propios?
Hoy están fusionados dentro de Recaudo (Obligaciones, Depósitos), Novedades (Gastos) y Movimientos (Transferencias). Esa fusión reduce el número de pantallas a mantener y, en el caso de Recaudo/Depósitos, coincide con el control exclusivo de Administrador ya confirmado. Pero si el negocio necesita, por ejemplo, una bandeja de cartera vencida navegable por antigüedad para gestión proactiva de cobro (como el mockup sugiere), la fusión actual no lo permite sin salir a un reporte Excel. **Bloqueante para dimensionar la Fase 3 del plan.**

### DP-02 — ¿Debe existir "consulta de obligaciones" de solo lectura para Recepcionista?
La especificación genérica lo incluye en el menú de Recepcionista; la regla de negocio ya confirmada dice que todo lo financiero es exclusivo de Administrador (incluida la ficha de recaudo). Son dos fuentes en conflicto directo. **No se recomienda ningún cambio sin que el negocio elija explícitamente entre ambas.**

### DP-03 — ¿El vocabulario de estados de Novedad (ABIERTA/EN_SEGUIMIENTO/CERRADA/ANULADA) se mantiene o se simplifica hacia el PENDIENTE único de la especificación genérica?
El estado EN_SEGUIMIENTO no existe en la especificación entregada. Puede ser una necesidad operativa real (novedades que requieren más de una visita/seguimiento antes de resolverse) o puede ser complejidad no utilizada. **Requiere confirmación de si EN_SEGUIMIENTO se usa activamente en la operación real.**

### DP-04 — ¿Vale la pena una vista previa en pantalla antes de exportar cada reporte (§34), o la descarga directa actual es la experiencia deseada?
Es una decisión de producto de bajo riesgo (cualquiera de las dos opciones es defendible), pero afecta el diseño de la Fase 3/6 de Reportes.

### DP-05 — ¿Se agrega un estado o mecanismo de "sesión expirada" explícito en Login, o el comportamiento actual (redirección silenciosa) es aceptable?
Bajo impacto, pero decide si P3-relacionado a Login se ejecuta o se descarta.

---

# 20. Matriz completa de hallazgos

| ID | Módulo | Elemento | Situación actual | Problema | Tipo | Prioridad | Riesgo | Recomendación |
|---|---|---|---|---|---|---|---|---|
| P1-01 | Clientes/Codeudores | `TableRowActions` | Editar agrupado con Dar de baja bajo un solo `v-if` de Administrador | Recepcionista no puede editar, contradice regla confirmada | MEJORAR | P1 | Bajo | Separar condición de Editar de la de Dar de baja |
| P1-02 | Layout global | Sidebar/Header | Sidebar fijo de 256px, sin drawer, sin botón de menú | Navegación inutilizable en móvil | CREAR | P1 | Medio | Construir drawer + botón de menú |
| P1-03 | Layout global | Header | Slot `#titulo` nunca usado por ninguna página | Header siempre dice "Panel" | REFACTORIZAR | P1 | Bajo | Pasar título real desde cada página o generar breadcrumb por ruta |
| P1-04 | Contratos/Clientes/Inmuebles | Rutas | Sin páginas `[id].vue` | Sin lugar para comprender una entidad completa | CREAR | P1 | Medio | Construir detalle de Contrato primero, con la plantilla de Recibo detalle |
| P1-05 | Dashboard | Página completa | 4 tarjetas numéricas | No responde "cómo está el negocio hoy" | REEMPLAZAR | P1 | Medio | Rediseñar con gráficos, accesos rápidos y alertas accionables |
| P1-06 | Todas las tablas | Manejo de error | `UAlert` estático sin acción | Usuario debe recargar toda la página | CREAR | P1 | Bajo | Componente `ErrorState` con "Reintentar" |
| P2-01 | Arquitectura | Stores Pinia | 3 stores sin conectar | Riesgo de doble fuente de verdad futura | REFACTORIZAR | P2 | Bajo | Eliminar, sustituir por composable de listado |
| P2-02 | Múltiples listados | Paginación/filtros | Reescrito ~10 veces | Costo de mantenimiento alto | REFACTORIZAR | P2 | Bajo-Medio | Extraer `useListadoPaginado` |
| P2-03 | Múltiples listados | Badges de estado | 6 mapas de color duplicados | Inconsistencia futura si cambia un color | REFACTORIZAR | P2 | Bajo | Extraer `StatusBadge` + diccionario único |
| P2-04 | Recaudo/Recibo | Vista de aplicación | Tabla dinámica sin resumen fijo | Canon/Novedad/Mora no se entienden "de un vistazo" | MEJORAR | P2 | Bajo (presentación, no cálculo) | Agregar resumen de 3 totales encima de la tabla existente |
| P2-05 | Caja | Registrar arqueo | Observación opcional siempre | Diferencias sin explicación registrada | MEJORAR | P2 | Bajo | Hacer observación obligatoria si diferencia≠0 |
| P2-06 | Inmuebles | Acciones de fila | Solo Editar | Falta Ver/Ver contrato | CREAR | P2 | Bajo | Depende de P1-04 |
| P2-07 | Clientes/Codeudores | Formulario modal | Casi 100% duplicado entre ambos archivos | Costo de mantenimiento doble | REFACTORIZAR | P2 | Bajo | Extraer `FormularioPersona` |
| P2-08 | Contratos nuevo | Flujo de creación | Sin paso de vista previa | Riesgo bajo de error de digitación antes de guardar | MEJORAR | P2 | Bajo | Añadir paso de revisión con datos ya en memoria |
| P2-09 | Cliente/Codeudor/Inmueble | Formularios | Sin error por campo | Menos claro que Login sobre qué corregir | MEJORAR | P2 | Bajo | Replicar patrón de `erroresCampo` de Login |
| P3-01 | Login/Registro | Botón primario | Hex hardcodeado | Desincronización si cambia el token de marca | REFACTORIZAR | P3 | Bajo | Usar `color="amber"` |
| P3-02 | Varias | Botones de ícono | Sin `aria-label` | Accesibilidad reducida | MEJORAR | P3 | Bajo | Replicar patrón ya usado en Login |
| P3-03 | Formularios financieros | Inputs de dinero | Sin formato de miles en vivo | Riesgo leve de error de digitación | MEJORAR | P3 | Bajo | Construir `MoneyInput` |
| P3-04 | Recibos | Columna Medio de pago | "Mixto" sin desglose | Requiere entrar al detalle para ver la mezcla | MEJORAR | P3 | Bajo | Tooltip o texto corto en la celda |
| P3-05 | Novedades | Columna Impacto financiero | Doble badge por fila | Densidad visual innecesaria | MEJORAR | P3 | Bajo | Unificar en un solo badge con sub-texto |
| P3-06 | Contratos nuevo, Novedad nueva, Recaudo | Buscadores | Requieren Enter/clic | Fricción evitable | MEJORAR | P3 | Bajo | Debounce + autocompletar |
| P3-07 | Dashboard | `definePageMeta` | `middleware: []` sin efecto | Código confuso | REFACTORIZAR | P3 | Bajo | Limpiar o documentar intención |
| P3-08 | Administración | Detalle de usuario | Sin "permisos efectivos" | Bajo impacto con 2 roles | CREAR | P3 | Bajo | Opcional |
| P3-09 | Reportes | Catálogo | 4 de ~8 reportes de la especificación | Cobertura parcial | CREAR | P3 | Bajo | Condicionado a DP-01 |

---

# 21. Arquitectura objetivo

**Rutas:** las 19 páginas actuales se conservan; se agregan `contratos/[id].vue`, `clientes/[id].vue`, `inmuebles/[id].vue` (y `codeudores/[id].vue` si se confirma la necesidad). Si DP-01 resuelve separar módulos financieros, se agregan `cartera/index.vue`, `gastos/index.vue`, `depositos/index.vue`, `transferencias/index.vue` como nuevas carpetas de `pages/`, sin tocar las existentes (Recaudo/Novedades/Movimientos seguirían existiendo, posiblemente enlazando hacia las nuevas vistas en vez de duplicar su contenido).

**Componentes:** se agrega `components/shared/` con `PageHeader`, `Breadcrumbs`, `StatusBadge`, `ErrorState`, `FilterBar`, `MoneyValue`, `FormularioPersona` — todos consumidos progresivamente por las páginas existentes sin cambiar su comportamiento observable.

**Composables:** se agrega `useListadoPaginado` (adoptado por las ~10 páginas identificadas en §3) y `useEstados` (diccionario de estado→color/label, consumido por `StatusBadge`).

**Stores:** `auth.store.ts` se conserva sin cambios. `contratos.store.ts`, `novedades.store.ts`, `filtros.store.ts` se eliminan una vez que `useListadoPaginado` cubra su función.

**Middleware:** `auth.global.ts` se conserva como única fuente de verdad de rutas exclusivas de Administrador; cualquier módulo nuevo (Cartera, Gastos, Depósitos, Transferencias, si se crean) debe añadirse explícitamente a `rutasSoloAdmin` si corresponde.

**Layout:** `layouts/default.vue` se extiende (no se reemplaza) para soportar drawer móvil y título de página dinámico.

Este objetivo es alcanzable de forma **incremental**: cada pieza (un componente, un composable, una página de detalle) puede construirse y validarse de forma aislada sin necesitar una "gran reescritura". No se identificó ninguna razón arquitectónica (framework inadecuado, límite técnico, deuda irreversible) que justifique reemplazar la base actual.

---

# 22. Plan de acción

## FASE 0 — Base transversal
0.1. Extraer `StatusBadge` + diccionario de estados. — P2-03. Riesgo bajo.
0.2. Extraer `ErrorState` con "Reintentar" y aplicarlo en las 19 páginas. — P1-06. Riesgo bajo.
0.3. Resolver el slot de título del Header (título dinámico por página o breadcrumb por ruta). — P1-03. Riesgo bajo.
0.4. Extraer `useListadoPaginado` y migrar las ~10 páginas identificadas. — P2-02. Riesgo bajo-medio (migración mecánica, sin cambiar comportamiento).
0.5. Eliminar `contratos.store.ts`, `novedades.store.ts`, `filtros.store.ts`. — P2-01. Riesgo bajo (verificado que no están conectados a nada).
0.6. Construir sidebar responsive (drawer móvil) + botón de menú. — P1-02. Riesgo medio (toca el layout global).
0.7. Corregir permisos de Editar en Clientes/Codeudores. — P1-01. Riesgo bajo.

## FASE 1 — Experiencia principal
1.1. Rediseñar Dashboard (gráficos, accesos rápidos, alertas accionables), reutilizando endpoints ya existentes. — P1-05. Riesgo medio. Depende de: Fase 0 (StatusBadge, ErrorState) y de DP-01 si el Dashboard debe enlazar a módulos aún no separados.
1.2. Extraer `FormularioPersona` compartido entre Clientes y Codeudores. — P2-07. Riesgo bajo.
1.3. Añadir validación de error por campo en formularios de Cliente/Codeudor/Inmueble. — P2-09. Riesgo bajo.
1.4. Añadir paso de vista previa en Contrato Nuevo. — P2-08. Riesgo bajo.
1.5. Autocompletar/debounce en buscadores de Contrato Nuevo, Novedad Nueva y Recaudo. — P3-06. Riesgo bajo.

## FASE 2 — Detalles de entidad
Orden justificado (no se asume el orden de la especificación): **Contrato primero**, porque es la entidad que más módulos tocan (Recaudo, Novedades, Obligaciones si se separan) y porque ya existe una plantilla arquitectónica válida en `recibos/[id].vue` para replicar. **Cliente e Inmueble después**, en cualquier orden entre sí (no hay dependencia real entre ambos). **Codeudor y Usuario al final**, solo si el negocio confirma que el valor supera el costo (son entidades más simples, con menos necesidad de una vista de historial propia).
2.1. Construir `contratos/[id].vue` (Resumen/Canon/Depósito/Obligaciones/Recaudo/Historial). — P1-04. Riesgo medio.
2.2. Construir `clientes/[id].vue` e `inmuebles/[id].vue`. Riesgo medio.
2.3. Añadir acción Ver/Ver contrato en Inmuebles, enlazando a los detalles ya construidos. — P2-06. Riesgo bajo.
2.4. Evaluar `codeudores/[id].vue` y detalle de Usuario — solo si el negocio lo pide. — P3-08. Riesgo bajo.

## FASE 3 — Finanzas (bloqueada por DP-01 y DP-02)
**BLOQUEANTE:** no iniciar sin resolución de DP-01 (separación de módulos) y DP-02 (obligaciones de solo lectura para Recepcionista).
3.1. Si DP-01 confirma separación: construir Cartera (vista interactiva por antigüedad), Gastos (bandeja global filtrando el mismo endpoint de Novedades), Depósitos (bandeja global reutilizando la lógica ya construida en la ficha de recaudo), Transferencias (extraída de Movimientos). Riesgo alto si se construye sin la decisión confirmada.
3.2. Agregar resumen de 3 totales Canon/Novedad/Mora en Recaudo y Recibo detalle. — P2-04. Riesgo bajo — **marcar explícitamente que esto es un cambio de presentación, no de cálculo (RIESGO DE NEGOCIO — REQUIERE VALIDACIÓN si se tocara el cálculo subyacente)**.
3.3. Hacer obligatoria la observación de Caja con diferencia≠0. — P2-05. Riesgo bajo.
3.4. Mostrar saldo pendiente del contrato en el modal de Terminar. Riesgo bajo.

## FASE 4 — Consistencia
4.1. Aplicar `PageHeader`, `FilterBar`, `MoneyValue` retroactivamente a las 19 páginas. Riesgo bajo-medio (no cambia comportamiento, solo presentación).
4.2. Unificar el color de marca hardcodeado de Login/Registro al token `amber`. — P3-01. Riesgo bajo.
4.3. Simplificar el doble badge de Novedades. — P3-05. Riesgo bajo.
4.4. Desglose corto de "Mixto" en Recibos. — P3-04. Riesgo bajo.

## FASE 5 — Responsive y accesibilidad
5.1. Definir y aplicar el patrón de "tabla a tarjetas" en móvil para las ~13 tablas del sistema, priorizando Recaudo y Novedades (flujos de campo). Riesgo medio.
5.2. Colapsar grillas de formulario a 1 columna en móvil donde aplique (Configuración, Inmueble, Contrato Nuevo). Riesgo bajo.
5.3. Añadir `aria-label` a botones de solo-ícono restantes. — P3-02. Riesgo bajo.
5.4. Verificación manual de foco visible y navegación por teclado en modales y dropdowns. Riesgo bajo (probablemente ya cubierto por Nuxt UI, requiere confirmación).

## FASE 6 — Refinamiento
6.1. Construir `MoneyInput` con formato de miles en vivo. — P3-03. Riesgo bajo.
6.2. Mensaje contextual de "sesión expirada" en Login (si DP-05 lo confirma). Riesgo bajo.
6.3. Limpiar `middleware: []` sin efecto en Dashboard. — P3-07. Riesgo bajo.
6.4. Ampliar catálogo de Reportes (si DP-01 confirma nuevos módulos) y decidir vista previa vs. descarga directa (DP-04). Riesgo bajo.

---

# 23. Dependencias

```
Fase 0 (base transversal)
  ├─→ Fase 1 (experiencia principal)
  │      └─→ Fase 2 (detalles de entidad)
  │             └─→ Fase 3 (finanzas) ⛔ requiere DP-01 + DP-02
  ├─→ Fase 4 (consistencia) — puede iniciar en paralelo a Fase 1/2 una vez Fase 0 esté lista
  └─→ Fase 5 (responsive/accesibilidad) — se beneficia de esperar a que el número de pantallas esté estable (post Fase 3), pero sus tareas de sidebar/drawer (0.6) ya se resuelven en Fase 0

Fase 6 (refinamiento) — depende de que todo lo anterior esté estable; es la única fase sin bloqueantes propios.
```

**Dependencias críticas a respetar:**
- 0.4 (`useListadoPaginado`) debe completarse antes de 3.1 (nuevos módulos financieros), para que Cartera/Gastos/Depósitos/Transferencias nazcan usando el patrón correcto en vez de sumar una copia más del patrón duplicado.
- 2.1 (detalle de Contrato) debe completarse antes de 2.3 (acción Ver/Ver contrato en Inmuebles) y antes de mostrar saldo pendiente en el modal de Terminar (3.4), porque ambas reutilizan datos que el detalle de Contrato expone.
- DP-01 y DP-02 deben resolverse antes de iniciar cualquier tarea de la Fase 3.

---

# 24. Riesgos

**Marcados como RIESGO DE NEGOCIO — REQUIERE VALIDACIÓN (no ejecutar sin confirmación explícita):**
- Cualquier cambio a la vista de Recaudo/Recibo que toque el *cálculo* de aplicación Canon→Novedad→Mora (no solo su presentación en pantalla).
- Cualquier cambio al comportamiento por defecto del excedente (cambio vs. saldo a favor) — la política actual ("por defecto se devuelve como cambio") ya fue confirmada explícitamente por el negocio.
- Cualquier intento de "simplificar" el vocabulario de estados de Novedad sin antes resolver DP-03.
- Cualquier cambio a la lógica de `OCUPADO` en Inmuebles o a la derivación del día de pago en Contrato Nuevo (comentarios `CONT-03`/`CONT-04`) sin entender primero la relación completa Contrato↔Inmueble que esas reglas protegen.
- Eliminar los stores de Pinia sin usar (0.5) es de riesgo bajo **solo si** se verifica antes que ningún plugin, hook de SSR o import indirecto los referencia — la recomendación no es "no tocar por si acaso", es "verificar antes de tocar".

**Riesgos de ejecución del plan (no de negocio):**
- Construir módulos financieros nuevos (Fase 3.1) sin resolver DP-01 primero puede resultar en trabajo que se descarta o se rehace.
- Migrar las ~10 páginas a `useListadoPaginado` (0.4) todas a la vez, en vez de una por una con validación intermedia, aumenta la probabilidad de introducir una regresión de filtrado silenciosa.
- Rediseñar el Dashboard (1.1) antes de que DP-01 esté resuelto puede requerir un segundo rediseño si aparecen módulos nuevos que el Dashboard debería enlazar.

---

# 25. Criterios de validación

- **Fase 0:** ninguna página cambia su comportamiento observable tras la extracción de componentes/composables (regresión visual y funcional = cero); simular un error de red confirma que aparece "Reintentar" y que reintenta la misma petición; el header muestra el título correcto en las 19 páginas; el sidebar se abre como drawer en un viewport de 375px; Recepcionista puede editar un Cliente y un Codeudor sin que cambie el comportamiento para Administrador.
- **Fase 1:** el Dashboard responde visualmente a "cómo está el negocio hoy" sin salir de la página; los formularios de Cliente/Codeudor/Inmueble muestran el campo específico que falló, no solo un mensaje general.
- **Fase 2:** desde el listado de Contratos, Clientes e Inmuebles, un clic en la fila lleva a un detalle poblado con datos reales; el detalle de Contrato incluye Historial visible sin necesitar pasar por Auditoría.
- **Fase 3:** DP-01 y DP-02 están documentados como decididos antes de cualquier commit de esta fase; si se separan módulos, cada uno reutiliza (verificable en Network) los endpoints ya existentes en vez de duplicar llamadas; el resumen Canon/Novedad/Mora coincide exactamente con el total ya calculado por el backend (no se introduce un cálculo paralelo en el frontend).
- **Fase 4:** cambiar un color de estado en `StatusBadge` se refleja en todas las pantallas sin tocar cada una individualmente.
- **Fase 5:** en un viewport de 375px, ninguna tabla obliga a scroll horizontal sin indicación visual, y el menú es accesible vía drawer en las 19 páginas; un auditor automático (Lighthouse/axe) no reporta "botón sin nombre accesible" en los componentes de ícono cubiertos.
- **Fase 6:** los inputs de dinero muestran separador de miles mientras el usuario escribe, sin alterar el valor numérico enviado al backend.

---

# 26. Orden recomendado de implementación

1. **Fase 0** completa — es la única fase sin ninguna dependencia externa y la que reduce más riesgo para todo lo que sigue.
2. **Resolver DP-01, DP-02, DP-03** (decisiones de producto) — en paralelo a la Fase 0, no después, para no bloquear el inicio de la Fase 3 más adelante.
3. **Fase 1** — experiencia principal, con el Dashboard como último paso de la fase si DP-01 todavía no está resuelto (para no rediseñarlo dos veces).
4. **Fase 2** — Contrato primero, luego Cliente/Inmueble.
5. **Fase 3** — solo si DP-01/DP-02 ya están resueltos; en caso contrario, adelantar 3.2/3.3/3.4 (que no dependen de esas decisiones) y posponer 3.1.
6. **Fase 4** — una vez el número de pantallas esté estable.
7. **Fase 5** — sobre el conjunto ya estable.
8. **Fase 6** — al final, sin bloqueantes propios.

**Nota de cierre:** este plan asume que el mayor valor no está en "terminar rápido" sino en no reconstruir dos veces la misma pantalla — de ahí que las decisiones de producto (sección 19) se resuelvan temprano y en paralelo, no como un trámite al final de la auditoría.
