<script setup lang="ts">
/**
 * Detalle de un recibo — permite volver a consultarlo y descargarlo en cualquier momento,
 * sin pasar por el cliente/contrato ni por el módulo de Recaudo (historial, §6). NUNCA se
 * edita un recibo aquí: la única acción de corrección disponible es Anular (§7), que conserva
 * el registro histórico completo (§8) — nunca se elimina físicamente.
 */
const route = useRoute()
const { moneda, fecha } = useFormatoCO()

const cargando = ref(true)
const recibo = ref<any>(null)
const error = ref('')

async function cargar() {
  cargando.value = true
  try {
    recibo.value = await useApiFetch<any>(`/recaudo/recibos/${route.params.id}`)
    definirTituloDinamico(`Recibo ${recibo.value.consecutivo}`)
    error.value = ''
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible cargar el recibo.'
  } finally {
    cargando.value = false
  }
}

const descargando = ref(false)
async function descargar(formato: 'CARTA' | 'MEDIA_CARTA') {
  if (descargando.value) return
  descargando.value = true
  try {
    await usePdfDownload(`/documentos/recibos/${route.params.id}/pdf?formato=${formato}`, recibo.value?.consecutivo)
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible descargar el PDF.'
  } finally {
    descargando.value = false
  }
}

function etiquetaConcepto(aplicacion: any): string {
  return aplicacion.concepto === 'MORA' ? 'Mora' : 'Capital'
}

// Mismo criterio que RecaudoModalPrevisualizacionPago: Canon/Novedad se distinguen por
// `obligacion.tipo`, no por `concepto` (que solo dice CAPITAL/MORA).
const totalesAplicaciones = computed(() => {
  const acc = { canon: 0, novedad: 0, mora: 0 }
  for (const a of recibo.value?.aplicaciones ?? []) {
    const monto = Number(a.montoAplicado || 0)
    if (a.concepto === 'MORA') acc.mora += monto
    else if (a.obligacion?.tipo === 'NOVEDAD') acc.novedad += monto
    else acc.canon += monto
  }
  return acc
})

// ---- Anular recibo (solo si sigue EMITIDO) ----
const modalAnular = ref(false)
const anulando = ref(false)
const motivoAnulacion = ref('')

function abrirAnular() {
  motivoAnulacion.value = ''
  modalAnular.value = true
}

async function confirmarAnular() {
  anulando.value = true
  try {
    await useApiFetch(`/recaudo/recibos/${route.params.id}/anular`, {
      method: 'PATCH',
      body: { motivo: motivoAnulacion.value },
    })
    modalAnular.value = false
    await cargar()
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible anular el recibo.'
  } finally {
    anulando.value = false
  }
}

onMounted(cargar)
</script>

<template>
  <div class="max-w-3xl">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-left" to="/recibos">Volver</UButton>
        <h1 class="text-xl font-semibold text-slate-900">Recibo {{ recibo?.consecutivo }}</h1>
      </div>
      <div v-if="recibo" class="flex gap-2">
        <UButton
          v-if="recibo.estado === 'EMITIDO'"
          size="sm"
          color="red"
          variant="soft"
          icon="i-heroicons-no-symbol"
          @click="abrirAnular"
        >
          Anular
        </UButton>
        <UDropdown
          :items="[
            [
              { label: 'PDF Carta', click: () => descargar('CARTA') },
              { label: 'PDF Media Carta', click: () => descargar('MEDIA_CARTA') },
            ],
          ]"
        >
          <UButton size="sm" color="amber" icon="i-heroicons-arrow-down-tray" :loading="descargando">
            Descargar PDF
          </UButton>
        </UDropdown>
      </div>
    </div>

    <SharedErrorState v-if="error" :message="error" class="mb-4" @retry="cargar" />

    <div v-if="cargando" class="text-center py-16 text-slate-500">Cargando recibo…</div>

    <div v-else-if="recibo" class="space-y-4">
      <UAlert
        v-if="recibo.estado === 'ANULADO'"
        color="red"
        variant="subtle"
        title="Este recibo está ANULADO"
        :description="recibo.motivoAnulacion ? `Motivo: ${recibo.motivoAnulacion}` : undefined"
      />

      <UCard>
        <template #header><p class="font-semibold text-slate-900">Datos del recibo</p></template>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <p><span class="text-slate-500">Número:</span> {{ recibo.consecutivo }}</p>
          <p><span class="text-slate-500">Fecha:</span> {{ fecha(recibo.creadoEn) }}</p>
          <p>
            <span class="text-slate-500">Cliente:</span> {{ recibo.contrato?.cliente?.nombreCompleto }} ({{
              recibo.contrato?.cliente?.numeroDocumento
            }})
          </p>
          <p>
            <span class="text-slate-500">Contrato:</span>
            <NuxtLink :to="`/recaudo?contratoId=${recibo.contrato?.id}`" class="text-amber-600 hover:underline"
              >Ver ficha del contrato</NuxtLink
            >
          </p>
          <p class="col-span-2">
            <span class="text-slate-500">Inmueble:</span> {{ recibo.contrato?.inmueble?.direccion }} ({{
              recibo.contrato?.inmueble?.barrio
            }})
          </p>
          <p>
            <span class="text-slate-500">Estado:</span>
            <SharedStatusBadge domain="recibo" :value="recibo.estado" class="ml-1" />
          </p>
        </div>
      </UCard>

      <UCard>
        <template #header><p class="font-semibold text-slate-900">Medios de pago</p></template>
        <div class="space-y-1 text-sm">
          <div v-for="d in recibo.detallesPago" :key="d.id" class="flex justify-between">
            <span class="text-slate-700">
              {{ d.medioPago === 'EFECTIVO' ? 'Efectivo' : 'Transferencia' }}
              <span v-if="d.referencia" class="text-slate-400">(Ref: {{ d.referencia }})</span>
            </span>
            <span class="font-medium text-slate-900">{{ moneda(d.monto) }}</span>
          </div>
        </div>
        <div class="flex justify-between border-t mt-3 pt-3 text-sm">
          <span class="font-semibold text-slate-900">Total recibido</span>
          <span class="font-semibold text-slate-900">{{ moneda(recibo.valorTotal) }}</span>
        </div>
        <p v-if="Number(recibo.excedente) > 0" class="text-xs text-amber-600 mt-1">
          {{ recibo.excedenteComoSaldoFavor ? 'Excedente aplicado a saldo a favor' : 'Cambio entregado' }}:
          {{ moneda(recibo.excedente) }}
        </p>
      </UCard>

      <UCard>
        <template #header><p class="font-semibold text-slate-900">Aplicación del dinero</p></template>
        <p v-if="!recibo.aplicaciones?.length" class="text-sm text-slate-400">
          Sin desglose disponible para este recibo.
        </p>
        <template v-else>
          <RecaudoResumenAplicaciones :totales="totalesAplicaciones" class="mb-3" />
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-slate-500 border-b">
                <th class="py-1.5 pr-2">Concepto</th>
                <th class="py-1.5 pr-2">Período</th>
                <th class="py-1.5 pr-2">Tipo</th>
                <th class="py-1.5 pr-2 text-right">Valor aplicado</th>
                <th class="py-1.5 text-right">Saldo posterior</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in recibo.aplicaciones" :key="a.id" class="border-b last:border-0">
                <td class="py-1.5 pr-2 text-slate-900">{{ a.obligacion?.concepto }}</td>
                <td class="py-1.5 pr-2 text-slate-600">
                  {{ a.obligacion?.periodo ? fecha(a.obligacion.periodo) : '—' }}
                </td>
                <td class="py-1.5 pr-2">
                  <UBadge :color="a.concepto === 'MORA' ? 'red' : 'gray'" variant="subtle" size="xs">{{
                    etiquetaConcepto(a)
                  }}</UBadge>
                </td>
                <td class="py-1.5 pr-2 text-right text-slate-900">{{ moneda(a.montoAplicado) }}</td>
                <td class="py-1.5 text-right text-slate-600">
                  {{ a.saldoPosterior != null ? moneda(a.saldoPosterior) : '—' }}
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </UCard>
    </div>

    <!-- Anular recibo -->
    <UModal v-model="modalAnular">
      <UCard>
        <template #header>
          <p class="font-semibold text-slate-900">Anular recibo</p>
        </template>
        <div class="space-y-3">
          <UAlert
            color="red"
            variant="subtle"
            title="Esta acción no se puede deshacer."
            description="El recibo NUNCA se elimina: queda marcado ANULADO, con el motivo, y se revierte exactamente lo que aplicó (capital, mora, saldo a favor y movimientos de caja)."
          />
          <UFormGroup label="Motivo de la anulación">
            <UTextarea v-model="motivoAnulacion" />
          </UFormGroup>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="modalAnular = false">Cancelar</UButton>
            <UButton color="red" :loading="anulando" :disabled="!motivoAnulacion" @click="confirmarAnular">
              Anular recibo
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
