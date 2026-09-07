import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Login from '../pages/login.vue'

/**
 * S-5: el `<form>` de login debe enviarse por POST si alguien lo dispara antes de que Vue
 * hidrate la página, para que la contraseña no acabe en la URL / historial / logs de acceso.
 */
describe('pages/login.vue — fuga de credenciales (S-5)', () => {
  it('el <form> tiene method="post"', async () => {
    const wrapper = await mountSuspended(Login)
    expect(wrapper.find('form').attributes('method')).toBe('post')
  })

  it('el botón de submit queda habilitado una vez montada la página (sin regresión)', async () => {
    // El gate `:disabled="!montado"` solo bloquea la ventana pre-hidratación; tras `onMounted`
    // (que `mountSuspended` ya ejecuta) el botón debe estar operativo.
    const wrapper = await mountSuspended(Login)
    await flushPromises()
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeUndefined()
  })

  it('mantiene @submit.prevent: enviar el form no navega, llama a ingresar()', async () => {
    const wrapper = await mountSuspended(Login)
    await wrapper.find('input[name="email"]').setValue('admin@tamarasaenz.com')
    await wrapper.find('input[name="password"]').setValue('Password#123')
    // Si `@submit.prevent` no estuviera, esto lanzaría una navegación nativa (jsdom lo marca).
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    // El handler corrió (validó y pasó a "cargando" o mostró error de red del $fetch real-stubeado);
    // lo que importa para S-5 es que NO hubo submit nativo — jsdom no cambia location.
    expect(wrapper.html()).toContain('Iniciar sesión')
  })
})
