import { _ as _plugin_vue_export_helper_default, m as mergeConfig, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default } from '../virtual/entry.mjs';
import { u as useUI, e as tooltip_default } from './ui.config-2s_B03nh.mjs';
import { t as Kbd_default } from './Kbd-rjcREfaE.mjs';
import { u as usePopper } from './usePopper-BCEqNZ_Z.mjs';
import { mergeProps, withCtx, createTextVNode, toDisplayString, defineComponent, toRef, computed, ref, useSlots, useSSRContext } from 'vue';
import { n as defu } from '../_/nitro.mjs';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
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
import '@vueuse/core';
import 'tailwind-merge';
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

//#region node_modules/@nuxt/ui/dist/runtime/components/overlays/Tooltip.vue
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.tooltip, tooltip_default);
var _sfc_main = defineComponent({
	components: { UKbd: Kbd_default },
	inheritAttrs: false,
	props: {
		text: {
			type: String,
			default: null
		},
		prevent: {
			type: Boolean,
			default: false
		},
		shortcuts: {
			type: Array,
			default: () => []
		},
		openDelay: {
			type: Number,
			default: () => config.default.openDelay
		},
		closeDelay: {
			type: Number,
			default: () => config.default.closeDelay
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
	setup(props) {
		const { ui, attrs } = useUI("tooltip", toRef(props, "ui"), config, toRef(props, "class"));
		const popper = computed(() => defu({}, props.popper, ui.value.popper));
		const [trigger, container] = usePopper(popper.value);
		const open = ref(false);
		let openTimeout = null;
		let closeTimeout = null;
		const isVisible = computed(() => !!(useSlots().text || props.text));
		function onMouseEnter() {
			if (closeTimeout) {
				clearTimeout(closeTimeout);
				closeTimeout = null;
			}
			if (open.value) return;
			openTimeout = openTimeout || setTimeout(() => {
				open.value = true;
				openTimeout = null;
			}, props.openDelay);
		}
		function onMouseLeave() {
			if (openTimeout) {
				clearTimeout(openTimeout);
				openTimeout = null;
			}
			if (!open.value) return;
			closeTimeout = closeTimeout || setTimeout(() => {
				open.value = false;
				closeTimeout = null;
			}, props.closeDelay);
		}
		return {
			ui,
			attrs,
			popper,
			trigger,
			container,
			open,
			onMouseEnter,
			onMouseLeave,
			isVisible
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_UKbd = Kbd_default;
	_push(`<div${ssrRenderAttrs(mergeProps({
		ref: "trigger",
		class: _ctx.ui.wrapper
	}, _ctx.attrs, _attrs))}>`);
	ssrRenderSlot(_ctx.$slots, "default", { open: _ctx.open }, () => {
		_push(` Hover `);
	}, _push, _parent);
	if (_ctx.open && !_ctx.prevent && _ctx.isVisible) {
		_push(`<div class="${ssrRenderClass([_ctx.ui.container, _ctx.ui.width])}"><template><div>`);
		if (_ctx.popper.arrow) _push(`<div data-popper-arrow class="${ssrRenderClass(Object.values(_ctx.ui.arrow))}"></div>`);
		else _push(`<!---->`);
		_push(`<div class="${ssrRenderClass([
			_ctx.ui.base,
			_ctx.ui.background,
			_ctx.ui.color,
			_ctx.ui.rounded,
			_ctx.ui.shadow,
			_ctx.ui.ring
		])}">`);
		ssrRenderSlot(_ctx.$slots, "text", {}, () => {
			_push(`${ssrInterpolate(_ctx.text)}`);
		}, _push, _parent);
		if (_ctx.shortcuts?.length) {
			_push(`<span class="${ssrRenderClass(_ctx.ui.shortcuts)}"><span class="${ssrRenderClass(_ctx.ui.middot)}">·</span><!--[-->`);
			ssrRenderList(_ctx.shortcuts, (shortcut) => {
				_push(ssrRenderComponent(_component_UKbd, {
					key: shortcut,
					size: "xs"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`${ssrInterpolate(shortcut)}`);
						else return [createTextVNode(toDisplayString(shortcut), 1)];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></span>`);
		} else _push(`<!---->`);
		_push(`</div></div></template></div>`);
	} else _push(`<!---->`);
	_push(`</div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/overlays/Tooltip.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Tooltip_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UTooltip" });

export { Tooltip_default as default };
//# sourceMappingURL=Tooltip-D2LljNai.mjs.map
