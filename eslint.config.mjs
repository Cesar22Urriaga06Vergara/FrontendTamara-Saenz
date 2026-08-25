// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default withNuxt(eslintPluginPrettierRecommended, {
  rules: {
    // El código existente usa `any` de forma extendida en respuestas de API sin tipar
    // (deuda aceptada, ver plan de acción B6) — no bloquear el lint por esto todavía.
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/multi-word-component-names': 'off',
  },
})
