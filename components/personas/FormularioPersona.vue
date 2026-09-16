<script setup lang="ts">
/**
 * Formulario modal de alta/edición compartido por Clientes y Codeudores (misma forma de datos).
 * `formulario` es el objeto `reactive()` que ya vive en `usePersonasDirectorio` del padre —se
 * pasa por referencia a propósito (no una copia) para no duplicar el estado del formulario en
 * dos sitios; por eso los campos se editan aquí directamente en vez de emitir un evento por
 * campo, lo que dispara `vue/no-mutating-props` sin ser un error real.
 */
/* eslint-disable vue/no-mutating-props */
defineProps<{
  modelValue: boolean
  formulario: {
    numeroDocumento: string
    tipoDocumento: string
    nombreCompleto: string
    email?: string
    telefono?: string
    direccion?: string
  }
  editando: boolean
  guardando: boolean
  valido: boolean
  tituloCreacion: string
  tituloEdicion: string
  labelCreacion: string
  labelEdicion: string
}>()

defineEmits<{ 'update:modelValue': [boolean]; guardar: [] }>()
</script>

<template>
  <UModal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <UCard
      :ui="{
        root: 'overflow-hidden rounded-2xl border border-[#d9b86d] bg-[#fffdf7] shadow-[0_28px_60px_-32px_rgba(120,82,25,0.55)]',
        body: { base: 'p-5 sm:p-6' },
        header: { base: 'border-b border-[#ead9ad] px-0 pb-4' },
        footer: { base: 'border-t border-[#ead9ad] px-0 pt-4' },
      }"
    >
      <template #header>
        <p class="font-semibold text-slate-900">{{ editando ? tituloEdicion : tituloCreacion }}</p>
      </template>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <UFormGroup label="Tipo documento">
          <USelectMenu v-model="formulario.tipoDocumento" :options="['CC', 'CE', 'NIT', 'PAS']" />
        </UFormGroup>
        <UFormGroup label="Número documento" required>
          <UInput v-model="formulario.numeroDocumento" />
        </UFormGroup>
        <UFormGroup label="Nombre completo" class="sm:col-span-2" required>
          <UInput v-model="formulario.nombreCompleto" />
        </UFormGroup>
        <UFormGroup label="Correo">
          <UInput v-model="formulario.email" type="email" />
        </UFormGroup>
        <UFormGroup label="Teléfono">
          <UInput v-model="formulario.telefono" />
        </UFormGroup>
        <UFormGroup label="Dirección" class="sm:col-span-2">
          <UInput v-model="formulario.direccion" />
        </UFormGroup>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="$emit('update:modelValue', false)">Cancelar</UButton>
          <UButton color="amber" :loading="guardando" :disabled="!valido" @click="$emit('guardar')">
            {{ editando ? labelEdicion : labelCreacion }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
