import { _ as _plugin_vue_export_helper_default, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default, m as mergeConfig, g as get } from '../virtual/entry.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { t as Radio_default, r as radio_default } from './Radio-CbPyY-VA.mjs';
import { u as useFormGroup } from './useFormGroup-BLFts8mq.mjs';
import { mergeProps, createSlots, withCtx, renderSlot, defineComponent, toRef, provide, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderSlot, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
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

//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/forms/RadioGroup.vue
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.radioGroup, {
	wrapper: "relative flex items-start",
	fieldset: "",
	legend: "text-sm font-medium text-gray-700 dark:text-gray-200 mb-1",
	default: { color: "primary" }
});
var configRadio = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.radio, radio_default);
var _sfc_main = defineComponent({
	components: { URadio: Radio_default },
	inheritAttrs: false,
	props: {
		modelValue: {
			type: [
				String,
				Number,
				Object,
				Boolean
			],
			default: ""
		},
		name: {
			type: String,
			default: null
		},
		legend: {
			type: String,
			default: null
		},
		options: {
			type: Array,
			default: () => []
		},
		optionAttribute: {
			type: String,
			default: "label"
		},
		valueAttribute: {
			type: String,
			default: "value"
		},
		disabled: {
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
		},
		uiRadio: {
			type: Object,
			default: () => ({})
		}
	},
	emits: ["update:modelValue", "change"],
	setup(props, { emit }) {
		const { ui, attrs } = useUI("radioGroup", toRef(props, "ui"), config, toRef(props, "class"));
		const { ui: uiRadio } = useUI("radio", toRef(props, "uiRadio"), configRadio);
		const { emitFormChange, color, name } = useFormGroup(props, config, false);
		provide("radio-group", {
			color,
			name
		});
		const onUpdate = (value) => {
			emit("update:modelValue", value);
			emit("change", value);
			emitFormChange();
		};
		const guessOptionValue = (option) => {
			return get(option, props.valueAttribute, get(option, props.optionAttribute));
		};
		const guessOptionText = (option) => {
			return get(option, props.optionAttribute, get(option, props.valueAttribute));
		};
		const guessOptionSelected = (option) => {
			return props.modelValue === guessOptionValue(option);
		};
		const normalizeOption = (option) => {
			if ([
				"string",
				"number",
				"boolean"
			].includes(typeof option)) return {
				value: option,
				label: option
			};
			return {
				...option,
				value: guessOptionValue(option),
				label: guessOptionText(option),
				selected: guessOptionSelected(option)
			};
		};
		return {
			ui,
			uiRadio,
			attrs,
			normalizedOptions: computed(() => {
				return props.options.map((option) => normalizeOption(option));
			}),
			onUpdate
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_URadio = Radio_default;
	_push(`<div${ssrRenderAttrs(mergeProps({ class: _ctx.ui.wrapper }, _attrs))}><fieldset${ssrRenderAttrs(mergeProps(_ctx.attrs, { class: _ctx.ui.fieldset }))}>`);
	if (_ctx.legend || _ctx.$slots.legend) {
		_push(`<legend class="${ssrRenderClass(_ctx.ui.legend)}">`);
		ssrRenderSlot(_ctx.$slots, "legend", {}, () => {
			_push(`${ssrInterpolate(_ctx.legend)}`);
		}, _push, _parent);
		_push(`</legend>`);
	} else _push(`<!---->`);
	_push(`<!--[-->`);
	ssrRenderList(_ctx.normalizedOptions, (option) => {
		_push(ssrRenderComponent(_component_URadio, {
			key: option.value,
			label: option.label,
			"model-value": _ctx.modelValue,
			value: option.value,
			help: option.help,
			disabled: option.disabled || _ctx.disabled,
			ui: _ctx.uiRadio,
			onChange: ($event) => _ctx.onUpdate(option.value)
		}, createSlots({ _: 2 }, [_ctx.$slots.label ? {
			name: "label",
			fn: withCtx((_, _push, _parent, _scopeId) => {
				if (_push) ssrRenderSlot(_ctx.$slots, "label", mergeProps({ ref_for: true }, {
					option,
					selected: option.selected
				}), null, _push, _parent, _scopeId);
				else return [renderSlot(_ctx.$slots, "label", mergeProps({ ref_for: true }, {
					option,
					selected: option.selected
				}))];
			}),
			key: "0"
		} : void 0, _ctx.$slots.help ? {
			name: "help",
			fn: withCtx((_, _push, _parent, _scopeId) => {
				if (_push) ssrRenderSlot(_ctx.$slots, "help", mergeProps({ ref_for: true }, {
					option,
					selected: option.selected
				}), null, _push, _parent, _scopeId);
				else return [renderSlot(_ctx.$slots, "help", mergeProps({ ref_for: true }, {
					option,
					selected: option.selected
				}))];
			}),
			key: "1"
		} : void 0]), _parent));
	});
	_push(`<!--]--></fieldset></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/forms/RadioGroup.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var RadioGroup_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "URadioGroup" });

export { RadioGroup_default as default };
//# sourceMappingURL=RadioGroup-ybXhD7UC.mjs.map
