<script setup lang="ts">
/**
 * Configuración global de la empresa — EXCLUSIVO Administrador.
 * Separa lo que antes vivía embebido en /administracion: datos corporativos,
 * parámetros de mora y logo (subida de archivo real vía POST /empresa/logo).
 */
const config = useRuntimeConfig()
const origenApi = computed(() => new URL(config.public.apiBaseUrl).origin)

const empresa = ref<any>(null)
const cargandoEmpresa = ref(true)
const guardandoEmpresa = ref(false)
const errorEmpresa = ref('')

async function cargarEmpresa() {
  cargandoEmpresa.value = true
  try {
    empresa.value = await useApiFetch<any>('/empresa')
  } catch (e: any) {
    errorEmpresa.value = e?.data?.message || 'No fue posible cargar los datos de la empresa.'
  } finally {
    cargandoEmpresa.value = false
  }
}

async function guardarEmpresa() {
  errorEmpresa.value = ''
  guardandoEmpresa.value = true
  try {
    empresa.value = await useApiFetch<any>('/empresa', {
      method: 'PATCH',
      body: {
        nombre: empresa.value.nombre,
        nit: empresa.value.nit,
        slogan: empresa.value.slogan,
        direccion: empresa.value.direccion,
        telefono: empresa.value.telefono,
        diasGraciaMora: empresa.value.diasGraciaMora,
        porcentajeMoraMensual: empresa.value.porcentajeMoraMensual,
        horizonteMesesCanon: empresa.value.horizonteMesesCanon,
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
    resultadoCanon.value = await useApiFetch<{ generadas: number }>('/obligaciones/generar-canones', { method: 'POST' })
    modalConfirmarCanon.value = false
  } catch (e: any) {
    errorEmpresa.value = e?.data?.message || 'No fue posible generar los cánones.'
  } finally {
    generandoCanon.value = false
  }
}

// ---- Logo ----
const inputLogoRef = ref<HTMLInputElement | null>(null)
const archivoLogo = ref<File | null>(null)
const previewLogoLocal = ref<string | null>(null)
const subiendoLogo = ref(false)

const logoPreviewSrc = computed(() => {
  if (previewLogoLocal.value) return previewLogoLocal.value
  if (empresa.value?.logoUrl) return `${origenApi.value}${empresa.value.logoUrl}`
  return null
})

function abrirSelectorLogo() {
  inputLogoRef.value?.click()
}

function seleccionarLogo(evento: Event) {
  const input = evento.target as HTMLInputElement
  const archivo = input.files?.[0]
  if (!archivo) return

  if (previewLogoLocal.value) URL.revokeObjectURL(previewLogoLocal.value)
  archivoLogo.value = archivo
  previewLogoLocal.value = URL.createObjectURL(archivo)
}

function cancelarLogo() {
  if (previewLogoLocal.value) URL.revokeObjectURL(previewLogoLocal.value)
  archivoLogo.value = null
  previewLogoLocal.value = null
  if (inputLogoRef.value) inputLogoRef.value.value = ''
}

async function subirLogo() {
  if (!archivoLogo.value) return
  errorEmpresa.value = ''
  subiendoLogo.value = true
  try {
    const formData = new FormData()
    formData.append('archivo', archivoLogo.value)
    empresa.value = await useApiFetch<any>('/empresa/logo', { method: 'POST', body: formData })
    cancelarLogo()
  } catch (e: any) {
    errorEmpresa.value = e?.data?.message || 'No fue posible subir el logo.'
  } finally {
    subiendoLogo.value = false
  }
}

onMounted(cargarEmpresa)
onBeforeUnmount(() => {
  if (previewLogoLocal.value) URL.revokeObjectURL(previewLogoLocal.value)
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-semibold text-slate-900">Configuración</h1>
      <p class="text-sm text-slate-500">Datos corporativos, parámetros de mora y logo de la empresa.</p>
    </div>

    <SharedErrorState v-if="errorEmpresa" :message="errorEmpresa" @retry="cargarEmpresa" />

    <div v-if="cargandoEmpresa" class="text-slate-400 text-sm">Cargando…</div>

    <template v-else-if="empresa">
      <!-- Datos de la empresa + parámetros de mora -->
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
        </div>

        <UDivider class="my-6" label="Parámetros de mora" />

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <UFormGroup label="Días de gracia para mora">
            <UInput v-model.number="empresa.diasGraciaMora" type="number" />
          </UFormGroup>
          <UFormGroup label="% Mora mensual">
            <UInput v-model.number="empresa.porcentajeMoraMensual" type="number" step="0.1" />
          </UFormGroup>
          <UFormGroup label="Horizonte de cánones (meses)">
            <UInput v-model.number="empresa.horizonteMesesCanon" type="number" />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton color="amber" :loading="guardandoEmpresa" @click="guardarEmpresa">Guardar cambios</UButton>
          </div>
        </template>
      </UCard>

      <!-- Generación manual de canon -->
      <UCard>
        <template #header>
          <p class="font-semibold text-slate-900">Generación de canon</p>
        </template>
        <p class="text-sm text-slate-500">
          El canon mensual se genera automáticamente cada día (CRON), respetando el horizonte de
          {{ empresa.horizonteMesesCanon }} {{ empresa.horizonteMesesCanon === 1 ? 'mes' : 'meses' }}
          configurado arriba. Este botón dispara la misma generación manualmente, por si se necesita
          adelantar el proceso sin esperar al CRON.
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

      <!-- Logo -->
      <UCard>
        <template #header>
          <p class="font-semibold text-slate-900">Logo</p>
        </template>

        <div class="flex items-center gap-6">
          <div
            class="w-24 h-24 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0"
          >
            <img v-if="logoPreviewSrc" :src="logoPreviewSrc" alt="Logo de la empresa" class="w-full h-full object-contain" />
            <UIcon v-else name="i-heroicons-building-office-2" class="w-8 h-8 text-slate-300" />
          </div>

          <div class="space-y-2">
            <input ref="inputLogoRef" type="file" accept="image/png,image/jpeg,image/svg+xml" class="hidden" @change="seleccionarLogo" />
            <div class="flex gap-2">
              <UButton color="gray" variant="soft" size="sm" @click="abrirSelectorLogo">
                {{ archivoLogo ? 'Cambiar selección' : 'Seleccionar imagen' }}
              </UButton>
              <UButton v-if="archivoLogo" color="amber" size="sm" :loading="subiendoLogo" @click="subirLogo">
                Subir logo
              </UButton>
              <UButton v-if="archivoLogo" color="gray" variant="ghost" size="sm" :disabled="subiendoLogo" @click="cancelarLogo">
                Cancelar
              </UButton>
            </div>
            <p class="text-xs text-slate-400">PNG, JPG o SVG. Máximo 2 MB.</p>
            <p v-if="archivoLogo" class="text-xs text-slate-500">{{ archivoLogo.name }}</p>
          </div>
        </div>
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
