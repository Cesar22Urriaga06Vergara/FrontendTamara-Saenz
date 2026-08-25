<script setup lang="ts">
/**
 * Creación de contrato — 100% por búsqueda estricta de IDs ya existentes.
 * No se permite digitar datos de personas aquí: se buscan y seleccionan
 * Cliente, Codeudor(es) e Inmueble ya registrados en sus respectivos directorios.
 */
const { moneda } = useFormatoCO()

// ---- Cliente ----
const busquedaCliente = ref('')
const resultadosCliente = ref<any[]>([])
const clienteSeleccionado = ref<any>(null)

async function buscarCliente() {
  if (!busquedaCliente.value) return
  resultadosCliente.value = await useApiFetch<any[]>('/clientes/buscar', {
    params: { documento: busquedaCliente.value, nombre: busquedaCliente.value },
  })
}

// ---- Codeudores (N:M) ----
const busquedaCodeudor = ref('')
const resultadosCodeudor = ref<any[]>([])
const codeudoresSeleccionados = ref<any[]>([])

async function buscarCodeudor() {
  if (!busquedaCodeudor.value) return
  resultadosCodeudor.value = await useApiFetch<any[]>('/codeudores/buscar', {
    params: { documento: busquedaCodeudor.value, nombre: busquedaCodeudor.value },
  })
}

function agregarCodeudor(c: any) {
  if (!codeudoresSeleccionados.value.find((x) => x.id === c.id)) {
    codeudoresSeleccionados.value.push(c)
  }
  resultadosCodeudor.value = []
  busquedaCodeudor.value = ''
}

function quitarCodeudor(id: string) {
  codeudoresSeleccionados.value = codeudoresSeleccionados.value.filter((c) => c.id !== id)
}

// ---- Inmueble disponible ----
const inmueblesDisponibles = ref<any[]>([])
const inmuebleSeleccionado = ref<any>(null)

async function cargarInmuebles() {
  inmueblesDisponibles.value = await useApiFetch<any[]>('/inmuebles/disponibles')
}

// ---- Datos del contrato ----
// CONT-04: el día de pago se deriva del día de la fecha de inicio (§6.1) mientras el usuario
// no lo edite a mano — a partir de ahí, su elección manual queda fija aunque cambie la fecha.
const fechaInicio = ref('')
const diaPago = ref<number | null>(null)
const diaPagoEditadoManualmente = ref(false)
const depositoCustodia = ref(0)

watch(fechaInicio, (nuevaFecha) => {
  if (diaPagoEditadoManualmente.value) return
  diaPago.value = nuevaFecha ? Number(nuevaFecha.slice(8, 10)) : null
})

function marcarDiaPagoManual() {
  diaPagoEditadoManualmente.value = true
}

const creando = ref(false)
const error = ref('')

const puedeCrear = computed(
  () => !!clienteSeleccionado.value && !!inmuebleSeleccionado.value && codeudoresSeleccionados.value.length > 0 && !!fechaInicio.value,
)

async function crearContrato() {
  error.value = ''
  creando.value = true
  try {
    const contrato = await useApiFetch<any>('/contratos', {
      method: 'POST',
      body: {
        clienteId: clienteSeleccionado.value.id,
        codeudorIds: codeudoresSeleccionados.value.map((c) => c.id),
        inmuebleId: inmuebleSeleccionado.value.id,
        fechaInicio: fechaInicio.value,
        diaPago: diaPago.value ?? undefined,
        depositoCustodia: depositoCustodia.value,
      },
    })
    await navigateTo(`/contratos`)
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible crear el contrato.'
  } finally {
    creando.value = false
  }
}

onMounted(cargarInmuebles)
</script>

<template>
  <div class="max-w-3xl">
    <h1 class="text-xl font-semibold text-slate-900 mb-4">Nuevo contrato</h1>

    <UAlert v-if="error" color="red" variant="subtle" :title="error" class="mb-4" />

    <div class="space-y-6">
      <!-- Cliente -->
      <UCard>
        <template #header><p class="font-semibold text-slate-900">1. Arrendatario</p></template>

        <div v-if="!clienteSeleccionado" class="flex gap-2">
          <UInput v-model="busquedaCliente" placeholder="Buscar por cédula o nombre…" class="flex-1" @keyup.enter="buscarCliente" />
          <UButton color="amber" @click="buscarCliente">Buscar</UButton>
        </div>
        <div v-else class="flex items-center justify-between bg-slate-50 rounded-lg p-3">
          <div>
            <p class="font-medium text-slate-900">{{ clienteSeleccionado.nombreCompleto }}</p>
            <p class="text-xs text-slate-600">{{ clienteSeleccionado.numeroDocumento }}</p>
          </div>
          <UButton size="xs" color="gray" variant="ghost" @click="clienteSeleccionado = null">Cambiar</UButton>
        </div>

        <div v-if="resultadosCliente.length" class="mt-3 divide-y border rounded-lg">
          <button
            v-for="c in resultadosCliente"
            :key="c.id"
            class="w-full text-left px-4 py-2 hover:bg-slate-50"
            @click="clienteSeleccionado = c; resultadosCliente = []"
          >
            {{ c.nombreCompleto }} — {{ c.numeroDocumento }}
          </button>
        </div>
      </UCard>

      <!-- Codeudores -->
      <UCard>
        <template #header><p class="font-semibold text-slate-900">2. Codeudor(es)</p></template>

        <div class="flex gap-2 mb-3">
          <UInput v-model="busquedaCodeudor" placeholder="Buscar por cédula o nombre…" class="flex-1" @keyup.enter="buscarCodeudor" />
          <UButton color="amber" @click="buscarCodeudor">Buscar</UButton>
        </div>

        <div v-if="resultadosCodeudor.length" class="mb-3 divide-y border rounded-lg">
          <button
            v-for="c in resultadosCodeudor"
            :key="c.id"
            class="w-full text-left px-4 py-2 hover:bg-slate-50"
            @click="agregarCodeudor(c)"
          >
            {{ c.nombreCompleto }} — {{ c.numeroDocumento }}
          </button>
        </div>

        <div v-if="codeudoresSeleccionados.length" class="flex flex-wrap gap-2">
          <UBadge v-for="c in codeudoresSeleccionados" :key="c.id" color="amber" variant="subtle" class="flex items-center gap-1">
            {{ c.nombreCompleto }}
            <UIcon name="i-heroicons-x-mark" class="cursor-pointer" @click="quitarCodeudor(c.id)" />
          </UBadge>
        </div>
        <p v-else class="text-xs text-slate-600">Aún no hay codeudores seleccionados.</p>
      </UCard>

      <!-- Inmueble -->
      <UCard>
        <template #header><p class="font-semibold text-slate-900">3. Inmueble disponible</p></template>
        <USelectMenu
          v-model="inmuebleSeleccionado"
          :options="inmueblesDisponibles"
          option-attribute="direccion"
          placeholder="Selecciona un inmueble disponible"
        >
          <template #option="{ option }">
            <span>{{ option.direccion }} — {{ option.barrio }} ({{ moneda(option.canonValor) }})</span>
          </template>
        </USelectMenu>

        <div v-if="inmuebleSeleccionado" class="flex flex-wrap gap-2 mt-3">
          <UBadge color="amber" variant="subtle">Energía: {{ inmuebleSeleccionado.codigoEnergia || 'No registrado' }}</UBadge>
          <UBadge color="amber" variant="subtle">Agua: {{ inmuebleSeleccionado.codigoAgua || 'No registrado' }}</UBadge>
          <UBadge color="amber" variant="subtle">Gas: {{ inmuebleSeleccionado.codigoGas || 'No registrado' }}</UBadge>
        </div>
      </UCard>

      <!-- Datos del contrato -->
      <UCard>
        <template #header><p class="font-semibold text-slate-900">4. Datos del contrato</p></template>
        <div class="grid grid-cols-3 gap-4">
          <UFormGroup label="Fecha de inicio">
            <UInput v-model="fechaInicio" type="date" />
          </UFormGroup>
          <UFormGroup label="Día de pago (1-31)">
            <UInput v-model.number="diaPago" type="number" min="1" max="31" @input="marcarDiaPagoManual" />
            <p class="text-xs text-slate-500 mt-1">
              Se toma de la fecha de inicio por defecto; edítalo si el pago es en otro día.
            </p>
          </UFormGroup>
          <UFormGroup label="Depósito en custodia">
            <UInput v-model.number="depositoCustodia" type="number" />
          </UFormGroup>
        </div>
        <p class="text-xs text-slate-600 mt-2">
          La fecha de fin queda en blanco: solo se define al terminar el contrato.
        </p>
      </UCard>

      <div class="flex justify-end">
        <UButton color="amber" size="lg" :disabled="!puedeCrear" :loading="creando" @click="crearContrato">
          Crear contrato
        </UButton>
      </div>
    </div>
  </div>
</template>
