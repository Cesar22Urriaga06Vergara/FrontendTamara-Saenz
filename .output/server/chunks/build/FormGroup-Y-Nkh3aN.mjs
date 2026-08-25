import { c as __exportAll, _ as _plugin_vue_export_helper_default, m as mergeConfig, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default } from '../virtual/entry.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { mergeProps, defineComponent, toRef, inject, computed, ref, useId, provide, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
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

//#region node_modules/@nuxt/ui/dist/runtime/ui.config/forms/formGroup.js
var formGroup_default = {
	wrapper: "",
	inner: "",
	label: {
		wrapper: "flex content-center items-center justify-between",
		base: "block font-medium text-gray-700 dark:text-gray-200",
		required: `after:content-['*'] after:ms-0.5 after:text-red-500 dark:after:text-red-400`
	},
	size: {
		"2xs": "text-xs",
		"xs": "text-xs",
		"sm": "text-sm",
		"md": "text-sm",
		"lg": "text-sm",
		"xl": "text-base"
	},
	container: "mt-1 relative",
	description: "text-gray-500 dark:text-gray-400",
	hint: "text-gray-500 dark:text-gray-400",
	help: "mt-2 text-gray-500 dark:text-gray-400",
	error: "mt-2 text-red-500 dark:text-red-400",
	default: { size: "sm" }
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/forms/FormGroup.vue
var FormGroup_exports = /* @__PURE__ */ __exportAll({ default: () => FormGroup_default });
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.formGroup, formGroup_default);
var _sfc_main = defineComponent({
	inheritAttrs: false,
	props: {
		name: {
			type: String,
			default: null
		},
		size: {
			type: String,
			default: null,
			validator(value) {
				return Object.keys(config.size).includes(value);
			}
		},
		label: {
			type: String,
			default: null
		},
		description: {
			type: String,
			default: null
		},
		required: {
			type: Boolean,
			default: false
		},
		help: {
			type: String,
			default: null
		},
		error: {
			type: [String, Boolean],
			default: null
		},
		hint: {
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
		eagerValidation: {
			type: Boolean,
			default: false
		}
	},
	setup(props) {
		const { ui, attrs } = useUI("formGroup", toRef(props, "ui"), config, toRef(props, "class"));
		const formErrors = inject("form-errors", null);
		const error = computed(() => {
			return props.error && typeof props.error === "string" || typeof props.error === "boolean" ? props.error : formErrors?.value?.find((error2) => error2.path === props.name)?.message;
		});
		const size = computed(() => ui.value.size[props.size ?? config.default.size]);
		const inputId = ref(useId());
		provide("form-group", {
			error,
			inputId,
			name: computed(() => props.name),
			size: computed(() => props.size),
			eagerValidation: computed(() => props.eagerValidation)
		});
		return {
			ui,
			attrs,
			inputId,
			size,
			error
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(mergeProps({ class: _ctx.ui.wrapper }, _ctx.attrs, _attrs))}><div class="${ssrRenderClass(_ctx.ui.inner)}">`);
	if (_ctx.label || _ctx.$slots.label) {
		_push(`<div class="${ssrRenderClass([_ctx.ui.label.wrapper, _ctx.size])}"><label${ssrRenderAttr("for", _ctx.inputId)} class="${ssrRenderClass([_ctx.ui.label.base, _ctx.required ? _ctx.ui.label.required : ""])}">`);
		if (_ctx.$slots.label) ssrRenderSlot(_ctx.$slots, "label", {
			error: _ctx.error,
			label: _ctx.label,
			name: _ctx.name,
			hint: _ctx.hint,
			description: _ctx.description,
			help: _ctx.help
		}, null, _push, _parent);
		else _push(`<!--[-->${ssrInterpolate(_ctx.label)}<!--]-->`);
		_push(`</label>`);
		if (_ctx.hint || _ctx.$slots.hint) {
			_push(`<span class="${ssrRenderClass([_ctx.ui.hint])}">`);
			if (_ctx.$slots.hint) ssrRenderSlot(_ctx.$slots, "hint", {
				error: _ctx.error,
				label: _ctx.label,
				name: _ctx.name,
				hint: _ctx.hint,
				description: _ctx.description,
				help: _ctx.help
			}, null, _push, _parent);
			else _push(`<!--[-->${ssrInterpolate(_ctx.hint)}<!--]-->`);
			_push(`</span>`);
		} else _push(`<!---->`);
		_push(`</div>`);
	} else _push(`<!---->`);
	if (_ctx.description || _ctx.$slots.description) {
		_push(`<p class="${ssrRenderClass([_ctx.ui.description, _ctx.size])}">`);
		if (_ctx.$slots.description) ssrRenderSlot(_ctx.$slots, "description", {
			error: _ctx.error,
			label: _ctx.label,
			name: _ctx.name,
			hint: _ctx.hint,
			description: _ctx.description,
			help: _ctx.help
		}, null, _push, _parent);
		else _push(`<!--[-->${ssrInterpolate(_ctx.description)}<!--]-->`);
		_push(`</p>`);
	} else _push(`<!---->`);
	_push(`</div><div class="${ssrRenderClass([_ctx.label ? _ctx.ui.container : ""])}">`);
	ssrRenderSlot(_ctx.$slots, "default", { error: _ctx.error }, null, _push, _parent);
	if (typeof _ctx.error === "string" && _ctx.error) {
		_push(`<p class="${ssrRenderClass([_ctx.ui.error, _ctx.size])}">`);
		if (_ctx.$slots.error) ssrRenderSlot(_ctx.$slots, "error", {
			error: _ctx.error,
			label: _ctx.label,
			name: _ctx.name,
			hint: _ctx.hint,
			description: _ctx.description,
			help: _ctx.help
		}, null, _push, _parent);
		else _push(`<!--[-->${ssrInterpolate(_ctx.error)}<!--]-->`);
		_push(`</p>`);
	} else if (_ctx.help || _ctx.$slots.help) {
		_push(`<p class="${ssrRenderClass([_ctx.ui.help, _ctx.size])}">`);
		if (_ctx.$slots.help) ssrRenderSlot(_ctx.$slots, "help", {
			error: _ctx.error,
			label: _ctx.label,
			name: _ctx.name,
			hint: _ctx.hint,
			description: _ctx.description,
			help: _ctx.help
		}, null, _push, _parent);
		else _push(`<!--[-->${ssrInterpolate(_ctx.help)}<!--]-->`);
		_push(`</p>`);
	} else _push(`<!---->`);
	_push(`</div></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/forms/FormGroup.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var FormGroup_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UFormGroup" });

export { FormGroup_exports as n, FormGroup_default as t };
//# sourceMappingURL=FormGroup-Y-Nkh3aN.mjs.map
