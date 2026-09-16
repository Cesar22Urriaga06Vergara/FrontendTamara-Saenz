<script setup lang="ts">
interface EmpresaConfig {
  nombre: string
  nit: string
  slogan: string
  direccion: string
  telefono: string
  horizonteMesesCanon: number
  saldoInicialCaja: number
}

interface ConsecutivoConfig {
  id?: string
  tipo: string
  prefijo: string
  ultimoNumero: number
}

/**
 * Configuración global de la empresa — EXCLUSIVO Administrador.
 * Separa lo que antes vivía embebido en /administracion: datos corporativos,
 * horizonte de cánones y saldo inicial de caja.
 */
const empresa = ref<EmpresaConfig | null>(null)
const consecutivos = ref<ConsecutivoConfig[]>([])
const cargandoEmpresa = ref(true)
const guardandoEmpresa = ref(false)
const guardandoConsecutivo = ref(false)
const errorEmpresa = ref('')
const nuevoConsecutivo = ref<ConsecutivoConfig>({ tipo: 'RECIBO_CAJA', prefijo: 'REC-', ultimoNumero: 0 })

async function cargarEmpresa() {
  cargandoEmpresa.value = true
  try {
    const respuesta = await useApiFetch<EmpresaConfig & { direccion: string | null; telefono: string | null }>(
      '/empresa',
    )
    empresa.value = { ...respuesta, direccion: respuesta.direccion ?? '', telefono: respuesta.telefono ?? '' }
  } catch (e: any) {
    errorEmpresa.value = e?.data?.message || 'No fue posible cargar los datos de la empresa.'
  } finally {
    cargandoEmpresa.value = false
  }
}

async function guardarEmpresa() {
  if (!empresa.value) return
  errorEmpresa.value = ''
  guardandoEmpresa.value = true
  try {
    empresa.value = await useApiFetch<EmpresaConfig>('/empresa', {
      method: 'PATCH',
      body: {
        nombre: empresa.value.nombre,
        nit: empresa.value.nit,
        slogan: empresa.value.slogan,
        direccion: empresa.value.direccion,
        telefono: empresa.value.telefono,
        horizonteMesesCanon: empresa.value.horizonteMesesCanon,
        saldoInicialCaja: empresa.value.saldoInicialCaja,
      },
    })
  } catch (e: any) {
    errorEmpresa.value = e?.data?.message || 'No fue posible guardar los cambios.'
  } finally {
    guardandoEmpresa.value = false
  }
}

// ---- Generación manual de canon (además del CRON diario automático) ----
const generandoCanon = ref(false)
const resultadoCanon = ref<{ generadas: number } | null>(null)
const modalConfirmarCanon = ref(false)

async function generarCanones() {
  errorEmpresa.value = ''
  resultadoCanon.value = null
  generandoCanon.value = true
  try {
    resultadoCanon.value = await useApiFetch<{ generadas: number }>('/obligaciones/generar-canones', {
      method: 'POST',
      idempotente: true, // el backend salta los cánones que ya existen (índice único por período)
    })
    modalConfirmarCanon.value = false
  } catch (e: any) {
    errorEmpresa.value = e?.data?.message || 'No fue posible generar los cánones.'
  } finally {
    generandoCanon.value = false
  }
}

async function cargarConsecutivos() {
  try {
    consecutivos.value = await useApiFetch<ConsecutivoConfig[]>('/empresa/consecutivos')
  } catch (e: any) {
    errorEmpresa.value = e?.data?.message || 'No fue posible cargar los consecutivos.'
  }
}

async function guardarConsecutivo() {
  if (!nuevoConsecutivo.value.tipo.trim()) {
    errorEmpresa.value = 'Debe indicar el tipo de consecutivo.'
    return
  }

  errorEmpresa.value = ''
  guardandoConsecutivo.value = true

  try {
    const guardado = await useApiFetch<ConsecutivoConfig>('/empresa/consecutivos', {
      method: 'POST',
      body: {
        tipo: nuevoConsecutivo.value.tipo.trim(),
        prefijo: nuevoConsecutivo.value.prefijo ?? '',
        ultimoNumero: Number(nuevoConsecutivo.value.ultimoNumero ?? 0),
      },
    })

    const existente = consecutivos.value.find((item) => item.tipo === guardado.tipo)
    if (existente) {
      Object.assign(existente, guardado)
    } else {
      consecutivos.value.push(guardado)
    }

    nuevoConsecutivo.value = {
      tipo: guardado.tipo,
      prefijo: guardado.prefijo || '',
      ultimoNumero: guardado.ultimoNumero ?? 0,
    }
  } catch (e: any) {
    errorEmpresa.value = e?.data?.message || 'No fue posible guardar el consecutivo.'
  } finally {
    guardandoConsecutivo.value = false
  }
}

onMounted(async () => {
  await cargarEmpresa()
  await cargarConsecutivos()
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-semibold text-slate-900">Configuración</h1>
      <p class="text-sm text-slate-500">Datos corporativos, horizonte de cánones y logo de la empresa.</p>
    </div>

    <SharedErrorState v-if="errorEmpresa" :message="errorEmpresa" @retry="cargarEmpresa" />

    <SharedSkeletonText v-if="cargandoEmpresa" :lines="4" />

    <template v-else-if="empresa">
      <!-- Datos de la empresa -->
      <UCard>
        <template #header>
          <p class="font-semibold text-slate-900">Datos de la empresa</p>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormGroup label="Nombre">
            <UInput v-model="empresa.nombre" />
          </UFormGroup>
          <UFormGroup label="NIT">
            <UInput v-model="empresa.nit" />
          </UFormGroup>
          <UFormGroup label="Slogan" class="sm:col-span-2">
            <UInput v-model="empresa.slogan" />
          </UFormGroup>
          <UFormGroup label="Dirección">
            <UInput v-model="empresa.direccion" />
          </UFormGroup>
          <UFormGroup label="Teléfono">
            <UInput v-model="empresa.telefono" />
          </UFormGroup>
          <UFormGroup label="Horizonte de cánones (meses)">
            <UInput v-model.number="empresa.horizonteMesesCanon" type="number" />
          </UFormGroup>
          <UFormGroup label="Saldo inicial de caja">
            <UInput v-model.number="empresa.saldoInicialCaja" type="number" />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton color="amber" :loading="guardandoEmpresa" @click="guardarEmpresa">Guardar cambios</UButton>
          </div>
        </template>
      </UCard>

      <!-- Consecutivos -->
      <UCard>
        <template #header>
          <p class="font-semibold text-slate-900">Consecutivos</p>
        </template>

        <div class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <UFormGroup label="Tipo">
              <UInput v-model="nuevoConsecutivo.tipo" placeholder="RECIBO_CAJA" />
            </UFormGroup>
            <UFormGroup label="Prefijo">
              <UInput v-model="nuevoConsecutivo.prefijo" placeholder="REC-" />
            </UFormGroup>
            <UFormGroup label="Último número">
              <UInput v-model.number="nuevoConsecutivo.ultimoNumero" type="number" min="0" />
            </UFormGroup>
          </div>

          <div class="flex justify-end">
            <UButton color="amber" :loading="guardandoConsecutivo" @click="guardarConsecutivo">
              Guardar consecutivo
            </UButton>
          </div>

          <div v-if="consecutivos.length" class="overflow-hidden rounded border border-slate-200">
            <table class="min-w-full divide-y divide-slate-200 text-sm">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-3 py-2 text-left font-medium text-slate-700">Tipo</th>
                  <th class="px-3 py-2 text-left font-medium text-slate-700">Prefijo</th>
                  <th class="px-3 py-2 text-left font-medium text-slate-700">Último número</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 bg-white">
                <tr v-for="item in consecutivos" :key="item.tipo">
                  <td class="px-3 py-2 text-slate-900">{{ item.tipo }}</td>
                  <td class="px-3 py-2 text-slate-900">{{ item.prefijo || '—' }}</td>
                  <td class="px-3 py-2 text-slate-900">{{ item.ultimoNumero }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p v-else class="text-sm text-slate-500">Aún no hay consecutivos configurados.</p>
        </div>
      </UCard>

      <!-- Generación manual de canon -->
      <UCard>
        <template #header>
          <p class="font-semibold text-slate-900">Generación de canon</p>
        </template>
        <p class="text-sm text-slate-500">
          El canon mensual se genera automáticamente cada día (CRON), respetando el horizonte de
          {{ empresa.horizonteMesesCanon }} {{ empresa.horizonteMesesCanon === 1 ? 'mes' : 'meses' }}
          configurado arriba. Este botón dispara la misma generación manualmente, por si se necesita adelantar el
          proceso sin esperar al CRON.
        </p>
        <UAlert
          v-if="resultadoCanon"
          class="mt-3"
          color="emerald"
          variant="subtle"
          :title="`${resultadoCanon.generadas} obligación(es) de canon generada(s).`"
        />
        <template #footer>
          <div class="flex justify-end">
            <UButton color="amber" variant="soft" :loading="generandoCanon" @click="modalConfirmarCanon = true">
              Generar cánones pendientes
            </UButton>
          </div>
        </template>
      </UCard>
    </template>

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
