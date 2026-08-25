import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { t as Table_default } from './Table-BjAsSJoi.mjs';
import { t as Badge_default } from './Badge-Dji78drx.mjs';
import { t as Alert_default } from './Alert-Bv_RgsgM.mjs';
import { t as FormGroup_default } from './FormGroup-Y-Nkh3aN.mjs';
import { t as Card_default } from './Card-j-DCNf6K.mjs';
import { t as Pagination_default } from './Pagination-CVW3oGYj.mjs';
import { t as Modal_default } from './Modal-B8wn1zi5.mjs';
import { t as Button_default } from './Button-CoYovqJ9.mjs';
import { t as Input_default } from './Input-BVUEIOT9.mjs';
import { t as Textarea_default } from './Textarea-E1R2aU6E.mjs';
import { u as useApiFetch } from './useApiFetch-B8kTc45P.mjs';
import { u as useFormatoCO } from './useFormatoCO-CX_CcnnC.mjs';
import { defineComponent, ref, watch, reactive, computed, unref, withCtx, createTextVNode, createVNode, openBlock, createBlock, toDisplayString, isRef, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
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

//#region pages/caja/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* Módulo de Caja física (§15, CAJA-02) — EXCLUSIVO Administrador (protegido también por
		* middleware/auth.global.ts). Muestra el saldo esperado en vivo (saldo inicial + ingresos -
		* egresos - devoluciones en efectivo, calculado 100% en el backend) y permite registrar un
		* arqueo comparando contra el conteo físico real.
		*/
		const { moneda, fecha } = useFormatoCO();
		const cargandoSaldo = ref(true);
		const saldo = ref(null);
		const error = ref("");
		async function cargarSaldo() {
			cargandoSaldo.value = true;
			try {
				saldo.value = await useApiFetch("/caja/saldo-esperado");
				error.value = "";
			} catch (e) {
				error.value = e?.data?.message || "No fue posible cargar el saldo esperado de caja.";
			} finally {
				cargandoSaldo.value = false;
			}
		}
		const arqueos = ref([]);
		const cargandoArqueos = ref(true);
		const total = ref(0);
		const page = ref(1);
		const limit = ref(10);
		const columnas = [
			{
				key: "creadoEn",
				label: "Fecha"
			},
			{
				key: "saldoEsperado",
				label: "Esperado"
			},
			{
				key: "saldoContado",
				label: "Contado"
			},
			{
				key: "diferencia",
				label: "Diferencia"
			},
			{
				key: "registradoPorEmail",
				label: "Registrado por"
			}
		];
		async function cargarArqueos() {
			cargandoArqueos.value = true;
			try {
				const data = await useApiFetch("/caja/arqueos", { params: {
					page: page.value,
					limit: limit.value
				} });
				arqueos.value = data.data;
				total.value = data.total;
			} catch (e) {
				error.value = e?.data?.message || "No fue posible cargar el historial de arqueos.";
			} finally {
				cargandoArqueos.value = false;
			}
		}
		watch(page, cargarArqueos);
		const modalArqueo = ref(false);
		const registrando = ref(false);
		const formArqueo = reactive({
			saldoContado: 0,
			observaciones: ""
		});
		function abrirArqueo() {
			error.value = "";
			formArqueo.saldoContado = Number(saldo.value?.saldoEsperado ?? 0);
			formArqueo.observaciones = "";
			modalArqueo.value = true;
		}
		const diferenciaPreview = computed(() => formArqueo.saldoContado - Number(saldo.value?.saldoEsperado ?? 0));
		async function confirmarArqueo() {
			registrando.value = true;
			try {
				await useApiFetch("/caja/arqueos", {
					method: "POST",
					body: {
						saldoContado: formArqueo.saldoContado,
						observaciones: formArqueo.observaciones || void 0
					}
				});
				modalArqueo.value = false;
				await Promise.all([cargarSaldo(), cargarArqueos()]);
			} catch (e) {
				error.value = e?.data?.message || "No fue posible registrar el arqueo.";
			} finally {
				registrando.value = false;
			}
		}
		function colorDiferencia(valor) {
			if (Number(valor) > 0) return "emerald";
			if (Number(valor) < 0) return "red";
			return "gray";
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UButton = Button_default;
			const _component_UAlert = Alert_default;
			const _component_UCard = Card_default;
			const _component_UTable = Table_default;
			const _component_UBadge = Badge_default;
			const _component_UIcon = Icon_default;
			const _component_UPagination = Pagination_default;
			const _component_UModal = Modal_default;
			const _component_UFormGroup = FormGroup_default;
			const _component_UInput = Input_default;
			const _component_UTextarea = Textarea_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-4"><h1 class="text-xl font-semibold text-slate-900">Caja</h1>`);
			_push(ssrRenderComponent(_component_UButton, {
				color: "amber",
				icon: "i-heroicons-calculator",
				disabled: unref(cargandoSaldo),
				onClick: abrirArqueo
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Registrar arqueo `);
					else return [createTextVNode(" Registrar arqueo ")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			if (unref(error)) _push(ssrRenderComponent(_component_UAlert, {
				color: "red",
				variant: "subtle",
				title: unref(error),
				class: "mb-4"
			}, null, _parent));
			else _push(`<!---->`);
			_push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">`);
			_push(ssrRenderComponent(_component_UCard, null, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<p class="text-xs text-slate-500 mb-1"${_scopeId}>Saldo inicial</p>`);
						if (unref(cargandoSaldo)) _push(`<p class="text-slate-400 text-sm"${_scopeId}>Cargando…</p>`);
						else _push(`<p class="text-lg font-bold text-slate-900"${_scopeId}>${ssrInterpolate(unref(moneda)(unref(saldo)?.saldoInicial))}</p>`);
					} else return [createVNode("p", { class: "text-xs text-slate-500 mb-1" }, "Saldo inicial"), unref(cargandoSaldo) ? (openBlock(), createBlock("p", {
						key: 0,
						class: "text-slate-400 text-sm"
					}, "Cargando…")) : (openBlock(), createBlock("p", {
						key: 1,
						class: "text-lg font-bold text-slate-900"
					}, toDisplayString(unref(moneda)(unref(saldo)?.saldoInicial)), 1))];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UCard, null, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<p class="text-xs text-slate-500 mb-1"${_scopeId}>Ingresos efectivo</p>`);
						if (unref(cargandoSaldo)) _push(`<p class="text-slate-400 text-sm"${_scopeId}>Cargando…</p>`);
						else _push(`<p class="text-lg font-bold text-emerald-600"${_scopeId}>${ssrInterpolate(unref(moneda)(unref(saldo)?.ingresosEfectivo))}</p>`);
					} else return [createVNode("p", { class: "text-xs text-slate-500 mb-1" }, "Ingresos efectivo"), unref(cargandoSaldo) ? (openBlock(), createBlock("p", {
						key: 0,
						class: "text-slate-400 text-sm"
					}, "Cargando…")) : (openBlock(), createBlock("p", {
						key: 1,
						class: "text-lg font-bold text-emerald-600"
					}, toDisplayString(unref(moneda)(unref(saldo)?.ingresosEfectivo)), 1))];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UCard, null, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<p class="text-xs text-slate-500 mb-1"${_scopeId}>Egresos + devoluciones</p>`);
						if (unref(cargandoSaldo)) _push(`<p class="text-slate-400 text-sm"${_scopeId}>Cargando…</p>`);
						else _push(`<p class="text-lg font-bold text-red-600"${_scopeId}>${ssrInterpolate(unref(moneda)(Number(unref(saldo)?.egresosEfectivo ?? 0) + Number(unref(saldo)?.devolucionesEfectivo ?? 0)))}</p>`);
					} else return [createVNode("p", { class: "text-xs text-slate-500 mb-1" }, "Egresos + devoluciones"), unref(cargandoSaldo) ? (openBlock(), createBlock("p", {
						key: 0,
						class: "text-slate-400 text-sm"
					}, "Cargando…")) : (openBlock(), createBlock("p", {
						key: 1,
						class: "text-lg font-bold text-red-600"
					}, toDisplayString(unref(moneda)(Number(unref(saldo)?.egresosEfectivo ?? 0) + Number(unref(saldo)?.devolucionesEfectivo ?? 0))), 1))];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UCard, { class: "border-amber-300" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<p class="text-xs text-slate-500 mb-1"${_scopeId}>Saldo esperado (en vivo)</p>`);
						if (unref(cargandoSaldo)) _push(`<p class="text-slate-400 text-sm"${_scopeId}>Cargando…</p>`);
						else _push(`<p class="text-lg font-bold text-amber-600"${_scopeId}>${ssrInterpolate(unref(moneda)(unref(saldo)?.saldoEsperado))}</p>`);
					} else return [createVNode("p", { class: "text-xs text-slate-500 mb-1" }, "Saldo esperado (en vivo)"), unref(cargandoSaldo) ? (openBlock(), createBlock("p", {
						key: 0,
						class: "text-slate-400 text-sm"
					}, "Cargando…")) : (openBlock(), createBlock("p", {
						key: 1,
						class: "text-lg font-bold text-amber-600"
					}, toDisplayString(unref(moneda)(unref(saldo)?.saldoEsperado)), 1))];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			_push(ssrRenderComponent(_component_UCard, null, {
				header: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>Historial de arqueos</p>`);
					else return [createVNode("p", { class: "font-semibold text-slate-900" }, "Historial de arqueos")];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_UTable, {
							rows: unref(arqueos),
							columns: columnas,
							loading: unref(cargandoArqueos)
						}, {
							"creadoEn-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(unref(fecha)(row.creadoEn))}`);
								else return [createTextVNode(toDisplayString(unref(fecha)(row.creadoEn)), 1)];
							}),
							"saldoEsperado-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(unref(moneda)(row.saldoEsperado))}`);
								else return [createTextVNode(toDisplayString(unref(moneda)(row.saldoEsperado)), 1)];
							}),
							"saldoContado-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(unref(moneda)(row.saldoContado))}`);
								else return [createTextVNode(toDisplayString(unref(moneda)(row.saldoContado)), 1)];
							}),
							"diferencia-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_component_UBadge, {
									color: colorDiferencia(row.diferencia),
									variant: "subtle"
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`${ssrInterpolate(Number(row.diferencia) > 0 ? "+" : "")}${ssrInterpolate(unref(moneda)(row.diferencia))}`);
										else return [createTextVNode(toDisplayString(Number(row.diferencia) > 0 ? "+" : "") + toDisplayString(unref(moneda)(row.diferencia)), 1)];
									}),
									_: 2
								}, _parent, _scopeId));
								else return [createVNode(_component_UBadge, {
									color: colorDiferencia(row.diferencia),
									variant: "subtle"
								}, {
									default: withCtx(() => [createTextVNode(toDisplayString(Number(row.diferencia) > 0 ? "+" : "") + toDisplayString(unref(moneda)(row.diferencia)), 1)]),
									_: 2
								}, 1032, ["color"])];
							}),
							"empty-state": withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="text-center py-10 text-slate-400"${_scopeId}>`);
									_push(ssrRenderComponent(_component_UIcon, {
										name: "i-heroicons-calculator",
										class: "w-10 h-10 mx-auto mb-2"
									}, null, _parent, _scopeId));
									_push(`<p${_scopeId}>Todavía no se ha registrado ningún arqueo de caja.</p></div>`);
								} else return [createVNode("div", { class: "text-center py-10 text-slate-400" }, [createVNode(_component_UIcon, {
									name: "i-heroicons-calculator",
									class: "w-10 h-10 mx-auto mb-2"
								}), createVNode("p", null, "Todavía no se ha registrado ningún arqueo de caja.")])];
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
						rows: unref(arqueos),
						columns: columnas,
						loading: unref(cargandoArqueos)
					}, {
						"creadoEn-data": withCtx(({ row }) => [createTextVNode(toDisplayString(unref(fecha)(row.creadoEn)), 1)]),
						"saldoEsperado-data": withCtx(({ row }) => [createTextVNode(toDisplayString(unref(moneda)(row.saldoEsperado)), 1)]),
						"saldoContado-data": withCtx(({ row }) => [createTextVNode(toDisplayString(unref(moneda)(row.saldoContado)), 1)]),
						"diferencia-data": withCtx(({ row }) => [createVNode(_component_UBadge, {
							color: colorDiferencia(row.diferencia),
							variant: "subtle"
						}, {
							default: withCtx(() => [createTextVNode(toDisplayString(Number(row.diferencia) > 0 ? "+" : "") + toDisplayString(unref(moneda)(row.diferencia)), 1)]),
							_: 2
						}, 1032, ["color"])]),
						"empty-state": withCtx(() => [createVNode("div", { class: "text-center py-10 text-slate-400" }, [createVNode(_component_UIcon, {
							name: "i-heroicons-calculator",
							class: "w-10 h-10 mx-auto mb-2"
						}), createVNode("p", null, "Todavía no se ha registrado ningún arqueo de caja.")])]),
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
				modelValue: unref(modalArqueo),
				"onUpdate:modelValue": ($event) => isRef(modalArqueo) ? modalArqueo.value = $event : null
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UCard, null, {
						header: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>Registrar arqueo de caja</p>`);
							else return [createVNode("p", { class: "font-semibold text-slate-900" }, "Registrar arqueo de caja")];
						}),
						footer: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex justify-end gap-2"${_scopeId}>`);
								_push(ssrRenderComponent(_component_UButton, {
									color: "gray",
									variant: "ghost",
									onClick: ($event) => modalArqueo.value = false
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`Cancelar`);
										else return [createTextVNode("Cancelar")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UButton, {
									color: "amber",
									loading: unref(registrando),
									onClick: confirmarArqueo
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`Registrar arqueo`);
										else return [createTextVNode("Registrar arqueo")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
								color: "gray",
								variant: "ghost",
								onClick: ($event) => modalArqueo.value = false
							}, {
								default: withCtx(() => [createTextVNode("Cancelar")]),
								_: 1
							}, 8, ["onClick"]), createVNode(_component_UButton, {
								color: "amber",
								loading: unref(registrando),
								onClick: confirmarArqueo
							}, {
								default: withCtx(() => [createTextVNode("Registrar arqueo")]),
								_: 1
							}, 8, ["loading"])])];
						}),
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="space-y-3"${_scopeId}><p class="text-sm text-slate-600"${_scopeId}> Saldo esperado según el sistema: <span class="font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(unref(moneda)(unref(saldo)?.saldoEsperado))}</span></p>`);
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Saldo contado (conteo físico real)" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UInput, {
											modelValue: unref(formArqueo).saldoContado,
											"onUpdate:modelValue": ($event) => unref(formArqueo).saldoContado = $event,
											modelModifiers: { number: true },
											type: "number",
											min: "0"
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UInput, {
											modelValue: unref(formArqueo).saldoContado,
											"onUpdate:modelValue": ($event) => unref(formArqueo).saldoContado = $event,
											modelModifiers: { number: true },
											type: "number",
											min: "0"
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`<p class="text-sm"${_scopeId}> Diferencia: <span class="${ssrRenderClass([unref(diferenciaPreview) === 0 ? "text-slate-600" : unref(diferenciaPreview) > 0 ? "text-emerald-600" : "text-red-600", "font-semibold"])}"${_scopeId}>${ssrInterpolate(unref(diferenciaPreview) > 0 ? "+" : "")}${ssrInterpolate(unref(moneda)(unref(diferenciaPreview)))}</span>`);
								if (unref(diferenciaPreview) > 0) _push(`<span class="text-slate-500"${_scopeId}> (sobrante)</span>`);
								else if (unref(diferenciaPreview) < 0) _push(`<span class="text-slate-500"${_scopeId}> (faltante)</span>`);
								else _push(`<!---->`);
								_push(`</p>`);
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Observaciones (opcional)" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UTextarea, {
											modelValue: unref(formArqueo).observaciones,
											"onUpdate:modelValue": ($event) => unref(formArqueo).observaciones = $event
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UTextarea, {
											modelValue: unref(formArqueo).observaciones,
											"onUpdate:modelValue": ($event) => unref(formArqueo).observaciones = $event
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "space-y-3" }, [
								createVNode("p", { class: "text-sm text-slate-600" }, [createTextVNode(" Saldo esperado según el sistema: "), createVNode("span", { class: "font-semibold text-slate-900" }, toDisplayString(unref(moneda)(unref(saldo)?.saldoEsperado)), 1)]),
								createVNode(_component_UFormGroup, { label: "Saldo contado (conteo físico real)" }, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(formArqueo).saldoContado,
										"onUpdate:modelValue": ($event) => unref(formArqueo).saldoContado = $event,
										modelModifiers: { number: true },
										type: "number",
										min: "0"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode("p", { class: "text-sm" }, [
									createTextVNode(" Diferencia: "),
									createVNode("span", { class: [unref(diferenciaPreview) === 0 ? "text-slate-600" : unref(diferenciaPreview) > 0 ? "text-emerald-600" : "text-red-600", "font-semibold"] }, toDisplayString(unref(diferenciaPreview) > 0 ? "+" : "") + toDisplayString(unref(moneda)(unref(diferenciaPreview))), 3),
									unref(diferenciaPreview) > 0 ? (openBlock(), createBlock("span", {
										key: 0,
										class: "text-slate-500"
									}, " (sobrante)")) : unref(diferenciaPreview) < 0 ? (openBlock(), createBlock("span", {
										key: 1,
										class: "text-slate-500"
									}, " (faltante)")) : createCommentVNode("", true)
								]),
								createVNode(_component_UFormGroup, { label: "Observaciones (opcional)" }, {
									default: withCtx(() => [createVNode(_component_UTextarea, {
										modelValue: unref(formArqueo).observaciones,
										"onUpdate:modelValue": ($event) => unref(formArqueo).observaciones = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								})
							])];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(_component_UCard, null, {
						header: withCtx(() => [createVNode("p", { class: "font-semibold text-slate-900" }, "Registrar arqueo de caja")]),
						footer: withCtx(() => [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
							color: "gray",
							variant: "ghost",
							onClick: ($event) => modalArqueo.value = false
						}, {
							default: withCtx(() => [createTextVNode("Cancelar")]),
							_: 1
						}, 8, ["onClick"]), createVNode(_component_UButton, {
							color: "amber",
							loading: unref(registrando),
							onClick: confirmarArqueo
						}, {
							default: withCtx(() => [createTextVNode("Registrar arqueo")]),
							_: 1
						}, 8, ["loading"])])]),
						default: withCtx(() => [createVNode("div", { class: "space-y-3" }, [
							createVNode("p", { class: "text-sm text-slate-600" }, [createTextVNode(" Saldo esperado según el sistema: "), createVNode("span", { class: "font-semibold text-slate-900" }, toDisplayString(unref(moneda)(unref(saldo)?.saldoEsperado)), 1)]),
							createVNode(_component_UFormGroup, { label: "Saldo contado (conteo físico real)" }, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(formArqueo).saldoContado,
									"onUpdate:modelValue": ($event) => unref(formArqueo).saldoContado = $event,
									modelModifiers: { number: true },
									type: "number",
									min: "0"
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							createVNode("p", { class: "text-sm" }, [
								createTextVNode(" Diferencia: "),
								createVNode("span", { class: [unref(diferenciaPreview) === 0 ? "text-slate-600" : unref(diferenciaPreview) > 0 ? "text-emerald-600" : "text-red-600", "font-semibold"] }, toDisplayString(unref(diferenciaPreview) > 0 ? "+" : "") + toDisplayString(unref(moneda)(unref(diferenciaPreview))), 3),
								unref(diferenciaPreview) > 0 ? (openBlock(), createBlock("span", {
									key: 0,
									class: "text-slate-500"
								}, " (sobrante)")) : unref(diferenciaPreview) < 0 ? (openBlock(), createBlock("span", {
									key: 1,
									class: "text-slate-500"
								}, " (faltante)")) : createCommentVNode("", true)
							]),
							createVNode(_component_UFormGroup, { label: "Observaciones (opcional)" }, {
								default: withCtx(() => [createVNode(_component_UTextarea, {
									modelValue: unref(formArqueo).observaciones,
									"onUpdate:modelValue": ($event) => unref(formArqueo).observaciones = $event
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							})
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
//#region pages/caja/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/caja/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var caja_default = index_vue_vue_type_script_setup_true_lang_default;

export { caja_default as default };
//# sourceMappingURL=caja-COX5jQwX.mjs.map
