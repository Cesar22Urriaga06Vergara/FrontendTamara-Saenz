import { _ as _plugin_vue_export_helper_default, t as twMerge, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default, m as mergeConfig, g as get } from '../virtual/entry.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { u as useUI, s as select_default } from './ui.config-2s_B03nh.mjs';
import { u as useInjectButtonGroup } from './useButtonGroup-OQHG41CY.mjs';
import { u as useFormGroup } from './useFormGroup-BLFts8mq.mjs';
import { mergeProps, defineComponent, toRef, computed, useSSRContext } from 'vue';
import { twJoin } from 'tailwind-merge';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderClass, ssrRenderSlot, ssrRenderComponent } from 'vue/server-renderer';
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

//#region node_modules/@nuxt/ui/dist/runtime/components/forms/Select.vue
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.select, select_default);
var _sfc_main = defineComponent({
	components: { UIcon: Icon_default },
	inheritAttrs: false,
	props: {
		modelValue: {
			type: [
				String,
				Number,
				Object
			],
			default: ""
		},
		id: {
			type: String,
			default: null
		},
		name: {
			type: String,
			default: null
		},
		placeholder: {
			type: String,
			default: null
		},
		required: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		icon: {
			type: String,
			default: null
		},
		loadingIcon: {
			type: String,
			default: () => config.default.loadingIcon
		},
		leadingIcon: {
			type: String,
			default: null
		},
		trailingIcon: {
			type: String,
			default: () => config.default.trailingIcon
		},
		trailing: {
			type: Boolean,
			default: false
		},
		leading: {
			type: Boolean,
			default: false
		},
		loading: {
			type: Boolean,
			default: false
		},
		padded: {
			type: Boolean,
			default: true
		},
		options: {
			type: Array,
			default: () => []
		},
		size: {
			type: String,
			default: null,
			validator(value) {
				return Object.keys(config.size).includes(value);
			}
		},
		color: {
			type: String,
			default: () => config.default.color,
			validator(value) {
				return [...virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.colors, ...Object.keys(config.color)].includes(value);
			}
		},
		variant: {
			type: String,
			default: () => config.default.variant,
			validator(value) {
				return [...Object.keys(config.variant), ...Object.values(config.color).flatMap((value2) => Object.keys(value2))].includes(value);
			}
		},
		optionAttribute: {
			type: String,
			default: "label"
		},
		valueAttribute: {
			type: String,
			default: "value"
		},
		selectClass: {
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
	setup(props, { emit, slots }) {
		const { ui, attrs } = useUI("select", toRef(props, "ui"), config, toRef(props, "class"));
		const { size: sizeButtonGroup, rounded } = useInjectButtonGroup({
			ui,
			props
		});
		const { emitFormChange, inputId, color, size: sizeFormGroup, name } = useFormGroup(props, config);
		const size = computed(() => sizeButtonGroup.value ?? sizeFormGroup.value);
		const onInput = (event) => {
			emit("update:modelValue", event.target.value);
		};
		const onChange = (event) => {
			emit("change", event.target.value);
			emitFormChange();
		};
		const guessOptionValue = (option) => {
			return get(option, props.valueAttribute, "");
		};
		const guessOptionText = (option) => {
			return get(option, props.optionAttribute, "");
		};
		const normalizeOption = (option) => {
			if ([
				"string",
				"number",
				"boolean"
			].includes(typeof option)) return {
				[props.valueAttribute]: option,
				[props.optionAttribute]: option
			};
			return {
				...option,
				[props.valueAttribute]: guessOptionValue(option),
				[props.optionAttribute]: guessOptionText(option)
			};
		};
		const normalizedOptions = computed(() => {
			return props.options.map((option) => normalizeOption(option));
		});
		const normalizedOptionsWithPlaceholder = computed(() => {
			if (!props.placeholder) return normalizedOptions.value;
			return [{
				[props.valueAttribute]: "",
				[props.optionAttribute]: props.placeholder,
				disabled: true
			}, ...normalizedOptions.value];
		});
		const normalizedValue = computed(() => {
			const normalizeModelValue = normalizeOption(props.modelValue);
			const foundOption = normalizedOptionsWithPlaceholder.value.find((option) => option[props.valueAttribute] === normalizeModelValue[props.valueAttribute]);
			if (!foundOption) return "";
			return foundOption[props.valueAttribute];
		});
		const selectClass = computed(() => {
			const variant = ui.value.color?.[color.value]?.[props.variant] || ui.value.variant[props.variant];
			return twMerge(twJoin(ui.value.base, ui.value.form, rounded.value, ui.value.size[size.value], props.padded ? ui.value.padding[size.value] : "p-0", variant?.replaceAll("{color}", color.value), (isLeading.value || slots.leading) && ui.value.leading.padding[size.value], (isTrailing.value || slots.trailing) && ui.value.trailing.padding[size.value]), props.placeholder && !props.modelValue && ui.value.placeholder, props.selectClass);
		});
		const isLeading = computed(() => {
			return props.icon && props.leading || props.icon && !props.trailing || props.loading && !props.trailing || props.leadingIcon;
		});
		const isTrailing = computed(() => {
			return props.icon && props.trailing || props.loading && props.trailing || props.trailingIcon;
		});
		const leadingIconName = computed(() => {
			if (props.loading) return props.loadingIcon;
			return props.leadingIcon || props.icon;
		});
		const trailingIconName = computed(() => {
			if (props.loading && !isLeading.value) return props.loadingIcon;
			return props.trailingIcon || props.icon;
		});
		const leadingWrapperIconClass = computed(() => {
			return twJoin(ui.value.icon.leading.wrapper, ui.value.icon.leading.pointer, ui.value.icon.leading.padding[size.value]);
		});
		const leadingIconClass = computed(() => {
			return twJoin(ui.value.icon.base, color.value && virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.colors.includes(color.value) && ui.value.icon.color.replaceAll("{color}", color.value), ui.value.icon.size[size.value], props.loading && ui.value.icon.loading);
		});
		const trailingWrapperIconClass = computed(() => {
			return twJoin(ui.value.icon.trailing.wrapper, ui.value.icon.trailing.pointer, ui.value.icon.trailing.padding[size.value]);
		});
		return {
			ui,
			attrs,
			name,
			inputId,
			normalizedOptionsWithPlaceholder,
			normalizedValue,
			isLeading,
			isTrailing,
			selectClass,
			leadingIconName,
			leadingIconClass,
			leadingWrapperIconClass,
			trailingIconName,
			trailingIconClass: computed(() => {
				return twJoin(ui.value.icon.base, color.value && virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.colors.includes(color.value) && ui.value.icon.color.replaceAll("{color}", color.value), ui.value.icon.size[size.value], props.loading && !isLeading.value && ui.value.icon.loading);
			}),
			trailingWrapperIconClass,
			onInput,
			onChange
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_UIcon = Icon_default;
	_push(`<div${ssrRenderAttrs(mergeProps({ class: _ctx.ui.wrapper }, _attrs))} data-v-cbc9516f><select${ssrRenderAttrs(mergeProps({
		id: _ctx.inputId,
		name: _ctx.name,
		value: _ctx.modelValue,
		required: _ctx.required,
		disabled: _ctx.disabled,
		class: _ctx.selectClass
	}, _ctx.attrs))} data-v-cbc9516f><!--[-->`);
	ssrRenderList(_ctx.normalizedOptionsWithPlaceholder, (option, index) => {
		_push(`<!--[-->`);
		if (option.children) {
			_push(`<optgroup${ssrRenderAttr("value", option[_ctx.valueAttribute])}${ssrRenderAttr("label", option[_ctx.optionAttribute])} data-v-cbc9516f><!--[-->`);
			ssrRenderList(option.children, (childOption, index2) => {
				_push(`<option${ssrRenderAttr("value", childOption[_ctx.valueAttribute])}${ssrIncludeBooleanAttr(childOption[_ctx.valueAttribute] === _ctx.normalizedValue) ? " selected" : ""}${ssrIncludeBooleanAttr(childOption.disabled) ? " disabled" : ""} data-v-cbc9516f>${ssrInterpolate(childOption[_ctx.optionAttribute])}</option>`);
			});
			_push(`<!--]--></optgroup>`);
		} else _push(`<option${ssrRenderAttr("value", option[_ctx.valueAttribute])}${ssrIncludeBooleanAttr(option[_ctx.valueAttribute] === _ctx.normalizedValue) ? " selected" : ""}${ssrIncludeBooleanAttr(option.disabled) ? " disabled" : ""} data-v-cbc9516f>${ssrInterpolate(option[_ctx.optionAttribute])}</option>`);
		_push(`<!--]-->`);
	});
	_push(`<!--]--></select>`);
	if (_ctx.isLeading && _ctx.leadingIconName || _ctx.$slots.leading) {
		_push(`<span class="${ssrRenderClass(_ctx.leadingWrapperIconClass)}" data-v-cbc9516f>`);
		ssrRenderSlot(_ctx.$slots, "leading", {
			disabled: _ctx.disabled,
			loading: _ctx.loading
		}, () => {
			_push(ssrRenderComponent(_component_UIcon, {
				name: _ctx.leadingIconName,
				class: _ctx.leadingIconClass
			}, null, _parent));
		}, _push, _parent);
		_push(`</span>`);
	} else _push(`<!---->`);
	if (_ctx.isTrailing && _ctx.trailingIconName || _ctx.$slots.trailing) {
		_push(`<span class="${ssrRenderClass(_ctx.trailingWrapperIconClass)}" data-v-cbc9516f>`);
		ssrRenderSlot(_ctx.$slots, "trailing", {
			disabled: _ctx.disabled,
			loading: _ctx.loading
		}, () => {
			_push(ssrRenderComponent(_component_UIcon, {
				name: _ctx.trailingIconName,
				class: _ctx.trailingIconClass,
				"aria-hidden": "true"
			}, null, _parent));
		}, _push, _parent);
		_push(`</span>`);
	} else _push(`<!---->`);
	_push(`</div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/forms/Select.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Select_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-cbc9516f"]]), { __name: "USelect" });

export { Select_default as default };
//# sourceMappingURL=Select-Bry5BVjr.mjs.map
