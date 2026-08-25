import { c as __exportAll, _ as _plugin_vue_export_helper_default, t as twMerge, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default, m as mergeConfig, l as looseToNumber } from '../virtual/entry.mjs';
import { u as useUI, t as textarea_default } from './ui.config-2s_B03nh.mjs';
import { u as useFormGroup } from './useFormGroup-BLFts8mq.mjs';
import { mergeProps, defineComponent, toRef, ref, watch, nextTick, computed, useSSRContext } from 'vue';
import { n as defu } from '../_/nitro.mjs';
import { twJoin } from 'tailwind-merge';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
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

//#region node_modules/@nuxt/ui/dist/runtime/components/forms/Textarea.vue
var Textarea_exports = /* @__PURE__ */ __exportAll({ default: () => Textarea_default });
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.textarea, textarea_default);
var _sfc_main = defineComponent({
	inheritAttrs: false,
	props: {
		modelValue: {
			type: [String, Number],
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
		rows: {
			type: Number,
			default: 3
		},
		maxrows: {
			type: Number,
			default: 0
		},
		autoresize: {
			type: Boolean,
			default: false
		},
		autofocus: {
			type: Boolean,
			default: false
		},
		autofocusDelay: {
			type: Number,
			default: 100
		},
		resize: {
			type: Boolean,
			default: false
		},
		padded: {
			type: Boolean,
			default: true
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
		textareaClass: {
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
		},
		modelModifiers: {
			type: Object,
			default: () => ({})
		}
	},
	emits: [
		"update:modelValue",
		"blur",
		"change"
	],
	setup(props, { emit }) {
		const { ui, attrs } = useUI("textarea", toRef(props, "ui"), config, toRef(props, "class"));
		const { emitFormBlur, emitFormInput, inputId, color, size, name } = useFormGroup(props, config);
		const modelModifiers = ref(defu({}, props.modelModifiers, {
			trim: false,
			lazy: false,
			number: false,
			nullify: false
		}));
		const textarea2 = ref(null);
		const autoResize = () => {
			if (props.autoresize) {
				if (!textarea2.value) return;
				textarea2.value.rows = props.rows;
				const overflow = textarea2.value.style.overflow;
				textarea2.value.style.overflow = "hidden";
				const styles = (void 0).getComputedStyle(textarea2.value);
				const padding = Number.parseInt(styles.paddingTop) + Number.parseInt(styles.paddingBottom);
				const lineHeight = Number.parseInt(styles.lineHeight);
				const { scrollHeight } = textarea2.value;
				const newRows = (scrollHeight - padding) / lineHeight;
				if (newRows > props.rows) textarea2.value.rows = props.maxrows ? Math.min(newRows, props.maxrows) : newRows;
				textarea2.value.style.overflow = overflow;
			}
		};
		const updateInput = (value) => {
			if (modelModifiers.value.trim) value = value.trim();
			if (modelModifiers.value.number) value = looseToNumber(value);
			if (modelModifiers.value.nullify) value ||= null;
			emit("update:modelValue", value);
			emitFormInput();
		};
		const onInput = (event) => {
			autoResize();
			if (!modelModifiers.value.lazy) updateInput(event.target.value);
		};
		const onChange = (event) => {
			const value = event.target.value;
			emit("change", value);
			if (modelModifiers.value.lazy) updateInput(value);
			if (modelModifiers.value.trim) event.target.value = value.trim();
		};
		const onBlur = (event) => {
			emit("blur", event);
			emitFormBlur();
		};
		watch(() => props.modelValue, () => {
			nextTick(autoResize);
		});
		return {
			ui,
			attrs,
			name,
			inputId,
			textarea: textarea2,
			textareaClass: computed(() => {
				const variant = ui.value.color?.[color.value]?.[props.variant] || ui.value.variant[props.variant];
				return twMerge(twJoin(ui.value.base, ui.value.form, ui.value.rounded, ui.value.placeholder, ui.value.size[size.value], props.padded ? ui.value.padding[size.value] : "p-0", variant?.replaceAll("{color}", color.value), !props.resize && "resize-none"), props.textareaClass);
			}),
			onInput,
			onChange,
			onBlur
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	let _temp0;
	_push(`<div${ssrRenderAttrs(mergeProps({ class: _ctx.ui.wrapper }, _attrs))}><textarea${ssrRenderAttrs(_temp0 = mergeProps({
		id: _ctx.inputId,
		ref: "textarea",
		value: _ctx.modelValue,
		name: _ctx.name,
		rows: _ctx.rows,
		required: _ctx.required,
		disabled: _ctx.disabled,
		placeholder: _ctx.placeholder,
		class: _ctx.textareaClass
	}, _ctx.attrs), "textarea")}>${ssrInterpolate("value" in _temp0 ? _temp0.value : "")}</textarea>`);
	ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
	_push(`</div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/forms/Textarea.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Textarea_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UTextarea" });

export { Textarea_exports as n, Textarea_default as t };
//# sourceMappingURL=Textarea-E1R2aU6E.mjs.map
