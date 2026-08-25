import { c as __exportAll, _ as _plugin_vue_export_helper_default, t as twMerge, m as mergeConfig, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default } from '../virtual/entry.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { t as Avatar_default } from './Avatar-BOI4zec4.mjs';
import { mergeProps, defineComponent, toRef, computed, useSSRContext } from 'vue';
import { twJoin } from 'tailwind-merge';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderSlot, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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

//#region node_modules/@nuxt/ui/dist/runtime/ui.config/layout/divider.js
var divider_default = {
	wrapper: {
		base: "flex items-center align-center text-center",
		horizontal: "w-full flex-row",
		vertical: "flex-col"
	},
	container: {
		base: "font-medium text-gray-700 dark:text-gray-200 flex",
		horizontal: "mx-3 whitespace-nowrap",
		vertical: "my-2"
	},
	border: {
		base: "flex border-gray-200 dark:border-gray-800",
		horizontal: "w-full",
		vertical: "h-full",
		size: {
			horizontal: {
				"2xs": "border-t",
				"xs": "border-t-[2px]",
				"sm": "border-t-[3px]",
				"md": "border-t-[4px]",
				"lg": "border-t-[5px]",
				"xl": "border-t-[6px]"
			},
			vertical: {
				"2xs": "border-s",
				"xs": "border-s-[2px]",
				"sm": "border-s-[3px]",
				"md": "border-s-[4px]",
				"lg": "border-s-[5px]",
				"xl": "border-s-[6px]"
			}
		},
		type: {
			solid: "border-solid",
			dotted: "border-dotted",
			dashed: "border-dashed"
		}
	},
	icon: { base: "flex-shrink-0 w-5 h-5" },
	avatar: {
		base: "flex-shrink-0",
		size: "2xs"
	},
	label: "text-sm",
	default: {
		size: "2xs",
		type: "solid"
	}
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/layout/Divider.vue
var Divider_exports = /* @__PURE__ */ __exportAll({ default: () => Divider_default });
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.divider, divider_default);
var _sfc_main = defineComponent({
	components: {
		UIcon: Icon_default,
		UAvatar: Avatar_default
	},
	inheritAttrs: false,
	props: {
		label: {
			type: String,
			default: null
		},
		icon: {
			type: String,
			default: null
		},
		avatar: {
			type: Object,
			default: null
		},
		size: {
			type: String,
			default: () => config.default.size,
			validator(value) {
				return Object.keys(config.border.size.horizontal).includes(value) || Object.keys(config.border.size.vertical).includes(value);
			}
		},
		orientation: {
			type: String,
			default: "horizontal",
			validator: (value) => ["horizontal", "vertical"].includes(value)
		},
		type: {
			type: String,
			default: () => config.default.type,
			validator: (value) => [
				"solid",
				"dotted",
				"dashed"
			].includes(value)
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
		const { ui, attrs } = useUI("divider", toRef(props, "ui"), config);
		return {
			ui,
			attrs,
			wrapperClass: computed(() => {
				return twMerge(twJoin(ui.value.wrapper.base, ui.value.wrapper[props.orientation]), props.class);
			}),
			containerClass: computed(() => {
				return twJoin(ui.value.container.base, ui.value.container[props.orientation]);
			}),
			borderClass: computed(() => {
				return twJoin(ui.value.border.base, ui.value.border[props.orientation], ui.value.border.size[props.orientation][props.size], ui.value.border.type[props.type]);
			})
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_UIcon = Icon_default;
	const _component_UAvatar = Avatar_default;
	_push(`<div${ssrRenderAttrs(mergeProps({ class: _ctx.wrapperClass }, _ctx.attrs, _attrs))}><div class="${ssrRenderClass(_ctx.borderClass)}"></div>`);
	if (_ctx.label || _ctx.icon || _ctx.avatar || _ctx.$slots.default) {
		_push(`<!--[--><div class="${ssrRenderClass(_ctx.containerClass)}">`);
		ssrRenderSlot(_ctx.$slots, "default", {}, () => {
			if (_ctx.label) _push(`<span class="${ssrRenderClass(_ctx.ui.label)}">${ssrInterpolate(_ctx.label)}</span>`);
			else if (_ctx.icon) _push(ssrRenderComponent(_component_UIcon, {
				name: _ctx.icon,
				class: _ctx.ui.icon.base
			}, null, _parent));
			else if (_ctx.avatar) _push(ssrRenderComponent(_component_UAvatar, mergeProps({
				size: _ctx.ui.avatar.size,
				..._ctx.avatar
			}, { class: _ctx.ui.avatar.base }), null, _parent));
			else _push(`<!---->`);
		}, _push, _parent);
		_push(`</div><div class="${ssrRenderClass(_ctx.borderClass)}"></div><!--]-->`);
	} else _push(`<!---->`);
	_push(`</div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/layout/Divider.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Divider_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UDivider" });

export { Divider_exports as n, Divider_default as t };
//# sourceMappingURL=Divider-DitdhbQt.mjs.map
