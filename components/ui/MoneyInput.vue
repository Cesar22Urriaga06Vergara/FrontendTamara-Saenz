<script setup lang="ts">
/**
 * Input numérico para valores en pesos colombianos: formatea con separador de miles en vivo
 * mientras se escribe (mismo locale es-CO que `useFormatoCO`), pero el `v-model` sigue siendo
 * un `number` plano — el consumidor nunca ve el texto formateado, solo el valor real.
 */
const props = withDefaults(defineProps<{ modelValue: number | null | undefined; placeholder?: string }>(), {
  placeholder: '0',
})
const emit = defineEmits<{ 'update:modelValue': [number] }>()

const formateador = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 })

function aNumero(crudo: string): number {
  return Number(crudo.replace(/\D/g, '')) || 0
}

function formatear(valor: number): string {
  return valor ? formateador.format(valor) : ''
}

const texto = ref(formatear(props.modelValue ?? 0))

// Si el padre cambia el valor por fuera (ej. al abrir el formulario de edición con datos
// existentes), refleja el nuevo número — pero sin pisar lo que el usuario está escribiendo si
// el cambio vino de su propio input (mismo valor ya reflejado).
watch(
  () => props.modelValue,
  (nuevo) => {
    if (aNumero(texto.value) !== (nuevo ?? 0)) texto.value = formatear(nuevo ?? 0)
  },
)

function alEscribir(crudo: string) {
  const numero = aNumero(crudo)
  texto.value = formatear(numero)
  emit('update:modelValue', numero)
}
</script>

<template>
  <UInput
    :model-value="texto"
    inputmode="numeric"
    :placeholder="placeholder"
    icon="i-heroicons-banknotes"
    @update:model-value="alEscribir"
  />
</template>
