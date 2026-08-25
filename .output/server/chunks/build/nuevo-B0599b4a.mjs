import { n as navigateTo } from '../virtual/entry.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { t as Badge_default } from './Badge-Dji78drx.mjs';
import { t as Alert_default } from './Alert-Bv_RgsgM.mjs';
import { t as FormGroup_default } from './FormGroup-Y-Nkh3aN.mjs';
import { t as Card_default } from './Card-j-DCNf6K.mjs';
import { t as Button_default } from './Button-CoYovqJ9.mjs';
import { t as SelectMenu_default } from './SelectMenu-Bw_jkCZn.mjs';
import { t as Input_default } from './Input-BVUEIOT9.mjs';
import { u as useApiFetch } from './useApiFetch-B8kTc45P.mjs';
import { u as useFormatoCO } from './useFormatoCO-CX_CcnnC.mjs';
import { defineComponent, ref, watch, computed, mergeProps, unref, withCtx, isRef, createTextVNode, openBlock, createBlock, createVNode, withKeys, toDisplayString, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import 'nostics';
import 'nostics/formatters/ansi';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:path';
import '@vue/shared';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@vueuse/core';
import 'tailwind-merge';
import '@iconify/vue';
import './components-CzgPFaUd.mjs';
import '@iconify/utils/lib/css/icon';
import './ui.config-2s_B03nh.mjs';
import './useButtonGroup-OQHG41CY.mjs';
import './Avatar-BOI4zec4.mjs';
import './link-apSRv82-.mjs';
import './button-BNOdwSP_.mjs';
import './Link-CnaKOPmE.mjs';
import './useFormGroup-BLFts8mq.mjs';
import './form-BjTHmaPY.mjs';
import './combobox-C0tFQX7q.mjs';
import './active-element-history-BkxR87qo.mjs';
import './micro-task-Dv1257jF.mjs';
import './keyboard-DE1QlhcY.mjs';
import './focus-management-DXpqooZk.mjs';
import './use-outside-click-E0zCHGRJ.mjs';
import './use-resolve-button-type-DZKnDGM_.mjs';
import './calculate-active-index-CJA4E3gh.mjs';
import './hidden-UkYquSML.mjs';
import './open-closed-Css0b1VQ.mjs';
import '@tanstack/vue-virtual';
import './use-text-value-DhHPSnE-.mjs';
import './usePopper-BCEqNZ_Z.mjs';

//#region pages/contratos/nuevo.vue?vue&type=script&setup=true&lang.ts
var nuevo_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "nuevo",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* Creación de contrato — 100% por búsqueda estricta de IDs ya existentes.
		* No se permite digitar datos de personas aquí: se buscan y seleccionan
		* Cliente, Codeudor(es) e Inmueble ya registrados en sus respectivos directorios.
		*/
		const { moneda } = useFormatoCO();
		const busquedaCliente = ref("");
		const resultadosCliente = ref([]);
		const clienteSeleccionado = ref(null);
		async function buscarCliente() {
			if (!busquedaCliente.value) return;
			resultadosCliente.value = await useApiFetch("/clientes/buscar", { params: {
				documento: busquedaCliente.value,
				nombre: busquedaCliente.value
			} });
		}
		const busquedaCodeudor = ref("");
		const resultadosCodeudor = ref([]);
		const codeudoresSeleccionados = ref([]);
		async function buscarCodeudor() {
			if (!busquedaCodeudor.value) return;
			resultadosCodeudor.value = await useApiFetch("/codeudores/buscar", { params: {
				documento: busquedaCodeudor.value,
				nombre: busquedaCodeudor.value
			} });
		}
		function agregarCodeudor(c) {
			if (!codeudoresSeleccionados.value.find((x) => x.id === c.id)) codeudoresSeleccionados.value.push(c);
			resultadosCodeudor.value = [];
			busquedaCodeudor.value = "";
		}
		function quitarCodeudor(id) {
			codeudoresSeleccionados.value = codeudoresSeleccionados.value.filter((c) => c.id !== id);
		}
		const inmueblesDisponibles = ref([]);
		const inmuebleSeleccionado = ref(null);
		const fechaInicio = ref("");
		const diaPago = ref(null);
		const diaPagoEditadoManualmente = ref(false);
		const depositoCustodia = ref(0);
		watch(fechaInicio, (nuevaFecha) => {
			if (diaPagoEditadoManualmente.value) return;
			diaPago.value = nuevaFecha ? Number(nuevaFecha.slice(8, 10)) : null;
		});
		function marcarDiaPagoManual() {
			diaPagoEditadoManualmente.value = true;
		}
		const creando = ref(false);
		const error = ref("");
		const puedeCrear = computed(() => !!clienteSeleccionado.value && !!inmuebleSeleccionado.value && codeudoresSeleccionados.value.length > 0 && !!fechaInicio.value);
		async function crearContrato() {
			error.value = "";
			creando.value = true;
			try {
				await useApiFetch("/contratos", {
					method: "POST",
					body: {
						clienteId: clienteSeleccionado.value.id,
						codeudorIds: codeudoresSeleccionados.value.map((c) => c.id),
						inmuebleId: inmuebleSeleccionado.value.id,
						fechaInicio: fechaInicio.value,
						diaPago: diaPago.value ?? void 0,
						depositoCustodia: depositoCustodia.value
					}
				});
				await navigateTo(`/contratos`);
			} catch (e) {
				error.value = e?.data?.message || "No fue posible crear el contrato.";
			} finally {
				creando.value = false;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UAlert = Alert_default;
			const _component_UCard = Card_default;
			const _component_UInput = Input_default;
			const _component_UButton = Button_default;
			const _component_UBadge = Badge_default;
			const _component_UIcon = Icon_default;
			const _component_USelectMenu = SelectMenu_default;
			const _component_UFormGroup = FormGroup_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-3xl" }, _attrs))}><h1 class="text-xl font-semibold text-slate-900 mb-4">Nuevo contrato</h1>`);
			if (unref(error)) _push(ssrRenderComponent(_component_UAlert, {
				color: "red",
				variant: "subtle",
				title: unref(error),
				class: "mb-4"
			}, null, _parent));
			else _push(`<!---->`);
			_push(`<div class="space-y-6">`);
			_push(ssrRenderComponent(_component_UCard, null, {
				header: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>1. Arrendatario</p>`);
					else return [createVNode("p", { class: "font-semibold text-slate-900" }, "1. Arrendatario")];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (!unref(clienteSeleccionado)) {
							_push(`<div class="flex gap-2"${_scopeId}>`);
							_push(ssrRenderComponent(_component_UInput, {
								modelValue: unref(busquedaCliente),
								"onUpdate:modelValue": ($event) => isRef(busquedaCliente) ? busquedaCliente.value = $event : null,
								placeholder: "Buscar por cédula o nombre…",
								class: "flex-1",
								onKeyup: buscarCliente
							}, null, _parent, _scopeId));
							_push(ssrRenderComponent(_component_UButton, {
								color: "amber",
								onClick: buscarCliente
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`Buscar`);
									else return [createTextVNode("Buscar")];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</div>`);
						} else {
							_push(`<div class="flex items-center justify-between bg-slate-50 rounded-lg p-3"${_scopeId}><div${_scopeId}><p class="font-medium text-slate-900"${_scopeId}>${ssrInterpolate(unref(clienteSeleccionado).nombreCompleto)}</p><p class="text-xs text-slate-600"${_scopeId}>${ssrInterpolate(unref(clienteSeleccionado).numeroDocumento)}</p></div>`);
							_push(ssrRenderComponent(_component_UButton, {
								size: "xs",
								color: "gray",
								variant: "ghost",
								onClick: ($event) => clienteSeleccionado.value = null
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`Cambiar`);
									else return [createTextVNode("Cambiar")];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</div>`);
						}
						if (unref(resultadosCliente).length) {
							_push(`<div class="mt-3 divide-y border rounded-lg"${_scopeId}><!--[-->`);
							ssrRenderList(unref(resultadosCliente), (c) => {
								_push(`<button class="w-full text-left px-4 py-2 hover:bg-slate-50"${_scopeId}>${ssrInterpolate(c.nombreCompleto)} — ${ssrInterpolate(c.numeroDocumento)}</button>`);
							});
							_push(`<!--]--></div>`);
						} else _push(`<!---->`);
					} else return [!unref(clienteSeleccionado) ? (openBlock(), createBlock("div", {
						key: 0,
						class: "flex gap-2"
					}, [createVNode(_component_UInput, {
						modelValue: unref(busquedaCliente),
						"onUpdate:modelValue": ($event) => isRef(busquedaCliente) ? busquedaCliente.value = $event : null,
						placeholder: "Buscar por cédula o nombre…",
						class: "flex-1",
						onKeyup: withKeys(buscarCliente, ["enter"])
					}, null, 8, ["modelValue", "onUpdate:modelValue"]), createVNode(_component_UButton, {
						color: "amber",
						onClick: buscarCliente
					}, {
						default: withCtx(() => [createTextVNode("Buscar")]),
						_: 1
					})])) : (openBlock(), createBlock("div", {
						key: 1,
						class: "flex items-center justify-between bg-slate-50 rounded-lg p-3"
					}, [createVNode("div", null, [createVNode("p", { class: "font-medium text-slate-900" }, toDisplayString(unref(clienteSeleccionado).nombreCompleto), 1), createVNode("p", { class: "text-xs text-slate-600" }, toDisplayString(unref(clienteSeleccionado).numeroDocumento), 1)]), createVNode(_component_UButton, {
						size: "xs",
						color: "gray",
						variant: "ghost",
						onClick: ($event) => clienteSeleccionado.value = null
					}, {
						default: withCtx(() => [createTextVNode("Cambiar")]),
						_: 1
					}, 8, ["onClick"])])), unref(resultadosCliente).length ? (openBlock(), createBlock("div", {
						key: 2,
						class: "mt-3 divide-y border rounded-lg"
					}, [(openBlock(true), createBlock(Fragment, null, renderList(unref(resultadosCliente), (c) => {
						return openBlock(), createBlock("button", {
							key: c.id,
							class: "w-full text-left px-4 py-2 hover:bg-slate-50",
							onClick: ($event) => {
								clienteSeleccionado.value = c;
								resultadosCliente.value = [];
							}
						}, toDisplayString(c.nombreCompleto) + " — " + toDisplayString(c.numeroDocumento), 9, ["onClick"]);
					}), 128))])) : createCommentVNode("", true)];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UCard, null, {
				header: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>2. Codeudor(es)</p>`);
					else return [createVNode("p", { class: "font-semibold text-slate-900" }, "2. Codeudor(es)")];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="flex gap-2 mb-3"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UInput, {
							modelValue: unref(busquedaCodeudor),
							"onUpdate:modelValue": ($event) => isRef(busquedaCodeudor) ? busquedaCodeudor.value = $event : null,
							placeholder: "Buscar por cédula o nombre…",
							class: "flex-1",
							onKeyup: buscarCodeudor
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_UButton, {
							color: "amber",
							onClick: buscarCodeudor
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Buscar`);
								else return [createTextVNode("Buscar")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div>`);
						if (unref(resultadosCodeudor).length) {
							_push(`<div class="mb-3 divide-y border rounded-lg"${_scopeId}><!--[-->`);
							ssrRenderList(unref(resultadosCodeudor), (c) => {
								_push(`<button class="w-full text-left px-4 py-2 hover:bg-slate-50"${_scopeId}>${ssrInterpolate(c.nombreCompleto)} — ${ssrInterpolate(c.numeroDocumento)}</button>`);
							});
							_push(`<!--]--></div>`);
						} else _push(`<!---->`);
						if (unref(codeudoresSeleccionados).length) {
							_push(`<div class="flex flex-wrap gap-2"${_scopeId}><!--[-->`);
							ssrRenderList(unref(codeudoresSeleccionados), (c) => {
								_push(ssrRenderComponent(_component_UBadge, {
									key: c.id,
									color: "amber",
									variant: "subtle",
									class: "flex items-center gap-1"
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) {
											_push(`${ssrInterpolate(c.nombreCompleto)} `);
											_push(ssrRenderComponent(_component_UIcon, {
												name: "i-heroicons-x-mark",
												class: "cursor-pointer",
												onClick: ($event) => quitarCodeudor(c.id)
											}, null, _parent, _scopeId));
										} else return [createTextVNode(toDisplayString(c.nombreCompleto) + " ", 1), createVNode(_component_UIcon, {
											name: "i-heroicons-x-mark",
											class: "cursor-pointer",
											onClick: ($event) => quitarCodeudor(c.id)
										}, null, 8, ["onClick"])];
									}),
									_: 2
								}, _parent, _scopeId));
							});
							_push(`<!--]--></div>`);
						} else _push(`<p class="text-xs text-slate-600"${_scopeId}>Aún no hay codeudores seleccionados.</p>`);
					} else return [
						createVNode("div", { class: "flex gap-2 mb-3" }, [createVNode(_component_UInput, {
							modelValue: unref(busquedaCodeudor),
							"onUpdate:modelValue": ($event) => isRef(busquedaCodeudor) ? busquedaCodeudor.value = $event : null,
							placeholder: "Buscar por cédula o nombre…",
							class: "flex-1",
							onKeyup: withKeys(buscarCodeudor, ["enter"])
						}, null, 8, ["modelValue", "onUpdate:modelValue"]), createVNode(_component_UButton, {
							color: "amber",
							onClick: buscarCodeudor
						}, {
							default: withCtx(() => [createTextVNode("Buscar")]),
							_: 1
						})]),
						unref(resultadosCodeudor).length ? (openBlock(), createBlock("div", {
							key: 0,
							class: "mb-3 divide-y border rounded-lg"
						}, [(openBlock(true), createBlock(Fragment, null, renderList(unref(resultadosCodeudor), (c) => {
							return openBlock(), createBlock("button", {
								key: c.id,
								class: "w-full text-left px-4 py-2 hover:bg-slate-50",
								onClick: ($event) => agregarCodeudor(c)
							}, toDisplayString(c.nombreCompleto) + " — " + toDisplayString(c.numeroDocumento), 9, ["onClick"]);
						}), 128))])) : createCommentVNode("", true),
						unref(codeudoresSeleccionados).length ? (openBlock(), createBlock("div", {
							key: 1,
							class: "flex flex-wrap gap-2"
						}, [(openBlock(true), createBlock(Fragment, null, renderList(unref(codeudoresSeleccionados), (c) => {
							return openBlock(), createBlock(_component_UBadge, {
								key: c.id,
								color: "amber",
								variant: "subtle",
								class: "flex items-center gap-1"
							}, {
								default: withCtx(() => [createTextVNode(toDisplayString(c.nombreCompleto) + " ", 1), createVNode(_component_UIcon, {
									name: "i-heroicons-x-mark",
									class: "cursor-pointer",
									onClick: ($event) => quitarCodeudor(c.id)
								}, null, 8, ["onClick"])]),
								_: 2
							}, 1024);
						}), 128))])) : (openBlock(), createBlock("p", {
							key: 2,
							class: "text-xs text-slate-600"
						}, "Aún no hay codeudores seleccionados."))
					];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UCard, null, {
				header: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>3. Inmueble disponible</p>`);
					else return [createVNode("p", { class: "font-semibold text-slate-900" }, "3. Inmueble disponible")];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_USelectMenu, {
							modelValue: unref(inmuebleSeleccionado),
							"onUpdate:modelValue": ($event) => isRef(inmuebleSeleccionado) ? inmuebleSeleccionado.value = $event : null,
							options: unref(inmueblesDisponibles),
							"option-attribute": "direccion",
							placeholder: "Selecciona un inmueble disponible"
						}, {
							option: withCtx(({ option }, _push, _parent, _scopeId) => {
								if (_push) _push(`<span${_scopeId}>${ssrInterpolate(option.direccion)} — ${ssrInterpolate(option.barrio)} (${ssrInterpolate(unref(moneda)(option.canonValor))})</span>`);
								else return [createVNode("span", null, toDisplayString(option.direccion) + " — " + toDisplayString(option.barrio) + " (" + toDisplayString(unref(moneda)(option.canonValor)) + ")", 1)];
							}),
							_: 1
						}, _parent, _scopeId));
						if (unref(inmuebleSeleccionado)) {
							_push(`<div class="flex flex-wrap gap-2 mt-3"${_scopeId}>`);
							_push(ssrRenderComponent(_component_UBadge, {
								color: "amber",
								variant: "subtle"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`Energía: ${ssrInterpolate(unref(inmuebleSeleccionado).codigoEnergia || "No registrado")}`);
									else return [createTextVNode("Energía: " + toDisplayString(unref(inmuebleSeleccionado).codigoEnergia || "No registrado"), 1)];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(ssrRenderComponent(_component_UBadge, {
								color: "amber",
								variant: "subtle"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`Agua: ${ssrInterpolate(unref(inmuebleSeleccionado).codigoAgua || "No registrado")}`);
									else return [createTextVNode("Agua: " + toDisplayString(unref(inmuebleSeleccionado).codigoAgua || "No registrado"), 1)];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(ssrRenderComponent(_component_UBadge, {
								color: "amber",
								variant: "subtle"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`Gas: ${ssrInterpolate(unref(inmuebleSeleccionado).codigoGas || "No registrado")}`);
									else return [createTextVNode("Gas: " + toDisplayString(unref(inmuebleSeleccionado).codigoGas || "No registrado"), 1)];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</div>`);
						} else _push(`<!---->`);
					} else return [createVNode(_component_USelectMenu, {
						modelValue: unref(inmuebleSeleccionado),
						"onUpdate:modelValue": ($event) => isRef(inmuebleSeleccionado) ? inmuebleSeleccionado.value = $event : null,
						options: unref(inmueblesDisponibles),
						"option-attribute": "direccion",
						placeholder: "Selecciona un inmueble disponible"
					}, {
						option: withCtx(({ option }) => [createVNode("span", null, toDisplayString(option.direccion) + " — " + toDisplayString(option.barrio) + " (" + toDisplayString(unref(moneda)(option.canonValor)) + ")", 1)]),
						_: 1
					}, 8, [
						"modelValue",
						"onUpdate:modelValue",
						"options"
					]), unref(inmuebleSeleccionado) ? (openBlock(), createBlock("div", {
						key: 0,
						class: "flex flex-wrap gap-2 mt-3"
					}, [
						createVNode(_component_UBadge, {
							color: "amber",
							variant: "subtle"
						}, {
							default: withCtx(() => [createTextVNode("Energía: " + toDisplayString(unref(inmuebleSeleccionado).codigoEnergia || "No registrado"), 1)]),
							_: 1
						}),
						createVNode(_component_UBadge, {
							color: "amber",
							variant: "subtle"
						}, {
							default: withCtx(() => [createTextVNode("Agua: " + toDisplayString(unref(inmuebleSeleccionado).codigoAgua || "No registrado"), 1)]),
							_: 1
						}),
						createVNode(_component_UBadge, {
							color: "amber",
							variant: "subtle"
						}, {
							default: withCtx(() => [createTextVNode("Gas: " + toDisplayString(unref(inmuebleSeleccionado).codigoGas || "No registrado"), 1)]),
							_: 1
						})
					])) : createCommentVNode("", true)];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UCard, null, {
				header: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>4. Datos del contrato</p>`);
					else return [createVNode("p", { class: "font-semibold text-slate-900" }, "4. Datos del contrato")];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid grid-cols-3 gap-4"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UFormGroup, { label: "Fecha de inicio" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_component_UInput, {
									modelValue: unref(fechaInicio),
									"onUpdate:modelValue": ($event) => isRef(fechaInicio) ? fechaInicio.value = $event : null,
									type: "date"
								}, null, _parent, _scopeId));
								else return [createVNode(_component_UInput, {
									modelValue: unref(fechaInicio),
									"onUpdate:modelValue": ($event) => isRef(fechaInicio) ? fechaInicio.value = $event : null,
									type: "date"
								}, null, 8, ["modelValue", "onUpdate:modelValue"])];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(_component_UFormGroup, { label: "Día de pago (1-31)" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(ssrRenderComponent(_component_UInput, {
										modelValue: unref(diaPago),
										"onUpdate:modelValue": ($event) => isRef(diaPago) ? diaPago.value = $event : null,
										modelModifiers: { number: true },
										type: "number",
										min: "1",
										max: "31",
										onInput: marcarDiaPagoManual
									}, null, _parent, _scopeId));
									_push(`<p class="text-xs text-slate-500 mt-1"${_scopeId}> Se toma de la fecha de inicio por defecto; edítalo si el pago es en otro día. </p>`);
								} else return [createVNode(_component_UInput, {
									modelValue: unref(diaPago),
									"onUpdate:modelValue": ($event) => isRef(diaPago) ? diaPago.value = $event : null,
									modelModifiers: { number: true },
									type: "number",
									min: "1",
									max: "31",
									onInput: marcarDiaPagoManual
								}, null, 8, ["modelValue", "onUpdate:modelValue"]), createVNode("p", { class: "text-xs text-slate-500 mt-1" }, " Se toma de la fecha de inicio por defecto; edítalo si el pago es en otro día. ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(_component_UFormGroup, { label: "Depósito en custodia" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_component_UInput, {
									modelValue: unref(depositoCustodia),
									"onUpdate:modelValue": ($event) => isRef(depositoCustodia) ? depositoCustodia.value = $event : null,
									modelModifiers: { number: true },
									type: "number"
								}, null, _parent, _scopeId));
								else return [createVNode(_component_UInput, {
									modelValue: unref(depositoCustodia),
									"onUpdate:modelValue": ($event) => isRef(depositoCustodia) ? depositoCustodia.value = $event : null,
									modelModifiers: { number: true },
									type: "number"
								}, null, 8, ["modelValue", "onUpdate:modelValue"])];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div><p class="text-xs text-slate-600 mt-2"${_scopeId}> La fecha de fin queda en blanco: solo se define al terminar el contrato. </p>`);
					} else return [createVNode("div", { class: "grid grid-cols-3 gap-4" }, [
						createVNode(_component_UFormGroup, { label: "Fecha de inicio" }, {
							default: withCtx(() => [createVNode(_component_UInput, {
								modelValue: unref(fechaInicio),
								"onUpdate:modelValue": ($event) => isRef(fechaInicio) ? fechaInicio.value = $event : null,
								type: "date"
							}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
							_: 1
						}),
						createVNode(_component_UFormGroup, { label: "Día de pago (1-31)" }, {
							default: withCtx(() => [createVNode(_component_UInput, {
								modelValue: unref(diaPago),
								"onUpdate:modelValue": ($event) => isRef(diaPago) ? diaPago.value = $event : null,
								modelModifiers: { number: true },
								type: "number",
								min: "1",
								max: "31",
								onInput: marcarDiaPagoManual
							}, null, 8, ["modelValue", "onUpdate:modelValue"]), createVNode("p", { class: "text-xs text-slate-500 mt-1" }, " Se toma de la fecha de inicio por defecto; edítalo si el pago es en otro día. ")]),
							_: 1
						}),
						createVNode(_component_UFormGroup, { label: "Depósito en custodia" }, {
							default: withCtx(() => [createVNode(_component_UInput, {
								modelValue: unref(depositoCustodia),
								"onUpdate:modelValue": ($event) => isRef(depositoCustodia) ? depositoCustodia.value = $event : null,
								modelModifiers: { number: true },
								type: "number"
							}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
							_: 1
						})
					]), createVNode("p", { class: "text-xs text-slate-600 mt-2" }, " La fecha de fin queda en blanco: solo se define al terminar el contrato. ")];
				}),
				_: 1
			}, _parent));
			_push(`<div class="flex justify-end">`);
			_push(ssrRenderComponent(_component_UButton, {
				color: "amber",
				size: "lg",
				disabled: !unref(puedeCrear),
				loading: unref(creando),
				onClick: crearContrato
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Crear contrato `);
					else return [createTextVNode(" Crear contrato ")];
				}),
				_: 1
			}, _parent));
			_push(`</div></div></div>`);
		};
	}
});
//#endregion
//#region pages/contratos/nuevo.vue
var _sfc_setup = nuevo_vue_vue_type_script_setup_true_lang_default.setup;
nuevo_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contratos/nuevo.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var nuevo_default = nuevo_vue_vue_type_script_setup_true_lang_default;

export { nuevo_default as default };
//# sourceMappingURL=nuevo-B0599b4a.mjs.map
