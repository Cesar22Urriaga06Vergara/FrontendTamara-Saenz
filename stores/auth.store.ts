import { defineStore } from 'pinia'

interface UsuarioSesion {
  id: string
  email: string
  rol: 'ADMINISTRADOR' | 'RECEPCIONISTA'
}

interface LoginResponse {
  accessToken: string
  refreshToken: string
  usuario: UsuarioSesion
}

type RefreshResponse = LoginResponse

/**
 * Store de autenticación y RBAC en frontend.
 * Persiste tokens en memoria + localStorage (solo claves no sensibles del perfil).
 * NUNCA persiste la contraseña; el refreshToken se guarda para renovar la sesión.
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: '' as string,
    refreshToken: '' as string,
    usuario: null as UsuarioSesion | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    rol: (state) => state.usuario?.rol ?? null,
    esAdministrador: (state) => state.usuario?.rol === 'ADMINISTRADOR',
    esRecepcionista: (state) => state.usuario?.rol === 'RECEPCIONISTA',
  },

  actions: {
    async iniciarSesion(email: string, password: string) {
      const config = useRuntimeConfig()
      const data = await $fetch<LoginResponse>('/auth/login', {
        baseURL: config.public.apiBaseUrl,
        method: 'POST',
        body: { email, password },
      })
      this.accessToken = data.accessToken
      this.refreshToken = data.refreshToken
      this.usuario = data.usuario
      this.persistir()
    },

    async refrescarSesion(): Promise<boolean> {
      try {
        const config = useRuntimeConfig()
        const data = await $fetch<RefreshResponse>('/auth/refresh', {
          baseURL: config.public.apiBaseUrl,
          method: 'POST',
          body: { refreshToken: this.refreshToken },
        })
        this.accessToken = data.accessToken
        this.refreshToken = data.refreshToken
        this.usuario = data.usuario
        this.persistir()
        return true
      } catch {
        return false
      }
    },

    async cerrarSesion() {
      // Revoca el refresh token en backend antes de limpiar el estado local (AUD-012):
      // si no se hace, un refresh token robado/persistido sigue siendo válido hasta su
      // expiración natural aunque el usuario ya haya cerrado sesión en este navegador.
      if (this.refreshToken) {
        try {
          const config = useRuntimeConfig()
          await $fetch('/auth/logout', {
            baseURL: config.public.apiBaseUrl,
            method: 'POST',
            headers: this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {},
            body: { refreshToken: this.refreshToken },
          })
        } catch {
          // Best-effort: si la revocación en backend falla (red, token ya inválido, etc.)
          // la sesión local se limpia igual para no dejar al usuario atrapado.
        }
      }
      this.accessToken = ''
      this.refreshToken = ''
      this.usuario = null
      if (import.meta.client) localStorage.removeItem('tamara_saenz_sesion')
    },

    persistir() {
      if (import.meta.client) {
        localStorage.setItem(
          'tamara_saenz_sesion',
          JSON.stringify({ accessToken: this.accessToken, refreshToken: this.refreshToken, usuario: this.usuario }),
        )
      }
    },

    restaurar() {
      if (import.meta.client) {
        const raw = localStorage.getItem('tamara_saenz_sesion')
        if (raw) {
          const data = JSON.parse(raw) as Partial<LoginResponse>
          this.accessToken = data.accessToken ?? ''
          this.refreshToken = data.refreshToken ?? ''
          this.usuario = data.usuario ?? null
        }
      }
    },
  },
})
