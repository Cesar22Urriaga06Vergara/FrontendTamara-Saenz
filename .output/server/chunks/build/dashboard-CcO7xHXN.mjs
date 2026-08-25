import { a as useAuthStore } from '../virtual/entry.mjs';
import { t as Alert_default } from './Alert-Bv_RgsgM.mjs';
import { t as Card_default } from './Card-j-DCNf6K.mjs';
import { u as useFormatoCO } from './useFormatoCO-CX_CcnnC.mjs';
import { defineComponent, ref, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
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
import './Icon-DzlsKOwd.mjs';
import './components-CzgPFaUd.mjs';
import '@iconify/utils/lib/css/icon';
import './ui.config-2s_B03nh.mjs';
import './Avatar-BOI4zec4.mjs';
import './Button-CoYovqJ9.mjs';
import './link-apSRv82-.mjs';
import './useButtonGroup-OQHG41CY.mjs';
import './button-BNOdwSP_.mjs';
import './Link-CnaKOPmE.mjs';

//#region pages/dashboard/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const auth = useAuthStore();
		const { moneda } = useFormatoCO();
		ref(true);
		const error = ref("");
		const metricas = ref({
			carteraTotal: 0,
			contratosActivos: 0,
			novedadesAbiertas: 0,
			recaudoMesActual: 0
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UAlert = Alert_default;
			const _component_UCard = Card_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-xl font-semibold text-slate-900 mb-4">Dashboard</h1>`);
			if (unref(error)) _push(ssrRenderComponent(_component_UAlert, {
				color: "red",
				variant: "subtle",
				title: unref(error),
				class: "mb-4"
			}, null, _parent));
			else _push(`<!---->`);
			_push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">`);
			_push(ssrRenderComponent(_component_UCard, null, {
				header: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<p class="text-sm text-slate-500"${_scopeId}>Contratos activos</p>`);
					else return [createVNode("p", { class: "text-sm text-slate-500" }, "Contratos activos")];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<p class="text-3xl font-bold text-slate-900"${_scopeId}>${ssrInterpolate(unref(metricas).contratosActivos)}</p>`);
					else return [createVNode("p", { class: "text-3xl font-bold text-slate-900" }, toDisplayString(unref(metricas).contratosActivos), 1)];
				}),
				_: 1
			}, _parent));
			if (unref(auth).esAdministrador) _push(ssrRenderComponent(_component_UCard, null, {
				header: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<p class="text-sm text-slate-500"${_scopeId}>Cartera total</p>`);
					else return [createVNode("p", { class: "text-sm text-slate-500" }, "Cartera total")];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<p class="text-3xl font-bold text-amber-600"${_scopeId}>${ssrInterpolate(unref(moneda)(unref(metricas).carteraTotal))}</p><p class="text-xs text-slate-400 mt-1"${_scopeId}>Saldo de capital pendiente, sin mora. Ver reporte de cartera para el detalle con mora.</p>`);
					else return [createVNode("p", { class: "text-3xl font-bold text-amber-600" }, toDisplayString(unref(moneda)(unref(metricas).carteraTotal)), 1), createVNode("p", { class: "text-xs text-slate-400 mt-1" }, "Saldo de capital pendiente, sin mora. Ver reporte de cartera para el detalle con mora.")];
				}),
				_: 1
			}, _parent));
			else _push(`<!---->`);
			if (unref(auth).esAdministrador) _push(ssrRenderComponent(_component_UCard, null, {
				header: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<p class="text-sm text-slate-500"${_scopeId}>Recaudo mes actual</p>`);
					else return [createVNode("p", { class: "text-sm text-slate-500" }, "Recaudo mes actual")];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<p class="text-3xl font-bold text-emerald-600"${_scopeId}>${ssrInterpolate(unref(moneda)(unref(metricas).recaudoMesActual))}</p>`);
					else return [createVNode("p", { class: "text-3xl font-bold text-emerald-600" }, toDisplayString(unref(moneda)(unref(metricas).recaudoMesActual)), 1)];
				}),
				_: 1
			}, _parent));
			else _push(`<!---->`);
			_push(ssrRenderComponent(_component_UCard, null, {
				header: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<p class="text-sm text-slate-500"${_scopeId}>Novedades abiertas</p>`);
					else return [createVNode("p", { class: "text-sm text-slate-500" }, "Novedades abiertas")];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<p class="text-3xl font-bold text-orange-600"${_scopeId}>${ssrInterpolate(unref(metricas).novedadesAbiertas)}</p>`);
					else return [createVNode("p", { class: "text-3xl font-bold text-orange-600" }, toDisplayString(unref(metricas).novedadesAbiertas), 1)];
				}),
				_: 1
			}, _parent));
			_push(`</div><p class="text-xs text-slate-400 mt-6"> Bienvenido/a, ${ssrInterpolate(unref(auth).usuario?.email)} — Rol: ${ssrInterpolate(unref(auth).rol)}</p></div>`);
		};
	}
});
//#endregion
//#region pages/dashboard/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var dashboard_default = index_vue_vue_type_script_setup_true_lang_default;

export { dashboard_default as default };
//# sourceMappingURL=dashboard-CcO7xHXN.mjs.map
