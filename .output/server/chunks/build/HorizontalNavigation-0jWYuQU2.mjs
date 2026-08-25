import { _ as _plugin_vue_export_helper_default, t as twMerge, m as mergeConfig, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default } from '../virtual/entry.mjs';
import { a as getULinkProps } from './link-apSRv82-.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { t as Avatar_default } from './Avatar-BOI4zec4.mjs';
import { t as Badge_default } from './Badge-Dji78drx.mjs';
import { t as Link_default } from './Link-CnaKOPmE.mjs';
import { mergeProps, withCtx, renderSlot, openBlock, createBlock, createCommentVNode, createTextVNode, toDisplayString, defineComponent, toRef, computed, useSSRContext } from 'vue';
import { twJoin } from 'tailwind-merge';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrRenderComponent, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
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
import './useButtonGroup-OQHG41CY.mjs';

//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/navigation/HorizontalNavigation.vue
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.horizontalNavigation, {
	wrapper: "relative w-full flex items-center justify-between",
	container: "flex items-center min-w-0",
	inner: "min-w-0",
	base: "group relative w-full flex items-center gap-1.5 px-2.5 py-3.5 rounded-md font-medium text-sm focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 disabled:cursor-not-allowed disabled:opacity-75",
	before: "before:absolute before:inset-x-0 before:inset-y-2 before:inset-px before:rounded-md hover:before:bg-gray-50 dark:hover:before:bg-gray-800/50",
	after: "after:absolute after:bottom-0 after:inset-x-2.5 after:block after:h-[2px] after:mt-2",
	active: "text-gray-900 dark:text-white after:bg-primary-500 dark:after:bg-primary-400 after:rounded-full",
	inactive: "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
	label: "truncate relative",
	icon: {
		base: "flex-shrink-0 w-5 h-5 relative",
		active: "text-gray-700 dark:text-gray-200",
		inactive: "text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200"
	},
	avatar: {
		base: "flex-shrink-0",
		size: "2xs"
	},
	badge: {
		base: "flex-shrink-0 ms-auto relative rounded",
		color: "gray",
		variant: "solid",
		size: "xs"
	}
});
var _sfc_main = defineComponent({
	components: {
		UIcon: Icon_default,
		UAvatar: Avatar_default,
		UBadge: Badge_default,
		ULink: Link_default
	},
	inheritAttrs: false,
	props: {
		links: {
			type: Array,
			default: () => []
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
		const { ui, attrs } = useUI("horizontalNavigation", toRef(props, "ui"), config, toRef(props, "class"));
		return {
			ui,
			attrs,
			sections: computed(() => Array.isArray(props.links[0]) ? props.links : [props.links]),
			getULinkProps,
			twMerge,
			twJoin
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_ULink = Link_default;
	const _component_UAvatar = Avatar_default;
	const _component_UIcon = Icon_default;
	const _component_UBadge = Badge_default;
	_push(`<nav${ssrRenderAttrs(mergeProps({ class: _ctx.ui.wrapper }, _ctx.attrs, _attrs))}><!--[-->`);
	ssrRenderList(_ctx.sections, (section, sectionIndex) => {
		_push(`<ul class="${ssrRenderClass(_ctx.ui.container)}"><!--[-->`);
		ssrRenderList(section, (link, index) => {
			_push(`<li class="${ssrRenderClass(_ctx.ui.inner)}">`);
			_push(ssrRenderComponent(_component_ULink, mergeProps({ ref_for: true }, _ctx.getULinkProps(link), {
				class: [
					_ctx.ui.base,
					_ctx.ui.before,
					_ctx.ui.after
				],
				"active-class": _ctx.ui.active,
				"inactive-class": _ctx.ui.inactive,
				onClick: link.click,
				onKeyup: ($event) => $event.target.blur()
			}), {
				default: withCtx(({ isActive }, _push, _parent, _scopeId) => {
					if (_push) {
						ssrRenderSlot(_ctx.$slots, "avatar", {
							link,
							isActive
						}, () => {
							if (link.avatar) _push(ssrRenderComponent(_component_UAvatar, mergeProps({ ref_for: true }, {
								size: _ctx.ui.avatar.size,
								...link.avatar
							}, { class: [_ctx.ui.avatar.base] }), null, _parent, _scopeId));
							else _push(`<!---->`);
						}, _push, _parent, _scopeId);
						ssrRenderSlot(_ctx.$slots, "icon", {
							link,
							isActive
						}, () => {
							if (link.icon) _push(ssrRenderComponent(_component_UIcon, {
								name: link.icon,
								class: _ctx.twMerge(_ctx.twJoin(_ctx.ui.icon.base, isActive ? _ctx.ui.icon.active : _ctx.ui.icon.inactive), link.iconClass)
							}, null, _parent, _scopeId));
							else _push(`<!---->`);
						}, _push, _parent, _scopeId);
						ssrRenderSlot(_ctx.$slots, "default", {
							link,
							isActive
						}, () => {
							if (link.label) {
								_push(`<span class="${ssrRenderClass(_ctx.twMerge(_ctx.ui.label, link.labelClass))}"${_scopeId}>`);
								if (isActive) _push(`<span class="sr-only"${_scopeId}> Current page: </span>`);
								else _push(`<!---->`);
								_push(` ${ssrInterpolate(link.label)}</span>`);
							} else _push(`<!---->`);
						}, _push, _parent, _scopeId);
						ssrRenderSlot(_ctx.$slots, "badge", {
							link,
							isActive
						}, () => {
							if (link.badge) _push(ssrRenderComponent(_component_UBadge, mergeProps({ ref_for: true }, {
								size: _ctx.ui.badge.size,
								color: _ctx.ui.badge.color,
								variant: _ctx.ui.badge.variant,
								...typeof link.badge === "string" || typeof link.badge === "number" ? { label: link.badge } : link.badge
							}, { class: _ctx.ui.badge.base }), null, _parent, _scopeId));
							else _push(`<!---->`);
						}, _push, _parent, _scopeId);
					} else return [
						renderSlot(_ctx.$slots, "avatar", {
							link,
							isActive
						}, () => [link.avatar ? (openBlock(), createBlock(_component_UAvatar, mergeProps({
							key: 0,
							ref_for: true
						}, {
							size: _ctx.ui.avatar.size,
							...link.avatar
						}, { class: [_ctx.ui.avatar.base] }), null, 16, ["class"])) : createCommentVNode("", true)]),
						renderSlot(_ctx.$slots, "icon", {
							link,
							isActive
						}, () => [link.icon ? (openBlock(), createBlock(_component_UIcon, {
							key: 0,
							name: link.icon,
							class: _ctx.twMerge(_ctx.twJoin(_ctx.ui.icon.base, isActive ? _ctx.ui.icon.active : _ctx.ui.icon.inactive), link.iconClass)
						}, null, 8, ["name", "class"])) : createCommentVNode("", true)]),
						renderSlot(_ctx.$slots, "default", {
							link,
							isActive
						}, () => [link.label ? (openBlock(), createBlock("span", {
							key: 0,
							class: _ctx.twMerge(_ctx.ui.label, link.labelClass)
						}, [isActive ? (openBlock(), createBlock("span", {
							key: 0,
							class: "sr-only"
						}, " Current page: ")) : createCommentVNode("", true), createTextVNode(" " + toDisplayString(link.label), 1)], 2)) : createCommentVNode("", true)]),
						renderSlot(_ctx.$slots, "badge", {
							link,
							isActive
						}, () => [link.badge ? (openBlock(), createBlock(_component_UBadge, mergeProps({
							key: 0,
							ref_for: true
						}, {
							size: _ctx.ui.badge.size,
							color: _ctx.ui.badge.color,
							variant: _ctx.ui.badge.variant,
							...typeof link.badge === "string" || typeof link.badge === "number" ? { label: link.badge } : link.badge
						}, { class: _ctx.ui.badge.base }), null, 16, ["class"])) : createCommentVNode("", true)])
					];
				}),
				_: 2
			}, _parent));
			_push(`</li>`);
		});
		_push(`<!--]--></ul>`);
	});
	_push(`<!--]--></nav>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/navigation/HorizontalNavigation.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var HorizontalNavigation_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UHorizontalNavigation" });

export { HorizontalNavigation_default as default };
//# sourceMappingURL=HorizontalNavigation-0jWYuQU2.mjs.map
