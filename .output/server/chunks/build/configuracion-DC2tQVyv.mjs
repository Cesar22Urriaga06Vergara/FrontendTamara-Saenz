import { b as useRuntimeConfig } from '../virtual/entry.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { t as Alert_default } from './Alert-Bv_RgsgM.mjs';
import { t as FormGroup_default } from './FormGroup-Y-Nkh3aN.mjs';
import { t as Card_default } from './Card-j-DCNf6K.mjs';
import { t as Divider_default } from './Divider-DitdhbQt.mjs';
import { t as Button_default } from './Button-CoYovqJ9.mjs';
import { t as Input_default } from './Input-BVUEIOT9.mjs';
import { C as ConfirmModal_default } from './ConfirmModal-BTALKO4O.mjs';
import { u as useApiFetch } from './useApiFetch-B8kTc45P.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
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
import './Avatar-BOI4zec4.mjs';
import './link-apSRv82-.mjs';
import './useButtonGroup-OQHG41CY.mjs';
import './button-BNOdwSP_.mjs';
import './Link-CnaKOPmE.mjs';
import './useFormGroup-BLFts8mq.mjs';
import './Modal-B8wn1zi5.mjs';
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

//#region pages/configuracion/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* Configuración global de la empresa — EXCLUSIVO Administrador.
		* Separa lo que antes vivía embebido en /administracion: datos corporativos,
		* parámetros de mora y logo (subida de archivo real vía POST /empresa/logo).
		*/
		const config = useRuntimeConfig();
		const origenApi = computed(() => new URL(config.public.apiBaseUrl).origin);
		const empresa = ref(null);
		const cargandoEmpresa = ref(true);
		const guardandoEmpresa = ref(false);
		const errorEmpresa = ref("");
		async function guardarEmpresa() {
			errorEmpresa.value = "";
			guardandoEmpresa.value = true;
			try {
				empresa.value = await useApiFetch("/empresa", {
					method: "PATCH",
					body: {
						nombre: empresa.value.nombre,
						nit: empresa.value.nit,
						slogan: empresa.value.slogan,
						direccion: empresa.value.direccion,
						telefono: empresa.value.telefono,
						diasGraciaMora: empresa.value.diasGraciaMora,
						porcentajeMoraMensual: empresa.value.porcentajeMoraMensual,
						horizonteMesesCanon: empresa.value.horizonteMesesCanon
					}
				});
			} catch (e) {
				errorEmpresa.value = e?.data?.message || "No fue posible guardar los cambios.";
			} finally {
				guardandoEmpresa.value = false;
			}
		}
		const generandoCanon = ref(false);
		const resultadoCanon = ref(null);
		const modalConfirmarCanon = ref(false);
		async function generarCanones() {
			errorEmpresa.value = "";
			resultadoCanon.value = null;
			generandoCanon.value = true;
			try {
				resultadoCanon.value = await useApiFetch("/obligaciones/generar-canones", { method: "POST" });
				modalConfirmarCanon.value = false;
			} catch (e) {
				errorEmpresa.value = e?.data?.message || "No fue posible generar los cánones.";
			} finally {
				generandoCanon.value = false;
			}
		}
		const inputLogoRef = ref(null);
		const archivoLogo = ref(null);
		const previewLogoLocal = ref(null);
		const subiendoLogo = ref(false);
		const logoPreviewSrc = computed(() => {
			if (previewLogoLocal.value) return previewLogoLocal.value;
			if (empresa.value?.logoUrl) return `${origenApi.value}${empresa.value.logoUrl}`;
			return null;
		});
		function abrirSelectorLogo() {
			inputLogoRef.value?.click();
		}
		function seleccionarLogo(evento) {
			const archivo = evento.target.files?.[0];
			if (!archivo) return;
			if (previewLogoLocal.value) URL.revokeObjectURL(previewLogoLocal.value);
			archivoLogo.value = archivo;
			previewLogoLocal.value = URL.createObjectURL(archivo);
		}
		function cancelarLogo() {
			if (previewLogoLocal.value) URL.revokeObjectURL(previewLogoLocal.value);
			archivoLogo.value = null;
			previewLogoLocal.value = null;
			if (inputLogoRef.value) inputLogoRef.value.value = "";
		}
		async function subirLogo() {
			if (!archivoLogo.value) return;
			errorEmpresa.value = "";
			subiendoLogo.value = true;
			try {
				const formData = new FormData();
				formData.append("archivo", archivoLogo.value);
				empresa.value = await useApiFetch("/empresa/logo", {
					method: "POST",
					body: formData
				});
				cancelarLogo();
			} catch (e) {
				errorEmpresa.value = e?.data?.message || "No fue posible subir el logo.";
			} finally {
				subiendoLogo.value = false;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UAlert = Alert_default;
			const _component_UCard = Card_default;
			const _component_UFormGroup = FormGroup_default;
			const _component_UInput = Input_default;
			const _component_UDivider = Divider_default;
			const _component_UButton = Button_default;
			const _component_UIcon = Icon_default;
			const _component_UiConfirmModal = ConfirmModal_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div><h1 class="text-xl font-semibold text-slate-900">Configuración</h1><p class="text-sm text-slate-500">Datos corporativos, parámetros de mora y logo de la empresa.</p></div>`);
			if (unref(errorEmpresa)) _push(ssrRenderComponent(_component_UAlert, {
				color: "red",
				variant: "subtle",
				title: unref(errorEmpresa)
			}, null, _parent));
			else _push(`<!---->`);
			if (unref(cargandoEmpresa)) _push(`<div class="text-slate-400 text-sm">Cargando…</div>`);
			else if (unref(empresa)) {
				_push(`<!--[-->`);
				_push(ssrRenderComponent(_component_UCard, null, {
					header: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>Datos de la empresa</p>`);
						else return [createVNode("p", { class: "font-semibold text-slate-900" }, "Datos de la empresa")];
					}),
					footer: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<div class="flex justify-end"${_scopeId}>`);
							_push(ssrRenderComponent(_component_UButton, {
								color: "amber",
								loading: unref(guardandoEmpresa),
								onClick: guardarEmpresa
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`Guardar cambios`);
									else return [createTextVNode("Guardar cambios")];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</div>`);
						} else return [createVNode("div", { class: "flex justify-end" }, [createVNode(_component_UButton, {
							color: "amber",
							loading: unref(guardandoEmpresa),
							onClick: guardarEmpresa
						}, {
							default: withCtx(() => [createTextVNode("Guardar cambios")]),
							_: 1
						}, 8, ["loading"])])];
					}),
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}>`);
							_push(ssrRenderComponent(_component_UFormGroup, { label: "Nombre" }, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(ssrRenderComponent(_component_UInput, {
										modelValue: unref(empresa).nombre,
										"onUpdate:modelValue": ($event) => unref(empresa).nombre = $event
									}, null, _parent, _scopeId));
									else return [createVNode(_component_UInput, {
										modelValue: unref(empresa).nombre,
										"onUpdate:modelValue": ($event) => unref(empresa).nombre = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(ssrRenderComponent(_component_UFormGroup, { label: "NIT" }, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(ssrRenderComponent(_component_UInput, {
										modelValue: unref(empresa).nit,
										"onUpdate:modelValue": ($event) => unref(empresa).nit = $event
									}, null, _parent, _scopeId));
									else return [createVNode(_component_UInput, {
										modelValue: unref(empresa).nit,
										"onUpdate:modelValue": ($event) => unref(empresa).nit = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(ssrRenderComponent(_component_UFormGroup, {
								label: "Slogan",
								class: "sm:col-span-2"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(ssrRenderComponent(_component_UInput, {
										modelValue: unref(empresa).slogan,
										"onUpdate:modelValue": ($event) => unref(empresa).slogan = $event
									}, null, _parent, _scopeId));
									else return [createVNode(_component_UInput, {
										modelValue: unref(empresa).slogan,
										"onUpdate:modelValue": ($event) => unref(empresa).slogan = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(ssrRenderComponent(_component_UFormGroup, { label: "Dirección" }, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(ssrRenderComponent(_component_UInput, {
										modelValue: unref(empresa).direccion,
										"onUpdate:modelValue": ($event) => unref(empresa).direccion = $event
									}, null, _parent, _scopeId));
									else return [createVNode(_component_UInput, {
										modelValue: unref(empresa).direccion,
										"onUpdate:modelValue": ($event) => unref(empresa).direccion = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(ssrRenderComponent(_component_UFormGroup, { label: "Teléfono" }, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(ssrRenderComponent(_component_UInput, {
										modelValue: unref(empresa).telefono,
										"onUpdate:modelValue": ($event) => unref(empresa).telefono = $event
									}, null, _parent, _scopeId));
									else return [createVNode(_component_UInput, {
										modelValue: unref(empresa).telefono,
										"onUpdate:modelValue": ($event) => unref(empresa).telefono = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</div>`);
							_push(ssrRenderComponent(_component_UDivider, {
								class: "my-6",
								label: "Parámetros de mora"
							}, null, _parent, _scopeId));
							_push(`<div class="grid grid-cols-1 sm:grid-cols-3 gap-4"${_scopeId}>`);
							_push(ssrRenderComponent(_component_UFormGroup, { label: "Días de gracia para mora" }, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(ssrRenderComponent(_component_UInput, {
										modelValue: unref(empresa).diasGraciaMora,
										"onUpdate:modelValue": ($event) => unref(empresa).diasGraciaMora = $event,
										modelModifiers: { number: true },
										type: "number"
									}, null, _parent, _scopeId));
									else return [createVNode(_component_UInput, {
										modelValue: unref(empresa).diasGraciaMora,
										"onUpdate:modelValue": ($event) => unref(empresa).diasGraciaMora = $event,
										modelModifiers: { number: true },
										type: "number"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(ssrRenderComponent(_component_UFormGroup, { label: "% Mora mensual" }, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(ssrRenderComponent(_component_UInput, {
										modelValue: unref(empresa).porcentajeMoraMensual,
										"onUpdate:modelValue": ($event) => unref(empresa).porcentajeMoraMensual = $event,
										modelModifiers: { number: true },
										type: "number",
										step: "0.1"
									}, null, _parent, _scopeId));
									else return [createVNode(_component_UInput, {
										modelValue: unref(empresa).porcentajeMoraMensual,
										"onUpdate:modelValue": ($event) => unref(empresa).porcentajeMoraMensual = $event,
										modelModifiers: { number: true },
										type: "number",
										step: "0.1"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(ssrRenderComponent(_component_UFormGroup, { label: "Horizonte de cánones (meses)" }, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(ssrRenderComponent(_component_UInput, {
										modelValue: unref(empresa).horizonteMesesCanon,
										"onUpdate:modelValue": ($event) => unref(empresa).horizonteMesesCanon = $event,
										modelModifiers: { number: true },
										type: "number"
									}, null, _parent, _scopeId));
									else return [createVNode(_component_UInput, {
										modelValue: unref(empresa).horizonteMesesCanon,
										"onUpdate:modelValue": ($event) => unref(empresa).horizonteMesesCanon = $event,
										modelModifiers: { number: true },
										type: "number"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</div>`);
						} else return [
							createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
								createVNode(_component_UFormGroup, { label: "Nombre" }, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(empresa).nombre,
										"onUpdate:modelValue": ($event) => unref(empresa).nombre = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode(_component_UFormGroup, { label: "NIT" }, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(empresa).nit,
										"onUpdate:modelValue": ($event) => unref(empresa).nit = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode(_component_UFormGroup, {
									label: "Slogan",
									class: "sm:col-span-2"
								}, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(empresa).slogan,
										"onUpdate:modelValue": ($event) => unref(empresa).slogan = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode(_component_UFormGroup, { label: "Dirección" }, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(empresa).direccion,
										"onUpdate:modelValue": ($event) => unref(empresa).direccion = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode(_component_UFormGroup, { label: "Teléfono" }, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(empresa).telefono,
										"onUpdate:modelValue": ($event) => unref(empresa).telefono = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								})
							]),
							createVNode(_component_UDivider, {
								class: "my-6",
								label: "Parámetros de mora"
							}),
							createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-3 gap-4" }, [
								createVNode(_component_UFormGroup, { label: "Días de gracia para mora" }, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(empresa).diasGraciaMora,
										"onUpdate:modelValue": ($event) => unref(empresa).diasGraciaMora = $event,
										modelModifiers: { number: true },
										type: "number"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode(_component_UFormGroup, { label: "% Mora mensual" }, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(empresa).porcentajeMoraMensual,
										"onUpdate:modelValue": ($event) => unref(empresa).porcentajeMoraMensual = $event,
										modelModifiers: { number: true },
										type: "number",
										step: "0.1"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode(_component_UFormGroup, { label: "Horizonte de cánones (meses)" }, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(empresa).horizonteMesesCanon,
										"onUpdate:modelValue": ($event) => unref(empresa).horizonteMesesCanon = $event,
										modelModifiers: { number: true },
										type: "number"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								})
							])
						];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_component_UCard, null, {
					header: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>Generación de canon</p>`);
						else return [createVNode("p", { class: "font-semibold text-slate-900" }, "Generación de canon")];
					}),
					footer: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<div class="flex justify-end"${_scopeId}>`);
							_push(ssrRenderComponent(_component_UButton, {
								color: "amber",
								variant: "soft",
								loading: unref(generandoCanon),
								onClick: ($event) => modalConfirmarCanon.value = true
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(` Generar cánones pendientes `);
									else return [createTextVNode(" Generar cánones pendientes ")];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</div>`);
						} else return [createVNode("div", { class: "flex justify-end" }, [createVNode(_component_UButton, {
							color: "amber",
							variant: "soft",
							loading: unref(generandoCanon),
							onClick: ($event) => modalConfirmarCanon.value = true
						}, {
							default: withCtx(() => [createTextVNode(" Generar cánones pendientes ")]),
							_: 1
						}, 8, ["loading", "onClick"])])];
					}),
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<p class="text-sm text-slate-500"${_scopeId}> El canon mensual se genera automáticamente cada día (CRON), respetando el horizonte de ${ssrInterpolate(unref(empresa).horizonteMesesCanon)} ${ssrInterpolate(unref(empresa).horizonteMesesCanon === 1 ? "mes" : "meses")} configurado arriba. Este botón dispara la misma generación manualmente, por si se necesita adelantar el proceso sin esperar al CRON. </p>`);
							if (unref(resultadoCanon)) _push(ssrRenderComponent(_component_UAlert, {
								class: "mt-3",
								color: "emerald",
								variant: "subtle",
								title: `${unref(resultadoCanon).generadas} obligación(es) de canon generada(s).`
							}, null, _parent, _scopeId));
							else _push(`<!---->`);
						} else return [createVNode("p", { class: "text-sm text-slate-500" }, " El canon mensual se genera automáticamente cada día (CRON), respetando el horizonte de " + toDisplayString(unref(empresa).horizonteMesesCanon) + " " + toDisplayString(unref(empresa).horizonteMesesCanon === 1 ? "mes" : "meses") + " configurado arriba. Este botón dispara la misma generación manualmente, por si se necesita adelantar el proceso sin esperar al CRON. ", 1), unref(resultadoCanon) ? (openBlock(), createBlock(_component_UAlert, {
							key: 0,
							class: "mt-3",
							color: "emerald",
							variant: "subtle",
							title: `${unref(resultadoCanon).generadas} obligación(es) de canon generada(s).`
						}, null, 8, ["title"])) : createCommentVNode("", true)];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_component_UCard, null, {
					header: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>Logo</p>`);
						else return [createVNode("p", { class: "font-semibold text-slate-900" }, "Logo")];
					}),
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<div class="flex items-center gap-6"${_scopeId}><div class="w-24 h-24 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0"${_scopeId}>`);
							if (unref(logoPreviewSrc)) _push(`<img${ssrRenderAttr("src", unref(logoPreviewSrc))} alt="Logo de la empresa" class="w-full h-full object-contain"${_scopeId}>`);
							else _push(ssrRenderComponent(_component_UIcon, {
								name: "i-heroicons-building-office-2",
								class: "w-8 h-8 text-slate-300"
							}, null, _parent, _scopeId));
							_push(`</div><div class="space-y-2"${_scopeId}><input type="file" accept="image/png,image/jpeg,image/svg+xml" class="hidden"${_scopeId}><div class="flex gap-2"${_scopeId}>`);
							_push(ssrRenderComponent(_component_UButton, {
								color: "gray",
								variant: "soft",
								size: "sm",
								onClick: abrirSelectorLogo
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`${ssrInterpolate(unref(archivoLogo) ? "Cambiar selección" : "Seleccionar imagen")}`);
									else return [createTextVNode(toDisplayString(unref(archivoLogo) ? "Cambiar selección" : "Seleccionar imagen"), 1)];
								}),
								_: 1
							}, _parent, _scopeId));
							if (unref(archivoLogo)) _push(ssrRenderComponent(_component_UButton, {
								color: "amber",
								size: "sm",
								loading: unref(subiendoLogo),
								onClick: subirLogo
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(` Subir logo `);
									else return [createTextVNode(" Subir logo ")];
								}),
								_: 1
							}, _parent, _scopeId));
							else _push(`<!---->`);
							if (unref(archivoLogo)) _push(ssrRenderComponent(_component_UButton, {
								color: "gray",
								variant: "ghost",
								size: "sm",
								disabled: unref(subiendoLogo),
								onClick: cancelarLogo
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(` Cancelar `);
									else return [createTextVNode(" Cancelar ")];
								}),
								_: 1
							}, _parent, _scopeId));
							else _push(`<!---->`);
							_push(`</div><p class="text-xs text-slate-400"${_scopeId}>PNG, JPG o SVG. Máximo 2 MB.</p>`);
							if (unref(archivoLogo)) _push(`<p class="text-xs text-slate-500"${_scopeId}>${ssrInterpolate(unref(archivoLogo).name)}</p>`);
							else _push(`<!---->`);
							_push(`</div></div>`);
						} else return [createVNode("div", { class: "flex items-center gap-6" }, [createVNode("div", { class: "w-24 h-24 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0" }, [unref(logoPreviewSrc) ? (openBlock(), createBlock("img", {
							key: 0,
							src: unref(logoPreviewSrc),
							alt: "Logo de la empresa",
							class: "w-full h-full object-contain"
						}, null, 8, ["src"])) : (openBlock(), createBlock(_component_UIcon, {
							key: 1,
							name: "i-heroicons-building-office-2",
							class: "w-8 h-8 text-slate-300"
						}))]), createVNode("div", { class: "space-y-2" }, [
							createVNode("input", {
								ref_key: "inputLogoRef",
								ref: inputLogoRef,
								type: "file",
								accept: "image/png,image/jpeg,image/svg+xml",
								class: "hidden",
								onChange: seleccionarLogo
							}, null, 544),
							createVNode("div", { class: "flex gap-2" }, [
								createVNode(_component_UButton, {
									color: "gray",
									variant: "soft",
									size: "sm",
									onClick: abrirSelectorLogo
								}, {
									default: withCtx(() => [createTextVNode(toDisplayString(unref(archivoLogo) ? "Cambiar selección" : "Seleccionar imagen"), 1)]),
									_: 1
								}),
								unref(archivoLogo) ? (openBlock(), createBlock(_component_UButton, {
									key: 0,
									color: "amber",
									size: "sm",
									loading: unref(subiendoLogo),
									onClick: subirLogo
								}, {
									default: withCtx(() => [createTextVNode(" Subir logo ")]),
									_: 1
								}, 8, ["loading"])) : createCommentVNode("", true),
								unref(archivoLogo) ? (openBlock(), createBlock(_component_UButton, {
									key: 1,
									color: "gray",
									variant: "ghost",
									size: "sm",
									disabled: unref(subiendoLogo),
									onClick: cancelarLogo
								}, {
									default: withCtx(() => [createTextVNode(" Cancelar ")]),
									_: 1
								}, 8, ["disabled"])) : createCommentVNode("", true)
							]),
							createVNode("p", { class: "text-xs text-slate-400" }, "PNG, JPG o SVG. Máximo 2 MB."),
							unref(archivoLogo) ? (openBlock(), createBlock("p", {
								key: 0,
								class: "text-xs text-slate-500"
							}, toDisplayString(unref(archivoLogo).name), 1)) : createCommentVNode("", true)
						])])];
					}),
					_: 1
				}, _parent));
				_push(`<!--]-->`);
			} else _push(`<!---->`);
			_push(ssrRenderComponent(_component_UiConfirmModal, {
				modelValue: unref(modalConfirmarCanon),
				"onUpdate:modelValue": ($event) => isRef(modalConfirmarCanon) ? modalConfirmarCanon.value = $event : null,
				title: "Generar cánones pendientes",
				message: "Se generará una obligación de canon para cada contrato activo dentro del horizonte configurado, para todos los meses que aún no tengan canon generado. Esta acción crea deuda cobrable de forma masiva. ¿Confirmas?",
				"confirm-label": "Generar cánones",
				color: "amber",
				loading: unref(generandoCanon),
				onConfirm: generarCanones
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region pages/configuracion/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/configuracion/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var configuracion_default = index_vue_vue_type_script_setup_true_lang_default;

export { configuracion_default as default };
//# sourceMappingURL=configuracion-DC2tQVyv.mjs.map
