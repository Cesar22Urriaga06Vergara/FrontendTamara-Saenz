# Auditoría Frontend UI/UX + Plan de Acción
## Inversiones Tamara & Saenz S.E.N.C.

**Alcance de esta etapa:** solo auditoría, comparación y planificación. No se modificó código, no se crearon commits, no se tocó lógica ni componentes.

**Fuentes comparadas:**
- **FUENTE 1 — Frontend actual:** `FrontendTamara-Saenz` (Nuxt 3 + @nuxt/ui + Pinia + Tailwind), 26 archivos de páginas/componentes/stores revisados línea por línea.
- **FUENTE 2 — Especificación UI/UX:** `ESPECIFICACION_UI_UX_PAGINA_POR_PAGINA.md` (58 secciones).
- **FUENTE 3 — Mockup de referencia:** imagen de 11 tarjetas (Dashboard, Clientes, Inmuebles, Contratos, Obligaciones, Recaudo, Cartera, Caja, Novedades, Depósitos, Reportes).
- **Contexto adicional usado para calibrar el juicio:** reglas de negocio ya confirmadas por el usuario en sesiones previas de este mismo proyecto (roles Recepcionista/Administrador, estados de Contrato, política de excedente, trazabilidad financiera). Donde el frontend actual se aparta de la especificación genérica pero coincide con una regla de negocio ya confirmada, esta auditoría lo señala como **decisión deliberada**, no como defecto — para no proponer deshacer trabajo ya validado contigo.

---

# 1. Resumen ejecutivo

El frontend actual **no es un prototipo**: es una aplicación funcionalmente madura, con manejo de dinero cuidadoso (recaudo con simulación en backend antes de confirmar, anulación en vez de edición, trazabilidad en movimientos de caja, permisos reforzados en middleware + UI). En el núcleo financiero (Recaudo → Recibo → Caja → Movimientos) el patrón **Datos → Revisión → Confirmación → Resultado** exigido por la especificación **sí se cumple**, y de forma más rigurosa que lo que pide el documento genérico (la previsualización se calcula en el servidor, no en el cliente, así que nunca puede desincronizarse del pago real).

Sin embargo, la **arquitectura de información diverge fuertemente** de la especificación entregada:

- La especificación describe **31 páginas** organizadas en Inmuebles, Propietarios, Contratos, Clientes, Obligaciones, Novedades / Recaudo, Cartera, Gastos, Depósitos, Caja, Transferencias / Reportes, Auditoría / Usuarios, Configuración — cada uno con su propio listado **y** su propia página de detalle.
- El frontend actual implementa **19 páginas**. Varios módulos completos de la especificación **no existen como pantalla propia** (Propietarios, Obligaciones, Cartera, Gastos, Depósitos, Transferencias), y **ninguna entidad tiene página de detalle** (Cliente, Codeudor, Inmueble, Contrato) — todo el CRUD ocurre en modales sobre el listado.
- En su lugar, esa funcionalidad **está fusionada** dentro de pantallas más amplias: Obligaciones y Depósitos viven dentro de la "ficha de recaudo" de Recaudo; Gastos vive dentro del flujo de aprobación de Novedades; Transferencias vive dentro de Movimientos (como un sub-total, no como módulo propio); Cartera vive como una fila de KPI en el Dashboard y como un reporte Excel, no como pantalla interactiva.

Esto **no es necesariamente un error** — es una decisión de consolidación que reduce el número de pantallas a mantener, y en el caso de Recaudo/Depósitos está alineada con reglas de negocio que tú mismo confirmaste en sesiones anteriores (control exclusivo de Administrador sobre el motor financiero). Pero **si la intención original de negocio era la de la especificación** (módulos independientes, con vista de Cartera por antigüedad, Gastos como bandeja de pagos pendientes de toda la cartera, y detalle navegable por entidad), entonces el frontend actual está **lejos** de esa intención, y hay trabajo real de UI por construir, no solo de estilo.

**Qué tan cerca está del objetivo:**

| Dimensión | Cercanía al objetivo | Comentario |
|---|---|---|
| Identidad visual (dorado/gris/estados) | Alta (~85%) | Paleta correctamente centralizada en `tailwind.config.ts` y `app.config.ts`; colores de estado consistentes. |
| Núcleo financiero (Recaudo/Caja/Movimientos) | Alta (~80%) | El patrón de confirmación y trazabilidad es sólido; falta pulir la presentación Canon/Novedad/Mora explícita. |
| Cobertura de páginas vs. especificación | Baja-media (~45%) | Faltan 6 módulos como pantalla propia; no existe ninguna página de detalle. |
| Navegación vs. especificación | Baja (~40%) | Agrupación y nombres de secciones distintos; módulos re-etiquetados o fusionados. |
| Responsive real (no solo "se encoge") | Baja (~30%) | Sidebar fijo sin drawer móvil; tablas no colapsan a tarjetas en móvil. |
| Permisos (backend + UI) | Alta (~85%), con una regresión puntual | Patrón robusto en general; se detectó una inconsistencia real en Clientes/Codeudores (ver P1-01). |
| Accesibilidad | Media (~55%) | Labels correctos vía `UFormGroup`; contraste correcto; faltan `aria-label` en botones de solo-ícono. |
| Duplicación de arquitectura | Media | Dos stores de Pinia (`contratos`, `novedades`, `filtros`) existen pero no se usan — cada página reimplementa su propio estado local. |

**Conclusión de la etapa de auditoría:** no se recomienda una reescritura. Se recomienda **decidir primero, explícitamente, si los módulos fusionados (Obligaciones/Cartera/Gastos/Depósitos/Transferencias) deben separarse en pantallas propias según la especificación, o si la consolidación actual es la dirección de producto real** — porque esa decisión determina el 60% del plan de acción de las Fases 2 y 3. El resto de hallazgos (responsive, header muerto, duplicación de stores, permisos de Clientes/Codeudores) son correcciones concretas y de bajo riesgo que pueden ejecutarse independientemente de esa decisión.

---

# 2. Estado general

### UI
Sistema de color y tipografía coherente y centralizado (Tailwind + `app.config.ts` de Nuxt UI apuntan ambos a `amber`/`slate`, evitando el verde/gris por defecto de la librería). Los badges de estado siempre combinan color + texto (cumple regla de accesibilidad de no depender solo del color). Debilidad principal: **no hay componentes globales de presentación** (`PageHeader`, `StatusBadge`, `MoneyValue`) — cada página repite manualmente el mismo patrón de encabezado y su propio mapa de colores de estado, lo cual funciona hoy pero es frágil ante cambios futuros (cambiar un color de estado exige tocar 6+ archivos).

### UX
El flujo financiero de Recaudo es el punto más fuerte de todo el frontend: búsqueda → ficha → registro de pago mixto → previsualización (calculada en servidor) → confirmación → resultado con recibo descargable. Las acciones destructivas (anular recibo, anular obligación, reversar movimiento, terminar contrato, reactivar contrato) siempre piden motivo y explican la consecuencia en un `UAlert` antes de confirmar. Debilidad: al no existir páginas de detalle, el usuario no tiene un lugar único donde "comprender" una entidad completa (historial de un cliente, de un inmueble, de un contrato) — todo son fragmentos repartidos entre el listado y (para lo financiero) la ficha de recaudo.

### Arquitectura
Nuxt 3 + Pinia + composables es una base razonable. Hallazgo relevante: `stores/contratos.store.ts`, `stores/novedades.store.ts` y `stores/filtros.store.ts` **existen pero no son importados por ninguna página** — `pages/contratos/index.vue` y `pages/novedades/index.vue` reimplementan su propia carga y filtros localmente. Esto es código muerto o, peor, dos fuentes de verdad divergentes si alguien las retoma sin saberlo.

### Responsive
Sidebar de ancho fijo (`w-64 shrink-0 ... sticky top-0 h-screen`) sin ningún mecanismo de colapso, sin botón de menú hamburguesa en el header, y sin `lg:hidden`/`md:hidden` en ningún archivo del proyecto. En una pantalla de teléfono esto no se "ve mal": la navegación deja de ser usable. Las tablas (`UTable`) no tienen una versión de tarjetas para móvil.

### Finanzas
Es la parte mejor resuelta del sistema. Cumple el patrón Datos→Revisión→Confirmación→Resultado, nunca edita en sitio (siempre anula/reversa + motivo), y separa correctamente caja física de transferencias (tarjetas de saldo independientes en Movimientos, con aviso explícito cuando hay dinero "sin medio identificado"). Ver sección 10 para detalle.

### Permisos
Patrón de doble capa (middleware de rutas + `v-if` en UI) aplicado de forma consistente en la mayoría de acciones sensibles. Se encontró una inconsistencia concreta y verificable: en Clientes y Codeudores, el botón "Nuevo" es visible para cualquier rol pero **Editar** queda oculto para Recepcionista (ver P1-01) — contradice la regla de negocio que tú mismo confirmaste ("Recepcionista puede crear y editar Clientes, Codeudores e Inmuebles").

### Accesibilidad
Los formularios usan `UFormGroup` con label asociado (correcto). El toggle de mostrar/ocultar contraseña en Login/Registro sí tiene `aria-label` dinámico (buena práctica, vale la pena replicarla). Los botones de solo-ícono en tablas (editar en Inmuebles, engranaje de acciones) no tienen `aria-label`.

---

# 3. Hallazgos críticos (P0)

No se encontraron defectos que cumplan el criterio P0 tal como lo define la especificación (error financiero real, pérdida de información, violación grave de permisos, pérdida de trazabilidad). El núcleo financiero está bien construido: usa simulación server-side, nunca edita en sitio, y siempre exige motivo en reversos/anulaciones.

**Lo más cercano a un P0 es un hallazgo de gobernanza de alcance, no de código**: los módulos Obligaciones, Cartera, Gastos, Depósitos, Transferencias y Propietarios no existen como pantallas propias. Si el negocio realmente necesita, por ejemplo, ver **toda la cartera vencida de la cartera completa por antigüedad (0-30/31-60/61-90/+90)** para gestión de cobro proactiva — y hoy eso solo existe como un número agregado en el Dashboard y un Excel — esa carencia sí tiene impacto operativo real. Se registra aquí como **H0-01** y se detalla en la sección 4, porque su clasificación final (P0 vs P1) depende de una decisión de producto que corresponde al negocio, no al código.

---

# 4. Hallazgos importantes (P1)

| ID | Hallazgo | Evidencia | Impacto |
|---|---|---|---|
| **P1-01** | Recepcionista no puede editar ni dar de baja Clientes/Codeudores, solo crear. | `pages/clientes/index.vue` y `pages/codeudores/index.vue`: `<UiTableRowActions v-if="auth.esAdministrador" ...>` envuelve **Editar y Dar de baja/Reactivar** juntos. | Contradice la regla de negocio ya confirmada ("Recepcionista puede crear y editar Clientes, Codeudores e Inmuebles"). Bloquea trabajo operativo legítimo del rol. |
| **P1-02** | Sidebar no colapsa en móvil/tablet; no hay drawer ni botón de menú. | `components/layout/Sidebar.vue` (ancho fijo `w-64`, sin breakpoints), `components/layout/Header.vue` (sin botón de menú). | La especificación exige explícitamente "drawer en móvil" (§4). En un viewport angosto, contenido y sidebar compiten por el mismo espacio. |
| **P1-03** | El header nunca muestra el título/breadcrumb de la página actual. | `Header.vue` define `<slot name="titulo">` con fallback "Panel"; ninguna página del proyecto pasa ese slot (`grep` sobre `pages/**/*.vue` no encuentra un solo uso). | El encabezado superior es efectivamente código muerto: siempre dice "Panel", sin importar en qué módulo esté el usuario. No hay breadcrumb en ningún lugar del sistema. |
| **P1-04** | Sin páginas de detalle para ninguna entidad (Cliente, Codeudor, Inmueble, Contrato). | No existen `pages/clientes/[id].vue`, `pages/inmuebles/[id].vue`, `pages/contratos/[id].vue`, etc. Toda edición ocurre en modal sobre el listado. | Contradice el patrón "Tabla para localizar; detalle para comprender" (§2.4) y las páginas 04/06/08/12 de la especificación (tabs de Información/Historial/Obligaciones/Recaudo). No hay forma de ver el historial de un inmueble o de un contrato sin pasar por Auditoría. |
| **P1-05** | Módulos completos de la especificación no existen como pantalla propia: Propietarios, Obligaciones, Cartera, Gastos, Depósitos, Transferencias. | Ausentes en `pages/`; funcionalidad fusionada dentro de Recaudo (ficha de recaudo cubre obligaciones/depósito) y Novedades (cubre gasto). | Es la brecha de mayor tamaño frente a la especificación y el mockup. Puede ser intencional (ver H0-01) — requiere decisión explícita antes de planificar Fase 3. |
| **P1-06** | Ninguna tabla del sistema tiene acción "Reintentar" en su estado de error. | Todas las páginas manejan error con `<UAlert color="red">` estático; ninguna ofrece un botón para reintentar la carga. | Contradice §39 ("Error: mensaje comprensible + Reintentar"), consistente en las ~19 páginas. |
| **P1-07** | Dashboard muy por debajo de la especificación y del mockup de referencia. | `pages/dashboard/index.vue`: solo 4 tarjetas numéricas; sin gráficos, sin accesos rápidos, sin alertas accionables. | La especificación (§7) y el mockup piden cartera por antigüedad, ingresos vs. egresos, accesos rápidos (nuevo contrato/cliente/inmueble/recaudo/novedad/gasto) y alertas accionables (obligaciones vencidas, novedades pendientes, gastos aprobados sin pagar). Hoy el usuario debe navegar a 3-4 módulos distintos para responder "¿cómo está el negocio hoy?". |

---

# 5. Mejoras medias (P2)

| ID | Hallazgo | Evidencia |
|---|---|---|
| P2-01 | Stores de Pinia sin usar: `contratos.store.ts`, `novedades.store.ts`, `filtros.store.ts`. | Ninguna página los importa; cada listado reimplementa `cargar()` y filtros locales por su cuenta. Riesgo de doble fuente de verdad si alguien retoma el store sin darse cuenta de que no está conectado. |
| P2-02 | Lógica de filtros (búsqueda + barrio + fechas) duplicada en Inmuebles, Contratos y Novedades. | Los tres archivos declaran su propio `reactive({ busqueda, barrio, fechaDesde, fechaHasta })` y su propio `watch`, en vez de un componente `FilterBar` compartido. |
| P2-03 | Mapas de color de estado (`estadoColor`) duplicados en cada página en vez de un `StatusBadge` centralizado. | Presente en Inmuebles, Contratos, Novedades, Recibos, Movimientos, Caja — 6 copias del mismo patrón `Record<string, color>`. |
| P2-04 | Vista previa de Recaudo no muestra explícitamente los tres renglones fijos Canon/Novedad/Mora que pide la especificación (§22 Paso 4). | `pages/recaudo/index.vue`: la previsualización muestra una tabla dinámica de obligaciones afectadas con badge Capital/Mora, no un resumen fijo de 3 líneas. Funcionalmente correcto (de hecho más flexible: soporta múltiples obligaciones), pero visualmente distinto del patrón exacto del documento. |
| P2-05 | `definePageMeta({ middleware: [] })` en `dashboard/index.vue` no tiene efecto real (el middleware global sigue aplicando) — probable resto de una refactorización anterior. | No es un hueco de seguridad (verificado: `auth.global.ts` corre siempre por ser middleware global), pero es código confuso que sugiere una intención de seguridad que no cumple. |
| P2-06 | Acceso de solo-lectura a obligaciones para Recepcionista no existe (todo `/recaudo` es exclusivo Administrador). | La especificación (§54) lista "consulta de obligaciones" dentro del menú de Recepcionista. Aquí probablemente es intencional (coincide con la regla ya confirmada de que todo lo financiero es exclusivo de Administrador) — se registra como posible ajuste, no como defecto, hasta que el negocio lo confirme. |
| P2-07 | Botones de solo-ícono sin `aria-label` (editar en Inmuebles, ellipsis de `TableRowActions`). | El propio proyecto ya tiene el patrón correcto en Login/Registro (`:aria-label="mostrarPassword ? ... : ..."`) — falta replicarlo en el resto. |
| P2-08 | No existe un componente `MoneyValue` con variantes (positivo/negativo/total/saldo); cada pantalla decide manualmente la clase de color (`text-emerald-600`, `text-red-600`, `text-amber-600`). | Presente en Dashboard, Caja, Movimientos, Recaudo, Recibo. Funciona, pero es una decisión de estilo repetida en vez de una regla centralizada. |
| P2-09 | Inmuebles: falta la acción "Ver" / "Ver contrato" que pide la especificación (§8); solo existe "Editar". | `pages/inmuebles/index.vue`, columna de acciones: un solo botón de lápiz. Sin página de detalle no hay a dónde llevar un "Ver". |

---

# 6. Mejoras menores (P3)

- El slogan/nombre de marca se resuelve dos veces con la misma lógica (`useMarcaEmpresa`) en Login y Registro — correcto (es un composable reutilizado, no duplicación real), se menciona solo para confirmar que **no** requiere acción.
- Loading de tablas usa el spinner nativo de `UTable` (`:loading`) en vez de un `SkeletonTable` con filas fantasma. Es una interpretación razonable del requisito y no genera bloqueo de página completa; bajar de prioridad frente a otros huecos de loading más visibles.
- `ConfirmModal.vue` (genérico) convive con modales de confirmación hechos a mano para operaciones financieras (terminar/reactivar contrato, anular recibo/obligación, reversar movimiento). Esto es correcto — esas operaciones necesitan mostrar contexto financiero que un diálogo genérico no puede — no se recomienda forzarlas dentro de `ConfirmModal`.
- Falta un `ExportButton` reutilizable; Reportes resuelve la exportación con una función local (`useExcelExport`) llamada directamente — funciona bien, es solo una oportunidad de nombrar el patrón.
- El campo `Registro especial` de Propietarios (INMOBILIARIA como propietario interno, §10) no aplica: no existe el concepto de Propietario en el dominio actual del frontend (los inmuebles no muestran un campo "Propietario"). Ligado a H0-01/P1-05.

---

# 7. Auditoría página por página

> Se documentan las 19 páginas existentes. Las páginas de la especificación que no tienen equivalente en el frontend (Propietarios, Detalle de Inmueble/Cliente/Contrato, Obligaciones, Cartera, Gastos, Depósitos, Transferencias, Resolver Novedad como pantalla propia, Usuarios como pantalla separada de Configuración) se listan al final de la sección como "Páginas de la especificación sin construir".

## PÁGINA: Login (`pages/login.vue`)
**Estado actual:** split-screen marca/formulario, validación de email y contraseña, mostrar/ocultar contraseña, enlace a registro inicial.
**Cumplimiento:** Cumple.
**Problemas:** Ninguno relevante.
**Elementos faltantes:** "Sesión expirada" como estado explícito (§6) — hoy un token expirado simplemente redirige a Login sin mensaje contextual.
**UX/UI:** Clara, feedback de error visible, jerarquía correcta.
**Responsive:** El panel de marca se oculta en pantallas `<lg` (`hidden lg:flex`) y el formulario queda centrado — correcto.
**Permisos:** N/A (pública).
**Recomendación:** Añadir mensaje diferenciado para sesión expirada vs. credenciales inválidas.
**Prioridad:** P3.

## PÁGINA: Registro inicial (`pages/registro.vue`)
**Estado actual:** bootstrap del primer Administrador, bloqueado automáticamente si ya existe algún usuario (403 → aviso claro).
**Cumplimiento:** No está en la especificación (es una necesidad real de puesta en producción) — se evalúa por consistencia, no por cumplimiento.
**UX/UI:** Igual de cuidada que Login; maneja bien el caso "ya no disponible".
**Recomendación:** Ninguna. **No tocar.**
**Prioridad:** —

## PÁGINA: Dashboard (`pages/dashboard/index.vue`)
**Estado actual:** 4 tarjetas (contratos activos, cartera total [admin], recaudo del mes [admin], novedades abiertas).
**Cumplimiento:** Cumple parcialmente.
**Problemas encontrados:** sin gráficos (cartera por antigüedad, ingresos vs. egresos), sin accesos rápidos, sin alertas accionables, header sin usar (`Panel` fijo).
**Elementos faltantes:** todo lo listado en §7 de la especificación salvo los 2 indicadores mostrados.
**UX:** honesto pero pobre — no responde "¿cómo está el negocio hoy?" más allá de 4 números.
**Permisos:** correctos (las cifras financieras solo se piden si `auth.esAdministrador`, coincidiendo con que el backend las protege con `@Roles(ADMINISTRADOR)`).
**Recomendación:** Rediseñar como Fase 2, una vez esté resuelta la decisión de módulos (H0-01), reutilizando los mismos endpoints ya existentes (`/dashboard`, `/dashboard/financiero`) más los que ya alimentan a Reportes y Movimientos.
**Prioridad:** P1.

## PÁGINA: Inmuebles (`pages/inmuebles/index.vue`)
**Estado actual:** listado con filtros (búsqueda, barrio, estado), modal crear/editar, edición de estado restringida a las transiciones válidas (`MANTENIMIENTO`/`INACTIVO`/`DISPONIBLE`, nunca `OCUPADO` manual).
**Cumplimiento:** Cumple parcialmente.
**Problemas encontrados:** solo acción "Editar"; falta "Ver" y "Ver contrato" (§8).
**Elementos faltantes:** columna "Contrato" de la tabla especificada; página de detalle con tabs Información/Propietario/Contrato/Historial (§9).
**Elementos correctos y a conservar:** el candado de negocio sobre `OCUPADO` (comentario `CONT-03` en el propio código) es exactamente lo que pide la especificación ("no ofrecer cambio manual de ocupado/disponible cuando ese estado dependa del contrato").
**Permisos:** correcto — sin restricción de rol, coincide con la regla confirmada.
**Recomendación:** Mantener la lógica de estado; añadir "Ver contrato" cuando exista una forma de navegar al contrato asociado.
**Prioridad:** P2.

## PÁGINA: Clientes (`pages/clientes/index.vue`)
**Estado actual:** listado con búsqueda estricta por documento/nombre, modal crear/editar, baja lógica con confirmación, reactivación directa.
**Cumplimiento:** Cumple parcialmente.
**Problemas encontrados:** **P1-01** — Editar/Dar de baja ocultos para Recepcionista, contradiciendo la regla de negocio confirmada.
**Elementos faltantes:** columnas "Contratos" y "Cartera" de la tabla especificada (§12); acciones "Crear contrato" e "Ir a cartera/recaudo" desde la fila; página de detalle con tabs (§13).
**UX:** búsqueda clara, feedback de error visible.
**Recomendación:** Cambiar el `v-if` de `TableRowActions` para separar Editar (visible a ambos roles) de Dar de baja (exclusivo Administrador, si esa es la intención) o de ambos roles si el negocio confirma que dar de baja también es operativo.
**Prioridad:** P1.

## PÁGINA: Codeudores (`pages/codeudores/index.vue`)
**Estado actual y problemas:** idéntico patrón y mismo defecto que Clientes (**P1-01**).
**Cumplimiento:** Cumple parcialmente (no hay página de especificación dedicada a Codeudores como listado independiente — la especificación los ubica dentro del Cliente, §14 — pero el frontend los trata como directorio propio, lo cual es razonable dado el soporte N:M con Contrato).
**Recomendación:** Igual que Clientes.
**Prioridad:** P1.

## PÁGINA: Contratos — listado (`pages/contratos/index.vue`)
**Estado actual:** listado con filtros completos (búsqueda, barrio, fechas, estado), Terminar (con motivo + fecha) y Reactivar (exclusivo Administrador, con motivo) como modales bien resueltos.
**Cumplimiento:** Cumple parcialmente.
**Problemas encontrados:** ninguno grave — las dos únicas transiciones de estado (ACTIVO/TERMINADO) y sus reglas coinciden exactamente con lo confirmado (§6.2, §6.6 en comentarios del propio código).
**Elementos faltantes:** página de detalle con tabs Resumen/Canon y fechas/Depósito/Obligaciones/Recaudo/Historial (§17); esto concentra el mayor costo de no tener detalle de entidad en todo el sistema, porque Contrato es el objeto financiero central.
**Elementos correctos a conservar:** el modal de Terminar advierte explícitamente que la deuda pendiente sigue cobrable (coincide al pie de la letra con §18); el modal de Reactivar exige motivo y explica el efecto en auditoría (coincide con §19). **No tocar esta lógica.**
**Permisos:** correctos y verificados contra la regla de negocio confirmada.
**Recomendación:** Página de detalle de Contrato es la pieza que más valor UX agregaría de toda la Fase 2 (ver Plan de acción).
**Prioridad:** P1.

## PÁGINA: Contratos — nuevo (`pages/contratos/nuevo.vue`)
**Estado actual:** formulario por bloques (Arrendatario → Codeudor(es) → Inmueble disponible → Datos del contrato), 100% por búsqueda de entidades ya existentes (no se digitan personas nuevas aquí).
**Cumplimiento:** Cumple.
**Elementos faltantes:** vista previa antes de guardar (§16 la pide explícitamente: inmueble/cliente/canon/inicio/pago/depósito/mora en un solo resumen). Hoy se va directo de "Datos del contrato" a "Crear contrato" sin paso de revisión.
**Elementos correctos a conservar:** el manejo del día de pago (se deriva de la fecha de inicio hasta que el usuario lo edite manualmente, comentario `CONT-04`) es un detalle bien pensado — replicar este patrón en cualquier campo similar futuro.
**Recomendación:** Añadir un paso de vista previa antes de "Crear contrato", reutilizando los datos que ya están en memoria (no requiere llamada adicional al backend).
**Prioridad:** P2.

## PÁGINA: Novedades — listado (`pages/novedades/index.vue`)
**Estado actual:** listado con filtros, descarga de "recibo de novedad" (PDF sin efecto financiero, disponible para todos los roles), aprobación financiera (Cargo arrendatario / Gasto inmobiliaria) exclusiva Administrador, y "Registrar pago" del gasto ya aprobado como paso separado y explícito.
**Cumplimiento:** Cumple parcialmente frente a la especificación genérica (que usa estados PENDIENTE/en vez de ABIERTA/EN_SEGUIMIENTO/CERRADA/ANULADA), pero **cumple exactamente** las reglas de negocio ya confirmadas contigo (aprobar no mueve dinero; solo "Registrar pago" genera el egreso real — el propio código lo documenta como regla `NOV-01`).
**Elementos correctos a conservar:** separación aprobación/pago; nunca se etiqueta "Pagado" al aprobar (coincide al pie de la letra con §26: "Nunca mostrar 'Pagado' al aprobar"). **No tocar.**
**Elementos faltantes:** no existe una pantalla "Gastos" que muestre, para toda la cartera de novedades, únicamente las que ya están `GASTO_INMOBILIARIA` y pendientes de pago — hoy hay que filtrar visualmente la tabla completa de novedades para encontrarlas.
**Recomendación:** Si el negocio quiere una bandeja de "gastos pendientes de pago" (como en el mockup, tarjeta 20), puede construirse como una vista filtrada de este mismo endpoint, sin duplicar lógica.
**Prioridad:** P2.

## PÁGINA: Novedades — nueva (`pages/novedades/nueva.vue`)
**Estado actual:** formulario simple (inmueble → contrato opcional → descripción → fecha → responsable sugerido), sin ningún campo financiero.
**Cumplimiento:** Cumple.
**Elementos correctos a conservar:** el texto final ("Este registro NO genera ningún impacto financiero...") es exactamente el tipo de mensaje que pide §2.1 (consecuencia visible de la acción). **No tocar.**
**Prioridad:** —

## PÁGINA: Recaudo (`pages/recaudo/index.vue`)
**Estado actual:** búsqueda de contrato → ficha de recaudo (obligaciones pendientes, saldo a favor, depósito) → registro de pago mixto (varios medios en un recibo) → previsualización calculada en backend → confirmación → recibo con PDF descargable; incluye además anulación de obligación sin abonos y liquidación de depósito para contratos terminados.
**Cumplimiento:** Cumple con la intención funcional de la especificación (§22-23), aunque con una estructura distinta (por contrato, no por "cliente → contrato → obligaciones" como tres pasos separados).
**Elementos correctos a conservar (alta prioridad de no tocar):** la previsualización se pide al backend (`/recaudo/pagos/simular`) usando el mismo cálculo que el pago real — esto es una garantía de integridad que la especificación ni siquiera exige explícitamente, y es superior a calcular la vista previa en el cliente. **No tocar bajo ninguna circunstancia sin motivo de negocio.**
**Elementos faltantes:** el resumen de aplicación no muestra explícitamente 3 líneas fijas "Canon / Novedad / Mora" como en el mockup textual de §22 — muestra una tabla dinámica de obligaciones con badge Capital/Mora (funcionalmente equivalente, visualmente distinto). Ver P2-04.
**UX:** excelente — mensaje claro de excedente (cambio vs. saldo a favor), decisión explícita del usuario vía checkbox en vez de asumir un comportamiento.
**Permisos:** correctos — módulo completo exclusivo de Administrador, coincide con la regla confirmada.
**Recomendación:** Ajuste visual menor (P2-04); no tocar la lógica de cálculo.
**Prioridad:** P2 (ajuste visual) — el resto de la página es sólido.

## PÁGINA: Recibos — listado (`pages/recibos/index.vue`)
**Estado actual:** listado independiente de recibos históricos (fuera del flujo de Recaudo), con filtros por estado/medio/fecha/búsqueda, descarga PDF en dos formatos.
**Cumplimiento:** Cumple.
**Recomendación:** Ninguna. **No tocar.**
**Prioridad:** —

## PÁGINA: Recibo — detalle (`pages/recibos/[id].vue`)
**Estado actual:** datos del recibo, medios de pago, tabla de aplicación (concepto/período/tipo/valor/saldo posterior), anulación con motivo (nunca se elimina), enlace directo a la ficha del contrato en Recaudo.
**Cumplimiento:** Cumple con la especificación de §23 casi punto por punto (incluye advertencia de que la anulación revierte exactamente lo aplicado).
**Elementos correctos a conservar:** el mensaje de anulación ("El recibo NUNCA se elimina...") es el estándar que toda operación destructiva del sistema debería replicar textualmente. **No tocar.**
**Prioridad:** —

## PÁGINA: Caja (`pages/caja/index.vue`)
**Estado actual:** saldo esperado en vivo (calculado en backend), historial de arqueos, registro de arqueo con diferencia calculada y observaciones.
**Cumplimiento:** Cumple con §31 casi en su totalidad (saldo inicial/ingresos/egresos/saldo esperado + patrón de cierre "esperado / contado / diferencia").
**Elementos faltantes:** el flujo de cierre no exige observación obligatoria cuando hay diferencia distinta de cero (§31: "Si existe diferencia, solicitar observación y confirmación") — hoy el campo "Observaciones" es siempre opcional, incluso con diferencia.
**Recomendación:** Hacer obligatorio el campo de observaciones cuando `diferenciaPreview !== 0`.
**Prioridad:** P2.

## PÁGINA: Movimientos (`pages/movimientos/index.vue`)
**Estado actual:** libro de movimientos con filtros, saldo por medio (efectivo/transferencia/sin identificar) mostrado como tarjetas separadas, reverso manual solo donde tiene sentido (`NOVEDAD`/`DEPOSITO`, nunca sobre un reverso ya aplicado).
**Cumplimiento:** Cumple con §32 (transferencias no afectan caja física) de forma ejemplar — de hecho el propio código cita "§14 de la especificación" para justificar por qué nunca se mezclan ambos saldos.
**Elementos correctos a conservar:** el aviso ámbar de "dinero sin medio identificado" es un patrón de honestidad de datos que debería generalizarse a cualquier reporte financiero futuro. **No tocar.**
**Prioridad:** —

## PÁGINA: Auditoría (`pages/auditoria/index.vue`)
**Estado actual:** tabla con filtros (módulo, usuario, rango de fechas), columnas Fecha/Módulo/Acción/Usuario/Ruta.
**Cumplimiento:** Cumple parcialmente.
**Elementos faltantes:** no hay vista de **detalle** de un registro de auditoría (§38 pide mostrar valor anterior/valor nuevo/motivo/entidad/relación con la operación financiera) — la tabla actual no es clickable ni expande fila.
**Nota importante:** esto es coherente con una decisión tuya ya confirmada ("el patrón de anular/reversar + motivo obligatorio ya satisface la trazabilidad, sin necesitar columnas valorAnterior/valorNuevo en una tabla central") — por lo tanto **no se recomienda construir ese detalle** salvo que decidas lo contrario; se documenta aquí solo para que quede explícito por qué esta página no cumple literalmente §38.
**Prioridad:** P3 (dado el contexto anterior).

## PÁGINA: Reportes (`pages/reportes/index.vue`)
**Estado actual:** 4 tarjetas de exportación a Excel (Contratos, Cartera consolidada, Recaudo, Inmuebles por barrio).
**Cumplimiento:** Cumple parcialmente frente al catálogo más amplio de §33 (Obligaciones, Movimiento de caja, Transferencias, Novedades, Gastos como reportes separados).
**Elementos faltantes:** no hay página "Reporte" individual con filtros/tabla/paginación/exportar (§34) — cada tarjeta descarga directo, sin vista previa en pantalla.
**Recomendación:** Evaluar si conviene agregar vista previa en pantalla antes de exportar, o si la descarga directa es la experiencia deseada (es más rápida, y coincide con el principio "rapidez" de la especificación).
**Prioridad:** P3.

## PÁGINA: Administración — Usuarios (`pages/administracion/index.vue`)
**Estado actual:** CRUD de usuarios (crear, activar/desactivar con confirmación, restablecer contraseña), exclusivo Administrador.
**Cumplimiento:** Cumple con §35.
**Elementos faltantes:** página de detalle de usuario con "permisos efectivos" (§36) — hoy solo se ve el rol, no un desglose de permisos.
**Recomendación:** Baja prioridad; el rol ya comunica el conjunto de permisos en un sistema de solo 2 roles.
**Prioridad:** P3.

## PÁGINA: Configuración (`pages/configuracion/index.vue`)
**Estado actual:** datos de empresa, parámetros de mora (días de gracia, % mensual, horizonte de canon), generación manual de canon (con confirmación explicando el efecto masivo), subida de logo con preview local antes de confirmar.
**Cumplimiento:** Cumple con §37.
**Elementos correctos a conservar:** el modal de confirmación de generación de canon explica el efecto exacto ("crea deuda cobrable de forma masiva") antes de ejecutar — coincide con el estándar de acciones destructivas de §42. **No tocar.**
**Nota:** el comentario del propio código explica que "Usuarios" se separó de esta pantalla para no duplicar la gestión de un mismo recurso en dos lugares — una decisión de consolidación ya tomada y documentada, coherente con el principio de la auditoría de "no reescribir sin necesidad".
**Prioridad:** —

## Páginas de la especificación sin construir (para referencia rápida)

| Página de la especificación | Existe hoy como | Nota |
|---|---|---|
| Listado/Detalle de Propietarios | No existe | El dominio actual no modela "Propietario" como entidad. |
| Detalle de Inmueble (tabs) | No existe | Solo modal de edición. |
| Codeudores como sub-recurso del Cliente | Existe como directorio propio | Decisión de arquitectura razonable dado el N:M; no es un defecto. |
| Detalle de Cliente (tabs) | No existe | Solo modal de edición. |
| Detalle de Contrato (tabs) | No existe | El más costoso de omitir — ver P1-04. |
| Listado/Detalle de Obligaciones | Fusionado en "ficha de recaudo" | Solo visible dentro de Recaudo (exclusivo Administrador). |
| Cartera (listado interactivo por antigüedad) | Solo como KPI de Dashboard + reporte Excel | Ver H0-01 / P1-05. |
| Listado/Detalle de Gastos | Fusionado en aprobación de Novedades | Ver hallazgo de Novedades arriba. |
| Listado/Liquidación de Depósitos | Fusionado en ficha de recaudo del contrato | Solo accesible por contrato individual, no como bandeja global. |
| Transferencias (módulo propio) | Fusionado en Movimientos | Solo como tarjeta de saldo dentro de un listado combinado. |
| Resolver Novedad (pantalla propia) | Existe como modal dentro del listado | Funcionalmente equivalente; no es un defecto. |

---

# 8. Auditoría de componentes

| Concepto de la especificación | Estado en el frontend | Acción recomendada |
|---|---|---|
| PageHeader | No existe como componente; patrón repetido manualmente en cada página | Extraer componente (Fase 0), bajo riesgo |
| Breadcrumbs | No existe | Construir junto con la corrección del header (P1-03) |
| SearchBar / FilterBar | No existe como componente; lógica duplicada (P2-02) | Extraer componente reutilizando `filtros.store.ts` o eliminando el store si se prefiere estado local |
| DataTable | No existe como wrapper propio; se usa `UTable` de Nuxt UI directamente en cada página (consistente) | Aceptable tal cual — no requiere envoltorio adicional salvo que se necesite la variante "tarjetas en móvil" |
| StatusBadge | No existe; mapas de color duplicados (P2-03) | Extraer componente con diccionario único de estado→color |
| MoneyValue | No existe; `useFormatoCO().moneda()` sí está bien centralizado, pero el color/énfasis se decide en cada sitio (P2-08) | Extraer componente que envuelva el composable existente |
| SummaryCard | Cubierto de forma ad hoc por `UCard` en Dashboard/Caja/Movimientos | Suficiente, no requiere componente nuevo |
| Tabs | No usado en ningún lado (no hay páginas de detalle) | Se necesitará al construir detalle de Contrato/Cliente/Inmueble |
| DetailSection | No existe (no hay detalle) | Igual que Tabs |
| ConfirmDialog | `components/ui/ConfirmModal.vue` — bien resuelto y reutilizado en Clientes/Codeudores/Administración/Configuración | **No tocar** |
| OperationWizard / OperationSummary | Resuelto de forma ad hoc pero correcta dentro de Recaudo (paso a paso con previsualización) | Funciona bien; formalizarlo como componente solo si se replica un flujo similar en otro módulo |
| AuditTimeline | No existe (Auditoría es tabla plana, sin detalle expandible) | Ver nota de la página de Auditoría — posiblemente no se requiere, dado el patrón de trazabilidad ya confirmado |
| EmptyState | Resuelto manualmente en cada `UTable` vía `#empty-state` (consistente en las ~13 tablas revisadas) | Aceptable, buen nivel de consistencia ya alcanzado sin componente dedicado |
| ErrorState (con Reintentar) | No existe en ningún lado — solo `UAlert` estático (P1-06) | Construir componente y aplicarlo de forma transversal |
| SkeletonTable | No usado; se usa el spinner nativo de `UTable` | Bajo impacto, no se recomienda invertir aquí primero |
| FormSection | Resuelto con `UCard` + encabezado numerado en Contrato Nuevo (`1. Arrendatario`, `2. Codeudor(es)`...) — buen patrón | **No tocar**; replicar este estilo si se agrega vista previa (P2 de Contrato Nuevo) |
| MoneyInput | No existe; se usa `UInput type="number"` sin formato de miles mientras se escribe | Bajo impacto para un panel interno, pero genera riesgo de digitación (ej. escribir 500000 vs 500.000 sin retroalimentación visual) |
| DateInput | Se usa `UInput type="date"` nativo del navegador, consistente en todo el proyecto | Aceptable |
| ReferenceInput | Resuelto correctamente como campo condicional (`v-if="medioPago === 'TRANSFERENCIA'"`) en Recaudo/Novedades/Movimientos | **No tocar** — cumple exactamente §41 |
| ExportButton | No existe como componente; `useExcelExport` se llama directo desde Reportes | Aceptable, bajo impacto |

**Duplicación de estado a resolver (arquitectura, no visual):** `stores/contratos.store.ts`, `stores/novedades.store.ts`, `stores/filtros.store.ts` no están conectados a ninguna página (P2-01). Antes de construir nuevos componentes de listado, decidir si se conectan estos stores o se eliminan — mantenerlos sin usar es el escenario de mayor riesgo futuro (alguien los reactiva sin saber que el listado real usa otro camino).

---

# 9. Auditoría de navegación

| Especificación | Frontend actual | Diferencia |
|---|---|---|
| Inicio → Dashboard | GENERAL → Dashboard | Renombrado de sección, sin impacto funcional |
| Operación → Inmuebles, Propietarios, Contratos, Clientes, Obligaciones, Novedades | OPERACIÓN → Contratos, Recaudo, Novedades | Recaudo no está en la especificación bajo Operación (está en Finanzas); Propietarios y Obligaciones no existen como enlaces |
| — | DIRECTORIOS → Clientes, Codeudores, Inmuebles | Sección nueva sin equivalente directo en la especificación; agrupa razonablemente los "maestros" |
| Finanzas → Recaudo, Cartera, Gastos, Depósitos, Caja, Transferencias | FINANZAS → Recibos, Caja | Recaudo aparece en Operación, no en Finanzas; Cartera/Gastos/Depósitos/Transferencias no tienen enlace propio; Recibos es un módulo nuevo no listado en la especificación (aunque sí en §23 como página de recibo individual) |
| Control → Reportes, Auditoría | CONSULTA Y CONTROL → Movimientos, Reportes, Auditoría | Se agrega Movimientos, ausente en la especificación como enlace de nivel superior (aunque cubre la función de Transferencias) |
| Administración → Usuarios, Configuración | ADMINISTRACIÓN → Usuarios (etiqueta apunta a `/administracion`), Configuración | Coincide en items, aunque la ruta interna de "Usuarios" es `/administracion`, nombre que puede confundir en el código a futuro |

**Faltantes:** enlaces directos a Propietarios, Obligaciones, Cartera, Gastos, Depósitos, Transferencias — inexistentes porque las páginas mismas no existen (ver P1-05).

**Sobrantes respecto a la especificación:** Codeudores, Recibos y Movimientos como enlaces de primer nivel — los tres son adiciones razonables del dominio real (Codeudores por el N:M con Contrato; Recibos como historial independiente; Movimientos como libro consolidado) y no se recomienda eliminarlos.

**Nombres inconsistentes:** "Usuarios" en el sidebar enruta a `/administracion`, mientras que la especificación llama a esa página "Usuarios" a secas — inconsistencia menor de nomenclatura interna, sin impacto visible para el usuario final.

**Navegación confusa detectada:** ninguna — el filtrado de items `soloAdmin` está bien resuelto (una sola fuente de verdad, el arreglo `secciones` en `Sidebar.vue`, filtrado una sola vez).

---

# 10. Auditoría financiera

Se evaluó el patrón **Datos → Revisión → Confirmación → Resultado** en las 5 operaciones financieras existentes:

| Operación | Datos | Revisión | Confirmación | Resultado | Veredicto |
|---|---|---|---|---|---|
| Registrar recaudo | Búsqueda de contrato + ficha completa | Previsualización **calculada en backend** (`/recaudo/pagos/simular`) | Modal explícito "Confirmar y generar recibo" | Recibo con excedente explicado + PDF descargable | Cumple, con garantía superior a la especificación |
| Anular recibo | — | Alerta que explica qué se revierte exactamente | Motivo obligatorio + botón "Anular recibo" | Recibo pasa a ANULADO, visible en historial | Cumple |
| Terminar contrato | Fecha + motivo | Alerta de advertencia inline | Botón "Terminar contrato" (deshabilitado sin motivo) | Contrato TERMINADO, deuda pendiente preservada (verificado en el código) | Cumple |
| Reactivar contrato | Motivo obligatorio | Alerta explicando el efecto (ocupa inmueble + queda en auditoría) | Botón "Reactivar contrato" | Contrato vuelve a ACTIVO | Cumple |
| Liquidar depósito | Descuentos desglosados por concepto/valor | Cálculo en vivo del valor a devolver | Medio de pago exigido solo si hay saldo a devolver | — | Cumple |
| Reversar movimiento | — | Explica que se crea un movimiento de signo contrario, el original no se borra | Motivo obligatorio | — | Cumple |
| Registrar arqueo de caja | Saldo esperado mostrado primero | Diferencia calculada en vivo mientras se escribe | Botón "Registrar arqueo" | — | Cumple parcialmente — observación no es obligatoria con diferencia ≠ 0 (P2) |

**Orden Canon → Novedad → Mora:** se verificó indirectamente — el backend decide el orden de aplicación (`calcularPlanAplicacion`, según comentario del código) y el frontend solo pinta el resultado. No se puede confirmar el orden exacto desde el frontend sin inspeccionar el backend, pero **la arquitectura es correcta**: el frontend nunca decide ni recalcula el orden de aplicación, solo lo muestra — exactamente lo que pide la especificación ("la aplicación debe respetar Canon → Novedad → Mora", una regla de negocio, no de presentación).

**Separación de conceptos financieros (§2.5):** cumplida. Recaudo, Caja y Movimientos/Transferencias tienen pantallas y — más importante — tarjetas de saldo separadas (nunca se suma efectivo + transferencia en un solo número). El aviso de "dinero sin medio identificado" en Movimientos es una honestidad de datos que va más allá de lo exigido.

**Errores financieros (§51):** los mensajes de error muestran el texto devuelto por el backend (`e?.data?.message`) con un fallback genérico ("No fue posible registrar el pago."). No se pudo verificar si el backend garantiza atomicidad transaccional (fuera del alcance de esta auditoría de frontend), pero el frontend no promete nada que no pueda cumplir: no hay ningún mensaje de éxito optimista antes de recibir confirmación del servidor.

---

# 11. Auditoría responsive

| Breakpoint | Sidebar | Header | Tablas | Formularios | Modales |
|---|---|---|---|---|---|
| Desktop | Fijo, `w-64`, correcto | Correcto salvo título fijo (P1-03) | `UTable` con scroll horizontal nativo si es necesario | Grillas de 2-3 columnas, correctas | `UModal` centrado, correcto |
| Tablet | Igual que desktop — **sin adaptación** | Igual | Igual | Grillas de 2-3 columnas empiezan a apretarse (ej. formulario de Inmueble) | Correcto |
| Móvil | **Roto** — sidebar de 256px fijo compite con el contenido, sin drawer ni botón de menú (P1-02) | Sin botón de menú para abrir navegación | Sin conversión a tarjetas; dependerá del scroll horizontal nativo de `UTable` | Grillas de 2-3 columnas no colapsan a 1 columna en varios formularios (revisar `grid-cols-2`/`grid-cols-3` sin prefijo `sm:`) | Los modales sí son razonablemente usables en móvil por ser overlay de ancho limitado |

**Diagnóstico:** el proyecto fue construido priorizando escritorio (coherente con ser una herramienta administrativa interna), pero **no cumple ni el mínimo de "drawer en móvil"** que la especificación pide de forma explícita (§4, §43). Antes de invertir en el detalle de cada formulario, la corrección de mayor impacto es el sidebar + header (P1-02, P1-03) porque hoy bloquean el uso completo en un teléfono, no solo lo hacen incómodo.

---

# 12. Auditoría de permisos

**Patrón general (correcto y a conservar):** doble capa — `middleware/auth.global.ts` bloquea rutas `soloAdmin` a nivel de router, y cada página además oculta condicionalmente botones vía `auth.esAdministrador`/`auth.esRecepcionista`. Los nombres de rol (`ADMINISTRADOR`/`RECEPCIONISTA`) son consistentes en frontend y coinciden con la regla de negocio confirmada.

| Regla de negocio confirmada | Verificación en el frontend | Resultado |
|---|---|---|
| Recepcionista puede crear y editar Clientes, Codeudores e Inmuebles | Crear: sí (sin gating). Editar Inmuebles: sí (sin gating). Editar Clientes/Codeudores: **no** — oculto tras `auth.esAdministrador` | **Falla (P1-01)** |
| Recepcionista puede crear y terminar Contratos | Ambos botones sin gating de rol | Cumple |
| Reactivar contrato es exclusivo Administrador, con motivo | `v-if="auth.esAdministrador"` + motivo obligatorio | Cumple |
| Recepcionista registra Novedades y sugiere responsable, sin tocar dinero | Formulario sin campos financieros; mensaje explícito de "no genera impacto financiero" | Cumple |
| Recepcionista puede generar recibo de reporte de novedad | Botón "Recibo" sin gating de rol | Cumple |
| Aprobación financiera de Novedad (cargo/gasto) exclusiva Administrador | `v-if="auth.esAdministrador && ..."` en ambos botones | Cumple |
| Recepcionista no puede concluir una Novedad con impacto financiero pendiente | No se pudo verificar desde el frontend — no hay botón de "cerrar novedad" visible en absoluto en esta pantalla (posiblemente resuelto en backend únicamente) | No verificable desde UI — recomendar confirmar con backend |
| Recaudo, ficha de recaudo y liquidación de depósito exclusivos de Administrador | Ruta `/recaudo` completa bajo `rutasSoloAdmin` | Cumple |
| Nunca mostrar "Pagado" al aprobar un gasto | Badge muestra "Pendiente de pago" tras aprobar; solo cambia a "Pagado" tras el paso separado de pago real | Cumple |

**Conclusión de esta sección:** el sistema de permisos está bien diseñado y en su mayoría bien ejecutado. El único defecto verificado es P1-01, y es puntual (dos archivos, un solo `v-if` mal alcanzado) — no es un problema de diseño del sistema de permisos, es un error de implementación aislado.

---

# 13. Matriz de acciones por estado

| Entidad | Estado | Acciones que el frontend ofrece hoy | Coincide con la especificación |
|---|---|---|---|
| Contrato | ACTIVO | Terminar | Falta "Registrar recaudo" y "Registrar novedad" como acciones de fila (existen como páginas/módulos separados, accesibles indirectamente) |
| Contrato | TERMINADO | Reactivar (solo Administrador) | Falta "Ver obligaciones" y "Ver historial" como acción directa de fila (no hay detalle de contrato) |
| Cliente/Codeudor | activo=true | Editar (solo Admin, **debería incluir Recepcionista** — P1-01), Dar de baja (solo Admin) | Editar mal restringido |
| Cliente/Codeudor | activo=false | Reactivar (solo Admin) | — |
| Inmueble | DISPONIBLE/OCUPADO/MANTENIMIENTO/INACTIVO | Editar (todos los roles); cambio de estado limitado a transiciones válidas | `OCUPADO` correctamente bloqueado como destino manual — cumple la regla explícita de "no ofrecer cambio manual cuando el estado depende del contrato" |
| Novedad | impactoFinanciero = PENDIENTE | Cargo arrendatario / Gasto inmobiliaria (solo Admin) | Cumple |
| Novedad | GASTO_INMOBILIARIA, no pagado | Registrar pago (solo Admin) | Cumple, y refuerza que aprobar ≠ pagar |
| Recibo | EMITIDO | Anular (con motivo) | Cumple |
| Recibo | ANULADO | Solo lectura + descarga PDF | Cumple — no ofrece ninguna acción sobre un recibo ya anulado, correcto |
| Movimiento | origen NOVEDAD/DEPOSITO, no es reverso | Reversar (con motivo) | Cumple |
| Movimiento | origen RECAUDO | Sin botón de reverso directo — se corrige anulando el recibo asociado desde Recibos | Cumple (evita duplicar el mecanismo de corrección) |

**No se encontró ningún botón genérico "Eliminar"** en ninguna pantalla del sistema — se verificó explícitamente porque la especificación lo prohíbe (§11). Todas las bajas son lógicas (`activo: false`) o trazadas (anular/reversar + motivo). Esto es un punto fuerte a destacar y **no tocar**.

---

# 14. Matriz de hallazgos

| Módulo | Problema | Tipo | Severidad | Impacto | Acción recomendada |
|---|---|---|---|---|---|
| Clientes / Codeudores | Editar oculto para Recepcionista | Permisos | P1 | Bloquea trabajo operativo legítimo | Corregir el `v-if` de `TableRowActions` |
| Layout global | Sidebar sin drawer móvil | Responsive | P1 | Navegación inutilizable en teléfono | Construir drawer + botón de menú en Header |
| Layout global | Header no muestra título de página real | Consistencia/UX | P1 | Usuario pierde contexto de ubicación | Pasar slot `#titulo` desde cada página o migrar a breadcrumb automático por ruta |
| Todas las entidades | Sin página de detalle | Arquitectura/UX | P1 | Sin lugar único para "comprender" una entidad | Construir detalle de Contrato primero (mayor valor), luego Cliente/Inmueble |
| Navegación / módulos | Propietarios, Obligaciones, Cartera, Gastos, Depósitos, Transferencias sin pantalla propia | Cobertura funcional | P1 (pendiente de decisión de negocio) | Puede limitar gestión proactiva de cartera/gastos | Decidir con el negocio si se separan (ver H0-01) antes de planificar Fase 3 |
| Todas las tablas | Sin botón "Reintentar" en error | Consistencia | P1 | Usuario debe recargar toda la página ante un error de red | Construir `ErrorState` reutilizable |
| Dashboard | Muy por debajo de especificación/mockup | UX | P1 | No resuelve "cómo está el negocio hoy" en una sola vista | Rediseñar en Fase 2, reutilizando endpoints existentes |
| Arquitectura | Stores de Pinia sin usar (`contratos`, `novedades`, `filtros`) | Duplicación/riesgo futuro | P2 | Confusión para desarrollo futuro | Decidir: conectar o eliminar |
| Múltiples listados | Filtros y mapas de color de estado duplicados | Duplicación | P2 | Mantenimiento más costoso | Extraer `FilterBar` y `StatusBadge` |
| Recaudo | Vista previa no usa el formato textual exacto Canon/Novedad/Mora | Visual | P2 | Ninguno funcional | Ajuste visual opcional |
| Caja | Observación no obligatoria con diferencia ≠ 0 | Formulario | P2 | Arqueos con diferencia sin explicación registrada | Validación condicional |
| Inmuebles | Falta acción "Ver"/"Ver contrato" | Funcional | P2 | Depende de que exista detalle de Contrato | Resolver junto con P1-04 |
| Varias | Botones de solo-ícono sin `aria-label` | Accesibilidad | P2 | Uso con lector de pantalla degradado | Añadir `aria-label`, replicando el patrón ya usado en Login |
| Contratos nuevo | Sin paso de vista previa antes de crear | Formulario | P2 | Riesgo bajo de error de digitación | Añadir paso de revisión con los datos ya en memoria |
| Dashboard | `middleware: []` sin efecto real | Código confuso | P3 | Ninguno (verificado que no es hueco de seguridad) | Limpiar o documentar la intención real |
| Auditoría | Sin vista de detalle por registro | Cobertura | P3 (coherente con decisión ya tomada) | Bajo, dado que la trazabilidad ya está garantizada por el patrón anular/reversar | No construir salvo pedido explícito |

---

# 15. Plan de acción

> Cada fase asume que la anterior está terminada y validada. Las Fases 2 y 3 dependen de una decisión de negocio (ver Fase 1.5) antes de poder dimensionarse con precisión.

## FASE 0 — Preparación (arquitectura y sistema visual)
1. **Decidir el destino de los stores sin usar** (`contratos.store.ts`, `novedades.store.ts`, `filtros.store.ts`): conectarlos a sus páginas o eliminarlos. — P2-01. Riesgo: Bajo. Dependencias: ninguna.
2. **Corregir el header muerto**: cada página pasa su título real (o se migra a breadcrumb automático generado desde la ruta). — P1-03. Riesgo: Bajo. Dependencias: ninguna.
3. **Construir `ErrorState` reutilizable con botón "Reintentar"** y aplicarlo en las ~19 páginas que hoy solo muestran `UAlert` estático. — P1-06. Riesgo: Bajo. Dependencias: ninguna.
4. **Extraer `StatusBadge`** con el diccionario único de estado→color ya usado (Contratos, Novedades, Recibos, Movimientos, Caja, Inmuebles). — P2-03. Riesgo: Bajo.
5. **Construir sidebar responsive (drawer móvil) + botón de menú en Header.** — P1-02. Riesgo: Medio (toca el layout global que usa toda la aplicación; validar en las 19 páginas después del cambio).

## FASE 0.5 — Decisión de negocio (bloqueante para Fases 2-3)
6. **Decidir si Obligaciones, Cartera, Gastos, Depósitos y Transferencias se separan en pantallas propias** o si la consolidación actual (dentro de Recaudo/Novedades/Movimientos) es la dirección de producto definitiva. — H0-01 / P1-05. Esta decisión determina el tamaño real de la Fase 3 y no debería tomarse por defecto: requiere confirmación explícita del negocio, igual que se confirmaron las reglas de rol y de excedente en sesiones anteriores.

## FASE 1 — Correcciones críticas
7. **Corregir permisos de Editar en Clientes/Codeudores** para que Recepcionista pueda editar, dejando la baja lógica donde el negocio confirme que corresponde. — P1-01. Riesgo: Bajo. Validación: iniciar sesión como Recepcionista y confirmar que "Editar" es visible y funcional.

## FASE 2 — Correcciones de operación
8. **Construir página de detalle de Contrato** (tabs Resumen/Canon y fechas/Depósito/Obligaciones/Recaudo/Historial), reutilizando los endpoints que ya alimentan la ficha de recaudo. — P1-04. Riesgo: Medio. Dependencias: Fase 0 (StatusBadge, ErrorState).
9. **Rediseñar Dashboard** con cartera por antigüedad, ingresos vs. egresos, accesos rápidos y alertas accionables. — P1-07. Riesgo: Medio. Dependencias: Fase 0.5 (si Cartera se separa, el Dashboard debe enlazar a ella).
10. **Añadir paso de vista previa en Contrato Nuevo.** — P2 de Contrato Nuevo. Riesgo: Bajo.
11. Construir detalle de Cliente/Inmueble (menor prioridad que Contrato). Riesgo: Medio.

## FASE 3 — Finanzas
12. **Si la Fase 0.5 confirma separación de módulos:** construir Cartera (listado interactivo por antigüedad 0-30/31-60/61-90/+90), Gastos (bandeja global de pendientes de pago, reutilizando el endpoint de Novedades), Depósitos (bandeja global de liquidaciones pendientes) y Transferencias (vista propia, actualmente sub-sumida en Movimientos). Riesgo: Alto si se hace sin la decisión de la Fase 0.5 confirmada — podría construirse dos veces.
13. Ajustar la vista previa de Recaudo al formato Canon/Novedad/Mora explícito. — P2-04. Riesgo: Bajo.
14. Hacer obligatoria la observación de Caja cuando hay diferencia. — P2 de Caja. Riesgo: Bajo.

## FASE 4 — Consistencia visual
15. Extraer `PageHeader`, `FilterBar` y `MoneyValue` como componentes, aplicándolos de forma retroactiva a las páginas existentes. — P2-02, P2-08. Riesgo: Bajo-Medio (requiere tocar todas las páginas, pero sin cambiar comportamiento).
16. Añadir `aria-label` a botones de solo-ícono restantes. — P2-07. Riesgo: Bajo.

## FASE 5 — Responsive y accesibilidad
17. Adaptar tablas a vista de tarjetas en móvil (o, como alternativa de menor esfuerzo, garantizar scroll horizontal accesible con indicador visual). Riesgo: Medio.
18. Revisar formularios con grillas `grid-cols-2`/`grid-cols-3` sin prefijo responsive y agregar colapso a 1 columna en móvil. Riesgo: Bajo.

## FASE 6 — Pulido final
19. Limpiar `middleware: []` sin efecto en Dashboard. — P2-05. Riesgo: Bajo.
20. Evaluar `MoneyInput` con separador de miles en vivo (mejora de calidad de digitación, no crítico). Riesgo: Bajo.
21. Evaluar si Auditoría necesita vista de detalle expandible, solo si el negocio lo solicita explícitamente (dado que ya se confirmó que el patrón actual satisface la trazabilidad). Riesgo: Bajo.

---

# 16. Riesgos — qué NO debe tocarse sin cuidado extremo

- **`pages/recaudo/index.vue` — el mecanismo de previsualización server-side (`/recaudo/pagos/simular`).** Es la pieza de mayor integridad financiera de todo el sistema: garantiza que lo que el usuario ve nunca puede desviarse de lo que el pago real va a aplicar. Cualquier cambio aquí debe mantener esa garantía (nunca recalcular en el cliente "para ahorrar una llamada").
- **La lógica de anulación/reverso con motivo obligatorio**, presente en Recibos, Obligaciones y Movimientos. Es el mecanismo de trazabilidad financiera central del sistema — coincide con una decisión ya confirmada de que reemplaza la necesidad de columnas valorAnterior/valorNuevo en una tabla de auditoría separada.
- **El candado de estado `OCUPADO` en Inmuebles** (comentario `CONT-03` en el código): impide fijar manualmente ese estado porque depende exclusivamente del motor de Contratos. Tocar esto sin entender la relación Contrato↔Inmueble puede introducir inconsistencia de datos real (un inmueble marcado disponible con un contrato activo encima).
- **El día de pago derivado de la fecha de inicio en Contrato Nuevo** (comentario `CONT-04`): la regla "se deriva hasta que el usuario lo edite manualmente" es sutil; un refactor descuidado podría hacer que el campo se sobreescriba después de que el usuario ya lo fijó a mano.
- **El middleware `auth.global.ts` y el arreglo `rutasSoloAdmin`**: es la única fuente de verdad de qué rutas son exclusivas de Administrador a nivel de router. Cualquier módulo nuevo debe añadirse aquí explícitamente, o quedará accesible por URL directa aunque esté oculto en el sidebar.
- **Los stores de Pinia sin usar** deben tratarse con cuidado en sentido inverso: no "limpiarlos" asumiendo que son basura sin antes confirmar que ninguna parte del build los referencia indirectamente (ej. plugins, SSR hooks) — la recomendación es decidir explícitamente (Fase 0, paso 1), no borrar por inercia.

---

# 17. Orden recomendado de implementación (paso a paso)

1. Fase 0 completa (componentes base + decisión sobre stores) — no depende de nada externo.
2. Fase 0.5 — obtener decisión de negocio sobre separación de módulos financieros. **No avanzar a Fase 3 sin esto.**
3. Fase 1 — corrección de permisos (rápida, aislada, alto valor).
4. Fase 2 — detalle de Contrato primero (mayor apalancamiento: alimenta también a Novedades y, eventualmente, a Cartera), luego Dashboard, luego detalle de Cliente/Inmueble.
5. Fase 3 — construcción o ajuste de módulos financieros, según lo decidido en el paso 2.
6. Fase 4 — consistencia visual, una vez que el número de páginas está estabilizado (evita tener que aplicar el mismo componente dos veces si Fase 3 todavía va a cambiar la cantidad de pantallas).
7. Fase 5 — responsive y accesibilidad, sobre el conjunto ya estable de pantallas.
8. Fase 6 — pulido final.

---

# 18. Criterios de validación por fase

- **Fase 0:** cada página sigue funcionando exactamente igual que antes tras extraer componentes (regresión visual = cero); el header muestra el título correcto en las 19 páginas; simular un error de red confirma que aparece el botón "Reintentar" y que vuelve a intentar la misma petición.
- **Fase 0.5:** existe una decisión documentada y confirmada por el negocio sobre qué módulos se separan, antes de escribir código de Fase 3.
- **Fase 1:** iniciar sesión como Recepcionista y confirmar que puede editar un Cliente y un Codeudor; iniciar sesión como Administrador y confirmar que el comportamiento no cambió para ese rol.
- **Fase 2:** desde el listado de Contratos, un click en cualquier fila lleva al detalle con las 6 secciones (Resumen/Canon/Depósito/Obligaciones/Recaudo/Historial) pobladas con datos reales; el Dashboard responde visualmente a "¿cómo está el negocio hoy?" sin necesitar navegar a otro módulo.
- **Fase 3:** si se separan módulos, cada uno reutiliza los endpoints ya existentes (verificar en Network que no se duplican llamadas ya cubiertas por Recaudo/Novedades/Movimientos); la vista previa de Recaudo muestra Canon/Novedad/Mora como líneas explícitas sin cambiar el resultado calculado por backend.
- **Fase 4:** cambiar un color de estado en un solo archivo (`StatusBadge`) se refleja en todas las pantallas que lo usan, sin tocar cada página individualmente.
- **Fase 5:** probar cada página en un viewport de 375px de ancho (móvil) confirma que el menú es accesible vía drawer y que ninguna tabla obliga a scroll horizontal sin indicación visual.
- **Fase 6:** no quedan advertencias de accesibilidad de "botón sin nombre accesible" en un auditor automático (ej. Lighthouse/axe) para los componentes de ícono solo.
