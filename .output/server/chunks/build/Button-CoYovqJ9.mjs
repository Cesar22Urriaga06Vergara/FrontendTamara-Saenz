import { c as __exportAll, _ as _plugin_vue_export_helper_default, t as twMerge, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default, m as mergeConfig } from '../virtual/entry.mjs';
import { n as nuxtLinkProps, g as getNuxtLinkProps } from './link-apSRv82-.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { u as useInjectButtonGroup } from './useButtonGroup-OQHG41CY.mjs';
import { b as button_default } from './button-BNOdwSP_.mjs';
import { t as Link_default } from './Link-CnaKOPmE.mjs';
import { mergeProps, withCtx, renderSlot, openBlock, createBlock, createCommentVNode, toDisplayString, defineComponent, toRef, computed, useSSRContext } from 'vue';
import { twJoin } from 'tailwind-merge';
import { ssrRenderComponent, ssrRenderSlot, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
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

//#region node_modules/@nuxt/ui/dist/runtime/components/elements/Button.vue
var Button_exports = /* @__PURE__ */ __exportAll({ default: () => Button_default });
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.button, button_default);
var _sfc_main = defineComponent({
	components: {
		UIcon: Icon_default,
		ULink: Link_default
	},
	inheritAttrs: false,
	props: {
		...nuxtLinkProps,
		type: {
			type: String,
			default: "button"
		},
		block: {
			type: Boolean,
			default: false
		},
		label: {
			type: String,
			default: null
		},
		loading: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		padded: {
			type: Boolean,
			default: true
		},
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
		icon: {
			type: String,
			default: null
		},
		loadingIcon: {
			type: String,
			default: () => config.default.loadingIcon
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
		square: {
			type: Boolean,
			default: false
		},
		truncate: {
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
	setup(props, { slots }) {
		const { ui, attrs } = useUI("button", toRef(props, "ui"), config);
		const { size, rounded } = useInjectButtonGroup({
			ui,
			props
		});
		const isLeading = computed(() => {
			return props.icon && props.leading || props.icon && !props.trailing || props.loading && !props.trailing || props.leadingIcon;
		});
		const isTrailing = computed(() => {
			return props.icon && props.trailing || props.loading && props.trailing || props.trailingIcon;
		});
		const isSquare = computed(() => props.square || !slots.default && !props.label);
		return {
			ui,
			attrs,
			isLeading,
			isTrailing,
			isSquare,
			buttonClass: computed(() => {
				const variant = ui.value.color?.[props.color]?.[props.variant] || ui.value.variant[props.variant];
				return twMerge(twJoin(ui.value.base, ui.value.font, rounded.value, ui.value.size[size.value], ui.value.gap[size.value], props.padded && ui.value[isSquare.value ? "square" : "padding"][size.value], variant?.replaceAll("{color}", props.color), props.block ? ui.value.block : ui.value.inline), props.class);
			}),
			leadingIconName: computed(() => {
				if (props.loading) return props.loadingIcon;
				return props.leadingIcon || props.icon;
			}),
			trailingIconName: computed(() => {
				if (props.loading && !isLeading.value) return props.loadingIcon;
				return props.trailingIcon || props.icon;
			}),
			leadingIconClass: computed(() => {
				return twJoin(ui.value.icon.base, ui.value.icon.size[size.value], props.loading && ui.value.icon.loading);
			}),
			trailingIconClass: computed(() => {
				return twJoin(ui.value.icon.base, ui.value.icon.size[size.value], props.loading && !isLeading.value && ui.value.icon.loading);
			}),
			linkProps: computed(() => getNuxtLinkProps(props))
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_ULink = Link_default;
	const _component_UIcon = Icon_default;
	_push(ssrRenderComponent(_component_ULink, mergeProps({
		type: _ctx.type,
		disabled: _ctx.disabled || _ctx.loading,
		class: _ctx.buttonClass
	}, {
		..._ctx.linkProps,
		..._ctx.attrs
	}, _attrs), {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) {
				ssrRenderSlot(_ctx.$slots, "leading", {
					disabled: _ctx.disabled,
					loading: _ctx.loading
				}, () => {
					if (_ctx.isLeading && _ctx.leadingIconName) _push(ssrRenderComponent(_component_UIcon, {
						name: _ctx.leadingIconName,
						class: _ctx.leadingIconClass,
						"aria-hidden": "true"
					}, null, _parent, _scopeId));
					else _push(`<!---->`);
				}, _push, _parent, _scopeId);
				ssrRenderSlot(_ctx.$slots, "default", {}, () => {
					if (_ctx.label !== void 0 && _ctx.label !== null) _push(`<span class="${ssrRenderClass([_ctx.truncate ? _ctx.ui.truncate : ""])}"${_scopeId}>${ssrInterpolate(_ctx.label)}</span>`);
					else _push(`<!---->`);
				}, _push, _parent, _scopeId);
				ssrRenderSlot(_ctx.$slots, "trailing", {
					disabled: _ctx.disabled,
					loading: _ctx.loading
				}, () => {
					if (_ctx.isTrailing && _ctx.trailingIconName) _push(ssrRenderComponent(_component_UIcon, {
						name: _ctx.trailingIconName,
						class: _ctx.trailingIconClass,
						"aria-hidden": "true"
					}, null, _parent, _scopeId));
					else _push(`<!---->`);
				}, _push, _parent, _scopeId);
			} else return [
				renderSlot(_ctx.$slots, "leading", {
					disabled: _ctx.disabled,
					loading: _ctx.loading
				}, () => [_ctx.isLeading && _ctx.leadingIconName ? (openBlock(), createBlock(_component_UIcon, {
					key: 0,
					name: _ctx.leadingIconName,
					class: _ctx.leadingIconClass,
					"aria-hidden": "true"
				}, null, 8, ["name", "class"])) : createCommentVNode("", true)]),
				renderSlot(_ctx.$slots, "default", {}, () => [_ctx.label !== void 0 && _ctx.label !== null ? (openBlock(), createBlock("span", {
					key: 0,
					class: [_ctx.truncate ? _ctx.ui.truncate : ""]
				}, toDisplayString(_ctx.label), 3)) : createCommentVNode("", true)]),
				renderSlot(_ctx.$slots, "trailing", {
					disabled: _ctx.disabled,
					loading: _ctx.loading
				}, () => [_ctx.isTrailing && _ctx.trailingIconName ? (openBlock(), createBlock(_component_UIcon, {
					key: 0,
					name: _ctx.trailingIconName,
					class: _ctx.trailingIconClass,
					"aria-hidden": "true"
				}, null, 8, ["name", "class"])) : createCommentVNode("", true)])
			];
		}),
		_: 3
	}, _parent));
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/elements/Button.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Button_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UButton" });

export { Button_exports as n, Button_default as t };
//# sourceMappingURL=Button-CoYovqJ9.mjs.map
