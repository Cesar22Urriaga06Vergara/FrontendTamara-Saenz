import { c as __exportAll, _ as _plugin_vue_export_helper_default, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default, m as mergeConfig } from '../virtual/entry.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { mergeProps, defineComponent, toRef, computed, useSSRContext } from 'vue';
import { twJoin } from 'tailwind-merge';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderClass, ssrRenderStyle, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
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

//#region node_modules/@nuxt/ui/dist/runtime/ui.config/elements/progress.js
var progress_default = {
	wrapper: "w-full flex flex-col gap-2",
	indicator: {
		container: {
			base: "flex flex-row justify-end",
			width: "min-w-fit",
			transition: "transition-all"
		},
		align: "text-end",
		width: "w-fit",
		color: "text-gray-400 dark:text-gray-500",
		size: {
			"2xs": "text-xs",
			"xs": "text-xs",
			"sm": "text-sm",
			"md": "text-sm",
			"lg": "text-sm",
			"xl": "text-base",
			"2xl": "text-base"
		}
	},
	progress: {
		base: "block appearance-none border-none overflow-hidden",
		width: "w-full [&::-webkit-progress-bar]:w-full",
		size: {
			"2xs": "h-px",
			"xs": "h-0.5",
			"sm": "h-1",
			"md": "h-2",
			"lg": "h-3",
			"xl": "h-4",
			"2xl": "h-5"
		},
		rounded: "rounded-full [&::-webkit-progress-bar]:rounded-full",
		track: "[&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-bar]:dark:bg-gray-700 [@supports(selector(&::-moz-progress-bar))]:bg-gray-200 [@supports(selector(&::-moz-progress-bar))]:dark:bg-gray-700",
		bar: "[&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:ease-in-out [&::-moz-progress-bar]:rounded-full",
		color: "text-{color}-500 dark:text-{color}-400",
		background: "[&::-webkit-progress-value]:bg-current [&::-moz-progress-bar]:bg-current",
		indeterminate: {
			base: "indeterminate:relative",
			rounded: "indeterminate:after:rounded-full [&:indeterminate::-webkit-progress-value]:rounded-full [&:indeterminate::-moz-progress-bar]:rounded-full"
		}
	},
	steps: {
		base: "grid grid-cols-1",
		color: "text-{color}-500 dark:text-{color}-400",
		size: {
			"2xs": "text-xs",
			"xs": "text-xs",
			"sm": "text-sm",
			"md": "text-sm",
			"lg": "text-sm",
			"xl": "text-base",
			"2xl": "text-base"
		}
	},
	step: {
		base: "transition-all opacity-0 truncate row-start-1 col-start-1",
		align: "text-end",
		active: "opacity-100",
		first: "text-gray-500 dark:text-gray-400"
	},
	animation: {
		"carousel": "bar-animation-carousel",
		"carousel-inverse": "bar-animation-carousel-inverse",
		"swing": "bar-animation-swing",
		"elastic": "bar-animation-elastic"
	},
	default: {
		color: "primary",
		size: "md",
		animation: "carousel"
	}
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/elements/Progress.vue
var Progress_exports = /* @__PURE__ */ __exportAll({ default: () => Progress_default });
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.progress, progress_default);
var _sfc_main = defineComponent({
	inheritAttrs: false,
	props: {
		value: {
			type: Number,
			default: null
		},
		max: {
			type: [Number, Array],
			default: 100
		},
		indicator: {
			type: Boolean,
			default: false
		},
		animation: {
			type: String,
			default: () => config.default.animation,
			validator(value) {
				return Object.keys(config.animation).includes(value);
			}
		},
		size: {
			type: String,
			default: () => config.default.size,
			validator(value) {
				return Object.keys(config.progress.size).includes(value);
			}
		},
		color: {
			type: String,
			default: () => config.default.color,
			validator(value) {
				return virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.colors.includes(value);
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
	setup(props) {
		const { ui, attrs } = useUI("progress", toRef(props, "ui"), config, toRef(props, "class"));
		const indicatorContainerClass = computed(() => {
			return twJoin(ui.value.indicator.container.base, ui.value.indicator.container.width, ui.value.indicator.container.transition);
		});
		const indicatorClass = computed(() => {
			return twJoin(ui.value.indicator.align, ui.value.indicator.width, ui.value.indicator.color, ui.value.indicator.size[props.size]);
		});
		const progressClass = computed(() => {
			const classes = [
				ui.value.progress.base,
				ui.value.progress.width,
				ui.value.progress.size[props.size],
				ui.value.progress.rounded,
				ui.value.progress.track,
				ui.value.progress.bar,
				ui.value.progress.color?.replaceAll("{color}", props.color),
				ui.value.progress.background,
				ui.value.progress.indeterminate.base,
				ui.value.progress.indeterminate.rounded
			];
			if (isIndeterminate.value) classes.push(ui.value.animation[props.animation]);
			return twJoin(...classes);
		});
		const stepsClass = computed(() => {
			return twJoin(ui.value.steps.base, ui.value.steps.color?.replaceAll("{color}", props.color), ui.value.steps.size[props.size]);
		});
		const stepClass = computed(() => {
			return twJoin(ui.value.step.base, ui.value.step.align);
		});
		const stepActiveClass = computed(() => {
			return twJoin(ui.value.step.active);
		});
		const stepFirstClass = computed(() => {
			return twJoin(ui.value.step.first);
		});
		function isActive(index) {
			return index === Number(props.value);
		}
		function isFirst(index) {
			return index === 0;
		}
		function stepClasses(index) {
			index = Number(index);
			const classes = [stepClass.value];
			if (isFirst(index)) classes.push(stepFirstClass.value);
			if (isActive(index)) classes.push(stepActiveClass.value);
			return classes.join(" ");
		}
		const isIndeterminate = computed(() => props.value === void 0 || props.value === null);
		const isSteps = computed(() => Array.isArray(props.max));
		const realMax = computed(() => {
			if (isIndeterminate.value) return null;
			if (Array.isArray(props.max)) return props.max.length - 1;
			return Number(props.max);
		});
		return {
			ui,
			attrs,
			indicatorContainerClass,
			indicatorClass,
			progressClass,
			stepsClass,
			stepClasses,
			isIndeterminate,
			isSteps,
			realMax,
			percent: computed(() => {
				if (isIndeterminate.value) return;
				switch (true) {
					case props.value < 0: return 0;
					case props.value > realMax.value: return 100;
					default: return props.value / realMax.value * 100;
				}
			})
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(mergeProps({
		class: _ctx.ui.wrapper,
		role: "progressbar"
	}, _attrs))} data-v-e0a22531>`);
	if (_ctx.indicator || _ctx.$slots.indicator) ssrRenderSlot(_ctx.$slots, "indicator", { percent: _ctx.percent }, () => {
		if (!_ctx.isSteps) _push(`<div class="${ssrRenderClass(_ctx.indicatorContainerClass)}" style="${ssrRenderStyle({ width: `${_ctx.percent}%` })}" data-v-e0a22531><div class="${ssrRenderClass(_ctx.indicatorClass)}" data-v-e0a22531>${ssrInterpolate(Math.round(_ctx.percent))}% </div></div>`);
		else _push(`<!---->`);
	}, _push, _parent);
	else _push(`<!---->`);
	_push(`<progress${ssrRenderAttrs(mergeProps({
		"aria-valuemax": _ctx.realMax,
		"aria-valuenow": _ctx.value,
		class: _ctx.progressClass
	}, {
		value: _ctx.value,
		max: _ctx.realMax,
		..._ctx.attrs
	}))} data-v-e0a22531>${ssrInterpolate(_ctx.percent !== void 0 ? `${Math.round(_ctx.percent)}%` : void 0)}</progress>`);
	if (_ctx.isSteps) {
		_push(`<div class="${ssrRenderClass(_ctx.stepsClass)}" data-v-e0a22531><!--[-->`);
		ssrRenderList(_ctx.max, (step, index) => {
			_push(`<div class="${ssrRenderClass(_ctx.stepClasses(index))}" data-v-e0a22531>`);
			ssrRenderSlot(_ctx.$slots, `step-${index}`, mergeProps({ ref_for: true }, { step }), () => {
				_push(`${ssrInterpolate(step)}`);
			}, _push, _parent);
			_push(`</div>`);
		});
		_push(`<!--]--></div>`);
	} else _push(`<!---->`);
	_push(`</div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/elements/Progress.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Progress_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-e0a22531"]]), { __name: "UProgress" });

export { Progress_exports as n, Progress_default as t };
//# sourceMappingURL=Progress-DTxdHI_T.mjs.map
