import { c as __exportAll, _ as _plugin_vue_export_helper_default, t as twMerge, m as mergeConfig, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default } from '../virtual/entry.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { mergeProps, defineComponent, toRef, computed, useSSRContext } from 'vue';
import { twJoin } from 'tailwind-merge';
import { ssrRenderAttrs, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
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
import '@iconify/vue';

//#region node_modules/@nuxt/ui/dist/runtime/ui.config/elements/kbd.js
var kbd_default = {
	base: "inline-flex items-center justify-center text-gray-900 dark:text-white",
	padding: "px-1",
	size: {
		xs: "h-4 min-w-[16px] text-[10px]",
		sm: "h-5 min-w-[20px] text-[11px]",
		md: "h-6 min-w-[24px] text-[12px]"
	},
	rounded: "rounded",
	font: "font-medium font-sans",
	background: "bg-gray-100 dark:bg-gray-800",
	ring: "ring-1 ring-gray-300 dark:ring-gray-700 ring-inset",
	default: { size: "sm" }
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/elements/Kbd.vue
var Kbd_exports = /* @__PURE__ */ __exportAll({ default: () => Kbd_default });
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.kbd, kbd_default);
var _sfc_main = defineComponent({
	inheritAttrs: false,
	props: {
		value: {
			type: String,
			default: null
		},
		size: {
			type: String,
			default: () => config.default.size,
			validator(value) {
				return Object.keys(config.size).includes(value);
			}
		},
		class: {
			type: [
				String,
				Object,
				Array
			],
			default: () => ""
		},
		ui: {
			type: Object,
			default: () => ({})
		}
	},
	setup(props) {
		const { ui, attrs } = useUI("kbd", toRef(props, "ui"), config);
		return {
			ui,
			attrs,
			kbdClass: computed(() => {
				return twMerge(twJoin(ui.value.base, ui.value.size[props.size], ui.value.padding, ui.value.rounded, ui.value.font, ui.value.background, ui.value.ring), props.class);
			})
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<kbd${ssrRenderAttrs(mergeProps({ class: _ctx.kbdClass }, _ctx.attrs, _attrs))}>`);
	ssrRenderSlot(_ctx.$slots, "default", {}, () => {
		_push(`${ssrInterpolate(_ctx.value)}`);
	}, _push, _parent);
	_push(`</kbd>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/elements/Kbd.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Kbd_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UKbd" });

export { Kbd_exports as n, Kbd_default as t };
//# sourceMappingURL=Kbd-rjcREfaE.mjs.map
