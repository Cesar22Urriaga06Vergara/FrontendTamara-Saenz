import { c as __exportAll, _ as _plugin_vue_export_helper_default, t as twMerge, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default, g as get, m as mergeConfig } from '../virtual/entry.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { u as useUI, s as select_default, a as selectMenu_default } from './ui.config-2s_B03nh.mjs';
import { u as useInjectButtonGroup } from './useButtonGroup-OQHG41CY.mjs';
import { t as Avatar_default } from './Avatar-BOI4zec4.mjs';
import { u as useFormGroup } from './useFormGroup-BLFts8mq.mjs';
import { d, e } from './form-BjTHmaPY.mjs';
import { i as it, r as rt, u as ut, n as nt, l as lt } from './combobox-C0tFQX7q.mjs';
import { s, i, u, o as o$1, A as A$1, N, E, T, a as o } from './keyboard-DE1QlhcY.mjs';
import { w as w$1, h as h$1, O } from './focus-management-DXpqooZk.mjs';
import { w } from './use-outside-click-E0zCHGRJ.mjs';
import { s as s$1 } from './use-resolve-button-type-DZKnDGM_.mjs';
import { u as u$1, c, f as f$1 } from './calculate-active-index-CJA4E3gh.mjs';
import { f, u as u$2 } from './hidden-UkYquSML.mjs';
import { l, i as i$1, t } from './open-closed-Css0b1VQ.mjs';
import { p } from './use-text-value-DhHPSnE-.mjs';
import { u as usePopper } from './usePopper-BCEqNZ_Z.mjs';
import { resolveComponent, createVNode, resolveDynamicComponent, mergeProps, withCtx, renderSlot, openBlock, createBlock, createCommentVNode, toDisplayString, Fragment, renderList, createTextVNode, Transition, defineComponent, toRef, computed, ref, toRaw, watch, useId, watchEffect, nextTick, provide, h, inject, useSSRContext } from 'vue';
import { n as defu, F as isEqual } from '../_/nitro.mjs';
import { useDebounceFn, computedAsync } from '@vueuse/core';
import { twJoin } from 'tailwind-merge';
import { ssrRenderVNode, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderSlot, ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
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
import '@iconify/vue';
import './components-CzgPFaUd.mjs';
import '@iconify/utils/lib/css/icon';
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
import './active-element-history-BkxR87qo.mjs';
import './micro-task-Dv1257jF.mjs';
import '@tanstack/vue-virtual';

//#region node_modules/@headlessui/vue/dist/components/listbox/listbox.js
function pe(o, b) {
	return o === b;
}
var ce = ((r) => (r[r.Open = 0] = "Open", r[r.Closed = 1] = "Closed", r))(ce || {});
var ve = ((r) => (r[r.Single = 0] = "Single", r[r.Multi = 1] = "Multi", r))(ve || {});
var be = ((r) => (r[r.Pointer = 0] = "Pointer", r[r.Other = 1] = "Other", r))(be || {});
function me(o) {
	requestAnimationFrame(() => requestAnimationFrame(o));
}
var $ = Symbol("ListboxContext");
function A(o) {
	let b = inject($, null);
	if (b === null) {
		let r = /* @__PURE__ */ new Error(`<${o} /> is missing a parent <Listbox /> component.`);
		throw Error.captureStackTrace && Error.captureStackTrace(r, A), r;
	}
	return b;
}
var Ie = defineComponent({
	name: "Listbox",
	emits: { "update:modelValue": (o) => true },
	props: {
		as: {
			type: [Object, String],
			default: "template"
		},
		disabled: {
			type: [Boolean],
			default: false
		},
		by: {
			type: [String, Function],
			default: () => pe
		},
		horizontal: {
			type: [Boolean],
			default: false
		},
		modelValue: {
			type: [
				Object,
				String,
				Number,
				Boolean
			],
			default: void 0
		},
		defaultValue: {
			type: [
				Object,
				String,
				Number,
				Boolean
			],
			default: void 0
		},
		form: {
			type: String,
			optional: true
		},
		name: {
			type: String,
			optional: true
		},
		multiple: {
			type: [Boolean],
			default: false
		}
	},
	inheritAttrs: false,
	setup(o$2, { slots: b, attrs: r, emit: w$2 }) {
		let n = ref(1), e$1 = ref(null), f$2 = ref(null), v = ref(null), s = ref([]), m = ref(""), p = ref(null), a = ref(1);
		function u$3(t = (i) => i) {
			let i = p.value !== null ? s.value[p.value] : null, l = O(t(s.value.slice()), (O) => o$1(O.dataRef.domRef)), d = i ? l.indexOf(i) : null;
			return d === -1 && (d = null), {
				options: l,
				activeOptionIndex: d
			};
		}
		let D = computed(() => o$2.multiple ? 1 : 0), [y, L] = d(computed(() => o$2.modelValue), (t) => w$2("update:modelValue", t), computed(() => o$2.defaultValue)), M = computed(() => y.value === void 0 ? u(D.value, {
			[1]: [],
			[0]: void 0
		}) : y.value), k = {
			listboxState: n,
			value: M,
			mode: D,
			compare(t, i) {
				if (typeof o$2.by == "string") {
					let l = o$2.by;
					return (t == null ? void 0 : t[l]) === (i == null ? void 0 : i[l]);
				}
				return o$2.by(t, i);
			},
			orientation: computed(() => o$2.horizontal ? "horizontal" : "vertical"),
			labelRef: e$1,
			buttonRef: f$2,
			optionsRef: v,
			disabled: computed(() => o$2.disabled),
			options: s,
			searchQuery: m,
			activeOptionIndex: p,
			activationTrigger: a,
			closeListbox() {
				o$2.disabled || n.value !== 1 && (n.value = 1, p.value = null);
			},
			openListbox() {
				o$2.disabled || n.value !== 0 && (n.value = 0);
			},
			goToOption(t, i, l) {
				if (o$2.disabled || n.value === 1) return;
				let d = u$3(), O = f$1(t === c.Specific ? {
					focus: c.Specific,
					id: i
				} : { focus: t }, {
					resolveItems: () => d.options,
					resolveActiveIndex: () => d.activeOptionIndex,
					resolveId: (h) => h.id,
					resolveDisabled: (h) => h.dataRef.disabled
				});
				m.value = "", p.value = O, a.value = l != null ? l : 1, s.value = d.options;
			},
			search(t) {
				if (o$2.disabled || n.value === 1) return;
				let l = m.value !== "" ? 0 : 1;
				m.value += t.toLowerCase();
				let O = (p.value !== null ? s.value.slice(p.value + l).concat(s.value.slice(0, p.value + l)) : s.value).find((I) => I.dataRef.textValue.startsWith(m.value) && !I.dataRef.disabled), h = O ? s.value.indexOf(O) : -1;
				h === -1 || h === p.value || (p.value = h, a.value = 1);
			},
			clearSearch() {
				o$2.disabled || n.value !== 1 && m.value !== "" && (m.value = "");
			},
			registerOption(t, i) {
				let l = u$3((d) => [...d, {
					id: t,
					dataRef: i
				}]);
				s.value = l.options, p.value = l.activeOptionIndex;
			},
			unregisterOption(t) {
				let i = u$3((l) => {
					let d = l.findIndex((O) => O.id === t);
					return d !== -1 && l.splice(d, 1), l;
				});
				s.value = i.options, p.value = i.activeOptionIndex, a.value = 1;
			},
			theirOnChange(t) {
				o$2.disabled || L(t);
			},
			select(t) {
				o$2.disabled || L(u(D.value, {
					[0]: () => t,
					[1]: () => {
						let i = toRaw(k.value.value).slice(), l = toRaw(t), d = i.findIndex((O) => k.compare(l, toRaw(O)));
						return d === -1 ? i.push(l) : i.splice(d, 1), i;
					}
				}));
			}
		};
		w([f$2, v], (t, i) => {
			var l;
			k.closeListbox(), w$1(i, h$1.Loose) || (t.preventDefault(), (l = o$1(f$2)) == null || l.focus());
		}, computed(() => n.value === 0)), provide($, k), t(computed(() => u(n.value, {
			[0]: i$1.Open,
			[1]: i$1.Closed
		})));
		computed(() => {
			var t;
			return (t = o$1(f$2)) == null ? void 0 : t.closest("form");
		});
		return () => {
			let { name: t, modelValue: i, disabled: l, form: d, ...O } = o$2, h$2 = {
				open: n.value === 0,
				disabled: l,
				value: M.value
			};
			return h(Fragment, [...t != null && M.value != null ? e({ [t]: M.value }).map(([I, Q]) => h(f, E({
				features: u$2.Hidden,
				key: I,
				as: "input",
				type: "hidden",
				hidden: true,
				readOnly: true,
				form: d,
				disabled: l,
				name: I,
				value: Q
			}))) : [], A$1({
				ourProps: {},
				theirProps: {
					...r,
					...T(O, [
						"defaultValue",
						"onUpdate:modelValue",
						"horizontal",
						"multiple",
						"by"
					])
				},
				slot: h$2,
				slots: b,
				attrs: r,
				name: "Listbox"
			})]);
		};
	}
});
defineComponent({
	name: "ListboxLabel",
	props: {
		as: {
			type: [Object, String],
			default: "label"
		},
		id: {
			type: String,
			default: null
		}
	},
	setup(o$3, { attrs: b, slots: r }) {
		var f;
		let w = (f = o$3.id) != null ? f : `headlessui-listbox-label-${i()}`, n = A("ListboxLabel");
		function e() {
			var v;
			(v = o$1(n.buttonRef)) == null || v.focus({ preventScroll: true });
		}
		return () => {
			let v = {
				open: n.listboxState.value === 0,
				disabled: n.disabled.value
			}, { ...s } = o$3, m = {
				id: w,
				ref: n.labelRef,
				onClick: e
			};
			return A$1({
				ourProps: m,
				theirProps: s,
				slot: v,
				attrs: b,
				slots: r,
				name: "ListboxLabel"
			});
		};
	}
});
var je = defineComponent({
	name: "ListboxButton",
	props: {
		as: {
			type: [Object, String],
			default: "button"
		},
		id: {
			type: String,
			default: null
		}
	},
	setup(o$4, { attrs: b, slots: r, expose: w }) {
		var p;
		let n = (p = o$4.id) != null ? p : `headlessui-listbox-button-${i()}`, e = A("ListboxButton");
		w({
			el: e.buttonRef,
			$el: e.buttonRef
		});
		function f(a) {
			switch (a.key) {
				case o.Space:
				case o.Enter:
				case o.ArrowDown:
					a.preventDefault(), e.openListbox(), nextTick(() => {
						var u;
						(u = o$1(e.optionsRef)) == null || u.focus({ preventScroll: true }), e.value.value || e.goToOption(c.First);
					});
					break;
				case o.ArrowUp: a.preventDefault(), e.openListbox(), nextTick(() => {
					var u;
					(u = o$1(e.optionsRef)) == null || u.focus({ preventScroll: true }), e.value.value || e.goToOption(c.Last);
				});
			}
		}
		function v(a) {
			switch (a.key) {
				case o.Space: a.preventDefault();
			}
		}
		function s(a) {
			e.disabled.value || (e.listboxState.value === 0 ? (e.closeListbox(), nextTick(() => {
				var u;
				return (u = o$1(e.buttonRef)) == null ? void 0 : u.focus({ preventScroll: true });
			})) : (a.preventDefault(), e.openListbox(), me(() => {
				var u;
				return (u = o$1(e.optionsRef)) == null ? void 0 : u.focus({ preventScroll: true });
			})));
		}
		let m = s$1(computed(() => ({
			as: o$4.as,
			type: b.type
		})), e.buttonRef);
		return () => {
			var y, L;
			let a = {
				open: e.listboxState.value === 0,
				disabled: e.disabled.value,
				value: e.value.value
			}, { ...u } = o$4, D = {
				ref: e.buttonRef,
				id: n,
				type: m.value,
				"aria-haspopup": "listbox",
				"aria-controls": (y = o$1(e.optionsRef)) == null ? void 0 : y.id,
				"aria-expanded": e.listboxState.value === 0,
				"aria-labelledby": e.labelRef.value ? [(L = o$1(e.labelRef)) == null ? void 0 : L.id, n].join(" ") : void 0,
				disabled: e.disabled.value === true ? true : void 0,
				onKeydown: f,
				onKeyup: v,
				onClick: s
			};
			return A$1({
				ourProps: D,
				theirProps: u,
				slot: a,
				attrs: b,
				slots: r,
				name: "ListboxButton"
			});
		};
	}
});
var Ae = defineComponent({
	name: "ListboxOptions",
	props: {
		as: {
			type: [Object, String],
			default: "ul"
		},
		static: {
			type: Boolean,
			default: false
		},
		unmount: {
			type: Boolean,
			default: true
		},
		id: {
			type: String,
			default: null
		}
	},
	setup(o$5, { attrs: b, slots: r, expose: w }) {
		var p;
		let n = (p = o$5.id) != null ? p : `headlessui-listbox-options-${i()}`, e = A("ListboxOptions"), f = ref(null);
		w({
			el: e.optionsRef,
			$el: e.optionsRef
		});
		function v(a) {
			switch (f.value && clearTimeout(f.value), a.key) {
				case o.Space: if (e.searchQuery.value !== "") return a.preventDefault(), a.stopPropagation(), e.search(a.key);
				case o.Enter:
					if (a.preventDefault(), a.stopPropagation(), e.activeOptionIndex.value !== null) {
						let u = e.options.value[e.activeOptionIndex.value];
						e.select(u.dataRef.value);
					}
					e.mode.value === 0 && (e.closeListbox(), nextTick(() => {
						var u;
						return (u = o$1(e.buttonRef)) == null ? void 0 : u.focus({ preventScroll: true });
					}));
					break;
				case u(e.orientation.value, {
					vertical: o.ArrowDown,
					horizontal: o.ArrowRight
				}): return a.preventDefault(), a.stopPropagation(), e.goToOption(c.Next);
				case u(e.orientation.value, {
					vertical: o.ArrowUp,
					horizontal: o.ArrowLeft
				}): return a.preventDefault(), a.stopPropagation(), e.goToOption(c.Previous);
				case o.Home:
				case o.PageUp: return a.preventDefault(), a.stopPropagation(), e.goToOption(c.First);
				case o.End:
				case o.PageDown: return a.preventDefault(), a.stopPropagation(), e.goToOption(c.Last);
				case o.Escape:
					a.preventDefault(), a.stopPropagation(), e.closeListbox(), nextTick(() => {
						var u;
						return (u = o$1(e.buttonRef)) == null ? void 0 : u.focus({ preventScroll: true });
					});
					break;
				case o.Tab:
					a.preventDefault(), a.stopPropagation();
					break;
				default: a.key.length === 1 && (e.search(a.key), f.value = setTimeout(() => e.clearSearch(), 350));
			}
		}
		let s = l(), m = computed(() => s !== null ? (s.value & i$1.Open) === i$1.Open : e.listboxState.value === 0);
		return () => {
			var y, L;
			let a = { open: e.listboxState.value === 0 }, { ...u } = o$5, D = {
				"aria-activedescendant": e.activeOptionIndex.value === null || (y = e.options.value[e.activeOptionIndex.value]) == null ? void 0 : y.id,
				"aria-multiselectable": e.mode.value === 1 ? true : void 0,
				"aria-labelledby": (L = o$1(e.buttonRef)) == null ? void 0 : L.id,
				"aria-orientation": e.orientation.value,
				id: n,
				onKeydown: v,
				role: "listbox",
				tabIndex: 0,
				ref: e.optionsRef
			};
			return A$1({
				ourProps: D,
				theirProps: u,
				slot: a,
				attrs: b,
				slots: r,
				features: N.RenderStrategy | N.Static,
				visible: m.value,
				name: "ListboxOptions"
			});
		};
	}
});
var Fe = defineComponent({
	name: "ListboxOption",
	props: {
		as: {
			type: [Object, String],
			default: "li"
		},
		value: { type: [
			Object,
			String,
			Number,
			Boolean
		] },
		disabled: {
			type: Boolean,
			default: false
		},
		id: {
			type: String,
			default: null
		}
	},
	setup(o$6, { slots: b, attrs: r, expose: w }) {
		var C;
		let n = (C = o$6.id) != null ? C : `headlessui-listbox-option-${i()}`, e = A("ListboxOption"), f = ref(null);
		w({
			el: f,
			$el: f
		});
		let v = computed(() => e.activeOptionIndex.value !== null ? e.options.value[e.activeOptionIndex.value].id === n : false), s = computed(() => u(e.mode.value, {
			[0]: () => e.compare(toRaw(e.value.value), toRaw(o$6.value)),
			[1]: () => toRaw(e.value.value).some((t) => e.compare(toRaw(t), toRaw(o$6.value)))
		}));
		computed(() => u(e.mode.value, {
			[1]: () => {
				var i;
				let t = toRaw(e.value.value);
				return ((i = e.options.value.find((l) => t.some((d) => e.compare(toRaw(d), toRaw(l.dataRef.value))))) == null ? void 0 : i.id) === n;
			},
			[0]: () => s.value
		}));
		let p$1 = p(f);
		computed(() => ({
			disabled: o$6.disabled,
			value: o$6.value,
			get textValue() {
				return p$1();
			},
			domRef: f
		}));
		watchEffect(() => {
			e.listboxState.value === 0 && v.value && e.activationTrigger.value !== 0 && nextTick(() => {
				var t, i;
				return (i = (t = o$1(f)) == null ? void 0 : t.scrollIntoView) == null ? void 0 : i.call(t, { block: "nearest" });
			});
		});
		function u$4(t) {
			if (o$6.disabled) return t.preventDefault();
			e.select(o$6.value), e.mode.value === 0 && (e.closeListbox(), nextTick(() => {
				var i;
				return (i = o$1(e.buttonRef)) == null ? void 0 : i.focus({ preventScroll: true });
			}));
		}
		function D() {
			if (o$6.disabled) return e.goToOption(c.Nothing);
			e.goToOption(c.Specific, n);
		}
		let y = u$1();
		function L(t) {
			y.update(t);
		}
		function M(t) {
			y.wasMoved(t) && (o$6.disabled || v.value || e.goToOption(c.Specific, n, 0));
		}
		function k(t) {
			y.wasMoved(t) && (o$6.disabled || v.value && e.goToOption(c.Nothing));
		}
		return () => {
			let { disabled: t } = o$6, i = {
				active: v.value,
				selected: s.value,
				disabled: t
			}, { value: l, disabled: d, ...O } = o$6, h = {
				id: n,
				ref: f,
				role: "option",
				tabIndex: t === true ? void 0 : -1,
				"aria-disabled": t === true ? true : void 0,
				"aria-selected": s.value,
				disabled: void 0,
				onClick: u$4,
				onFocus: D,
				onPointerenter: L,
				onMouseenter: L,
				onPointermove: M,
				onMousemove: M,
				onPointerleave: k,
				onMouseleave: k
			};
			return A$1({
				ourProps: h,
				theirProps: O,
				slot: i,
				attrs: r,
				slots: b,
				name: "ListboxOption"
			});
		};
	}
});
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/forms/SelectMenu.vue
var SelectMenu_exports = /* @__PURE__ */ __exportAll({ default: () => SelectMenu_default });
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.select, select_default);
var configMenu = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.selectMenu, selectMenu_default);
var _sfc_main = defineComponent({
	components: {
		HCombobox: lt,
		HComboboxButton: nt,
		HComboboxOptions: ut,
		HComboboxOption: rt,
		HComboboxInput: it,
		HListbox: Ie,
		HListboxButton: je,
		HListboxOptions: Ae,
		HListboxOption: Fe,
		UIcon: Icon_default,
		UAvatar: Avatar_default
	},
	inheritAttrs: false,
	props: {
		modelValue: {
			type: [
				String,
				Number,
				Object,
				Array,
				Boolean
			],
			default: ""
		},
		query: {
			type: String,
			default: null
		},
		by: {
			type: String,
			default: void 0
		},
		options: {
			type: Array,
			default: () => []
		},
		id: {
			type: String,
			default: null
		},
		name: {
			type: String,
			default: null
		},
		required: {
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
		selectedIcon: {
			type: String,
			default: () => configMenu.default.selectedIcon
		},
		disabled: {
			type: Boolean,
			default: false
		},
		multiple: {
			type: Boolean,
			default: false
		},
		searchable: {
			type: [Boolean, Function],
			default: false
		},
		searchablePlaceholder: {
			type: String,
			default: () => configMenu.default.searchablePlaceholder.label
		},
		searchableLazy: {
			type: Boolean,
			default: false
		},
		clearSearchOnClose: {
			type: Boolean,
			default: () => configMenu.default.clearSearchOnClose
		},
		debounce: {
			type: Number,
			default: 200
		},
		creatable: {
			type: Boolean,
			default: false
		},
		showCreateOptionWhen: {
			type: [String, Function],
			default: () => configMenu.default.showCreateOptionWhen
		},
		placeholder: {
			type: String,
			default: null
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
		optionAttribute: {
			type: String,
			default: "label"
		},
		valueAttribute: {
			type: String,
			default: null
		},
		searchAttributes: {
			type: Array,
			default: null
		},
		inputTargetForm: {
			type: String,
			default: null
		},
		popper: {
			type: Object,
			default: () => ({})
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
		},
		uiMenu: {
			type: Object,
			default: () => ({})
		}
	},
	emits: [
		"update:modelValue",
		"update:query",
		"open",
		"close",
		"change"
	],
	setup(props, { emit, slots }) {
		const { ui, attrs } = useUI("select", toRef(props, "ui"), config, toRef(props, "class"));
		const { ui: uiMenu } = useUI("selectMenu", toRef(props, "uiMenu"), configMenu);
		const popper = computed(() => defu({}, props.popper, uiMenu.value.popper));
		const [trigger, container] = usePopper(popper.value);
		const by = computed(() => {
			if (!props.by) return void 0;
			if (typeof props.by === "function") return props.by;
			const key = props.by;
			if (key.indexOf(".") > 0) return (a, z) => {
				return accessor(a, key) === accessor(z, key);
			};
			return key;
		});
		const { size: sizeButtonGroup, rounded } = useInjectButtonGroup({
			ui,
			props
		});
		const { emitFormBlur, emitFormChange, inputId, color, size: sizeFormGroup, name } = useFormGroup(props, config);
		const size = computed(() => sizeButtonGroup.value ?? sizeFormGroup.value);
		const internalQuery = ref("");
		const query = computed({
			get() {
				return props.query ?? internalQuery.value;
			},
			set(value) {
				internalQuery.value = value;
				emit("update:query", value);
			}
		});
		const selected = computed(() => {
			function compareValues(value1, value2) {
				if (by.value && typeof by.value !== "function" && isObject(value1) && isObject(value2)) return isEqual(value1[by.value], value2[by.value]);
				return isEqual(value1, value2);
			}
			function getValue(value) {
				if (props.valueAttribute) return accessor(value, props.valueAttribute);
				return value;
			}
			if (props.multiple) {
				const modelValue = props.modelValue;
				if (!Array.isArray(modelValue) || !modelValue.length) return [];
				return options.value.filter((option) => {
					const optionValue = getValue(option);
					return modelValue.some((value) => compareValues(value, optionValue));
				});
			}
			return options.value.find((option) => {
				return compareValues(getValue(option), toRaw(props.modelValue));
			}) ?? props.modelValue;
		});
		const label = computed(() => {
			if (!props.modelValue) return null;
			if (Array.isArray(props.modelValue) && props.modelValue.length) return `${props.modelValue.length} selected`;
			else if (["string", "number"].includes(typeof props.modelValue)) return props.valueAttribute ? accessor(selected.value, props.optionAttribute) : props.modelValue;
			return accessor(props.modelValue, props.optionAttribute);
		});
		const selectClass = computed(() => {
			const variant = ui.value.color?.[color.value]?.[props.variant] || ui.value.variant[props.variant];
			return twMerge(twJoin(ui.value.base, uiMenu.value.select, rounded.value, ui.value.size[size.value], ui.value.gap[size.value], props.padded ? ui.value.padding[size.value] : "p-0", variant?.replaceAll("{color}", color.value), (isLeading.value || slots.leading) && ui.value.leading.padding[size.value], (isTrailing.value || slots.trailing) && ui.value.trailing.padding[size.value]), props.placeholder && (!props.modelValue || Array.isArray(props.modelValue) && !props.modelValue.length) && ui.value.placeholder, props.selectClass);
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
		const trailingIconClass = computed(() => {
			return twJoin(ui.value.icon.base, color.value && virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.colors.includes(color.value) && ui.value.icon.color.replaceAll("{color}", color.value), ui.value.icon.size[size.value], props.loading && !isLeading.value && ui.value.icon.loading);
		});
		const debouncedSearch = props.searchable && typeof props.searchable === "function" ? useDebounceFn(props.searchable, props.debounce) : void 0;
		const options = computedAsync(async () => {
			if (debouncedSearch) return await debouncedSearch(query.value);
			return props.options || [];
		}, [], { lazy: props.searchableLazy });
		function escapeRegExp(string) {
			return string.replace(/[.*+?^${}()|[\]\\]/g, (match) => `\\${match}`);
		}
		function accessor(obj, key) {
			return get(obj, key);
		}
		function isObject(object) {
			return !Array.isArray(object) && object !== null && typeof object === "object";
		}
		const filteredOptions = computed(() => {
			if (!query.value || debouncedSearch) return options.value;
			const escapedQuery = escapeRegExp(query.value);
			return options.value.filter((option) => {
				return (props.searchAttributes?.length ? props.searchAttributes : [props.optionAttribute]).some((searchAttribute) => {
					if (["string", "number"].includes(typeof option)) return String(option).search(new RegExp(escapedQuery, "i")) !== -1;
					const child = get(option, searchAttribute);
					return child !== null && child !== void 0 && String(child).search(new RegExp(escapedQuery, "i")) !== -1;
				});
			});
		});
		const createOption = computed(() => {
			if (query.value === "") return null;
			if (props.showCreateOptionWhen === "empty" && filteredOptions.value.length) return null;
			if (props.showCreateOptionWhen === "always") {
				if (filteredOptions.value.find((option) => ["string", "number"].includes(typeof option) ? option === query.value : accessor(option, props.optionAttribute) === query.value)) return null;
			}
			if (typeof props.showCreateOptionWhen === "function") {
				if (!props.showCreateOptionWhen(query.value, filteredOptions.value)) return null;
			}
			return ["string", "number"].includes(typeof props.modelValue) ? query.value : { [props.optionAttribute]: query.value };
		});
		function clearOnClose() {
			if (props.clearSearchOnClose) query.value = "";
		}
		watch(container, (value) => {
			if (value) emit("open");
			else {
				clearOnClose();
				emit("close");
				emitFormBlur();
			}
		});
		function onUpdate(value) {
			if (toRaw(props.modelValue) === value) return;
			emit("update:modelValue", value);
			emit("change", value);
			emitFormChange();
		}
		function onQueryChange(event) {
			query.value = event.target.value;
		}
		s(() => useId());
		return {
			ui,
			uiMenu,
			attrs,
			name,
			inputId,
			popper,
			trigger,
			container,
			selected,
			label,
			accessor,
			isLeading,
			isTrailing,
			selectClass,
			leadingIconName,
			leadingIconClass,
			leadingWrapperIconClass,
			trailingIconName,
			trailingIconClass,
			trailingWrapperIconClass,
			filteredOptions,
			createOption,
			query,
			onUpdate,
			onQueryChange,
			by
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_UIcon = Icon_default;
	const _component_HComboboxInput = resolveComponent("HComboboxInput");
	const _component_UAvatar = Avatar_default;
	ssrRenderVNode(_push, createVNode(resolveDynamicComponent(_ctx.searchable ? "HCombobox" : "HListbox"), mergeProps({
		by: _ctx.by,
		name: _ctx.name,
		"model-value": _ctx.multiple ? Array.isArray(_ctx.modelValue) ? _ctx.modelValue : [] : _ctx.modelValue,
		multiple: _ctx.multiple,
		disabled: _ctx.disabled,
		as: "div",
		class: _ctx.ui.wrapper,
		"onUpdate:modelValue": _ctx.onUpdate
	}, _attrs), {
		default: withCtx(({ open }, _push, _parent, _scopeId) => {
			if (_push) {
				if (_ctx.required) _push(`<input${ssrRenderAttr("value", _ctx.modelValue)}${ssrIncludeBooleanAttr(_ctx.required) ? " required" : ""} class="${ssrRenderClass(_ctx.uiMenu.required)}"${ssrRenderAttr("form", _ctx.inputTargetForm)} tabindex="-1" aria-hidden="true"${_scopeId}>`);
				else _push(`<!---->`);
				ssrRenderVNode(_push, createVNode(resolveDynamicComponent(_ctx.searchable ? "HComboboxButton" : "HListboxButton"), {
					ref: "trigger",
					as: "div",
					role: "button",
					class: _ctx.uiMenu.trigger
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "default", {
							open,
							disabled: _ctx.disabled,
							loading: _ctx.loading
						}, () => {
							_push(`<button${ssrRenderAttrs(mergeProps({
								id: _ctx.inputId,
								class: _ctx.selectClass,
								disabled: _ctx.disabled,
								type: "button"
							}, _ctx.attrs))}${_scopeId}>`);
							if (_ctx.isLeading && _ctx.leadingIconName || _ctx.$slots.leading) {
								_push(`<span class="${ssrRenderClass(_ctx.leadingWrapperIconClass)}"${_scopeId}>`);
								ssrRenderSlot(_ctx.$slots, "leading", {
									selected: _ctx.selected,
									disabled: _ctx.disabled,
									loading: _ctx.loading
								}, () => {
									_push(ssrRenderComponent(_component_UIcon, {
										name: _ctx.leadingIconName,
										class: _ctx.leadingIconClass
									}, null, _parent, _scopeId));
								}, _push, _parent, _scopeId);
								_push(`</span>`);
							} else _push(`<!---->`);
							ssrRenderSlot(_ctx.$slots, "label", { selected: _ctx.selected }, () => {
								if (_ctx.label) _push(`<span class="${ssrRenderClass(_ctx.uiMenu.label)}"${_scopeId}>${ssrInterpolate(_ctx.label)}</span>`);
								else _push(`<span class="${ssrRenderClass(_ctx.uiMenu.label)}"${_scopeId}>${ssrInterpolate(_ctx.placeholder || "\xA0")}</span>`);
							}, _push, _parent, _scopeId);
							if (_ctx.isTrailing && _ctx.trailingIconName || _ctx.$slots.trailing) {
								_push(`<span class="${ssrRenderClass(_ctx.trailingWrapperIconClass)}"${_scopeId}>`);
								ssrRenderSlot(_ctx.$slots, "trailing", {
									selected: _ctx.selected,
									disabled: _ctx.disabled,
									loading: _ctx.loading
								}, () => {
									_push(ssrRenderComponent(_component_UIcon, {
										name: _ctx.trailingIconName,
										class: _ctx.trailingIconClass,
										"aria-hidden": "true"
									}, null, _parent, _scopeId));
								}, _push, _parent, _scopeId);
								_push(`</span>`);
							} else _push(`<!---->`);
							_push(`</button>`);
						}, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "default", {
							open,
							disabled: _ctx.disabled,
							loading: _ctx.loading
						}, () => [createVNode("button", mergeProps({
							id: _ctx.inputId,
							class: _ctx.selectClass,
							disabled: _ctx.disabled,
							type: "button"
						}, _ctx.attrs), [
							_ctx.isLeading && _ctx.leadingIconName || _ctx.$slots.leading ? (openBlock(), createBlock("span", {
								key: 0,
								class: _ctx.leadingWrapperIconClass
							}, [renderSlot(_ctx.$slots, "leading", {
								selected: _ctx.selected,
								disabled: _ctx.disabled,
								loading: _ctx.loading
							}, () => [createVNode(_component_UIcon, {
								name: _ctx.leadingIconName,
								class: _ctx.leadingIconClass
							}, null, 8, ["name", "class"])])], 2)) : createCommentVNode("", true),
							renderSlot(_ctx.$slots, "label", { selected: _ctx.selected }, () => [_ctx.label ? (openBlock(), createBlock("span", {
								key: 0,
								class: _ctx.uiMenu.label
							}, toDisplayString(_ctx.label), 3)) : (openBlock(), createBlock("span", {
								key: 1,
								class: _ctx.uiMenu.label
							}, toDisplayString(_ctx.placeholder || "\xA0"), 3))]),
							_ctx.isTrailing && _ctx.trailingIconName || _ctx.$slots.trailing ? (openBlock(), createBlock("span", {
								key: 1,
								class: _ctx.trailingWrapperIconClass
							}, [renderSlot(_ctx.$slots, "trailing", {
								selected: _ctx.selected,
								disabled: _ctx.disabled,
								loading: _ctx.loading
							}, () => [createVNode(_component_UIcon, {
								name: _ctx.trailingIconName,
								class: _ctx.trailingIconClass,
								"aria-hidden": "true"
							}, null, 8, ["name", "class"])])], 2)) : createCommentVNode("", true)
						], 16, ["id", "disabled"])])];
					}),
					_: 2
				}), _parent, _scopeId);
				if (open) {
					_push(`<div class="${ssrRenderClass([_ctx.uiMenu.container, _ctx.uiMenu.width])}"${_scopeId}><template><div${_scopeId}>`);
					if (_ctx.popper.arrow) _push(`<div data-popper-arrow class="${ssrRenderClass(Object.values(_ctx.uiMenu.arrow))}"${_scopeId}></div>`);
					else _push(`<!---->`);
					ssrRenderVNode(_push, createVNode(resolveDynamicComponent(_ctx.searchable ? "HComboboxOptions" : "HListboxOptions"), {
						static: "",
						class: [
							_ctx.uiMenu.base,
							_ctx.uiMenu.ring,
							_ctx.uiMenu.rounded,
							_ctx.uiMenu.shadow,
							_ctx.uiMenu.background,
							_ctx.uiMenu.padding,
							_ctx.uiMenu.height
						]
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								if (_ctx.searchable) _push(ssrRenderComponent(_component_HComboboxInput, {
									"display-value": () => _ctx.query,
									name: "q",
									placeholder: _ctx.searchablePlaceholder,
									autofocus: "",
									autocomplete: "off",
									class: _ctx.uiMenu.input,
									onChange: _ctx.onQueryChange
								}, null, _parent, _scopeId));
								else _push(`<!---->`);
								_push(`<!--[-->`);
								ssrRenderList(_ctx.filteredOptions, (option, index) => {
									ssrRenderVNode(_push, createVNode(resolveDynamicComponent(_ctx.searchable ? "HComboboxOption" : "HListboxOption"), {
										key: index,
										as: "template",
										value: _ctx.valueAttribute ? _ctx.accessor(option, _ctx.valueAttribute) : option,
										disabled: option.disabled
									}, {
										default: withCtx(({ active, selected: optionSelected, disabled: optionDisabled }, _push, _parent, _scopeId) => {
											if (_push) {
												_push(`<li class="${ssrRenderClass([
													_ctx.uiMenu.option.base,
													_ctx.uiMenu.option.rounded,
													_ctx.uiMenu.option.padding,
													_ctx.uiMenu.option.size,
													_ctx.uiMenu.option.color,
													active ? _ctx.uiMenu.option.active : _ctx.uiMenu.option.inactive,
													optionSelected && _ctx.uiMenu.option.selected,
													optionDisabled && _ctx.uiMenu.option.disabled
												])}"${_scopeId}><div class="${ssrRenderClass(_ctx.uiMenu.option.container)}"${_scopeId}>`);
												ssrRenderSlot(_ctx.$slots, "option", {
													option,
													active,
													selected: optionSelected
												}, () => {
													if (option.icon) _push(ssrRenderComponent(_component_UIcon, {
														name: option.icon,
														class: [
															_ctx.uiMenu.option.icon.base,
															active ? _ctx.uiMenu.option.icon.active : _ctx.uiMenu.option.icon.inactive,
															option.iconClass
														],
														"aria-hidden": "true"
													}, null, _parent, _scopeId));
													else if (option.avatar) _push(ssrRenderComponent(_component_UAvatar, mergeProps({ ref_for: true }, {
														size: _ctx.uiMenu.option.avatar.size,
														...option.avatar
													}, {
														class: _ctx.uiMenu.option.avatar.base,
														"aria-hidden": "true"
													}), null, _parent, _scopeId));
													else if (option.chip) _push(`<span class="${ssrRenderClass(_ctx.uiMenu.option.chip.base)}" style="${ssrRenderStyle({ background: `#${option.chip}` })}"${_scopeId}></span>`);
													else _push(`<!---->`);
													_push(`<span class="truncate"${_scopeId}>${ssrInterpolate(["string", "number"].includes(typeof option) ? option : _ctx.accessor(option, _ctx.optionAttribute))}</span>`);
												}, _push, _parent, _scopeId);
												_push(`</div>`);
												if (optionSelected) {
													_push(`<span class="${ssrRenderClass([_ctx.uiMenu.option.selectedIcon.wrapper, _ctx.uiMenu.option.selectedIcon.padding])}"${_scopeId}>`);
													_push(ssrRenderComponent(_component_UIcon, {
														name: _ctx.selectedIcon,
														class: _ctx.uiMenu.option.selectedIcon.base,
														"aria-hidden": "true"
													}, null, _parent, _scopeId));
													_push(`</span>`);
												} else _push(`<!---->`);
												_push(`</li>`);
											} else return [createVNode("li", { class: [
												_ctx.uiMenu.option.base,
												_ctx.uiMenu.option.rounded,
												_ctx.uiMenu.option.padding,
												_ctx.uiMenu.option.size,
												_ctx.uiMenu.option.color,
												active ? _ctx.uiMenu.option.active : _ctx.uiMenu.option.inactive,
												optionSelected && _ctx.uiMenu.option.selected,
												optionDisabled && _ctx.uiMenu.option.disabled
											] }, [createVNode("div", { class: _ctx.uiMenu.option.container }, [renderSlot(_ctx.$slots, "option", {
												option,
												active,
												selected: optionSelected
											}, () => [option.icon ? (openBlock(), createBlock(_component_UIcon, {
												key: 0,
												name: option.icon,
												class: [
													_ctx.uiMenu.option.icon.base,
													active ? _ctx.uiMenu.option.icon.active : _ctx.uiMenu.option.icon.inactive,
													option.iconClass
												],
												"aria-hidden": "true"
											}, null, 8, ["name", "class"])) : option.avatar ? (openBlock(), createBlock(_component_UAvatar, mergeProps({
												key: 1,
												ref_for: true
											}, {
												size: _ctx.uiMenu.option.avatar.size,
												...option.avatar
											}, {
												class: _ctx.uiMenu.option.avatar.base,
												"aria-hidden": "true"
											}), null, 16, ["class"])) : option.chip ? (openBlock(), createBlock("span", {
												key: 2,
												class: _ctx.uiMenu.option.chip.base,
												style: { background: `#${option.chip}` }
											}, null, 6)) : createCommentVNode("", true), createVNode("span", { class: "truncate" }, toDisplayString(["string", "number"].includes(typeof option) ? option : _ctx.accessor(option, _ctx.optionAttribute)), 1)])], 2), optionSelected ? (openBlock(), createBlock("span", {
												key: 0,
												class: [_ctx.uiMenu.option.selectedIcon.wrapper, _ctx.uiMenu.option.selectedIcon.padding]
											}, [createVNode(_component_UIcon, {
												name: _ctx.selectedIcon,
												class: _ctx.uiMenu.option.selectedIcon.base,
												"aria-hidden": "true"
											}, null, 8, ["name", "class"])], 2)) : createCommentVNode("", true)], 2)];
										}),
										_: 2
									}), _parent, _scopeId);
								});
								_push(`<!--]-->`);
								if (_ctx.creatable && _ctx.createOption) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(_ctx.searchable ? "HComboboxOption" : "HListboxOption"), {
									value: _ctx.createOption,
									as: "template"
								}, {
									default: withCtx(({ active, selected: optionSelected }, _push, _parent, _scopeId) => {
										if (_push) {
											_push(`<li class="${ssrRenderClass([
												_ctx.uiMenu.option.base,
												_ctx.uiMenu.option.rounded,
												_ctx.uiMenu.option.padding,
												_ctx.uiMenu.option.size,
												_ctx.uiMenu.option.color,
												active ? _ctx.uiMenu.option.active : _ctx.uiMenu.option.inactive
											])}"${_scopeId}><div class="${ssrRenderClass(_ctx.uiMenu.option.container)}"${_scopeId}>`);
											ssrRenderSlot(_ctx.$slots, "option-create", {
												option: _ctx.createOption,
												active,
												selected: optionSelected
											}, () => {
												_push(`<span class="${ssrRenderClass(_ctx.uiMenu.option.create)}"${_scopeId}>Create &quot;${ssrInterpolate(typeof _ctx.createOption === "string" ? _ctx.createOption : _ctx.accessor(_ctx.createOption, _ctx.optionAttribute))}&quot;</span>`);
											}, _push, _parent, _scopeId);
											_push(`</div></li>`);
										} else return [createVNode("li", { class: [
											_ctx.uiMenu.option.base,
											_ctx.uiMenu.option.rounded,
											_ctx.uiMenu.option.padding,
											_ctx.uiMenu.option.size,
											_ctx.uiMenu.option.color,
											active ? _ctx.uiMenu.option.active : _ctx.uiMenu.option.inactive
										] }, [createVNode("div", { class: _ctx.uiMenu.option.container }, [renderSlot(_ctx.$slots, "option-create", {
											option: _ctx.createOption,
											active,
											selected: optionSelected
										}, () => [createVNode("span", { class: _ctx.uiMenu.option.create }, "Create \"" + toDisplayString(typeof _ctx.createOption === "string" ? _ctx.createOption : _ctx.accessor(_ctx.createOption, _ctx.optionAttribute)) + "\"", 3)])], 2)], 2)];
									}),
									_: 2
								}), _parent, _scopeId);
								else if (_ctx.searchable && _ctx.query && !_ctx.filteredOptions?.length) {
									_push(`<p class="${ssrRenderClass(_ctx.uiMenu.option.empty)}"${_scopeId}>`);
									ssrRenderSlot(_ctx.$slots, "option-empty", { query: _ctx.query }, () => {
										_push(`${ssrInterpolate(_ctx.uiMenu.default.optionEmpty.label.replace("{query}", _ctx.query))}`);
									}, _push, _parent, _scopeId);
									_push(`</p>`);
								} else if (!_ctx.filteredOptions?.length) {
									_push(`<p class="${ssrRenderClass(_ctx.uiMenu.empty)}"${_scopeId}>`);
									ssrRenderSlot(_ctx.$slots, "empty", { query: _ctx.query }, () => {
										_push(`${ssrInterpolate(_ctx.uiMenu.default.empty.label)}`);
									}, _push, _parent, _scopeId);
									_push(`</p>`);
								} else _push(`<!---->`);
							} else return [
								_ctx.searchable ? (openBlock(), createBlock(_component_HComboboxInput, {
									key: 0,
									"display-value": () => _ctx.query,
									name: "q",
									placeholder: _ctx.searchablePlaceholder,
									autofocus: "",
									autocomplete: "off",
									class: _ctx.uiMenu.input,
									onChange: _ctx.onQueryChange
								}, null, 8, [
									"display-value",
									"placeholder",
									"class",
									"onChange"
								])) : createCommentVNode("", true),
								(openBlock(true), createBlock(Fragment, null, renderList(_ctx.filteredOptions, (option, index) => {
									return openBlock(), createBlock(resolveDynamicComponent(_ctx.searchable ? "HComboboxOption" : "HListboxOption"), {
										key: index,
										as: "template",
										value: _ctx.valueAttribute ? _ctx.accessor(option, _ctx.valueAttribute) : option,
										disabled: option.disabled
									}, {
										default: withCtx(({ active, selected: optionSelected, disabled: optionDisabled }) => [createVNode("li", { class: [
											_ctx.uiMenu.option.base,
											_ctx.uiMenu.option.rounded,
											_ctx.uiMenu.option.padding,
											_ctx.uiMenu.option.size,
											_ctx.uiMenu.option.color,
											active ? _ctx.uiMenu.option.active : _ctx.uiMenu.option.inactive,
											optionSelected && _ctx.uiMenu.option.selected,
											optionDisabled && _ctx.uiMenu.option.disabled
										] }, [createVNode("div", { class: _ctx.uiMenu.option.container }, [renderSlot(_ctx.$slots, "option", {
											option,
											active,
											selected: optionSelected
										}, () => [option.icon ? (openBlock(), createBlock(_component_UIcon, {
											key: 0,
											name: option.icon,
											class: [
												_ctx.uiMenu.option.icon.base,
												active ? _ctx.uiMenu.option.icon.active : _ctx.uiMenu.option.icon.inactive,
												option.iconClass
											],
											"aria-hidden": "true"
										}, null, 8, ["name", "class"])) : option.avatar ? (openBlock(), createBlock(_component_UAvatar, mergeProps({
											key: 1,
											ref_for: true
										}, {
											size: _ctx.uiMenu.option.avatar.size,
											...option.avatar
										}, {
											class: _ctx.uiMenu.option.avatar.base,
											"aria-hidden": "true"
										}), null, 16, ["class"])) : option.chip ? (openBlock(), createBlock("span", {
											key: 2,
											class: _ctx.uiMenu.option.chip.base,
											style: { background: `#${option.chip}` }
										}, null, 6)) : createCommentVNode("", true), createVNode("span", { class: "truncate" }, toDisplayString(["string", "number"].includes(typeof option) ? option : _ctx.accessor(option, _ctx.optionAttribute)), 1)])], 2), optionSelected ? (openBlock(), createBlock("span", {
											key: 0,
											class: [_ctx.uiMenu.option.selectedIcon.wrapper, _ctx.uiMenu.option.selectedIcon.padding]
										}, [createVNode(_component_UIcon, {
											name: _ctx.selectedIcon,
											class: _ctx.uiMenu.option.selectedIcon.base,
											"aria-hidden": "true"
										}, null, 8, ["name", "class"])], 2)) : createCommentVNode("", true)], 2)]),
										_: 2
									}, 1032, ["value", "disabled"]);
								}), 128)),
								_ctx.creatable && _ctx.createOption ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.searchable ? "HComboboxOption" : "HListboxOption"), {
									key: 1,
									value: _ctx.createOption,
									as: "template"
								}, {
									default: withCtx(({ active, selected: optionSelected }) => [createVNode("li", { class: [
										_ctx.uiMenu.option.base,
										_ctx.uiMenu.option.rounded,
										_ctx.uiMenu.option.padding,
										_ctx.uiMenu.option.size,
										_ctx.uiMenu.option.color,
										active ? _ctx.uiMenu.option.active : _ctx.uiMenu.option.inactive
									] }, [createVNode("div", { class: _ctx.uiMenu.option.container }, [renderSlot(_ctx.$slots, "option-create", {
										option: _ctx.createOption,
										active,
										selected: optionSelected
									}, () => [createVNode("span", { class: _ctx.uiMenu.option.create }, "Create \"" + toDisplayString(typeof _ctx.createOption === "string" ? _ctx.createOption : _ctx.accessor(_ctx.createOption, _ctx.optionAttribute)) + "\"", 3)])], 2)], 2)]),
									_: 3
								}, 8, ["value"])) : _ctx.searchable && _ctx.query && !_ctx.filteredOptions?.length ? (openBlock(), createBlock("p", {
									key: 2,
									class: _ctx.uiMenu.option.empty
								}, [renderSlot(_ctx.$slots, "option-empty", { query: _ctx.query }, () => [createTextVNode(toDisplayString(_ctx.uiMenu.default.optionEmpty.label.replace("{query}", _ctx.query)), 1)])], 2)) : !_ctx.filteredOptions?.length ? (openBlock(), createBlock("p", {
									key: 3,
									class: _ctx.uiMenu.empty
								}, [renderSlot(_ctx.$slots, "empty", { query: _ctx.query }, () => [createTextVNode(toDisplayString(_ctx.uiMenu.default.empty.label), 1)])], 2)) : createCommentVNode("", true)
							];
						}),
						_: 2
					}), _parent, _scopeId);
					_push(`</div></template></div>`);
				} else _push(`<!---->`);
			} else return [
				_ctx.required ? (openBlock(), createBlock("input", {
					key: 0,
					value: _ctx.modelValue,
					required: _ctx.required,
					class: _ctx.uiMenu.required,
					form: _ctx.inputTargetForm,
					tabindex: "-1",
					"aria-hidden": "true"
				}, null, 10, [
					"value",
					"required",
					"form"
				])) : createCommentVNode("", true),
				(openBlock(), createBlock(resolveDynamicComponent(_ctx.searchable ? "HComboboxButton" : "HListboxButton"), {
					ref: "trigger",
					as: "div",
					role: "button",
					class: _ctx.uiMenu.trigger
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
						open,
						disabled: _ctx.disabled,
						loading: _ctx.loading
					}, () => [createVNode("button", mergeProps({
						id: _ctx.inputId,
						class: _ctx.selectClass,
						disabled: _ctx.disabled,
						type: "button"
					}, _ctx.attrs), [
						_ctx.isLeading && _ctx.leadingIconName || _ctx.$slots.leading ? (openBlock(), createBlock("span", {
							key: 0,
							class: _ctx.leadingWrapperIconClass
						}, [renderSlot(_ctx.$slots, "leading", {
							selected: _ctx.selected,
							disabled: _ctx.disabled,
							loading: _ctx.loading
						}, () => [createVNode(_component_UIcon, {
							name: _ctx.leadingIconName,
							class: _ctx.leadingIconClass
						}, null, 8, ["name", "class"])])], 2)) : createCommentVNode("", true),
						renderSlot(_ctx.$slots, "label", { selected: _ctx.selected }, () => [_ctx.label ? (openBlock(), createBlock("span", {
							key: 0,
							class: _ctx.uiMenu.label
						}, toDisplayString(_ctx.label), 3)) : (openBlock(), createBlock("span", {
							key: 1,
							class: _ctx.uiMenu.label
						}, toDisplayString(_ctx.placeholder || "\xA0"), 3))]),
						_ctx.isTrailing && _ctx.trailingIconName || _ctx.$slots.trailing ? (openBlock(), createBlock("span", {
							key: 1,
							class: _ctx.trailingWrapperIconClass
						}, [renderSlot(_ctx.$slots, "trailing", {
							selected: _ctx.selected,
							disabled: _ctx.disabled,
							loading: _ctx.loading
						}, () => [createVNode(_component_UIcon, {
							name: _ctx.trailingIconName,
							class: _ctx.trailingIconClass,
							"aria-hidden": "true"
						}, null, 8, ["name", "class"])])], 2)) : createCommentVNode("", true)
					], 16, ["id", "disabled"])])]),
					_: 2
				}, 1032, ["class"])),
				open ? (openBlock(), createBlock("div", {
					key: 1,
					ref: "container",
					class: [_ctx.uiMenu.container, _ctx.uiMenu.width]
				}, [createVNode(Transition, mergeProps({ appear: "" }, _ctx.uiMenu.transition), {
					default: withCtx(() => [createVNode("div", null, [_ctx.popper.arrow ? (openBlock(), createBlock("div", {
						key: 0,
						"data-popper-arrow": "",
						class: Object.values(_ctx.uiMenu.arrow)
					}, null, 2)) : createCommentVNode("", true), (openBlock(), createBlock(resolveDynamicComponent(_ctx.searchable ? "HComboboxOptions" : "HListboxOptions"), {
						static: "",
						class: [
							_ctx.uiMenu.base,
							_ctx.uiMenu.ring,
							_ctx.uiMenu.rounded,
							_ctx.uiMenu.shadow,
							_ctx.uiMenu.background,
							_ctx.uiMenu.padding,
							_ctx.uiMenu.height
						]
					}, {
						default: withCtx(() => [
							_ctx.searchable ? (openBlock(), createBlock(_component_HComboboxInput, {
								key: 0,
								"display-value": () => _ctx.query,
								name: "q",
								placeholder: _ctx.searchablePlaceholder,
								autofocus: "",
								autocomplete: "off",
								class: _ctx.uiMenu.input,
								onChange: _ctx.onQueryChange
							}, null, 8, [
								"display-value",
								"placeholder",
								"class",
								"onChange"
							])) : createCommentVNode("", true),
							(openBlock(true), createBlock(Fragment, null, renderList(_ctx.filteredOptions, (option, index) => {
								return openBlock(), createBlock(resolveDynamicComponent(_ctx.searchable ? "HComboboxOption" : "HListboxOption"), {
									key: index,
									as: "template",
									value: _ctx.valueAttribute ? _ctx.accessor(option, _ctx.valueAttribute) : option,
									disabled: option.disabled
								}, {
									default: withCtx(({ active, selected: optionSelected, disabled: optionDisabled }) => [createVNode("li", { class: [
										_ctx.uiMenu.option.base,
										_ctx.uiMenu.option.rounded,
										_ctx.uiMenu.option.padding,
										_ctx.uiMenu.option.size,
										_ctx.uiMenu.option.color,
										active ? _ctx.uiMenu.option.active : _ctx.uiMenu.option.inactive,
										optionSelected && _ctx.uiMenu.option.selected,
										optionDisabled && _ctx.uiMenu.option.disabled
									] }, [createVNode("div", { class: _ctx.uiMenu.option.container }, [renderSlot(_ctx.$slots, "option", {
										option,
										active,
										selected: optionSelected
									}, () => [option.icon ? (openBlock(), createBlock(_component_UIcon, {
										key: 0,
										name: option.icon,
										class: [
											_ctx.uiMenu.option.icon.base,
											active ? _ctx.uiMenu.option.icon.active : _ctx.uiMenu.option.icon.inactive,
											option.iconClass
										],
										"aria-hidden": "true"
									}, null, 8, ["name", "class"])) : option.avatar ? (openBlock(), createBlock(_component_UAvatar, mergeProps({
										key: 1,
										ref_for: true
									}, {
										size: _ctx.uiMenu.option.avatar.size,
										...option.avatar
									}, {
										class: _ctx.uiMenu.option.avatar.base,
										"aria-hidden": "true"
									}), null, 16, ["class"])) : option.chip ? (openBlock(), createBlock("span", {
										key: 2,
										class: _ctx.uiMenu.option.chip.base,
										style: { background: `#${option.chip}` }
									}, null, 6)) : createCommentVNode("", true), createVNode("span", { class: "truncate" }, toDisplayString(["string", "number"].includes(typeof option) ? option : _ctx.accessor(option, _ctx.optionAttribute)), 1)])], 2), optionSelected ? (openBlock(), createBlock("span", {
										key: 0,
										class: [_ctx.uiMenu.option.selectedIcon.wrapper, _ctx.uiMenu.option.selectedIcon.padding]
									}, [createVNode(_component_UIcon, {
										name: _ctx.selectedIcon,
										class: _ctx.uiMenu.option.selectedIcon.base,
										"aria-hidden": "true"
									}, null, 8, ["name", "class"])], 2)) : createCommentVNode("", true)], 2)]),
									_: 2
								}, 1032, ["value", "disabled"]);
							}), 128)),
							_ctx.creatable && _ctx.createOption ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.searchable ? "HComboboxOption" : "HListboxOption"), {
								key: 1,
								value: _ctx.createOption,
								as: "template"
							}, {
								default: withCtx(({ active, selected: optionSelected }) => [createVNode("li", { class: [
									_ctx.uiMenu.option.base,
									_ctx.uiMenu.option.rounded,
									_ctx.uiMenu.option.padding,
									_ctx.uiMenu.option.size,
									_ctx.uiMenu.option.color,
									active ? _ctx.uiMenu.option.active : _ctx.uiMenu.option.inactive
								] }, [createVNode("div", { class: _ctx.uiMenu.option.container }, [renderSlot(_ctx.$slots, "option-create", {
									option: _ctx.createOption,
									active,
									selected: optionSelected
								}, () => [createVNode("span", { class: _ctx.uiMenu.option.create }, "Create \"" + toDisplayString(typeof _ctx.createOption === "string" ? _ctx.createOption : _ctx.accessor(_ctx.createOption, _ctx.optionAttribute)) + "\"", 3)])], 2)], 2)]),
								_: 3
							}, 8, ["value"])) : _ctx.searchable && _ctx.query && !_ctx.filteredOptions?.length ? (openBlock(), createBlock("p", {
								key: 2,
								class: _ctx.uiMenu.option.empty
							}, [renderSlot(_ctx.$slots, "option-empty", { query: _ctx.query }, () => [createTextVNode(toDisplayString(_ctx.uiMenu.default.optionEmpty.label.replace("{query}", _ctx.query)), 1)])], 2)) : !_ctx.filteredOptions?.length ? (openBlock(), createBlock("p", {
								key: 3,
								class: _ctx.uiMenu.empty
							}, [renderSlot(_ctx.$slots, "empty", { query: _ctx.query }, () => [createTextVNode(toDisplayString(_ctx.uiMenu.default.empty.label), 1)])], 2)) : createCommentVNode("", true)
						]),
						_: 3
					}, 8, ["class"]))])]),
					_: 3
				}, 16)], 2)) : createCommentVNode("", true)
			];
		}),
		_: 3
	}), _parent);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/forms/SelectMenu.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var SelectMenu_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "USelectMenu" });

export { SelectMenu_exports as n, SelectMenu_default as t };
//# sourceMappingURL=SelectMenu-Bw_jkCZn.mjs.map
