import type { Config } from 'tailwindcss'

/**
 * Paleta corporativa Inversiones Tamara & Saenz.
 * Primario: Dorado/Mostaza (#CFA052 -> amber-600)
 * Estructural: Gris Grafito (#4A4D52 -> slate-700/zinc-700)
 * Contraste: Negro Profundo (#1A1A1A -> slate-900/zinc-900)
 */
export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        marca: {
          dorado: '#CFA052',
          'dorado-oscuro': '#B98D42',
          grafito: '#4A4D52',
          antracita: '#1A1A1A',
        },
      },
    },
  },
}
