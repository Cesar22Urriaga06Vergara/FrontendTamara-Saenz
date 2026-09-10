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
const buscando = ref(false)

async function buscarInmueble() {
  if (!busquedaInmueble.value) return
  error.value = ''
  buscando.value = true
  try {
    const data = await useApiFetch<any>('/inmuebles', { params: { busqueda: busquedaInmueble.value, limit: 5 } })
    resultadosInmueble.value = data.data
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible buscar el inmueble.'
  } finally {
    buscando.value = false
  }
}

useBusquedaAutomatica(busquedaInmueble, buscarInmueble)

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

function quitarInmuebleSeleccionado() {
  inmuebleSeleccionado.value = null
  contratoSeleccionado.value = null
  contratosDelInmueble.value = []
}

const puedeGuardar = computed(() => !!inmuebleSeleccionado.value && !!descripcion.value && !!fecha.value)

// Borrador: solo recupera, nunca envía nada solo.
const borradorNovedad = useBorrador(
  'borrador:novedad-nueva',
  () => ({
    inmuebleSeleccionado: inmuebleSeleccionado.value,
    contratosDelInmueble: contratosDelInmueble.value,
    contratoSeleccionado: contratoSeleccionado.value,
    descripcion: descripcion.value,
    fecha: fecha.value,
    observaciones: observaciones.value,
    responsableSugerido: responsableSugerido.value,
  }),
  (datos) => {
    const guardado = datos as {
      inmuebleSeleccionado: any
      contratosDelInmueble: any[]
      contratoSeleccionado: any
      descripcion: string
      fecha: string
      observaciones: string
      responsableSugerido: 'INMOBILIARIA' | 'ARRENDATARIO'
    }
    inmuebleSeleccionado.value = guardado.inmuebleSeleccionado
    contratosDelInmueble.value = guardado.contratosDelInmueble
    contratoSeleccionado.value = guardado.contratoSeleccionado
    descripcion.value = guardado.descripcion
    fecha.value = guardado.fecha
    observaciones.value = guardado.observaciones
    responsableSugerido.value = guardado.responsableSugerido
  },
)

onMounted(() => borradorNovedad.detectar())

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
    borradorNovedad.limpiar()
    await navigateTo('/novedades')
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible registrar la novedad.'
  } finally {
    guardando.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl space-y-5">
    <header class="surface-card px-5 py-4 sm:px-6">
      <div>
        <p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-600">Operación</p>
        <h1 class="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Registrar novedad</h1>
      </div>
    </header>

    <UAlert v-if="error" color="red" variant="subtle" :title="error" class="mb-4" />
    <UAlert
      v-if="borradorNovedad.hayBorrador.value"
      color="amber"
      variant="subtle"
      icon="i-heroicons-document-text"
      title="Tienes una novedad a medio registrar guardada"
      class="mb-4"
    >
      <template #description>
        <div class="mt-2 flex gap-2">
          <UButton size="xs" color="amber" @click="borradorNovedad.restaurar()">Recuperar</UButton>
          <UButton size="xs" color="gray" variant="ghost" @click="borradorNovedad.limpiar()">Descartar</UButton>
        </div>
      </template>
    </UAlert>

    <div class="surface-card p-4 sm:p-5">
      <div class="space-y-5">
        <div>
          <p class="mb-2 text-sm font-medium text-slate-700">Inmueble</p>
          <div v-if="!inmuebleSeleccionado" class="flex flex-col gap-2 sm:flex-row">
            <UInput
              v-model="busquedaInmueble"
              placeholder="Buscar por dirección o barrio…"
              class="flex-1"
              @keyup.enter="buscarInmueble"
            />
            <UButton color="amber" :loading="buscando" @click="buscarInmueble">Buscar</UButton>
          </div>
          <div v-else class="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div>
              <p class="font-medium text-slate-900">{{ inmuebleSeleccionado.direccion }}</p>
              <p class="text-xs text-slate-500">{{ inmuebleSeleccionado.barrio }}</p>
            </div>
            <UButton size="xs" color="gray" variant="ghost" @click="quitarInmuebleSeleccionado">Cambiar</UButton>
          </div>
          <div v-if="resultadosInmueble.length" class="mt-3 divide-y overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60">
            <button
              v-for="i in resultadosInmueble"
              :key="i.id"
              class="block w-full px-4 py-2.5 text-left text-sm transition hover:bg-white"
              @click="seleccionarInmueble(i)"
            >
              {{ i.direccion }} — {{ i.barrio }}
            </button>
          </div>
        </div>

        <UFormGroup v-if="contratosDelInmueble.length" label="Contrato relacionado (opcional)">
          <USelectMenu
            v-model="contratoSeleccionado"
            :options="contratosDelInmueble"
            option-attribute="cliente.nombreCompleto"
            placeholder="Sin contrato específico"
          >
            <template #option="{ option }">{{ option.cliente?.nombreCompleto }}</template>
          </USelectMenu>
        </UFormGroup>

        <UFormGroup label="Descripción del incidente">
          <UTextarea v-model="descripcion" placeholder="Describe la novedad observada…" />
        </UFormGroup>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

        <p class="text-xs text-slate-500">
          Este registro NO genera ningún impacto financiero. Solo el Administrador puede aprobar el cargo al
          arrendatario o el gasto de la inmobiliaria desde el tablero de novedades.
        </p>
      </div>

      <div class="mt-5 flex justify-end">
        <UButton color="amber" :disabled="!puedeGuardar" :loading="guardando" @click="guardar" class="!rounded-xl">
          Registrar novedad
        </UButton>
      </div>
    </div>
  </div>
</template>
