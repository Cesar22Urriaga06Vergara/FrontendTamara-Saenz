import { c as __exportAll, _ as _plugin_vue_export_helper_default, t as twMerge, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default, m as mergeConfig } from '../virtual/entry.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { mergeProps, createVNode, resolveDynamicComponent, defineComponent, toRef, computed, ref, watch, useSSRContext } from 'vue';
import { twJoin } from 'tailwind-merge';
import { ssrRenderAttrs, ssrRenderVNode, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
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
import './components-CzgPFaUd.mjs';
import '@iconify/utils/lib/css/icon';

//#region node_modules/@nuxt/ui/dist/runtime/ui.config/elements/avatar.js
var avatar_default = {
	wrapper: "relative inline-flex items-center justify-center flex-shrink-0",
	background: "bg-gray-100 dark:bg-gray-800",
	rounded: "rounded-full",
	text: "font-medium leading-none text-gray-900 dark:text-white truncate",
	placeholder: "font-medium leading-none text-gray-500 dark:text-gray-400 truncate",
	size: {
		"3xs": "h-4 w-4 text-[8px]",
		"2xs": "h-5 w-5 text-[10px]",
		"xs": "h-6 w-6 text-xs",
		"sm": "h-8 w-8 text-sm",
		"md": "h-10 w-10 text-base",
		"lg": "h-12 w-12 text-lg",
		"xl": "h-14 w-14 text-xl",
		"2xl": "h-16 w-16 text-2xl",
		"3xl": "h-20 w-20 text-3xl"
	},
	chip: {
		base: "absolute rounded-full ring-1 ring-white dark:ring-gray-900 flex items-center justify-center text-white dark:text-gray-900 font-medium",
		background: "bg-{color}-500 dark:bg-{color}-400",
		position: {
			"top-right": "top-0 right-0",
			"bottom-right": "bottom-0 right-0",
			"top-left": "top-0 left-0",
			"bottom-left": "bottom-0 left-0"
		},
		size: {
			"3xs": "h-[4px] min-w-[4px] text-[4px] p-px",
			"2xs": "h-[5px] min-w-[5px] text-[5px] p-px",
			"xs": "h-1.5 min-w-[0.375rem] text-[6px] p-px",
			"sm": "h-2 min-w-[0.5rem] text-[7px] p-0.5",
			"md": "h-2.5 min-w-[0.625rem] text-[8px] p-0.5",
			"lg": "h-3 min-w-[0.75rem] text-[10px] p-0.5",
			"xl": "h-3.5 min-w-[0.875rem] text-[11px] p-1",
			"2xl": "h-4 min-w-[1rem] text-[12px] p-1",
			"3xl": "h-5 min-w-[1.25rem] text-[14px] p-1"
		}
	},
	icon: {
		base: "text-gray-500 dark:text-gray-400 flex-shrink-0",
		size: {
			"3xs": "h-2 w-2",
			"2xs": "h-2.5 w-2.5",
			"xs": "h-3 w-3",
			"sm": "h-4 w-4",
			"md": "h-5 w-5",
			"lg": "h-6 w-6",
			"xl": "h-7 w-7",
			"2xl": "h-8 w-8",
			"3xl": "h-10 w-10"
		}
	},
	default: {
		size: "sm",
		icon: null,
		chipColor: null,
		chipPosition: "top-right"
	}
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/elements/Avatar.vue
var Avatar_exports = /* @__PURE__ */ __exportAll({ default: () => Avatar_default });
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.avatar, avatar_default);
var _sfc_main = defineComponent({
	components: { UIcon: Icon_default },
	inheritAttrs: false,
	props: {
		as: {
			type: [String, Object],
			default: "img"
		},
		src: {
			type: [String, Boolean],
			default: null
		},
		alt: {
			type: String,
			default: null
		},
		text: {
			type: String,
			default: null
		},
		icon: {
			type: String,
			default: () => config.default.icon
		},
		size: {
			type: String,
			default: () => config.default.size,
			validator(value) {
				return Object.keys(config.size).includes(value);
			}
		},
		chipColor: {
			type: String,
			default: () => config.default.chipColor,
			validator(value) {
				return ["gray", ...virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.colors].includes(value);
			}
		},
		chipPosition: {
			type: String,
			default: () => config.default.chipPosition,
			validator(value) {
				return Object.keys(config.chip.position).includes(value);
			}
		},
		chipText: {
			type: [String, Number],
			default: null
		},
		imgClass: {
			type: String,
			default: ""
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
		const { ui, attrs } = useUI("avatar", toRef(props, "ui"), config);
		const url = computed(() => {
			if (typeof props.src === "boolean") return null;
			return props.src;
		});
		const placeholder = computed(() => {
			return (props.alt || "").split(" ").map((word) => word.charAt(0)).join("").substring(0, 2);
		});
		const wrapperClass = computed(() => {
			return twMerge(twJoin(ui.value.wrapper, (error.value || !url.value) && ui.value.background, ui.value.rounded, ui.value.size[props.size]), props.class);
		});
		const imgClass = computed(() => {
			return twMerge(twJoin(ui.value.rounded, ui.value.size[props.size]), props.imgClass);
		});
		const iconClass = computed(() => {
			return twJoin(ui.value.icon.base, ui.value.icon.size[props.size]);
		});
		const chipClass = computed(() => {
			return twJoin(ui.value.chip.base, ui.value.chip.size[props.size], ui.value.chip.position[props.chipPosition], ui.value.chip.background.replaceAll("{color}", props.chipColor));
		});
		const error = ref(false);
		watch(() => props.src, () => {
			if (error.value) error.value = false;
		});
		function onError() {
			error.value = true;
		}
		return {
			ui,
			attrs,
			wrapperClass,
			imgClass,
			iconClass,
			chipClass,
			url,
			placeholder,
			error,
			onError
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_UIcon = Icon_default;
	_push(`<span${ssrRenderAttrs(mergeProps({ class: _ctx.wrapperClass }, _attrs))}>`);
	if (_ctx.url && !_ctx.error) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(_ctx.as), mergeProps({
		class: _ctx.imgClass,
		alt: _ctx.alt,
		src: _ctx.url
	}, _ctx.attrs, { onError: _ctx.onError }), null), _parent);
	else if (_ctx.text) _push(`<span class="${ssrRenderClass(_ctx.ui.text)}">${ssrInterpolate(_ctx.text)}</span>`);
	else if (_ctx.icon) _push(ssrRenderComponent(_component_UIcon, {
		name: _ctx.icon,
		class: _ctx.iconClass
	}, null, _parent));
	else if (_ctx.placeholder) _push(`<span class="${ssrRenderClass(_ctx.ui.placeholder)}">${ssrInterpolate(_ctx.placeholder)}</span>`);
	else _push(`<!---->`);
	if (_ctx.chipColor) _push(`<span class="${ssrRenderClass(_ctx.chipClass)}">${ssrInterpolate(_ctx.chipText)}</span>`);
	else _push(`<!---->`);
	ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
	_push(`</span>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/elements/Avatar.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Avatar_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UAvatar" });

export { Avatar_exports as n, avatar_default as r, Avatar_default as t };
//# sourceMappingURL=Avatar-BOI4zec4.mjs.map
