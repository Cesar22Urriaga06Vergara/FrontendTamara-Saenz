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
import { defineComponent, ref, reactive, watch, withCtx, unref, createVNode, openBlock, createBlock, toDisplayString, createTextVNode, createCommentVNode, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
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

//#region pages/movimientos/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* Consulta de movimientos de caja (libro INGRESO/EGRESO) y saldo neto — EXCLUSIVO
		* Administrador (protegido también por middleware/auth.global.ts). Los movimientos de
		* origen RECAUDO se corrigen anulando el recibo asociado desde Recaudo; los de origen
		* NOVEDAD/DEPOSITO se corrigen aquí mismo con reverso manual (AUD-008), que es el único
		* mecanismo de corrección que tienen (no existe "anular novedad"/"anular liquidación").
		*/
		const { moneda, fecha } = useFormatoCO();
		const error = ref("");
		const cargando = ref(true);
		const movimientos = ref([]);
		const total = ref(0);
		const page = ref(1);
		const limit = ref(15);
		const saldoPorMedio = ref(null);
		const cargandoSaldo = ref(true);
		const filtros = reactive({
			tipo: "",
			origen: "",
			medioPago: "",
			desde: "",
			hasta: ""
		});
		const columnas = [
			{
				key: "creadoEn",
				label: "Fecha"
			},
			{
				key: "tipo",
				label: "Tipo"
			},
			{
				key: "origen",
				label: "Origen"
			},
			{
				key: "medioPago",
				label: "Medio"
			},
			{
				key: "consecutivo",
				label: "Consecutivo"
			},
			{
				key: "concepto",
				label: "Concepto"
			},
			{
				key: "monto",
				label: "Monto"
			},
			{
				key: "acciones",
				label: ""
			}
		];
		function puedeReversar(row) {
			return (row.origen === "NOVEDAD" || row.origen === "DEPOSITO") && !row.esReverso;
		}
		const modalReversar = ref(false);
		const movimientoReversando = ref(null);
		const motivoReverso = ref("");
		const reversando = ref(false);
		function abrirReversar(row) {
			error.value = "";
			movimientoReversando.value = row;
			motivoReverso.value = "";
			modalReversar.value = true;
		}
		async function confirmarReversar() {
			if (!movimientoReversando.value || !motivoReverso.value) return;
			reversando.value = true;
			try {
				await useApiFetch(`/movimientos/${movimientoReversando.value.id}/reversar`, {
					method: "PATCH",
					body: { motivo: motivoReverso.value }
				});
				modalReversar.value = false;
				await Promise.all([cargar(), cargarSaldoPorMedio()]);
			} catch (e) {
				error.value = e?.data?.message || "No fue posible reversar el movimiento.";
			} finally {
				reversando.value = false;
			}
		}
		const tipoColor = {
			INGRESO: "emerald",
			EGRESO: "red"
		};
		async function cargar() {
			cargando.value = true;
			error.value = "";
			try {
				const data = await useApiFetch("/movimientos", { params: {
					...filtros,
					page: page.value,
					limit: limit.value
				} });
				movimientos.value = data.data;
				total.value = data.total;
			} catch (e) {
				error.value = e?.data?.message || "No fue posible cargar los movimientos.";
			} finally {
				cargando.value = false;
			}
		}
		async function cargarSaldoPorMedio() {
			cargandoSaldo.value = true;
			try {
				saldoPorMedio.value = await useApiFetch("/movimientos/saldo-por-medio");
			} catch (e) {
				error.value = e?.data?.message || "No fue posible cargar el saldo por medio.";
			} finally {
				cargandoSaldo.value = false;
			}
		}
		watch(() => [
			filtros.tipo,
			filtros.origen,
			filtros.medioPago,
			filtros.desde,
			filtros.hasta
		], () => {
			page.value = 1;
			cargar();
		});
		watch(page, cargar);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UCard = Card_default;
			const _component_UAlert = Alert_default;
			const _component_USelectMenu = SelectMenu_default;
			const _component_UInput = Input_default;
			const _component_UTable = Table_default;
			const _component_UBadge = Badge_default;
			const _component_UButton = Button_default;
			const _component_UIcon = Icon_default;
			const _component_UPagination = Pagination_default;
			const _component_UModal = Modal_default;
			const _component_UFormGroup = FormGroup_default;
			const _component_UTextarea = Textarea_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-4 flex-wrap gap-3"><h1 class="text-xl font-semibold text-slate-900">Movimientos de caja</h1><div class="flex gap-3 flex-wrap">`);
			_push(ssrRenderComponent(_component_UCard, { ui: { body: { padding: "px-4 py-2" } } }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<p class="text-xs text-slate-500"${_scopeId}>Caja física (efectivo)</p>`);
						if (unref(cargandoSaldo)) _push(`<p class="text-sm text-slate-400"${_scopeId}>Cargando…</p>`);
						else _push(`<p class="${ssrRenderClass([Number(unref(saldoPorMedio)?.efectivo) >= 0 ? "text-emerald-600" : "text-red-600", "text-xl font-bold"])}"${_scopeId}>${ssrInterpolate(unref(moneda)(unref(saldoPorMedio)?.efectivo ?? 0))}</p>`);
					} else return [createVNode("p", { class: "text-xs text-slate-500" }, "Caja física (efectivo)"), unref(cargandoSaldo) ? (openBlock(), createBlock("p", {
						key: 0,
						class: "text-sm text-slate-400"
					}, "Cargando…")) : (openBlock(), createBlock("p", {
						key: 1,
						class: ["text-xl font-bold", Number(unref(saldoPorMedio)?.efectivo) >= 0 ? "text-emerald-600" : "text-red-600"]
					}, toDisplayString(unref(moneda)(unref(saldoPorMedio)?.efectivo ?? 0)), 3))];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UCard, { ui: { body: { padding: "px-4 py-2" } } }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<p class="text-xs text-slate-500"${_scopeId}>Transferencias (banco)</p>`);
						if (unref(cargandoSaldo)) _push(`<p class="text-sm text-slate-400"${_scopeId}>Cargando…</p>`);
						else _push(`<p class="${ssrRenderClass([Number(unref(saldoPorMedio)?.transferencia) >= 0 ? "text-emerald-600" : "text-red-600", "text-xl font-bold"])}"${_scopeId}>${ssrInterpolate(unref(moneda)(unref(saldoPorMedio)?.transferencia ?? 0))}</p>`);
					} else return [createVNode("p", { class: "text-xs text-slate-500" }, "Transferencias (banco)"), unref(cargandoSaldo) ? (openBlock(), createBlock("p", {
						key: 0,
						class: "text-sm text-slate-400"
					}, "Cargando…")) : (openBlock(), createBlock("p", {
						key: 1,
						class: ["text-xl font-bold", Number(unref(saldoPorMedio)?.transferencia) >= 0 ? "text-emerald-600" : "text-red-600"]
					}, toDisplayString(unref(moneda)(unref(saldoPorMedio)?.transferencia ?? 0)), 3))];
				}),
				_: 1
			}, _parent));
			if (!unref(cargandoSaldo) && unref(saldoPorMedio)?.sinMedio) _push(ssrRenderComponent(_component_UCard, {
				ui: { body: { padding: "px-4 py-2" } },
				class: "border-amber-300"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<p class="text-xs text-amber-600"${_scopeId}>Sin medio identificado</p><p class="text-xl font-bold text-amber-600"${_scopeId}>${ssrInterpolate(unref(moneda)(unref(saldoPorMedio).sinMedio))}</p>`);
					else return [createVNode("p", { class: "text-xs text-amber-600" }, "Sin medio identificado"), createVNode("p", { class: "text-xl font-bold text-amber-600" }, toDisplayString(unref(moneda)(unref(saldoPorMedio).sinMedio)), 1)];
				}),
				_: 1
			}, _parent));
			else _push(`<!---->`);
			_push(`</div></div>`);
			if (unref(error)) _push(ssrRenderComponent(_component_UAlert, {
				color: "red",
				variant: "subtle",
				title: unref(error),
				class: "mb-4"
			}, null, _parent));
			else _push(`<!---->`);
			if (!unref(cargandoSaldo) && unref(saldoPorMedio)?.sinMedio) _push(ssrRenderComponent(_component_UAlert, {
				color: "amber",
				variant: "subtle",
				title: "Hay movimientos sin medio de pago identificado",
				description: "Corresponden a egresos de novedades/depósitos aún no ligados a un pago real con medio explícito. No están incluidos en caja física ni en transferencias — revísalos para no subestimar ninguno de los dos saldos.",
				class: "mb-4"
			}, null, _parent));
			else _push(`<!---->`);
			_push(ssrRenderComponent(_component_UCard, { class: "mb-4" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="flex flex-wrap gap-3"${_scopeId}>`);
						_push(ssrRenderComponent(_component_USelectMenu, {
							modelValue: unref(filtros).tipo,
							"onUpdate:modelValue": ($event) => unref(filtros).tipo = $event,
							options: [
								"",
								"INGRESO",
								"EGRESO"
							],
							placeholder: "Tipo",
							class: "w-40"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_USelectMenu, {
							modelValue: unref(filtros).origen,
							"onUpdate:modelValue": ($event) => unref(filtros).origen = $event,
							options: [
								"",
								"RECAUDO",
								"NOVEDAD",
								"DEPOSITO",
								"MANUAL"
							],
							placeholder: "Origen",
							class: "w-44"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_USelectMenu, {
							modelValue: unref(filtros).medioPago,
							"onUpdate:modelValue": ($event) => unref(filtros).medioPago = $event,
							options: [
								"",
								"EFECTIVO",
								"TRANSFERENCIA"
							],
							placeholder: "Medio",
							class: "w-40"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_UInput, {
							modelValue: unref(filtros).desde,
							"onUpdate:modelValue": ($event) => unref(filtros).desde = $event,
							type: "date",
							class: "w-40"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_UInput, {
							modelValue: unref(filtros).hasta,
							"onUpdate:modelValue": ($event) => unref(filtros).hasta = $event,
							type: "date",
							class: "w-40"
						}, null, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "flex flex-wrap gap-3" }, [
						createVNode(_component_USelectMenu, {
							modelValue: unref(filtros).tipo,
							"onUpdate:modelValue": ($event) => unref(filtros).tipo = $event,
							options: [
								"",
								"INGRESO",
								"EGRESO"
							],
							placeholder: "Tipo",
							class: "w-40"
						}, null, 8, ["modelValue", "onUpdate:modelValue"]),
						createVNode(_component_USelectMenu, {
							modelValue: unref(filtros).origen,
							"onUpdate:modelValue": ($event) => unref(filtros).origen = $event,
							options: [
								"",
								"RECAUDO",
								"NOVEDAD",
								"DEPOSITO",
								"MANUAL"
							],
							placeholder: "Origen",
							class: "w-44"
						}, null, 8, ["modelValue", "onUpdate:modelValue"]),
						createVNode(_component_USelectMenu, {
							modelValue: unref(filtros).medioPago,
							"onUpdate:modelValue": ($event) => unref(filtros).medioPago = $event,
							options: [
								"",
								"EFECTIVO",
								"TRANSFERENCIA"
							],
							placeholder: "Medio",
							class: "w-40"
						}, null, 8, ["modelValue", "onUpdate:modelValue"]),
						createVNode(_component_UInput, {
							modelValue: unref(filtros).desde,
							"onUpdate:modelValue": ($event) => unref(filtros).desde = $event,
							type: "date",
							class: "w-40"
						}, null, 8, ["modelValue", "onUpdate:modelValue"]),
						createVNode(_component_UInput, {
							modelValue: unref(filtros).hasta,
							"onUpdate:modelValue": ($event) => unref(filtros).hasta = $event,
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
							rows: unref(movimientos),
							columns: columnas,
							loading: unref(cargando)
						}, {
							"creadoEn-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(unref(fecha)(row.creadoEn))}`);
								else return [createTextVNode(toDisplayString(unref(fecha)(row.creadoEn)), 1)];
							}),
							"tipo-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_component_UBadge, {
									color: tipoColor[row.tipo] || "gray",
									variant: "subtle"
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`${ssrInterpolate(row.tipo)}`);
										else return [createTextVNode(toDisplayString(row.tipo), 1)];
									}),
									_: 2
								}, _parent, _scopeId));
								else return [createVNode(_component_UBadge, {
									color: tipoColor[row.tipo] || "gray",
									variant: "subtle"
								}, {
									default: withCtx(() => [createTextVNode(toDisplayString(row.tipo), 1)]),
									_: 2
								}, 1032, ["color"])];
							}),
							"medioPago-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) {
									if (row.medioPago) _push(`<span class="text-sm text-slate-700"${_scopeId}>${ssrInterpolate(row.medioPago)}</span>`);
									else _push(`<span class="text-xs text-amber-600"${_scopeId}>Sin identificar</span>`);
								} else return [row.medioPago ? (openBlock(), createBlock("span", {
									key: 0,
									class: "text-sm text-slate-700"
								}, toDisplayString(row.medioPago), 1)) : (openBlock(), createBlock("span", {
									key: 1,
									class: "text-xs text-amber-600"
								}, "Sin identificar"))];
							}),
							"consecutivo-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(row.consecutivo || "—")}`);
								else return [createTextVNode(toDisplayString(row.consecutivo || "—"), 1)];
							}),
							"concepto-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div${_scopeId}><p${_scopeId}>${ssrInterpolate(row.concepto)}</p>`);
									if (row.esReverso) _push(`<p class="text-xs text-amber-600"${_scopeId}>Reverso de otro movimiento</p>`);
									else _push(`<!---->`);
									_push(`</div>`);
								} else return [createVNode("div", null, [createVNode("p", null, toDisplayString(row.concepto), 1), row.esReverso ? (openBlock(), createBlock("p", {
									key: 0,
									class: "text-xs text-amber-600"
								}, "Reverso de otro movimiento")) : createCommentVNode("", true)])];
							}),
							"monto-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(unref(moneda)(row.monto))}`);
								else return [createTextVNode(toDisplayString(unref(moneda)(row.monto)), 1)];
							}),
							"acciones-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) {
									if (puedeReversar(row)) _push(ssrRenderComponent(_component_UButton, {
										icon: "i-heroicons-arrow-uturn-left",
										color: "gray",
										variant: "ghost",
										size: "sm",
										onClick: ($event) => abrirReversar(row)
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(` Reversar `);
											else return [createTextVNode(" Reversar ")];
										}),
										_: 2
									}, _parent, _scopeId));
									else _push(`<!---->`);
								} else return [puedeReversar(row) ? (openBlock(), createBlock(_component_UButton, {
									key: 0,
									icon: "i-heroicons-arrow-uturn-left",
									color: "gray",
									variant: "ghost",
									size: "sm",
									onClick: ($event) => abrirReversar(row)
								}, {
									default: withCtx(() => [createTextVNode(" Reversar ")]),
									_: 1
								}, 8, ["onClick"])) : createCommentVNode("", true)];
							}),
							"empty-state": withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="text-center py-10 text-slate-400"${_scopeId}>`);
									_push(ssrRenderComponent(_component_UIcon, {
										name: "i-heroicons-arrows-right-left",
										class: "w-10 h-10 mx-auto mb-2"
									}, null, _parent, _scopeId));
									_push(`<p${_scopeId}>No hay movimientos que coincidan con los filtros.</p></div>`);
								} else return [createVNode("div", { class: "text-center py-10 text-slate-400" }, [createVNode(_component_UIcon, {
									name: "i-heroicons-arrows-right-left",
									class: "w-10 h-10 mx-auto mb-2"
								}), createVNode("p", null, "No hay movimientos que coincidan con los filtros.")])];
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
						rows: unref(movimientos),
						columns: columnas,
						loading: unref(cargando)
					}, {
						"creadoEn-data": withCtx(({ row }) => [createTextVNode(toDisplayString(unref(fecha)(row.creadoEn)), 1)]),
						"tipo-data": withCtx(({ row }) => [createVNode(_component_UBadge, {
							color: tipoColor[row.tipo] || "gray",
							variant: "subtle"
						}, {
							default: withCtx(() => [createTextVNode(toDisplayString(row.tipo), 1)]),
							_: 2
						}, 1032, ["color"])]),
						"medioPago-data": withCtx(({ row }) => [row.medioPago ? (openBlock(), createBlock("span", {
							key: 0,
							class: "text-sm text-slate-700"
						}, toDisplayString(row.medioPago), 1)) : (openBlock(), createBlock("span", {
							key: 1,
							class: "text-xs text-amber-600"
						}, "Sin identificar"))]),
						"consecutivo-data": withCtx(({ row }) => [createTextVNode(toDisplayString(row.consecutivo || "—"), 1)]),
						"concepto-data": withCtx(({ row }) => [createVNode("div", null, [createVNode("p", null, toDisplayString(row.concepto), 1), row.esReverso ? (openBlock(), createBlock("p", {
							key: 0,
							class: "text-xs text-amber-600"
						}, "Reverso de otro movimiento")) : createCommentVNode("", true)])]),
						"monto-data": withCtx(({ row }) => [createTextVNode(toDisplayString(unref(moneda)(row.monto)), 1)]),
						"acciones-data": withCtx(({ row }) => [puedeReversar(row) ? (openBlock(), createBlock(_component_UButton, {
							key: 0,
							icon: "i-heroicons-arrow-uturn-left",
							color: "gray",
							variant: "ghost",
							size: "sm",
							onClick: ($event) => abrirReversar(row)
						}, {
							default: withCtx(() => [createTextVNode(" Reversar ")]),
							_: 1
						}, 8, ["onClick"])) : createCommentVNode("", true)]),
						"empty-state": withCtx(() => [createVNode("div", { class: "text-center py-10 text-slate-400" }, [createVNode(_component_UIcon, {
							name: "i-heroicons-arrows-right-left",
							class: "w-10 h-10 mx-auto mb-2"
						}), createVNode("p", null, "No hay movimientos que coincidan con los filtros.")])]),
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
			_push(ssrRenderComponent(_component_UModal, {
				modelValue: unref(modalReversar),
				"onUpdate:modelValue": ($event) => isRef(modalReversar) ? modalReversar.value = $event : null
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UCard, null, {
						header: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>Reversar movimiento</p>`);
							else return [createVNode("p", { class: "font-semibold text-slate-900" }, "Reversar movimiento")];
						}),
						footer: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex justify-end gap-2"${_scopeId}>`);
								_push(ssrRenderComponent(_component_UButton, {
									color: "gray",
									variant: "ghost",
									onClick: ($event) => modalReversar.value = false
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`Cancelar`);
										else return [createTextVNode("Cancelar")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UButton, {
									color: "red",
									loading: unref(reversando),
									disabled: !unref(motivoReverso),
									onClick: confirmarReversar
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(` Reversar movimiento `);
										else return [createTextVNode(" Reversar movimiento ")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
								color: "gray",
								variant: "ghost",
								onClick: ($event) => modalReversar.value = false
							}, {
								default: withCtx(() => [createTextVNode("Cancelar")]),
								_: 1
							}, 8, ["onClick"]), createVNode(_component_UButton, {
								color: "red",
								loading: unref(reversando),
								disabled: !unref(motivoReverso),
								onClick: confirmarReversar
							}, {
								default: withCtx(() => [createTextVNode(" Reversar movimiento ")]),
								_: 1
							}, 8, ["loading", "disabled"])])];
						}),
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<p class="text-sm text-slate-500 mb-3"${_scopeId}> Se creará un movimiento de signo contrario referenciando a <strong${_scopeId}>${ssrInterpolate(unref(movimientoReversando)?.consecutivo || unref(movimientoReversando)?.concepto)}</strong>. El movimiento original no se elimina. </p>`);
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Motivo del reverso" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UTextarea, {
											modelValue: unref(motivoReverso),
											"onUpdate:modelValue": ($event) => isRef(motivoReverso) ? motivoReverso.value = $event : null,
											placeholder: "Ej: error en el monto registrado"
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UTextarea, {
											modelValue: unref(motivoReverso),
											"onUpdate:modelValue": ($event) => isRef(motivoReverso) ? motivoReverso.value = $event : null,
											placeholder: "Ej: error en el monto registrado"
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
							} else return [createVNode("p", { class: "text-sm text-slate-500 mb-3" }, [
								createTextVNode(" Se creará un movimiento de signo contrario referenciando a "),
								createVNode("strong", null, toDisplayString(unref(movimientoReversando)?.consecutivo || unref(movimientoReversando)?.concepto), 1),
								createTextVNode(". El movimiento original no se elimina. ")
							]), createVNode(_component_UFormGroup, { label: "Motivo del reverso" }, {
								default: withCtx(() => [createVNode(_component_UTextarea, {
									modelValue: unref(motivoReverso),
									"onUpdate:modelValue": ($event) => isRef(motivoReverso) ? motivoReverso.value = $event : null,
									placeholder: "Ej: error en el monto registrado"
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							})];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(_component_UCard, null, {
						header: withCtx(() => [createVNode("p", { class: "font-semibold text-slate-900" }, "Reversar movimiento")]),
						footer: withCtx(() => [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
							color: "gray",
							variant: "ghost",
							onClick: ($event) => modalReversar.value = false
						}, {
							default: withCtx(() => [createTextVNode("Cancelar")]),
							_: 1
						}, 8, ["onClick"]), createVNode(_component_UButton, {
							color: "red",
							loading: unref(reversando),
							disabled: !unref(motivoReverso),
							onClick: confirmarReversar
						}, {
							default: withCtx(() => [createTextVNode(" Reversar movimiento ")]),
							_: 1
						}, 8, ["loading", "disabled"])])]),
						default: withCtx(() => [createVNode("p", { class: "text-sm text-slate-500 mb-3" }, [
							createTextVNode(" Se creará un movimiento de signo contrario referenciando a "),
							createVNode("strong", null, toDisplayString(unref(movimientoReversando)?.consecutivo || unref(movimientoReversando)?.concepto), 1),
							createTextVNode(". El movimiento original no se elimina. ")
						]), createVNode(_component_UFormGroup, { label: "Motivo del reverso" }, {
							default: withCtx(() => [createVNode(_component_UTextarea, {
								modelValue: unref(motivoReverso),
								"onUpdate:modelValue": ($event) => isRef(motivoReverso) ? motivoReverso.value = $event : null,
								placeholder: "Ej: error en el monto registrado"
							}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
							_: 1
						})]),
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
//#region pages/movimientos/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/movimientos/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var movimientos_default = index_vue_vue_type_script_setup_true_lang_default;

export { movimientos_default as default };
//# sourceMappingURL=movimientos-sqySOkkS.mjs.map
