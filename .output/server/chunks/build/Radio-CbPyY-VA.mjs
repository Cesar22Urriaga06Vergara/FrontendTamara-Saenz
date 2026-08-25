import { c as __exportAll, _ as _plugin_vue_export_helper_default, t as twMerge, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default, m as mergeConfig } from '../virtual/entry.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { u as useFormGroup } from './useFormGroup-BLFts8mq.mjs';
import { mergeProps, defineComponent, toRef, useId, inject, computed, useSSRContext } from 'vue';
import { twJoin } from 'tailwind-merge';
import { ssrRenderAttrs, ssrRenderClass, ssrLooseEqual, ssrGetDynamicModelProps, ssrRenderAttr, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
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

//#region node_modules/@nuxt/ui/dist/runtime/ui.config/forms/radio.js
var radio_default = {
	wrapper: "relative flex items-start",
	container: "flex items-center h-5",
	base: "h-4 w-4 dark:checked:bg-current dark:checked:border-transparent disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0 focus:ring-transparent focus:ring-offset-transparent",
	form: "form-radio",
	color: "text-{color}-500 dark:text-{color}-400",
	background: "bg-white dark:bg-gray-900",
	border: "border border-gray-300 dark:border-gray-700",
	ring: "focus-visible:ring-2 focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900",
	inner: "ms-3 flex flex-col",
	label: "text-sm font-medium text-gray-700 dark:text-gray-200",
	required: "text-sm text-red-500 dark:text-red-400",
	help: "text-sm text-gray-500 dark:text-gray-400",
	default: { color: "primary" }
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/forms/Radio.vue
var Radio_exports = /* @__PURE__ */ __exportAll({ default: () => Radio_default });
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.radio, radio_default);
var _sfc_main = defineComponent({
	inheritAttrs: false,
	props: {
		id: {
			type: String,
			default: null
		},
		value: {
			type: [
				String,
				Number,
				Boolean
			],
			default: null
		},
		modelValue: {
			type: [
				String,
				Number,
				Boolean,
				Object
			],
			default: null
		},
		name: {
			type: String,
			default: null
		},
		disabled: {
			type: Boolean,
			default: false
		},
		help: {
			type: String,
			default: null
		},
		label: {
			type: String,
			default: null
		},
		required: {
			type: Boolean,
			default: false
		},
		color: {
			type: String,
			default: () => config.default.color,
			validator(value) {
				return virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.colors.includes(value);
			}
		},
		inputClass: {
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
	emits: ["update:modelValue", "change"],
	setup(props, { emit }) {
		const { ui, attrs } = useUI("radio", toRef(props, "ui"), config, toRef(props, "class"));
		const inputId = props.id ?? useId();
		const radioGroup = inject("radio-group", null);
		const { emitFormChange, color, name } = radioGroup ?? useFormGroup(props, config);
		const pick = computed({
			get() {
				return props.modelValue;
			},
			set(value) {
				emit("update:modelValue", value);
				if (!radioGroup) emitFormChange();
			}
		});
		function onChange(event) {
			emit("change", event.target.value);
		}
		return {
			inputId,
			ui,
			attrs,
			pick,
			name,
			inputClass: computed(() => {
				return twMerge(twJoin(ui.value.base, ui.value.form, ui.value.background, ui.value.border, color.value && ui.value.ring.replaceAll("{color}", color.value), color.value && ui.value.color.replaceAll("{color}", color.value)), props.inputClass);
			}),
			onChange
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	let _temp0;
	_push(`<div${ssrRenderAttrs(mergeProps({
		class: _ctx.ui.wrapper,
		"data-n-ids": _ctx.attrs["data-n-ids"]
	}, _attrs))}><div class="${ssrRenderClass(_ctx.ui.container)}"><input${ssrRenderAttrs((_temp0 = mergeProps({
		id: _ctx.inputId,
		checked: ssrLooseEqual(_ctx.pick, _ctx.value),
		name: _ctx.name,
		required: _ctx.required,
		value: _ctx.value,
		disabled: _ctx.disabled,
		type: "radio",
		class: _ctx.inputClass
	}, _ctx.attrs), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, _ctx.pick))))}></div>`);
	if (_ctx.label || _ctx.$slots.label) {
		_push(`<div class="${ssrRenderClass(_ctx.ui.inner)}"><label${ssrRenderAttr("for", _ctx.inputId)} class="${ssrRenderClass(_ctx.ui.label)}">`);
		ssrRenderSlot(_ctx.$slots, "label", { label: _ctx.label }, () => {
			_push(`${ssrInterpolate(_ctx.label)}`);
		}, _push, _parent);
		if (_ctx.required) _push(`<span class="${ssrRenderClass(_ctx.ui.required)}">*</span>`);
		else _push(`<!---->`);
		_push(`</label>`);
		if (_ctx.help || _ctx.$slots.help) {
			_push(`<p class="${ssrRenderClass(_ctx.ui.help)}">`);
			ssrRenderSlot(_ctx.$slots, "help", { help: _ctx.help }, () => {
				_push(`${ssrInterpolate(_ctx.help)}`);
			}, _push, _parent);
			_push(`</p>`);
		} else _push(`<!---->`);
		_push(`</div>`);
	} else _push(`<!---->`);
	_push(`</div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/forms/Radio.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Radio_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "URadio" });

export { Radio_exports as n, radio_default as r, Radio_default as t };
//# sourceMappingURL=Radio-CbPyY-VA.mjs.map
