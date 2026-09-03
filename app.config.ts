export default defineAppConfig({
  // Alinea la paleta por defecto de todos los componentes de Nuxt UI (UInput,
  // USelectMenu, UDropdown, UTable, UCard, UFormGroup, UButton, etc.) con la
  // identidad de marca (dorado ~ amber, grafito/antracita ~ slate) en vez de
  // los valores por defecto de la librería (primary: green, gray: cool).
  ui: {
    primary: 'amber',
    gray: 'slate',

    // Rejilla clásica en todas las UTable del ERP. Sin `table-fixed` ni
    // `whitespace-nowrap`: la tabla usa auto-layout y respeta el ancho del
    // contenedor — el texto largo (direcciones, conceptos) envuelve en vez de
    // provocar scroll horizontal. Cada página añade `whitespace-nowrap` por
    // columna (`columns[].class`/`columns[].rowClass`) donde un valor nunca
    // debe partirse (fechas, montos, badges, botones). `align-top` mantiene
    // alineadas las celdas de una línea con las que envuelven a varias.
    table: {
      // `min-w-full` + auto-layout (sin `table-fixed`): en desktop la tabla cabe y el texto
      // largo envuelve; cuando hay demasiadas columnas para el ancho disponible (móvil, o
      // tablas de 8 columnas) el `overflow-x-auto` deja hacer scroll horizontal DENTRO de la
      // tabla, con las columnas a su ancho natural y legibles — en vez de aplastarlas.
      // `table-auto` explícito: el default de @nuxt/ui trae `table-fixed` y el merge de config
      // es por twMerge (no reemplazo), así que hay que pasar la clase del mismo grupo para
      // ganarle. Con auto-layout la tabla se dimensiona al contenido y respeta el contenedor.
      wrapper: 'relative overflow-x-auto border border-slate-500 rounded-lg',
      base: 'min-w-full table-auto border-collapse',
      divide: '',
      tbody: '',
      th: {
        base: 'text-center border border-slate-400 whitespace-normal',
        color: 'text-slate-700',
      },
      td: {
        // `whitespace-normal` anula el `whitespace-nowrap` del default (merge por twMerge) para
        // que el texto largo envuelva. `break-words` parte una palabra larguísima (un UUID o una
        // URL) solo si por sí sola no cabe en la línea — sin romper palabras normales como
        // "RECAUDO" cuando la columna queda estrecha.
        base: 'border border-slate-400 align-top whitespace-normal break-words',
        color: 'text-slate-700',
      },
      // Zebra striping suave para mejorar la legibilidad de filas largas.
      tr: {
        base: 'even:bg-slate-50',
      },
    },
  },
})
