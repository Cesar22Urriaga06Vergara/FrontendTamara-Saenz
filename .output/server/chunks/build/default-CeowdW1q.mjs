import { _ as _plugin_vue_export_helper_default, a as useAuthStore, N as NuxtLink, n as navigateTo } from '../virtual/entry.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { u as useMarcaEmpresa } from './useMarcaEmpresa-zrKUsI4h.mjs';
import { t as Badge_default } from './Badge-Dji78drx.mjs';
import { t as Button_default } from './Button-CoYovqJ9.mjs';
import { mergeProps, defineComponent, computed, unref, withCtx, createVNode, createTextVNode, toDisplayString, ref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
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
import './link-apSRv82-.mjs';
import './button-BNOdwSP_.mjs';
import './Link-CnaKOPmE.mjs';

//#region components/layout/Sidebar.vue?vue&type=script&setup=true&lang.ts
var Sidebar_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Sidebar",
	__ssrInlineRender: true,
	setup(__props) {
		const auth = useAuthStore();
		const marca = useMarcaEmpresa();
		/**
		* Menú oficial (sección 5 del prompt): GENERAL, OPERACIÓN, DIRECTORIOS,
		* CONSULTA Y CONTROL, ADMINISTRACIÓN. Los ítems marcados soloAdmin se ocultan
		* completamente para el rol Recepcionista (no solo se deshabilitan).
		*/
		const secciones = computed(() => [
			{
				titulo: "GENERAL",
				items: [{
					label: "Dashboard",
					icon: "i-heroicons-squares-2x2",
					to: "/dashboard"
				}]
			},
			{
				titulo: "OPERACIÓN",
				items: [
					{
						label: "Contratos",
						icon: "i-heroicons-document-text",
						to: "/contratos"
					},
					{
						label: "Recaudo",
						icon: "i-heroicons-banknotes",
						to: "/recaudo",
						soloAdmin: true
					},
					{
						label: "Novedades",
						icon: "i-heroicons-wrench-screwdriver",
						to: "/novedades"
					}
				]
			},
			{
				titulo: "DIRECTORIOS",
				items: [
					{
						label: "Clientes",
						icon: "i-heroicons-user-group",
						to: "/clientes"
					},
					{
						label: "Codeudores",
						icon: "i-heroicons-user-plus",
						to: "/codeudores"
					},
					{
						label: "Inmuebles",
						icon: "i-heroicons-building-office-2",
						to: "/inmuebles"
					}
				]
			},
			{
				titulo: "FINANZAS",
				items: [{
					label: "Recibos",
					icon: "i-heroicons-receipt-percent",
					to: "/recibos",
					soloAdmin: true
				}, {
					label: "Caja",
					icon: "i-heroicons-calculator",
					to: "/caja",
					soloAdmin: true
				}]
			},
			{
				titulo: "CONSULTA Y CONTROL",
				items: [
					{
						label: "Movimientos",
						icon: "i-heroicons-arrows-right-left",
						to: "/movimientos",
						soloAdmin: true
					},
					{
						label: "Reportes",
						icon: "i-heroicons-chart-bar",
						to: "/reportes",
						soloAdmin: true
					},
					{
						label: "Auditoría",
						icon: "i-heroicons-shield-check",
						to: "/auditoria",
						soloAdmin: true
					}
				]
			},
			{
				titulo: "ADMINISTRACIÓN",
				items: [{
					label: "Usuarios",
					icon: "i-heroicons-cog-6-tooth",
					to: "/administracion",
					soloAdmin: true
				}, {
					label: "Configuración",
					icon: "i-heroicons-cog-6-tooth",
					to: "/configuracion",
					soloAdmin: true
				}]
			}
		].map((s) => ({
			...s,
			items: s.items.filter((i) => !i.soloAdmin || auth.esAdministrador)
		})));
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			const _component_UIcon = Icon_default;
			_push(`<aside${ssrRenderAttrs(mergeProps({ class: "w-64 shrink-0 bg-slate-700 text-white flex flex-col h-screen sticky top-0" }, _attrs))}><div class="px-5 py-6 border-b border-slate-600/60 flex items-center gap-3">`);
			if (unref(marca).logoSrc.value) _push(`<img${ssrRenderAttr("src", unref(marca).logoSrc.value)} alt="Logo" class="h-9 w-9 object-contain rounded shrink-0">`);
			else _push(`<!---->`);
			_push(`<div class="min-w-0"><p class="font-bold text-lg leading-tight text-white truncate">${ssrInterpolate(unref(marca).nombre.value)}</p><p class="text-xs text-amber-500 italic mt-0.5 truncate">${ssrInterpolate(unref(marca).slogan.value)}</p></div></div><nav class="flex-1 overflow-y-auto py-4 space-y-6"><!--[-->`);
			ssrRenderList(unref(secciones), (seccion) => {
				_push(`<div style="${ssrRenderStyle(seccion.items.length ? null : { display: "none" })}"><p class="px-5 mb-2 text-[11px] font-semibold tracking-wider text-slate-400">${ssrInterpolate(seccion.titulo)}</p><!--[-->`);
				ssrRenderList(seccion.items, (item) => {
					_push(ssrRenderComponent(_component_NuxtLink, {
						key: item.to,
						to: item.to,
						class: "flex items-center gap-3 px-5 py-2.5 text-sm text-slate-100 hover:bg-slate-600/60 hover:text-amber-500 transition-colors",
						"active-class": "bg-slate-900 text-amber-500 border-r-2 border-amber-600"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(ssrRenderComponent(_component_UIcon, {
									name: item.icon,
									class: "w-5 h-5"
								}, null, _parent, _scopeId));
								_push(` ${ssrInterpolate(item.label)}`);
							} else return [createVNode(_component_UIcon, {
								name: item.icon,
								class: "w-5 h-5"
							}, null, 8, ["name"]), createTextVNode(" " + toDisplayString(item.label), 1)];
						}),
						_: 2
					}, _parent));
				});
				_push(`<!--]--></div>`);
			});
			_push(`<!--]--></nav><div class="px-5 py-4 border-t border-slate-600/60 text-xs text-slate-400"><p class="text-slate-200 font-medium">${ssrInterpolate(unref(auth).usuario?.email)}</p><p>${ssrInterpolate(unref(auth).rol)}</p></div></aside>`);
		};
	}
});
//#endregion
//#region components/layout/Sidebar.vue
var _sfc_setup$2 = Sidebar_vue_vue_type_script_setup_true_lang_default.setup;
Sidebar_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Sidebar.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var Sidebar_default = Object.assign(Sidebar_vue_vue_type_script_setup_true_lang_default, { __name: "LayoutSidebar" });
//#endregion
//#region components/layout/Header.vue?vue&type=script&setup=true&lang.ts
var Header_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Header",
	__ssrInlineRender: true,
	setup(__props) {
		const auth = useAuthStore();
		const cerrandoSesion = ref(false);
		async function salir() {
			cerrandoSesion.value = true;
			await auth.cerrarSesion();
			await navigateTo("/login");
			cerrandoSesion.value = false;
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UBadge = Badge_default;
			const _component_UButton = Button_default;
			_push(`<header${ssrRenderAttrs(mergeProps({ class: "h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 sticky top-0 z-10" }, _attrs))}><div>`);
			ssrRenderSlot(_ctx.$slots, "titulo", {}, () => {
				_push(`<h1 class="text-lg font-semibold text-slate-900">Panel</h1>`);
			}, _push, _parent);
			_push(`</div><div class="flex items-center gap-4">`);
			_push(ssrRenderComponent(_component_UBadge, {
				color: unref(auth).esAdministrador ? "amber" : "gray",
				variant: "subtle"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`${ssrInterpolate(unref(auth).rol)}`);
					else return [createTextVNode(toDisplayString(unref(auth).rol), 1)];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UButton, {
				color: "gray",
				variant: "ghost",
				icon: "i-heroicons-arrow-right-on-rectangle",
				loading: unref(cerrandoSesion),
				onClick: salir
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Salir `);
					else return [createTextVNode(" Salir ")];
				}),
				_: 1
			}, _parent));
			_push(`</div></header>`);
		};
	}
});
//#endregion
//#region components/layout/Header.vue
var _sfc_setup$1 = Header_vue_vue_type_script_setup_true_lang_default.setup;
Header_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Header.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var Header_default = Object.assign(Header_vue_vue_type_script_setup_true_lang_default, { __name: "LayoutHeader" });
//#endregion
//#region layouts/default.vue
var _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
	const _component_LayoutSidebar = Sidebar_default;
	const _component_LayoutHeader = Header_default;
	_push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-screen bg-slate-50" }, _attrs))}>`);
	_push(ssrRenderComponent(_component_LayoutSidebar, null, null, _parent));
	_push(`<div class="flex-1 flex flex-col">`);
	_push(ssrRenderComponent(_component_LayoutHeader, null, null, _parent));
	_push(`<main class="flex-1 p-6">`);
	ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
	_push(`</main></div></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var default_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { default_default as default };
//# sourceMappingURL=default-CeowdW1q.mjs.map
