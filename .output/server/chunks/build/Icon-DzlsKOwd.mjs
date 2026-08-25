import { c as __exportAll, _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { t as components_default } from './components-CzgPFaUd.mjs';
import { mergeProps, defineComponent, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
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
import 'tailwind-merge';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';

//#region node_modules/@nuxt/ui/dist/runtime/components/elements/Icon.vue
var Icon_exports = /* @__PURE__ */ __exportAll({ default: () => Icon_default });
var _sfc_main = defineComponent({ props: {
	name: {
		type: String,
		required: true
	},
	mode: {
		type: String,
		required: false,
		default: null
	},
	size: {
		type: [Number, String],
		required: false,
		default: null
	},
	customize: {
		type: Function,
		required: false,
		default: null
	}
} });
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(ssrRenderComponent(components_default, mergeProps(_ctx.$props, _attrs), null, _parent));
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/elements/Icon.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Icon_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UIcon" });

export { Icon_exports as n, Icon_default as t };
//# sourceMappingURL=Icon-DzlsKOwd.mjs.map
