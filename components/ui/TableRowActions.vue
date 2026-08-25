<script setup lang="ts">
/**
 * Menú de acciones por fila de tabla: Editar + Dar de baja/Reactivar según `activo`.
 * Ambas acciones tienen dueños de permiso distintos y se controlan por separado
 * (`puedeEditar` / `puedeCambiarEstado`) — agruparlas bajo una sola condición fue
 * el origen de un defecto real: ocultaba Editar a un rol que sí debía tenerlo, solo
 * porque compartía dropdown con Dar de baja/Reactivar, que sí es más restringido.
 */
const props = withDefaults(
  defineProps<{
    activo: boolean
    editLabel?: string
    bajaLabel?: string
    reactivarLabel?: string
    disabled?: boolean
    puedeEditar?: boolean
    puedeCambiarEstado?: boolean
  }>(),
  { editLabel: 'Editar', bajaLabel: 'Dar de baja', reactivarLabel: 'Reactivar', puedeEditar: true, puedeCambiarEstado: true },
)

const emit = defineEmits<{
  editar: []
  baja: []
  reactivar: []
}>()

const items = computed(() => {
  const grupos: Array<Array<{ label: string; icon: string; click: () => void }>> = []
  if (props.puedeEditar) {
    grupos.push([{ label: props.editLabel, icon: 'i-heroicons-pencil-square', click: () => emit('editar') }])
  }
  if (props.puedeCambiarEstado) {
    grupos.push(
      props.activo
        ? [{ label: props.bajaLabel, icon: 'i-heroicons-trash', click: () => emit('baja') }]
        : [{ label: props.reactivarLabel, icon: 'i-heroicons-arrow-path', click: () => emit('reactivar') }],
    )
  }
  return grupos
})
</script>

<template>
  <UDropdown :items="items" :disabled="disabled">
    <UButton
      icon="i-heroicons-ellipsis-horizontal"
      color="gray"
      variant="ghost"
      size="sm"
      :disabled="disabled"
    />
  </UDropdown>
</template>
