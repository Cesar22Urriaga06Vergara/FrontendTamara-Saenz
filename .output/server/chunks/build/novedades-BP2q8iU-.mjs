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
import { u as useApiFetch } from './useApiFetch-B8kTc45P.mjs';
import { u as useFormatoCO } from './useFormatoCO-CX_CcnnC.mjs';
import { u as usePdfDownload } from './usePdfDownload-1a7-2EuR.mjs';
import { defineComponent, ref, reactive, watch, withCtx, createTextVNode, unref, createVNode, openBlock, createBlock, Fragment, createCommentVNode, toDisplayString, isRef, useSSRContext } from 'vue';
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

//#region pages/novedades/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const auth = useAuthStore();
		const { fecha, moneda } = useFormatoCO();
		const modalAbierto = ref(false);
		const novedadEnAprobacion = ref(null);
		const tipoAprobacion = ref(null);
		const montoAprobacion = ref(0);
		const conceptoAprobacion = ref("");
		const aprobando = ref(false);
		const error = ref("");
		function abrirAprobacion(row, tipo) {
			novedadEnAprobacion.value = row;
			tipoAprobacion.value = tipo;
			montoAprobacion.value = 0;
			conceptoAprobacion.value = row.descripcion;
			modalAbierto.value = true;
		}
		async function descargarReciboNovedad(row) {
			await usePdfDownload(`/documentos/novedades/${row.id}/pdf`, row.consecutivo);
		}
		async function confirmarAprobacion() {
			if (!novedadEnAprobacion.value || !tipoAprobacion.value) return;
			aprobando.value = true;
			try {
				const ruta = tipoAprobacion.value === "CARGO_ARRENDATARIO" ? "aprobar-cargo-arrendatario" : "aprobar-gasto-inmobiliaria";
				await useApiFetch(`/novedades/${novedadEnAprobacion.value.id}/${ruta}`, {
					method: "PATCH",
					body: {
						monto: montoAprobacion.value,
						concepto: conceptoAprobacion.value
					}
				});
				modalAbierto.value = false;
				error.value = "";
				await cargar();
			} catch (e) {
				error.value = e?.data?.message || "No fue posible aprobar el impacto financiero de la novedad.";
			} finally {
				aprobando.value = false;
			}
		}
		const modalPago = ref(false);
		const novedadPagando = ref(null);
		const medioPago = ref("");
		const referenciaPago = ref("");
		const pagando = ref(false);
		function abrirPago(row) {
			novedadPagando.value = row;
			medioPago.value = "";
			referenciaPago.value = "";
			error.value = "";
			modalPago.value = true;
		}
		async function confirmarPago() {
			if (!novedadPagando.value || !medioPago.value) return;
			pagando.value = true;
			try {
				await useApiFetch(`/novedades/${novedadPagando.value.id}/pagar-gasto-inmobiliaria`, {
					method: "PATCH",
					body: {
						medioPago: medioPago.value,
						referencia: referenciaPago.value || void 0
					}
				});
				modalPago.value = false;
				error.value = "";
				await cargar();
			} catch (e) {
				error.value = e?.data?.message || "No fue posible registrar el pago del gasto.";
			} finally {
				pagando.value = false;
			}
		}
		const cargando = ref(true);
		const novedades = ref([]);
		const barrios = ref([]);
		const total = ref(0);
		const page = ref(1);
		const limit = ref(10);
		const filtros = reactive({
			barrio: "",
			estado: "",
			fechaDesde: "",
			fechaHasta: ""
		});
		const columnas = [
			{
				key: "consecutivo",
				label: "No."
			},
			{
				key: "inmueble",
				label: "Inmueble / Barrio"
			},
			{
				key: "descripcion",
				label: "Descripción"
			},
			{
				key: "fecha",
				label: "Fecha"
			},
			{
				key: "estado",
				label: "Estado"
			},
			{
				key: "impactoFinanciero",
				label: "Impacto financiero"
			},
			{
				key: "acciones",
				label: ""
			}
		];
		const estadoColor = {
			ABIERTA: "amber",
			EN_SEGUIMIENTO: "orange",
			CERRADA: "emerald",
			ANULADA: "gray"
		};
		async function cargar() {
			cargando.value = true;
			try {
				const data = await useApiFetch("/novedades", { params: {
					...filtros,
					page: page.value,
					limit: limit.value
				} });
				novedades.value = data.data;
				total.value = data.total;
				error.value = "";
			} catch (e) {
				error.value = e?.data?.message || "No fue posible cargar las novedades.";
			} finally {
				cargando.value = false;
			}
		}
		watch(() => [
			filtros.barrio,
			filtros.estado,
			filtros.fechaDesde,
			filtros.fechaHasta
		], () => {
			page.value = 1;
			cargar();
		});
		watch(page, cargar);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UButton = Button_default;
			const _component_UCard = Card_default;
			const _component_USelectMenu = SelectMenu_default;
			const _component_UInput = Input_default;
			const _component_UTable = Table_default;
			const _component_UBadge = Badge_default;
			const _component_UIcon = Icon_default;
			const _component_UPagination = Pagination_default;
			const _component_UAlert = Alert_default;
			const _component_UModal = Modal_default;
			const _component_UFormGroup = FormGroup_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-4"><h1 class="text-xl font-semibold text-slate-900">Novedades</h1>`);
			_push(ssrRenderComponent(_component_UButton, {
				color: "amber",
				icon: "i-heroicons-plus",
				to: "/novedades/nueva"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Registrar novedad `);
					else return [createTextVNode(" Registrar novedad ")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			_push(ssrRenderComponent(_component_UCard, { class: "mb-4" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="flex flex-wrap gap-3"${_scopeId}>`);
						_push(ssrRenderComponent(_component_USelectMenu, {
							modelValue: unref(filtros).barrio,
							"onUpdate:modelValue": ($event) => unref(filtros).barrio = $event,
							options: ["", ...unref(barrios)],
							placeholder: "Barrio del inmueble",
							class: "w-52"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_USelectMenu, {
							modelValue: unref(filtros).estado,
							"onUpdate:modelValue": ($event) => unref(filtros).estado = $event,
							options: [
								"",
								"ABIERTA",
								"EN_SEGUIMIENTO",
								"CERRADA",
								"ANULADA"
							],
							placeholder: "Estado",
							class: "w-48"
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
						createVNode(_component_USelectMenu, {
							modelValue: unref(filtros).estado,
							"onUpdate:modelValue": ($event) => unref(filtros).estado = $event,
							options: [
								"",
								"ABIERTA",
								"EN_SEGUIMIENTO",
								"CERRADA",
								"ANULADA"
							],
							placeholder: "Estado",
							class: "w-48"
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
							rows: unref(novedades),
							columns: columnas,
							loading: unref(cargando)
						}, {
							"inmueble-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(`<div${_scopeId}><p class="text-slate-900"${_scopeId}>${ssrInterpolate(row.inmueble?.direccion)}</p><p class="text-xs text-slate-500"${_scopeId}>${ssrInterpolate(row.inmueble?.barrio)}</p></div>`);
								else return [createVNode("div", null, [createVNode("p", { class: "text-slate-900" }, toDisplayString(row.inmueble?.direccion), 1), createVNode("p", { class: "text-xs text-slate-500" }, toDisplayString(row.inmueble?.barrio), 1)])];
							}),
							"fecha-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(unref(fecha)(row.fecha))}`);
								else return [createTextVNode(toDisplayString(unref(fecha)(row.fecha)), 1)];
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
							"impactoFinanciero-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<span class="text-xs text-slate-500"${_scopeId}>${ssrInterpolate(row.impactoFinanciero)}</span>`);
									if (row.impactoFinanciero === "GASTO_INMOBILIARIA") _push(ssrRenderComponent(_component_UBadge, {
										color: row.gastoPagado ? "emerald" : "amber",
										variant: "subtle",
										size: "xs",
										class: "ml-1"
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(`${ssrInterpolate(row.gastoPagado ? "Pagado" : "Pendiente de pago")}`);
											else return [createTextVNode(toDisplayString(row.gastoPagado ? "Pagado" : "Pendiente de pago"), 1)];
										}),
										_: 2
									}, _parent, _scopeId));
									else _push(`<!---->`);
								} else return [createVNode("span", { class: "text-xs text-slate-500" }, toDisplayString(row.impactoFinanciero), 1), row.impactoFinanciero === "GASTO_INMOBILIARIA" ? (openBlock(), createBlock(_component_UBadge, {
									key: 0,
									color: row.gastoPagado ? "emerald" : "amber",
									variant: "subtle",
									size: "xs",
									class: "ml-1"
								}, {
									default: withCtx(() => [createTextVNode(toDisplayString(row.gastoPagado ? "Pagado" : "Pendiente de pago"), 1)]),
									_: 2
								}, 1032, ["color"])) : createCommentVNode("", true)];
							}),
							"acciones-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="flex gap-2"${_scopeId}>`);
									_push(ssrRenderComponent(_component_UButton, {
										size: "xs",
										color: "gray",
										variant: "ghost",
										icon: "i-heroicons-document-arrow-down",
										onClick: ($event) => descargarReciboNovedad(row)
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(` Recibo `);
											else return [createTextVNode(" Recibo ")];
										}),
										_: 2
									}, _parent, _scopeId));
									if (unref(auth).esAdministrador && row.impactoFinanciero === "PENDIENTE") {
										_push(`<!--[-->`);
										_push(ssrRenderComponent(_component_UButton, {
											size: "xs",
											color: "amber",
											variant: "soft",
											onClick: ($event) => abrirAprobacion(row, "CARGO_ARRENDATARIO")
										}, {
											default: withCtx((_, _push, _parent, _scopeId) => {
												if (_push) _push(` Cargo arrendatario `);
												else return [createTextVNode(" Cargo arrendatario ")];
											}),
											_: 2
										}, _parent, _scopeId));
										_push(ssrRenderComponent(_component_UButton, {
											size: "xs",
											color: "orange",
											variant: "soft",
											onClick: ($event) => abrirAprobacion(row, "GASTO_INMOBILIARIA")
										}, {
											default: withCtx((_, _push, _parent, _scopeId) => {
												if (_push) _push(` Gasto inmobiliaria `);
												else return [createTextVNode(" Gasto inmobiliaria ")];
											}),
											_: 2
										}, _parent, _scopeId));
										_push(`<!--]-->`);
									} else _push(`<!---->`);
									if (unref(auth).esAdministrador && row.impactoFinanciero === "GASTO_INMOBILIARIA" && !row.gastoPagado) _push(ssrRenderComponent(_component_UButton, {
										size: "xs",
										color: "red",
										variant: "soft",
										icon: "i-heroicons-banknotes",
										onClick: ($event) => abrirPago(row)
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(` Registrar pago `);
											else return [createTextVNode(" Registrar pago ")];
										}),
										_: 2
									}, _parent, _scopeId));
									else _push(`<!---->`);
									_push(`</div>`);
								} else return [createVNode("div", { class: "flex gap-2" }, [
									createVNode(_component_UButton, {
										size: "xs",
										color: "gray",
										variant: "ghost",
										icon: "i-heroicons-document-arrow-down",
										onClick: ($event) => descargarReciboNovedad(row)
									}, {
										default: withCtx(() => [createTextVNode(" Recibo ")]),
										_: 1
									}, 8, ["onClick"]),
									unref(auth).esAdministrador && row.impactoFinanciero === "PENDIENTE" ? (openBlock(), createBlock(Fragment, { key: 0 }, [createVNode(_component_UButton, {
										size: "xs",
										color: "amber",
										variant: "soft",
										onClick: ($event) => abrirAprobacion(row, "CARGO_ARRENDATARIO")
									}, {
										default: withCtx(() => [createTextVNode(" Cargo arrendatario ")]),
										_: 1
									}, 8, ["onClick"]), createVNode(_component_UButton, {
										size: "xs",
										color: "orange",
										variant: "soft",
										onClick: ($event) => abrirAprobacion(row, "GASTO_INMOBILIARIA")
									}, {
										default: withCtx(() => [createTextVNode(" Gasto inmobiliaria ")]),
										_: 1
									}, 8, ["onClick"])], 64)) : createCommentVNode("", true),
									unref(auth).esAdministrador && row.impactoFinanciero === "GASTO_INMOBILIARIA" && !row.gastoPagado ? (openBlock(), createBlock(_component_UButton, {
										key: 1,
										size: "xs",
										color: "red",
										variant: "soft",
										icon: "i-heroicons-banknotes",
										onClick: ($event) => abrirPago(row)
									}, {
										default: withCtx(() => [createTextVNode(" Registrar pago ")]),
										_: 1
									}, 8, ["onClick"])) : createCommentVNode("", true)
								])];
							}),
							"empty-state": withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="text-center py-10 text-slate-400"${_scopeId}>`);
									_push(ssrRenderComponent(_component_UIcon, {
										name: "i-heroicons-wrench-screwdriver",
										class: "w-10 h-10 mx-auto mb-2"
									}, null, _parent, _scopeId));
									_push(`<p${_scopeId}>No hay novedades registradas con estos filtros.</p></div>`);
								} else return [createVNode("div", { class: "text-center py-10 text-slate-400" }, [createVNode(_component_UIcon, {
									name: "i-heroicons-wrench-screwdriver",
									class: "w-10 h-10 mx-auto mb-2"
								}), createVNode("p", null, "No hay novedades registradas con estos filtros.")])];
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
						rows: unref(novedades),
						columns: columnas,
						loading: unref(cargando)
					}, {
						"inmueble-data": withCtx(({ row }) => [createVNode("div", null, [createVNode("p", { class: "text-slate-900" }, toDisplayString(row.inmueble?.direccion), 1), createVNode("p", { class: "text-xs text-slate-500" }, toDisplayString(row.inmueble?.barrio), 1)])]),
						"fecha-data": withCtx(({ row }) => [createTextVNode(toDisplayString(unref(fecha)(row.fecha)), 1)]),
						"estado-data": withCtx(({ row }) => [createVNode(_component_UBadge, {
							color: estadoColor[row.estado] || "gray",
							variant: "subtle"
						}, {
							default: withCtx(() => [createTextVNode(toDisplayString(row.estado), 1)]),
							_: 2
						}, 1032, ["color"])]),
						"impactoFinanciero-data": withCtx(({ row }) => [createVNode("span", { class: "text-xs text-slate-500" }, toDisplayString(row.impactoFinanciero), 1), row.impactoFinanciero === "GASTO_INMOBILIARIA" ? (openBlock(), createBlock(_component_UBadge, {
							key: 0,
							color: row.gastoPagado ? "emerald" : "amber",
							variant: "subtle",
							size: "xs",
							class: "ml-1"
						}, {
							default: withCtx(() => [createTextVNode(toDisplayString(row.gastoPagado ? "Pagado" : "Pendiente de pago"), 1)]),
							_: 2
						}, 1032, ["color"])) : createCommentVNode("", true)]),
						"acciones-data": withCtx(({ row }) => [createVNode("div", { class: "flex gap-2" }, [
							createVNode(_component_UButton, {
								size: "xs",
								color: "gray",
								variant: "ghost",
								icon: "i-heroicons-document-arrow-down",
								onClick: ($event) => descargarReciboNovedad(row)
							}, {
								default: withCtx(() => [createTextVNode(" Recibo ")]),
								_: 1
							}, 8, ["onClick"]),
							unref(auth).esAdministrador && row.impactoFinanciero === "PENDIENTE" ? (openBlock(), createBlock(Fragment, { key: 0 }, [createVNode(_component_UButton, {
								size: "xs",
								color: "amber",
								variant: "soft",
								onClick: ($event) => abrirAprobacion(row, "CARGO_ARRENDATARIO")
							}, {
								default: withCtx(() => [createTextVNode(" Cargo arrendatario ")]),
								_: 1
							}, 8, ["onClick"]), createVNode(_component_UButton, {
								size: "xs",
								color: "orange",
								variant: "soft",
								onClick: ($event) => abrirAprobacion(row, "GASTO_INMOBILIARIA")
							}, {
								default: withCtx(() => [createTextVNode(" Gasto inmobiliaria ")]),
								_: 1
							}, 8, ["onClick"])], 64)) : createCommentVNode("", true),
							unref(auth).esAdministrador && row.impactoFinanciero === "GASTO_INMOBILIARIA" && !row.gastoPagado ? (openBlock(), createBlock(_component_UButton, {
								key: 1,
								size: "xs",
								color: "red",
								variant: "soft",
								icon: "i-heroicons-banknotes",
								onClick: ($event) => abrirPago(row)
							}, {
								default: withCtx(() => [createTextVNode(" Registrar pago ")]),
								_: 1
							}, 8, ["onClick"])) : createCommentVNode("", true)
						])]),
						"empty-state": withCtx(() => [createVNode("div", { class: "text-center py-10 text-slate-400" }, [createVNode(_component_UIcon, {
							name: "i-heroicons-wrench-screwdriver",
							class: "w-10 h-10 mx-auto mb-2"
						}), createVNode("p", null, "No hay novedades registradas con estos filtros.")])]),
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
				modelValue: unref(modalAbierto),
				"onUpdate:modelValue": ($event) => isRef(modalAbierto) ? modalAbierto.value = $event : null
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UCard, null, {
						header: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(unref(tipoAprobacion) === "CARGO_ARRENDATARIO" ? "Aprobar cargo a arrendatario" : "Aprobar gasto de la inmobiliaria")}</p>`);
							else return [createVNode("p", { class: "font-semibold text-slate-900" }, toDisplayString(unref(tipoAprobacion) === "CARGO_ARRENDATARIO" ? "Aprobar cargo a arrendatario" : "Aprobar gasto de la inmobiliaria"), 1)];
						}),
						footer: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex justify-end gap-2"${_scopeId}>`);
								_push(ssrRenderComponent(_component_UButton, {
									color: "gray",
									variant: "ghost",
									onClick: ($event) => modalAbierto.value = false
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`Cancelar`);
										else return [createTextVNode("Cancelar")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UButton, {
									color: "amber",
									loading: unref(aprobando),
									disabled: unref(montoAprobacion) <= 0,
									onClick: confirmarAprobacion
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(` Confirmar aprobación `);
										else return [createTextVNode(" Confirmar aprobación ")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
								color: "gray",
								variant: "ghost",
								onClick: ($event) => modalAbierto.value = false
							}, {
								default: withCtx(() => [createTextVNode("Cancelar")]),
								_: 1
							}, 8, ["onClick"]), createVNode(_component_UButton, {
								color: "amber",
								loading: unref(aprobando),
								disabled: unref(montoAprobacion) <= 0,
								onClick: confirmarAprobacion
							}, {
								default: withCtx(() => [createTextVNode(" Confirmar aprobación ")]),
								_: 1
							}, 8, ["loading", "disabled"])])];
						}),
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="space-y-3"${_scopeId}><p class="text-sm text-slate-500"${_scopeId}>${ssrInterpolate(unref(tipoAprobacion) === "CARGO_ARRENDATARIO" ? "Se generará una obligación tipo NOVEDAD, cobrable en el próximo recaudo del contrato." : "El gasto quedará asumido por la inmobiliaria y pendiente de pago. Todavía NO se mueve dinero: el movimiento de caja se genera aparte, al registrar el pago real.")}</p>`);
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Concepto" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UInput, {
											modelValue: unref(conceptoAprobacion),
											"onUpdate:modelValue": ($event) => isRef(conceptoAprobacion) ? conceptoAprobacion.value = $event : null
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UInput, {
											modelValue: unref(conceptoAprobacion),
											"onUpdate:modelValue": ($event) => isRef(conceptoAprobacion) ? conceptoAprobacion.value = $event : null
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Monto" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UInput, {
											modelValue: unref(montoAprobacion),
											"onUpdate:modelValue": ($event) => isRef(montoAprobacion) ? montoAprobacion.value = $event : null,
											modelModifiers: { number: true },
											type: "number"
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UInput, {
											modelValue: unref(montoAprobacion),
											"onUpdate:modelValue": ($event) => isRef(montoAprobacion) ? montoAprobacion.value = $event : null,
											modelModifiers: { number: true },
											type: "number"
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`<p class="text-xs text-slate-400"${_scopeId}>${ssrInterpolate(unref(montoAprobacion) > 0 ? unref(moneda)(unref(montoAprobacion)) : "")}</p></div>`);
							} else return [createVNode("div", { class: "space-y-3" }, [
								createVNode("p", { class: "text-sm text-slate-500" }, toDisplayString(unref(tipoAprobacion) === "CARGO_ARRENDATARIO" ? "Se generará una obligación tipo NOVEDAD, cobrable en el próximo recaudo del contrato." : "El gasto quedará asumido por la inmobiliaria y pendiente de pago. Todavía NO se mueve dinero: el movimiento de caja se genera aparte, al registrar el pago real."), 1),
								createVNode(_component_UFormGroup, { label: "Concepto" }, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(conceptoAprobacion),
										"onUpdate:modelValue": ($event) => isRef(conceptoAprobacion) ? conceptoAprobacion.value = $event : null
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode(_component_UFormGroup, { label: "Monto" }, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(montoAprobacion),
										"onUpdate:modelValue": ($event) => isRef(montoAprobacion) ? montoAprobacion.value = $event : null,
										modelModifiers: { number: true },
										type: "number"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode("p", { class: "text-xs text-slate-400" }, toDisplayString(unref(montoAprobacion) > 0 ? unref(moneda)(unref(montoAprobacion)) : ""), 1)
							])];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(_component_UCard, null, {
						header: withCtx(() => [createVNode("p", { class: "font-semibold text-slate-900" }, toDisplayString(unref(tipoAprobacion) === "CARGO_ARRENDATARIO" ? "Aprobar cargo a arrendatario" : "Aprobar gasto de la inmobiliaria"), 1)]),
						footer: withCtx(() => [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
							color: "gray",
							variant: "ghost",
							onClick: ($event) => modalAbierto.value = false
						}, {
							default: withCtx(() => [createTextVNode("Cancelar")]),
							_: 1
						}, 8, ["onClick"]), createVNode(_component_UButton, {
							color: "amber",
							loading: unref(aprobando),
							disabled: unref(montoAprobacion) <= 0,
							onClick: confirmarAprobacion
						}, {
							default: withCtx(() => [createTextVNode(" Confirmar aprobación ")]),
							_: 1
						}, 8, ["loading", "disabled"])])]),
						default: withCtx(() => [createVNode("div", { class: "space-y-3" }, [
							createVNode("p", { class: "text-sm text-slate-500" }, toDisplayString(unref(tipoAprobacion) === "CARGO_ARRENDATARIO" ? "Se generará una obligación tipo NOVEDAD, cobrable en el próximo recaudo del contrato." : "El gasto quedará asumido por la inmobiliaria y pendiente de pago. Todavía NO se mueve dinero: el movimiento de caja se genera aparte, al registrar el pago real."), 1),
							createVNode(_component_UFormGroup, { label: "Concepto" }, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(conceptoAprobacion),
									"onUpdate:modelValue": ($event) => isRef(conceptoAprobacion) ? conceptoAprobacion.value = $event : null
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							createVNode(_component_UFormGroup, { label: "Monto" }, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(montoAprobacion),
									"onUpdate:modelValue": ($event) => isRef(montoAprobacion) ? montoAprobacion.value = $event : null,
									modelModifiers: { number: true },
									type: "number"
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							createVNode("p", { class: "text-xs text-slate-400" }, toDisplayString(unref(montoAprobacion) > 0 ? unref(moneda)(unref(montoAprobacion)) : ""), 1)
						])]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UModal, {
				modelValue: unref(modalPago),
				"onUpdate:modelValue": ($event) => isRef(modalPago) ? modalPago.value = $event : null
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UCard, null, {
						header: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>Registrar pago del gasto</p>`);
							else return [createVNode("p", { class: "font-semibold text-slate-900" }, "Registrar pago del gasto")];
						}),
						footer: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex justify-end gap-2"${_scopeId}>`);
								_push(ssrRenderComponent(_component_UButton, {
									color: "gray",
									variant: "ghost",
									onClick: ($event) => modalPago.value = false
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`Cancelar`);
										else return [createTextVNode("Cancelar")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UButton, {
									color: "red",
									loading: unref(pagando),
									disabled: !unref(medioPago),
									onClick: confirmarPago
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(` Confirmar pago `);
										else return [createTextVNode(" Confirmar pago ")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
								color: "gray",
								variant: "ghost",
								onClick: ($event) => modalPago.value = false
							}, {
								default: withCtx(() => [createTextVNode("Cancelar")]),
								_: 1
							}, 8, ["onClick"]), createVNode(_component_UButton, {
								color: "red",
								loading: unref(pagando),
								disabled: !unref(medioPago),
								onClick: confirmarPago
							}, {
								default: withCtx(() => [createTextVNode(" Confirmar pago ")]),
								_: 1
							}, 8, ["loading", "disabled"])])];
						}),
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="space-y-3"${_scopeId}><p class="text-sm text-slate-500"${_scopeId}> Se generará el movimiento de caja tipo EGRESO por <strong${_scopeId}>${ssrInterpolate(unref(moneda)(unref(novedadPagando)?.montoAprobado))}</strong>. Este es el único paso que mueve dinero. </p>`);
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Medio de pago" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_USelectMenu, {
											modelValue: unref(medioPago),
											"onUpdate:modelValue": ($event) => isRef(medioPago) ? medioPago.value = $event : null,
											options: ["EFECTIVO", "TRANSFERENCIA"],
											placeholder: "Selecciona el medio"
										}, null, _parent, _scopeId));
										else return [createVNode(_component_USelectMenu, {
											modelValue: unref(medioPago),
											"onUpdate:modelValue": ($event) => isRef(medioPago) ? medioPago.value = $event : null,
											options: ["EFECTIVO", "TRANSFERENCIA"],
											placeholder: "Selecciona el medio"
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								if (unref(medioPago) === "TRANSFERENCIA") _push(ssrRenderComponent(_component_UFormGroup, { label: "Referencia / número de transacción" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UInput, {
											modelValue: unref(referenciaPago),
											"onUpdate:modelValue": ($event) => isRef(referenciaPago) ? referenciaPago.value = $event : null,
											placeholder: "Opcional"
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UInput, {
											modelValue: unref(referenciaPago),
											"onUpdate:modelValue": ($event) => isRef(referenciaPago) ? referenciaPago.value = $event : null,
											placeholder: "Opcional"
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								else _push(`<!---->`);
								_push(`</div>`);
							} else return [createVNode("div", { class: "space-y-3" }, [
								createVNode("p", { class: "text-sm text-slate-500" }, [
									createTextVNode(" Se generará el movimiento de caja tipo EGRESO por "),
									createVNode("strong", null, toDisplayString(unref(moneda)(unref(novedadPagando)?.montoAprobado)), 1),
									createTextVNode(". Este es el único paso que mueve dinero. ")
								]),
								createVNode(_component_UFormGroup, { label: "Medio de pago" }, {
									default: withCtx(() => [createVNode(_component_USelectMenu, {
										modelValue: unref(medioPago),
										"onUpdate:modelValue": ($event) => isRef(medioPago) ? medioPago.value = $event : null,
										options: ["EFECTIVO", "TRANSFERENCIA"],
										placeholder: "Selecciona el medio"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								unref(medioPago) === "TRANSFERENCIA" ? (openBlock(), createBlock(_component_UFormGroup, {
									key: 0,
									label: "Referencia / número de transacción"
								}, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(referenciaPago),
										"onUpdate:modelValue": ($event) => isRef(referenciaPago) ? referenciaPago.value = $event : null,
										placeholder: "Opcional"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								})) : createCommentVNode("", true)
							])];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(_component_UCard, null, {
						header: withCtx(() => [createVNode("p", { class: "font-semibold text-slate-900" }, "Registrar pago del gasto")]),
						footer: withCtx(() => [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
							color: "gray",
							variant: "ghost",
							onClick: ($event) => modalPago.value = false
						}, {
							default: withCtx(() => [createTextVNode("Cancelar")]),
							_: 1
						}, 8, ["onClick"]), createVNode(_component_UButton, {
							color: "red",
							loading: unref(pagando),
							disabled: !unref(medioPago),
							onClick: confirmarPago
						}, {
							default: withCtx(() => [createTextVNode(" Confirmar pago ")]),
							_: 1
						}, 8, ["loading", "disabled"])])]),
						default: withCtx(() => [createVNode("div", { class: "space-y-3" }, [
							createVNode("p", { class: "text-sm text-slate-500" }, [
								createTextVNode(" Se generará el movimiento de caja tipo EGRESO por "),
								createVNode("strong", null, toDisplayString(unref(moneda)(unref(novedadPagando)?.montoAprobado)), 1),
								createTextVNode(". Este es el único paso que mueve dinero. ")
							]),
							createVNode(_component_UFormGroup, { label: "Medio de pago" }, {
								default: withCtx(() => [createVNode(_component_USelectMenu, {
									modelValue: unref(medioPago),
									"onUpdate:modelValue": ($event) => isRef(medioPago) ? medioPago.value = $event : null,
									options: ["EFECTIVO", "TRANSFERENCIA"],
									placeholder: "Selecciona el medio"
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							unref(medioPago) === "TRANSFERENCIA" ? (openBlock(), createBlock(_component_UFormGroup, {
								key: 0,
								label: "Referencia / número de transacción"
							}, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(referenciaPago),
									"onUpdate:modelValue": ($event) => isRef(referenciaPago) ? referenciaPago.value = $event : null,
									placeholder: "Opcional"
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							})) : createCommentVNode("", true)
						])]),
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
//#region pages/novedades/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/novedades/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var novedades_default = index_vue_vue_type_script_setup_true_lang_default;

export { novedades_default as default };
//# sourceMappingURL=novedades-BP2q8iU-.mjs.map
