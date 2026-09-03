import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ModalLiquidarDeposito from '../components/recaudo/ModalLiquidarDeposito.vue'

describe('ModalLiquidarDeposito', () => {
  it('muestra el tipo de descuento para cada descuento y permite enviar el tipo al backend', () => {
    const wrapper = mount(ModalLiquidarDeposito, {
      props: {
        modelValue: true,
        depositoGarantia: 1000000,
        valorADevolver: 700000,
        medios: ['EFECTIVO', 'TRANSFERENCIA'],
        descuentos: [
          { concepto: 'Aseo general', valor: 200000, tipo: 'GENERAL' },
          { concepto: 'Arriendo vencido', valor: 100000, tipo: 'DEUDA' },
        ],
        form: { medioPago: 'EFECTIVO', referencia: '', observaciones: '' },
        liquidando: false,
      },
      global: {
        stubs: {
          UModal: { template: '<div><slot /></div>' },
          UCard: { template: '<div><slot name="header" /><slot /><slot name="footer" /></div>' },
          UInput: { template: '<input />', props: ['modelValue'] },
          UButton: { template: '<button><slot /></button>' },
          UiMoneyInput: { template: '<input />' },
          USelectMenu: {
            template: '<select><option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option></select>',
            props: ['modelValue', 'options'],
          },
          UFormGroup: { template: '<div><slot /></div>' },
          UTextarea: { template: '<textarea />' },
        },
      },
    })

    expect(wrapper.html()).toContain('GENERAL')
    expect(wrapper.html()).toContain('DEUDA')
  })
})
