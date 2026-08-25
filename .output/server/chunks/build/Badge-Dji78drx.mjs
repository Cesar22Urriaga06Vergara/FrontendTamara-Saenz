import { c as __exportAll, _ as _plugin_vue_export_helper_default, t as twMerge, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default, m as mergeConfig } from '../virtual/entry.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { u as useInjectButtonGroup } from './useButtonGroup-OQHG41CY.mjs';
import { mergeProps, defineComponent, toRef, computed, useSSRContext } from 'vue';
import { twJoin } from 'tailwind-merge';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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

//#region node_modules/@nuxt/ui/dist/runtime/ui.config/elements/badge.js
var badge_default = {
	base: "inline-flex items-center",
	rounded: "rounded-md",
	font: "font-medium",
	size: {
		xs: "text-xs px-1.5 py-0.5",
		sm: "text-xs px-2 py-1",
		md: "text-sm px-2 py-1",
		lg: "text-sm px-2.5 py-1.5"
	},
	gap: {
		xs: "gap-0.5",
		sm: "gap-1",
		md: "gap-1",
		lg: "gap-1.5"
	},
	color: {
		white: { solid: "ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-900" },
		gray: { solid: "ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800" },
		black: { solid: "text-white dark:text-gray-900 bg-gray-900 dark:bg-white" }
	},
	variant: {
		solid: "bg-{color}-500 dark:bg-{color}-400 text-white dark:text-gray-900",
		outline: "text-{color}-500 dark:text-{color}-400 ring-1 ring-inset ring-{color}-500 dark:ring-{color}-400",
		soft: "bg-{color}-50 dark:bg-{color}-400 dark:bg-opacity-10 text-{color}-500 dark:text-{color}-400",
		subtle: "bg-{color}-50 dark:bg-{color}-400 dark:bg-opacity-10 text-{color}-500 dark:text-{color}-400 ring-1 ring-inset ring-{color}-500 dark:ring-{color}-400 ring-opacity-25 dark:ring-opacity-25"
	},
	icon: {
		base: "flex-shrink-0",
		size: {
			xs: "h-4 w-4",
			sm: "h-4 w-4",
			md: "h-5 w-5",
			lg: "h-5 w-5"
		}
	},
	default: {
		size: "sm",
		variant: "solid",
		color: "primary"
	}
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/elements/Badge.vue
var Badge_exports = /* @__PURE__ */ __exportAll({ default: () => Badge_default });
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.badge, badge_default);
var _sfc_main = defineComponent({
	components: { UIcon: Icon_default },
	inheritAttrs: false,
	props: {
		size: {
			type: String,
			default: () => config.default.size,
			validator(value) {
				return Object.keys(config.size).includes(value);
			}
		},
		color: {
			type: String,
			default: () => config.default.color,
			validator(value) {
				return [...virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.colors, ...Object.keys(config.color)].includes(value);
			}
		},
		variant: {
			type: String,
			default: () => config.default.variant,
			validator(value) {
				return [...Object.keys(config.variant), ...Object.values(config.color).flatMap((value2) => Object.keys(value2))].includes(value);
			}
		},
		label: {
			type: [String, Number],
			default: null
		},
		icon: {
			type: String,
			default: null
		},
		leadingIcon: {
			type: String,
			default: null
		},
		trailingIcon: {
			type: String,
			default: null
		},
		trailing: {
			type: Boolean,
			default: false
		},
		leading: {
			type: Boolean,
			default: false
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
		const { ui, attrs } = useUI("badge", toRef(props, "ui"), config);
		const { size, rounded } = useInjectButtonGroup({
			ui,
			props
		});
		return {
			attrs,
			isLeading: computed(() => {
				return props.icon && props.leading || props.icon && !props.trailing || !props.trailing || props.leadingIcon;
			}),
			isTrailing: computed(() => {
				return props.icon && props.trailing || props.trailing || props.trailingIcon;
			}),
			badgeClass: computed(() => {
				const variant = ui.value.color?.[props.color]?.[props.variant] || ui.value.variant[props.variant];
				return twMerge(twJoin(ui.value.base, ui.value.font, rounded.value, ui.value.size[size.value], ui.value.gap[size.value], variant?.replaceAll("{color}", props.color)), props.class);
			}),
			leadingIconName: computed(() => {
				return props.leadingIcon || props.icon;
			}),
			trailingIconName: computed(() => {
				return props.trailingIcon || props.icon;
			}),
			leadingIconClass: computed(() => {
				return twJoin(ui.value.icon.base, ui.value.icon.size[size.value]);
			}),
			trailingIconClass: computed(() => {
				return twJoin(ui.value.icon.base, ui.value.icon.size[size.value]);
			})
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_UIcon = Icon_default;
	_push(`<span${ssrRenderAttrs(mergeProps({ class: _ctx.badgeClass }, _ctx.attrs, _attrs))}>`);
	ssrRenderSlot(_ctx.$slots, "leading", {}, () => {
		if (_ctx.isLeading && _ctx.leadingIconName) _push(ssrRenderComponent(_component_UIcon, {
			name: _ctx.leadingIconName,
			class: _ctx.leadingIconClass,
			"aria-hidden": "true"
		}, null, _parent));
		else _push(`<!---->`);
	}, _push, _parent);
	ssrRenderSlot(_ctx.$slots, "default", {}, () => {
		if (_ctx.label !== void 0 && _ctx.label !== null) _push(`<span>${ssrInterpolate(_ctx.label)}</span>`);
		else _push(`<!---->`);
	}, _push, _parent);
	ssrRenderSlot(_ctx.$slots, "trailing", {}, () => {
		if (_ctx.isTrailing && _ctx.trailingIconName) _push(ssrRenderComponent(_component_UIcon, {
			name: _ctx.trailingIconName,
			class: _ctx.trailingIconClass,
			"aria-hidden": "true"
		}, null, _parent));
		else _push(`<!---->`);
	}, _push, _parent);
	_push(`</span>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/elements/Badge.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Badge_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UBadge" });

export { Badge_exports as n, Badge_default as t };
//# sourceMappingURL=Badge-Dji78drx.mjs.map
