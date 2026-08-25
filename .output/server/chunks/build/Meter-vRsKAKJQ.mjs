import { _ as _plugin_vue_export_helper_default, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default, m as mergeConfig } from '../virtual/entry.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { m as meter_default } from './meter-B-Wii5Ce.mjs';
import { mergeProps, defineComponent, toRef, computed, useSSRContext } from 'vue';
import { twJoin } from 'tailwind-merge';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderClass, ssrRenderStyle, ssrInterpolate, ssrRenderAttr, ssrRenderComponent } from 'vue/server-renderer';
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

//#region node_modules/@nuxt/ui/dist/runtime/components/elements/Meter.vue
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.meter, meter_default);
var _sfc_main = defineComponent({
	components: { UIcon: Icon_default },
	inheritAttrs: false,
	props: {
		value: {
			type: Number,
			default: 0
		},
		min: {
			type: Number,
			default: 0
		},
		max: {
			type: Number,
			default: 100
		},
		indicator: {
			type: Boolean,
			default: false
		},
		label: {
			type: String,
			default: null
		},
		size: {
			type: String,
			default: () => config.default.size,
			validator(value) {
				return Object.keys(config.meter.size).includes(value);
			}
		},
		color: {
			type: String,
			default: () => config.default.color,
			validator(value) {
				return [...virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.colors, ...Object.keys(config.color)].includes(value);
			}
		},
		icon: {
			type: String,
			default: null
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
	slots: Object,
	setup(props) {
		const { ui, attrs } = useUI("meter", toRef(props, "ui"), config, toRef(props, "class"));
		function clampPercent(value, min, max) {
			if (min == max) return value < min ? 0 : 100;
			if (min > max) max = [min, min = max][0];
			const percent2 = (value - min) / (max - min) * 100;
			return Math.max(0, Math.min(100, percent2));
		}
		const indicatorContainerClass = computed(() => {
			return twJoin(ui.value.indicator.container);
		});
		const indicatorClass = computed(() => {
			return twJoin(ui.value.indicator.text, ui.value.indicator.size[props.size]);
		});
		const meterClass = computed(() => {
			return twJoin(ui.value.meter.base, ui.value.meter.background, ui.value.meter.ring, ui.value.meter.rounded, ui.value.meter.shadow, ui.value.color[props.color] ?? ui.value.meter.color.replaceAll("{color}", props.color), ui.value.meter.size[props.size]);
		});
		const meterAppearanceClass = computed(() => {
			return twJoin(ui.value.meter.appearance.inner, ui.value.meter.appearance.meter, ui.value.meter.appearance.bar, ui.value.meter.appearance.value);
		});
		const meterBarClass = computed(() => {
			return twJoin(ui.value.meter.bar.transition, ui.value.meter.bar.ring, ui.value.meter.bar.rounded, ui.value.meter.bar.size[props.size]);
		});
		const labelClass = computed(() => {
			return twJoin(ui.value.label.base, ui.value.label.text, ui.value.color[props.color] ?? ui.value.label.color.replaceAll("{color}", props.color), ui.value.label.size[props.size]);
		});
		const normalizedMin = computed(() => props.min > props.max ? props.max : props.min);
		const normalizedMax = computed(() => props.max < props.min ? props.min : props.max);
		return {
			ui,
			attrs,
			indicatorContainerClass,
			indicatorClass,
			meterClass,
			meterAppearanceClass,
			meterBarClass,
			labelClass,
			normalizedMin,
			normalizedMax,
			percent: computed(() => clampPercent(Number(props.value), normalizedMin.value, normalizedMax.value))
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_UIcon = Icon_default;
	_push(`<div${ssrRenderAttrs(mergeProps({ class: _ctx.ui.wrapper }, _ctx.attrs, _attrs))}>`);
	if (_ctx.indicator || _ctx.$slots.indicator) ssrRenderSlot(_ctx.$slots, "indicator", {
		percent: _ctx.percent,
		value: _ctx.value
	}, () => {
		_push(`<div class="${ssrRenderClass(_ctx.indicatorContainerClass)}" style="${ssrRenderStyle({ width: `${_ctx.percent}%` })}"><div class="${ssrRenderClass(_ctx.indicatorClass)}">${ssrInterpolate(Math.round(_ctx.percent))}% </div></div>`);
	}, _push, _parent);
	else _push(`<!---->`);
	_push(`<meter${ssrRenderAttr("value", _ctx.value)}${ssrRenderAttr("min", _ctx.normalizedMin)}${ssrRenderAttr("max", _ctx.normalizedMax)} class="${ssrRenderClass([
		_ctx.meterClass,
		_ctx.meterAppearanceClass,
		_ctx.meterBarClass
	])}"></meter>`);
	if (_ctx.label || _ctx.$slots.label) ssrRenderSlot(_ctx.$slots, "label", {
		percent: _ctx.percent,
		value: _ctx.value
	}, () => {
		_push(`<div class="${ssrRenderClass(_ctx.labelClass)}">`);
		if (_ctx.icon) _push(ssrRenderComponent(_component_UIcon, { name: _ctx.icon }, null, _parent));
		else _push(`<!---->`);
		_push(` ${ssrInterpolate(_ctx.label)}</div>`);
	}, _push, _parent);
	else _push(`<!---->`);
	_push(`</div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/elements/Meter.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Meter_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UMeter" });

export { Meter_default as default };
//# sourceMappingURL=Meter-vRsKAKJQ.mjs.map
