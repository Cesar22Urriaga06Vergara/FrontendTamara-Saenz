import { u as useRoute$1, N as NuxtLink } from '../virtual/entry.mjs';
import { t as Badge_default } from './Badge-Dji78drx.mjs';
import { t as Alert_default } from './Alert-Bv_RgsgM.mjs';
import { t as FormGroup_default } from './FormGroup-Y-Nkh3aN.mjs';
import { t as Card_default } from './Card-j-DCNf6K.mjs';
import { t as Modal_default } from './Modal-B8wn1zi5.mjs';
import { t as Button_default } from './Button-CoYovqJ9.mjs';
import { t as Dropdown_default } from './Dropdown-BjJ7vUzi.mjs';
import { t as Textarea_default } from './Textarea-E1R2aU6E.mjs';
import { u as useApiFetch } from './useApiFetch-B8kTc45P.mjs';
import { u as useFormatoCO } from './useFormatoCO-CX_CcnnC.mjs';
import { u as usePdfDownload } from './usePdfDownload-1a7-2EuR.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, unref, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, isRef, useSSRContext } from 'vue';
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
import './useButtonGroup-OQHG41CY.mjs';
import './Avatar-BOI4zec4.mjs';
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
import './Kbd-rjcREfaE.mjs';
import './use-resolve-button-type-DZKnDGM_.mjs';
import './calculate-active-index-CJA4E3gh.mjs';
import './use-text-value-DhHPSnE-.mjs';
import './usePopper-BCEqNZ_Z.mjs';
import './useFormGroup-BLFts8mq.mjs';

//#region pages/recibos/[id].vue?vue&type=script&setup=true&lang.ts
var _id__vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "[id]",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* Detalle de un recibo — permite volver a consultarlo y descargarlo en cualquier momento,
		* sin pasar por el cliente/contrato ni por el módulo de Recaudo (historial, §6). NUNCA se
		* edita un recibo aquí: la única acción de corrección disponible es Anular (§7), que conserva
		* el registro histórico completo (§8) — nunca se elimina físicamente.
		*/
		const route = useRoute$1();
		const { moneda, fecha } = useFormatoCO();
		const cargando = ref(true);
		const recibo = ref(null);
		const error = ref("");
		async function cargar() {
			cargando.value = true;
			try {
				recibo.value = await useApiFetch(`/recaudo/recibos/${route.params.id}`);
				error.value = "";
			} catch (e) {
				error.value = e?.data?.message || "No fue posible cargar el recibo.";
			} finally {
				cargando.value = false;
			}
		}
		const descargando = ref(false);
		async function descargar(formato) {
			if (descargando.value) return;
			descargando.value = true;
			try {
				await usePdfDownload(`/documentos/recibos/${route.params.id}/pdf?formato=${formato}`, recibo.value?.consecutivo);
			} catch (e) {
				error.value = e?.data?.message || "No fue posible descargar el PDF.";
			} finally {
				descargando.value = false;
			}
		}
		function etiquetaConcepto(aplicacion) {
			return aplicacion.concepto === "MORA" ? "Mora" : "Capital";
		}
		const modalAnular = ref(false);
		const anulando = ref(false);
		const motivoAnulacion = ref("");
		async function confirmarAnular() {
			anulando.value = true;
			try {
				await useApiFetch(`/recaudo/recibos/${route.params.id}/anular`, {
					method: "PATCH",
					body: { motivo: motivoAnulacion.value }
				});
				modalAnular.value = false;
				await cargar();
			} catch (e) {
				error.value = e?.data?.message || "No fue posible anular el recibo.";
			} finally {
				anulando.value = false;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UButton = Button_default;
			const _component_UDropdown = Dropdown_default;
			const _component_UAlert = Alert_default;
			const _component_UCard = Card_default;
			const _component_NuxtLink = NuxtLink;
			const _component_UBadge = Badge_default;
			const _component_UModal = Modal_default;
			const _component_UFormGroup = FormGroup_default;
			const _component_UTextarea = Textarea_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-3xl" }, _attrs))}><div class="flex items-center justify-between mb-4"><div class="flex items-center gap-3">`);
			_push(ssrRenderComponent(_component_UButton, {
				color: "gray",
				variant: "ghost",
				icon: "i-heroicons-arrow-left",
				to: "/recibos"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Volver`);
					else return [createTextVNode("Volver")];
				}),
				_: 1
			}, _parent));
			_push(`<h1 class="text-xl font-semibold text-slate-900">Recibo ${ssrInterpolate(unref(recibo)?.consecutivo)}</h1></div>`);
			if (unref(recibo)) {
				_push(`<div class="flex gap-2">`);
				if (unref(recibo).estado === "EMITIDO") _push(ssrRenderComponent(_component_UButton, {
					size: "sm",
					color: "red",
					variant: "soft",
					icon: "i-heroicons-no-symbol",
					onClick: ($event) => {
						motivoAnulacion.value = "";
						modalAnular.value = true;
					}
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(` Anular `);
						else return [createTextVNode(" Anular ")];
					}),
					_: 1
				}, _parent));
				else _push(`<!---->`);
				_push(ssrRenderComponent(_component_UDropdown, { items: [[{
					label: "PDF Carta",
					click: () => descargar("CARTA")
				}, {
					label: "PDF Media Carta",
					click: () => descargar("MEDIA_CARTA")
				}]] }, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(ssrRenderComponent(_component_UButton, {
							size: "sm",
							color: "amber",
							icon: "i-heroicons-arrow-down-tray",
							loading: unref(descargando)
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Descargar PDF `);
								else return [createTextVNode(" Descargar PDF ")];
							}),
							_: 1
						}, _parent, _scopeId));
						else return [createVNode(_component_UButton, {
							size: "sm",
							color: "amber",
							icon: "i-heroicons-arrow-down-tray",
							loading: unref(descargando)
						}, {
							default: withCtx(() => [createTextVNode(" Descargar PDF ")]),
							_: 1
						}, 8, ["loading"])];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div>`);
			if (unref(error)) _push(ssrRenderComponent(_component_UAlert, {
				color: "red",
				variant: "subtle",
				title: unref(error),
				class: "mb-4"
			}, null, _parent));
			else _push(`<!---->`);
			if (unref(cargando)) _push(`<div class="text-center py-16 text-slate-500">Cargando recibo…</div>`);
			else if (unref(recibo)) {
				_push(`<div class="space-y-4">`);
				if (unref(recibo).estado === "ANULADO") _push(ssrRenderComponent(_component_UAlert, {
					color: "red",
					variant: "subtle",
					title: "Este recibo está ANULADO",
					description: unref(recibo).motivoAnulacion ? `Motivo: ${unref(recibo).motivoAnulacion}` : void 0
				}, null, _parent));
				else _push(`<!---->`);
				_push(ssrRenderComponent(_component_UCard, null, {
					header: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>Datos del recibo</p>`);
						else return [createVNode("p", { class: "font-semibold text-slate-900" }, "Datos del recibo")];
					}),
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<div class="grid grid-cols-2 gap-3 text-sm"${_scopeId}><p${_scopeId}><span class="text-slate-500"${_scopeId}>Número:</span> ${ssrInterpolate(unref(recibo).consecutivo)}</p><p${_scopeId}><span class="text-slate-500"${_scopeId}>Fecha:</span> ${ssrInterpolate(unref(fecha)(unref(recibo).creadoEn))}</p><p${_scopeId}><span class="text-slate-500"${_scopeId}>Cliente:</span> ${ssrInterpolate(unref(recibo).contrato?.cliente?.nombreCompleto)} (${ssrInterpolate(unref(recibo).contrato?.cliente?.numeroDocumento)})</p><p${_scopeId}><span class="text-slate-500"${_scopeId}>Contrato:</span>`);
							_push(ssrRenderComponent(_component_NuxtLink, {
								to: `/recaudo?contratoId=${unref(recibo).contrato?.id}`,
								class: "text-amber-600 hover:underline"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`Ver ficha del contrato`);
									else return [createTextVNode("Ver ficha del contrato")];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</p><p class="col-span-2"${_scopeId}><span class="text-slate-500"${_scopeId}>Inmueble:</span> ${ssrInterpolate(unref(recibo).contrato?.inmueble?.direccion)} (${ssrInterpolate(unref(recibo).contrato?.inmueble?.barrio)})</p><p${_scopeId}><span class="text-slate-500"${_scopeId}>Estado:</span>`);
							_push(ssrRenderComponent(_component_UBadge, {
								color: unref(recibo).estado === "ANULADO" ? "red" : "emerald",
								variant: "subtle",
								class: "ml-1"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`${ssrInterpolate(unref(recibo).estado)}`);
									else return [createTextVNode(toDisplayString(unref(recibo).estado), 1)];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</p></div>`);
						} else return [createVNode("div", { class: "grid grid-cols-2 gap-3 text-sm" }, [
							createVNode("p", null, [createVNode("span", { class: "text-slate-500" }, "Número:"), createTextVNode(" " + toDisplayString(unref(recibo).consecutivo), 1)]),
							createVNode("p", null, [createVNode("span", { class: "text-slate-500" }, "Fecha:"), createTextVNode(" " + toDisplayString(unref(fecha)(unref(recibo).creadoEn)), 1)]),
							createVNode("p", null, [createVNode("span", { class: "text-slate-500" }, "Cliente:"), createTextVNode(" " + toDisplayString(unref(recibo).contrato?.cliente?.nombreCompleto) + " (" + toDisplayString(unref(recibo).contrato?.cliente?.numeroDocumento) + ")", 1)]),
							createVNode("p", null, [createVNode("span", { class: "text-slate-500" }, "Contrato:"), createVNode(_component_NuxtLink, {
								to: `/recaudo?contratoId=${unref(recibo).contrato?.id}`,
								class: "text-amber-600 hover:underline"
							}, {
								default: withCtx(() => [createTextVNode("Ver ficha del contrato")]),
								_: 1
							}, 8, ["to"])]),
							createVNode("p", { class: "col-span-2" }, [createVNode("span", { class: "text-slate-500" }, "Inmueble:"), createTextVNode(" " + toDisplayString(unref(recibo).contrato?.inmueble?.direccion) + " (" + toDisplayString(unref(recibo).contrato?.inmueble?.barrio) + ")", 1)]),
							createVNode("p", null, [createVNode("span", { class: "text-slate-500" }, "Estado:"), createVNode(_component_UBadge, {
								color: unref(recibo).estado === "ANULADO" ? "red" : "emerald",
								variant: "subtle",
								class: "ml-1"
							}, {
								default: withCtx(() => [createTextVNode(toDisplayString(unref(recibo).estado), 1)]),
								_: 1
							}, 8, ["color"])])
						])];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_component_UCard, null, {
					header: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>Medios de pago</p>`);
						else return [createVNode("p", { class: "font-semibold text-slate-900" }, "Medios de pago")];
					}),
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<div class="space-y-1 text-sm"${_scopeId}><!--[-->`);
							ssrRenderList(unref(recibo).detallesPago, (d) => {
								_push(`<div class="flex justify-between"${_scopeId}><span class="text-slate-700"${_scopeId}>${ssrInterpolate(d.medioPago === "EFECTIVO" ? "Efectivo" : "Transferencia")} `);
								if (d.referencia) _push(`<span class="text-slate-400"${_scopeId}>(Ref: ${ssrInterpolate(d.referencia)})</span>`);
								else _push(`<!---->`);
								_push(`</span><span class="font-medium text-slate-900"${_scopeId}>${ssrInterpolate(unref(moneda)(d.monto))}</span></div>`);
							});
							_push(`<!--]--></div><div class="flex justify-between border-t mt-3 pt-3 text-sm"${_scopeId}><span class="font-semibold text-slate-900"${_scopeId}>Total recibido</span><span class="font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(unref(moneda)(unref(recibo).valorTotal))}</span></div>`);
							if (Number(unref(recibo).excedente) > 0) _push(`<p class="text-xs text-amber-600 mt-1"${_scopeId}>${ssrInterpolate(unref(recibo).excedenteComoSaldoFavor ? "Excedente aplicado a saldo a favor" : "Cambio entregado")}: ${ssrInterpolate(unref(moneda)(unref(recibo).excedente))}</p>`);
							else _push(`<!---->`);
						} else return [
							createVNode("div", { class: "space-y-1 text-sm" }, [(openBlock(true), createBlock(Fragment, null, renderList(unref(recibo).detallesPago, (d) => {
								return openBlock(), createBlock("div", {
									key: d.id,
									class: "flex justify-between"
								}, [createVNode("span", { class: "text-slate-700" }, [createTextVNode(toDisplayString(d.medioPago === "EFECTIVO" ? "Efectivo" : "Transferencia") + " ", 1), d.referencia ? (openBlock(), createBlock("span", {
									key: 0,
									class: "text-slate-400"
								}, "(Ref: " + toDisplayString(d.referencia) + ")", 1)) : createCommentVNode("", true)]), createVNode("span", { class: "font-medium text-slate-900" }, toDisplayString(unref(moneda)(d.monto)), 1)]);
							}), 128))]),
							createVNode("div", { class: "flex justify-between border-t mt-3 pt-3 text-sm" }, [createVNode("span", { class: "font-semibold text-slate-900" }, "Total recibido"), createVNode("span", { class: "font-semibold text-slate-900" }, toDisplayString(unref(moneda)(unref(recibo).valorTotal)), 1)]),
							Number(unref(recibo).excedente) > 0 ? (openBlock(), createBlock("p", {
								key: 0,
								class: "text-xs text-amber-600 mt-1"
							}, toDisplayString(unref(recibo).excedenteComoSaldoFavor ? "Excedente aplicado a saldo a favor" : "Cambio entregado") + ": " + toDisplayString(unref(moneda)(unref(recibo).excedente)), 1)) : createCommentVNode("", true)
						];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_component_UCard, null, {
					header: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>Aplicación del dinero</p>`);
						else return [createVNode("p", { class: "font-semibold text-slate-900" }, "Aplicación del dinero")];
					}),
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							if (!unref(recibo).aplicaciones?.length) _push(`<p class="text-sm text-slate-400"${_scopeId}>Sin desglose disponible para este recibo.</p>`);
							else {
								_push(`<table class="w-full text-sm"${_scopeId}><thead${_scopeId}><tr class="text-left text-slate-500 border-b"${_scopeId}><th class="py-1.5 pr-2"${_scopeId}>Concepto</th><th class="py-1.5 pr-2"${_scopeId}>Período</th><th class="py-1.5 pr-2"${_scopeId}>Tipo</th><th class="py-1.5 pr-2 text-right"${_scopeId}>Valor aplicado</th><th class="py-1.5 text-right"${_scopeId}>Saldo posterior</th></tr></thead><tbody${_scopeId}><!--[-->`);
								ssrRenderList(unref(recibo).aplicaciones, (a) => {
									_push(`<tr class="border-b last:border-0"${_scopeId}><td class="py-1.5 pr-2 text-slate-900"${_scopeId}>${ssrInterpolate(a.obligacion?.concepto)}</td><td class="py-1.5 pr-2 text-slate-600"${_scopeId}>${ssrInterpolate(a.obligacion?.periodo ? unref(fecha)(a.obligacion.periodo) : "—")}</td><td class="py-1.5 pr-2"${_scopeId}>`);
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
									_push(`</td><td class="py-1.5 pr-2 text-right text-slate-900"${_scopeId}>${ssrInterpolate(unref(moneda)(a.montoAplicado))}</td><td class="py-1.5 text-right text-slate-600"${_scopeId}>${ssrInterpolate(a.saldoPosterior != null ? unref(moneda)(a.saldoPosterior) : "—")}</td></tr>`);
								});
								_push(`<!--]--></tbody></table>`);
							}
						} else return [!unref(recibo).aplicaciones?.length ? (openBlock(), createBlock("p", {
							key: 0,
							class: "text-sm text-slate-400"
						}, "Sin desglose disponible para este recibo.")) : (openBlock(), createBlock("table", {
							key: 1,
							class: "w-full text-sm"
						}, [createVNode("thead", null, [createVNode("tr", { class: "text-left text-slate-500 border-b" }, [
							createVNode("th", { class: "py-1.5 pr-2" }, "Concepto"),
							createVNode("th", { class: "py-1.5 pr-2" }, "Período"),
							createVNode("th", { class: "py-1.5 pr-2" }, "Tipo"),
							createVNode("th", { class: "py-1.5 pr-2 text-right" }, "Valor aplicado"),
							createVNode("th", { class: "py-1.5 text-right" }, "Saldo posterior")
						])]), createVNode("tbody", null, [(openBlock(true), createBlock(Fragment, null, renderList(unref(recibo).aplicaciones, (a) => {
							return openBlock(), createBlock("tr", {
								key: a.id,
								class: "border-b last:border-0"
							}, [
								createVNode("td", { class: "py-1.5 pr-2 text-slate-900" }, toDisplayString(a.obligacion?.concepto), 1),
								createVNode("td", { class: "py-1.5 pr-2 text-slate-600" }, toDisplayString(a.obligacion?.periodo ? unref(fecha)(a.obligacion.periodo) : "—"), 1),
								createVNode("td", { class: "py-1.5 pr-2" }, [createVNode(_component_UBadge, {
									color: a.concepto === "MORA" ? "red" : "gray",
									variant: "subtle",
									size: "xs"
								}, {
									default: withCtx(() => [createTextVNode(toDisplayString(etiquetaConcepto(a)), 1)]),
									_: 2
								}, 1032, ["color"])]),
								createVNode("td", { class: "py-1.5 pr-2 text-right text-slate-900" }, toDisplayString(unref(moneda)(a.montoAplicado)), 1),
								createVNode("td", { class: "py-1.5 text-right text-slate-600" }, toDisplayString(a.saldoPosterior != null ? unref(moneda)(a.saldoPosterior) : "—"), 1)
							]);
						}), 128))])]))];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(ssrRenderComponent(_component_UModal, {
				modelValue: unref(modalAnular),
				"onUpdate:modelValue": ($event) => isRef(modalAnular) ? modalAnular.value = $event : null
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UCard, null, {
						header: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>Anular recibo</p>`);
							else return [createVNode("p", { class: "font-semibold text-slate-900" }, "Anular recibo")];
						}),
						footer: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex justify-end gap-2"${_scopeId}>`);
								_push(ssrRenderComponent(_component_UButton, {
									color: "gray",
									variant: "ghost",
									onClick: ($event) => modalAnular.value = false
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`Cancelar`);
										else return [createTextVNode("Cancelar")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UButton, {
									color: "red",
									loading: unref(anulando),
									disabled: !unref(motivoAnulacion),
									onClick: confirmarAnular
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(` Anular recibo `);
										else return [createTextVNode(" Anular recibo ")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
								color: "gray",
								variant: "ghost",
								onClick: ($event) => modalAnular.value = false
							}, {
								default: withCtx(() => [createTextVNode("Cancelar")]),
								_: 1
							}, 8, ["onClick"]), createVNode(_component_UButton, {
								color: "red",
								loading: unref(anulando),
								disabled: !unref(motivoAnulacion),
								onClick: confirmarAnular
							}, {
								default: withCtx(() => [createTextVNode(" Anular recibo ")]),
								_: 1
							}, 8, ["loading", "disabled"])])];
						}),
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="space-y-3"${_scopeId}>`);
								_push(ssrRenderComponent(_component_UAlert, {
									color: "red",
									variant: "subtle",
									title: "Esta acción no se puede deshacer.",
									description: "El recibo NUNCA se elimina: queda marcado ANULADO, con el motivo, y se revierte exactamente lo que aplicó (capital, mora, saldo a favor y movimientos de caja)."
								}, null, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Motivo de la anulación" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UTextarea, {
											modelValue: unref(motivoAnulacion),
											"onUpdate:modelValue": ($event) => isRef(motivoAnulacion) ? motivoAnulacion.value = $event : null
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UTextarea, {
											modelValue: unref(motivoAnulacion),
											"onUpdate:modelValue": ($event) => isRef(motivoAnulacion) ? motivoAnulacion.value = $event : null
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "space-y-3" }, [createVNode(_component_UAlert, {
								color: "red",
								variant: "subtle",
								title: "Esta acción no se puede deshacer.",
								description: "El recibo NUNCA se elimina: queda marcado ANULADO, con el motivo, y se revierte exactamente lo que aplicó (capital, mora, saldo a favor y movimientos de caja)."
							}), createVNode(_component_UFormGroup, { label: "Motivo de la anulación" }, {
								default: withCtx(() => [createVNode(_component_UTextarea, {
									modelValue: unref(motivoAnulacion),
									"onUpdate:modelValue": ($event) => isRef(motivoAnulacion) ? motivoAnulacion.value = $event : null
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							})])];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(_component_UCard, null, {
						header: withCtx(() => [createVNode("p", { class: "font-semibold text-slate-900" }, "Anular recibo")]),
						footer: withCtx(() => [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
							color: "gray",
							variant: "ghost",
							onClick: ($event) => modalAnular.value = false
						}, {
							default: withCtx(() => [createTextVNode("Cancelar")]),
							_: 1
						}, 8, ["onClick"]), createVNode(_component_UButton, {
							color: "red",
							loading: unref(anulando),
							disabled: !unref(motivoAnulacion),
							onClick: confirmarAnular
						}, {
							default: withCtx(() => [createTextVNode(" Anular recibo ")]),
							_: 1
						}, 8, ["loading", "disabled"])])]),
						default: withCtx(() => [createVNode("div", { class: "space-y-3" }, [createVNode(_component_UAlert, {
							color: "red",
							variant: "subtle",
							title: "Esta acción no se puede deshacer.",
							description: "El recibo NUNCA se elimina: queda marcado ANULADO, con el motivo, y se revierte exactamente lo que aplicó (capital, mora, saldo a favor y movimientos de caja)."
						}), createVNode(_component_UFormGroup, { label: "Motivo de la anulación" }, {
							default: withCtx(() => [createVNode(_component_UTextarea, {
								modelValue: unref(motivoAnulacion),
								"onUpdate:modelValue": ($event) => isRef(motivoAnulacion) ? motivoAnulacion.value = $event : null
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
//#region pages/recibos/[id].vue
var _sfc_setup = _id__vue_vue_type_script_setup_true_lang_default.setup;
_id__vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/recibos/[id].vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _id__default = _id__vue_vue_type_script_setup_true_lang_default;

export { _id__default as default };
//# sourceMappingURL=_id_-DAOTb_wp.mjs.map
