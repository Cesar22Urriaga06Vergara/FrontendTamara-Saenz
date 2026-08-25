import { a as useAuthStore, $ as $fetch$1, b as useRuntimeConfig } from '../virtual/entry.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { t as Alert_default } from './Alert-Bv_RgsgM.mjs';
import { t as Card_default } from './Card-j-DCNf6K.mjs';
import { t as Button_default } from './Button-CoYovqJ9.mjs';
import { defineComponent, ref, unref, withCtx, createTextVNode, createVNode, toDisplayString, useSSRContext } from 'vue';
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
import './Avatar-BOI4zec4.mjs';
import './link-apSRv82-.mjs';
import './useButtonGroup-OQHG41CY.mjs';
import './button-BNOdwSP_.mjs';
import './Link-CnaKOPmE.mjs';

//#region composables/useExcelExport.ts
/**
* Descarga un reporte .xlsx generado por el backend (`/reportes/...` o `/documentos/...`).
* Los reportes financieros SIEMPRE se generan en el servidor (fuente de la verdad);
* este composable solo dispara la descarga del binario ya construido.
*/
async function useExcelExport(path, nombreArchivo, params = {}) {
	const config = useRuntimeConfig();
	const auth = useAuthStore();
	const blob = await $fetch$1(path, {
		baseURL: config.public.apiBaseUrl,
		headers: { Authorization: `Bearer ${auth.accessToken}` },
		params,
		responseType: "blob"
	});
	const url = (void 0).URL.createObjectURL(blob);
	const link = (void 0).createElement("a");
	link.href = url;
	link.download = nombreArchivo.endsWith(".xlsx") ? nombreArchivo : `${nombreArchivo}.xlsx`;
	(void 0).body.appendChild(link);
	link.click();
	link.remove();
	(void 0).URL.revokeObjectURL(url);
}
//#endregion
//#region pages/reportes/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		/** Centro de exportación de informes a Excel (.xlsx) — EXCLUSIVO Administrador. */
		const descargando = ref(null);
		const error = ref("");
		async function descargar(clave, path, nombreArchivo) {
			error.value = "";
			descargando.value = clave;
			try {
				await useExcelExport(path, nombreArchivo);
			} catch (e) {
				error.value = e?.data?.message || "No fue posible descargar el reporte.";
			} finally {
				descargando.value = null;
			}
		}
		const reportes = [
			{
				clave: "contratos",
				titulo: "Contratos",
				descripcion: "Listado completo de contratos con arrendatario, inmueble, canon y estado.",
				icon: "i-heroicons-document-text",
				path: "/documentos/reportes/contratos.xlsx",
				archivo: "reporte-contratos.xlsx"
			},
			{
				clave: "cartera",
				titulo: "Cartera consolidada",
				descripcion: "Obligaciones pendientes y parciales de todos los contratos, con saldo y mora acumulada, incluye fila de totales.",
				icon: "i-heroicons-banknotes",
				path: "/documentos/reportes/cartera.xlsx",
				archivo: "reporte-cartera.xlsx"
			},
			{
				clave: "recaudo",
				titulo: "Recaudo (recibos de caja)",
				descripcion: "Todos los recibos de caja emitidos y anulados (efectivo y transferencias), con arrendatario, inmueble y excedente.",
				icon: "i-heroicons-currency-dollar",
				path: "/documentos/reportes/recaudo.xlsx",
				archivo: "reporte-recaudo.xlsx"
			},
			{
				clave: "barrio",
				titulo: "Inmuebles por barrio",
				descripcion: "Portafolio de inmuebles agrupado y ordenado por barrio.",
				icon: "i-heroicons-building-office-2",
				path: "/documentos/reportes/inmuebles-por-barrio.xlsx",
				archivo: "reporte-inmuebles-por-barrio.xlsx"
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UAlert = Alert_default;
			const _component_UCard = Card_default;
			const _component_UIcon = Icon_default;
			const _component_UButton = Button_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-xl font-semibold text-slate-900 mb-4">Reportes</h1>`);
			if (unref(error)) _push(ssrRenderComponent(_component_UAlert, {
				color: "red",
				variant: "subtle",
				title: unref(error),
				class: "mb-4"
			}, null, _parent));
			else _push(`<!---->`);
			_push(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><!--[-->`);
			ssrRenderList(reportes, (r) => {
				_push(ssrRenderComponent(_component_UCard, { key: r.clave }, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<div class="flex items-start gap-4"${_scopeId}><div class="p-3 rounded-lg bg-amber-50 text-amber-600"${_scopeId}>`);
							_push(ssrRenderComponent(_component_UIcon, {
								name: r.icon,
								class: "w-6 h-6"
							}, null, _parent, _scopeId));
							_push(`</div><div class="flex-1"${_scopeId}><p class="font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(r.titulo)}</p><p class="text-sm text-slate-500 mt-1"${_scopeId}>${ssrInterpolate(r.descripcion)}</p>`);
							_push(ssrRenderComponent(_component_UButton, {
								class: "mt-3",
								color: "amber",
								variant: "soft",
								icon: "i-heroicons-arrow-down-tray",
								loading: unref(descargando) === r.clave,
								onClick: ($event) => descargar(r.clave, r.path, r.archivo)
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(` Exportar a Excel `);
									else return [createTextVNode(" Exportar a Excel ")];
								}),
								_: 2
							}, _parent, _scopeId));
							_push(`</div></div>`);
						} else return [createVNode("div", { class: "flex items-start gap-4" }, [createVNode("div", { class: "p-3 rounded-lg bg-amber-50 text-amber-600" }, [createVNode(_component_UIcon, {
							name: r.icon,
							class: "w-6 h-6"
						}, null, 8, ["name"])]), createVNode("div", { class: "flex-1" }, [
							createVNode("p", { class: "font-semibold text-slate-900" }, toDisplayString(r.titulo), 1),
							createVNode("p", { class: "text-sm text-slate-500 mt-1" }, toDisplayString(r.descripcion), 1),
							createVNode(_component_UButton, {
								class: "mt-3",
								color: "amber",
								variant: "soft",
								icon: "i-heroicons-arrow-down-tray",
								loading: unref(descargando) === r.clave,
								onClick: ($event) => descargar(r.clave, r.path, r.archivo)
							}, {
								default: withCtx(() => [createTextVNode(" Exportar a Excel ")]),
								_: 1
							}, 8, ["loading", "onClick"])
						])])];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></div><p class="text-xs text-slate-400 mt-6"> Los reportes se generan en el servidor a partir de los datos actuales — el archivo descargado siempre refleja el estado más reciente del sistema. </p></div>`);
		};
	}
});
//#endregion
//#region pages/reportes/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reportes/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var reportes_default = index_vue_vue_type_script_setup_true_lang_default;

export { reportes_default as default };
//# sourceMappingURL=reportes-BtPYdaFq.mjs.map
