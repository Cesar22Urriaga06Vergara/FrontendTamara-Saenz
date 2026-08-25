import { c as __exportAll, _ as _plugin_vue_export_helper_default, t as twMerge, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default, m as mergeConfig } from '../virtual/entry.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { t as Avatar_default } from './Avatar-BOI4zec4.mjs';
import { t as Button_default } from './Button-CoYovqJ9.mjs';
import { mergeProps, defineComponent, toRef, computed, useSSRContext } from 'vue';
import { twJoin } from 'tailwind-merge';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderSlot, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
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
import './link-apSRv82-.mjs';
import './useButtonGroup-OQHG41CY.mjs';
import './button-BNOdwSP_.mjs';
import './Link-CnaKOPmE.mjs';

//#region node_modules/@nuxt/ui/dist/runtime/ui.config/elements/alert.js
var alert_default = {
	wrapper: "w-full relative overflow-hidden",
	inner: "w-0 flex-1",
	title: "text-sm font-medium",
	description: "mt-1 text-sm leading-4 opacity-90",
	descriptionOnly: "mt-0 leading-5",
	actions: "flex items-center gap-2 mt-3 flex-shrink-0",
	shadow: "",
	rounded: "rounded-lg",
	padding: "p-4",
	gap: "gap-3",
	icon: { base: "flex-shrink-0 w-5 h-5" },
	avatar: {
		base: "flex-shrink-0 self-center",
		size: "md"
	},
	color: { white: { solid: "text-gray-900 dark:text-white bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800" } },
	variant: {
		solid: "bg-{color}-500 dark:bg-{color}-400 text-white dark:text-gray-900",
		outline: "text-{color}-500 dark:text-{color}-400 ring-1 ring-inset ring-{color}-500 dark:ring-{color}-400",
		soft: "bg-{color}-50 dark:bg-{color}-400 dark:bg-opacity-10 text-{color}-500 dark:text-{color}-400",
		subtle: "bg-{color}-50 dark:bg-{color}-400 dark:bg-opacity-10 text-{color}-500 dark:text-{color}-400 ring-1 ring-inset ring-{color}-500 dark:ring-{color}-400 ring-opacity-25 dark:ring-opacity-25"
	},
	default: {
		color: "white",
		variant: "solid",
		icon: null,
		closeButton: null,
		actionButton: {
			size: "xs",
			color: "primary",
			variant: "link"
		}
	}
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/elements/Alert.vue
var Alert_exports = /* @__PURE__ */ __exportAll({ default: () => Alert_default });
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.alert, alert_default);
var _sfc_main = defineComponent({
	components: {
		UIcon: Icon_default,
		UAvatar: Avatar_default,
		UButton: Button_default
	},
	inheritAttrs: false,
	props: {
		title: {
			type: String,
			default: null
		},
		description: {
			type: String,
			default: null
		},
		icon: {
			type: String,
			default: () => config.default.icon
		},
		avatar: {
			type: Object,
			default: null
		},
		closeButton: {
			type: Object,
			default: () => config.default.closeButton
		},
		actions: {
			type: Array,
			default: () => []
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
	emits: ["close"],
	setup(props) {
		const { ui, attrs } = useUI("alert", toRef(props, "ui"), config);
		const alertClass = computed(() => {
			const variant = ui.value.color?.[props.color]?.[props.variant] || ui.value.variant[props.variant];
			return twMerge(twJoin(ui.value.wrapper, ui.value.rounded, ui.value.shadow, ui.value.padding, variant?.replaceAll("{color}", props.color)), props.class);
		});
		function onAction(action) {
			if (action.click) action.click();
		}
		return {
			ui,
			attrs,
			alertClass,
			onAction,
			twMerge
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_UIcon = Icon_default;
	const _component_UAvatar = Avatar_default;
	const _component_UButton = Button_default;
	_push(`<div${ssrRenderAttrs(mergeProps({ class: _ctx.alertClass }, _ctx.attrs, _attrs))}><div class="${ssrRenderClass([[_ctx.ui.gap, {
		"items-start": _ctx.description || _ctx.$slots.description,
		"items-center": !_ctx.description && !_ctx.$slots.description
	}], "flex"])}">`);
	ssrRenderSlot(_ctx.$slots, "icon", { icon: _ctx.icon }, () => {
		if (_ctx.icon) _push(ssrRenderComponent(_component_UIcon, {
			name: _ctx.icon,
			class: _ctx.ui.icon.base
		}, null, _parent));
		else _push(`<!---->`);
	}, _push, _parent);
	ssrRenderSlot(_ctx.$slots, "avatar", { avatar: _ctx.avatar }, () => {
		if (_ctx.avatar) _push(ssrRenderComponent(_component_UAvatar, mergeProps({
			size: _ctx.ui.avatar.size,
			..._ctx.avatar
		}, { class: _ctx.ui.avatar.base }), null, _parent));
		else _push(`<!---->`);
	}, _push, _parent);
	_push(`<div class="${ssrRenderClass(_ctx.ui.inner)}">`);
	if (_ctx.title || _ctx.$slots.title) {
		_push(`<p class="${ssrRenderClass(_ctx.ui.title)}">`);
		ssrRenderSlot(_ctx.$slots, "title", { title: _ctx.title }, () => {
			_push(`${ssrInterpolate(_ctx.title)}`);
		}, _push, _parent);
		_push(`</p>`);
	} else _push(`<!---->`);
	if (_ctx.description || _ctx.$slots.description) {
		_push(`<div class="${ssrRenderClass(_ctx.twMerge(_ctx.ui.description, !_ctx.title && !_ctx.$slots.title && _ctx.ui.descriptionOnly))}">`);
		ssrRenderSlot(_ctx.$slots, "description", { description: _ctx.description }, () => {
			_push(`${ssrInterpolate(_ctx.description)}`);
		}, _push, _parent);
		_push(`</div>`);
	} else _push(`<!---->`);
	if ((_ctx.description || _ctx.$slots.description) && (_ctx.actions.length || _ctx.$slots.actions)) {
		_push(`<div class="${ssrRenderClass(_ctx.ui.actions)}">`);
		ssrRenderSlot(_ctx.$slots, "actions", {}, () => {
			_push(`<!--[-->`);
			ssrRenderList(_ctx.actions, (action, index) => {
				_push(ssrRenderComponent(_component_UButton, mergeProps({ key: index }, { ref_for: true }, {
					..._ctx.ui.default.actionButton || {},
					...action
				}, { onClick: ($event) => _ctx.onAction(action) }), null, _parent));
			});
			_push(`<!--]-->`);
		}, _push, _parent);
		_push(`</div>`);
	} else _push(`<!---->`);
	_push(`</div>`);
	if (_ctx.closeButton || !_ctx.description && !_ctx.$slots.description && _ctx.actions.length) {
		_push(`<div class="${ssrRenderClass(_ctx.twMerge(_ctx.ui.actions, "mt-0"))}">`);
		if (!_ctx.description && !_ctx.$slots.description && (_ctx.actions.length || _ctx.$slots.actions)) ssrRenderSlot(_ctx.$slots, "actions", {}, () => {
			_push(`<!--[-->`);
			ssrRenderList(_ctx.actions, (action, index) => {
				_push(ssrRenderComponent(_component_UButton, mergeProps({ key: index }, { ref_for: true }, {
					..._ctx.ui.default.actionButton || {},
					...action
				}, { onClick: ($event) => _ctx.onAction(action) }), null, _parent));
			});
			_push(`<!--]-->`);
		}, _push, _parent);
		else _push(`<!---->`);
		if (_ctx.closeButton) _push(ssrRenderComponent(_component_UButton, mergeProps({ "aria-label": "Close" }, {
			..._ctx.ui.default.closeButton || {},
			..._ctx.closeButton
		}, { onClick: ($event) => _ctx.$emit("close") }), null, _parent));
		else _push(`<!---->`);
		_push(`</div>`);
	} else _push(`<!---->`);
	_push(`</div></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/elements/Alert.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Alert_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UAlert" });

export { Alert_exports as n, Alert_default as t };
//# sourceMappingURL=Alert-Bv_RgsgM.mjs.map
