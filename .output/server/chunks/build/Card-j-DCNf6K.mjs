import { c as __exportAll, _ as _plugin_vue_export_helper_default, t as twMerge, m as mergeConfig, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default } from '../virtual/entry.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { createVNode, resolveDynamicComponent, mergeProps, withCtx, openBlock, createBlock, renderSlot, createCommentVNode, defineComponent, toRef, computed, useSSRContext } from 'vue';
import { twJoin } from 'tailwind-merge';
import { ssrRenderVNode, ssrRenderClass, ssrRenderSlot } from 'vue/server-renderer';
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

//#region node_modules/@nuxt/ui/dist/runtime/ui.config/layout/card.js
var card_default = {
	base: "",
	background: "bg-white dark:bg-gray-900",
	divide: "divide-y divide-gray-200 dark:divide-gray-800",
	ring: "ring-1 ring-gray-200 dark:ring-gray-800",
	rounded: "rounded-lg",
	shadow: "shadow",
	body: {
		base: "",
		background: "",
		padding: "px-4 py-5 sm:p-6"
	},
	header: {
		base: "",
		background: "",
		padding: "px-4 py-5 sm:px-6"
	},
	footer: {
		base: "",
		background: "",
		padding: "px-4 py-4 sm:px-6"
	}
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/layout/Card.vue
var Card_exports = /* @__PURE__ */ __exportAll({ default: () => Card_default });
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.card, card_default);
var _sfc_main = defineComponent({
	inheritAttrs: false,
	props: {
		as: {
			type: String,
			default: "div"
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
		const { ui, attrs } = useUI("card", toRef(props, "ui"), config);
		return {
			ui,
			attrs,
			cardClass: computed(() => {
				return twMerge(twJoin(ui.value.base, ui.value.rounded, ui.value.divide, ui.value.ring, ui.value.shadow, ui.value.background), props.class);
			})
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	ssrRenderVNode(_push, createVNode(resolveDynamicComponent(_ctx.$attrs.onSubmit ? "form" : _ctx.as), mergeProps({ class: _ctx.cardClass }, _ctx.attrs, _attrs), {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) {
				if (_ctx.$slots.header) {
					_push(`<div class="${ssrRenderClass([
						_ctx.ui.header.base,
						_ctx.ui.header.padding,
						_ctx.ui.header.background
					])}"${_scopeId}>`);
					ssrRenderSlot(_ctx.$slots, "header", {}, null, _push, _parent, _scopeId);
					_push(`</div>`);
				} else _push(`<!---->`);
				if (_ctx.$slots.default) {
					_push(`<div class="${ssrRenderClass([
						_ctx.ui.body.base,
						_ctx.ui.body.padding,
						_ctx.ui.body.background
					])}"${_scopeId}>`);
					ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
					_push(`</div>`);
				} else _push(`<!---->`);
				if (_ctx.$slots.footer) {
					_push(`<div class="${ssrRenderClass([
						_ctx.ui.footer.base,
						_ctx.ui.footer.padding,
						_ctx.ui.footer.background
					])}"${_scopeId}>`);
					ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push, _parent, _scopeId);
					_push(`</div>`);
				} else _push(`<!---->`);
			} else return [
				_ctx.$slots.header ? (openBlock(), createBlock("div", {
					key: 0,
					class: [
						_ctx.ui.header.base,
						_ctx.ui.header.padding,
						_ctx.ui.header.background
					]
				}, [renderSlot(_ctx.$slots, "header")], 2)) : createCommentVNode("", true),
				_ctx.$slots.default ? (openBlock(), createBlock("div", {
					key: 1,
					class: [
						_ctx.ui.body.base,
						_ctx.ui.body.padding,
						_ctx.ui.body.background
					]
				}, [renderSlot(_ctx.$slots, "default")], 2)) : createCommentVNode("", true),
				_ctx.$slots.footer ? (openBlock(), createBlock("div", {
					key: 2,
					class: [
						_ctx.ui.footer.base,
						_ctx.ui.footer.padding,
						_ctx.ui.footer.background
					]
				}, [renderSlot(_ctx.$slots, "footer")], 2)) : createCommentVNode("", true)
			];
		}),
		_: 3
	}), _parent);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/layout/Card.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Card_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UCard" });

export { Card_exports as n, Card_default as t };
//# sourceMappingURL=Card-j-DCNf6K.mjs.map
