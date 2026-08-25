<script setup lang="ts">
/**
 * Módulo de Caja física (§15, CAJA-02) — EXCLUSIVO Administrador (protegido también por
 * middleware/auth.global.ts). Muestra el saldo esperado en vivo (saldo inicial + ingresos -
 * egresos - devoluciones en efectivo, calculado 100% en el backend) y permite registrar un
 * arqueo comparando contra el conteo físico real.
 */
const { moneda, fecha } = useFormatoCO()

const cargandoSaldo = ref(true)
const saldo = ref<{
  saldoInicial: number
  ingresosEfectivo: number
  egresosEfectivo: number
  devolucionesEfectivo: number
  saldoEsperado: number
} | null>(null)
const error = ref('')

async function cargarSaldo() {
  cargandoSaldo.value = true
  try {
    saldo.value = await useApiFetch('/caja/saldo-esperado')
    error.value = ''
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible cargar el saldo esperado de caja.'
  } finally {
    cargandoSaldo.value = false
  }
}

// ---- Historial de arqueos ----
const {
  page,
  limit,
  total,
  lista: arqueos,
  cargando: cargandoArqueos,
  error: errorArqueos,
  cargar: cargarArqueos,
} = useListadoPaginado<any>(
  ({ page, limit }) => useApiFetch<any>('/caja/arqueos', { params: { page, limit } }),
  { mensajeError: 'No fue posible cargar el historial de arqueos.' },
)

// `error` cubre saldo/arqueo; `errorArqueos` es el propio de la composable de listado — se
// muestran juntos porque comparten el mismo `SharedErrorState` en esta página.
const errorVisible = computed(() => error.value || errorArqueos.value)

const columnas = [
  { key: 'creadoEn', label: 'Fecha' },
  { key: 'saldoEsperado', label: 'Esperado' },
  { key: 'saldoContado', label: 'Contado' },
  { key: 'diferencia', label: 'Diferencia' },
  { key: 'registradoPorEmail', label: 'Registrado por' },
]

// ---- Registrar arqueo ----
const modalArqueo = ref(false)
const registrando = ref(false)
const formArqueo = reactive({ saldoContado: 0, observaciones: '' })

function abrirArqueo() {
  error.value = ''
  formArqueo.saldoContado = Number(saldo.value?.saldoEsperado ?? 0)
  formArqueo.observaciones = ''
  modalArqueo.value = true
}

const diferenciaPreview = computed(() => formArqueo.saldoContado - Number(saldo.value?.saldoEsperado ?? 0))

async function confirmarArqueo() {
  registrando.value = true
  try {
    await useApiFetch('/caja/arqueos', {
      method: 'POST',
      body: { saldoContado: formArqueo.saldoContado, observaciones: formArqueo.observaciones || undefined },
    })
    modalArqueo.value = false
    await Promise.all([cargarSaldo(), cargarArqueos()])
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible registrar el arqueo.'
  } finally {
    registrando.value = false
  }
}

function colorDiferencia(valor: number): 'emerald' | 'red' | 'gray' {
  if (Number(valor) > 0) return 'emerald'
  if (Number(valor) < 0) return 'red'
  return 'gray'
}

onMounted(cargarSaldo)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-semibold text-slate-900">Caja</h1>
      <UButton color="amber" icon="i-heroicons-calculator" :disabled="cargandoSaldo" @click="abrirArqueo">
        Registrar arqueo
      </UButton>
    </div>

    <SharedErrorState v-if="errorVisible" :message="errorVisible" class="mb-4" @retry="() => { cargarSaldo(); cargarArqueos() }" />

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <UCard>
        <p class="text-xs text-slate-500 mb-1">Saldo inicial</p>
        <p v-if="cargandoSaldo" class="text-slate-400 text-sm">Cargando…</p>
        <p v-else class="text-lg font-bold text-slate-900">{{ moneda(saldo?.saldoInicial) }}</p>
      </UCard>
      <UCard>
        <p class="text-xs text-slate-500 mb-1">Ingresos efectivo</p>
        <p v-if="cargandoSaldo" class="text-slate-400 text-sm">Cargando…</p>
        <p v-else class="text-lg font-bold text-emerald-600">{{ moneda(saldo?.ingresosEfectivo) }}</p>
      </UCard>
      <UCard>
        <p class="text-xs text-slate-500 mb-1">Egresos + devoluciones</p>
        <p v-if="cargandoSaldo" class="text-slate-400 text-sm">Cargando…</p>
        <p v-else class="text-lg font-bold text-red-600">
          {{ moneda(Number(saldo?.egresosEfectivo ?? 0) + Number(saldo?.devolucionesEfectivo ?? 0)) }}
        </p>
      </UCard>
      <UCard class="border-amber-300">
        <p class="text-xs text-slate-500 mb-1">Saldo esperado (en vivo)</p>
        <p v-if="cargandoSaldo" class="text-slate-400 text-sm">Cargando…</p>
        <p v-else class="text-lg font-bold text-amber-600">{{ moneda(saldo?.saldoEsperado) }}</p>
      </UCard>
    </div>

    <UCard>
      <template #header><p class="font-semibold text-slate-900">Historial de arqueos</p></template>
      <UTable :rows="arqueos" :columns="columnas" :loading="cargandoArqueos">
        <template #creadoEn-data="{ row }">{{ fecha(row.creadoEn) }}</template>
        <template #saldoEsperado-data="{ row }">{{ moneda(row.saldoEsperado) }}</template>
        <template #saldoContado-data="{ row }">{{ moneda(row.saldoContado) }}</template>
        <template #diferencia-data="{ row }">
          <UBadge :color="colorDiferencia(row.diferencia)" variant="subtle">
            {{ Number(row.diferencia) > 0 ? '+' : '' }}{{ moneda(row.diferencia) }}
          </UBadge>
        </template>
        <template #empty-state>
          <div class="text-center py-10 text-slate-400">
            <UIcon name="i-heroicons-calculator" class="w-10 h-10 mx-auto mb-2" />
            <p>Todavía no se ha registrado ningún arqueo de caja.</p>
          </div>
        </template>
      </UTable>

      <div class="flex justify-end mt-4">
        <UPagination v-model="page" :page-count="limit" :total="total" />
      </div>
    </UCard>

    <!-- Registrar arqueo -->
    <UModal v-model="modalArqueo">
      <UCard>
        <template #header>
          <p class="font-semibold text-slate-900">Registrar arqueo de caja</p>
        </template>
        <div class="space-y-3">
          <p class="text-sm text-slate-600">
            Saldo esperado según el sistema: <span class="font-semibold text-slate-900">{{ moneda(saldo?.saldoEsperado) }}</span>
          </p>
          <UFormGroup label="Saldo contado (conteo físico real)">
            <UInput v-model.number="formArqueo.saldoContado" type="number" min="0" />
          </UFormGroup>
          <p class="text-sm">
            Diferencia:
            <span :class="diferenciaPreview === 0 ? 'text-slate-600' : diferenciaPreview > 0 ? 'text-emerald-600' : 'text-red-600'" class="font-semibold">
              {{ diferenciaPreview > 0 ? '+' : '' }}{{ moneda(diferenciaPreview) }}
            </span>
            <span v-if="diferenciaPreview > 0" class="text-slate-500"> (sobrante)</span>
            <span v-else-if="diferenciaPreview < 0" class="text-slate-500"> (faltante)</span>
          </p>
          <UFormGroup label="Observaciones (opcional)">
            <UTextarea v-model="formArqueo.observaciones" />
          </UFormGroup>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="modalArqueo = false">Cancelar</UButton>
            <UButton color="amber" :loading="registrando" @click="confirmarArqueo">Registrar arqueo</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
