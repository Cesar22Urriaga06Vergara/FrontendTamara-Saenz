import { _ as _plugin_vue_export_helper_default, t as twMerge, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default, m as mergeConfig } from '../virtual/entry.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { u as useFormGroup } from './useFormGroup-BLFts8mq.mjs';
import { d as d$1, p } from './form-BjTHmaPY.mjs';
import { s, i, o as o$1, E as E$1, A, T, a as o } from './keyboard-DE1QlhcY.mjs';
import { s as s$1 } from './use-resolve-button-type-DZKnDGM_.mjs';
import { f, u } from './hidden-UkYquSML.mjs';
import { k } from './description-xz0pTumQ.mjs';
import { resolveComponent, mergeProps, withCtx, createVNode, openBlock, createBlock, createCommentVNode, defineComponent, toRef, computed, inject, ref, h, Fragment, unref, provide, useId, useSSRContext } from 'vue';
import { twJoin } from 'tailwind-merge';
import { ssrRenderComponent, ssrRenderClass } from 'vue/server-renderer';
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

//#region node_modules/@nuxt/ui/dist/runtime/ui.config/forms/toggle.js
var toggle_default = {
	base: "relative inline-flex flex-shrink-0 border-2 border-transparent disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none",
	rounded: "rounded-full",
	ring: "focus-visible:ring-2 focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900",
	active: "bg-{color}-500 dark:bg-{color}-400",
	inactive: "bg-gray-200 dark:bg-gray-700",
	size: {
		"2xs": "h-3 w-5",
		"xs": "h-3.5 w-6",
		"sm": "h-4 w-7",
		"md": "h-5 w-9",
		"lg": "h-6 w-11",
		"xl": "h-7 w-[3.25rem]",
		"2xl": "h-8 w-[3.75rem]"
	},
	container: {
		base: "pointer-events-none relative inline-block rounded-full bg-white dark:bg-gray-900 shadow transform ring-0 transition ease-in-out duration-200",
		active: {
			"2xs": "translate-x-2 rtl:-translate-x-2",
			"xs": "translate-x-2.5 rtl:-translate-x-2.5",
			"sm": "translate-x-3 rtl:-translate-x-3",
			"md": "translate-x-4 rtl:-translate-x-4",
			"lg": "translate-x-5 rtl:-translate-x-5",
			"xl": "translate-x-6 rtl:-translate-x-6",
			"2xl": "translate-x-7 rtl:-translate-x-7"
		},
		inactive: "translate-x-0 rtl:-translate-x-0",
		size: {
			"2xs": "h-2 w-2",
			"xs": "h-2.5 w-2.5",
			"sm": "h-3 w-3",
			"md": "h-4 w-4",
			"lg": "h-5 w-5",
			"xl": "h-6 w-6",
			"2xl": "h-7 w-7"
		}
	},
	icon: {
		base: "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity",
		active: "opacity-100 ease-in duration-200",
		inactive: "opacity-0 ease-out duration-100",
		size: {
			"2xs": "h-2 w-2",
			"xs": "h-2 w-2",
			"sm": "h-2 w-2",
			"md": "h-3 w-3",
			"lg": "h-4 w-4",
			"xl": "h-5 w-5",
			"2xl": "h-6 w-6"
		},
		on: "text-{color}-500 dark:text-{color}-400",
		off: "text-gray-400 dark:text-gray-500",
		loading: "animate-spin text-{color}-500 dark:text-{color}-400"
	},
	default: {
		onIcon: null,
		offIcon: null,
		loadingIcon: "i-heroicons-arrow-path-20-solid",
		color: "primary",
		size: "md"
	}
};
//#endregion
//#region node_modules/@headlessui/vue/dist/components/label/label.js
var a = Symbol("LabelContext");
function d() {
	let t = inject(a, null);
	if (t === null) {
		let n = /* @__PURE__ */ new Error("You used a <Label /> component, but it is not inside a parent.");
		throw Error.captureStackTrace && Error.captureStackTrace(n, d), n;
	}
	return t;
}
function E({ slot: t = {}, name: n = "Label", props: i = {} } = {}) {
	let e = ref([]);
	function o(r) {
		return e.value.push(r), () => {
			let l = e.value.indexOf(r);
			l !== -1 && e.value.splice(l, 1);
		};
	}
	return provide(a, {
		register: o,
		slot: t,
		name: n,
		props: i
	}), computed(() => e.value.length > 0 ? e.value.join(" ") : void 0);
}
defineComponent({
	name: "Label",
	props: {
		as: {
			type: [Object, String],
			default: "label"
		},
		passive: {
			type: [Boolean],
			default: false
		},
		id: {
			type: String,
			default: null
		}
	},
	setup(t, { slots: n, attrs: i$2 }) {
		var r;
		let e = (r = t.id) != null ? r : `headlessui-label-${i()}`, o = d();
		return () => {
			let { name: l = "Label", slot: p = {}, props: c = {} } = o, { passive: f, ...s } = t, u = {
				...Object.entries(c).reduce((b, [g, m]) => Object.assign(b, { [g]: unref(m) }), {}),
				id: e
			};
			return f && (delete u.onClick, delete u.htmlFor, delete s.onClick), A({
				ourProps: u,
				theirProps: s,
				slot: p,
				attrs: i$2,
				slots: n,
				name: l
			});
		};
	}
});
//#endregion
//#region node_modules/@headlessui/vue/dist/components/switch/switch.js
var C = Symbol("GroupContext");
defineComponent({
	name: "SwitchGroup",
	props: { as: {
		type: [Object, String],
		default: "template"
	} },
	setup(l, { slots: c, attrs: i }) {
		let r = ref(null), f = E({
			name: "SwitchLabel",
			props: {
				htmlFor: computed(() => {
					var t;
					return (t = r.value) == null ? void 0 : t.id;
				}),
				onClick(t) {
					r.value && (t.currentTarget.tagName === "LABEL" && t.preventDefault(), r.value.click(), r.value.focus({ preventScroll: true }));
				}
			}
		}), p = k({ name: "SwitchDescription" });
		return provide(C, {
			switchRef: r,
			labelledby: f,
			describedby: p
		}), () => A({
			theirProps: l,
			ourProps: {},
			slot: {},
			slots: c,
			attrs: i,
			name: "SwitchGroup"
		});
	}
});
var ue = defineComponent({
	name: "Switch",
	emits: { "update:modelValue": (l) => true },
	props: {
		as: {
			type: [Object, String],
			default: "button"
		},
		modelValue: {
			type: Boolean,
			default: void 0
		},
		defaultChecked: {
			type: Boolean,
			optional: true
		},
		form: {
			type: String,
			optional: true
		},
		name: {
			type: String,
			optional: true
		},
		value: {
			type: String,
			optional: true
		},
		id: {
			type: String,
			default: null
		},
		disabled: {
			type: Boolean,
			default: false
		},
		tabIndex: {
			type: Number,
			default: 0
		}
	},
	inheritAttrs: false,
	setup(l, { emit: c, attrs: i$1, slots: r, expose: f$1 }) {
		var h$1;
		let p$1 = (h$1 = l.id) != null ? h$1 : `headlessui-switch-${i()}`, n = inject(C, null), [t, s] = d$1(computed(() => l.modelValue), (e) => c("update:modelValue", e), computed(() => l.defaultChecked));
		function m() {
			s(!t.value);
		}
		let E = ref(null), o$2 = n === null ? E : n.switchRef, L = s$1(computed(() => ({
			as: l.as,
			type: i$1.type
		})), o$2);
		f$1({
			el: o$2,
			$el: o$2
		});
		function D(e) {
			e.preventDefault(), m();
		}
		function R(e) {
			e.key === o.Space ? (e.preventDefault(), m()) : e.key === o.Enter && p(e.currentTarget);
		}
		function x(e) {
			e.preventDefault();
		}
		computed(() => {
			var e, a;
			return (a = (e = o$1(o$2)) == null ? void 0 : e.closest) == null ? void 0 : a.call(e, "form");
		});
		return () => {
			let { name: e, value: a, form: K, tabIndex: y, ...b } = l, T$1 = { checked: t.value }, B = {
				id: p$1,
				ref: o$2,
				role: "switch",
				type: L.value,
				tabIndex: y === -1 ? 0 : y,
				"aria-checked": t.value,
				"aria-labelledby": n == null ? void 0 : n.labelledby.value,
				"aria-describedby": n == null ? void 0 : n.describedby.value,
				onClick: D,
				onKeyup: R,
				onKeypress: x
			};
			return h(Fragment, [e != null && t.value != null ? h(f, E$1({
				features: u.Hidden,
				as: "input",
				type: "checkbox",
				hidden: true,
				readOnly: true,
				checked: t.value,
				form: K,
				disabled: b.disabled,
				name: e,
				value: a
			})) : null, A({
				ourProps: B,
				theirProps: {
					...i$1,
					...T(b, ["modelValue", "defaultChecked"])
				},
				slot: T$1,
				attrs: i$1,
				slots: r,
				name: "Switch"
			})]);
		};
	}
});
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/forms/Toggle.vue
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.toggle, toggle_default);
var _sfc_main = defineComponent({
	components: {
		HSwitch: ue,
		UIcon: Icon_default
	},
	inheritAttrs: false,
	props: {
		id: {
			type: String,
			default: null
		},
		name: {
			type: String,
			default: null
		},
		modelValue: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		loading: {
			type: Boolean,
			default: false
		},
		onIcon: {
			type: String,
			default: () => config.default.onIcon
		},
		offIcon: {
			type: String,
			default: () => config.default.offIcon
		},
		loadingIcon: {
			type: String,
			default: () => config.default.loadingIcon
		},
		color: {
			type: String,
			default: () => config.default.color,
			validator(value) {
				return virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.colors.includes(value);
			}
		},
		size: {
			type: String,
			default: () => config.default.size,
			validator(value) {
				return Object.keys(config.size).includes(value);
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
	emits: ["update:modelValue", "change"],
	setup(props, { emit }) {
		const { ui, attrs } = useUI("toggle", toRef(props, "ui"), config);
		const { emitFormChange, color, inputId, name } = useFormGroup(props);
		const active = computed({
			get() {
				return props.modelValue;
			},
			set(value) {
				emit("update:modelValue", value);
				emit("change", value);
				emitFormChange();
			}
		});
		const switchClass = computed(() => {
			return twMerge(twJoin(ui.value.base, ui.value.size[props.size], ui.value.rounded, color.value && ui.value.ring.replaceAll("{color}", color.value), color.value && (active.value ? ui.value.active : ui.value.inactive).replaceAll("{color}", color.value)), props.class);
		});
		const containerClass = computed(() => {
			return twJoin(ui.value.container.base, ui.value.container.size[props.size], active.value ? ui.value.container.active[props.size] : ui.value.container.inactive);
		});
		const onIconClass = computed(() => {
			return twJoin(ui.value.icon.size[props.size], color.value && ui.value.icon.on.replaceAll("{color}", color.value));
		});
		const offIconClass = computed(() => {
			return twJoin(ui.value.icon.size[props.size], color.value && ui.value.icon.off.replaceAll("{color}", color.value));
		});
		const loadingIconClass = computed(() => {
			return twJoin(ui.value.icon.size[props.size], color.value && ui.value.icon.loading.replaceAll("{color}", color.value));
		});
		s(() => useId());
		return {
			ui,
			attrs,
			name,
			inputId,
			active,
			switchClass,
			containerClass,
			onIconClass,
			offIconClass,
			loadingIconClass
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_HSwitch = resolveComponent("HSwitch");
	const _component_UIcon = Icon_default;
	_push(ssrRenderComponent(_component_HSwitch, mergeProps({
		id: _ctx.inputId,
		modelValue: _ctx.active,
		"onUpdate:modelValue": ($event) => _ctx.active = $event,
		name: _ctx.name,
		disabled: _ctx.disabled || _ctx.loading,
		class: _ctx.switchClass
	}, _ctx.attrs, _attrs), {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) {
				_push(`<span class="${ssrRenderClass(_ctx.containerClass)}"${_scopeId}>`);
				if (_ctx.loading) {
					_push(`<span class="${ssrRenderClass([_ctx.ui.icon.active, _ctx.ui.icon.base])}" aria-hidden="true"${_scopeId}>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: _ctx.loadingIcon,
						class: _ctx.loadingIconClass
					}, null, _parent, _scopeId));
					_push(`</span>`);
				} else _push(`<!---->`);
				if (!_ctx.loading && _ctx.onIcon) {
					_push(`<span class="${ssrRenderClass([_ctx.active ? _ctx.ui.icon.active : _ctx.ui.icon.inactive, _ctx.ui.icon.base])}" aria-hidden="true"${_scopeId}>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: _ctx.onIcon,
						class: _ctx.onIconClass
					}, null, _parent, _scopeId));
					_push(`</span>`);
				} else _push(`<!---->`);
				if (!_ctx.loading && _ctx.offIcon) {
					_push(`<span class="${ssrRenderClass([_ctx.active ? _ctx.ui.icon.inactive : _ctx.ui.icon.active, _ctx.ui.icon.base])}" aria-hidden="true"${_scopeId}>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: _ctx.offIcon,
						class: _ctx.offIconClass
					}, null, _parent, _scopeId));
					_push(`</span>`);
				} else _push(`<!---->`);
				_push(`</span>`);
			} else return [createVNode("span", { class: _ctx.containerClass }, [
				_ctx.loading ? (openBlock(), createBlock("span", {
					key: 0,
					class: [_ctx.ui.icon.active, _ctx.ui.icon.base],
					"aria-hidden": "true"
				}, [createVNode(_component_UIcon, {
					name: _ctx.loadingIcon,
					class: _ctx.loadingIconClass
				}, null, 8, ["name", "class"])], 2)) : createCommentVNode("", true),
				!_ctx.loading && _ctx.onIcon ? (openBlock(), createBlock("span", {
					key: 1,
					class: [_ctx.active ? _ctx.ui.icon.active : _ctx.ui.icon.inactive, _ctx.ui.icon.base],
					"aria-hidden": "true"
				}, [createVNode(_component_UIcon, {
					name: _ctx.onIcon,
					class: _ctx.onIconClass
				}, null, 8, ["name", "class"])], 2)) : createCommentVNode("", true),
				!_ctx.loading && _ctx.offIcon ? (openBlock(), createBlock("span", {
					key: 2,
					class: [_ctx.active ? _ctx.ui.icon.inactive : _ctx.ui.icon.active, _ctx.ui.icon.base],
					"aria-hidden": "true"
				}, [createVNode(_component_UIcon, {
					name: _ctx.offIcon,
					class: _ctx.offIconClass
				}, null, 8, ["name", "class"])], 2)) : createCommentVNode("", true)
			], 2)];
		}),
		_: 1
	}, _parent));
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/forms/Toggle.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Toggle_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UToggle" });

export { Toggle_default as default };
//# sourceMappingURL=Toggle-CmEIUBV8.mjs.map
