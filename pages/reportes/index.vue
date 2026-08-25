<script setup lang="ts">
/** Centro de exportación de informes a Excel (.xlsx) — EXCLUSIVO Administrador. */
const descargando = ref<string | null>(null)
const error = ref('')

async function descargar(clave: string, path: string, nombreArchivo: string) {
  error.value = ''
  descargando.value = clave
  try {
    await useExcelExport(path, nombreArchivo)
  } catch (e: any) {
    error.value = e?.data?.message || 'No fue posible descargar el reporte.'
  } finally {
    descargando.value = null
  }
}

const reportes = [
  {
    clave: 'contratos',
    titulo: 'Contratos',
    descripcion: 'Listado completo de contratos con arrendatario, inmueble, canon y estado.',
    icon: 'i-heroicons-document-text',
    path: '/documentos/reportes/contratos.xlsx',
    archivo: 'reporte-contratos.xlsx',
  },
  {
    clave: 'cartera',
    titulo: 'Cartera consolidada',
    descripcion:
      'Obligaciones pendientes y parciales de todos los contratos, con saldo y mora acumulada, incluye fila de totales.',
    icon: 'i-heroicons-banknotes',
    path: '/documentos/reportes/cartera.xlsx',
    archivo: 'reporte-cartera.xlsx',
  },
  {
    clave: 'recaudo',
    titulo: 'Recaudo (recibos de caja)',
    descripcion:
      'Todos los recibos de caja emitidos y anulados (efectivo y transferencias), con arrendatario, inmueble y excedente.',
    icon: 'i-heroicons-currency-dollar',
    path: '/documentos/reportes/recaudo.xlsx',
    archivo: 'reporte-recaudo.xlsx',
  },
  {
    clave: 'barrio',
    titulo: 'Inmuebles por barrio',
    descripcion: 'Portafolio de inmuebles agrupado y ordenado por barrio.',
    icon: 'i-heroicons-building-office-2',
    path: '/documentos/reportes/inmuebles-por-barrio.xlsx',
    archivo: 'reporte-inmuebles-por-barrio.xlsx',
  },
]
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold text-slate-900 mb-4">Reportes</h1>

    <UAlert v-if="error" color="red" variant="subtle" :title="error" class="mb-4" />

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <UCard v-for="r in reportes" :key="r.clave">
        <div class="flex items-start gap-4">
          <div class="p-3 rounded-lg bg-amber-50 text-amber-600">
            <UIcon :name="r.icon" class="w-6 h-6" />
          </div>
          <div class="flex-1">
            <p class="font-semibold text-slate-900">{{ r.titulo }}</p>
            <p class="text-sm text-slate-500 mt-1">{{ r.descripcion }}</p>
            <UButton
              class="mt-3"
              color="amber"
              variant="soft"
              icon="i-heroicons-arrow-down-tray"
              :loading="descargando === r.clave"
              @click="descargar(r.clave, r.path, r.archivo)"
            >
              Exportar a Excel
            </UButton>
          </div>
        </div>
      </UCard>
    </div>

    <p class="text-xs text-slate-400 mt-6">
      Los reportes se generan en el servidor a partir de los datos actuales — el archivo descargado siempre refleja el
      estado más reciente del sistema.
    </p>
  </div>
</template>
