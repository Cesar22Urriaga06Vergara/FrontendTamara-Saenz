import { _ as _plugin_vue_export_helper_default, t as twMerge, m as mergeConfig, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default } from '../virtual/entry.mjs';
import { a as getULinkProps } from './link-apSRv82-.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { t as Link_default } from './Link-CnaKOPmE.mjs';
import { mergeProps, withCtx, renderSlot, openBlock, createBlock, createCommentVNode, toDisplayString, defineComponent, toRef, useSSRContext } from 'vue';
import { twJoin } from 'tailwind-merge';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrRenderComponent, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
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

//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/navigation/Breadcrumb.vue
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.breadcrumb, {
	wrapper: "relative min-w-0",
	ol: "flex items-center gap-x-1.5",
	li: "flex items-center gap-x-1.5 text-gray-500 dark:text-gray-400 text-sm leading-6 min-w-0",
	base: "flex items-center gap-x-1.5 group font-semibold min-w-0",
	label: "block truncate",
	icon: {
		base: "flex-shrink-0 w-5 h-5",
		active: "",
		inactive: ""
	},
	divider: { base: "flex-shrink-0 w-5 h-5 rtl:rotate-180" },
	active: "text-primary-500 dark:text-primary-400",
	inactive: " hover:text-gray-700 dark:hover:text-gray-200",
	default: { divider: "i-heroicons-chevron-right-20-solid" }
});
var _sfc_main = defineComponent({
	components: {
		UIcon: Icon_default,
		ULink: Link_default
	},
	inheritAttrs: false,
	props: {
		links: {
			type: Array,
			default: () => []
		},
		divider: {
			type: String,
			default: () => config.default.divider
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
		const { ui, attrs } = useUI("breadcrumb", toRef(props, "ui"), config, toRef(props, "class"));
		return {
			ui,
			attrs,
			getULinkProps,
			twMerge,
			twJoin
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_ULink = Link_default;
	const _component_UIcon = Icon_default;
	_push(`<nav${ssrRenderAttrs(mergeProps({
		"aria-label": "Breadcrumb",
		class: _ctx.ui.wrapper
	}, _ctx.attrs, _attrs))}><ol class="${ssrRenderClass(_ctx.ui.ol)}"><!--[-->`);
	ssrRenderList(_ctx.links, (link, index) => {
		_push(`<li class="${ssrRenderClass(_ctx.ui.li)}">`);
		_push(ssrRenderComponent(_component_ULink, mergeProps({
			as: "span",
			class: [_ctx.ui.base, index === _ctx.links.length - 1 ? _ctx.ui.active : !!link.to ? _ctx.ui.inactive : ""],
			"aria-current": index === _ctx.links.length - 1 ? "page" : void 0
		}, { ref_for: true }, _ctx.getULinkProps(link), { onClick: link.click }), {
			default: withCtx((_, _push, _parent, _scopeId) => {
				if (_push) {
					ssrRenderSlot(_ctx.$slots, "icon", {
						link,
						index,
						isActive: index === _ctx.links.length - 1
					}, () => {
						if (link.icon) _push(ssrRenderComponent(_component_UIcon, {
							name: link.icon,
							class: _ctx.twMerge(_ctx.twJoin(_ctx.ui.icon.base, index === _ctx.links.length - 1 ? _ctx.ui.icon.active : !!link.to ? _ctx.ui.icon.inactive : ""), link.iconClass)
						}, null, _parent, _scopeId));
						else _push(`<!---->`);
					}, _push, _parent, _scopeId);
					ssrRenderSlot(_ctx.$slots, "default", {
						link,
						index,
						isActive: index === _ctx.links.length - 1
					}, () => {
						if (link.label) _push(`<span class="${ssrRenderClass(_ctx.twMerge(_ctx.ui.label, link.labelClass))}"${_scopeId}>${ssrInterpolate(link.label)}</span>`);
						else _push(`<!---->`);
					}, _push, _parent, _scopeId);
				} else return [renderSlot(_ctx.$slots, "icon", {
					link,
					index,
					isActive: index === _ctx.links.length - 1
				}, () => [link.icon ? (openBlock(), createBlock(_component_UIcon, {
					key: 0,
					name: link.icon,
					class: _ctx.twMerge(_ctx.twJoin(_ctx.ui.icon.base, index === _ctx.links.length - 1 ? _ctx.ui.icon.active : !!link.to ? _ctx.ui.icon.inactive : ""), link.iconClass)
				}, null, 8, ["name", "class"])) : createCommentVNode("", true)]), renderSlot(_ctx.$slots, "default", {
					link,
					index,
					isActive: index === _ctx.links.length - 1
				}, () => [link.label ? (openBlock(), createBlock("span", {
					key: 0,
					class: _ctx.twMerge(_ctx.ui.label, link.labelClass)
				}, toDisplayString(link.label), 3)) : createCommentVNode("", true)])];
			}),
			_: 2
		}, _parent));
		if (index < _ctx.links.length - 1) ssrRenderSlot(_ctx.$slots, "divider", {}, () => {
			if (_ctx.divider) {
				_push(`<!--[-->`);
				if (_ctx.divider.startsWith("i-")) _push(ssrRenderComponent(_component_UIcon, {
					name: _ctx.divider,
					class: _ctx.ui.divider.base,
					role: "presentation"
				}, null, _parent));
				else _push(`<span role="presentation">${ssrInterpolate(_ctx.divider)}</span>`);
				_push(`<!--]-->`);
			} else _push(`<!---->`);
		}, _push, _parent);
		else _push(`<!---->`);
		_push(`</li>`);
	});
	_push(`<!--]--></ol></nav>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/navigation/Breadcrumb.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Breadcrumb_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UBreadcrumb" });

export { Breadcrumb_default as default };
//# sourceMappingURL=Breadcrumb-B-LOLV9l.mjs.map
