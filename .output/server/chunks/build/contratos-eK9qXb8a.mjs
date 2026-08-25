import { a as useAuthStore } from '../virtual/entry.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { t as Table_default } from './Table-BjAsSJoi.mjs';
import { t as Badge_default } from './Badge-Dji78drx.mjs';
import { t as Alert_default } from './Alert-Bv_RgsgM.mjs';
import { t as FormGroup_default } from './FormGroup-Y-Nkh3aN.mjs';
import { t as Card_default } from './Card-j-DCNf6K.mjs';
import { t as Pagination_default } from './Pagination-CVW3oGYj.mjs';
import { t as Modal_default } from './Modal-B8wn1zi5.mjs';
import { t as Button_default } from './Button-CoYovqJ9.mjs';
import { t as SelectMenu_default } from './SelectMenu-Bw_jkCZn.mjs';
import { t as Input_default } from './Input-BVUEIOT9.mjs';
import { t as Textarea_default } from './Textarea-E1R2aU6E.mjs';
import { u as useApiFetch } from './useApiFetch-B8kTc45P.mjs';
import { u as useFormatoCO } from './useFormatoCO-CX_CcnnC.mjs';
import { defineComponent, ref, reactive, watch, withCtx, createTextVNode, unref, createVNode, openBlock, createBlock, createCommentVNode, toDisplayString, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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
import './Progress-DTxdHI_T.mjs';
import './Checkbox-IBRiz-C1.mjs';
import './useFormGroup-BLFts8mq.mjs';
import './useButtonGroup-OQHG41CY.mjs';
import './Avatar-BOI4zec4.mjs';
import './button-BNOdwSP_.mjs';
import './keyboard-DE1QlhcY.mjs';
import './transition-e-5g9u5m.mjs';
import './micro-task-Dv1257jF.mjs';
import './active-element-history-BkxR87qo.mjs';
import './focus-management-DXpqooZk.mjs';
import './use-outside-click-E0zCHGRJ.mjs';
import './hidden-UkYquSML.mjs';
import './open-closed-Css0b1VQ.mjs';
import './portal-BOf15iST.mjs';
import './description-xz0pTumQ.mjs';
import './link-apSRv82-.mjs';
import './Link-CnaKOPmE.mjs';
import './form-BjTHmaPY.mjs';
import './combobox-C0tFQX7q.mjs';
import './use-resolve-button-type-DZKnDGM_.mjs';
import './calculate-active-index-CJA4E3gh.mjs';
import '@tanstack/vue-virtual';
import './use-text-value-DhHPSnE-.mjs';
import './usePopper-BCEqNZ_Z.mjs';

//#region pages/contratos/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const auth = useAuthStore();
		const { fecha } = useFormatoCO();
		const cargando = ref(true);
		const contratos = ref([]);
		const barrios = ref([]);
		const total = ref(0);
		const page = ref(1);
		const limit = ref(10);
		const error = ref("");
		const filtros = reactive({
			busqueda: "",
			barrio: "",
			fechaDesde: "",
			fechaHasta: "",
			estado: ""
		});
		const columnas = [
			{
				key: "cliente",
				label: "Arrendatario"
			},
			{
				key: "inmueble",
				label: "Inmueble / Barrio"
			},
			{
				key: "fechaInicio",
				label: "Fecha inicio"
			},
			{
				key: "estado",
				label: "Estado"
			},
			{
				key: "acciones",
				label: ""
			}
		];
		const estadoColor = {
			ACTIVO: "emerald",
			TERMINADO: "gray"
		};
		async function cargar() {
			cargando.value = true;
			try {
				const data = await useApiFetch("/contratos", { params: {
					...filtros,
					page: page.value,
					limit: limit.value
				} });
				contratos.value = data.data;
				total.value = data.total;
				error.value = "";
			} catch (e) {
				error.value = e?.data?.message || "No fue posible cargar los contratos.";
			} finally {
				cargando.value = false;
			}
		}
		const modalTerminar = ref(false);
		const contratoTerminando = ref(null);
		const formTerminar = reactive({
			fechaFin: "",
			motivoTerminacion: ""
		});
		const terminando = ref(false);
		function abrirTerminar(row) {
			error.value = "";
			contratoTerminando.value = row;
			formTerminar.fechaFin = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			formTerminar.motivoTerminacion = "";
			modalTerminar.value = true;
		}
		async function confirmarTerminar() {
			if (!contratoTerminando.value) return;
			terminando.value = true;
			try {
				await useApiFetch(`/contratos/${contratoTerminando.value.id}/terminar`, {
					method: "PATCH",
					body: {
						fechaFin: formTerminar.fechaFin,
						motivoTerminacion: formTerminar.motivoTerminacion
					}
				});
				modalTerminar.value = false;
				await cargar();
			} catch (e) {
				error.value = e?.data?.message || "No fue posible terminar el contrato.";
			} finally {
				terminando.value = false;
			}
		}
		const modalReactivar = ref(false);
		const contratoReactivando = ref(null);
		const formReactivar = reactive({ motivo: "" });
		const reactivando = ref(false);
		function abrirReactivar(row) {
			error.value = "";
			contratoReactivando.value = row;
			formReactivar.motivo = "";
			modalReactivar.value = true;
		}
		async function confirmarReactivar() {
			if (!contratoReactivando.value || !formReactivar.motivo) return;
			reactivando.value = true;
			try {
				await useApiFetch(`/contratos/${contratoReactivando.value.id}/reactivar`, {
					method: "PATCH",
					body: { motivo: formReactivar.motivo }
				});
				modalReactivar.value = false;
				await cargar();
			} catch (e) {
				error.value = e?.data?.message || "No fue posible reactivar el contrato.";
			} finally {
				reactivando.value = false;
			}
		}
		watch(() => [
			filtros.busqueda,
			filtros.barrio,
			filtros.fechaDesde,
			filtros.fechaHasta,
			filtros.estado
		], () => {
			page.value = 1;
			cargar();
		});
		watch(page, cargar);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UButton = Button_default;
			const _component_UCard = Card_default;
			const _component_UInput = Input_default;
			const _component_USelectMenu = SelectMenu_default;
			const _component_UTable = Table_default;
			const _component_UBadge = Badge_default;
			const _component_UIcon = Icon_default;
			const _component_UPagination = Pagination_default;
			const _component_UAlert = Alert_default;
			const _component_UModal = Modal_default;
			const _component_UFormGroup = FormGroup_default;
			const _component_UTextarea = Textarea_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-4"><h1 class="text-xl font-semibold text-slate-900">Contratos</h1>`);
			_push(ssrRenderComponent(_component_UButton, {
				color: "amber",
				icon: "i-heroicons-plus",
				to: "/contratos/nuevo"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Nuevo contrato `);
					else return [createTextVNode(" Nuevo contrato ")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			_push(ssrRenderComponent(_component_UCard, { class: "mb-4" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="flex flex-wrap gap-3"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UInput, {
							modelValue: unref(filtros).busqueda,
							"onUpdate:modelValue": ($event) => unref(filtros).busqueda = $event,
							placeholder: "Cédula o nombre del arrendatario…",
							icon: "i-heroicons-magnifying-glass",
							class: "w-64"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_USelectMenu, {
							modelValue: unref(filtros).barrio,
							"onUpdate:modelValue": ($event) => unref(filtros).barrio = $event,
							options: ["", ...unref(barrios)],
							placeholder: "Barrio del inmueble",
							class: "w-52"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_UInput, {
							modelValue: unref(filtros).fechaDesde,
							"onUpdate:modelValue": ($event) => unref(filtros).fechaDesde = $event,
							type: "date",
							class: "w-40"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_UInput, {
							modelValue: unref(filtros).fechaHasta,
							"onUpdate:modelValue": ($event) => unref(filtros).fechaHasta = $event,
							type: "date",
							class: "w-40"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_USelectMenu, {
							modelValue: unref(filtros).estado,
							"onUpdate:modelValue": ($event) => unref(filtros).estado = $event,
							options: [
								"",
								"ACTIVO",
								"TERMINADO"
							],
							placeholder: "Estado",
							class: "w-44"
						}, null, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "flex flex-wrap gap-3" }, [
						createVNode(_component_UInput, {
							modelValue: unref(filtros).busqueda,
							"onUpdate:modelValue": ($event) => unref(filtros).busqueda = $event,
							placeholder: "Cédula o nombre del arrendatario…",
							icon: "i-heroicons-magnifying-glass",
							class: "w-64"
						}, null, 8, ["modelValue", "onUpdate:modelValue"]),
						createVNode(_component_USelectMenu, {
							modelValue: unref(filtros).barrio,
							"onUpdate:modelValue": ($event) => unref(filtros).barrio = $event,
							options: ["", ...unref(barrios)],
							placeholder: "Barrio del inmueble",
							class: "w-52"
						}, null, 8, [
							"modelValue",
							"onUpdate:modelValue",
							"options"
						]),
						createVNode(_component_UInput, {
							modelValue: unref(filtros).fechaDesde,
							"onUpdate:modelValue": ($event) => unref(filtros).fechaDesde = $event,
							type: "date",
							class: "w-40"
						}, null, 8, ["modelValue", "onUpdate:modelValue"]),
						createVNode(_component_UInput, {
							modelValue: unref(filtros).fechaHasta,
							"onUpdate:modelValue": ($event) => unref(filtros).fechaHasta = $event,
							type: "date",
							class: "w-40"
						}, null, 8, ["modelValue", "onUpdate:modelValue"]),
						createVNode(_component_USelectMenu, {
							modelValue: unref(filtros).estado,
							"onUpdate:modelValue": ($event) => unref(filtros).estado = $event,
							options: [
								"",
								"ACTIVO",
								"TERMINADO"
							],
							placeholder: "Estado",
							class: "w-44"
						}, null, 8, ["modelValue", "onUpdate:modelValue"])
					])];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UCard, null, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_UTable, {
							rows: unref(contratos),
							columns: columnas,
							loading: unref(cargando)
						}, {
							"cliente-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(`<div${_scopeId}><p class="font-medium text-slate-900"${_scopeId}>${ssrInterpolate(row.cliente?.nombreCompleto)}</p><p class="text-xs text-slate-500"${_scopeId}>${ssrInterpolate(row.cliente?.numeroDocumento)}</p></div>`);
								else return [createVNode("div", null, [createVNode("p", { class: "font-medium text-slate-900" }, toDisplayString(row.cliente?.nombreCompleto), 1), createVNode("p", { class: "text-xs text-slate-500" }, toDisplayString(row.cliente?.numeroDocumento), 1)])];
							}),
							"inmueble-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(`<div${_scopeId}><p class="text-slate-900"${_scopeId}>${ssrInterpolate(row.inmueble?.direccion)}</p><p class="text-xs text-slate-500"${_scopeId}>${ssrInterpolate(row.inmueble?.barrio)}</p></div>`);
								else return [createVNode("div", null, [createVNode("p", { class: "text-slate-900" }, toDisplayString(row.inmueble?.direccion), 1), createVNode("p", { class: "text-xs text-slate-500" }, toDisplayString(row.inmueble?.barrio), 1)])];
							}),
							"fechaInicio-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(unref(fecha)(row.fechaInicio))}`);
								else return [createTextVNode(toDisplayString(unref(fecha)(row.fechaInicio)), 1)];
							}),
							"estado-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_component_UBadge, {
									color: estadoColor[row.estado] || "gray",
									variant: "subtle"
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`${ssrInterpolate(row.estado)}`);
										else return [createTextVNode(toDisplayString(row.estado), 1)];
									}),
									_: 2
								}, _parent, _scopeId));
								else return [createVNode(_component_UBadge, {
									color: estadoColor[row.estado] || "gray",
									variant: "subtle"
								}, {
									default: withCtx(() => [createTextVNode(toDisplayString(row.estado), 1)]),
									_: 2
								}, 1032, ["color"])];
							}),
							"acciones-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="flex gap-2"${_scopeId}>`);
									if (row.estado === "ACTIVO") _push(ssrRenderComponent(_component_UButton, {
										size: "xs",
										color: "red",
										variant: "soft",
										onClick: ($event) => abrirTerminar(row)
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(` Terminar `);
											else return [createTextVNode(" Terminar ")];
										}),
										_: 2
									}, _parent, _scopeId));
									else _push(`<!---->`);
									if (unref(auth).esAdministrador && row.estado === "TERMINADO") _push(ssrRenderComponent(_component_UButton, {
										size: "xs",
										color: "emerald",
										variant: "soft",
										onClick: ($event) => abrirReactivar(row)
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(` Reactivar `);
											else return [createTextVNode(" Reactivar ")];
										}),
										_: 2
									}, _parent, _scopeId));
									else _push(`<!---->`);
									_push(`</div>`);
								} else return [createVNode("div", { class: "flex gap-2" }, [row.estado === "ACTIVO" ? (openBlock(), createBlock(_component_UButton, {
									key: 0,
									size: "xs",
									color: "red",
									variant: "soft",
									onClick: ($event) => abrirTerminar(row)
								}, {
									default: withCtx(() => [createTextVNode(" Terminar ")]),
									_: 1
								}, 8, ["onClick"])) : createCommentVNode("", true), unref(auth).esAdministrador && row.estado === "TERMINADO" ? (openBlock(), createBlock(_component_UButton, {
									key: 1,
									size: "xs",
									color: "emerald",
									variant: "soft",
									onClick: ($event) => abrirReactivar(row)
								}, {
									default: withCtx(() => [createTextVNode(" Reactivar ")]),
									_: 1
								}, 8, ["onClick"])) : createCommentVNode("", true)])];
							}),
							"empty-state": withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="text-center py-10 text-slate-400"${_scopeId}>`);
									_push(ssrRenderComponent(_component_UIcon, {
										name: "i-heroicons-document-text",
										class: "w-10 h-10 mx-auto mb-2"
									}, null, _parent, _scopeId));
									_push(`<p${_scopeId}>No hay contratos que coincidan con los filtros.</p></div>`);
								} else return [createVNode("div", { class: "text-center py-10 text-slate-400" }, [createVNode(_component_UIcon, {
									name: "i-heroicons-document-text",
									class: "w-10 h-10 mx-auto mb-2"
								}), createVNode("p", null, "No hay contratos que coincidan con los filtros.")])];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`<div class="flex justify-end mt-4"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UPagination, {
							modelValue: unref(page),
							"onUpdate:modelValue": ($event) => isRef(page) ? page.value = $event : null,
							"page-count": unref(limit),
							total: unref(total)
						}, null, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode(_component_UTable, {
						rows: unref(contratos),
						columns: columnas,
						loading: unref(cargando)
					}, {
						"cliente-data": withCtx(({ row }) => [createVNode("div", null, [createVNode("p", { class: "font-medium text-slate-900" }, toDisplayString(row.cliente?.nombreCompleto), 1), createVNode("p", { class: "text-xs text-slate-500" }, toDisplayString(row.cliente?.numeroDocumento), 1)])]),
						"inmueble-data": withCtx(({ row }) => [createVNode("div", null, [createVNode("p", { class: "text-slate-900" }, toDisplayString(row.inmueble?.direccion), 1), createVNode("p", { class: "text-xs text-slate-500" }, toDisplayString(row.inmueble?.barrio), 1)])]),
						"fechaInicio-data": withCtx(({ row }) => [createTextVNode(toDisplayString(unref(fecha)(row.fechaInicio)), 1)]),
						"estado-data": withCtx(({ row }) => [createVNode(_component_UBadge, {
							color: estadoColor[row.estado] || "gray",
							variant: "subtle"
						}, {
							default: withCtx(() => [createTextVNode(toDisplayString(row.estado), 1)]),
							_: 2
						}, 1032, ["color"])]),
						"acciones-data": withCtx(({ row }) => [createVNode("div", { class: "flex gap-2" }, [row.estado === "ACTIVO" ? (openBlock(), createBlock(_component_UButton, {
							key: 0,
							size: "xs",
							color: "red",
							variant: "soft",
							onClick: ($event) => abrirTerminar(row)
						}, {
							default: withCtx(() => [createTextVNode(" Terminar ")]),
							_: 1
						}, 8, ["onClick"])) : createCommentVNode("", true), unref(auth).esAdministrador && row.estado === "TERMINADO" ? (openBlock(), createBlock(_component_UButton, {
							key: 1,
							size: "xs",
							color: "emerald",
							variant: "soft",
							onClick: ($event) => abrirReactivar(row)
						}, {
							default: withCtx(() => [createTextVNode(" Reactivar ")]),
							_: 1
						}, 8, ["onClick"])) : createCommentVNode("", true)])]),
						"empty-state": withCtx(() => [createVNode("div", { class: "text-center py-10 text-slate-400" }, [createVNode(_component_UIcon, {
							name: "i-heroicons-document-text",
							class: "w-10 h-10 mx-auto mb-2"
						}), createVNode("p", null, "No hay contratos que coincidan con los filtros.")])]),
						_: 1
					}, 8, ["rows", "loading"]), createVNode("div", { class: "flex justify-end mt-4" }, [createVNode(_component_UPagination, {
						modelValue: unref(page),
						"onUpdate:modelValue": ($event) => isRef(page) ? page.value = $event : null,
						"page-count": unref(limit),
						total: unref(total)
					}, null, 8, [
						"modelValue",
						"onUpdate:modelValue",
						"page-count",
						"total"
					])])];
				}),
				_: 1
			}, _parent));
			if (unref(error)) _push(ssrRenderComponent(_component_UAlert, {
				color: "red",
				variant: "subtle",
				title: unref(error),
				class: "mt-4"
			}, null, _parent));
			else _push(`<!---->`);
			_push(ssrRenderComponent(_component_UModal, {
				modelValue: unref(modalTerminar),
				"onUpdate:modelValue": ($event) => isRef(modalTerminar) ? modalTerminar.value = $event : null
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UCard, null, {
						header: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>Terminar contrato</p>`);
							else return [createVNode("p", { class: "font-semibold text-slate-900" }, "Terminar contrato")];
						}),
						footer: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex justify-end gap-2"${_scopeId}>`);
								_push(ssrRenderComponent(_component_UButton, {
									color: "gray",
									variant: "ghost",
									onClick: ($event) => modalTerminar.value = false
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`Cancelar`);
										else return [createTextVNode("Cancelar")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UButton, {
									color: "red",
									loading: unref(terminando),
									disabled: !unref(formTerminar).fechaFin || !unref(formTerminar).motivoTerminacion,
									onClick: confirmarTerminar
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(` Terminar contrato `);
										else return [createTextVNode(" Terminar contrato ")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
								color: "gray",
								variant: "ghost",
								onClick: ($event) => modalTerminar.value = false
							}, {
								default: withCtx(() => [createTextVNode("Cancelar")]),
								_: 1
							}, 8, ["onClick"]), createVNode(_component_UButton, {
								color: "red",
								loading: unref(terminando),
								disabled: !unref(formTerminar).fechaFin || !unref(formTerminar).motivoTerminacion,
								onClick: confirmarTerminar
							}, {
								default: withCtx(() => [createTextVNode(" Terminar contrato ")]),
								_: 1
							}, 8, ["loading", "disabled"])])];
						}),
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="space-y-3"${_scopeId}>`);
								_push(ssrRenderComponent(_component_UAlert, {
									color: "amber",
									variant: "subtle",
									title: "Esta acción es irreversible.",
									description: "Si el contrato tiene saldo pendiente, seguirá siendo cobrable desde Recaudo; no se cancela ni se pierde al terminar."
								}, null, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Fecha de fin" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UInput, {
											modelValue: unref(formTerminar).fechaFin,
											"onUpdate:modelValue": ($event) => unref(formTerminar).fechaFin = $event,
											type: "date"
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UInput, {
											modelValue: unref(formTerminar).fechaFin,
											"onUpdate:modelValue": ($event) => unref(formTerminar).fechaFin = $event,
											type: "date"
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Motivo de terminación" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UTextarea, {
											modelValue: unref(formTerminar).motivoTerminacion,
											"onUpdate:modelValue": ($event) => unref(formTerminar).motivoTerminacion = $event
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UTextarea, {
											modelValue: unref(formTerminar).motivoTerminacion,
											"onUpdate:modelValue": ($event) => unref(formTerminar).motivoTerminacion = $event
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "space-y-3" }, [
								createVNode(_component_UAlert, {
									color: "amber",
									variant: "subtle",
									title: "Esta acción es irreversible.",
									description: "Si el contrato tiene saldo pendiente, seguirá siendo cobrable desde Recaudo; no se cancela ni se pierde al terminar."
								}),
								createVNode(_component_UFormGroup, { label: "Fecha de fin" }, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(formTerminar).fechaFin,
										"onUpdate:modelValue": ($event) => unref(formTerminar).fechaFin = $event,
										type: "date"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode(_component_UFormGroup, { label: "Motivo de terminación" }, {
									default: withCtx(() => [createVNode(_component_UTextarea, {
										modelValue: unref(formTerminar).motivoTerminacion,
										"onUpdate:modelValue": ($event) => unref(formTerminar).motivoTerminacion = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								})
							])];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(_component_UCard, null, {
						header: withCtx(() => [createVNode("p", { class: "font-semibold text-slate-900" }, "Terminar contrato")]),
						footer: withCtx(() => [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
							color: "gray",
							variant: "ghost",
							onClick: ($event) => modalTerminar.value = false
						}, {
							default: withCtx(() => [createTextVNode("Cancelar")]),
							_: 1
						}, 8, ["onClick"]), createVNode(_component_UButton, {
							color: "red",
							loading: unref(terminando),
							disabled: !unref(formTerminar).fechaFin || !unref(formTerminar).motivoTerminacion,
							onClick: confirmarTerminar
						}, {
							default: withCtx(() => [createTextVNode(" Terminar contrato ")]),
							_: 1
						}, 8, ["loading", "disabled"])])]),
						default: withCtx(() => [createVNode("div", { class: "space-y-3" }, [
							createVNode(_component_UAlert, {
								color: "amber",
								variant: "subtle",
								title: "Esta acción es irreversible.",
								description: "Si el contrato tiene saldo pendiente, seguirá siendo cobrable desde Recaudo; no se cancela ni se pierde al terminar."
							}),
							createVNode(_component_UFormGroup, { label: "Fecha de fin" }, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(formTerminar).fechaFin,
									"onUpdate:modelValue": ($event) => unref(formTerminar).fechaFin = $event,
									type: "date"
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							createVNode(_component_UFormGroup, { label: "Motivo de terminación" }, {
								default: withCtx(() => [createVNode(_component_UTextarea, {
									modelValue: unref(formTerminar).motivoTerminacion,
									"onUpdate:modelValue": ($event) => unref(formTerminar).motivoTerminacion = $event
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							})
						])]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UModal, {
				modelValue: unref(modalReactivar),
				"onUpdate:modelValue": ($event) => isRef(modalReactivar) ? modalReactivar.value = $event : null
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UCard, null, {
						header: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>Reactivar contrato</p>`);
							else return [createVNode("p", { class: "font-semibold text-slate-900" }, "Reactivar contrato")];
						}),
						footer: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex justify-end gap-2"${_scopeId}>`);
								_push(ssrRenderComponent(_component_UButton, {
									color: "gray",
									variant: "ghost",
									onClick: ($event) => modalReactivar.value = false
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`Cancelar`);
										else return [createTextVNode("Cancelar")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UButton, {
									color: "emerald",
									loading: unref(reactivando),
									disabled: !unref(formReactivar).motivo,
									onClick: confirmarReactivar
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(` Reactivar contrato `);
										else return [createTextVNode(" Reactivar contrato ")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
								color: "gray",
								variant: "ghost",
								onClick: ($event) => modalReactivar.value = false
							}, {
								default: withCtx(() => [createTextVNode("Cancelar")]),
								_: 1
							}, 8, ["onClick"]), createVNode(_component_UButton, {
								color: "emerald",
								loading: unref(reactivando),
								disabled: !unref(formReactivar).motivo,
								onClick: confirmarReactivar
							}, {
								default: withCtx(() => [createTextVNode(" Reactivar contrato ")]),
								_: 1
							}, 8, ["loading", "disabled"])])];
						}),
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="space-y-3"${_scopeId}>`);
								_push(ssrRenderComponent(_component_UAlert, {
									color: "emerald",
									variant: "subtle",
									title: "El contrato volverá a ACTIVO.",
									description: "El inmueble vuelve a quedar ocupado. La fecha y el motivo de la terminación original se conservan en el historial del contrato."
								}, null, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Motivo de la reactivación" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UTextarea, {
											modelValue: unref(formReactivar).motivo,
											"onUpdate:modelValue": ($event) => unref(formReactivar).motivo = $event,
											placeholder: "Ej: el cliente decidió continuar el arrendamiento"
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UTextarea, {
											modelValue: unref(formReactivar).motivo,
											"onUpdate:modelValue": ($event) => unref(formReactivar).motivo = $event,
											placeholder: "Ej: el cliente decidió continuar el arrendamiento"
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "space-y-3" }, [createVNode(_component_UAlert, {
								color: "emerald",
								variant: "subtle",
								title: "El contrato volverá a ACTIVO.",
								description: "El inmueble vuelve a quedar ocupado. La fecha y el motivo de la terminación original se conservan en el historial del contrato."
							}), createVNode(_component_UFormGroup, { label: "Motivo de la reactivación" }, {
								default: withCtx(() => [createVNode(_component_UTextarea, {
									modelValue: unref(formReactivar).motivo,
									"onUpdate:modelValue": ($event) => unref(formReactivar).motivo = $event,
									placeholder: "Ej: el cliente decidió continuar el arrendamiento"
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							})])];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(_component_UCard, null, {
						header: withCtx(() => [createVNode("p", { class: "font-semibold text-slate-900" }, "Reactivar contrato")]),
						footer: withCtx(() => [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
							color: "gray",
							variant: "ghost",
							onClick: ($event) => modalReactivar.value = false
						}, {
							default: withCtx(() => [createTextVNode("Cancelar")]),
							_: 1
						}, 8, ["onClick"]), createVNode(_component_UButton, {
							color: "emerald",
							loading: unref(reactivando),
							disabled: !unref(formReactivar).motivo,
							onClick: confirmarReactivar
						}, {
							default: withCtx(() => [createTextVNode(" Reactivar contrato ")]),
							_: 1
						}, 8, ["loading", "disabled"])])]),
						default: withCtx(() => [createVNode("div", { class: "space-y-3" }, [createVNode(_component_UAlert, {
							color: "emerald",
							variant: "subtle",
							title: "El contrato volverá a ACTIVO.",
							description: "El inmueble vuelve a quedar ocupado. La fecha y el motivo de la terminación original se conservan en el historial del contrato."
						}), createVNode(_component_UFormGroup, { label: "Motivo de la reactivación" }, {
							default: withCtx(() => [createVNode(_component_UTextarea, {
								modelValue: unref(formReactivar).motivo,
								"onUpdate:modelValue": ($event) => unref(formReactivar).motivo = $event,
								placeholder: "Ej: el cliente decidió continuar el arrendamiento"
							}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
							_: 1
						})])]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region pages/contratos/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contratos/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var contratos_default = index_vue_vue_type_script_setup_true_lang_default;

export { contratos_default as default };
//# sourceMappingURL=contratos-eK9qXb8a.mjs.map
