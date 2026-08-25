<script setup lang="ts">
/**
 * Interfaz de cobro por contrato — EXCLUSIVO Administrador (protegido también por
 * middleware/auth.global.ts). Busca el contrato, muestra la ficha de recaudo
 * (obligaciones pendientes, saldo a favor, depósito en custodia) y permite
 * registrar un pago mixto (varios medios de pago combinados en un solo recibo).
 */
const route = useRoute()
const { moneda, fecha } = useFormatoCO()

const error = ref('')

const busquedaContrato = ref('')
const contratosEncontrados = ref<any[]>([])
const buscando = ref(false)

const contratoSeleccionado = ref<any>(null)
const ficha = ref<any>(null)
const cargandoFicha = ref(false)

const medios = ['EFECTIVO', 'TRANSFERENCIA']
const detallesPago = reactive([{ medioPago: 'EFECTIVO', monto: 0, referencia: '' }])
const registrandoPago = ref(false)
const ultimoRecibo = ref<any>(null)

async function buscarContratos() {
  if (!busquedaContrato.value) return
  error.value = ''
  buscando.value = true
  try {
    const data = await useApiFetch<any>('/contratos', { params: { busqueda: busquedaContrato.value, limit: 5 } })
    contratosEncontrados.value = data.data
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible buscar el contrato.'
  } finally {
    buscando.value = false
  }
}

async function seleccionarContrato(contrato: any) {
  contratoSeleccionado.value = contrato
  contratosEncontrados.value = []
  error.value = ''
  cargandoFicha.value = true
  try {
    ficha.value = await useApiFetch<any>(`/contratos/${contrato.id}/ficha-recaudo`)
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible cargar la ficha de recaudo.'
  } finally {
    cargandoFicha.value = false
  }
}

function agregarDetalle() {
  detallesPago.push({ medioPago: 'EFECTIVO', monto: 0, referencia: '' })
}

function quitarDetalle(i: number) {
  detallesPago.splice(i, 1)
}

const totalPago = computed(() => detallesPago.reduce((acc, d) => acc + Number(d.monto || 0), 0))

// RDN-01: por defecto el excedente se devuelve como cambio; solo si el cliente pide
// expresamente dejarlo como abono adelantado se marca este flag.
const dejarExcedenteComoSaldoFavor = ref(false)

// ---- Previsualización antes de confirmar (Recibos §2) ----
// La previsualización NUNCA se calcula en el frontend: pide al backend `POST
// /recaudo/pagos/simular`, que corre el MISMO método (`calcularPlanAplicacion`) que el pago
// real, sin persistir nada — así lo que se muestra aquí no puede desviarse de lo que
// `registrarPago` va a aplicar de verdad.
const modalPrevisualizacion = ref(false)
const cargandoPrevisualizacion = ref(false)
const previsualizacion = ref<any>(null)

async function abrirConfirmarPago() {
  if (!contratoSeleccionado.value || totalPago.value <= 0) return
  error.value = ''
  cargandoPrevisualizacion.value = true
  modalPrevisualizacion.value = true
  try {
    previsualizacion.value = await useApiFetch<any>('/recaudo/pagos/simular', {
      method: 'POST',
      body: {
        contratoId: contratoSeleccionado.value.id,
        detallesPago,
        dejarExcedenteComoSaldoFavor: dejarExcedenteComoSaldoFavor.value,
      },
    })
  } catch (e: any) {
    modalPrevisualizacion.value = false
    error.value = e?.data?.message || 'No fue posible calcular la previsualización del pago.'
  } finally {
    cargandoPrevisualizacion.value = false
  }
}

async function registrarPago() {
  if (!contratoSeleccionado.value || totalPago.value <= 0) return
  error.value = ''
  registrandoPago.value = true
  try {
    const recibo = await useApiFetch<any>('/recaudo/pagos', {
      method: 'POST',
      body: {
        contratoId: contratoSeleccionado.value.id,
        detallesPago,
        dejarExcedenteComoSaldoFavor: dejarExcedenteComoSaldoFavor.value,
      },
    })
    ultimoRecibo.value = recibo
    modalPrevisualizacion.value = false
    // refrescar ficha tras el pago
    ficha.value = await useApiFetch<any>(`/contratos/${contratoSeleccionado.value.id}/ficha-recaudo`)
    detallesPago.splice(0, detallesPago.length, { medioPago: 'EFECTIVO', monto: 0, referencia: '' })
    dejarExcedenteComoSaldoFavor.value = false
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible registrar el pago.'
  } finally {
    registrandoPago.value = false
  }
}

const descargando = ref(false)

async function descargarPdf(formato: 'CARTA' | 'MEDIA_CARTA') {
  if (!ultimoRecibo.value || descargando.value) return
  error.value = ''
  descargando.value = true
  try {
    await usePdfDownload(
      `/documentos/recibos/${ultimoRecibo.value.id}/pdf?formato=${formato}`,
      ultimoRecibo.value.consecutivo,
    )
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible descargar el PDF.'
  } finally {
    descargando.value = false
  }
}

// ---- Anular obligación pendiente generada por error (sin abonos aplicados) ----
const modalAnularObligacion = ref(false)
const obligacionAnulando = ref<any>(null)
const formAnular = reactive({ motivo: '' })
const anulandoObligacion = ref(false)

function abrirAnularObligacion(o: any) {
  error.value = ''
  obligacionAnulando.value = o
  formAnular.motivo = ''
  modalAnularObligacion.value = true
}

async function confirmarAnularObligacion() {
  if (!obligacionAnulando.value || !contratoSeleccionado.value) return
  error.value = ''
  anulandoObligacion.value = true
  try {
    await useApiFetch(`/obligaciones/${obligacionAnulando.value.id}/anular`, {
      method: 'PATCH',
      body: { motivo: formAnular.motivo },
    })
    modalAnularObligacion.value = false
    ficha.value = await useApiFetch<any>(`/contratos/${contratoSeleccionado.value.id}/ficha-recaudo`)
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible anular la obligación.'
  } finally {
    anulandoObligacion.value = false
  }
}

// ---- Liquidación de depósito en custodia (contrato ya TERMINADO) ----
const modalLiquidar = ref(false)
const liquidando = ref(false)
const descuentosDeposito = reactive([{ concepto: '', valor: 0 }])
const formLiquidar = reactive({ medioPago: 'EFECTIVO', referencia: '', observaciones: '' })

const totalDescuentosDeposito = computed(() => descuentosDeposito.reduce((acc, d) => acc + Number(d.valor || 0), 0))
const valorADevolver = computed(() =>
  Math.max(0, Number(ficha.value?.depositoCustodia || 0) - totalDescuentosDeposito.value),
)

function abrirLiquidarDeposito() {
  error.value = ''
  descuentosDeposito.splice(0, descuentosDeposito.length, { concepto: '', valor: 0 })
  formLiquidar.medioPago = 'EFECTIVO'
  formLiquidar.referencia = ''
  formLiquidar.observaciones = ''
  modalLiquidar.value = true
}

async function confirmarLiquidarDeposito() {
  if (!contratoSeleccionado.value) return
  error.value = ''
  liquidando.value = true
  try {
    const descuentos = descuentosDeposito.filter((d) => d.concepto && Number(d.valor) > 0)
    await useApiFetch(`/recaudo/contrato/${contratoSeleccionado.value.id}/liquidar-deposito`, {
      method: 'POST',
      body: {
        descuentos: descuentos.length ? descuentos : undefined,
        medioPago: valorADevolver.value > 0 ? formLiquidar.medioPago : undefined,
        referencia: formLiquidar.referencia || undefined,
        observaciones: formLiquidar.observaciones || undefined,
      },
    })
    modalLiquidar.value = false
    ficha.value = await useApiFetch<any>(`/contratos/${contratoSeleccionado.value.id}/ficha-recaudo`)
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible liquidar el depósito.'
  } finally {
    liquidando.value = false
  }
}

// Permite llegar directo a la ficha de un contrato desde otra pantalla (ej. "Ver ficha del
// contrato" en el detalle de un Recibo), sin tener que volver a buscarlo manualmente.
onMounted(() => {
  const contratoId = route.query.contratoId
  if (typeof contratoId === 'string' && contratoId) {
    seleccionarContrato({ id: contratoId })
  }
})
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold text-slate-900 mb-4">Recaudo</h1>

    <UAlert v-if="error" color="red" variant="subtle" :title="error" class="mb-4" />

    <UCard class="mb-4">
      <div class="flex gap-3">
        <UInput
          v-model="busquedaContrato"
          placeholder="Buscar contrato por cédula o nombre del arrendatario…"
          icon="i-heroicons-magnifying-glass"
          class="flex-1"
          @keyup.enter="buscarContratos"
        />
        <UButton color="amber" :loading="buscando" @click="buscarContratos">Buscar</UButton>
      </div>

      <div v-if="contratosEncontrados.length" class="mt-3 divide-y divide-slate-100 border rounded-lg">
        <button
          v-for="c in contratosEncontrados"
          :key="c.id"
          class="w-full text-left px-4 py-2 hover:bg-slate-50"
          @click="seleccionarContrato(c)"
        >
          <p class="text-sm font-medium text-slate-900">
            {{ c.cliente?.nombreCompleto }} — {{ c.cliente?.numeroDocumento }}
          </p>
          <p class="text-xs text-slate-500">{{ c.inmueble?.direccion }} ({{ c.inmueble?.barrio }})</p>
        </button>
      </div>
    </UCard>

    <div v-if="cargandoFicha" class="text-center py-10 text-slate-600">Cargando ficha de recaudo…</div>

    <div v-else-if="ficha" class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Ficha de recaudo -->
      <UCard class="lg:col-span-1">
        <template #header><p class="font-semibold text-slate-900">Ficha de recaudo</p></template>
        <div class="space-y-2 text-sm">
          <p><span class="text-slate-600">Arrendatario:</span> {{ ficha.arrendatario?.nombreCompleto }}</p>
          <p><span class="text-slate-600">Inmueble:</span> {{ ficha.inmueble?.direccion }}</p>
          <p><span class="text-slate-600">Barrio:</span> {{ ficha.barrio }}</p>
          <p>
            <span class="text-slate-600">Saldo a favor:</span>
            <span class="text-emerald-600 font-medium">{{ moneda(ficha.saldoAFavor) }}</span>
          </p>
          <p><span class="text-slate-600">Depósito en custodia:</span> {{ moneda(ficha.depositoCustodia) }}</p>
        </div>

        <div
          v-if="ficha.contrato?.estado === 'TERMINADO' && Number(ficha.depositoCustodia) > 0"
          class="mt-3 pt-3 border-t"
        >
          <UButton size="xs" color="amber" variant="soft" icon="i-heroicons-banknotes" @click="abrirLiquidarDeposito">
            Liquidar depósito
          </UButton>
        </div>

        <div class="mt-4 pt-3 border-t">
          <p class="text-sm font-medium text-slate-900 mb-2">Obligaciones pendientes</p>
          <p v-if="!ficha.obligacionesPendientes?.length" class="text-sm text-slate-400">
            Sin obligaciones pendientes.
          </p>
          <div v-else class="space-y-2">
            <div v-for="o in ficha.obligacionesPendientes" :key="o.id" class="text-xs border rounded-md px-2 py-1.5">
              <div class="flex justify-between">
                <span class="text-slate-700">{{ o.concepto }}</span>
                <span class="font-medium text-slate-900">{{
                  moneda(Number(o.valorOriginal) - Number(o.valorAbonado))
                }}</span>
              </div>
              <div class="flex justify-between text-slate-500">
                <span>Vence: {{ fecha(o.fechaVencimiento) }}</span>
                <span v-if="Number(o.valorMoraAcumulada) > 0" class="text-red-600">
                  Mora: {{ moneda(o.valorMoraAcumulada) }}
                </span>
              </div>
              <div v-if="o.estado === 'PENDIENTE'" class="flex justify-end mt-1">
                <UButton size="2xs" color="red" variant="ghost" @click="abrirAnularObligacion(o)">
                  Anular (error de generación)
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Registro de pago mixto -->
      <UCard class="lg:col-span-2">
        <template #header><p class="font-semibold text-slate-900">Registrar pago (medios combinados)</p></template>

        <div v-for="(detalle, i) in detallesPago" :key="i" class="flex gap-2 items-center mb-2">
          <USelectMenu v-model="detalle.medioPago" :options="medios" class="w-44" />
          <UiMoneyInput v-model="detalle.monto" placeholder="Monto" class="w-40" />
          <UInput v-model="detalle.referencia" placeholder="Referencia (opcional)" class="flex-1" />
          <UButton
            v-if="detallesPago.length > 1"
            color="red"
            variant="ghost"
            icon="i-heroicons-trash"
            aria-label="Quitar medio de pago"
            @click="quitarDetalle(i)"
          />
        </div>

        <UButton size="xs" variant="soft" icon="i-heroicons-plus" class="mb-4" @click="agregarDetalle">
          Agregar medio de pago
        </UButton>

        <UCheckbox
          v-model="dejarExcedenteComoSaldoFavor"
          label="Si sobra dinero, dejarlo como saldo a favor (en vez de devolver cambio)"
          class="mb-3"
        />

        <div class="flex items-center justify-between border-t pt-3">
          <p class="text-sm text-slate-600">
            Total a registrar: <span class="font-semibold text-slate-900">{{ moneda(totalPago) }}</span>
          </p>
          <UButton color="amber" :loading="registrandoPago" :disabled="totalPago <= 0" @click="abrirConfirmarPago">
            Confirmar y emitir recibo
          </UButton>
        </div>

        <UAlert
          v-if="ultimoRecibo"
          class="mt-4"
          color="emerald"
          variant="subtle"
          :title="`Recibo ${ultimoRecibo.consecutivo} emitido correctamente`"
        >
          <template #description>
            <p v-if="Number(ultimoRecibo.excedente) > 0" class="text-sm mb-2">
              <span v-if="ultimoRecibo.excedenteComoSaldoFavor">
                {{ moneda(ultimoRecibo.excedente) }} quedaron como saldo a favor del contrato.
              </span>
              <span v-else class="font-medium"> Cambio a entregar: {{ moneda(ultimoRecibo.excedente) }} </span>
            </p>
            <div class="flex gap-2 mt-2">
              <UButton
                size="xs"
                color="amber"
                icon="i-heroicons-document-arrow-down"
                :disabled="descargando"
                @click="descargarPdf('CARTA')"
                >PDF Carta</UButton
              >
              <UButton
                size="xs"
                color="amber"
                variant="soft"
                icon="i-heroicons-document-arrow-down"
                :disabled="descargando"
                @click="descargarPdf('MEDIA_CARTA')"
                >PDF Media Carta</UButton
              >
            </div>
          </template>
        </UAlert>
      </UCard>
    </div>

    <div v-else class="text-center py-16 text-slate-600">
      <UIcon name="i-heroicons-banknotes" class="w-10 h-10 mx-auto mb-2" />
      <p>Busca un contrato para ver su ficha de recaudo y registrar un pago.</p>
    </div>

    <RecaudoModalAnularObligacion
      v-model="modalAnularObligacion"
      :obligacion="obligacionAnulando"
      :form="formAnular"
      :anulando="anulandoObligacion"
      @confirmar="confirmarAnularObligacion"
    />

    <RecaudoModalPrevisualizacionPago
      v-model="modalPrevisualizacion"
      :cargando="cargandoPrevisualizacion"
      :previsualizacion="previsualizacion"
      :dejar-excedente-como-saldo-favor="dejarExcedenteComoSaldoFavor"
      :registrando="registrandoPago"
      @confirmar="registrarPago"
    />

    <RecaudoModalLiquidarDeposito
      v-model="modalLiquidar"
      :deposito-custodia="Number(ficha?.depositoCustodia || 0)"
      :valor-a-devolver="valorADevolver"
      :medios="medios"
      :descuentos="descuentosDeposito"
      :form="formLiquidar"
      :liquidando="liquidando"
      @confirmar="confirmarLiquidarDeposito"
    />
  </div>
</template>
