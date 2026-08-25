import { d, e } from './form-BjTHmaPY.mjs';
import { t as t$2, o as o$2 } from './active-element-history-BkxR87qo.mjs';
import { i as i$1, o as o$1, A, T, u, E, N, a as o } from './keyboard-DE1QlhcY.mjs';
import { i as i$2, O } from './focus-management-DXpqooZk.mjs';
import { w, n } from './use-outside-click-E0zCHGRJ.mjs';
import { s } from './use-resolve-button-type-DZKnDGM_.mjs';
import { u as u$1, i as i$4, c, f as f$1 } from './calculate-active-index-CJA4E3gh.mjs';
import { f, u as u$2 } from './hidden-UkYquSML.mjs';
import { l, i as i$3, t as t$1 } from './open-closed-Css0b1VQ.mjs';
import { defineComponent, computed, ref, inject, watchEffect, nextTick, watch, provide, h, Fragment, toRaw, reactive, cloneVNode } from 'vue';
import { useVirtualizer } from '@tanstack/vue-virtual';

//#region node_modules/@headlessui/vue/dist/hooks/use-disposables.js
function i() {
	return o$2();
}
//#endregion
//#region node_modules/@headlessui/vue/dist/hooks/use-frame-debounce.js
function t() {
	let e = i();
	return (o) => {
		e.dispose(), e.nextFrame(o);
	};
}
//#endregion
//#region node_modules/@headlessui/vue/dist/mouse.js
var g = ((f) => (f[f.Left = 0] = "Left", f[f.Right = 2] = "Right", f))(g || {});
//#endregion
//#region node_modules/@headlessui/vue/dist/components/combobox/combobox.js
function De(a, h) {
	return a === h;
}
var Ee = ((r) => (r[r.Open = 0] = "Open", r[r.Closed = 1] = "Closed", r))(Ee || {});
var Ve = ((r) => (r[r.Single = 0] = "Single", r[r.Multi = 1] = "Multi", r))(Ve || {});
var ke = ((y) => (y[y.Pointer = 0] = "Pointer", y[y.Focus = 1] = "Focus", y[y.Other = 2] = "Other", y))(ke || {});
var ne = Symbol("ComboboxContext");
function K(a) {
	let h = inject(ne, null);
	if (h === null) {
		let r = /* @__PURE__ */ new Error(`<${a} /> is missing a parent <Combobox /> component.`);
		throw Error.captureStackTrace && Error.captureStackTrace(r, K), r;
	}
	return h;
}
var ie = Symbol("VirtualContext");
var Ae = defineComponent({
	name: "VirtualProvider",
	setup(a, { slots: h$1 }) {
		let r = K("VirtualProvider"), y = computed(() => {
			let c = o$1(r.optionsRef);
			if (!c) return {
				start: 0,
				end: 0
			};
			let f = (void 0).getComputedStyle(c);
			return {
				start: parseFloat(f.paddingBlockStart || f.paddingTop),
				end: parseFloat(f.paddingBlockEnd || f.paddingBottom)
			};
		}), o = useVirtualizer(computed(() => ({
			scrollPaddingStart: y.value.start,
			scrollPaddingEnd: y.value.end,
			count: r.virtual.value.options.length,
			estimateSize() {
				return 40;
			},
			getScrollElement() {
				return o$1(r.optionsRef);
			},
			overscan: 12
		}))), u = computed(() => {
			var c;
			return (c = r.virtual.value) == null ? void 0 : c.options;
		}), e = ref(0);
		return watch([u], () => {
			e.value += 1;
		}), provide(ie, r.virtual.value ? o : null), () => [h("div", {
			style: {
				position: "relative",
				width: "100%",
				height: `${o.value.getTotalSize()}px`
			},
			ref: (c) => {
				if (c) {
					if (typeof process != "undefined" && process.env.JEST_WORKER_ID !== void 0 || r.activationTrigger.value === 0) return;
					r.activeOptionIndex.value !== null && r.virtual.value.options.length > r.activeOptionIndex.value && o.value.scrollToIndex(r.activeOptionIndex.value);
				}
			}
		}, o.value.getVirtualItems().map((c) => cloneVNode(h$1.default({
			option: r.virtual.value.options[c.index],
			open: r.comboboxState.value === 0
		})[0], {
			key: `${e.value}-${c.index}`,
			"data-index": c.index,
			"aria-setsize": r.virtual.value.options.length,
			"aria-posinset": c.index + 1,
			style: {
				position: "absolute",
				top: 0,
				left: 0,
				transform: `translateY(${c.start}px)`,
				overflowAnchor: "none"
			}
		})))];
	}
});
var lt = defineComponent({
	name: "Combobox",
	emits: { "update:modelValue": (a) => true },
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
			nullable: true,
			default: null
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
		nullable: {
			type: Boolean,
			default: false
		},
		multiple: {
			type: [Boolean],
			default: false
		},
		immediate: {
			type: [Boolean],
			default: false
		},
		virtual: {
			type: Object,
			default: null
		}
	},
	inheritAttrs: false,
	setup(a, { slots: h$2, attrs: r, emit: y }) {
		let o = ref(1), u$3 = ref(null), e$1 = ref(null), c$1 = ref(null), f$2 = ref(null), S = ref({
			static: false,
			hold: false
		}), v = ref([]), d$1 = ref(null), D = ref(2), E$1 = ref(false);
		function w$1(t = (n) => n) {
			let n = d$1.value !== null ? v.value[d$1.value] : null, s = t(v.value.slice()), b = s.length > 0 && s[0].dataRef.order.value !== null ? s.sort((C, A) => C.dataRef.order.value - A.dataRef.order.value) : O(s, (C) => o$1(C.dataRef.domRef)), O$1 = n ? b.indexOf(n) : null;
			return O$1 === -1 && (O$1 = null), {
				options: b,
				activeOptionIndex: O$1
			};
		}
		let M = computed(() => a.multiple ? 1 : 0), $ = computed(() => a.nullable), [B, p] = d(computed(() => a.modelValue), (t) => y("update:modelValue", t), computed(() => a.defaultValue)), R = computed(() => B.value === void 0 ? u(M.value, {
			[1]: [],
			[0]: void 0
		}) : B.value), V = null, i = null;
		function I(t) {
			return u(M.value, {
				[0]() {
					return p == null ? void 0 : p(t);
				},
				[1]: () => {
					let n = toRaw(l.value.value).slice(), s = toRaw(t), b = n.findIndex((O) => l.compare(s, toRaw(O)));
					return b === -1 ? n.push(s) : n.splice(b, 1), p == null ? void 0 : p(n);
				}
			});
		}
		let T$1 = computed(() => {});
		watch([T$1], ([t], [n]) => {
			if (l.virtual.value && t && n && d$1.value !== null) {
				let s = t.indexOf(n[d$1.value]);
				s !== -1 ? d$1.value = s : d$1.value = null;
			}
		});
		let l = {
			comboboxState: o,
			value: R,
			mode: M,
			compare(t, n) {
				if (typeof a.by == "string") {
					let s = a.by;
					return (t == null ? void 0 : t[s]) === (n == null ? void 0 : n[s]);
				}
				return a.by === null ? De(t, n) : a.by(t, n);
			},
			calculateIndex(t) {
				return l.virtual.value ? a.by === null ? l.virtual.value.options.indexOf(t) : l.virtual.value.options.findIndex((n) => l.compare(n, t)) : v.value.findIndex((n) => l.compare(n.dataRef.value, t));
			},
			defaultValue: computed(() => a.defaultValue),
			nullable: $,
			immediate: computed(() => false),
			virtual: computed(() => null),
			inputRef: e$1,
			labelRef: u$3,
			buttonRef: c$1,
			optionsRef: f$2,
			disabled: computed(() => a.disabled),
			options: v,
			change(t) {
				p(t);
			},
			activeOptionIndex: computed(() => {
				if (E$1.value && d$1.value === null && (l.virtual.value ? l.virtual.value.options.length > 0 : v.value.length > 0)) {
					if (l.virtual.value) {
						let n = l.virtual.value.options.findIndex((s) => {
							var b;
							return !((b = l.virtual.value) != null && b.disabled(s));
						});
						if (n !== -1) return n;
					}
					let t = v.value.findIndex((n) => !n.dataRef.disabled);
					if (t !== -1) return t;
				}
				return d$1.value;
			}),
			activationTrigger: D,
			optionsPropsRef: S,
			closeCombobox() {
				E$1.value = false, !a.disabled && o.value !== 1 && (o.value = 1, d$1.value = null);
			},
			openCombobox() {
				if (E$1.value = true, !a.disabled && o.value !== 0) {
					if (l.value.value) {
						let t = l.calculateIndex(l.value.value);
						t !== -1 && (d$1.value = t);
					}
					o.value = 0;
				}
			},
			setActivationTrigger(t) {
				D.value = t;
			},
			goToOption(t, n, s) {
				E$1.value = false, V !== null && cancelAnimationFrame(V), V = requestAnimationFrame(() => {
					if (a.disabled || f$2.value && !S.value.static && o.value === 1) return;
					if (l.virtual.value) {
						d$1.value = t === c.Specific ? n : f$1({ focus: t }, {
							resolveItems: () => l.virtual.value.options,
							resolveActiveIndex: () => {
								var C, A;
								return (A = (C = l.activeOptionIndex.value) != null ? C : l.virtual.value.options.findIndex((j) => {
									var q;
									return !((q = l.virtual.value) != null && q.disabled(j));
								})) != null ? A : null;
							},
							resolveDisabled: (C) => l.virtual.value.disabled(C),
							resolveId() {
								throw new Error("Function not implemented.");
							}
						}), D.value = s != null ? s : 2;
						return;
					}
					let b = w$1();
					if (b.activeOptionIndex === null) {
						let C = b.options.findIndex((A) => !A.dataRef.disabled);
						C !== -1 && (b.activeOptionIndex = C);
					}
					let O = t === c.Specific ? n : f$1({ focus: t }, {
						resolveItems: () => b.options,
						resolveActiveIndex: () => b.activeOptionIndex,
						resolveId: (C) => C.id,
						resolveDisabled: (C) => C.dataRef.disabled
					});
					d$1.value = O, D.value = s != null ? s : 2, v.value = b.options;
				});
			},
			selectOption(t) {
				let n = v.value.find((b) => b.id === t);
				if (!n) return;
				let { dataRef: s } = n;
				I(s.value);
			},
			selectActiveOption() {
				if (l.activeOptionIndex.value !== null) {
					if (l.virtual.value) I(l.virtual.value.options[l.activeOptionIndex.value]);
					else {
						let { dataRef: t } = v.value[l.activeOptionIndex.value];
						I(t.value);
					}
					l.goToOption(c.Specific, l.activeOptionIndex.value);
				}
			},
			registerOption(t, n) {
				let s = reactive({
					id: t,
					dataRef: n
				});
				if (l.virtual.value) {
					v.value.push(s);
					return;
				}
				i && cancelAnimationFrame(i);
				let b = w$1((O) => (O.push(s), O));
				d$1.value === null && l.isSelected(n.value.value) && (b.activeOptionIndex = b.options.indexOf(s)), v.value = b.options, d$1.value = b.activeOptionIndex, D.value = 2, b.options.some((O) => !o$1(O.dataRef.domRef)) && (i = requestAnimationFrame(() => {
					let O = w$1();
					v.value = O.options, d$1.value = O.activeOptionIndex;
				}));
			},
			unregisterOption(t, n) {
				if (V !== null && cancelAnimationFrame(V), n && (E$1.value = true), l.virtual.value) {
					v.value = v.value.filter((b) => b.id !== t);
					return;
				}
				let s = w$1((b) => {
					let O = b.findIndex((C) => C.id === t);
					return O !== -1 && b.splice(O, 1), b;
				});
				v.value = s.options, d$1.value = s.activeOptionIndex, D.value = 2;
			},
			isSelected(t) {
				return u(M.value, {
					[0]: () => l.compare(toRaw(l.value.value), toRaw(t)),
					[1]: () => toRaw(l.value.value).some((n) => l.compare(toRaw(n), toRaw(t)))
				});
			},
			isActive(t) {
				return d$1.value === l.calculateIndex(t);
			}
		};
		w([
			e$1,
			c$1,
			f$2
		], () => l.closeCombobox(), computed(() => o.value === 0)), provide(ne, l), t$1(computed(() => u(o.value, {
			[0]: i$3.Open,
			[1]: i$3.Closed
		})));
		computed(() => {
			var t;
			return (t = o$1(e$1)) == null ? void 0 : t.closest("form");
		});
		return () => {
			var C, A$1, j;
			let { name: t, disabled: n, form: s, ...b } = a, O = {
				open: o.value === 0,
				disabled: n,
				activeIndex: l.activeOptionIndex.value,
				activeOption: l.activeOptionIndex.value === null ? null : l.virtual.value ? l.virtual.value.options[(C = l.activeOptionIndex.value) != null ? C : 0] : (j = (A$1 = l.options.value[l.activeOptionIndex.value]) == null ? void 0 : A$1.dataRef.value) != null ? j : null,
				value: R.value
			};
			return h(Fragment, [...t != null && R.value != null ? e({ [t]: R.value }).map(([q, ue]) => h(f, E({
				features: u$2.Hidden,
				key: q,
				as: "input",
				type: "hidden",
				hidden: true,
				readOnly: true,
				form: s,
				disabled: n,
				name: q,
				value: ue
			}))) : [], A({
				theirProps: {
					...r,
					...T(b, [
						"by",
						"defaultValue",
						"immediate",
						"modelValue",
						"multiple",
						"nullable",
						"onUpdate:modelValue",
						"virtual"
					])
				},
				ourProps: {},
				slot: O,
				slots: h$2,
				attrs: r,
				name: "Combobox"
			})]);
		};
	}
});
defineComponent({
	name: "ComboboxLabel",
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
	setup(a, { attrs: h, slots: r }) {
		var e;
		let y = (e = a.id) != null ? e : `headlessui-combobox-label-${i$1()}`, o = K("ComboboxLabel");
		function u() {
			var c;
			(c = o$1(o.inputRef)) == null || c.focus({ preventScroll: true });
		}
		return () => {
			let c = {
				open: o.comboboxState.value === 0,
				disabled: o.disabled.value
			}, { ...f } = a, S = {
				id: y,
				ref: o.labelRef,
				onClick: u
			};
			return A({
				ourProps: S,
				theirProps: f,
				slot: c,
				attrs: h,
				slots: r,
				name: "ComboboxLabel"
			});
		};
	}
});
var nt = defineComponent({
	name: "ComboboxButton",
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
	setup(a, { attrs: h, slots: r, expose: y }) {
		var S;
		let o$2 = (S = a.id) != null ? S : `headlessui-combobox-button-${i$1()}`, u = K("ComboboxButton");
		y({
			el: u.buttonRef,
			$el: u.buttonRef
		});
		function e(v) {
			u.disabled.value || (u.comboboxState.value === 0 ? u.closeCombobox() : (v.preventDefault(), u.openCombobox()), nextTick(() => {
				var d;
				return (d = o$1(u.inputRef)) == null ? void 0 : d.focus({ preventScroll: true });
			}));
		}
		function c$2(v) {
			switch (v.key) {
				case o.ArrowDown:
					v.preventDefault(), v.stopPropagation(), u.comboboxState.value === 1 && u.openCombobox(), nextTick(() => {
						var d;
						return (d = u.inputRef.value) == null ? void 0 : d.focus({ preventScroll: true });
					});
					return;
				case o.ArrowUp:
					v.preventDefault(), v.stopPropagation(), u.comboboxState.value === 1 && (u.openCombobox(), nextTick(() => {
						u.value.value || u.goToOption(c.Last);
					})), nextTick(() => {
						var d;
						return (d = u.inputRef.value) == null ? void 0 : d.focus({ preventScroll: true });
					});
					return;
				case o.Escape:
					if (u.comboboxState.value !== 0) return;
					v.preventDefault(), u.optionsRef.value && !u.optionsPropsRef.value.static && v.stopPropagation(), u.closeCombobox(), nextTick(() => {
						var d;
						return (d = u.inputRef.value) == null ? void 0 : d.focus({ preventScroll: true });
					});
					return;
			}
		}
		let f = s(computed(() => ({
			as: a.as,
			type: h.type
		})), u.buttonRef);
		return () => {
			var E, w;
			let v = {
				open: u.comboboxState.value === 0,
				disabled: u.disabled.value,
				value: u.value.value
			}, { ...d } = a, D = {
				ref: u.buttonRef,
				id: o$2,
				type: f.value,
				tabindex: "-1",
				"aria-haspopup": "listbox",
				"aria-controls": (E = o$1(u.optionsRef)) == null ? void 0 : E.id,
				"aria-expanded": u.comboboxState.value === 0,
				"aria-labelledby": u.labelRef.value ? [(w = o$1(u.labelRef)) == null ? void 0 : w.id, o$2].join(" ") : void 0,
				disabled: u.disabled.value === true ? true : void 0,
				onKeydown: c$2,
				onClick: e
			};
			return A({
				ourProps: D,
				theirProps: d,
				slot: v,
				attrs: h,
				slots: r,
				name: "ComboboxButton"
			});
		};
	}
});
var it = defineComponent({
	name: "ComboboxInput",
	props: {
		as: {
			type: [Object, String],
			default: "input"
		},
		static: {
			type: Boolean,
			default: false
		},
		unmount: {
			type: Boolean,
			default: true
		},
		displayValue: { type: Function },
		defaultValue: {
			type: String,
			default: void 0
		},
		id: {
			type: String,
			default: null
		}
	},
	emits: { change: (a) => true },
	setup(a, { emit: h, attrs: r, slots: y, expose: o$3 }) {
		var V;
		let u$4 = (V = a.id) != null ? V : `headlessui-combobox-input-${i$1()}`, e = K("ComboboxInput");
		computed(() => i$2(o$1(e.inputRef)));
		o$3({
			el: e.inputRef,
			$el: e.inputRef
		});
		function S() {
			e.change(null);
			let i = o$1(e.optionsRef);
			i && (i.scrollTop = 0), e.goToOption(c.Nothing);
		}
		computed(() => {
			var I;
			let i = e.value.value;
			return o$1(e.inputRef) ? typeof a.displayValue != "undefined" && i !== void 0 ? (I = a.displayValue(i)) != null ? I : "" : typeof i == "string" ? i : "" : "";
		});
		let d = ref(false);
		function D() {
			d.value = true;
		}
		function E() {
			o$2().nextFrame(() => {
				d.value = false;
			});
		}
		let w = t();
		function M(i) {
			switch (w(() => {
			}), i.key) {
				case o.Enter:
					if (e.comboboxState.value !== 0 || d.value) return;
					if (i.preventDefault(), i.stopPropagation(), e.activeOptionIndex.value === null) {
						e.closeCombobox();
						return;
					}
					e.selectActiveOption(), e.mode.value === 0 && e.closeCombobox();
					break;
				case o.ArrowDown: return i.preventDefault(), i.stopPropagation(), u(e.comboboxState.value, {
					[0]: () => e.goToOption(c.Next),
					[1]: () => e.openCombobox()
				});
				case o.ArrowUp: return i.preventDefault(), i.stopPropagation(), u(e.comboboxState.value, {
					[0]: () => e.goToOption(c.Previous),
					[1]: () => {
						e.openCombobox(), nextTick(() => {
							e.value.value || e.goToOption(c.Last);
						});
					}
				});
				case o.Home:
					if (i.shiftKey) break;
					return i.preventDefault(), i.stopPropagation(), e.goToOption(c.First);
				case o.PageUp: return i.preventDefault(), i.stopPropagation(), e.goToOption(c.First);
				case o.End:
					if (i.shiftKey) break;
					return i.preventDefault(), i.stopPropagation(), e.goToOption(c.Last);
				case o.PageDown: return i.preventDefault(), i.stopPropagation(), e.goToOption(c.Last);
				case o.Escape:
					if (e.comboboxState.value !== 0) return;
					i.preventDefault(), e.optionsRef.value && !e.optionsPropsRef.value.static && i.stopPropagation(), e.nullable.value && e.mode.value === 0 && e.value.value === null && S(), e.closeCombobox();
					break;
				case o.Tab:
					if (e.comboboxState.value !== 0) return;
					e.mode.value === 0 && e.activationTrigger.value !== 1 && e.selectActiveOption(), e.closeCombobox();
			}
		}
		function $(i) {
			h("change", i), e.nullable.value && e.mode.value === 0 && i.target.value === "" && S(), e.openCombobox();
		}
		function B(i) {
			var T, l, g;
			let I = (T = i.relatedTarget) != null ? T : t$2.find((t) => t !== i.currentTarget);
			if (!((l = o$1(e.optionsRef)) != null && l.contains(I)) && !((g = o$1(e.buttonRef)) != null && g.contains(I)) && e.comboboxState.value === 0) return i.preventDefault(), e.mode.value === 0 && (e.nullable.value && e.value.value === null ? S() : e.activationTrigger.value !== 1 && e.selectActiveOption()), e.closeCombobox();
		}
		function p(i) {
			var T, l, g;
			let I = (T = i.relatedTarget) != null ? T : t$2.find((t) => t !== i.currentTarget);
			(l = o$1(e.buttonRef)) != null && l.contains(I) || (g = o$1(e.optionsRef)) != null && g.contains(I) || e.disabled.value || e.immediate.value && e.comboboxState.value !== 0 && (e.openCombobox(), o$2().nextFrame(() => {
				e.setActivationTrigger(1);
			}));
		}
		let R = computed(() => {
			var i, I, T, l;
			return (l = (T = (I = a.defaultValue) != null ? I : e.defaultValue.value !== void 0 ? (i = a.displayValue) == null ? void 0 : i.call(a, e.defaultValue.value) : null) != null ? T : e.defaultValue.value) != null ? l : "";
		});
		return () => {
			var t, n, s, b, O, C, A$2;
			let i = { open: e.comboboxState.value === 0 }, { displayValue: I, onChange: T, ...l } = a, g = {
				"aria-controls": (t = e.optionsRef.value) == null ? void 0 : t.id,
				"aria-expanded": e.comboboxState.value === 0,
				"aria-activedescendant": e.activeOptionIndex.value === null ? void 0 : e.virtual.value ? (n = e.options.value.find((j) => !e.virtual.value.disabled(j.dataRef.value) && e.compare(j.dataRef.value, e.virtual.value.options[e.activeOptionIndex.value]))) == null ? void 0 : n.id : (s = e.options.value[e.activeOptionIndex.value]) == null ? void 0 : s.id,
				"aria-labelledby": (C = (b = o$1(e.labelRef)) == null ? void 0 : b.id) != null ? C : (O = o$1(e.buttonRef)) == null ? void 0 : O.id,
				"aria-autocomplete": "list",
				id: u$4,
				onCompositionstart: D,
				onCompositionend: E,
				onKeydown: M,
				onInput: $,
				onFocus: p,
				onBlur: B,
				role: "combobox",
				type: (A$2 = r.type) != null ? A$2 : "text",
				tabIndex: 0,
				ref: e.inputRef,
				defaultValue: R.value,
				disabled: e.disabled.value === true ? true : void 0
			};
			return A({
				ourProps: g,
				theirProps: l,
				slot: i,
				attrs: r,
				slots: y,
				features: N.RenderStrategy | N.Static,
				name: "ComboboxInput"
			});
		};
	}
});
var ut = defineComponent({
	name: "ComboboxOptions",
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
		hold: {
			type: [Boolean],
			default: false
		}
	},
	setup(a, { attrs: h$3, slots: r, expose: y }) {
		let o = K("ComboboxOptions"), u = `headlessui-combobox-options-${i$1()}`;
		y({
			el: o.optionsRef,
			$el: o.optionsRef
		}), watchEffect(() => {
			o.optionsPropsRef.value.static = a.static;
		}), watchEffect(() => {
			o.optionsPropsRef.value.hold = a.hold;
		});
		let e = l(), c = computed(() => e !== null ? (e.value & i$3.Open) === i$3.Open : o.comboboxState.value === 0);
		i$4({
			container: computed(() => o$1(o.optionsRef)),
			enabled: computed(() => o.comboboxState.value === 0),
			accept(S) {
				return S.getAttribute("role") === "option" ? NodeFilter.FILTER_REJECT : S.hasAttribute("role") ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
			},
			walk(S) {
				S.setAttribute("role", "none");
			}
		});
		function f(S) {
			S.preventDefault();
		}
		return () => {
			var D, E, w;
			let S = { open: o.comboboxState.value === 0 }, v = {
				"aria-labelledby": (w = (D = o$1(o.labelRef)) == null ? void 0 : D.id) != null ? w : (E = o$1(o.buttonRef)) == null ? void 0 : E.id,
				id: u,
				ref: o.optionsRef,
				role: "listbox",
				"aria-multiselectable": o.mode.value === 1 ? true : void 0,
				onMousedown: f
			}, d = T(a, ["hold"]);
			return A({
				ourProps: v,
				theirProps: d,
				slot: S,
				attrs: h$3,
				slots: o.virtual.value && o.comboboxState.value === 0 ? {
					...r,
					default: () => [h(Ae, {}, r.default)]
				} : r,
				features: N.RenderStrategy | N.Static,
				visible: c.value,
				name: "ComboboxOptions"
			});
		};
	}
});
var rt = defineComponent({
	name: "ComboboxOption",
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
		order: {
			type: [Number],
			default: null
		}
	},
	setup(a, { slots: h, attrs: r, expose: y }) {
		let o = K("ComboboxOption"), u = `headlessui-combobox-option-${i$1()}`, e = ref(null), c$3 = computed(() => a.disabled);
		y({
			el: e,
			$el: e
		});
		let f = computed(() => {
			var p;
			return o.virtual.value ? o.activeOptionIndex.value === o.calculateIndex(a.value) : o.activeOptionIndex.value === null ? false : ((p = o.options.value[o.activeOptionIndex.value]) == null ? void 0 : p.id) === u;
		}), S = computed(() => o.isSelected(a.value)), v = inject(ie, null);
		computed(() => ({
			disabled: a.disabled,
			value: a.value,
			domRef: e,
			order: computed(() => a.order)
		}));
		watchEffect(() => {
			let p = o$1(e);
			p && v?.value.measureElement(p);
		}), watchEffect(() => {
			o.comboboxState.value === 0 && f.value && (o.virtual.value || o.activationTrigger.value !== 0 && nextTick(() => {
				var p, R;
				return (R = (p = o$1(e)) == null ? void 0 : p.scrollIntoView) == null ? void 0 : R.call(p, { block: "nearest" });
			}));
		});
		function D(p) {
			p.preventDefault(), p.button === g.Left && (c$3.value || (o.selectOption(u), n() || requestAnimationFrame(() => {
				var R;
				return (R = o$1(o.inputRef)) == null ? void 0 : R.focus({ preventScroll: true });
			}), o.mode.value === 0 && o.closeCombobox()));
		}
		function E() {
			var R;
			if (a.disabled || (R = o.virtual.value) != null && R.disabled(a.value)) return o.goToOption(c.Nothing);
			let p = o.calculateIndex(a.value);
			o.goToOption(c.Specific, p);
		}
		let w = u$1();
		function M(p) {
			w.update(p);
		}
		function $(p) {
			var V;
			if (!w.wasMoved(p) || a.disabled || (V = o.virtual.value) != null && V.disabled(a.value) || f.value) return;
			let R = o.calculateIndex(a.value);
			o.goToOption(c.Specific, R, 0);
		}
		function B(p) {
			var R;
			w.wasMoved(p) && (a.disabled || (R = o.virtual.value) != null && R.disabled(a.value) || f.value && (o.optionsPropsRef.value.hold || o.goToOption(c.Nothing)));
		}
		return () => {
			let { disabled: p } = a, R = {
				active: f.value,
				selected: S.value,
				disabled: p
			}, V = {
				id: u,
				ref: e,
				role: "option",
				tabIndex: p === true ? void 0 : -1,
				"aria-disabled": p === true ? true : void 0,
				"aria-selected": S.value,
				disabled: void 0,
				onMousedown: D,
				onFocus: E,
				onPointerenter: M,
				onMouseenter: M,
				onPointermove: $,
				onMousemove: $,
				onPointerleave: B,
				onMouseleave: B
			}, i = T(a, ["order", "value"]);
			return A({
				ourProps: V,
				theirProps: i,
				slot: R,
				attrs: r,
				slots: h,
				name: "ComboboxOption"
			});
		};
	}
});

export { it as i, lt as l, nt as n, rt as r, ut as u };
//# sourceMappingURL=combobox-C0tFQX7q.mjs.map
