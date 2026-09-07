<script setup lang="ts">
interface DeudorItem {
  contratoId: string
  cliente: { nombreCompleto: string; numeroDocumento: string }
  inmueble: { direccion: string; barrio?: string }
  obligacionesVencidas: number
  fechaMasAntigua: string | null
  totalDeuda: number
}

interface ContratoBusqueda {
  id: string
  cliente?: { nombreCompleto: string; numeroDocumento: string }
  inmueble?: { direccion: string; barrio?: string }
}

interface InmuebleFicha {
  direccion: string
  barrio?: string
  canonValor?: number | string
}

interface ObligacionPendiente {
  id: string
  concepto?: string
  fechaVencimiento?: string | Date
  estado?: string
  vencida?: boolean
  valorOriginal: number | string
  valorAbonado: number | string
}

interface FichaRecaudo {
  contrato?: { estado?: string; canonValor?: number | string }
  arrendatario?: { nombreCompleto: string; numeroDocumento: string }
  inmueble?: InmuebleFicha
  barrio?: string
  saldoAFavor?: number | string
  obligacionesPendientes?: ObligacionPendiente[]
  depositoGarantia?: number | string
}

interface DetallePagoInput {
  /** Solo para `:key` de `TransitionGroup` en el formulario — nunca se envía al backend. */
  _key: number
  medioPago: 'EFECTIVO' | 'TRANSFERENCIA'
  monto: number
  referencia?: string
}

let siguienteKeyDetalle = 0
function nuevaFilaDetalle(): DetallePagoInput {
  return { _key: siguienteKeyDetalle++, medioPago: 'EFECTIVO', monto: 0, referencia: '' }
}

/** `_key` es solo para `:key` de `TransitionGroup` en el formulario — el backend, con
 * `whitelist: true` + `forbidNonWhitelisted: true` globales, rechazaría la petición completa
 * si la recibiera (propiedad no declarada en `DetallePagoInput` del DTO). */
function detallesPagoParaEnviar(lista: DetallePagoInput[]) {
  return lista.map(({ _key, ...resto }) => resto)
}

interface PrevisualizacionPago {
  aplicaciones?: Array<{ obligacionId: string; monto: number; saldoPosterior: number }>
  excedente?: number
}

interface ReciboCaja {
  id: string
  consecutivo: string
  contratoId?: string
  valorTotal?: number | string
  excedente?: number | string
  excedenteComoSaldoFavor?: boolean
}

/**
 * Recaudo — EXCLUSIVO Administrador (protegido también por middleware/auth.global.ts).
 * Abre con el listado de contratos con CARTERA VENCIDA (buscador arriba para agilidad); al
 * elegir "Cobrar" se pasa al modo detalle: ficha de recaudo + registro de pago mixto. El
 * buscador libre de contrato queda para cobrar a un contrato que no está en la lista (pago
 * adelantado, contrato al día).
 */
const route = useRoute()
const { moneda, fecha } = useFormatoCO()

// `error` = fallos de acción (simular/pagar/pdf/anular/liquidar), se muestran como alerta
// compacta arriba. `errorFicha` = fallo de CARGA de la ficha, va con estado "Reintentar".
// `avisoRefresco` = la operación SÍ se completó pero el refresco de pantalla posterior falló.
const error = ref('')
const errorFicha = ref('')
const avisoRefresco = ref('')

// ---- Listado de deudores (modo lista) ----
const {
  filtros,
  page,
  limit,
  total,
  lista: deudores,
  cargando: cargandoDeudores,
  error: errorDeudores,
  cargar: cargarDeudores,
} = useListadoPaginado<DeudorItem, { busqueda: string; orden: string }>(
  ({ page, limit, filtros }) =>
    useApiFetch<{ data: DeudorItem[]; total: number }>('/recaudo/deudores', { params: { ...filtros, page, limit } }),
  {
    filtrosIniciales: { busqueda: '', orden: 'antiguedad_desc' },
    mensajeError: 'No fue posible cargar el listado de deudores.',
  },
)

// Buscador con debounce: se escribe en un ref intermedio y solo se vuelca a `filtros.busqueda`
// tras una pausa (evita una petición por tecla) — mismo patrón que contratos/index.vue.
const busquedaInput = ref(filtros.busqueda)
let debounceBusqueda: ReturnType<typeof setTimeout> | undefined
watch(busquedaInput, (valor) => {
  clearTimeout(debounceBusqueda)
  debounceBusqueda = setTimeout(() => {
    filtros.busqueda = valor.trim()
  }, 300)
})
onBeforeUnmount(() => clearTimeout(debounceBusqueda))

const opcionesOrden = [
  { label: 'Más vencido primero', value: 'antiguedad_desc' },
  { label: 'Mayor deuda primero', value: 'deuda_desc' },
]

const columnasDeudores = [
  { key: 'cliente', label: 'Arrendatario', class: 'w-[22%]' },
  { key: 'inmueble.direccion', label: 'Dirección', class: 'w-[20%]' },
  { key: 'inmueble.barrio', label: 'Barrio', class: 'w-[12%]' },
  {
    key: 'obligacionesVencidas',
    label: 'Oblig. vencidas',
    class: 'w-[10%] whitespace-nowrap',
    rowClass: 'whitespace-nowrap text-center tabular-nums',
  },
  {
    key: 'fechaMasAntigua',
    label: 'Más antigua',
    class: 'w-[11%] whitespace-nowrap',
    rowClass: 'whitespace-nowrap',
  },
  {
    key: 'totalDeuda',
    label: 'Total a cobrar',
    class: 'w-[13%] whitespace-nowrap',
    rowClass: 'whitespace-nowrap text-right tabular-nums',
  },
  { key: 'acciones', label: 'Acciones', class: 'w-[12%] whitespace-nowrap', rowClass: 'whitespace-nowrap' },
]

// ---- Generación manual de canon (además del cron diario) ----
const generandoCanon = ref(false)
const resultadoCanon = ref<{ generadas: number } | null>(null)
const modalConfirmarCanon = ref(false)

async function generarCanones() {
  error.value = ''
  resultadoCanon.value = null
  generandoCanon.value = true
  try {
    resultadoCanon.value = await useApiFetch<{ generadas: number }>('/obligaciones/generar-canones', {
      method: 'POST',
      idempotente: true, // el backend salta los cánones que ya existen (índice único por período)
    })
    modalConfirmarCanon.value = false
    await cargarDeudores()
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible generar los cánones.'
  } finally {
    generandoCanon.value = false
  }
}

// ---- Buscador libre de contrato (para cobrar a uno que no está en la lista) ----
const busquedaContrato = ref('')
const contratosEncontrados = ref<ContratoBusqueda[]>([])
const buscando = ref(false)
const busquedaRealizada = ref(false)
const mostrarBuscadorLibre = ref(false)

async function buscarContratos() {
  if (!busquedaContrato.value) return
  error.value = ''
  buscando.value = true
  try {
    const data = await useApiFetch<any>('/contratos', { params: { busqueda: busquedaContrato.value, limit: 5 } })
    contratosEncontrados.value = data.data
    busquedaRealizada.value = true
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible buscar el contrato.'
  } finally {
    buscando.value = false
  }
}

useBusquedaAutomatica(busquedaContrato, buscarContratos)

watch(busquedaContrato, (valor) => {
  if (!valor) {
    contratosEncontrados.value = []
    busquedaRealizada.value = false
  }
})

// ---- Modo detalle (ficha + pago de un contrato) ----
const contratoSeleccionado = ref<ContratoBusqueda | null>(null)
const ficha = ref<FichaRecaudo | null>(null)
const cargandoFicha = ref(false)

const medios = ['EFECTIVO', 'TRANSFERENCIA']
const detallesPago = reactive<DetallePagoInput[]>([nuevaFilaDetalle()])
const registrandoPago = ref(false)
const ultimoRecibo = ref<ReciboCaja | null>(null)

async function seleccionarContrato(contrato: ContratoBusqueda) {
  contratoSeleccionado.value = contrato
  contratosEncontrados.value = []
  busquedaRealizada.value = false
  error.value = ''
  errorFicha.value = ''
  avisoRefresco.value = ''
  cargandoFicha.value = true
  borradorPago.detectar()
  borradorLiquidar.detectar()
  try {
    ficha.value = await useApiFetch<FichaRecaudo>(`/contratos/${contrato.id}/ficha-recaudo`)
  } catch (e: any) {
    // Si falla, no dejar la ficha del contrato anterior visible junto al nuevo seleccionado.
    ficha.value = null
    errorFicha.value = e?.data?.message || 'No fue posible cargar la ficha de recaudo.'
  } finally {
    cargandoFicha.value = false
  }
}

function recargarFicha() {
  if (contratoSeleccionado.value) seleccionarContrato(contratoSeleccionado.value)
}

// Refresco de pantalla DESPUÉS de una operación ya completada (pago, anulación, liquidación).
// Su fallo no significa que la operación fallara — solo que la vista quedó desactualizada; se
// avisa suave, nunca con la alerta roja de "no se pudo <operación>" que llevaría al cajero a
// reintentar (riesgo de doble cobro).
async function refrescarTrasOperacion() {
  if (!contratoSeleccionado.value) return
  try {
    ficha.value = await useApiFetch<FichaRecaudo>(`/contratos/${contratoSeleccionado.value.id}/ficha-recaudo`)
    await cargarDeudores()
  } catch {
    avisoRefresco.value = 'La operación quedó registrada. Recargá la pantalla para ver los saldos actualizados.'
  }
}

// Vuelve al listado dejando el modo detalle en limpio, y refresca el listado.
function volverAlListado() {
  contratoSeleccionado.value = null
  ficha.value = null
  errorFicha.value = ''
  error.value = ''
  avisoRefresco.value = ''
  ultimoRecibo.value = null
  contratosEncontrados.value = []
  busquedaContrato.value = ''
  busquedaRealizada.value = false
  mostrarBuscadorLibre.value = false
  detallesPago.splice(0, detallesPago.length, nuevaFilaDetalle())
  dejarExcedenteComoSaldoFavor.value = false
  cargarDeudores()
}

// Datos del contrato para el "chip" — de la ficha si ya cargó, si no del origen (deudor o
// resultado de búsqueda; el deep-link solo trae `{ id }`, por eso los fallbacks).
const nombreArrendatario = computed(
  () => ficha.value?.arrendatario?.nombreCompleto ?? contratoSeleccionado.value?.cliente?.nombreCompleto ?? '',
)
const documentoArrendatario = computed(
  () => ficha.value?.arrendatario?.numeroDocumento ?? contratoSeleccionado.value?.cliente?.numeroDocumento ?? '',
)
const direccionInmueble = computed(
  () => ficha.value?.inmueble?.direccion ?? contratoSeleccionado.value?.inmueble?.direccion ?? '',
)
const barrioInmueble = computed(() => ficha.value?.barrio ?? contratoSeleccionado.value?.inmueble?.barrio ?? '')

// Obligaciones de la ficha separadas en vencidas / por vencer (campo `vencida` del backend).
const obligacionesVencidas = computed(() =>
  (ficha.value?.obligacionesPendientes ?? []).filter((o: any) => o.vencida !== false),
)
const obligacionesPorVencer = computed(() =>
  (ficha.value?.obligacionesPendientes ?? []).filter((o: any) => o.vencida === false),
)

// Cartera pendiente del contrato = solo el capital por cobrar de lo vencido.
const carteraPendiente = computed(() =>
  obligacionesVencidas.value.reduce((s: number, o: any) => s + (Number(o.valorOriginal) - Number(o.valorAbonado)), 0),
)

function agregarDetalle() {
  detallesPago.push(nuevaFilaDetalle())
}

function quitarDetalle(i: number) {
  detallesPago.splice(i, 1)
}

const totalPago = computed(() => detallesPago.reduce((acc, d) => acc + Number(d.monto || 0), 0))

// RDN-01: por defecto el excedente se devuelve como cambio; solo si el cliente pide
// expresamente dejarlo como abono adelantado se marca este flag.
const dejarExcedenteComoSaldoFavor = ref(false)

// Borrador del formulario de pago: si se cierra el navegador o se cae la red a mitad de
// registrar un pago con varios medios, al volver al mismo contrato se ofrece recuperarlo.
// Solo recupera — nunca envía nada solo. Declarado DESPUÉS de `dejarExcedenteComoSaldoFavor`:
// `watch()` evalúa su getter una vez de forma síncrona al registrarse (no solo ante cambios
// futuros), así que si este bloque fuera antes de esa declaración, `leer()` intentaría leer
// `dejarExcedenteComoSaldoFavor.value` en su "temporal dead zone" y reventaría el SSR con
// "Cannot access before initialization".
const borradorPago = useBorrador(
  () => 'borrador:pago:' + (contratoSeleccionado.value?.id ?? 'sin-contrato'),
  () => ({ detallesPago: [...detallesPago], dejarExcedenteComoSaldoFavor: dejarExcedenteComoSaldoFavor.value }),
  (datos) => {
    const guardado = datos as { detallesPago: DetallePagoInput[]; dejarExcedenteComoSaldoFavor: boolean }
    // Un borrador guardado ANTES de introducir `_key` (para el `TransitionGroup` del formulario)
    // no la trae — se asigna una nueva al restaurar en vez de asumir que ya existe.
    detallesPago.splice(
      0,
      detallesPago.length,
      ...guardado.detallesPago.map((d) => ({ ...d, _key: d._key ?? siguienteKeyDetalle++ })),
    )
    dejarExcedenteComoSaldoFavor.value = guardado.dejarExcedenteComoSaldoFavor
  },
)

// ---- Previsualización antes de confirmar (Recibos §2) ----
// La previsualización NUNCA se calcula en el frontend: pide al backend `POST
// /recaudo/pagos/simular`, que corre el MISMO método (`calcularPlanAplicacion`) que el pago
// real, sin persistir nada — así lo que se muestra aquí no puede desviarse de lo que
// `registrarPago` va a aplicar de verdad.
const modalPrevisualizacion = ref(false)
const cargandoPrevisualizacion = ref(false)
const previsualizacion = ref<PrevisualizacionPago | null>(null)

async function abrirConfirmarPago() {
  if (!contratoSeleccionado.value || totalPago.value <= 0) return
  error.value = ''
  cargandoPrevisualizacion.value = true
  modalPrevisualizacion.value = true
  try {
    previsualizacion.value = await useApiFetch<PrevisualizacionPago>('/recaudo/pagos/simular', {
      method: 'POST',
      idempotente: true, // solo calcula la previsualización, no persiste nada: seguro de reintentar
      body: {
        contratoId: contratoSeleccionado.value.id,
        detallesPago: detallesPagoParaEnviar(detallesPago),
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
  avisoRefresco.value = ''
  registrandoPago.value = true
  try {
    const recibo = await useApiFetch<ReciboCaja>('/recaudo/pagos', {
      method: 'POST',
      body: {
        contratoId: contratoSeleccionado.value.id,
        detallesPago: detallesPagoParaEnviar(detallesPago),
        dejarExcedenteComoSaldoFavor: dejarExcedenteComoSaldoFavor.value,
      },
    })
    // Pago registrado y recibo emitido: cerrar la operación (modal + formulario) ANTES de
    // cualquier refetch, para que un fallo del refresco no se muestre como pago fallido.
    ultimoRecibo.value = recibo
    modalPrevisualizacion.value = false
    detallesPago.splice(0, detallesPago.length, nuevaFilaDetalle())
    dejarExcedenteComoSaldoFavor.value = false
    borradorPago.limpiar()
  } catch (e: any) {
    if (e?.esMutacionIncierta) {
      avisoRefresco.value =
        'Se perdió la conexión al enviar el pago. NO lo vuelvas a registrar sin antes revisar la ' +
        'lista de recibos y la ficha del contrato: puede que sí se haya guardado.'
      return
    }
    error.value = e?.data?.message || 'No fue posible registrar el pago.'
    return
  } finally {
    registrandoPago.value = false
  }
  await refrescarTrasOperacion()
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
  avisoRefresco.value = ''
  anulandoObligacion.value = true
  try {
    await useApiFetch(`/obligaciones/${obligacionAnulando.value.id}/anular`, {
      method: 'PATCH',
      body: { motivo: formAnular.motivo },
    })
    modalAnularObligacion.value = false
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible anular la obligación.'
    return
  } finally {
    anulandoObligacion.value = false
  }
  await refrescarTrasOperacion()
}

// ---- Liquidación de depósito de garantía (contrato ya TERMINADO) ----
const modalLiquidar = ref(false)
const liquidando = ref(false)
let siguienteKeyDescuento = 0
function nuevoDescuento() {
  return { _key: siguienteKeyDescuento++, concepto: '', valor: 0, tipo: 'GENERAL' as 'GENERAL' | 'DEUDA' }
}
const descuentosDeposito = reactive([nuevoDescuento()])
const formLiquidar = reactive({ medioPago: 'EFECTIVO', referencia: '', observaciones: '' })

// Borrador de la liquidación de depósito: mismo criterio que el de pago (solo recupera, nunca
// auto-envía).
const borradorLiquidar = useBorrador(
  () => 'borrador:liquidar:' + (contratoSeleccionado.value?.id ?? 'sin-contrato'),
  () => ({ descuentosDeposito: [...descuentosDeposito], formLiquidar: { ...formLiquidar } }),
  (datos) => {
    const guardado = datos as {
      descuentosDeposito: Array<{ _key?: number; concepto: string; valor: number; tipo: 'GENERAL' | 'DEUDA' }>
      formLiquidar: { medioPago: string; referencia: string; observaciones: string }
    }
    // Un borrador guardado ANTES de introducir `_key` (para el `TransitionGroup` del modal) no
    // la trae — se asigna una nueva al restaurar en vez de asumir que ya existe.
    descuentosDeposito.splice(
      0,
      descuentosDeposito.length,
      ...guardado.descuentosDeposito.map((d) => ({ ...d, _key: d._key ?? siguienteKeyDescuento++ })),
    )
    Object.assign(formLiquidar, guardado.formLiquidar)
  },
)

// Solo cuentan las filas que efectivamente se enviarán (mismo filtro que `confirmarLiquidarDeposito`):
// una fila con valor pero sin concepto no viaja al backend y no debe restar del estimado.
const totalDescuentosDeposito = computed(() =>
  descuentosDeposito.filter((d) => d.concepto && Number(d.valor) > 0).reduce((acc, d) => acc + Number(d.valor), 0),
)
// Estimado: el neto real lo calcula el backend. Los descuentos tipo DEUDA solo restan de la
// devolución lo que alcanzan a abonar a obligaciones reales (y si superan la deuda, la rechaza).
const valorADevolver = computed(() =>
  Math.max(0, Number(ficha.value?.depositoGarantia || 0) - totalDescuentosDeposito.value),
)

function abrirLiquidarDeposito() {
  error.value = ''
  descuentosDeposito.splice(0, descuentosDeposito.length, nuevoDescuento())
  formLiquidar.medioPago = 'EFECTIVO'
  formLiquidar.referencia = ''
  formLiquidar.observaciones = ''
  borradorLiquidar.detectar()
  modalLiquidar.value = true
}

// Recuperar el borrador abre el modal directamente con esos datos, sin pasar por el reset de
// abrirLiquidarDeposito() (que los pisaría con los valores por defecto).
function recuperarBorradorLiquidar() {
  borradorLiquidar.restaurar()
  modalLiquidar.value = true
}

async function confirmarLiquidarDeposito() {
  if (!contratoSeleccionado.value) return
  error.value = ''
  avisoRefresco.value = ''
  liquidando.value = true
  try {
    const descuentos = descuentosDeposito
      .filter((d) => d.concepto && Number(d.valor) > 0)
      .map((d) => ({ concepto: d.concepto, valor: Number(d.valor), tipo: d.tipo ?? 'GENERAL' }))
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
    borradorLiquidar.limpiar()
  } catch (e: any) {
    if (e?.esMutacionIncierta) {
      avisoRefresco.value =
        'Se perdió la conexión al liquidar el depósito. NO lo vuelvas a intentar sin antes revisar ' +
        'la ficha del contrato y los movimientos: puede que sí se haya registrado.'
      return
    }
    error.value = e?.data?.message || 'No fue posible liquidar el depósito.'
    return
  } finally {
    liquidando.value = false
  }
  await refrescarTrasOperacion()
}

// Permite llegar directo a la ficha de un contrato desde otra pantalla (ej. "Ver ficha del
// contrato" en el detalle de un Recibo), sin tener que volver a buscarlo manualmente.
onMounted(() => {
  const contratoId = route.query.contratoId
  if (typeof contratoId === 'string' && contratoId) {
    seleccionarContrato({ id: contratoId })
  }
})

const enDetalle = computed(() => !!contratoSeleccionado.value || cargandoFicha.value || !!errorFicha.value)
</script>

<template>
  <div class="space-y-4">
    <UAlert v-if="error" color="red" variant="subtle" :title="error" />
    <UAlert
      v-if="avisoRefresco"
      color="amber"
      variant="subtle"
      icon="i-heroicons-information-circle"
      :title="avisoRefresco"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'gray', variant: 'link' }"
      @close="avisoRefresco = ''"
    />

    <!-- ==================== MODO LISTA ==================== -->
    <template v-if="!enDetalle">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <SharedSkeletonText v-if="cargandoDeudores" width-class="w-40" />
        <p v-else class="text-sm text-slate-500">
          {{ total }} {{ total === 1 ? 'contrato con cartera vencida' : 'contratos con cartera vencida' }}
        </p>
        <UButton
          color="gray"
          variant="soft"
          size="sm"
          icon="i-heroicons-arrow-path"
          :loading="generandoCanon"
          @click="modalConfirmarCanon = true"
        >
          Generar canones
        </UButton>
      </div>

      <UAlert
        v-if="resultadoCanon"
        color="emerald"
        variant="subtle"
        icon="i-heroicons-check-circle"
        :title="
          resultadoCanon.generadas > 0
            ? `${resultadoCanon.generadas} obligaciones de canon generadas.`
            : 'Todos los contratos ya tienen su canon al día.'
        "
      />

      <UCard :ui="{ body: { padding: 'p-3' } }">
        <div class="flex flex-wrap items-end gap-3">
          <UInput
            v-model="busquedaInput"
            placeholder="Cédula o nombre del arrendatario…"
            icon="i-heroicons-magnifying-glass"
            class="w-64"
          />
          <USelectMenu
            v-model="filtros.orden"
            :options="opcionesOrden"
            value-attribute="value"
            option-attribute="label"
            class="w-52"
          />
        </div>
      </UCard>

      <SharedErrorState v-if="errorDeudores" :message="errorDeudores" class="mb-0" @retry="cargarDeudores" />

      <UCard>
        <UTable
          :rows="deudores"
          :columns="columnasDeudores"
          :loading="cargandoDeudores"
          :ui="{ tr: { base: 'even:bg-slate-50' } }"
        >
          <template #cliente-data="{ row }">
            <div>
              <p class="font-medium text-slate-900">{{ row.cliente?.nombreCompleto }}</p>
              <p class="text-xs text-slate-500">{{ row.cliente?.numeroDocumento }}</p>
            </div>
          </template>
          <template #fechaMasAntigua-data="{ row }">{{ fecha(row.fechaMasAntigua) }}</template>
          <template #totalDeuda-data="{ row }">
            <span class="font-semibold text-red-600">{{ moneda(row.totalDeuda) }}</span>
          </template>
          <template #acciones-data="{ row }">
            <UButton
              size="xs"
              color="amber"
              icon="i-heroicons-banknotes"
              @click="seleccionarContrato({ id: row.contratoId, cliente: row.cliente, inmueble: row.inmueble })"
            >
              Cobrar
            </UButton>
          </template>
          <template #empty-state>
            <div class="py-10 text-center text-slate-400">
              <UIcon name="i-heroicons-check-circle" class="mx-auto mb-2 h-10 w-10 text-slate-300" />
              <p>No hay contratos con cartera vencida.</p>
            </div>
          </template>
        </UTable>

        <div v-if="total > limit" class="mt-4 flex justify-end">
          <UPagination v-model="page" :page-count="limit" :total="total" />
        </div>
      </UCard>

      <!-- Cobrar a un contrato que no está en la lista (pago adelantado, contrato al día) -->
      <UCard>
        <button
          class="flex w-full items-center justify-between text-left"
          @click="mostrarBuscadorLibre = !mostrarBuscadorLibre"
        >
          <span class="text-sm font-medium text-slate-900">¿Cobrar a un contrato que no está en la lista?</span>
          <UIcon
            :name="mostrarBuscadorLibre ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
            class="h-4 w-4 text-slate-500"
          />
        </button>

        <div v-if="mostrarBuscadorLibre" class="mt-3">
          <div class="flex flex-col gap-3 sm:flex-row">
            <UInput
              v-model="busquedaContrato"
              placeholder="Buscar contrato por cédula o nombre del arrendatario…"
              icon="i-heroicons-magnifying-glass"
              :loading="buscando"
              class="flex-1"
              @keyup.enter="buscarContratos"
            />
            <UButton color="amber" :loading="buscando" @click="buscarContratos">Buscar</UButton>
          </div>

          <div
            v-if="contratosEncontrados.length"
            class="mt-3 divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-300"
          >
            <button
              v-for="c in contratosEncontrados"
              :key="c.id"
              class="block w-full px-4 py-2.5 text-left transition hover:bg-slate-50"
              @click="seleccionarContrato(c)"
            >
              <p class="text-sm font-medium text-slate-900">{{ c.cliente?.nombreCompleto }}</p>
              <p class="text-xs text-slate-500">
                {{ c.cliente?.numeroDocumento }}
                <span v-if="c.inmueble?.direccion" class="text-slate-400">
                  · {{ c.inmueble.direccion }}<template v-if="c.inmueble?.barrio"> · {{ c.inmueble.barrio }}</template>
                </span>
              </p>
            </button>
          </div>

          <p v-else-if="busquedaRealizada && !buscando" class="mt-3 text-sm text-slate-500">
            No se encontraron contratos para “{{ busquedaContrato }}”.
          </p>
        </div>
      </UCard>
    </template>

    <!-- ==================== MODO DETALLE ==================== -->
    <template v-else>
      <div class="flex flex-col gap-3 rounded-lg bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0">
          <p class="text-sm font-medium text-slate-900">
            {{ nombreArrendatario || 'Contrato seleccionado' }}
            <span v-if="documentoArrendatario" class="text-slate-500">· {{ documentoArrendatario }}</span>
          </p>
          <p v-if="direccionInmueble" class="text-xs text-slate-500">
            {{ direccionInmueble }}
            <span v-if="barrioInmueble" class="text-slate-400">· {{ barrioInmueble }}</span>
          </p>
        </div>
        <UButton
          color="gray"
          variant="soft"
          size="xs"
          icon="i-heroicons-arrow-left"
          class="shrink-0"
          @click="volverAlListado"
        >
          Volver al listado
        </UButton>
      </div>

      <SharedSkeletonText v-if="cargandoFicha" :lines="4" class="py-4" />

      <SharedErrorState v-else-if="errorFicha" :message="errorFicha" :loading="cargandoFicha" @retry="recargarFicha" />

      <div v-else-if="ficha" class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <!-- Ficha de recaudo -->
        <UCard class="lg:col-span-1">
          <template #header>
            <div class="flex items-center justify-between gap-2">
              <p class="font-semibold text-slate-900">Ficha de recaudo</p>
              <NuxtLink
                v-if="contratoSeleccionado?.id"
                :to="`/contratos/${contratoSeleccionado.id}`"
                class="shrink-0 text-xs text-amber-600 hover:underline"
              >
                Ver contrato
              </NuxtLink>
            </div>
          </template>

          <dl class="grid grid-cols-2 gap-x-6 gap-y-3">
            <div class="col-span-2">
              <dt class="text-xs font-medium uppercase tracking-wide text-slate-400">Arrendatario</dt>
              <dd class="mt-0.5 text-sm text-slate-900">{{ ficha.arrendatario?.nombreCompleto || '—' }}</dd>
              <dd v-if="ficha.arrendatario?.numeroDocumento" class="text-xs text-slate-500">
                {{ ficha.arrendatario.numeroDocumento }}
              </dd>
            </div>
            <div>
              <dt class="text-xs font-medium uppercase tracking-wide text-slate-400">Dirección</dt>
              <dd class="mt-0.5 text-sm text-slate-900">{{ ficha.inmueble?.direccion || '—' }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium uppercase tracking-wide text-slate-400">Barrio</dt>
              <dd class="mt-0.5 text-sm text-slate-900">{{ ficha.barrio || '—' }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium uppercase tracking-wide text-slate-400">Canon mensual</dt>
              <dd class="mt-0.5 text-sm font-semibold tabular-nums text-slate-900">
                {{ moneda(ficha.contrato?.canonValor) }}
              </dd>
            </div>
            <div>
              <dt class="text-xs font-medium uppercase tracking-wide text-slate-400">Saldo a favor</dt>
              <dd class="mt-0.5 text-sm font-semibold tabular-nums text-emerald-600">
                {{ moneda(ficha.saldoAFavor) }}
              </dd>
            </div>
            <div>
              <dt class="text-xs font-medium uppercase tracking-wide text-slate-400">Depósito de garantía</dt>
              <dd class="mt-0.5 text-sm tabular-nums text-slate-900">{{ moneda(ficha.depositoGarantia) }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium uppercase tracking-wide text-slate-400">Cartera vencida</dt>
              <dd
                class="mt-0.5 text-sm font-semibold tabular-nums"
                :class="carteraPendiente > 0 ? 'text-red-600' : 'text-slate-900'"
              >
                {{ moneda(carteraPendiente) }}
              </dd>
            </div>
          </dl>

          <div
            v-if="ficha.contrato?.estado === 'TERMINADO' && Number(ficha.depositoGarantia) > 0"
            class="mt-4 border-t border-slate-200 pt-3"
          >
            <p v-if="borradorLiquidar.hayBorrador.value" class="mb-2 text-xs text-amber-700">
              Tienes una liquidación de depósito a medio hacer guardada.
              <button type="button" class="font-medium underline" @click="recuperarBorradorLiquidar">Recuperar</button>
              ·
              <button type="button" class="underline" @click="borradorLiquidar.limpiar()">Descartar</button>
            </p>
            <UButton size="xs" color="amber" variant="soft" icon="i-heroicons-banknotes" @click="abrirLiquidarDeposito">
              Liquidar depósito
            </UButton>
          </div>

          <div class="mt-4 border-t border-slate-200 pt-3">
            <p class="mb-2 text-sm font-medium text-slate-900">Obligaciones vencidas</p>
            <p v-if="!obligacionesVencidas.length" class="text-sm text-slate-400">Sin obligaciones vencidas.</p>
            <ul v-else class="space-y-2">
              <li
                v-for="o in obligacionesVencidas"
                :key="o.id"
                class="rounded-md border border-slate-300 px-2.5 py-2 text-xs"
              >
                <div class="flex items-start justify-between gap-3">
                  <span class="text-slate-600">{{ o.concepto }} · vence {{ fecha(o.fechaVencimiento) }}</span>
                  <span class="shrink-0 text-right font-medium tabular-nums text-slate-900">
                    {{ moneda(Number(o.valorOriginal) - Number(o.valorAbonado)) }}
                  </span>
                </div>
                <div v-if="o.estado === 'PENDIENTE'" class="mt-1 flex justify-end">
                  <UButton size="2xs" color="red" variant="ghost" @click="abrirAnularObligacion(o)">
                    Anular (error de generación)
                  </UButton>
                </div>
              </li>
            </ul>

            <template v-if="obligacionesPorVencer.length">
              <p class="mb-2 mt-4 text-sm font-medium text-slate-900">Por vencer</p>
              <ul class="space-y-2">
                <li
                  v-for="o in obligacionesPorVencer"
                  :key="o.id"
                  class="flex items-start justify-between gap-3 rounded-md border border-slate-200 px-2.5 py-2 text-xs"
                >
                  <span class="text-slate-500">{{ o.concepto }} · vence {{ fecha(o.fechaVencimiento) }}</span>
                  <span class="shrink-0 text-right font-medium tabular-nums text-slate-700">
                    {{ moneda(Number(o.valorOriginal) - Number(o.valorAbonado)) }}
                  </span>
                </li>
              </ul>
            </template>
          </div>
        </UCard>

        <!-- Registro de pago mixto -->
        <UCard class="lg:col-span-2">
          <template #header><p class="font-semibold text-slate-900">Registrar pago (medios combinados)</p></template>

          <UAlert
            v-if="borradorPago.hayBorrador.value"
            color="amber"
            variant="subtle"
            icon="i-heroicons-document-text"
            title="Tienes un pago a medio registrar guardado"
            class="mb-3"
          >
            <template #description>
              <div class="mt-2 flex gap-2">
                <UButton size="xs" color="amber" @click="borradorPago.restaurar()">Recuperar</UButton>
                <UButton size="xs" color="gray" variant="ghost" @click="borradorPago.limpiar()">Descartar</UButton>
              </div>
            </template>
          </UAlert>

          <div class="space-y-3">
            <TransitionGroup name="fila" tag="div" class="space-y-3">
              <div
                v-for="(detalle, i) in detallesPago"
                :key="detalle._key"
                class="flex flex-col gap-2 sm:flex-row sm:items-end"
              >
                <div class="w-full sm:w-44">
                  <label class="mb-1 block text-xs text-slate-500 sm:hidden">Medio de pago</label>
                  <USelectMenu v-model="detalle.medioPago" :options="medios" class="w-full" />
                </div>
                <div class="w-full sm:w-40">
                  <label class="mb-1 block text-xs text-slate-500 sm:hidden">Monto</label>
                  <UiMoneyInput v-model="detalle.monto" placeholder="Monto" class="w-full" />
                </div>
                <div class="flex-1">
                  <label class="mb-1 block text-xs text-slate-500 sm:hidden">Referencia</label>
                  <UInput v-model="detalle.referencia" placeholder="Referencia (opcional)" class="w-full" />
                </div>
                <UButton
                  v-if="detallesPago.length > 1"
                  color="red"
                  variant="ghost"
                  icon="i-heroicons-trash"
                  aria-label="Quitar medio de pago"
                  class="self-end"
                  @click="quitarDetalle(i)"
                />
              </div>
            </TransitionGroup>

            <UButton size="xs" variant="soft" icon="i-heroicons-plus" @click="agregarDetalle">
              Agregar medio de pago
            </UButton>

            <div>
              <UCheckbox
                v-model="dejarExcedenteComoSaldoFavor"
                label="Si sobra dinero, dejarlo como saldo a favor (en vez de devolver cambio)"
              />
              <p class="mt-1 text-xs text-slate-500">Por defecto, si sobra dinero se devuelve como cambio.</p>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3">
              <p class="text-sm text-slate-600">
                Total a registrar:
                <span class="text-base font-semibold tabular-nums text-slate-900">{{ moneda(totalPago) }}</span>
              </p>
              <UButton
                color="amber"
                :loading="cargandoPrevisualizacion"
                :disabled="totalPago <= 0"
                @click="abrirConfirmarPago"
              >
                Confirmar y emitir recibo
              </UButton>
            </div>

            <UAlert
              v-if="ultimoRecibo"
              color="emerald"
              variant="subtle"
              icon="i-heroicons-check-circle"
              :title="`Recibo ${ultimoRecibo.consecutivo} emitido correctamente`"
            >
              <template #description>
                <p v-if="Number(ultimoRecibo.valorTotal) > 0" class="text-sm">
                  Total recibido:
                  <span class="font-semibold tabular-nums">{{ moneda(ultimoRecibo.valorTotal) }}</span>
                </p>
                <p v-if="Number(ultimoRecibo.excedente) > 0" class="mt-1 text-sm">
                  <span v-if="ultimoRecibo.excedenteComoSaldoFavor">
                    {{ moneda(ultimoRecibo.excedente) }} quedaron como saldo a favor del contrato.
                  </span>
                  <span v-else class="font-medium">Cambio a entregar: {{ moneda(ultimoRecibo.excedente) }}</span>
                </p>
                <div class="mt-2 flex flex-wrap gap-2">
                  <UButton
                    size="xs"
                    color="amber"
                    icon="i-heroicons-eye"
                    :loading="descargando"
                    :disabled="descargando"
                    @click="descargarPdf('CARTA')"
                    >Ver Carta</UButton
                  >
                  <UButton
                    size="xs"
                    color="amber"
                    variant="soft"
                    icon="i-heroicons-eye"
                    :loading="descargando"
                    :disabled="descargando"
                    @click="descargarPdf('MEDIA_CARTA')"
                    >Ver Media Carta</UButton
                  >
                </div>
              </template>
            </UAlert>
          </div>
        </UCard>
      </div>
    </template>

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
      :deposito-garantia="Number(ficha?.depositoGarantia || 0)"
      :valor-a-devolver="valorADevolver"
      :medios="medios"
      :descuentos="descuentosDeposito"
      :form="formLiquidar"
      :liquidando="liquidando"
      @confirmar="confirmarLiquidarDeposito"
    />

    <UiConfirmModal
      v-model="modalConfirmarCanon"
      title="Generar cánones pendientes"
      message="Se generará una obligación de canon para cada contrato activo dentro del horizonte configurado, para todos los meses que aún no tengan canon generado. Esta acción crea deuda cobrable de forma masiva. ¿Confirmas?"
      confirm-label="Generar cánones"
      color="amber"
      :loading="generandoCanon"
      @confirm="generarCanones"
    />
  </div>
</template>

<style scoped>
.fila-enter-active,
.fila-leave-active {
  transition: all 0.2s ease;
}
.fila-enter-from,
.fila-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.fila-leave-active {
  position: absolute;
}
</style>
