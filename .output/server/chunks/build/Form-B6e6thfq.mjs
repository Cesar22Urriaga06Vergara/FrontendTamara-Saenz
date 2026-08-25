import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { defineComponent, useId, ref, provide, readonly, useSSRContext } from 'vue';
import { useEventBus } from '@vueuse/core';
import { ssrRenderAttrs, ssrRenderSlot } from 'vue/server-renderer';
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
import 'tailwind-merge';
import '@iconify/vue';

//#region node_modules/@nuxt/ui/dist/runtime/components/forms/Form.vue
var FormException = class FormException extends Error {
	constructor(message) {
		super(message);
		this.message = message;
		Object.setPrototypeOf(this, FormException.prototype);
	}
};
var _sfc_main = defineComponent({
	props: {
		schema: {
			type: [Object, Function],
			default: void 0
		},
		state: {
			type: Object,
			required: true
		},
		validate: {
			type: Function,
			default: () => []
		},
		validateOn: {
			type: Array,
			default: () => [
				"blur",
				"input",
				"change",
				"submit"
			]
		}
	},
	emits: ["submit", "error"],
	setup(props, { expose, emit }) {
		const formId = useId();
		const bus = useEventBus(`form-${formId}`);
		const parsedValue = ref(null);
		const errors = ref([]);
		provide("form-errors", errors);
		provide("form-events", bus);
		const inputs = ref({});
		provide("form-inputs", inputs);
		async function getErrors() {
			let errs = await props.validate(props.state);
			if (props.schema) {
				const { errors: errors2, result } = await parseSchema(props.state, props.schema);
				if (errors2) errs = errs.concat(errors2);
				else parsedValue.value = result;
			}
			return errs;
		}
		async function validate(path, opts = { silent: false }) {
			let paths = path;
			if (path && !Array.isArray(path)) paths = [path];
			if (paths) {
				const otherErrors = errors.value.filter((error) => !paths.includes(error.path));
				const pathErrors = (await getErrors()).filter((error) => paths.includes(error.path));
				errors.value = otherErrors.concat(pathErrors);
			} else errors.value = await getErrors();
			if (errors.value.length > 0) {
				if (opts.silent) return false;
				throw new FormException(`Form validation failed: ${JSON.stringify(errors.value, null, 2)}`);
			}
			return props.state;
		}
		async function onSubmit(payload) {
			const event = payload;
			try {
				if (props.validateOn?.includes("submit")) await validate();
				event.data = props.schema ? parsedValue.value : props.state;
				emit("submit", event);
			} catch (error) {
				if (!(error instanceof FormException)) throw error;
				emit("error", {
					...event,
					errors: errors.value.map((err) => ({
						...err,
						id: inputs.value[err.path]
					}))
				});
			}
		}
		expose({
			validate,
			errors,
			setErrors(errs, path) {
				if (path) errors.value = errors.value.filter((error) => error.path !== path).concat(errs);
				else errors.value = errs;
			},
			async submit() {
				await onSubmit(new Event("submit"));
			},
			getErrors(path) {
				if (path) return errors.value.filter((err) => err.path === path);
				return errors.value;
			},
			clear(path) {
				if (path) errors.value = errors.value.filter((err) => err.path !== path);
				else errors.value = [];
			}
		});
		return {
			onSubmit,
			errors: readonly(errors)
		};
	}
});
function isYupSchema(schema) {
	return schema.validate && schema.__isYupSchema__;
}
function isYupError(error) {
	return error.inner !== void 0;
}
function isSuperStructSchema(schema) {
	return "schema" in schema && typeof schema.coercer === "function" && typeof schema.validator === "function" && typeof schema.refiner === "function";
}
function isJoiSchema(schema) {
	return schema.validateAsync !== void 0 && schema.id !== void 0;
}
function isJoiError(error) {
	return error.isJoi === true;
}
function isStandardSchema(schema) {
	return "~standard" in schema;
}
async function validateStandardSchema(state, schema) {
	const result = await schema["~standard"].validate(state);
	if (!result.issues || result.issues.length === 0) return {
		errors: null,
		result: "value" in result ? result.value : null
	};
	return {
		errors: result.issues.map((issue) => ({
			path: issue.path?.map((item) => typeof item === "object" ? item.key : item).join(".") || "",
			message: issue.message
		})),
		result: null
	};
}
async function validateJoiSchema(state, schema) {
	try {
		return {
			errors: null,
			result: await schema.validateAsync(state, { abortEarly: false })
		};
	} catch (error) {
		if (isJoiError(error)) return {
			errors: error.details.map((issue) => ({
				path: issue.path.join("."),
				message: issue.message
			})),
			result: null
		};
		else throw error;
	}
}
async function validateSuperstructSchema(state, schema) {
	const [err, result] = schema.validate(state);
	if (err) return {
		errors: err.failures().map((error) => ({
			message: error.message,
			path: error.path.join(".")
		})),
		result: null
	};
	return {
		errors: null,
		result
	};
}
async function validateYupSchema(state, schema) {
	try {
		return {
			errors: null,
			result: await schema.validate(state, { abortEarly: false })
		};
	} catch (error) {
		if (isYupError(error)) return {
			errors: error.inner.map((issue) => ({
				path: issue.path ?? "",
				message: issue.message
			})),
			result: null
		};
		else throw error;
	}
}
function parseSchema(state, schema) {
	if (isStandardSchema(schema)) return validateStandardSchema(state, schema);
	else if (isJoiSchema(schema)) return validateJoiSchema(state, schema);
	else if (isYupSchema(schema)) return validateYupSchema(state, schema);
	else if (isSuperStructSchema(schema)) return validateSuperstructSchema(state, schema);
	else throw new Error("Form validation failed: Unsupported form schema");
}
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<form${ssrRenderAttrs(_attrs)}>`);
	ssrRenderSlot(_ctx.$slots, "default", { errors: _ctx.errors }, null, _push, _parent);
	_push(`</form>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/forms/Form.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Form_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UForm" });

export { Form_default as default, isStandardSchema, validateStandardSchema };
//# sourceMappingURL=Form-B6e6thfq.mjs.map
