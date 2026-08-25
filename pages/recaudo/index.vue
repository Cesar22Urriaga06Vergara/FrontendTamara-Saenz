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

function etiquetaConcepto(aplicacion: any): string {
  return aplicacion.concepto === 'MORA' ? 'Mora' : 'Capital'
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
    await usePdfDownload(`/documentos/recibos/${ultimoRecibo.value.id}/pdf?formato=${formato}`, ultimoRecibo.value.consecutivo)
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
// DEP-01: los descuentos van desglosados por concepto/valor (no un número agregado), y la
// devolución exige medio de pago cuando efectivamente queda saldo por devolver.
const modalLiquidar = ref(false)
const liquidando = ref(false)
const descuentosDeposito = reactive([{ concepto: '', valor: 0 }])
const formLiquidar = reactive({ medioPago: 'EFECTIVO', referencia: '', observaciones: '' })

const totalDescuentosDeposito = computed(() =>
  descuentosDeposito.reduce((acc, d) => acc + Number(d.valor || 0), 0),
)
const valorADevolver = computed(() =>
  Math.max(0, Number(ficha.value?.depositoCustodia || 0) - totalDescuentosDeposito.value),
)

function agregarDescuentoDeposito() {
  descuentosDeposito.push({ concepto: '', valor: 0 })
}

function quitarDescuentoDeposito(i: number) {
  descuentosDeposito.splice(i, 1)
}

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
          <p class="text-sm font-medium text-slate-900">{{ c.cliente?.nombreCompleto }} — {{ c.cliente?.numeroDocumento }}</p>
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
          <p><span class="text-slate-600">Saldo a favor:</span> <span class="text-emerald-600 font-medium">{{ moneda(ficha.saldoAFavor) }}</span></p>
          <p><span class="text-slate-600">Depósito en custodia:</span> {{ moneda(ficha.depositoCustodia) }}</p>
        </div>

        <div v-if="ficha.contrato?.estado === 'TERMINADO' && Number(ficha.depositoCustodia) > 0" class="mt-3 pt-3 border-t">
          <UButton size="xs" color="amber" variant="soft" icon="i-heroicons-banknotes" @click="abrirLiquidarDeposito">
            Liquidar depósito
          </UButton>
        </div>

        <div class="mt-4 pt-3 border-t">
          <p class="text-sm font-medium text-slate-900 mb-2">Obligaciones pendientes</p>
          <p v-if="!ficha.obligacionesPendientes?.length" class="text-sm text-slate-400">Sin obligaciones pendientes.</p>
          <div v-else class="space-y-2">
            <div
              v-for="o in ficha.obligacionesPendientes"
              :key="o.id"
              class="text-xs border rounded-md px-2 py-1.5"
            >
              <div class="flex justify-between">
                <span class="text-slate-700">{{ o.concepto }}</span>
                <span class="font-medium text-slate-900">{{ moneda(Number(o.valorOriginal) - Number(o.valorAbonado)) }}</span>
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
          <UInput v-model.number="detalle.monto" type="number" placeholder="Monto" class="w-40" />
          <UInput v-model="detalle.referencia" placeholder="Referencia (opcional)" class="flex-1" />
          <UButton
            v-if="detallesPago.length > 1"
            color="red"
            variant="ghost"
            icon="i-heroicons-trash"
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
          <p class="text-sm text-slate-600">Total a registrar: <span class="font-semibold text-slate-900">{{ moneda(totalPago) }}</span></p>
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
              <span v-else class="font-medium">
                Cambio a entregar: {{ moneda(ultimoRecibo.excedente) }}
              </span>
            </p>
            <div class="flex gap-2 mt-2">
              <UButton size="xs" color="amber" icon="i-heroicons-document-arrow-down" :disabled="descargando" @click="descargarPdf('CARTA')">PDF Carta</UButton>
              <UButton size="xs" color="amber" variant="soft" icon="i-heroicons-document-arrow-down" :disabled="descargando" @click="descargarPdf('MEDIA_CARTA')">PDF Media Carta</UButton>
            </div>
          </template>
        </UAlert>
      </UCard>
    </div>

    <div v-else class="text-center py-16 text-slate-600">
      <UIcon name="i-heroicons-banknotes" class="w-10 h-10 mx-auto mb-2" />
      <p>Busca un contrato para ver su ficha de recaudo y registrar un pago.</p>
    </div>

    <!-- Anular obligación pendiente generada por error -->
    <UModal v-model="modalAnularObligacion">
      <UCard>
        <template #header>
          <p class="font-semibold text-slate-900">Anular obligación</p>
        </template>
        <div class="space-y-3">
          <UAlert
            color="red"
            variant="subtle"
            title="Solo úsalo para corregir un error de generación."
            description="La obligación queda marcada ANULADA (no se borra) y deja de aparecer como cartera pendiente. Solo aplica si aún no tiene ningún abono aplicado."
          />
          <p class="text-sm text-slate-600">
            <span class="text-slate-500">Concepto:</span> {{ obligacionAnulando?.concepto }} —
            <span class="font-medium">{{ moneda(obligacionAnulando?.valorOriginal) }}</span>
          </p>
          <UFormGroup label="Motivo de la anulación">
            <UTextarea v-model="formAnular.motivo" />
          </UFormGroup>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="modalAnularObligacion = false">Cancelar</UButton>
            <UButton
              color="red"
              :loading="anulandoObligacion"
              :disabled="!formAnular.motivo"
              @click="confirmarAnularObligacion"
            >
              Anular obligación
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Previsualización del recaudo (Recibos §2): NO ejecuta la operación financiera todavía;
         solo al confirmar aquí se llama /recaudo/pagos de verdad. -->
    <UModal v-model="modalPrevisualizacion" :ui="{ width: 'sm:max-w-xl' }">
      <UCard>
        <template #header>
          <p class="font-semibold text-slate-900">Previsualización del recaudo</p>
        </template>

        <div v-if="cargandoPrevisualizacion" class="text-center py-10 text-slate-500">Calculando aplicación…</div>

        <div v-else-if="previsualizacion" class="space-y-4">
          <div class="grid grid-cols-2 gap-2 text-sm">
            <p><span class="text-slate-500">Cliente:</span> {{ previsualizacion.contrato?.cliente?.nombreCompleto }}</p>
            <p><span class="text-slate-500">Inmueble:</span> {{ previsualizacion.contrato?.inmueble?.direccion }}</p>
            <p><span class="text-slate-500">Monto recibido:</span> <span class="font-semibold text-slate-900">{{ moneda(previsualizacion.valorTotalPago) }}</span></p>
            <p>
              <span class="text-slate-500">Medio de pago:</span>
              {{ previsualizacion.detallesPago.map((d: any) => d.medioPago === 'EFECTIVO' ? 'Efectivo' : 'Transferencia').join(' + ') }}
            </p>
          </div>

          <div>
            <p class="text-sm font-medium text-slate-900 mb-2">Aplicación del dinero (Canon → Novedad → Mora)</p>
            <p v-if="!previsualizacion.aplicaciones.length" class="text-sm text-slate-400">
              El pago no alcanza a aplicarse a ninguna obligación pendiente.
            </p>
            <table v-else class="w-full text-sm">
              <thead>
                <tr class="text-left text-slate-500 border-b">
                  <th class="py-1.5 pr-2">Concepto</th>
                  <th class="py-1.5 pr-2">Tipo</th>
                  <th class="py-1.5 pr-2 text-right">Aplicado</th>
                  <th class="py-1.5 text-right">Saldo posterior</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(a, i) in previsualizacion.aplicaciones" :key="i" class="border-b last:border-0">
                  <td class="py-1.5 pr-2 text-slate-900">{{ a.obligacion?.concepto }}</td>
                  <td class="py-1.5 pr-2">
                    <UBadge :color="a.concepto === 'MORA' ? 'red' : 'gray'" variant="subtle" size="xs">{{ etiquetaConcepto(a) }}</UBadge>
                  </td>
                  <td class="py-1.5 pr-2 text-right text-slate-900">{{ moneda(a.monto) }}</td>
                  <td class="py-1.5 text-right text-slate-600">{{ moneda(a.saldoPosterior) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <UAlert
            v-if="Number(previsualizacion.excedente) > 0"
            color="amber"
            variant="subtle"
            :title="dejarExcedenteComoSaldoFavor
              ? `${moneda(previsualizacion.excedente)} quedarán como saldo a favor del contrato`
              : `Cambio a entregar: ${moneda(previsualizacion.excedente)}`"
          />
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="modalPrevisualizacion = false">Cancelar</UButton>
            <UButton
              color="amber"
              :loading="registrandoPago"
              :disabled="cargandoPrevisualizacion || !previsualizacion"
              @click="registrarPago"
            >
              Confirmar y generar recibo
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Liquidar depósito en custodia (contrato terminado) -->
    <UModal v-model="modalLiquidar">
      <UCard>
        <template #header>
          <p class="font-semibold text-slate-900">Liquidar depósito en custodia</p>
        </template>
        <div class="space-y-3">
          <p class="text-sm text-slate-600">
            Depósito en custodia disponible: <span class="font-medium">{{ moneda(ficha?.depositoCustodia) }}</span>
          </p>

          <p class="text-sm font-medium text-slate-900">Descuentos (opcional)</p>
          <div v-for="(descuento, i) in descuentosDeposito" :key="i" class="flex gap-2 items-center">
            <UInput v-model="descuento.concepto" placeholder="Concepto (ej: Aseo general)" class="flex-1" />
            <UInput v-model.number="descuento.valor" type="number" min="0" placeholder="Valor" class="w-32" />
            <UButton
              v-if="descuentosDeposito.length > 1"
              color="red"
              variant="ghost"
              icon="i-heroicons-trash"
              @click="quitarDescuentoDeposito(i)"
            />
          </div>
          <UButton size="xs" variant="soft" icon="i-heroicons-plus" @click="agregarDescuentoDeposito">
            Agregar descuento
          </UButton>

          <p class="text-sm text-slate-600 pt-2 border-t">
            Valor a devolver: <span class="font-semibold text-slate-900">{{ moneda(valorADevolver) }}</span>
          </p>

          <template v-if="valorADevolver > 0">
            <UFormGroup label="Medio de pago de la devolución">
              <USelectMenu v-model="formLiquidar.medioPago" :options="medios" />
            </UFormGroup>
            <UFormGroup v-if="formLiquidar.medioPago === 'TRANSFERENCIA'" label="Referencia">
              <UInput v-model="formLiquidar.referencia" placeholder="Número de transacción" />
            </UFormGroup>
          </template>

          <UFormGroup label="Observaciones (opcional)">
            <UTextarea v-model="formLiquidar.observaciones" />
          </UFormGroup>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="modalLiquidar = false">Cancelar</UButton>
            <UButton color="amber" :loading="liquidando" @click="confirmarLiquidarDeposito">Liquidar</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
