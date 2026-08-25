import { n as navigateTo } from '../virtual/entry.mjs';
import { t as Alert_default } from './Alert-Bv_RgsgM.mjs';
import { t as FormGroup_default } from './FormGroup-Y-Nkh3aN.mjs';
import { t as Card_default } from './Card-j-DCNf6K.mjs';
import { t as Button_default } from './Button-CoYovqJ9.mjs';
import { t as SelectMenu_default } from './SelectMenu-Bw_jkCZn.mjs';
import { t as Input_default } from './Input-BVUEIOT9.mjs';
import { t as Textarea_default } from './Textarea-E1R2aU6E.mjs';
import { u as useApiFetch } from './useApiFetch-B8kTc45P.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, isRef, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, withKeys, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
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
import './Icon-DzlsKOwd.mjs';
import './components-CzgPFaUd.mjs';
import '@iconify/utils/lib/css/icon';
import './ui.config-2s_B03nh.mjs';
import './Avatar-BOI4zec4.mjs';
import './link-apSRv82-.mjs';
import './useButtonGroup-OQHG41CY.mjs';
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

//#region pages/novedades/nueva.vue?vue&type=script&setup=true&lang.ts
var nueva_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "nueva",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* Registro rápido de novedad — disponible para Recepcionista y Administrador.
		* Sin ningún dato financiero: solo descripción, fecha, responsable sugerido
		* e inmueble/contrato relacionado.
		*/
		const busquedaInmueble = ref("");
		const resultadosInmueble = ref([]);
		const inmuebleSeleccionado = ref(null);
		const contratosDelInmueble = ref([]);
		const contratoSeleccionado = ref(null);
		const descripcion = ref("");
		const fecha = ref((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
		const observaciones = ref("");
		const responsableSugerido = ref("INMOBILIARIA");
		const guardando = ref(false);
		const error = ref("");
		async function buscarInmueble() {
			if (!busquedaInmueble.value) return;
			error.value = "";
			try {
				const data = await useApiFetch("/inmuebles", { params: {
					busqueda: busquedaInmueble.value,
					limit: 5
				} });
				resultadosInmueble.value = data.data;
			} catch (e) {
				error.value = e?.data?.message || "No fue posible buscar el inmueble.";
			}
		}
		async function seleccionarInmueble(inmueble) {
			inmuebleSeleccionado.value = inmueble;
			resultadosInmueble.value = [];
			error.value = "";
			try {
				const data = await useApiFetch("/contratos", { params: { inmuebleId: inmueble.id } });
				contratosDelInmueble.value = data.data;
			} catch (e) {
				error.value = e?.data?.message || "No fue posible cargar los contratos del inmueble.";
			}
		}
		const puedeGuardar = computed(() => !!inmuebleSeleccionado.value && !!descripcion.value && !!fecha.value);
		async function guardar() {
			error.value = "";
			guardando.value = true;
			try {
				await useApiFetch("/novedades", {
					method: "POST",
					body: {
						inmuebleId: inmuebleSeleccionado.value.id,
						contratoId: contratoSeleccionado.value?.id,
						descripcion: descripcion.value,
						fecha: fecha.value,
						observaciones: observaciones.value,
						responsableSugerido: responsableSugerido.value
					}
				});
				await navigateTo("/novedades");
			} catch (e) {
				error.value = e?.data?.message || "No fue posible registrar la novedad.";
			} finally {
				guardando.value = false;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UAlert = Alert_default;
			const _component_UCard = Card_default;
			const _component_UInput = Input_default;
			const _component_UButton = Button_default;
			const _component_UFormGroup = FormGroup_default;
			const _component_USelectMenu = SelectMenu_default;
			const _component_UTextarea = Textarea_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-2xl" }, _attrs))}><h1 class="text-xl font-semibold text-slate-900 mb-4">Registrar novedad</h1>`);
			if (unref(error)) _push(ssrRenderComponent(_component_UAlert, {
				color: "red",
				variant: "subtle",
				title: unref(error),
				class: "mb-4"
			}, null, _parent));
			else _push(`<!---->`);
			_push(ssrRenderComponent(_component_UCard, null, {
				footer: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="flex justify-end"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UButton, {
							color: "amber",
							disabled: !unref(puedeGuardar),
							loading: unref(guardando),
							onClick: guardar
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Registrar novedad `);
								else return [createTextVNode(" Registrar novedad ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "flex justify-end" }, [createVNode(_component_UButton, {
						color: "amber",
						disabled: !unref(puedeGuardar),
						loading: unref(guardando),
						onClick: guardar
					}, {
						default: withCtx(() => [createTextVNode(" Registrar novedad ")]),
						_: 1
					}, 8, ["disabled", "loading"])])];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="space-y-4"${_scopeId}><div${_scopeId}><p class="text-sm font-medium text-slate-700 mb-1"${_scopeId}>Inmueble</p>`);
						if (!unref(inmuebleSeleccionado)) {
							_push(`<div class="flex gap-2"${_scopeId}>`);
							_push(ssrRenderComponent(_component_UInput, {
								modelValue: unref(busquedaInmueble),
								"onUpdate:modelValue": ($event) => isRef(busquedaInmueble) ? busquedaInmueble.value = $event : null,
								placeholder: "Buscar por dirección o barrio…",
								class: "flex-1",
								onKeyup: buscarInmueble
							}, null, _parent, _scopeId));
							_push(ssrRenderComponent(_component_UButton, {
								color: "amber",
								onClick: buscarInmueble
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`Buscar`);
									else return [createTextVNode("Buscar")];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</div>`);
						} else {
							_push(`<div class="flex items-center justify-between bg-slate-50 rounded-lg p-3"${_scopeId}><div${_scopeId}><p class="font-medium text-slate-900"${_scopeId}>${ssrInterpolate(unref(inmuebleSeleccionado).direccion)}</p><p class="text-xs text-slate-500"${_scopeId}>${ssrInterpolate(unref(inmuebleSeleccionado).barrio)}</p></div>`);
							_push(ssrRenderComponent(_component_UButton, {
								size: "xs",
								color: "gray",
								variant: "ghost",
								onClick: ($event) => {
									inmuebleSeleccionado.value = null;
									contratoSeleccionado.value = null;
								}
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`Cambiar`);
									else return [createTextVNode("Cambiar")];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</div>`);
						}
						if (unref(resultadosInmueble).length) {
							_push(`<div class="mt-2 divide-y border rounded-lg"${_scopeId}><!--[-->`);
							ssrRenderList(unref(resultadosInmueble), (i) => {
								_push(`<button class="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm"${_scopeId}>${ssrInterpolate(i.direccion)} — ${ssrInterpolate(i.barrio)}</button>`);
							});
							_push(`<!--]--></div>`);
						} else _push(`<!---->`);
						_push(`</div>`);
						if (unref(contratosDelInmueble).length) _push(ssrRenderComponent(_component_UFormGroup, { label: "Contrato relacionado (opcional)" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_component_USelectMenu, {
									modelValue: unref(contratoSeleccionado),
									"onUpdate:modelValue": ($event) => isRef(contratoSeleccionado) ? contratoSeleccionado.value = $event : null,
									options: unref(contratosDelInmueble),
									"option-attribute": "id",
									placeholder: "Sin contrato específico"
								}, {
									option: withCtx(({ option }, _push, _parent, _scopeId) => {
										if (_push) _push(`${ssrInterpolate(option.cliente?.nombreCompleto)}`);
										else return [createTextVNode(toDisplayString(option.cliente?.nombreCompleto), 1)];
									}),
									_: 1
								}, _parent, _scopeId));
								else return [createVNode(_component_USelectMenu, {
									modelValue: unref(contratoSeleccionado),
									"onUpdate:modelValue": ($event) => isRef(contratoSeleccionado) ? contratoSeleccionado.value = $event : null,
									options: unref(contratosDelInmueble),
									"option-attribute": "id",
									placeholder: "Sin contrato específico"
								}, {
									option: withCtx(({ option }) => [createTextVNode(toDisplayString(option.cliente?.nombreCompleto), 1)]),
									_: 1
								}, 8, [
									"modelValue",
									"onUpdate:modelValue",
									"options"
								])];
							}),
							_: 1
						}, _parent, _scopeId));
						else _push(`<!---->`);
						_push(ssrRenderComponent(_component_UFormGroup, { label: "Descripción del incidente" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_component_UTextarea, {
									modelValue: unref(descripcion),
									"onUpdate:modelValue": ($event) => isRef(descripcion) ? descripcion.value = $event : null,
									placeholder: "Describe la novedad observada…"
								}, null, _parent, _scopeId));
								else return [createVNode(_component_UTextarea, {
									modelValue: unref(descripcion),
									"onUpdate:modelValue": ($event) => isRef(descripcion) ? descripcion.value = $event : null,
									placeholder: "Describe la novedad observada…"
								}, null, 8, ["modelValue", "onUpdate:modelValue"])];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`<div class="grid grid-cols-2 gap-4"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UFormGroup, { label: "Fecha" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_component_UInput, {
									modelValue: unref(fecha),
									"onUpdate:modelValue": ($event) => isRef(fecha) ? fecha.value = $event : null,
									type: "date"
								}, null, _parent, _scopeId));
								else return [createVNode(_component_UInput, {
									modelValue: unref(fecha),
									"onUpdate:modelValue": ($event) => isRef(fecha) ? fecha.value = $event : null,
									type: "date"
								}, null, 8, ["modelValue", "onUpdate:modelValue"])];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(_component_UFormGroup, { label: "Responsable sugerido" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_component_USelectMenu, {
									modelValue: unref(responsableSugerido),
									"onUpdate:modelValue": ($event) => isRef(responsableSugerido) ? responsableSugerido.value = $event : null,
									options: ["INMOBILIARIA", "ARRENDATARIO"]
								}, null, _parent, _scopeId));
								else return [createVNode(_component_USelectMenu, {
									modelValue: unref(responsableSugerido),
									"onUpdate:modelValue": ($event) => isRef(responsableSugerido) ? responsableSugerido.value = $event : null,
									options: ["INMOBILIARIA", "ARRENDATARIO"]
								}, null, 8, ["modelValue", "onUpdate:modelValue"])];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div>`);
						_push(ssrRenderComponent(_component_UFormGroup, { label: "Observaciones (opcional)" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_component_UTextarea, {
									modelValue: unref(observaciones),
									"onUpdate:modelValue": ($event) => isRef(observaciones) ? observaciones.value = $event : null
								}, null, _parent, _scopeId));
								else return [createVNode(_component_UTextarea, {
									modelValue: unref(observaciones),
									"onUpdate:modelValue": ($event) => isRef(observaciones) ? observaciones.value = $event : null
								}, null, 8, ["modelValue", "onUpdate:modelValue"])];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`<p class="text-xs text-slate-400"${_scopeId}> Este registro NO genera ningún impacto financiero. Solo el Administrador puede aprobar el cargo al arrendatario o el gasto de la inmobiliaria desde el tablero de novedades. </p></div>`);
					} else return [createVNode("div", { class: "space-y-4" }, [
						createVNode("div", null, [
							createVNode("p", { class: "text-sm font-medium text-slate-700 mb-1" }, "Inmueble"),
							!unref(inmuebleSeleccionado) ? (openBlock(), createBlock("div", {
								key: 0,
								class: "flex gap-2"
							}, [createVNode(_component_UInput, {
								modelValue: unref(busquedaInmueble),
								"onUpdate:modelValue": ($event) => isRef(busquedaInmueble) ? busquedaInmueble.value = $event : null,
								placeholder: "Buscar por dirección o barrio…",
								class: "flex-1",
								onKeyup: withKeys(buscarInmueble, ["enter"])
							}, null, 8, ["modelValue", "onUpdate:modelValue"]), createVNode(_component_UButton, {
								color: "amber",
								onClick: buscarInmueble
							}, {
								default: withCtx(() => [createTextVNode("Buscar")]),
								_: 1
							})])) : (openBlock(), createBlock("div", {
								key: 1,
								class: "flex items-center justify-between bg-slate-50 rounded-lg p-3"
							}, [createVNode("div", null, [createVNode("p", { class: "font-medium text-slate-900" }, toDisplayString(unref(inmuebleSeleccionado).direccion), 1), createVNode("p", { class: "text-xs text-slate-500" }, toDisplayString(unref(inmuebleSeleccionado).barrio), 1)]), createVNode(_component_UButton, {
								size: "xs",
								color: "gray",
								variant: "ghost",
								onClick: ($event) => {
									inmuebleSeleccionado.value = null;
									contratoSeleccionado.value = null;
								}
							}, {
								default: withCtx(() => [createTextVNode("Cambiar")]),
								_: 1
							}, 8, ["onClick"])])),
							unref(resultadosInmueble).length ? (openBlock(), createBlock("div", {
								key: 2,
								class: "mt-2 divide-y border rounded-lg"
							}, [(openBlock(true), createBlock(Fragment, null, renderList(unref(resultadosInmueble), (i) => {
								return openBlock(), createBlock("button", {
									key: i.id,
									class: "w-full text-left px-4 py-2 hover:bg-slate-50 text-sm",
									onClick: ($event) => seleccionarInmueble(i)
								}, toDisplayString(i.direccion) + " — " + toDisplayString(i.barrio), 9, ["onClick"]);
							}), 128))])) : createCommentVNode("", true)
						]),
						unref(contratosDelInmueble).length ? (openBlock(), createBlock(_component_UFormGroup, {
							key: 0,
							label: "Contrato relacionado (opcional)"
						}, {
							default: withCtx(() => [createVNode(_component_USelectMenu, {
								modelValue: unref(contratoSeleccionado),
								"onUpdate:modelValue": ($event) => isRef(contratoSeleccionado) ? contratoSeleccionado.value = $event : null,
								options: unref(contratosDelInmueble),
								"option-attribute": "id",
								placeholder: "Sin contrato específico"
							}, {
								option: withCtx(({ option }) => [createTextVNode(toDisplayString(option.cliente?.nombreCompleto), 1)]),
								_: 1
							}, 8, [
								"modelValue",
								"onUpdate:modelValue",
								"options"
							])]),
							_: 1
						})) : createCommentVNode("", true),
						createVNode(_component_UFormGroup, { label: "Descripción del incidente" }, {
							default: withCtx(() => [createVNode(_component_UTextarea, {
								modelValue: unref(descripcion),
								"onUpdate:modelValue": ($event) => isRef(descripcion) ? descripcion.value = $event : null,
								placeholder: "Describe la novedad observada…"
							}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
							_: 1
						}),
						createVNode("div", { class: "grid grid-cols-2 gap-4" }, [createVNode(_component_UFormGroup, { label: "Fecha" }, {
							default: withCtx(() => [createVNode(_component_UInput, {
								modelValue: unref(fecha),
								"onUpdate:modelValue": ($event) => isRef(fecha) ? fecha.value = $event : null,
								type: "date"
							}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
							_: 1
						}), createVNode(_component_UFormGroup, { label: "Responsable sugerido" }, {
							default: withCtx(() => [createVNode(_component_USelectMenu, {
								modelValue: unref(responsableSugerido),
								"onUpdate:modelValue": ($event) => isRef(responsableSugerido) ? responsableSugerido.value = $event : null,
								options: ["INMOBILIARIA", "ARRENDATARIO"]
							}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
							_: 1
						})]),
						createVNode(_component_UFormGroup, { label: "Observaciones (opcional)" }, {
							default: withCtx(() => [createVNode(_component_UTextarea, {
								modelValue: unref(observaciones),
								"onUpdate:modelValue": ($event) => isRef(observaciones) ? observaciones.value = $event : null
							}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
							_: 1
						}),
						createVNode("p", { class: "text-xs text-slate-400" }, " Este registro NO genera ningún impacto financiero. Solo el Administrador puede aprobar el cargo al arrendatario o el gasto de la inmobiliaria desde el tablero de novedades. ")
					])];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region pages/novedades/nueva.vue
var _sfc_setup = nueva_vue_vue_type_script_setup_true_lang_default.setup;
nueva_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/novedades/nueva.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var nueva_default = nueva_vue_vue_type_script_setup_true_lang_default;

export { nueva_default as default };
//# sourceMappingURL=nueva-DYltUc62.mjs.map
