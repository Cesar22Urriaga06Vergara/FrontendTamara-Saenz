export interface Persona {
  id: string
  numeroDocumento: string
  tipoDocumento: string
  nombreCompleto: string
  email?: string
  telefono?: string
  direccion?: string
  activo: boolean
}

/**
 * Centraliza el CRUD de directorio (listar/buscar/crear/editar/dar de baja/reactivar) que
 * Clientes y Codeudores repetían de forma casi idéntica (misma forma de datos, mismos
 * endpoints salvo el recurso) — refleja en el frontend la misma unificación ya hecha en el
 * backend vía `PersonasControllerBase`/`PersonasServiceBase`.
 */
export function usePersonasDirectorio(recurso: 'clientes' | 'codeudores', etiqueta: string) {
  const { filtros, page, limit, total, lista, cargando, error, cargar } = useListadoPaginado<
    Persona,
    { busqueda: string }
  >(
    async ({ page, limit, filtros }) => {
      if (filtros.busqueda) {
        // Búsqueda por texto: hasta 20 resultados, sin paginación de servidor.
        const data = await useApiFetch<Persona[]>(`/${recurso}/buscar`, {
          params: { documento: filtros.busqueda, nombre: filtros.busqueda },
        })
        return { data, total: data.length }
      }
      // Sin búsqueda activa: directorio completo, paginado en servidor.
      const data = await useApiFetch<{ data: Persona[]; total: number }>(`/${recurso}`, { params: { page, limit } })
      return data
    },
    { filtrosIniciales: { busqueda: '' }, mensajeError: `No fue posible cargar los ${etiqueta}s.` },
  )

  const modalAbierto = ref(false)
  const editando = ref<Persona | null>(null)
  const formulario = reactive({
    numeroDocumento: '',
    tipoDocumento: 'CC',
    nombreCompleto: '',
    email: '',
    telefono: '',
    direccion: '',
  })
  const guardando = ref(false)

  function resetearFormulario() {
    Object.assign(formulario, {
      numeroDocumento: '',
      tipoDocumento: 'CC',
      nombreCompleto: '',
      email: '',
      telefono: '',
      direccion: '',
    })
  }

  function abrirCreacion() {
    editando.value = null
    resetearFormulario()
    modalAbierto.value = true
  }

  function abrirEdicion(persona: Persona) {
    editando.value = persona
    Object.assign(formulario, {
      numeroDocumento: persona.numeroDocumento,
      tipoDocumento: persona.tipoDocumento,
      nombreCompleto: persona.nombreCompleto,
      email: persona.email,
      telefono: persona.telefono,
      direccion: persona.direccion,
    })
    modalAbierto.value = true
  }

  async function guardar() {
    error.value = ''
    guardando.value = true
    try {
      // Los campos opcionales vacíos van como `undefined`, no como `''`: el backend valida
      // `@IsEmail` sobre `email` y un `''` rechazaría toda la petición (D2).
      const payload = {
        numeroDocumento: formulario.numeroDocumento.trim(),
        tipoDocumento: formulario.tipoDocumento,
        nombreCompleto: formulario.nombreCompleto.trim(),
        email: formulario.email?.trim() || undefined,
        telefono: formulario.telefono?.trim() || undefined,
        direccion: formulario.direccion?.trim() || undefined,
      }
      if (editando.value) {
        await useApiFetch(`/${recurso}/${editando.value.id}`, { method: 'PATCH', body: payload })
      } else {
        await useApiFetch(`/${recurso}`, { method: 'POST', body: payload })
      }
      modalAbierto.value = false
      resetearFormulario()
      await cargar()
    } catch (e: any) {
      error.value = e?.data?.message || `No fue posible guardar el ${etiqueta}.`
    } finally {
      guardando.value = false
    }
  }

  const modalBajaAbierto = ref(false)
  const procesandoBaja = ref(false)
  const paraBaja = ref<Persona | null>(null)

  function confirmarBaja(persona: Persona) {
    paraBaja.value = persona
    modalBajaAbierto.value = true
  }

  async function ejecutarBaja() {
    if (!paraBaja.value) return
    error.value = ''
    procesandoBaja.value = true
    try {
      await useApiFetch(`/${recurso}/${paraBaja.value.id}`, { method: 'PATCH', body: { activo: false } })
      modalBajaAbierto.value = false
      await cargar()
    } catch (e: any) {
      error.value = e?.data?.message || `No fue posible dar de baja al ${etiqueta}.`
    } finally {
      procesandoBaja.value = false
    }
  }

  const reactivando = ref(false)

  async function alternarActivo(persona: Persona) {
    error.value = ''
    reactivando.value = true
    try {
      await useApiFetch(`/${recurso}/${persona.id}`, { method: 'PATCH', body: { activo: true } })
      await cargar()
    } catch (e: any) {
      error.value = e?.data?.message || `No fue posible reactivar al ${etiqueta}.`
    } finally {
      reactivando.value = false
    }
  }

  const formularioValido = computed(
    () =>
      formulario.numeroDocumento.trim().length > 0 &&
      formulario.nombreCompleto.trim().length > 0 &&
      (!formulario.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email)),
  )

  return {
    filtros,
    page,
    limit,
    total,
    lista,
    cargando,
    error,
    cargar,
    modalAbierto,
    editando,
    formulario,
    guardando,
    guardar,
    abrirCreacion,
    abrirEdicion,
    formularioValido,
    modalBajaAbierto,
    procesandoBaja,
    paraBaja,
    confirmarBaja,
    ejecutarBaja,
    alternarActivo,
    reactivando,
  }
}
