<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

/**
 * Detalle de un contrato. `GET /contratos/:id` es visible para cualquier rol autenticado
 * (datos del arrendatario/inmueble/codeudores), pero ficha financiera, historial de recibos e
 * historial de cambios de estado son EXCLUSIVO Administrador en el backend (`@Roles`) — esas
 * secciones ni siquiera se piden si el usuario no es Administrador, para no disparar 403s.
 */
const route = useRoute()
const auth = useAuthStore()
const { moneda, fecha } = useFormatoCO()

const cargando = ref(true)
const contrato = ref<any>(null)
const error = ref('')

async function cargar() {
  cargando.value = true
  try {
    contrato.value = await useApiFetch<any>(`/contratos/${route.params.id}`)
    definirTituloDinamico(`Contrato — ${contrato.value.cliente?.nombreCompleto ?? ''}`)
    error.value = ''
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible cargar el contrato.'
  } finally {
    cargando.value = false
  }
}

// ---- Ficha financiera (saldo a favor, depósito, obligaciones pendientes) ----
const cargandoFicha = ref(false)
const ficha = ref<any>(null)
const errorFicha = ref('')

async function cargarFicha() {
  if (!auth.esAdministrador) return
  cargandoFicha.value = true
  try {
    ficha.value = await useApiFetch<any>(`/contratos/${route.params.id}/ficha-recaudo`)
    errorFicha.value = ''
  } catch (e: any) {
    errorFicha.value = e?.data?.message || 'No fue posible cargar la ficha financiera.'
  } finally {
    cargandoFicha.value = false
  }
}

// ---- Historial de cambios de estado ----
const cargandoHistorial = ref(false)
const historial = ref<any[]>([])

async function cargarHistorial() {
  if (!auth.esAdministrador) return
  cargandoHistorial.value = true
  try {
    historial.value = await useApiFetch<any[]>(`/contratos/${route.params.id}/historial`)
  } catch {
    // No bloquea el resto de la página — el historial es un complemento, no el dato principal.
  } finally {
    cargandoHistorial.value = false
  }
}

// ---- Recibos del contrato ----
const {
  page: pageRecibos,
  limit: limitRecibos,
  total: totalRecibos,
  lista: recibos,
  cargando: cargandoRecibos,
  cargar: cargarRecibos,
} = useListadoPaginado<any>(
  ({ page, limit }) => useApiFetch<any>(`/recaudo/contrato/${route.params.id}/recibos`, { params: { page, limit } }),
  { limiteInicial: 5, inmediato: false },
)

function cargarSeccionesAdmin() {
  cargarFicha()
  cargarHistorial()
  cargarRecibos()
}

onMounted(async () => {
  await cargar()
  if (auth.esAdministrador) cargarSeccionesAdmin()
})

// ---- Terminar / reactivar (mismo flujo que contratos/index.vue) ----
const modalTerminar = ref(false)
const formTerminar = reactive({ fechaFin: '', motivoTerminacion: '' })
const terminando = ref(false)

function abrirTerminar() {
  error.value = ''
  formTerminar.fechaFin = new Date().toISOString().slice(0, 10)
  formTerminar.motivoTerminacion = ''
  modalTerminar.value = true
}

async function confirmarTerminar() {
  terminando.value = true
  try {
    await useApiFetch(`/contratos/${route.params.id}/terminar`, {
      method: 'PATCH',
      body: { fechaFin: formTerminar.fechaFin, motivoTerminacion: formTerminar.motivoTerminacion },
    })
    modalTerminar.value = false
    await cargar()
    // El backend anula automáticamente el canon futuro al terminar (CONT-05): refresca la
    // ficha financiera además del historial, o quedaría mostrando obligaciones ya anuladas.
    if (auth.esAdministrador) {
      cargarFicha()
      cargarHistorial()
    }
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible terminar el contrato.'
  } finally {
    terminando.value = false
  }
}

const modalReactivar = ref(false)
const formReactivar = reactive({ motivo: '' })
const reactivando = ref(false)

function abrirReactivar() {
  error.value = ''
  formReactivar.motivo = ''
  modalReactivar.value = true
}

async function confirmarReactivar() {
  if (!formReactivar.motivo) return
  reactivando.value = true
  try {
    await useApiFetch(`/contratos/${route.params.id}/reactivar`, { method: 'PATCH', body: formReactivar })
    modalReactivar.value = false
    await cargar()
    if (auth.esAdministrador) {
      cargarFicha()
      cargarHistorial()
    }
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible reactivar el contrato.'
  } finally {
    reactivando.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl">
    <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
      <div class="flex items-center gap-3">
        <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-left" to="/contratos">Volver</UButton>
        <h1 class="text-xl font-semibold text-slate-900">
          {{ contrato?.cliente?.nombreCompleto ? `Contrato de ${contrato.cliente.nombreCompleto}` : 'Contrato' }}
        </h1>
        <SharedStatusBadge v-if="contrato" domain="contrato" :value="contrato.estado" />
      </div>
      <div v-if="contrato" class="flex gap-2">
        <UButton
          v-if="contrato.estado === 'ACTIVO'"
          size="sm"
          color="amber"
          icon="i-heroicons-banknotes"
          :to="`/recaudo?contratoId=${contrato.id}`"
        >
          Ir a Recaudo
        </UButton>
        <UButton v-if="contrato.estado === 'ACTIVO'" size="sm" color="red" variant="soft" @click="abrirTerminar">
          Terminar
        </UButton>
        <UButton
          v-if="auth.esAdministrador && contrato.estado === 'TERMINADO'"
          size="sm"
          color="emerald"
          variant="soft"
          @click="abrirReactivar"
        >
          Reactivar
        </UButton>
      </div>
    </div>

    <SharedErrorState v-if="error" :message="error" class="mb-4" @retry="cargar" />

    <div v-if="cargando" class="text-center py-16 text-slate-500">Cargando contrato…</div>

    <div v-else-if="contrato" class="space-y-4">
      <UCard>
        <template #header><p class="font-semibold text-slate-900">Datos del contrato</p></template>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <p>
            <span class="text-slate-500">Arrendatario:</span> {{ contrato.cliente?.nombreCompleto }} ({{
              contrato.cliente?.numeroDocumento
            }})
          </p>
          <p>
            <span class="text-slate-500">Inmueble:</span> {{ contrato.inmueble?.direccion }} ({{
              contrato.inmueble?.barrio
            }})
          </p>
          <p><span class="text-slate-500">Fecha de inicio:</span> {{ fecha(contrato.fechaInicio) }}</p>
          <p>
            <span class="text-slate-500">Fecha de fin:</span> {{ contrato.fechaFin ? fecha(contrato.fechaFin) : '—' }}
          </p>
          <p><span class="text-slate-500">Día de pago:</span> {{ contrato.diaPago }}</p>
          <p><span class="text-slate-500">Canon:</span> {{ moneda(contrato.canonValor) }}</p>
          <p v-if="contrato.motivoTerminacion" class="col-span-2">
            <span class="text-slate-500">Motivo de terminación:</span> {{ contrato.motivoTerminacion }}
          </p>
        </div>
      </UCard>

      <UCard>
        <template #header><p class="font-semibold text-slate-900">Codeudores</p></template>
        <p v-if="!contrato.codeudores?.length" class="text-sm text-slate-400">Sin codeudores registrados.</p>
        <div v-else class="flex flex-wrap gap-2">
          <UBadge v-for="c in contrato.codeudores" :key="c.id" color="amber" variant="subtle">
            {{ c.nombreCompleto }} — {{ c.numeroDocumento }}
          </UBadge>
        </div>
      </UCard>

      <template v-if="auth.esAdministrador">
        <SharedErrorState v-if="errorFicha" :message="errorFicha" @retry="cargarFicha" />
        <UCard v-else>
          <template #header><p class="font-semibold text-slate-900">Resumen financiero</p></template>
          <div v-if="cargandoFicha" class="text-sm text-slate-400">Cargando…</div>
          <div v-else-if="ficha" class="space-y-4">
            <div class="grid grid-cols-2 gap-3 text-sm">
              <p>
                <span class="text-slate-500">Saldo a favor:</span>
                <span class="text-emerald-600 font-medium">{{ moneda(ficha.saldoAFavor) }}</span>
              </p>
              <p><span class="text-slate-500">Depósito en custodia:</span> {{ moneda(ficha.depositoCustodia) }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-slate-900 mb-2">Obligaciones pendientes</p>
              <p v-if="!ficha.obligacionesPendientes?.length" class="text-sm text-slate-400">
                Sin obligaciones pendientes.
              </p>
              <div v-else class="space-y-2">
                <div
                  v-for="o in ficha.obligacionesPendientes"
                  :key="o.id"
                  class="text-xs border rounded-md px-2 py-1.5 flex justify-between"
                >
                  <span class="text-slate-700">{{ o.concepto }} · vence {{ fecha(o.fechaVencimiento) }}</span>
                  <span class="font-medium text-slate-900">
                    {{ moneda(Number(o.valorOriginal) - Number(o.valorAbonado)) }}
                    <span v-if="Number(o.valorMoraAcumulada) > 0" class="text-red-600">
                      (+{{ moneda(o.valorMoraAcumulada) }} mora)
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header><p class="font-semibold text-slate-900">Recibos emitidos</p></template>
          <UTable
            :rows="recibos"
            :columns="[
              { key: 'consecutivo', label: 'Número' },
              { key: 'creadoEn', label: 'Fecha' },
              { key: 'valorTotal', label: 'Valor' },
              { key: 'estado', label: 'Estado' },
              { key: 'acciones', label: '' },
            ]"
            :loading="cargandoRecibos"
          >
            <template #creadoEn-data="{ row }">{{ fecha(row.creadoEn) }}</template>
            <template #valorTotal-data="{ row }">{{ moneda(row.valorTotal) }}</template>
            <template #estado-data="{ row }">
              <SharedStatusBadge domain="recibo" :value="row.estado" />
            </template>
            <template #acciones-data="{ row }">
              <UButton size="xs" color="amber" variant="soft" icon="i-heroicons-eye" :to="`/recibos/${row.id}`">
                Ver
              </UButton>
            </template>
            <template #empty-state>
              <p class="text-center py-6 text-sm text-slate-400">Sin recibos emitidos para este contrato.</p>
            </template>
          </UTable>
          <div v-if="totalRecibos > limitRecibos" class="flex justify-end mt-4">
            <UPagination v-model="pageRecibos" :page-count="limitRecibos" :total="totalRecibos" />
          </div>
        </UCard>

        <UCard>
          <template #header><p class="font-semibold text-slate-900">Historial de estado</p></template>
          <div v-if="cargandoHistorial" class="text-sm text-slate-400">Cargando…</div>
          <p v-else-if="!historial.length" class="text-sm text-slate-400">Sin cambios de estado registrados.</p>
          <div v-else class="space-y-2 text-sm">
            <div v-for="h in historial" :key="h.id" class="border-b last:border-0 pb-2">
              <p class="text-slate-900">
                {{ h.estadoAnterior }} → {{ h.estadoNuevo }}
                <span class="text-xs text-slate-400">({{ fecha(h.creadoEn) }} · {{ h.usuarioEmail }})</span>
              </p>
              <p v-if="h.motivo" class="text-xs text-slate-500">{{ h.motivo }}</p>
            </div>
          </div>
        </UCard>
      </template>
    </div>

    <!-- Terminar contrato -->
    <UModal v-model="modalTerminar">
      <UCard>
        <template #header>
          <p class="font-semibold text-slate-900">Terminar contrato</p>
        </template>
        <div class="space-y-3">
          <UAlert
            color="amber"
            variant="subtle"
            title="Esta acción es irreversible."
            description="Si el contrato tiene saldo pendiente, seguirá siendo cobrable desde Recaudo; no se cancela ni se pierde al terminar."
          />
          <UFormGroup label="Fecha de fin">
            <UInput v-model="formTerminar.fechaFin" type="date" />
          </UFormGroup>
          <UFormGroup label="Motivo de terminación">
            <UTextarea v-model="formTerminar.motivoTerminacion" />
          </UFormGroup>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="modalTerminar = false">Cancelar</UButton>
            <UButton
              color="red"
              :loading="terminando"
              :disabled="!formTerminar.fechaFin || !formTerminar.motivoTerminacion"
              @click="confirmarTerminar"
            >
              Terminar contrato
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Reactivar contrato -->
    <UModal v-model="modalReactivar">
      <UCard>
        <template #header>
          <p class="font-semibold text-slate-900">Reactivar contrato</p>
        </template>
        <div class="space-y-3">
          <UAlert
            color="emerald"
            variant="subtle"
            title="El contrato volverá a ACTIVO."
            description="El inmueble vuelve a quedar ocupado. La fecha y el motivo de la terminación original se conservan en el historial del contrato."
          />
          <UFormGroup label="Motivo de la reactivación">
            <UTextarea v-model="formReactivar.motivo" placeholder="Ej: el cliente decidió continuar el arrendamiento" />
          </UFormGroup>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="modalReactivar = false">Cancelar</UButton>
            <UButton
              color="emerald"
              :loading="reactivando"
              :disabled="!formReactivar.motivo"
              @click="confirmarReactivar"
            >
              Reactivar contrato
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
