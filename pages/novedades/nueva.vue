<script setup lang="ts">
/**
 * Registro rápido de novedad — disponible para Recepcionista y Administrador.
 * Sin ningún dato financiero: solo descripción, fecha, responsable sugerido
 * e inmueble/contrato relacionado.
 */
const busquedaInmueble = ref('')
const resultadosInmueble = ref<any[]>([])
const inmuebleSeleccionado = ref<any>(null)

const contratosDelInmueble = ref<any[]>([])
const contratoSeleccionado = ref<any>(null)

const descripcion = ref('')
const fecha = ref(new Date().toISOString().slice(0, 10))
const observaciones = ref('')
const responsableSugerido = ref<'INMOBILIARIA' | 'ARRENDATARIO'>('INMOBILIARIA')

const guardando = ref(false)
const error = ref('')

async function buscarInmueble() {
  if (!busquedaInmueble.value) return
  error.value = ''
  try {
    const data = await useApiFetch<any>('/inmuebles', { params: { busqueda: busquedaInmueble.value, limit: 5 } })
    resultadosInmueble.value = data.data
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible buscar el inmueble.'
  }
}

async function seleccionarInmueble(inmueble: any) {
  inmuebleSeleccionado.value = inmueble
  resultadosInmueble.value = []
  error.value = ''
  try {
    // Filtra directamente por inmuebleId (en vez de barrio + limit fijo en cliente) para que
    // el contrato correcto aparezca aunque el barrio tenga más de 5 contratos (AUD-026).
    const data = await useApiFetch<any>('/contratos', { params: { inmuebleId: inmueble.id } })
    contratosDelInmueble.value = data.data
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible cargar los contratos del inmueble.'
  }
}

const puedeGuardar = computed(() => !!inmuebleSeleccionado.value && !!descripcion.value && !!fecha.value)

async function guardar() {
  error.value = ''
  guardando.value = true
  try {
    await useApiFetch('/novedades', {
      method: 'POST',
      body: {
        inmuebleId: inmuebleSeleccionado.value.id,
        contratoId: contratoSeleccionado.value?.id,
        descripcion: descripcion.value,
        fecha: fecha.value,
        observaciones: observaciones.value,
        responsableSugerido: responsableSugerido.value,
      },
    })
    await navigateTo('/novedades')
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible registrar la novedad.'
  } finally {
    guardando.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl">
    <h1 class="text-xl font-semibold text-slate-900 mb-4">Registrar novedad</h1>

    <UAlert v-if="error" color="red" variant="subtle" :title="error" class="mb-4" />

    <UCard>
      <div class="space-y-4">
        <div>
          <p class="text-sm font-medium text-slate-700 mb-1">Inmueble</p>
          <div v-if="!inmuebleSeleccionado" class="flex gap-2">
            <UInput v-model="busquedaInmueble" placeholder="Buscar por dirección o barrio…" class="flex-1" @keyup.enter="buscarInmueble" />
            <UButton color="amber" @click="buscarInmueble">Buscar</UButton>
          </div>
          <div v-else class="flex items-center justify-between bg-slate-50 rounded-lg p-3">
            <div>
              <p class="font-medium text-slate-900">{{ inmuebleSeleccionado.direccion }}</p>
              <p class="text-xs text-slate-500">{{ inmuebleSeleccionado.barrio }}</p>
            </div>
            <UButton size="xs" color="gray" variant="ghost" @click="inmuebleSeleccionado = null; contratoSeleccionado = null">Cambiar</UButton>
          </div>
          <div v-if="resultadosInmueble.length" class="mt-2 divide-y border rounded-lg">
            <button
              v-for="i in resultadosInmueble"
              :key="i.id"
              class="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm"
              @click="seleccionarInmueble(i)"
            >
              {{ i.direccion }} — {{ i.barrio }}
            </button>
          </div>
        </div>

        <UFormGroup v-if="contratosDelInmueble.length" label="Contrato relacionado (opcional)">
          <USelectMenu v-model="contratoSeleccionado" :options="contratosDelInmueble" option-attribute="id" placeholder="Sin contrato específico">
            <template #option="{ option }">{{ option.cliente?.nombreCompleto }}</template>
          </USelectMenu>
        </UFormGroup>

        <UFormGroup label="Descripción del incidente">
          <UTextarea v-model="descripcion" placeholder="Describe la novedad observada…" />
        </UFormGroup>

        <div class="grid grid-cols-2 gap-4">
          <UFormGroup label="Fecha">
            <UInput v-model="fecha" type="date" />
          </UFormGroup>
          <UFormGroup label="Responsable sugerido">
            <USelectMenu v-model="responsableSugerido" :options="['INMOBILIARIA', 'ARRENDATARIO']" />
          </UFormGroup>
        </div>

        <UFormGroup label="Observaciones (opcional)">
          <UTextarea v-model="observaciones" />
        </UFormGroup>

        <p class="text-xs text-slate-400">
          Este registro NO genera ningún impacto financiero. Solo el Administrador puede
          aprobar el cargo al arrendatario o el gasto de la inmobiliaria desde el tablero de novedades.
        </p>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton color="amber" :disabled="!puedeGuardar" :loading="guardando" @click="guardar">
            Registrar novedad
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>
