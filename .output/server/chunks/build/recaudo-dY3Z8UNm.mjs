import { u as useRoute$1 } from '../virtual/entry.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { t as Badge_default } from './Badge-Dji78drx.mjs';
import { t as Alert_default } from './Alert-Bv_RgsgM.mjs';
import { t as FormGroup_default } from './FormGroup-Y-Nkh3aN.mjs';
import { t as Checkbox_default } from './Checkbox-IBRiz-C1.mjs';
import { t as Card_default } from './Card-j-DCNf6K.mjs';
import { t as Modal_default } from './Modal-B8wn1zi5.mjs';
import { t as Button_default } from './Button-CoYovqJ9.mjs';
import { t as SelectMenu_default } from './SelectMenu-Bw_jkCZn.mjs';
import { t as Input_default } from './Input-BVUEIOT9.mjs';
import { t as Textarea_default } from './Textarea-E1R2aU6E.mjs';
import { u as useApiFetch } from './useApiFetch-B8kTc45P.mjs';
import { u as useFormatoCO } from './useFormatoCO-CX_CcnnC.mjs';
import { u as usePdfDownload } from './usePdfDownload-1a7-2EuR.mjs';
import { defineComponent, ref, reactive, computed, unref, withCtx, isRef, createTextVNode, createVNode, withKeys, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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
import './useFormGroup-BLFts8mq.mjs';
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
import './button-BNOdwSP_.mjs';
import './Link-CnaKOPmE.mjs';
import './form-BjTHmaPY.mjs';
import './combobox-C0tFQX7q.mjs';
import './use-resolve-button-type-DZKnDGM_.mjs';
import './calculate-active-index-CJA4E3gh.mjs';
import '@tanstack/vue-virtual';
import './use-text-value-DhHPSnE-.mjs';
import './usePopper-BCEqNZ_Z.mjs';

//#region pages/recaudo/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		useRoute$1();
		const { moneda, fecha } = useFormatoCO();
		const error = ref("");
		const busquedaContrato = ref("");
		const contratosEncontrados = ref([]);
		const buscando = ref(false);
		const contratoSeleccionado = ref(null);
		const ficha = ref(null);
		const cargandoFicha = ref(false);
		const medios = ["EFECTIVO", "TRANSFERENCIA"];
		const detallesPago = reactive([{
			medioPago: "EFECTIVO",
			monto: 0,
			referencia: ""
		}]);
		const registrandoPago = ref(false);
		const ultimoRecibo = ref(null);
		async function buscarContratos() {
			if (!busquedaContrato.value) return;
			error.value = "";
			buscando.value = true;
			try {
				const data = await useApiFetch("/contratos", { params: {
					busqueda: busquedaContrato.value,
					limit: 5
				} });
				contratosEncontrados.value = data.data;
			} catch (e) {
				error.value = e?.data?.message || "No fue posible buscar el contrato.";
			} finally {
				buscando.value = false;
			}
		}
		async function seleccionarContrato(contrato) {
			contratoSeleccionado.value = contrato;
			contratosEncontrados.value = [];
			error.value = "";
			cargandoFicha.value = true;
			try {
				ficha.value = await useApiFetch(`/contratos/${contrato.id}/ficha-recaudo`);
			} catch (e) {
				error.value = e?.data?.message || "No fue posible cargar la ficha de recaudo.";
			} finally {
				cargandoFicha.value = false;
			}
		}
		function agregarDetalle() {
			detallesPago.push({
				medioPago: "EFECTIVO",
				monto: 0,
				referencia: ""
			});
		}
		function quitarDetalle(i) {
			detallesPago.splice(i, 1);
		}
		const totalPago = computed(() => detallesPago.reduce((acc, d) => acc + Number(d.monto || 0), 0));
		const dejarExcedenteComoSaldoFavor = ref(false);
		const modalPrevisualizacion = ref(false);
		const cargandoPrevisualizacion = ref(false);
		const previsualizacion = ref(null);
		async function abrirConfirmarPago() {
			if (!contratoSeleccionado.value || totalPago.value <= 0) return;
			error.value = "";
			cargandoPrevisualizacion.value = true;
			modalPrevisualizacion.value = true;
			try {
				previsualizacion.value = await useApiFetch("/recaudo/pagos/simular", {
					method: "POST",
					body: {
						contratoId: contratoSeleccionado.value.id,
						detallesPago,
						dejarExcedenteComoSaldoFavor: dejarExcedenteComoSaldoFavor.value
					}
				});
			} catch (e) {
				modalPrevisualizacion.value = false;
				error.value = e?.data?.message || "No fue posible calcular la previsualización del pago.";
			} finally {
				cargandoPrevisualizacion.value = false;
			}
		}
		function etiquetaConcepto(aplicacion) {
			return aplicacion.concepto === "MORA" ? "Mora" : "Capital";
		}
		async function registrarPago() {
			if (!contratoSeleccionado.value || totalPago.value <= 0) return;
			error.value = "";
			registrandoPago.value = true;
			try {
				const recibo = await useApiFetch("/recaudo/pagos", {
					method: "POST",
					body: {
						contratoId: contratoSeleccionado.value.id,
						detallesPago,
						dejarExcedenteComoSaldoFavor: dejarExcedenteComoSaldoFavor.value
					}
				});
				ultimoRecibo.value = recibo;
				modalPrevisualizacion.value = false;
				ficha.value = await useApiFetch(`/contratos/${contratoSeleccionado.value.id}/ficha-recaudo`);
				detallesPago.splice(0, detallesPago.length, {
					medioPago: "EFECTIVO",
					monto: 0,
					referencia: ""
				});
				dejarExcedenteComoSaldoFavor.value = false;
			} catch (e) {
				error.value = e?.data?.message || "No fue posible registrar el pago.";
			} finally {
				registrandoPago.value = false;
			}
		}
		const descargando = ref(false);
		async function descargarPdf(formato) {
			if (!ultimoRecibo.value || descargando.value) return;
			error.value = "";
			descargando.value = true;
			try {
				await usePdfDownload(`/documentos/recibos/${ultimoRecibo.value.id}/pdf?formato=${formato}`, ultimoRecibo.value.consecutivo);
			} catch (e) {
				error.value = e?.data?.message || "No fue posible descargar el PDF.";
			} finally {
				descargando.value = false;
			}
		}
		const modalAnularObligacion = ref(false);
		const obligacionAnulando = ref(null);
		const formAnular = reactive({ motivo: "" });
		const anulandoObligacion = ref(false);
		function abrirAnularObligacion(o) {
			error.value = "";
			obligacionAnulando.value = o;
			formAnular.motivo = "";
			modalAnularObligacion.value = true;
		}
		async function confirmarAnularObligacion() {
			if (!obligacionAnulando.value || !contratoSeleccionado.value) return;
			error.value = "";
			anulandoObligacion.value = true;
			try {
				await useApiFetch(`/obligaciones/${obligacionAnulando.value.id}/anular`, {
					method: "PATCH",
					body: { motivo: formAnular.motivo }
				});
				modalAnularObligacion.value = false;
				ficha.value = await useApiFetch(`/contratos/${contratoSeleccionado.value.id}/ficha-recaudo`);
			} catch (e) {
				error.value = e?.data?.message || "No fue posible anular la obligación.";
			} finally {
				anulandoObligacion.value = false;
			}
		}
		const modalLiquidar = ref(false);
		const liquidando = ref(false);
		const descuentosDeposito = reactive([{
			concepto: "",
			valor: 0
		}]);
		const formLiquidar = reactive({
			medioPago: "EFECTIVO",
			referencia: "",
			observaciones: ""
		});
		const totalDescuentosDeposito = computed(() => descuentosDeposito.reduce((acc, d) => acc + Number(d.valor || 0), 0));
		const valorADevolver = computed(() => Math.max(0, Number(ficha.value?.depositoCustodia || 0) - totalDescuentosDeposito.value));
		function agregarDescuentoDeposito() {
			descuentosDeposito.push({
				concepto: "",
				valor: 0
			});
		}
		function quitarDescuentoDeposito(i) {
			descuentosDeposito.splice(i, 1);
		}
		function abrirLiquidarDeposito() {
			error.value = "";
			descuentosDeposito.splice(0, descuentosDeposito.length, {
				concepto: "",
				valor: 0
			});
			formLiquidar.medioPago = "EFECTIVO";
			formLiquidar.referencia = "";
			formLiquidar.observaciones = "";
			modalLiquidar.value = true;
		}
		async function confirmarLiquidarDeposito() {
			if (!contratoSeleccionado.value) return;
			error.value = "";
			liquidando.value = true;
			try {
				const descuentos = descuentosDeposito.filter((d) => d.concepto && Number(d.valor) > 0);
				await useApiFetch(`/recaudo/contrato/${contratoSeleccionado.value.id}/liquidar-deposito`, {
					method: "POST",
					body: {
						descuentos: descuentos.length ? descuentos : void 0,
						medioPago: valorADevolver.value > 0 ? formLiquidar.medioPago : void 0,
						referencia: formLiquidar.referencia || void 0,
						observaciones: formLiquidar.observaciones || void 0
					}
				});
				modalLiquidar.value = false;
				ficha.value = await useApiFetch(`/contratos/${contratoSeleccionado.value.id}/ficha-recaudo`);
			} catch (e) {
				error.value = e?.data?.message || "No fue posible liquidar el depósito.";
			} finally {
				liquidando.value = false;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UAlert = Alert_default;
			const _component_UCard = Card_default;
			const _component_UInput = Input_default;
			const _component_UButton = Button_default;
			const _component_USelectMenu = SelectMenu_default;
			const _component_UCheckbox = Checkbox_default;
			const _component_UIcon = Icon_default;
			const _component_UModal = Modal_default;
			const _component_UFormGroup = FormGroup_default;
			const _component_UTextarea = Textarea_default;
			const _component_UBadge = Badge_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-xl font-semibold text-slate-900 mb-4">Recaudo</h1>`);
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
						_push(`<div class="flex gap-3"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UInput, {
							modelValue: unref(busquedaContrato),
							"onUpdate:modelValue": ($event) => isRef(busquedaContrato) ? busquedaContrato.value = $event : null,
							placeholder: "Buscar contrato por cédula o nombre del arrendatario…",
							icon: "i-heroicons-magnifying-glass",
							class: "flex-1",
							onKeyup: buscarContratos
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_UButton, {
							color: "amber",
							loading: unref(buscando),
							onClick: buscarContratos
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Buscar`);
								else return [createTextVNode("Buscar")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div>`);
						if (unref(contratosEncontrados).length) {
							_push(`<div class="mt-3 divide-y divide-slate-100 border rounded-lg"${_scopeId}><!--[-->`);
							ssrRenderList(unref(contratosEncontrados), (c) => {
								_push(`<button class="w-full text-left px-4 py-2 hover:bg-slate-50"${_scopeId}><p class="text-sm font-medium text-slate-900"${_scopeId}>${ssrInterpolate(c.cliente?.nombreCompleto)} — ${ssrInterpolate(c.cliente?.numeroDocumento)}</p><p class="text-xs text-slate-500"${_scopeId}>${ssrInterpolate(c.inmueble?.direccion)} (${ssrInterpolate(c.inmueble?.barrio)})</p></button>`);
							});
							_push(`<!--]--></div>`);
						} else _push(`<!---->`);
					} else return [createVNode("div", { class: "flex gap-3" }, [createVNode(_component_UInput, {
						modelValue: unref(busquedaContrato),
						"onUpdate:modelValue": ($event) => isRef(busquedaContrato) ? busquedaContrato.value = $event : null,
						placeholder: "Buscar contrato por cédula o nombre del arrendatario…",
						icon: "i-heroicons-magnifying-glass",
						class: "flex-1",
						onKeyup: withKeys(buscarContratos, ["enter"])
					}, null, 8, ["modelValue", "onUpdate:modelValue"]), createVNode(_component_UButton, {
						color: "amber",
						loading: unref(buscando),
						onClick: buscarContratos
					}, {
						default: withCtx(() => [createTextVNode("Buscar")]),
						_: 1
					}, 8, ["loading"])]), unref(contratosEncontrados).length ? (openBlock(), createBlock("div", {
						key: 0,
						class: "mt-3 divide-y divide-slate-100 border rounded-lg"
					}, [(openBlock(true), createBlock(Fragment, null, renderList(unref(contratosEncontrados), (c) => {
						return openBlock(), createBlock("button", {
							key: c.id,
							class: "w-full text-left px-4 py-2 hover:bg-slate-50",
							onClick: ($event) => seleccionarContrato(c)
						}, [createVNode("p", { class: "text-sm font-medium text-slate-900" }, toDisplayString(c.cliente?.nombreCompleto) + " — " + toDisplayString(c.cliente?.numeroDocumento), 1), createVNode("p", { class: "text-xs text-slate-500" }, toDisplayString(c.inmueble?.direccion) + " (" + toDisplayString(c.inmueble?.barrio) + ")", 1)], 8, ["onClick"]);
					}), 128))])) : createCommentVNode("", true)];
				}),
				_: 1
			}, _parent));
			if (unref(cargandoFicha)) _push(`<div class="text-center py-10 text-slate-600">Cargando ficha de recaudo…</div>`);
			else if (unref(ficha)) {
				_push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">`);
				_push(ssrRenderComponent(_component_UCard, { class: "lg:col-span-1" }, {
					header: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>Ficha de recaudo</p>`);
						else return [createVNode("p", { class: "font-semibold text-slate-900" }, "Ficha de recaudo")];
					}),
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<div class="space-y-2 text-sm"${_scopeId}><p${_scopeId}><span class="text-slate-600"${_scopeId}>Arrendatario:</span> ${ssrInterpolate(unref(ficha).arrendatario?.nombreCompleto)}</p><p${_scopeId}><span class="text-slate-600"${_scopeId}>Inmueble:</span> ${ssrInterpolate(unref(ficha).inmueble?.direccion)}</p><p${_scopeId}><span class="text-slate-600"${_scopeId}>Barrio:</span> ${ssrInterpolate(unref(ficha).barrio)}</p><p${_scopeId}><span class="text-slate-600"${_scopeId}>Saldo a favor:</span> <span class="text-emerald-600 font-medium"${_scopeId}>${ssrInterpolate(unref(moneda)(unref(ficha).saldoAFavor))}</span></p><p${_scopeId}><span class="text-slate-600"${_scopeId}>Depósito en custodia:</span> ${ssrInterpolate(unref(moneda)(unref(ficha).depositoCustodia))}</p></div>`);
							if (unref(ficha).contrato?.estado === "TERMINADO" && Number(unref(ficha).depositoCustodia) > 0) {
								_push(`<div class="mt-3 pt-3 border-t"${_scopeId}>`);
								_push(ssrRenderComponent(_component_UButton, {
									size: "xs",
									color: "amber",
									variant: "soft",
									icon: "i-heroicons-banknotes",
									onClick: abrirLiquidarDeposito
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(` Liquidar depósito `);
										else return [createTextVNode(" Liquidar depósito ")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else _push(`<!---->`);
							_push(`<div class="mt-4 pt-3 border-t"${_scopeId}><p class="text-sm font-medium text-slate-900 mb-2"${_scopeId}>Obligaciones pendientes</p>`);
							if (!unref(ficha).obligacionesPendientes?.length) _push(`<p class="text-sm text-slate-400"${_scopeId}>Sin obligaciones pendientes.</p>`);
							else {
								_push(`<div class="space-y-2"${_scopeId}><!--[-->`);
								ssrRenderList(unref(ficha).obligacionesPendientes, (o) => {
									_push(`<div class="text-xs border rounded-md px-2 py-1.5"${_scopeId}><div class="flex justify-between"${_scopeId}><span class="text-slate-700"${_scopeId}>${ssrInterpolate(o.concepto)}</span><span class="font-medium text-slate-900"${_scopeId}>${ssrInterpolate(unref(moneda)(Number(o.valorOriginal) - Number(o.valorAbonado)))}</span></div><div class="flex justify-between text-slate-500"${_scopeId}><span${_scopeId}>Vence: ${ssrInterpolate(unref(fecha)(o.fechaVencimiento))}</span>`);
									if (Number(o.valorMoraAcumulada) > 0) _push(`<span class="text-red-600"${_scopeId}> Mora: ${ssrInterpolate(unref(moneda)(o.valorMoraAcumulada))}</span>`);
									else _push(`<!---->`);
									_push(`</div>`);
									if (o.estado === "PENDIENTE") {
										_push(`<div class="flex justify-end mt-1"${_scopeId}>`);
										_push(ssrRenderComponent(_component_UButton, {
											size: "2xs",
											color: "red",
											variant: "ghost",
											onClick: ($event) => abrirAnularObligacion(o)
										}, {
											default: withCtx((_, _push, _parent, _scopeId) => {
												if (_push) _push(` Anular (error de generación) `);
												else return [createTextVNode(" Anular (error de generación) ")];
											}),
											_: 2
										}, _parent, _scopeId));
										_push(`</div>`);
									} else _push(`<!---->`);
									_push(`</div>`);
								});
								_push(`<!--]--></div>`);
							}
							_push(`</div>`);
						} else return [
							createVNode("div", { class: "space-y-2 text-sm" }, [
								createVNode("p", null, [createVNode("span", { class: "text-slate-600" }, "Arrendatario:"), createTextVNode(" " + toDisplayString(unref(ficha).arrendatario?.nombreCompleto), 1)]),
								createVNode("p", null, [createVNode("span", { class: "text-slate-600" }, "Inmueble:"), createTextVNode(" " + toDisplayString(unref(ficha).inmueble?.direccion), 1)]),
								createVNode("p", null, [createVNode("span", { class: "text-slate-600" }, "Barrio:"), createTextVNode(" " + toDisplayString(unref(ficha).barrio), 1)]),
								createVNode("p", null, [
									createVNode("span", { class: "text-slate-600" }, "Saldo a favor:"),
									createTextVNode(),
									createVNode("span", { class: "text-emerald-600 font-medium" }, toDisplayString(unref(moneda)(unref(ficha).saldoAFavor)), 1)
								]),
								createVNode("p", null, [createVNode("span", { class: "text-slate-600" }, "Depósito en custodia:"), createTextVNode(" " + toDisplayString(unref(moneda)(unref(ficha).depositoCustodia)), 1)])
							]),
							unref(ficha).contrato?.estado === "TERMINADO" && Number(unref(ficha).depositoCustodia) > 0 ? (openBlock(), createBlock("div", {
								key: 0,
								class: "mt-3 pt-3 border-t"
							}, [createVNode(_component_UButton, {
								size: "xs",
								color: "amber",
								variant: "soft",
								icon: "i-heroicons-banknotes",
								onClick: abrirLiquidarDeposito
							}, {
								default: withCtx(() => [createTextVNode(" Liquidar depósito ")]),
								_: 1
							})])) : createCommentVNode("", true),
							createVNode("div", { class: "mt-4 pt-3 border-t" }, [createVNode("p", { class: "text-sm font-medium text-slate-900 mb-2" }, "Obligaciones pendientes"), !unref(ficha).obligacionesPendientes?.length ? (openBlock(), createBlock("p", {
								key: 0,
								class: "text-sm text-slate-400"
							}, "Sin obligaciones pendientes.")) : (openBlock(), createBlock("div", {
								key: 1,
								class: "space-y-2"
							}, [(openBlock(true), createBlock(Fragment, null, renderList(unref(ficha).obligacionesPendientes, (o) => {
								return openBlock(), createBlock("div", {
									key: o.id,
									class: "text-xs border rounded-md px-2 py-1.5"
								}, [
									createVNode("div", { class: "flex justify-between" }, [createVNode("span", { class: "text-slate-700" }, toDisplayString(o.concepto), 1), createVNode("span", { class: "font-medium text-slate-900" }, toDisplayString(unref(moneda)(Number(o.valorOriginal) - Number(o.valorAbonado))), 1)]),
									createVNode("div", { class: "flex justify-between text-slate-500" }, [createVNode("span", null, "Vence: " + toDisplayString(unref(fecha)(o.fechaVencimiento)), 1), Number(o.valorMoraAcumulada) > 0 ? (openBlock(), createBlock("span", {
										key: 0,
										class: "text-red-600"
									}, " Mora: " + toDisplayString(unref(moneda)(o.valorMoraAcumulada)), 1)) : createCommentVNode("", true)]),
									o.estado === "PENDIENTE" ? (openBlock(), createBlock("div", {
										key: 0,
										class: "flex justify-end mt-1"
									}, [createVNode(_component_UButton, {
										size: "2xs",
										color: "red",
										variant: "ghost",
										onClick: ($event) => abrirAnularObligacion(o)
									}, {
										default: withCtx(() => [createTextVNode(" Anular (error de generación) ")]),
										_: 1
									}, 8, ["onClick"])])) : createCommentVNode("", true)
								]);
							}), 128))]))])
						];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_component_UCard, { class: "lg:col-span-2" }, {
					header: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>Registrar pago (medios combinados)</p>`);
						else return [createVNode("p", { class: "font-semibold text-slate-900" }, "Registrar pago (medios combinados)")];
					}),
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<!--[-->`);
							ssrRenderList(unref(detallesPago), (detalle, i) => {
								_push(`<div class="flex gap-2 items-center mb-2"${_scopeId}>`);
								_push(ssrRenderComponent(_component_USelectMenu, {
									modelValue: detalle.medioPago,
									"onUpdate:modelValue": ($event) => detalle.medioPago = $event,
									options: medios,
									class: "w-44"
								}, null, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UInput, {
									modelValue: detalle.monto,
									"onUpdate:modelValue": ($event) => detalle.monto = $event,
									modelModifiers: { number: true },
									type: "number",
									placeholder: "Monto",
									class: "w-40"
								}, null, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UInput, {
									modelValue: detalle.referencia,
									"onUpdate:modelValue": ($event) => detalle.referencia = $event,
									placeholder: "Referencia (opcional)",
									class: "flex-1"
								}, null, _parent, _scopeId));
								if (unref(detallesPago).length > 1) _push(ssrRenderComponent(_component_UButton, {
									color: "red",
									variant: "ghost",
									icon: "i-heroicons-trash",
									onClick: ($event) => quitarDetalle(i)
								}, null, _parent, _scopeId));
								else _push(`<!---->`);
								_push(`</div>`);
							});
							_push(`<!--]-->`);
							_push(ssrRenderComponent(_component_UButton, {
								size: "xs",
								variant: "soft",
								icon: "i-heroicons-plus",
								class: "mb-4",
								onClick: agregarDetalle
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(` Agregar medio de pago `);
									else return [createTextVNode(" Agregar medio de pago ")];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(ssrRenderComponent(_component_UCheckbox, {
								modelValue: unref(dejarExcedenteComoSaldoFavor),
								"onUpdate:modelValue": ($event) => isRef(dejarExcedenteComoSaldoFavor) ? dejarExcedenteComoSaldoFavor.value = $event : null,
								label: "Si sobra dinero, dejarlo como saldo a favor (en vez de devolver cambio)",
								class: "mb-3"
							}, null, _parent, _scopeId));
							_push(`<div class="flex items-center justify-between border-t pt-3"${_scopeId}><p class="text-sm text-slate-600"${_scopeId}>Total a registrar: <span class="font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(unref(moneda)(unref(totalPago)))}</span></p>`);
							_push(ssrRenderComponent(_component_UButton, {
								color: "amber",
								loading: unref(registrandoPago),
								disabled: unref(totalPago) <= 0,
								onClick: abrirConfirmarPago
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(` Confirmar y emitir recibo `);
									else return [createTextVNode(" Confirmar y emitir recibo ")];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</div>`);
							if (unref(ultimoRecibo)) _push(ssrRenderComponent(_component_UAlert, {
								class: "mt-4",
								color: "emerald",
								variant: "subtle",
								title: `Recibo ${unref(ultimoRecibo).consecutivo} emitido correctamente`
							}, {
								description: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) {
										if (Number(unref(ultimoRecibo).excedente) > 0) {
											_push(`<p class="text-sm mb-2"${_scopeId}>`);
											if (unref(ultimoRecibo).excedenteComoSaldoFavor) _push(`<span${_scopeId}>${ssrInterpolate(unref(moneda)(unref(ultimoRecibo).excedente))} quedaron como saldo a favor del contrato. </span>`);
											else _push(`<span class="font-medium"${_scopeId}> Cambio a entregar: ${ssrInterpolate(unref(moneda)(unref(ultimoRecibo).excedente))}</span>`);
											_push(`</p>`);
										} else _push(`<!---->`);
										_push(`<div class="flex gap-2 mt-2"${_scopeId}>`);
										_push(ssrRenderComponent(_component_UButton, {
											size: "xs",
											color: "amber",
											icon: "i-heroicons-document-arrow-down",
											disabled: unref(descargando),
											onClick: ($event) => descargarPdf("CARTA")
										}, {
											default: withCtx((_, _push, _parent, _scopeId) => {
												if (_push) _push(`PDF Carta`);
												else return [createTextVNode("PDF Carta")];
											}),
											_: 1
										}, _parent, _scopeId));
										_push(ssrRenderComponent(_component_UButton, {
											size: "xs",
											color: "amber",
											variant: "soft",
											icon: "i-heroicons-document-arrow-down",
											disabled: unref(descargando),
											onClick: ($event) => descargarPdf("MEDIA_CARTA")
										}, {
											default: withCtx((_, _push, _parent, _scopeId) => {
												if (_push) _push(`PDF Media Carta`);
												else return [createTextVNode("PDF Media Carta")];
											}),
											_: 1
										}, _parent, _scopeId));
										_push(`</div>`);
									} else return [Number(unref(ultimoRecibo).excedente) > 0 ? (openBlock(), createBlock("p", {
										key: 0,
										class: "text-sm mb-2"
									}, [unref(ultimoRecibo).excedenteComoSaldoFavor ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(unref(moneda)(unref(ultimoRecibo).excedente)) + " quedaron como saldo a favor del contrato. ", 1)) : (openBlock(), createBlock("span", {
										key: 1,
										class: "font-medium"
									}, " Cambio a entregar: " + toDisplayString(unref(moneda)(unref(ultimoRecibo).excedente)), 1))])) : createCommentVNode("", true), createVNode("div", { class: "flex gap-2 mt-2" }, [createVNode(_component_UButton, {
										size: "xs",
										color: "amber",
										icon: "i-heroicons-document-arrow-down",
										disabled: unref(descargando),
										onClick: ($event) => descargarPdf("CARTA")
									}, {
										default: withCtx(() => [createTextVNode("PDF Carta")]),
										_: 1
									}, 8, ["disabled", "onClick"]), createVNode(_component_UButton, {
										size: "xs",
										color: "amber",
										variant: "soft",
										icon: "i-heroicons-document-arrow-down",
										disabled: unref(descargando),
										onClick: ($event) => descargarPdf("MEDIA_CARTA")
									}, {
										default: withCtx(() => [createTextVNode("PDF Media Carta")]),
										_: 1
									}, 8, ["disabled", "onClick"])])];
								}),
								_: 1
							}, _parent, _scopeId));
							else _push(`<!---->`);
						} else return [
							(openBlock(true), createBlock(Fragment, null, renderList(unref(detallesPago), (detalle, i) => {
								return openBlock(), createBlock("div", {
									key: i,
									class: "flex gap-2 items-center mb-2"
								}, [
									createVNode(_component_USelectMenu, {
										modelValue: detalle.medioPago,
										"onUpdate:modelValue": ($event) => detalle.medioPago = $event,
										options: medios,
										class: "w-44"
									}, null, 8, ["modelValue", "onUpdate:modelValue"]),
									createVNode(_component_UInput, {
										modelValue: detalle.monto,
										"onUpdate:modelValue": ($event) => detalle.monto = $event,
										modelModifiers: { number: true },
										type: "number",
										placeholder: "Monto",
										class: "w-40"
									}, null, 8, ["modelValue", "onUpdate:modelValue"]),
									createVNode(_component_UInput, {
										modelValue: detalle.referencia,
										"onUpdate:modelValue": ($event) => detalle.referencia = $event,
										placeholder: "Referencia (opcional)",
										class: "flex-1"
									}, null, 8, ["modelValue", "onUpdate:modelValue"]),
									unref(detallesPago).length > 1 ? (openBlock(), createBlock(_component_UButton, {
										key: 0,
										color: "red",
										variant: "ghost",
										icon: "i-heroicons-trash",
										onClick: ($event) => quitarDetalle(i)
									}, null, 8, ["onClick"])) : createCommentVNode("", true)
								]);
							}), 128)),
							createVNode(_component_UButton, {
								size: "xs",
								variant: "soft",
								icon: "i-heroicons-plus",
								class: "mb-4",
								onClick: agregarDetalle
							}, {
								default: withCtx(() => [createTextVNode(" Agregar medio de pago ")]),
								_: 1
							}),
							createVNode(_component_UCheckbox, {
								modelValue: unref(dejarExcedenteComoSaldoFavor),
								"onUpdate:modelValue": ($event) => isRef(dejarExcedenteComoSaldoFavor) ? dejarExcedenteComoSaldoFavor.value = $event : null,
								label: "Si sobra dinero, dejarlo como saldo a favor (en vez de devolver cambio)",
								class: "mb-3"
							}, null, 8, ["modelValue", "onUpdate:modelValue"]),
							createVNode("div", { class: "flex items-center justify-between border-t pt-3" }, [createVNode("p", { class: "text-sm text-slate-600" }, [createTextVNode("Total a registrar: "), createVNode("span", { class: "font-semibold text-slate-900" }, toDisplayString(unref(moneda)(unref(totalPago))), 1)]), createVNode(_component_UButton, {
								color: "amber",
								loading: unref(registrandoPago),
								disabled: unref(totalPago) <= 0,
								onClick: abrirConfirmarPago
							}, {
								default: withCtx(() => [createTextVNode(" Confirmar y emitir recibo ")]),
								_: 1
							}, 8, ["loading", "disabled"])]),
							unref(ultimoRecibo) ? (openBlock(), createBlock(_component_UAlert, {
								key: 0,
								class: "mt-4",
								color: "emerald",
								variant: "subtle",
								title: `Recibo ${unref(ultimoRecibo).consecutivo} emitido correctamente`
							}, {
								description: withCtx(() => [Number(unref(ultimoRecibo).excedente) > 0 ? (openBlock(), createBlock("p", {
									key: 0,
									class: "text-sm mb-2"
								}, [unref(ultimoRecibo).excedenteComoSaldoFavor ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(unref(moneda)(unref(ultimoRecibo).excedente)) + " quedaron como saldo a favor del contrato. ", 1)) : (openBlock(), createBlock("span", {
									key: 1,
									class: "font-medium"
								}, " Cambio a entregar: " + toDisplayString(unref(moneda)(unref(ultimoRecibo).excedente)), 1))])) : createCommentVNode("", true), createVNode("div", { class: "flex gap-2 mt-2" }, [createVNode(_component_UButton, {
									size: "xs",
									color: "amber",
									icon: "i-heroicons-document-arrow-down",
									disabled: unref(descargando),
									onClick: ($event) => descargarPdf("CARTA")
								}, {
									default: withCtx(() => [createTextVNode("PDF Carta")]),
									_: 1
								}, 8, ["disabled", "onClick"]), createVNode(_component_UButton, {
									size: "xs",
									color: "amber",
									variant: "soft",
									icon: "i-heroicons-document-arrow-down",
									disabled: unref(descargando),
									onClick: ($event) => descargarPdf("MEDIA_CARTA")
								}, {
									default: withCtx(() => [createTextVNode("PDF Media Carta")]),
									_: 1
								}, 8, ["disabled", "onClick"])])]),
								_: 1
							}, 8, ["title"])) : createCommentVNode("", true)
						];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
			} else {
				_push(`<div class="text-center py-16 text-slate-600">`);
				_push(ssrRenderComponent(_component_UIcon, {
					name: "i-heroicons-banknotes",
					class: "w-10 h-10 mx-auto mb-2"
				}, null, _parent));
				_push(`<p>Busca un contrato para ver su ficha de recaudo y registrar un pago.</p></div>`);
			}
			_push(ssrRenderComponent(_component_UModal, {
				modelValue: unref(modalAnularObligacion),
				"onUpdate:modelValue": ($event) => isRef(modalAnularObligacion) ? modalAnularObligacion.value = $event : null
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UCard, null, {
						header: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>Anular obligación</p>`);
							else return [createVNode("p", { class: "font-semibold text-slate-900" }, "Anular obligación")];
						}),
						footer: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex justify-end gap-2"${_scopeId}>`);
								_push(ssrRenderComponent(_component_UButton, {
									color: "gray",
									variant: "ghost",
									onClick: ($event) => modalAnularObligacion.value = false
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`Cancelar`);
										else return [createTextVNode("Cancelar")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UButton, {
									color: "red",
									loading: unref(anulandoObligacion),
									disabled: !unref(formAnular).motivo,
									onClick: confirmarAnularObligacion
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(` Anular obligación `);
										else return [createTextVNode(" Anular obligación ")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
								color: "gray",
								variant: "ghost",
								onClick: ($event) => modalAnularObligacion.value = false
							}, {
								default: withCtx(() => [createTextVNode("Cancelar")]),
								_: 1
							}, 8, ["onClick"]), createVNode(_component_UButton, {
								color: "red",
								loading: unref(anulandoObligacion),
								disabled: !unref(formAnular).motivo,
								onClick: confirmarAnularObligacion
							}, {
								default: withCtx(() => [createTextVNode(" Anular obligación ")]),
								_: 1
							}, 8, ["loading", "disabled"])])];
						}),
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="space-y-3"${_scopeId}>`);
								_push(ssrRenderComponent(_component_UAlert, {
									color: "red",
									variant: "subtle",
									title: "Solo úsalo para corregir un error de generación.",
									description: "La obligación queda marcada ANULADA (no se borra) y deja de aparecer como cartera pendiente. Solo aplica si aún no tiene ningún abono aplicado."
								}, null, _parent, _scopeId));
								_push(`<p class="text-sm text-slate-600"${_scopeId}><span class="text-slate-500"${_scopeId}>Concepto:</span> ${ssrInterpolate(unref(obligacionAnulando)?.concepto)} — <span class="font-medium"${_scopeId}>${ssrInterpolate(unref(moneda)(unref(obligacionAnulando)?.valorOriginal))}</span></p>`);
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Motivo de la anulación" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UTextarea, {
											modelValue: unref(formAnular).motivo,
											"onUpdate:modelValue": ($event) => unref(formAnular).motivo = $event
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UTextarea, {
											modelValue: unref(formAnular).motivo,
											"onUpdate:modelValue": ($event) => unref(formAnular).motivo = $event
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "space-y-3" }, [
								createVNode(_component_UAlert, {
									color: "red",
									variant: "subtle",
									title: "Solo úsalo para corregir un error de generación.",
									description: "La obligación queda marcada ANULADA (no se borra) y deja de aparecer como cartera pendiente. Solo aplica si aún no tiene ningún abono aplicado."
								}),
								createVNode("p", { class: "text-sm text-slate-600" }, [
									createVNode("span", { class: "text-slate-500" }, "Concepto:"),
									createTextVNode(" " + toDisplayString(unref(obligacionAnulando)?.concepto) + " — ", 1),
									createVNode("span", { class: "font-medium" }, toDisplayString(unref(moneda)(unref(obligacionAnulando)?.valorOriginal)), 1)
								]),
								createVNode(_component_UFormGroup, { label: "Motivo de la anulación" }, {
									default: withCtx(() => [createVNode(_component_UTextarea, {
										modelValue: unref(formAnular).motivo,
										"onUpdate:modelValue": ($event) => unref(formAnular).motivo = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								})
							])];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(_component_UCard, null, {
						header: withCtx(() => [createVNode("p", { class: "font-semibold text-slate-900" }, "Anular obligación")]),
						footer: withCtx(() => [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
							color: "gray",
							variant: "ghost",
							onClick: ($event) => modalAnularObligacion.value = false
						}, {
							default: withCtx(() => [createTextVNode("Cancelar")]),
							_: 1
						}, 8, ["onClick"]), createVNode(_component_UButton, {
							color: "red",
							loading: unref(anulandoObligacion),
							disabled: !unref(formAnular).motivo,
							onClick: confirmarAnularObligacion
						}, {
							default: withCtx(() => [createTextVNode(" Anular obligación ")]),
							_: 1
						}, 8, ["loading", "disabled"])])]),
						default: withCtx(() => [createVNode("div", { class: "space-y-3" }, [
							createVNode(_component_UAlert, {
								color: "red",
								variant: "subtle",
								title: "Solo úsalo para corregir un error de generación.",
								description: "La obligación queda marcada ANULADA (no se borra) y deja de aparecer como cartera pendiente. Solo aplica si aún no tiene ningún abono aplicado."
							}),
							createVNode("p", { class: "text-sm text-slate-600" }, [
								createVNode("span", { class: "text-slate-500" }, "Concepto:"),
								createTextVNode(" " + toDisplayString(unref(obligacionAnulando)?.concepto) + " — ", 1),
								createVNode("span", { class: "font-medium" }, toDisplayString(unref(moneda)(unref(obligacionAnulando)?.valorOriginal)), 1)
							]),
							createVNode(_component_UFormGroup, { label: "Motivo de la anulación" }, {
								default: withCtx(() => [createVNode(_component_UTextarea, {
									modelValue: unref(formAnular).motivo,
									"onUpdate:modelValue": ($event) => unref(formAnular).motivo = $event
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
				modelValue: unref(modalPrevisualizacion),
				"onUpdate:modelValue": ($event) => isRef(modalPrevisualizacion) ? modalPrevisualizacion.value = $event : null,
				ui: { width: "sm:max-w-xl" }
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UCard, null, {
						header: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>Previsualización del recaudo</p>`);
							else return [createVNode("p", { class: "font-semibold text-slate-900" }, "Previsualización del recaudo")];
						}),
						footer: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex justify-end gap-2"${_scopeId}>`);
								_push(ssrRenderComponent(_component_UButton, {
									color: "gray",
									variant: "ghost",
									onClick: ($event) => modalPrevisualizacion.value = false
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`Cancelar`);
										else return [createTextVNode("Cancelar")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UButton, {
									color: "amber",
									loading: unref(registrandoPago),
									disabled: unref(cargandoPrevisualizacion) || !unref(previsualizacion),
									onClick: registrarPago
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(` Confirmar y generar recibo `);
										else return [createTextVNode(" Confirmar y generar recibo ")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
								color: "gray",
								variant: "ghost",
								onClick: ($event) => modalPrevisualizacion.value = false
							}, {
								default: withCtx(() => [createTextVNode("Cancelar")]),
								_: 1
							}, 8, ["onClick"]), createVNode(_component_UButton, {
								color: "amber",
								loading: unref(registrandoPago),
								disabled: unref(cargandoPrevisualizacion) || !unref(previsualizacion),
								onClick: registrarPago
							}, {
								default: withCtx(() => [createTextVNode(" Confirmar y generar recibo ")]),
								_: 1
							}, 8, ["loading", "disabled"])])];
						}),
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								if (unref(cargandoPrevisualizacion)) _push(`<div class="text-center py-10 text-slate-500"${_scopeId}>Calculando aplicación…</div>`);
								else if (unref(previsualizacion)) {
									_push(`<div class="space-y-4"${_scopeId}><div class="grid grid-cols-2 gap-2 text-sm"${_scopeId}><p${_scopeId}><span class="text-slate-500"${_scopeId}>Cliente:</span> ${ssrInterpolate(unref(previsualizacion).contrato?.cliente?.nombreCompleto)}</p><p${_scopeId}><span class="text-slate-500"${_scopeId}>Inmueble:</span> ${ssrInterpolate(unref(previsualizacion).contrato?.inmueble?.direccion)}</p><p${_scopeId}><span class="text-slate-500"${_scopeId}>Monto recibido:</span> <span class="font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(unref(moneda)(unref(previsualizacion).valorTotalPago))}</span></p><p${_scopeId}><span class="text-slate-500"${_scopeId}>Medio de pago:</span> ${ssrInterpolate(unref(previsualizacion).detallesPago.map((d) => d.medioPago === "EFECTIVO" ? "Efectivo" : "Transferencia").join(" + "))}</p></div><div${_scopeId}><p class="text-sm font-medium text-slate-900 mb-2"${_scopeId}>Aplicación del dinero (Canon → Novedad → Mora)</p>`);
									if (!unref(previsualizacion).aplicaciones.length) _push(`<p class="text-sm text-slate-400"${_scopeId}> El pago no alcanza a aplicarse a ninguna obligación pendiente. </p>`);
									else {
										_push(`<table class="w-full text-sm"${_scopeId}><thead${_scopeId}><tr class="text-left text-slate-500 border-b"${_scopeId}><th class="py-1.5 pr-2"${_scopeId}>Concepto</th><th class="py-1.5 pr-2"${_scopeId}>Tipo</th><th class="py-1.5 pr-2 text-right"${_scopeId}>Aplicado</th><th class="py-1.5 text-right"${_scopeId}>Saldo posterior</th></tr></thead><tbody${_scopeId}><!--[-->`);
										ssrRenderList(unref(previsualizacion).aplicaciones, (a, i) => {
											_push(`<tr class="border-b last:border-0"${_scopeId}><td class="py-1.5 pr-2 text-slate-900"${_scopeId}>${ssrInterpolate(a.obligacion?.concepto)}</td><td class="py-1.5 pr-2"${_scopeId}>`);
											_push(ssrRenderComponent(_component_UBadge, {
												color: a.concepto === "MORA" ? "red" : "gray",
												variant: "subtle",
												size: "xs"
											}, {
												default: withCtx((_, _push, _parent, _scopeId) => {
													if (_push) _push(`${ssrInterpolate(etiquetaConcepto(a))}`);
													else return [createTextVNode(toDisplayString(etiquetaConcepto(a)), 1)];
												}),
												_: 2
											}, _parent, _scopeId));
											_push(`</td><td class="py-1.5 pr-2 text-right text-slate-900"${_scopeId}>${ssrInterpolate(unref(moneda)(a.monto))}</td><td class="py-1.5 text-right text-slate-600"${_scopeId}>${ssrInterpolate(unref(moneda)(a.saldoPosterior))}</td></tr>`);
										});
										_push(`<!--]--></tbody></table>`);
									}
									_push(`</div>`);
									if (Number(unref(previsualizacion).excedente) > 0) _push(ssrRenderComponent(_component_UAlert, {
										color: "amber",
										variant: "subtle",
										title: unref(dejarExcedenteComoSaldoFavor) ? `${unref(moneda)(unref(previsualizacion).excedente)} quedarán como saldo a favor del contrato` : `Cambio a entregar: ${unref(moneda)(unref(previsualizacion).excedente)}`
									}, null, _parent, _scopeId));
									else _push(`<!---->`);
									_push(`</div>`);
								} else _push(`<!---->`);
							} else return [unref(cargandoPrevisualizacion) ? (openBlock(), createBlock("div", {
								key: 0,
								class: "text-center py-10 text-slate-500"
							}, "Calculando aplicación…")) : unref(previsualizacion) ? (openBlock(), createBlock("div", {
								key: 1,
								class: "space-y-4"
							}, [
								createVNode("div", { class: "grid grid-cols-2 gap-2 text-sm" }, [
									createVNode("p", null, [createVNode("span", { class: "text-slate-500" }, "Cliente:"), createTextVNode(" " + toDisplayString(unref(previsualizacion).contrato?.cliente?.nombreCompleto), 1)]),
									createVNode("p", null, [createVNode("span", { class: "text-slate-500" }, "Inmueble:"), createTextVNode(" " + toDisplayString(unref(previsualizacion).contrato?.inmueble?.direccion), 1)]),
									createVNode("p", null, [
										createVNode("span", { class: "text-slate-500" }, "Monto recibido:"),
										createTextVNode(),
										createVNode("span", { class: "font-semibold text-slate-900" }, toDisplayString(unref(moneda)(unref(previsualizacion).valorTotalPago)), 1)
									]),
									createVNode("p", null, [createVNode("span", { class: "text-slate-500" }, "Medio de pago:"), createTextVNode(" " + toDisplayString(unref(previsualizacion).detallesPago.map((d) => d.medioPago === "EFECTIVO" ? "Efectivo" : "Transferencia").join(" + ")), 1)])
								]),
								createVNode("div", null, [createVNode("p", { class: "text-sm font-medium text-slate-900 mb-2" }, "Aplicación del dinero (Canon → Novedad → Mora)"), !unref(previsualizacion).aplicaciones.length ? (openBlock(), createBlock("p", {
									key: 0,
									class: "text-sm text-slate-400"
								}, " El pago no alcanza a aplicarse a ninguna obligación pendiente. ")) : (openBlock(), createBlock("table", {
									key: 1,
									class: "w-full text-sm"
								}, [createVNode("thead", null, [createVNode("tr", { class: "text-left text-slate-500 border-b" }, [
									createVNode("th", { class: "py-1.5 pr-2" }, "Concepto"),
									createVNode("th", { class: "py-1.5 pr-2" }, "Tipo"),
									createVNode("th", { class: "py-1.5 pr-2 text-right" }, "Aplicado"),
									createVNode("th", { class: "py-1.5 text-right" }, "Saldo posterior")
								])]), createVNode("tbody", null, [(openBlock(true), createBlock(Fragment, null, renderList(unref(previsualizacion).aplicaciones, (a, i) => {
									return openBlock(), createBlock("tr", {
										key: i,
										class: "border-b last:border-0"
									}, [
										createVNode("td", { class: "py-1.5 pr-2 text-slate-900" }, toDisplayString(a.obligacion?.concepto), 1),
										createVNode("td", { class: "py-1.5 pr-2" }, [createVNode(_component_UBadge, {
											color: a.concepto === "MORA" ? "red" : "gray",
											variant: "subtle",
											size: "xs"
										}, {
											default: withCtx(() => [createTextVNode(toDisplayString(etiquetaConcepto(a)), 1)]),
											_: 2
										}, 1032, ["color"])]),
										createVNode("td", { class: "py-1.5 pr-2 text-right text-slate-900" }, toDisplayString(unref(moneda)(a.monto)), 1),
										createVNode("td", { class: "py-1.5 text-right text-slate-600" }, toDisplayString(unref(moneda)(a.saldoPosterior)), 1)
									]);
								}), 128))])]))]),
								Number(unref(previsualizacion).excedente) > 0 ? (openBlock(), createBlock(_component_UAlert, {
									key: 0,
									color: "amber",
									variant: "subtle",
									title: unref(dejarExcedenteComoSaldoFavor) ? `${unref(moneda)(unref(previsualizacion).excedente)} quedarán como saldo a favor del contrato` : `Cambio a entregar: ${unref(moneda)(unref(previsualizacion).excedente)}`
								}, null, 8, ["title"])) : createCommentVNode("", true)
							])) : createCommentVNode("", true)];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(_component_UCard, null, {
						header: withCtx(() => [createVNode("p", { class: "font-semibold text-slate-900" }, "Previsualización del recaudo")]),
						footer: withCtx(() => [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
							color: "gray",
							variant: "ghost",
							onClick: ($event) => modalPrevisualizacion.value = false
						}, {
							default: withCtx(() => [createTextVNode("Cancelar")]),
							_: 1
						}, 8, ["onClick"]), createVNode(_component_UButton, {
							color: "amber",
							loading: unref(registrandoPago),
							disabled: unref(cargandoPrevisualizacion) || !unref(previsualizacion),
							onClick: registrarPago
						}, {
							default: withCtx(() => [createTextVNode(" Confirmar y generar recibo ")]),
							_: 1
						}, 8, ["loading", "disabled"])])]),
						default: withCtx(() => [unref(cargandoPrevisualizacion) ? (openBlock(), createBlock("div", {
							key: 0,
							class: "text-center py-10 text-slate-500"
						}, "Calculando aplicación…")) : unref(previsualizacion) ? (openBlock(), createBlock("div", {
							key: 1,
							class: "space-y-4"
						}, [
							createVNode("div", { class: "grid grid-cols-2 gap-2 text-sm" }, [
								createVNode("p", null, [createVNode("span", { class: "text-slate-500" }, "Cliente:"), createTextVNode(" " + toDisplayString(unref(previsualizacion).contrato?.cliente?.nombreCompleto), 1)]),
								createVNode("p", null, [createVNode("span", { class: "text-slate-500" }, "Inmueble:"), createTextVNode(" " + toDisplayString(unref(previsualizacion).contrato?.inmueble?.direccion), 1)]),
								createVNode("p", null, [
									createVNode("span", { class: "text-slate-500" }, "Monto recibido:"),
									createTextVNode(),
									createVNode("span", { class: "font-semibold text-slate-900" }, toDisplayString(unref(moneda)(unref(previsualizacion).valorTotalPago)), 1)
								]),
								createVNode("p", null, [createVNode("span", { class: "text-slate-500" }, "Medio de pago:"), createTextVNode(" " + toDisplayString(unref(previsualizacion).detallesPago.map((d) => d.medioPago === "EFECTIVO" ? "Efectivo" : "Transferencia").join(" + ")), 1)])
							]),
							createVNode("div", null, [createVNode("p", { class: "text-sm font-medium text-slate-900 mb-2" }, "Aplicación del dinero (Canon → Novedad → Mora)"), !unref(previsualizacion).aplicaciones.length ? (openBlock(), createBlock("p", {
								key: 0,
								class: "text-sm text-slate-400"
							}, " El pago no alcanza a aplicarse a ninguna obligación pendiente. ")) : (openBlock(), createBlock("table", {
								key: 1,
								class: "w-full text-sm"
							}, [createVNode("thead", null, [createVNode("tr", { class: "text-left text-slate-500 border-b" }, [
								createVNode("th", { class: "py-1.5 pr-2" }, "Concepto"),
								createVNode("th", { class: "py-1.5 pr-2" }, "Tipo"),
								createVNode("th", { class: "py-1.5 pr-2 text-right" }, "Aplicado"),
								createVNode("th", { class: "py-1.5 text-right" }, "Saldo posterior")
							])]), createVNode("tbody", null, [(openBlock(true), createBlock(Fragment, null, renderList(unref(previsualizacion).aplicaciones, (a, i) => {
								return openBlock(), createBlock("tr", {
									key: i,
									class: "border-b last:border-0"
								}, [
									createVNode("td", { class: "py-1.5 pr-2 text-slate-900" }, toDisplayString(a.obligacion?.concepto), 1),
									createVNode("td", { class: "py-1.5 pr-2" }, [createVNode(_component_UBadge, {
										color: a.concepto === "MORA" ? "red" : "gray",
										variant: "subtle",
										size: "xs"
									}, {
										default: withCtx(() => [createTextVNode(toDisplayString(etiquetaConcepto(a)), 1)]),
										_: 2
									}, 1032, ["color"])]),
									createVNode("td", { class: "py-1.5 pr-2 text-right text-slate-900" }, toDisplayString(unref(moneda)(a.monto)), 1),
									createVNode("td", { class: "py-1.5 text-right text-slate-600" }, toDisplayString(unref(moneda)(a.saldoPosterior)), 1)
								]);
							}), 128))])]))]),
							Number(unref(previsualizacion).excedente) > 0 ? (openBlock(), createBlock(_component_UAlert, {
								key: 0,
								color: "amber",
								variant: "subtle",
								title: unref(dejarExcedenteComoSaldoFavor) ? `${unref(moneda)(unref(previsualizacion).excedente)} quedarán como saldo a favor del contrato` : `Cambio a entregar: ${unref(moneda)(unref(previsualizacion).excedente)}`
							}, null, 8, ["title"])) : createCommentVNode("", true)
						])) : createCommentVNode("", true)]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UModal, {
				modelValue: unref(modalLiquidar),
				"onUpdate:modelValue": ($event) => isRef(modalLiquidar) ? modalLiquidar.value = $event : null
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UCard, null, {
						header: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>Liquidar depósito en custodia</p>`);
							else return [createVNode("p", { class: "font-semibold text-slate-900" }, "Liquidar depósito en custodia")];
						}),
						footer: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex justify-end gap-2"${_scopeId}>`);
								_push(ssrRenderComponent(_component_UButton, {
									color: "gray",
									variant: "ghost",
									onClick: ($event) => modalLiquidar.value = false
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`Cancelar`);
										else return [createTextVNode("Cancelar")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UButton, {
									color: "amber",
									loading: unref(liquidando),
									onClick: confirmarLiquidarDeposito
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`Liquidar`);
										else return [createTextVNode("Liquidar")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
								color: "gray",
								variant: "ghost",
								onClick: ($event) => modalLiquidar.value = false
							}, {
								default: withCtx(() => [createTextVNode("Cancelar")]),
								_: 1
							}, 8, ["onClick"]), createVNode(_component_UButton, {
								color: "amber",
								loading: unref(liquidando),
								onClick: confirmarLiquidarDeposito
							}, {
								default: withCtx(() => [createTextVNode("Liquidar")]),
								_: 1
							}, 8, ["loading"])])];
						}),
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="space-y-3"${_scopeId}><p class="text-sm text-slate-600"${_scopeId}> Depósito en custodia disponible: <span class="font-medium"${_scopeId}>${ssrInterpolate(unref(moneda)(unref(ficha)?.depositoCustodia))}</span></p><p class="text-sm font-medium text-slate-900"${_scopeId}>Descuentos (opcional)</p><!--[-->`);
								ssrRenderList(unref(descuentosDeposito), (descuento, i) => {
									_push(`<div class="flex gap-2 items-center"${_scopeId}>`);
									_push(ssrRenderComponent(_component_UInput, {
										modelValue: descuento.concepto,
										"onUpdate:modelValue": ($event) => descuento.concepto = $event,
										placeholder: "Concepto (ej: Aseo general)",
										class: "flex-1"
									}, null, _parent, _scopeId));
									_push(ssrRenderComponent(_component_UInput, {
										modelValue: descuento.valor,
										"onUpdate:modelValue": ($event) => descuento.valor = $event,
										modelModifiers: { number: true },
										type: "number",
										min: "0",
										placeholder: "Valor",
										class: "w-32"
									}, null, _parent, _scopeId));
									if (unref(descuentosDeposito).length > 1) _push(ssrRenderComponent(_component_UButton, {
										color: "red",
										variant: "ghost",
										icon: "i-heroicons-trash",
										onClick: ($event) => quitarDescuentoDeposito(i)
									}, null, _parent, _scopeId));
									else _push(`<!---->`);
									_push(`</div>`);
								});
								_push(`<!--]-->`);
								_push(ssrRenderComponent(_component_UButton, {
									size: "xs",
									variant: "soft",
									icon: "i-heroicons-plus",
									onClick: agregarDescuentoDeposito
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(` Agregar descuento `);
										else return [createTextVNode(" Agregar descuento ")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`<p class="text-sm text-slate-600 pt-2 border-t"${_scopeId}> Valor a devolver: <span class="font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(unref(moneda)(unref(valorADevolver)))}</span></p>`);
								if (unref(valorADevolver) > 0) {
									_push(`<!--[-->`);
									_push(ssrRenderComponent(_component_UFormGroup, { label: "Medio de pago de la devolución" }, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(ssrRenderComponent(_component_USelectMenu, {
												modelValue: unref(formLiquidar).medioPago,
												"onUpdate:modelValue": ($event) => unref(formLiquidar).medioPago = $event,
												options: medios
											}, null, _parent, _scopeId));
											else return [createVNode(_component_USelectMenu, {
												modelValue: unref(formLiquidar).medioPago,
												"onUpdate:modelValue": ($event) => unref(formLiquidar).medioPago = $event,
												options: medios
											}, null, 8, ["modelValue", "onUpdate:modelValue"])];
										}),
										_: 1
									}, _parent, _scopeId));
									if (unref(formLiquidar).medioPago === "TRANSFERENCIA") _push(ssrRenderComponent(_component_UFormGroup, { label: "Referencia" }, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(ssrRenderComponent(_component_UInput, {
												modelValue: unref(formLiquidar).referencia,
												"onUpdate:modelValue": ($event) => unref(formLiquidar).referencia = $event,
												placeholder: "Número de transacción"
											}, null, _parent, _scopeId));
											else return [createVNode(_component_UInput, {
												modelValue: unref(formLiquidar).referencia,
												"onUpdate:modelValue": ($event) => unref(formLiquidar).referencia = $event,
												placeholder: "Número de transacción"
											}, null, 8, ["modelValue", "onUpdate:modelValue"])];
										}),
										_: 1
									}, _parent, _scopeId));
									else _push(`<!---->`);
									_push(`<!--]-->`);
								} else _push(`<!---->`);
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Observaciones (opcional)" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UTextarea, {
											modelValue: unref(formLiquidar).observaciones,
											"onUpdate:modelValue": ($event) => unref(formLiquidar).observaciones = $event
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UTextarea, {
											modelValue: unref(formLiquidar).observaciones,
											"onUpdate:modelValue": ($event) => unref(formLiquidar).observaciones = $event
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "space-y-3" }, [
								createVNode("p", { class: "text-sm text-slate-600" }, [createTextVNode(" Depósito en custodia disponible: "), createVNode("span", { class: "font-medium" }, toDisplayString(unref(moneda)(unref(ficha)?.depositoCustodia)), 1)]),
								createVNode("p", { class: "text-sm font-medium text-slate-900" }, "Descuentos (opcional)"),
								(openBlock(true), createBlock(Fragment, null, renderList(unref(descuentosDeposito), (descuento, i) => {
									return openBlock(), createBlock("div", {
										key: i,
										class: "flex gap-2 items-center"
									}, [
										createVNode(_component_UInput, {
											modelValue: descuento.concepto,
											"onUpdate:modelValue": ($event) => descuento.concepto = $event,
											placeholder: "Concepto (ej: Aseo general)",
											class: "flex-1"
										}, null, 8, ["modelValue", "onUpdate:modelValue"]),
										createVNode(_component_UInput, {
											modelValue: descuento.valor,
											"onUpdate:modelValue": ($event) => descuento.valor = $event,
											modelModifiers: { number: true },
											type: "number",
											min: "0",
											placeholder: "Valor",
											class: "w-32"
										}, null, 8, ["modelValue", "onUpdate:modelValue"]),
										unref(descuentosDeposito).length > 1 ? (openBlock(), createBlock(_component_UButton, {
											key: 0,
											color: "red",
											variant: "ghost",
											icon: "i-heroicons-trash",
											onClick: ($event) => quitarDescuentoDeposito(i)
										}, null, 8, ["onClick"])) : createCommentVNode("", true)
									]);
								}), 128)),
								createVNode(_component_UButton, {
									size: "xs",
									variant: "soft",
									icon: "i-heroicons-plus",
									onClick: agregarDescuentoDeposito
								}, {
									default: withCtx(() => [createTextVNode(" Agregar descuento ")]),
									_: 1
								}),
								createVNode("p", { class: "text-sm text-slate-600 pt-2 border-t" }, [createTextVNode(" Valor a devolver: "), createVNode("span", { class: "font-semibold text-slate-900" }, toDisplayString(unref(moneda)(unref(valorADevolver))), 1)]),
								unref(valorADevolver) > 0 ? (openBlock(), createBlock(Fragment, { key: 0 }, [createVNode(_component_UFormGroup, { label: "Medio de pago de la devolución" }, {
									default: withCtx(() => [createVNode(_component_USelectMenu, {
										modelValue: unref(formLiquidar).medioPago,
										"onUpdate:modelValue": ($event) => unref(formLiquidar).medioPago = $event,
										options: medios
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}), unref(formLiquidar).medioPago === "TRANSFERENCIA" ? (openBlock(), createBlock(_component_UFormGroup, {
									key: 0,
									label: "Referencia"
								}, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(formLiquidar).referencia,
										"onUpdate:modelValue": ($event) => unref(formLiquidar).referencia = $event,
										placeholder: "Número de transacción"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								})) : createCommentVNode("", true)], 64)) : createCommentVNode("", true),
								createVNode(_component_UFormGroup, { label: "Observaciones (opcional)" }, {
									default: withCtx(() => [createVNode(_component_UTextarea, {
										modelValue: unref(formLiquidar).observaciones,
										"onUpdate:modelValue": ($event) => unref(formLiquidar).observaciones = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								})
							])];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(_component_UCard, null, {
						header: withCtx(() => [createVNode("p", { class: "font-semibold text-slate-900" }, "Liquidar depósito en custodia")]),
						footer: withCtx(() => [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
							color: "gray",
							variant: "ghost",
							onClick: ($event) => modalLiquidar.value = false
						}, {
							default: withCtx(() => [createTextVNode("Cancelar")]),
							_: 1
						}, 8, ["onClick"]), createVNode(_component_UButton, {
							color: "amber",
							loading: unref(liquidando),
							onClick: confirmarLiquidarDeposito
						}, {
							default: withCtx(() => [createTextVNode("Liquidar")]),
							_: 1
						}, 8, ["loading"])])]),
						default: withCtx(() => [createVNode("div", { class: "space-y-3" }, [
							createVNode("p", { class: "text-sm text-slate-600" }, [createTextVNode(" Depósito en custodia disponible: "), createVNode("span", { class: "font-medium" }, toDisplayString(unref(moneda)(unref(ficha)?.depositoCustodia)), 1)]),
							createVNode("p", { class: "text-sm font-medium text-slate-900" }, "Descuentos (opcional)"),
							(openBlock(true), createBlock(Fragment, null, renderList(unref(descuentosDeposito), (descuento, i) => {
								return openBlock(), createBlock("div", {
									key: i,
									class: "flex gap-2 items-center"
								}, [
									createVNode(_component_UInput, {
										modelValue: descuento.concepto,
										"onUpdate:modelValue": ($event) => descuento.concepto = $event,
										placeholder: "Concepto (ej: Aseo general)",
										class: "flex-1"
									}, null, 8, ["modelValue", "onUpdate:modelValue"]),
									createVNode(_component_UInput, {
										modelValue: descuento.valor,
										"onUpdate:modelValue": ($event) => descuento.valor = $event,
										modelModifiers: { number: true },
										type: "number",
										min: "0",
										placeholder: "Valor",
										class: "w-32"
									}, null, 8, ["modelValue", "onUpdate:modelValue"]),
									unref(descuentosDeposito).length > 1 ? (openBlock(), createBlock(_component_UButton, {
										key: 0,
										color: "red",
										variant: "ghost",
										icon: "i-heroicons-trash",
										onClick: ($event) => quitarDescuentoDeposito(i)
									}, null, 8, ["onClick"])) : createCommentVNode("", true)
								]);
							}), 128)),
							createVNode(_component_UButton, {
								size: "xs",
								variant: "soft",
								icon: "i-heroicons-plus",
								onClick: agregarDescuentoDeposito
							}, {
								default: withCtx(() => [createTextVNode(" Agregar descuento ")]),
								_: 1
							}),
							createVNode("p", { class: "text-sm text-slate-600 pt-2 border-t" }, [createTextVNode(" Valor a devolver: "), createVNode("span", { class: "font-semibold text-slate-900" }, toDisplayString(unref(moneda)(unref(valorADevolver))), 1)]),
							unref(valorADevolver) > 0 ? (openBlock(), createBlock(Fragment, { key: 0 }, [createVNode(_component_UFormGroup, { label: "Medio de pago de la devolución" }, {
								default: withCtx(() => [createVNode(_component_USelectMenu, {
									modelValue: unref(formLiquidar).medioPago,
									"onUpdate:modelValue": ($event) => unref(formLiquidar).medioPago = $event,
									options: medios
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}), unref(formLiquidar).medioPago === "TRANSFERENCIA" ? (openBlock(), createBlock(_component_UFormGroup, {
								key: 0,
								label: "Referencia"
							}, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(formLiquidar).referencia,
									"onUpdate:modelValue": ($event) => unref(formLiquidar).referencia = $event,
									placeholder: "Número de transacción"
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							})) : createCommentVNode("", true)], 64)) : createCommentVNode("", true),
							createVNode(_component_UFormGroup, { label: "Observaciones (opcional)" }, {
								default: withCtx(() => [createVNode(_component_UTextarea, {
									modelValue: unref(formLiquidar).observaciones,
									"onUpdate:modelValue": ($event) => unref(formLiquidar).observaciones = $event
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
//#region pages/recaudo/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/recaudo/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var recaudo_default = index_vue_vue_type_script_setup_true_lang_default;

export { recaudo_default as default };
//# sourceMappingURL=recaudo-dY3Z8UNm.mjs.map
