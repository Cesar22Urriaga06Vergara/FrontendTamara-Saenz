import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { t as Table_default } from './Table-BjAsSJoi.mjs';
import { t as Badge_default } from './Badge-Dji78drx.mjs';
import { t as Alert_default } from './Alert-Bv_RgsgM.mjs';
import { t as FormGroup_default } from './FormGroup-Y-Nkh3aN.mjs';
import { t as Card_default } from './Card-j-DCNf6K.mjs';
import { t as Pagination_default } from './Pagination-CVW3oGYj.mjs';
import { t as Button_default } from './Button-CoYovqJ9.mjs';
import { t as Input_default } from './Input-BVUEIOT9.mjs';
import { u as useApiFetch } from './useApiFetch-B8kTc45P.mjs';
import { u as useFormatoCO } from './useFormatoCO-CX_CcnnC.mjs';
import { defineComponent, ref, reactive, watch, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, createCommentVNode, toDisplayString, isRef, useSSRContext } from 'vue';
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

//#region pages/auditoria/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		/** Consulta de trazabilidad — EXCLUSIVO Administrador. */
		const { fecha } = useFormatoCO();
		const registros = ref([]);
		const total = ref(0);
		const page = ref(1);
		const limit = ref(20);
		const cargando = ref(true);
		const error = ref("");
		const filtros = reactive({
			modulo: "",
			usuarioEmail: "",
			desde: "",
			hasta: ""
		});
		const columnas = [
			{
				key: "creadoEn",
				label: "Fecha"
			},
			{
				key: "modulo",
				label: "Módulo"
			},
			{
				key: "accion",
				label: "Acción"
			},
			{
				key: "usuarioEmail",
				label: "Usuario"
			},
			{
				key: "ruta",
				label: "Ruta"
			}
		];
		async function cargar() {
			cargando.value = true;
			try {
				const data = await useApiFetch("/auditoria", { params: {
					...filtros,
					page: page.value,
					limit: limit.value
				} });
				registros.value = data.data;
				total.value = data.total;
			} catch (e) {
				error.value = e?.data?.message || "No fue posible cargar los registros de auditoría.";
			} finally {
				cargando.value = false;
			}
		}
		watch(() => [
			filtros.modulo,
			filtros.usuarioEmail,
			filtros.desde,
			filtros.hasta
		], () => {
			page.value = 1;
			cargar();
		});
		watch(page, cargar);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UAlert = Alert_default;
			const _component_UCard = Card_default;
			const _component_UInput = Input_default;
			const _component_UFormGroup = FormGroup_default;
			const _component_UButton = Button_default;
			const _component_UTable = Table_default;
			const _component_UBadge = Badge_default;
			const _component_UIcon = Icon_default;
			const _component_UPagination = Pagination_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-xl font-semibold text-slate-900 mb-4">Auditoría</h1>`);
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
						_push(`<div class="flex flex-wrap gap-3 items-end"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UInput, {
							modelValue: unref(filtros).modulo,
							"onUpdate:modelValue": ($event) => unref(filtros).modulo = $event,
							placeholder: "Filtrar por módulo (ej: RECAUDO)…",
							class: "w-56"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_UInput, {
							modelValue: unref(filtros).usuarioEmail,
							"onUpdate:modelValue": ($event) => unref(filtros).usuarioEmail = $event,
							placeholder: "Filtrar por correo de usuario…",
							class: "w-56"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_UFormGroup, {
							label: "Desde",
							class: "!mb-0"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_component_UInput, {
									modelValue: unref(filtros).desde,
									"onUpdate:modelValue": ($event) => unref(filtros).desde = $event,
									type: "date",
									class: "w-40"
								}, null, _parent, _scopeId));
								else return [createVNode(_component_UInput, {
									modelValue: unref(filtros).desde,
									"onUpdate:modelValue": ($event) => unref(filtros).desde = $event,
									type: "date",
									class: "w-40"
								}, null, 8, ["modelValue", "onUpdate:modelValue"])];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(_component_UFormGroup, {
							label: "Hasta",
							class: "!mb-0"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_component_UInput, {
									modelValue: unref(filtros).hasta,
									"onUpdate:modelValue": ($event) => unref(filtros).hasta = $event,
									type: "date",
									class: "w-40"
								}, null, _parent, _scopeId));
								else return [createVNode(_component_UInput, {
									modelValue: unref(filtros).hasta,
									"onUpdate:modelValue": ($event) => unref(filtros).hasta = $event,
									type: "date",
									class: "w-40"
								}, null, 8, ["modelValue", "onUpdate:modelValue"])];
							}),
							_: 1
						}, _parent, _scopeId));
						if (unref(filtros).modulo || unref(filtros).usuarioEmail || unref(filtros).desde || unref(filtros).hasta) _push(ssrRenderComponent(_component_UButton, {
							color: "gray",
							variant: "ghost",
							size: "sm",
							icon: "i-heroicons-x-mark",
							onClick: ($event) => Object.assign(unref(filtros), {
								modulo: "",
								usuarioEmail: "",
								desde: "",
								hasta: ""
							})
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Limpiar filtros `);
								else return [createTextVNode(" Limpiar filtros ")];
							}),
							_: 1
						}, _parent, _scopeId));
						else _push(`<!---->`);
						_push(`</div>`);
					} else return [createVNode("div", { class: "flex flex-wrap gap-3 items-end" }, [
						createVNode(_component_UInput, {
							modelValue: unref(filtros).modulo,
							"onUpdate:modelValue": ($event) => unref(filtros).modulo = $event,
							placeholder: "Filtrar por módulo (ej: RECAUDO)…",
							class: "w-56"
						}, null, 8, ["modelValue", "onUpdate:modelValue"]),
						createVNode(_component_UInput, {
							modelValue: unref(filtros).usuarioEmail,
							"onUpdate:modelValue": ($event) => unref(filtros).usuarioEmail = $event,
							placeholder: "Filtrar por correo de usuario…",
							class: "w-56"
						}, null, 8, ["modelValue", "onUpdate:modelValue"]),
						createVNode(_component_UFormGroup, {
							label: "Desde",
							class: "!mb-0"
						}, {
							default: withCtx(() => [createVNode(_component_UInput, {
								modelValue: unref(filtros).desde,
								"onUpdate:modelValue": ($event) => unref(filtros).desde = $event,
								type: "date",
								class: "w-40"
							}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
							_: 1
						}),
						createVNode(_component_UFormGroup, {
							label: "Hasta",
							class: "!mb-0"
						}, {
							default: withCtx(() => [createVNode(_component_UInput, {
								modelValue: unref(filtros).hasta,
								"onUpdate:modelValue": ($event) => unref(filtros).hasta = $event,
								type: "date",
								class: "w-40"
							}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
							_: 1
						}),
						unref(filtros).modulo || unref(filtros).usuarioEmail || unref(filtros).desde || unref(filtros).hasta ? (openBlock(), createBlock(_component_UButton, {
							key: 0,
							color: "gray",
							variant: "ghost",
							size: "sm",
							icon: "i-heroicons-x-mark",
							onClick: ($event) => Object.assign(unref(filtros), {
								modulo: "",
								usuarioEmail: "",
								desde: "",
								hasta: ""
							})
						}, {
							default: withCtx(() => [createTextVNode(" Limpiar filtros ")]),
							_: 1
						}, 8, ["onClick"])) : createCommentVNode("", true)
					])];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UCard, null, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_UTable, {
							rows: unref(registros),
							columns: columnas,
							loading: unref(cargando)
						}, {
							"creadoEn-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(unref(fecha)(row.creadoEn))}`);
								else return [createTextVNode(toDisplayString(unref(fecha)(row.creadoEn)), 1)];
							}),
							"modulo-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_component_UBadge, {
									color: "gray",
									variant: "subtle"
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`${ssrInterpolate(row.modulo)}`);
										else return [createTextVNode(toDisplayString(row.modulo), 1)];
									}),
									_: 2
								}, _parent, _scopeId));
								else return [createVNode(_component_UBadge, {
									color: "gray",
									variant: "subtle"
								}, {
									default: withCtx(() => [createTextVNode(toDisplayString(row.modulo), 1)]),
									_: 2
								}, 1024)];
							}),
							"empty-state": withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="text-center py-10 text-slate-400"${_scopeId}>`);
									_push(ssrRenderComponent(_component_UIcon, {
										name: "i-heroicons-shield-check",
										class: "w-10 h-10 mx-auto mb-2"
									}, null, _parent, _scopeId));
									_push(`<p${_scopeId}>No hay registros de auditoría con estos filtros.</p></div>`);
								} else return [createVNode("div", { class: "text-center py-10 text-slate-400" }, [createVNode(_component_UIcon, {
									name: "i-heroicons-shield-check",
									class: "w-10 h-10 mx-auto mb-2"
								}), createVNode("p", null, "No hay registros de auditoría con estos filtros.")])];
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
						rows: unref(registros),
						columns: columnas,
						loading: unref(cargando)
					}, {
						"creadoEn-data": withCtx(({ row }) => [createTextVNode(toDisplayString(unref(fecha)(row.creadoEn)), 1)]),
						"modulo-data": withCtx(({ row }) => [createVNode(_component_UBadge, {
							color: "gray",
							variant: "subtle"
						}, {
							default: withCtx(() => [createTextVNode(toDisplayString(row.modulo), 1)]),
							_: 2
						}, 1024)]),
						"empty-state": withCtx(() => [createVNode("div", { class: "text-center py-10 text-slate-400" }, [createVNode(_component_UIcon, {
							name: "i-heroicons-shield-check",
							class: "w-10 h-10 mx-auto mb-2"
						}), createVNode("p", null, "No hay registros de auditoría con estos filtros.")])]),
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
//#region pages/auditoria/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auditoria/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var auditoria_default = index_vue_vue_type_script_setup_true_lang_default;

export { auditoria_default as default };
//# sourceMappingURL=auditoria-Dn5jU4R_.mjs.map
