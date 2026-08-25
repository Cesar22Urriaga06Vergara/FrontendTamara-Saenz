import { _ as _plugin_vue_export_helper_default, t as twMerge, m as mergeConfig, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default } from '../virtual/entry.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { createVNode, resolveDynamicComponent, mergeProps, defineComponent, toRef, computed, useSSRContext } from 'vue';
import { twJoin } from 'tailwind-merge';
import { ssrRenderVNode } from 'vue/server-renderer';
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

//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/layout/Skeleton.vue
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.skeleton, {
	base: "animate-pulse",
	background: "bg-gray-100 dark:bg-gray-800",
	rounded: "rounded-md"
});
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
		const { ui, attrs } = useUI("skeleton", toRef(props, "ui"), config);
		return {
			ui,
			attrs,
			skeletonClass: computed(() => {
				return twMerge(twJoin(ui.value.base, ui.value.background, ui.value.rounded), props.class);
			})
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	ssrRenderVNode(_push, createVNode(resolveDynamicComponent(_ctx.as), mergeProps({ class: _ctx.skeletonClass }, _ctx.attrs, _attrs), null), _parent);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/layout/Skeleton.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Skeleton_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "USkeleton" });

export { Skeleton_default as default };
//# sourceMappingURL=Skeleton-MXMq0Awg.mjs.map
