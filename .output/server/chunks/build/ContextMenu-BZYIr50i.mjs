import { _ as _plugin_vue_export_helper_default, t as twMerge, m as mergeConfig, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default } from '../virtual/entry.mjs';
import { u as useUI, c as arrow } from './ui.config-2s_B03nh.mjs';
import { u as usePopper } from './usePopper-BCEqNZ_Z.mjs';
import { mergeProps, defineComponent, toRef, computed, useSSRContext } from 'vue';
import { n as defu } from '../_/nitro.mjs';
import { onClickOutside } from '@vueuse/core';
import { twJoin } from 'tailwind-merge';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderSlot } from 'vue/server-renderer';
import 'nostics';
import 'nostics/formatters/ansi';
import '@vue/shared';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@iconify/vue';
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

//#region node_modules/@nuxt/ui/dist/runtime/ui.config/overlays/contextMenu.js
var contextMenu_default = {
	wrapper: "relative",
	container: "z-20 group",
	width: "",
	background: "bg-white dark:bg-gray-900",
	shadow: "shadow-lg",
	rounded: "rounded-md",
	ring: "ring-1 ring-gray-200 dark:ring-gray-800",
	base: "overflow-hidden focus:outline-none relative",
	transition: {
		enterActiveClass: "transition ease-out duration-200",
		enterFromClass: "opacity-0 translate-y-1",
		enterToClass: "opacity-100 translate-y-0",
		leaveActiveClass: "transition ease-in duration-150",
		leaveFromClass: "opacity-100 translate-y-0",
		leaveToClass: "opacity-0 translate-y-1"
	},
	popper: {
		placement: "bottom-start",
		scroll: false
	},
	arrow
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/overlays/ContextMenu.vue
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.contextMenu, contextMenu_default);
var _sfc_main = defineComponent({
	inheritAttrs: false,
	props: {
		modelValue: {
			type: Boolean,
			default: false
		},
		virtualElement: {
			type: Object,
			required: true
		},
		popper: {
			type: Object,
			default: () => ({})
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
	emits: ["update:modelValue", "close"],
	setup(props, { emit }) {
		const { ui, attrs } = useUI("contextMenu", toRef(props, "ui"), config);
		const popper = computed(() => defu({}, props.popper, ui.value.popper));
		const isOpen = computed({
			get() {
				return props.modelValue;
			},
			set(value) {
				emit("update:modelValue", value);
			}
		});
		toRef(props, "virtualElement");
		const [, container] = usePopper(popper.value);
		const wrapperClass = computed(() => {
			return twMerge(twJoin(ui.value.container, ui.value.width), props.class);
		});
		onClickOutside(container, () => {
			isOpen.value = false;
		});
		return {
			ui,
			attrs,
			isOpen,
			wrapperClass,
			popper,
			container
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	if (_ctx.isOpen) {
		_push(`<div${ssrRenderAttrs(mergeProps({
			ref: "container",
			class: _ctx.wrapperClass
		}, _ctx.attrs, _attrs))}><template><div>`);
		if (_ctx.popper.arrow) _push(`<div data-popper-arrow class="${ssrRenderClass(Object.values(_ctx.ui.arrow))}"></div>`);
		else _push(`<!---->`);
		_push(`<div class="${ssrRenderClass([
			_ctx.ui.base,
			_ctx.ui.ring,
			_ctx.ui.rounded,
			_ctx.ui.shadow,
			_ctx.ui.background
		])}">`);
		ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
		_push(`</div></div></template></div>`);
	} else _push(`<!---->`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/overlays/ContextMenu.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var ContextMenu_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UContextMenu" });

export { ContextMenu_default as default };
//# sourceMappingURL=ContextMenu-BZYIr50i.mjs.map
