import { j as getSlotsChildren, m as mergeConfig, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default } from '../virtual/entry.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { m as meter_default } from './meter-B-Wii5Ce.mjs';
import { defineComponent, toRef, computed, cloneVNode, h } from 'vue';
import { twJoin } from 'tailwind-merge';
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
import 'vue/server-renderer';
import 'devalue';
import '@vueuse/core';
import '@iconify/vue';
import './components-CzgPFaUd.mjs';
import '@iconify/utils/lib/css/icon';

//#region node_modules/@nuxt/ui/dist/runtime/ui.config/elements/meterGroup.js
var meterGroup_default = {
	wrapper: "flex flex-col gap-2 w-full",
	base: "flex flex-row flex-nowrap flex-shrink overflow-hidden",
	background: "bg-gray-200 dark:bg-gray-700",
	transition: "transition-all",
	rounded: "rounded-full",
	shadow: "",
	list: "list-disc list-inside",
	orientation: {
		"rounded-none": {
			left: "rounded-s-none",
			right: "rounded-e-none"
		},
		"rounded-sm": {
			left: "rounded-s-sm",
			right: "rounded-e-sm"
		},
		"rounded": {
			left: "rounded-s",
			right: "rounded-e"
		},
		"rounded-md": {
			left: "rounded-s-md",
			right: "rounded-e-md"
		},
		"rounded-lg": {
			left: "rounded-s-lg",
			right: "rounded-e-lg"
		},
		"rounded-xl": {
			left: "rounded-s-xl",
			right: "rounded-e-xl"
		},
		"rounded-2xl": {
			left: "rounded-s-2xl",
			right: "rounded-e-2xl"
		},
		"rounded-3xl": {
			left: "rounded-s-3xl",
			right: "rounded-e-3xl"
		},
		"rounded-full": {
			left: "rounded-s-full",
			right: "rounded-e-full"
		}
	},
	default: {
		size: "md",
		icon: "i-heroicons-minus-20-solid"
	}
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/elements/MeterGroup.js
var meterConfig = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.meter, meter_default);
var meterGroupConfig = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.meterGroup, meterGroup_default);
var MeterGroup_default = defineComponent({
	components: { UIcon: Icon_default },
	inheritAttrs: false,
	slots: Object,
	props: {
		min: {
			type: Number,
			default: 0
		},
		max: {
			type: Number,
			default: 100
		},
		size: {
			type: String,
			default: () => meterConfig.default.size,
			validator(value) {
				return Object.keys(meterConfig.meter.bar.size).includes(value);
			}
		},
		indicator: {
			type: Boolean,
			default: false
		},
		icon: {
			type: String,
			default: () => meterGroupConfig.default.icon
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
	setup(props, { slots }) {
		const { ui, attrs } = useUI("meterGroup", toRef(props, "ui"), meterGroupConfig);
		const { ui: uiMeter } = useUI("meter", void 0, meterConfig);
		if (!slots.default) throw new Error("Meter Group has no Meter children.");
		const normalizedMin = computed(() => props.min > props.max ? props.max : props.min);
		const normalizedMax = computed(() => props.max < props.min ? props.min : props.max);
		const children = computed(() => getSlotsChildren(slots));
		const rounded = computed(() => ui.value.orientation[ui.value.rounded]);
		function clampPercent(value, min, max) {
			if (min == max) return value < min ? 0 : 100;
			if (min > max) max = [min, min = max][0];
			const percent2 = (value - min) / (max - min) * 100;
			return Math.max(0, Math.min(100, percent2));
		}
		const labels = computed(() => {
			return children.value.map((node) => node.props.label);
		});
		const percents = computed(() => {
			return children.value.map((node) => clampPercent(node.props.value, props.min, props.max));
		});
		const percent = computed(() => {
			return Math.max(0, Math.max(percents.value.reduce((prev, percent2) => prev + percent2, 0)));
		});
		const clones = computed(() => children.value.map((node, index) => {
			const vProps = {};
			vProps.style = { width: `${percents.value[index]}%` };
			vProps.size = props.size;
			vProps.min = normalizedMin.value;
			vProps.max = normalizedMax.value;
			vProps.ui = node.props?.ui || {};
			vProps.ui.wrapper = node.props?.ui?.wrapper || "";
			vProps.ui.wrapper += [
				node.props?.ui?.wrapper,
				ui.value.background,
				ui.value.transition
			].filter(Boolean).join(" ");
			vProps.ui.meter = node.props?.ui?.meter || {};
			vProps.ui.meter.background = `bg-${node.props.color}-500 dark:bg-${node.props.color}-400`;
			vProps.ui.meter.rounded = "rounded-none";
			vProps.ui.meter.bar = node.props?.ui?.meter?.bar || {};
			if (index === 0) vProps.ui.meter.rounded = `${rounded.value.left} rounded-e-none`;
			if (index === children.value.length - 1) vProps.ui.meter.rounded = `${rounded.value.right} rounded-s-none`;
			labels.value[index] = node.props.label;
			const clone = cloneVNode(node, vProps);
			delete clone.children?.label;
			delete clone.props?.indicator;
			delete clone.props?.label;
			return clone;
		}));
		const baseClass = computed(() => {
			return twJoin(ui.value.base, ui.value.background, ui.value.rounded, ui.value.shadow, uiMeter.value.meter.size[props.size]);
		});
		const indicatorContainerClass = computed(() => {
			return twJoin(uiMeter.value.indicator.container);
		});
		const indicatorClass = computed(() => {
			return twJoin(uiMeter.value.indicator.text, uiMeter.value.indicator.size[props.size]);
		});
		const vNodeChildren = computed(() => {
			const vNodeSlots = [
				void 0,
				h("div", { class: baseClass.value }, clones.value),
				void 0
			];
			if (props.indicator) vNodeSlots[0] = h("div", { class: indicatorContainerClass.value }, [h("div", {
				class: indicatorClass.value,
				style: { width: `${percent.value}%` }
			}, Math.round(percent.value) + "%")]);
			else if (slots.indicator) vNodeSlots[0] = slots.indicator({ percent: percent.value });
			vNodeSlots[2] = h("ol", { class: ui.value.list }, labels.value.map((label, key) => {
				const labelClass = computed(() => {
					return twJoin(uiMeter.value.label.base, uiMeter.value.label.text, uiMeter.value.color[clones.value[key]?.props.color] ?? uiMeter.value.label.color.replaceAll("{color}", clones.value[key]?.props.color ?? uiMeter.value.default.color), uiMeter.value.label.size[props.size]);
				});
				return h("li", { class: labelClass.value }, [h(Icon_default, { name: clones.value[key]?.props.icon ?? props.icon }), `${label} (${Math.round(percents.value[key])}%)`]);
			}));
			return vNodeSlots;
		});
		return () => h("div", {
			class: ui.value.wrapper,
			...attrs.value
		}, vNodeChildren.value);
	}
});

export { MeterGroup_default as default };
//# sourceMappingURL=MeterGroup-C-KEiJzh.mjs.map
