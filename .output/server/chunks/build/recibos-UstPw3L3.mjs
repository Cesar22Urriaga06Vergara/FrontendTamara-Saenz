import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { t as Table_default } from './Table-BjAsSJoi.mjs';
import { t as Badge_default } from './Badge-Dji78drx.mjs';
import { t as Alert_default } from './Alert-Bv_RgsgM.mjs';
import { t as Card_default } from './Card-j-DCNf6K.mjs';
import { t as Pagination_default } from './Pagination-CVW3oGYj.mjs';
import { t as Button_default } from './Button-CoYovqJ9.mjs';
import { t as SelectMenu_default } from './SelectMenu-Bw_jkCZn.mjs';
import { t as Dropdown_default } from './Dropdown-BjJ7vUzi.mjs';
import { t as Input_default } from './Input-BVUEIOT9.mjs';
import { u as useApiFetch } from './useApiFetch-B8kTc45P.mjs';
import { u as useFormatoCO } from './useFormatoCO-CX_CcnnC.mjs';
import { u as usePdfDownload } from './usePdfDownload-1a7-2EuR.mjs';
import { defineComponent, ref, reactive, watch, unref, withCtx, createVNode, createTextVNode, toDisplayString, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import '../virtual/entry.mjs';
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
import './link-apSRv82-.mjs';
import './Link-CnaKOPmE.mjs';
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
import './Kbd-rjcREfaE.mjs';

//#region pages/recibos/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* Módulo RECIBOS (independiente dentro de FINANZAS) — permite consultar cualquier recibo
		* histórico sin tener que volver al cliente o al módulo de Recaudo para localizarlo.
		* EXCLUSIVO Administrador (protegido también por middleware/auth.global.ts).
		*/
		const { moneda, fecha } = useFormatoCO();
		const cargando = ref(true);
		const recibos = ref([]);
		const total = ref(0);
		const page = ref(1);
		const limit = ref(10);
		const error = ref("");
		const filtros = reactive({
			busqueda: "",
			estado: "",
			medioPago: "",
			fechaDesde: "",
			fechaHasta: ""
		});
		const columnas = [
			{
				key: "consecutivo",
				label: "Número"
			},
			{
				key: "creadoEn",
				label: "Fecha"
			},
			{
				key: "cliente",
				label: "Cliente"
			},
			{
				key: "contrato",
				label: "Contrato"
			},
			{
				key: "valorTotal",
				label: "Total"
			},
			{
				key: "medioPago",
				label: "Medio de pago"
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
			EMITIDO: "emerald",
			ANULADO: "red"
		};
		function mediosDePago(row) {
			const medios = [...new Set((row.detallesPago || []).map((d) => d.medioPago))];
			if (medios.length === 0) return "—";
			if (medios.length === 1) return medios[0] === "EFECTIVO" ? "Efectivo" : "Transferencia";
			return "Mixto";
		}
		async function cargar() {
			cargando.value = true;
			try {
				const data = await useApiFetch("/recaudo/recibos", { params: {
					...filtros,
					page: page.value,
					limit: limit.value
				} });
				recibos.value = data.data;
				total.value = data.total;
				error.value = "";
			} catch (e) {
				error.value = e?.data?.message || "No fue posible cargar los recibos.";
			} finally {
				cargando.value = false;
			}
		}
		watch(() => [
			filtros.busqueda,
			filtros.estado,
			filtros.medioPago,
			filtros.fechaDesde,
			filtros.fechaHasta
		], () => {
			page.value = 1;
			cargar();
		});
		watch(page, cargar);
		const descargando = ref(null);
		async function descargar(row, formato) {
			descargando.value = row.id;
			try {
				await usePdfDownload(`/documentos/recibos/${row.id}/pdf?formato=${formato}`, row.consecutivo);
			} catch (e) {
				error.value = e?.data?.message || "No fue posible descargar el PDF.";
			} finally {
				descargando.value = null;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UAlert = Alert_default;
			const _component_UCard = Card_default;
			const _component_UInput = Input_default;
			const _component_USelectMenu = SelectMenu_default;
			const _component_UTable = Table_default;
			const _component_UBadge = Badge_default;
			const _component_UButton = Button_default;
			const _component_UDropdown = Dropdown_default;
			const _component_UIcon = Icon_default;
			const _component_UPagination = Pagination_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-xl font-semibold text-slate-900 mb-4">Recibos</h1>`);
			if (unref(error)) _push(ssrRenderComponent(_component_UAlert, {
				color: "red",
				variant: "subtle",
				title: unref(error),
				class: "mb-4"
			}, null, _parent));
			else _push(`<!---->`);
			_push(ssrRenderComponent(_component_UCard, { class: "mb-4" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="flex flex-wrap gap-3"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UInput, {
							modelValue: unref(filtros).busqueda,
							"onUpdate:modelValue": ($event) => unref(filtros).busqueda = $event,
							placeholder: "Cédula, nombre del cliente o número de recibo…",
							icon: "i-heroicons-magnifying-glass",
							class: "w-72"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_USelectMenu, {
							modelValue: unref(filtros).estado,
							"onUpdate:modelValue": ($event) => unref(filtros).estado = $event,
							options: [
								"",
								"EMITIDO",
								"ANULADO"
							],
							placeholder: "Estado",
							class: "w-40"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_USelectMenu, {
							modelValue: unref(filtros).medioPago,
							"onUpdate:modelValue": ($event) => unref(filtros).medioPago = $event,
							options: [
								"",
								"EFECTIVO",
								"TRANSFERENCIA"
							],
							placeholder: "Medio de pago",
							class: "w-44"
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
						_push(`</div>`);
					} else return [createVNode("div", { class: "flex flex-wrap gap-3" }, [
						createVNode(_component_UInput, {
							modelValue: unref(filtros).busqueda,
							"onUpdate:modelValue": ($event) => unref(filtros).busqueda = $event,
							placeholder: "Cédula, nombre del cliente o número de recibo…",
							icon: "i-heroicons-magnifying-glass",
							class: "w-72"
						}, null, 8, ["modelValue", "onUpdate:modelValue"]),
						createVNode(_component_USelectMenu, {
							modelValue: unref(filtros).estado,
							"onUpdate:modelValue": ($event) => unref(filtros).estado = $event,
							options: [
								"",
								"EMITIDO",
								"ANULADO"
							],
							placeholder: "Estado",
							class: "w-40"
						}, null, 8, ["modelValue", "onUpdate:modelValue"]),
						createVNode(_component_USelectMenu, {
							modelValue: unref(filtros).medioPago,
							"onUpdate:modelValue": ($event) => unref(filtros).medioPago = $event,
							options: [
								"",
								"EFECTIVO",
								"TRANSFERENCIA"
							],
							placeholder: "Medio de pago",
							class: "w-44"
						}, null, 8, ["modelValue", "onUpdate:modelValue"]),
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
						}, null, 8, ["modelValue", "onUpdate:modelValue"])
					])];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UCard, null, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_UTable, {
							rows: unref(recibos),
							columns: columnas,
							loading: unref(cargando)
						}, {
							"consecutivo-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(`<span class="font-medium text-slate-900"${_scopeId}>${ssrInterpolate(row.consecutivo)}</span>`);
								else return [createVNode("span", { class: "font-medium text-slate-900" }, toDisplayString(row.consecutivo), 1)];
							}),
							"creadoEn-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(unref(fecha)(row.creadoEn))}`);
								else return [createTextVNode(toDisplayString(unref(fecha)(row.creadoEn)), 1)];
							}),
							"cliente-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(`<div${_scopeId}><p class="text-slate-900"${_scopeId}>${ssrInterpolate(row.contrato?.cliente?.nombreCompleto)}</p><p class="text-xs text-slate-500"${_scopeId}>${ssrInterpolate(row.contrato?.cliente?.numeroDocumento)}</p></div>`);
								else return [createVNode("div", null, [createVNode("p", { class: "text-slate-900" }, toDisplayString(row.contrato?.cliente?.nombreCompleto), 1), createVNode("p", { class: "text-xs text-slate-500" }, toDisplayString(row.contrato?.cliente?.numeroDocumento), 1)])];
							}),
							"contrato-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(`<div${_scopeId}><p class="text-slate-900"${_scopeId}>${ssrInterpolate(row.contrato?.inmueble?.direccion)}</p><p class="text-xs text-slate-500"${_scopeId}>${ssrInterpolate(row.contrato?.inmueble?.barrio)}</p></div>`);
								else return [createVNode("div", null, [createVNode("p", { class: "text-slate-900" }, toDisplayString(row.contrato?.inmueble?.direccion), 1), createVNode("p", { class: "text-xs text-slate-500" }, toDisplayString(row.contrato?.inmueble?.barrio), 1)])];
							}),
							"valorTotal-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(unref(moneda)(row.valorTotal))}`);
								else return [createTextVNode(toDisplayString(unref(moneda)(row.valorTotal)), 1)];
							}),
							"medioPago-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(mediosDePago(row))}`);
								else return [createTextVNode(toDisplayString(mediosDePago(row)), 1)];
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
									_push(`<div class="flex gap-1"${_scopeId}>`);
									_push(ssrRenderComponent(_component_UButton, {
										size: "xs",
										color: "amber",
										variant: "soft",
										icon: "i-heroicons-eye",
										to: `/recibos/${row.id}`
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(` Ver `);
											else return [createTextVNode(" Ver ")];
										}),
										_: 2
									}, _parent, _scopeId));
									_push(ssrRenderComponent(_component_UDropdown, { items: [[{
										label: "PDF Carta",
										click: () => descargar(row, "CARTA")
									}, {
										label: "PDF Media Carta",
										click: () => descargar(row, "MEDIA_CARTA")
									}]] }, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(ssrRenderComponent(_component_UButton, {
												size: "xs",
												color: "gray",
												variant: "soft",
												icon: "i-heroicons-arrow-down-tray",
												loading: unref(descargando) === row.id
											}, null, _parent, _scopeId));
											else return [createVNode(_component_UButton, {
												size: "xs",
												color: "gray",
												variant: "soft",
												icon: "i-heroicons-arrow-down-tray",
												loading: unref(descargando) === row.id
											}, null, 8, ["loading"])];
										}),
										_: 2
									}, _parent, _scopeId));
									_push(`</div>`);
								} else return [createVNode("div", { class: "flex gap-1" }, [createVNode(_component_UButton, {
									size: "xs",
									color: "amber",
									variant: "soft",
									icon: "i-heroicons-eye",
									to: `/recibos/${row.id}`
								}, {
									default: withCtx(() => [createTextVNode(" Ver ")]),
									_: 1
								}, 8, ["to"]), createVNode(_component_UDropdown, { items: [[{
									label: "PDF Carta",
									click: () => descargar(row, "CARTA")
								}, {
									label: "PDF Media Carta",
									click: () => descargar(row, "MEDIA_CARTA")
								}]] }, {
									default: withCtx(() => [createVNode(_component_UButton, {
										size: "xs",
										color: "gray",
										variant: "soft",
										icon: "i-heroicons-arrow-down-tray",
										loading: unref(descargando) === row.id
									}, null, 8, ["loading"])]),
									_: 2
								}, 1032, ["items"])])];
							}),
							"empty-state": withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="text-center py-10 text-slate-400"${_scopeId}>`);
									_push(ssrRenderComponent(_component_UIcon, {
										name: "i-heroicons-receipt-percent",
										class: "w-10 h-10 mx-auto mb-2"
									}, null, _parent, _scopeId));
									_push(`<p${_scopeId}>No hay recibos que coincidan con los filtros.</p></div>`);
								} else return [createVNode("div", { class: "text-center py-10 text-slate-400" }, [createVNode(_component_UIcon, {
									name: "i-heroicons-receipt-percent",
									class: "w-10 h-10 mx-auto mb-2"
								}), createVNode("p", null, "No hay recibos que coincidan con los filtros.")])];
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
						rows: unref(recibos),
						columns: columnas,
						loading: unref(cargando)
					}, {
						"consecutivo-data": withCtx(({ row }) => [createVNode("span", { class: "font-medium text-slate-900" }, toDisplayString(row.consecutivo), 1)]),
						"creadoEn-data": withCtx(({ row }) => [createTextVNode(toDisplayString(unref(fecha)(row.creadoEn)), 1)]),
						"cliente-data": withCtx(({ row }) => [createVNode("div", null, [createVNode("p", { class: "text-slate-900" }, toDisplayString(row.contrato?.cliente?.nombreCompleto), 1), createVNode("p", { class: "text-xs text-slate-500" }, toDisplayString(row.contrato?.cliente?.numeroDocumento), 1)])]),
						"contrato-data": withCtx(({ row }) => [createVNode("div", null, [createVNode("p", { class: "text-slate-900" }, toDisplayString(row.contrato?.inmueble?.direccion), 1), createVNode("p", { class: "text-xs text-slate-500" }, toDisplayString(row.contrato?.inmueble?.barrio), 1)])]),
						"valorTotal-data": withCtx(({ row }) => [createTextVNode(toDisplayString(unref(moneda)(row.valorTotal)), 1)]),
						"medioPago-data": withCtx(({ row }) => [createTextVNode(toDisplayString(mediosDePago(row)), 1)]),
						"estado-data": withCtx(({ row }) => [createVNode(_component_UBadge, {
							color: estadoColor[row.estado] || "gray",
							variant: "subtle"
						}, {
							default: withCtx(() => [createTextVNode(toDisplayString(row.estado), 1)]),
							_: 2
						}, 1032, ["color"])]),
						"acciones-data": withCtx(({ row }) => [createVNode("div", { class: "flex gap-1" }, [createVNode(_component_UButton, {
							size: "xs",
							color: "amber",
							variant: "soft",
							icon: "i-heroicons-eye",
							to: `/recibos/${row.id}`
						}, {
							default: withCtx(() => [createTextVNode(" Ver ")]),
							_: 1
						}, 8, ["to"]), createVNode(_component_UDropdown, { items: [[{
							label: "PDF Carta",
							click: () => descargar(row, "CARTA")
						}, {
							label: "PDF Media Carta",
							click: () => descargar(row, "MEDIA_CARTA")
						}]] }, {
							default: withCtx(() => [createVNode(_component_UButton, {
								size: "xs",
								color: "gray",
								variant: "soft",
								icon: "i-heroicons-arrow-down-tray",
								loading: unref(descargando) === row.id
							}, null, 8, ["loading"])]),
							_: 2
						}, 1032, ["items"])])]),
						"empty-state": withCtx(() => [createVNode("div", { class: "text-center py-10 text-slate-400" }, [createVNode(_component_UIcon, {
							name: "i-heroicons-receipt-percent",
							class: "w-10 h-10 mx-auto mb-2"
						}), createVNode("p", null, "No hay recibos que coincidan con los filtros.")])]),
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
			_push(`</div>`);
		};
	}
});
//#endregion
//#region pages/recibos/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/recibos/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var recibos_default = index_vue_vue_type_script_setup_true_lang_default;

export { recibos_default as default };
//# sourceMappingURL=recibos-UstPw3L3.mjs.map
