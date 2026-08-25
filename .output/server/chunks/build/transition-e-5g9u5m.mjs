import { t as t$3 } from './micro-task-Dv1257jF.mjs';
import { t as t$2, o } from './active-element-history-BkxR87qo.mjs';
import { S, i as i$1, u as u$1, A as A$2, T as T$1, o as o$1, a as o$2, N as N$4 } from './keyboard-DE1QlhcY.mjs';
import { c as c$1, i as i$3, S as S$1, P, N as N$3 } from './focus-management-DXpqooZk.mjs';
import { w as w$1, t as t$4 } from './use-outside-click-E0zCHGRJ.mjs';
import { f, u as u$3 } from './hidden-UkYquSML.mjs';
import { s as s$1, t as t$1, l as l$1, i as i$2 } from './open-closed-Css0b1VQ.mjs';
import { q, N as N$2, E as E$1, u as u$2, $ as $$1, z as z$1, n, d as d$1 } from './portal-BOf15iST.mjs';
import { k } from './description-xz0pTumQ.mjs';
import { defineComponent, ref, h, computed, watchEffect, provide, normalizeClass, inject, watch, Fragment, shallowRef, nextTick } from 'vue';

//#region node_modules/@headlessui/vue/dist/components/focus-trap/focus-trap.js
function B(t) {
	if (!t) return /* @__PURE__ */ new Set();
	if (typeof t == "function") return new Set(t());
	let n = /* @__PURE__ */ new Set();
	for (let r of t.value) {
		let l = o$1(r);
		l instanceof HTMLElement && n.add(l);
	}
	return n;
}
var A$1 = ((e) => (e[e.None = 1] = "None", e[e.InitialFocus = 2] = "InitialFocus", e[e.TabLock = 4] = "TabLock", e[e.FocusLock = 8] = "FocusLock", e[e.RestoreFocus = 16] = "RestoreFocus", e[e.All = 30] = "All", e))(A$1 || {});
var ue = Object.assign(defineComponent({
	name: "FocusTrap",
	props: {
		as: {
			type: [Object, String],
			default: "div"
		},
		initialFocus: {
			type: Object,
			default: null
		},
		features: {
			type: Number,
			default: 30
		},
		containers: {
			type: [Object, Function],
			default: ref(/* @__PURE__ */ new Set())
		}
	},
	inheritAttrs: false,
	setup(t, { attrs: n$1, slots: r, expose: l }) {
		let o = ref(null);
		l({
			el: o,
			$el: o
		});
		let i = computed(() => i$3(o)), e = ref(false);
		$({ ownerDocument: i }, computed(() => e.value && Boolean(t.features & 16)));
		let m = z({
			ownerDocument: i,
			container: o,
			initialFocus: computed(() => t.initialFocus)
		}, computed(() => e.value && Boolean(t.features & 2)));
		J({
			ownerDocument: i,
			container: o,
			containers: t.containers,
			previousActiveElement: m
		}, computed(() => e.value && Boolean(t.features & 8)));
		let f$1 = n();
		function a(u) {
			let T = o$1(o);
			if (!T) return;
			((w) => w())(() => {
				u$1(f$1.value, {
					[d$1.Forwards]: () => {
						P(T, N$3.First, { skipElements: [u.relatedTarget] });
					},
					[d$1.Backwards]: () => {
						P(T, N$3.Last, { skipElements: [u.relatedTarget] });
					}
				});
			});
		}
		let s = ref(false);
		function F(u) {
			u.key === "Tab" && (s.value = true, requestAnimationFrame(() => {
				s.value = false;
			}));
		}
		function H(u) {
			if (!e.value) return;
			let T = B(t.containers);
			o$1(o) instanceof HTMLElement && T.add(o$1(o));
			let d = u.relatedTarget;
			d instanceof HTMLElement && d.dataset.headlessuiFocusGuard !== "true" && (N$1(T, d) || (s.value ? P(o$1(o), u$1(f$1.value, {
				[d$1.Forwards]: () => N$3.Next,
				[d$1.Backwards]: () => N$3.Previous
			}) | N$3.WrapAround, { relativeTo: u.target }) : u.target instanceof HTMLElement && S$1(u.target)));
		}
		return () => {
			let u = {}, T = {
				ref: o,
				onKeydown: F,
				onFocusout: H
			}, { features: d, initialFocus: w, containers: Q, ...O } = t;
			return h(Fragment, [
				Boolean(d & 4) && h(f, {
					as: "button",
					type: "button",
					"data-headlessui-focus-guard": true,
					onFocus: a,
					features: u$3.Focusable
				}),
				A$2({
					ourProps: T,
					theirProps: {
						...n$1,
						...O
					},
					slot: u,
					attrs: n$1,
					slots: r,
					name: "FocusTrap"
				}),
				Boolean(d & 4) && h(f, {
					as: "button",
					type: "button",
					"data-headlessui-focus-guard": true,
					onFocus: a,
					features: u$3.Focusable
				})
			]);
		};
	}
}), { features: A$1 });
function W$1(t) {
	let n = ref(t$2.slice());
	return watch([t], ([r], [l]) => {
		l === true && r === false ? t$3(() => {
			n.value.splice(0);
		}) : l === false && r === true && (n.value = t$2.slice());
	}, { flush: "post" }), () => {
		var r;
		return (r = n.value.find((l) => l != null && l.isConnected)) != null ? r : null;
	};
}
function $({ ownerDocument: t }, n) {
	W$1(n);
}
function z({ ownerDocument: t, container: n, initialFocus: r }, l) {
	let o = ref(null);
	ref(false);
	return o;
}
function J({ ownerDocument: t, container: n, containers: r, previousActiveElement: l }, o) {
	var i;
	E$1((i = t.value) == null ? void 0 : i.defaultView, "focus", (e) => {
		if (!o.value) return;
		let m = B(r);
		o$1(n) instanceof HTMLElement && m.add(o$1(n));
		let f = l.value;
		if (!f) return;
		let a = e.target;
		a && a instanceof HTMLElement ? N$1(m, a) ? (l.value = a, S$1(a)) : (e.preventDefault(), e.stopPropagation(), S$1(f)) : S$1(l.value);
	}, true);
}
function N$1(t, n) {
	for (let r of t) if (r.contains(n)) return true;
	return false;
}
//#endregion
//#region node_modules/@headlessui/vue/dist/hooks/use-store.js
function m$1(t) {
	return shallowRef(t.getSnapshot());
}
//#endregion
//#region node_modules/@headlessui/vue/dist/utils/store.js
function a$1(o, r) {
	let t = o(), n = /* @__PURE__ */ new Set();
	return {
		getSnapshot() {
			return t;
		},
		subscribe(e) {
			return n.add(e), () => n.delete(e);
		},
		dispatch(e, ...s) {
			let i = r[e].call(t, ...s);
			i && (t = i, n.forEach((c) => c()));
		}
	};
}
//#endregion
//#region node_modules/@headlessui/vue/dist/hooks/document-overflow/adjust-scrollbar-padding.js
function c() {
	let o;
	return {
		before({ doc: e }) {
			var l;
			let n = e.documentElement;
			o = ((l = e.defaultView) != null ? l : void 0).innerWidth - n.clientWidth;
		},
		after({ doc: e, d: n }) {
			let t = e.documentElement, l = t.clientWidth - t.offsetWidth, r = o - l;
			n.style(t, "paddingRight", `${r}px`);
		}
	};
}
//#endregion
//#region node_modules/@headlessui/vue/dist/hooks/document-overflow/handle-ios-locking.js
function w() {
	return t$4() ? { before({ doc: r, d: n, meta: c }) {
		function a(o) {
			return c.containers.flatMap((l) => l()).some((l) => l.contains(o));
		}
		n.microTask(() => {
			var s;
			if ((void 0).getComputedStyle(r.documentElement).scrollBehavior !== "auto") {
				let t = o();
				t.style(r.documentElement, "scrollBehavior", "auto"), n.add(() => n.microTask(() => t.dispose()));
			}
			let o$4 = (s = (void 0).scrollY) != null ? s : (void 0).pageYOffset, l = null;
			n.addEventListener(r, "click", (t) => {
				if (t.target instanceof HTMLElement) try {
					let e = t.target.closest("a");
					if (!e) return;
					let { hash: f } = new URL(e.href), i = r.querySelector(f);
					i && !a(i) && (l = i);
				} catch {}
			}, true), n.addEventListener(r, "touchstart", (t) => {
				if (t.target instanceof HTMLElement) if (a(t.target)) {
					let e = t.target;
					for (; e.parentElement && a(e.parentElement);) e = e.parentElement;
					n.style(e, "overscrollBehavior", "contain");
				} else n.style(t.target, "touchAction", "none");
			}), n.addEventListener(r, "touchmove", (t) => {
				if (t.target instanceof HTMLElement) {
					if (t.target.tagName === "INPUT") return;
					if (a(t.target)) {
						let e = t.target;
						for (; e.parentElement && e.dataset.headlessuiPortal !== "" && !(e.scrollHeight > e.clientHeight || e.scrollWidth > e.clientWidth);) e = e.parentElement;
						e.dataset.headlessuiPortal === "" && t.preventDefault();
					} else t.preventDefault();
				}
			}, { passive: false }), n.add(() => {
				var e;
				let t = (e = (void 0).scrollY) != null ? e : (void 0).pageYOffset;
				o$4 !== t && (void 0).scrollTo(0, o$4), l && l.isConnected && (l.scrollIntoView({ block: "nearest" }), l = null);
			});
		});
	} } : {};
}
//#endregion
//#region node_modules/@headlessui/vue/dist/hooks/document-overflow/prevent-scroll.js
function l() {
	return { before({ doc: e, d: o }) {
		o.style(e.documentElement, "overflow", "hidden");
	} };
}
//#endregion
//#region node_modules/@headlessui/vue/dist/hooks/document-overflow/overflow-store.js
function m(e) {
	let n = {};
	for (let t of e) Object.assign(n, t(n));
	return n;
}
var a = a$1(() => /* @__PURE__ */ new Map(), {
	PUSH(e, n) {
		var o$3;
		let t = (o$3 = this.get(e)) != null ? o$3 : {
			doc: e,
			count: 0,
			d: o(),
			meta: /* @__PURE__ */ new Set()
		};
		return t.count++, t.meta.add(n), this.set(e, t), this;
	},
	POP(e, n) {
		let t = this.get(e);
		return t && (t.count--, t.meta.delete(n)), this;
	},
	SCROLL_PREVENT({ doc: e, d: n, meta: t }) {
		let o = {
			doc: e,
			d: n,
			meta: m(t)
		}, c$2 = [
			w(),
			c(),
			l()
		];
		c$2.forEach(({ before: r }) => r == null ? void 0 : r(o)), c$2.forEach(({ after: r }) => r == null ? void 0 : r(o));
	},
	SCROLL_ALLOW({ d: e }) {
		e.dispose();
	},
	TEARDOWN({ doc: e }) {
		this.delete(e);
	}
});
a.subscribe(() => {
	let e = a.getSnapshot(), n = /* @__PURE__ */ new Map();
	for (let [t] of e) n.set(t, t.documentElement.style.overflow);
	for (let t of e.values()) {
		let o = n.get(t.doc) === "hidden", c = t.count !== 0;
		(c && !o || !c && o) && a.dispatch(t.count > 0 ? "SCROLL_PREVENT" : "SCROLL_ALLOW", t), t.count === 0 && a.dispatch("TEARDOWN", t);
	}
});
//#endregion
//#region node_modules/@headlessui/vue/dist/hooks/document-overflow/use-document-overflow.js
function d(t, a$2, n) {
	let i = m$1(a), l = computed(() => {
		let e = t.value ? i.value.get(t.value) : void 0;
		return e ? e.count > 0 : false;
	});
	return watch([t, a$2], ([e, m], [r], o) => {
		if (!e || !m) return;
		a.dispatch("PUSH", e, n);
		let f = false;
		o(() => {
			f || (a.dispatch("POP", r != null ? r : e, n), f = true);
		});
	}, { immediate: true }), l;
}
//#endregion
//#region node_modules/@headlessui/vue/dist/hooks/use-inert.js
var i = /* @__PURE__ */ new Map();
var t = /* @__PURE__ */ new Map();
function E(d, f = ref(true)) {
	watchEffect((o) => {
		var a;
		if (!f.value) return;
		let e = o$1(d);
		if (!e) return;
		o(function() {
			var u;
			if (!e) return;
			let r = (u = t.get(e)) != null ? u : 1;
			if (r === 1 ? t.delete(e) : t.set(e, r - 1), r !== 1) return;
			let n = i.get(e);
			n && (n["aria-hidden"] === null ? e.removeAttribute("aria-hidden") : e.setAttribute("aria-hidden", n["aria-hidden"]), e.inert = n.inert, i.delete(e));
		});
		let l = (a = t.get(e)) != null ? a : 0;
		t.set(e, l + 1), l === 0 && (i.set(e, {
			"aria-hidden": e.getAttribute("aria-hidden"),
			inert: e.inert
		}), e.setAttribute("aria-hidden", "true"), e.inert = true);
	});
}
//#endregion
//#region node_modules/@headlessui/vue/dist/internal/stack-context.js
var u = Symbol("StackContext");
var s = ((e) => (e[e.Add = 0] = "Add", e[e.Remove = 1] = "Remove", e))(s || {});
function y() {
	return inject(u, () => {});
}
function R$1({ type: o, enabled: r, element: e, onUpdate: i }) {
	let a = y();
	function t(...n) {
		i?.(...n), a(...n);
	}
	provide(u, t);
}
//#endregion
//#region node_modules/@headlessui/vue/dist/components/dialog/dialog.js
var Te$1 = ((l) => (l[l.Open = 0] = "Open", l[l.Closed = 1] = "Closed", l))(Te$1 || {});
var H = Symbol("DialogContext");
function T(t) {
	let i = inject(H, null);
	if (i === null) {
		let l = /* @__PURE__ */ new Error(`<${t} /> is missing a parent <Dialog /> component.`);
		throw Error.captureStackTrace && Error.captureStackTrace(l, T), l;
	}
	return i;
}
var A = "DC8F892D-2EBD-447C-A4C8-A03058436FF4";
var Ye = defineComponent({
	name: "Dialog",
	inheritAttrs: false,
	props: {
		as: {
			type: [Object, String],
			default: "div"
		},
		static: {
			type: Boolean,
			default: false
		},
		unmount: {
			type: Boolean,
			default: true
		},
		open: {
			type: [Boolean, String],
			default: A
		},
		initialFocus: {
			type: Object,
			default: null
		},
		id: {
			type: String,
			default: null
		},
		role: {
			type: String,
			default: "dialog"
		}
	},
	emits: { close: (t) => true },
	setup(t, { emit: i, attrs: l, slots: p, expose: s$2 }) {
		var q$1, W;
		let n = (q$1 = t.id) != null ? q$1 : `headlessui-dialog-${i$1()}`, u = ref(false);
		let r = false, g = computed(() => t.role === "dialog" || t.role === "alertdialog" ? t.role : (r || (r = true, console.warn(`Invalid role [${g}] passed to <Dialog />. Only \`dialog\` and and \`alertdialog\` are supported. Using \`dialog\` instead.`)), "dialog")), D = ref(0), S = l$1(), R = computed(() => t.open === A && S !== null ? (S.value & i$2.Open) === i$2.Open : t.open), m = ref(null), E$2 = computed(() => i$3(m));
		if (s$2({
			el: m,
			$el: m
		}), !(t.open !== A || S !== null)) throw new Error("You forgot to provide an `open` prop to the `Dialog`.");
		if (typeof R.value != "boolean") throw new Error(`You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${R.value === A ? void 0 : t.open}`);
		let c = computed(() => u.value && R.value ? 0 : 1), k$1 = computed(() => c.value === 0), w = computed(() => D.value > 1), N = inject(H, null) !== null, [Q, X] = q(), { resolveContainers: B, mainTreeNodeRef: K, MainTreeNode: Z } = N$2({
			portals: Q,
			defaultContainers: [computed(() => {
				var e;
				return (e = h$3.panelRef.value) != null ? e : m.value;
			})]
		}), ee = computed(() => w.value ? "parent" : "leaf"), U = computed(() => S !== null ? (S.value & i$2.Closing) === i$2.Closing : false), te = computed(() => N || U.value ? false : k$1.value);
		E(computed(() => {
			var e, a, d;
			return (d = Array.from((a = (e = E$2.value) == null ? void 0 : e.querySelectorAll("body > *")) != null ? a : []).find((f) => f.id === "headlessui-portal-root" ? false : f.contains(o$1(K)) && f instanceof HTMLElement)) != null ? d : null;
		}), te);
		let ae = computed(() => w.value ? true : k$1.value);
		E(computed(() => {
			var e, a, d;
			return (d = Array.from((a = (e = E$2.value) == null ? void 0 : e.querySelectorAll("[data-headlessui-portal]")) != null ? a : []).find((f) => f.contains(o$1(K)) && f instanceof HTMLElement)) != null ? d : null;
		}), ae), R$1({
			type: "Dialog",
			enabled: computed(() => c.value === 0),
			element: m,
			onUpdate: (e, a) => {
				if (a === "Dialog") return u$1(e, {
					[s.Add]: () => D.value += 1,
					[s.Remove]: () => D.value -= 1
				});
			}
		});
		let re = k({
			name: "DialogDescription",
			slot: computed(() => ({ open: R.value }))
		}), M = ref(null), h$3 = {
			titleId: M,
			panelRef: ref(null),
			dialogState: c,
			setTitleId(e) {
				M.value !== e && (M.value = e);
			},
			close() {
				i("close", false);
			}
		};
		provide(H, h$3);
		let ne = computed(() => !(!k$1.value || w.value));
		w$1(B, (e, a) => {
			e.preventDefault(), h$3.close(), nextTick(() => a == null ? void 0 : a.focus());
		}, ne);
		let ie = computed(() => !(w.value || c.value !== 0));
		E$1((W = E$2.value) == null ? void 0 : W.defaultView, "keydown", (e) => {
			ie.value && (e.defaultPrevented || e.key === o$2.Escape && (e.preventDefault(), e.stopPropagation(), h$3.close()));
		});
		return d(E$2, computed(() => !(U.value || c.value !== 0 || N)), (e) => {
			var a;
			return { containers: [...(a = e.containers) != null ? a : [], B] };
		}), watchEffect((e) => {
			if (c.value !== 0) return;
			let a = o$1(m);
			if (!a) return;
			let d = new ResizeObserver((f) => {
				for (let L of f) {
					let x = L.target.getBoundingClientRect();
					x.x === 0 && x.y === 0 && x.width === 0 && x.height === 0 && h$3.close();
				}
			});
			d.observe(a), e(() => d.disconnect());
		}), () => {
			let { open: e, initialFocus: a, ...d } = t, f = {
				...l,
				ref: m,
				id: n,
				role: g.value,
				"aria-modal": c.value === 0 ? true : void 0,
				"aria-labelledby": M.value,
				"aria-describedby": re.value
			}, L = { open: c.value === 0 };
			return h(u$2, { force: true }, () => [h($$1, () => h(z$1, { target: m.value }, () => h(u$2, { force: false }, () => h(ue, {
				initialFocus: a,
				containers: B,
				features: k$1.value ? u$1(ee.value, {
					parent: ue.features.RestoreFocus,
					leaf: ue.features.All & ~ue.features.FocusLock
				}) : ue.features.None
			}, () => h(X, {}, () => A$2({
				ourProps: f,
				theirProps: {
					...d,
					...l
				},
				slot: L,
				attrs: l,
				slots: p,
				visible: c.value === 0,
				features: N$4.RenderStrategy | N$4.Static,
				name: "Dialog"
			})))))), h(Z)]);
		};
	}
});
defineComponent({
	name: "DialogOverlay",
	props: {
		as: {
			type: [Object, String],
			default: "div"
		},
		id: {
			type: String,
			default: null
		}
	},
	setup(t, { attrs: i, slots: l }) {
		var u;
		let p = (u = t.id) != null ? u : `headlessui-dialog-overlay-${i$1()}`, s = T("DialogOverlay");
		function n(r) {
			r.target === r.currentTarget && (r.preventDefault(), r.stopPropagation(), s.close());
		}
		return () => {
			let { ...r } = t;
			return A$2({
				ourProps: {
					id: p,
					"aria-hidden": true,
					onClick: n
				},
				theirProps: r,
				slot: { open: s.dialogState.value === 0 },
				attrs: i,
				slots: l,
				name: "DialogOverlay"
			});
		};
	}
});
defineComponent({
	name: "DialogBackdrop",
	props: {
		as: {
			type: [Object, String],
			default: "div"
		},
		id: {
			type: String,
			default: null
		}
	},
	inheritAttrs: false,
	setup(t, { attrs: i, slots: l, expose: p }) {
		var r;
		let s = (r = t.id) != null ? r : `headlessui-dialog-backdrop-${i$1()}`, n = T("DialogBackdrop"), u = ref(null);
		return p({
			el: u,
			$el: u
		}), () => {
			let { ...g } = t, D = {
				id: s,
				ref: u,
				"aria-hidden": true
			};
			return h(u$2, { force: true }, () => h($$1, () => A$2({
				ourProps: D,
				theirProps: {
					...i,
					...g
				},
				slot: { open: n.dialogState.value === 0 },
				attrs: i,
				slots: l,
				name: "DialogBackdrop"
			})));
		};
	}
});
var Ge = defineComponent({
	name: "DialogPanel",
	props: {
		as: {
			type: [Object, String],
			default: "div"
		},
		id: {
			type: String,
			default: null
		}
	},
	setup(t, { attrs: i, slots: l, expose: p }) {
		var r;
		let s = (r = t.id) != null ? r : `headlessui-dialog-panel-${i$1()}`, n = T("DialogPanel");
		p({
			el: n.panelRef,
			$el: n.panelRef
		});
		function u(g) {
			g.stopPropagation();
		}
		return () => {
			let { ...g } = t, D = {
				id: s,
				ref: n.panelRef,
				onClick: u
			};
			return A$2({
				ourProps: D,
				theirProps: g,
				slot: { open: n.dialogState.value === 0 },
				attrs: i,
				slots: l,
				name: "DialogPanel"
			});
		};
	}
});
defineComponent({
	name: "DialogTitle",
	props: {
		as: {
			type: [Object, String],
			default: "h2"
		},
		id: {
			type: String,
			default: null
		}
	},
	setup(t, { attrs: i, slots: l }) {
		var n;
		let p = (n = t.id) != null ? n : `headlessui-dialog-title-${i$1()}`, s = T("DialogTitle");
		return () => {
			let { ...u } = t;
			return A$2({
				ourProps: { id: p },
				theirProps: u,
				slot: { open: s.dialogState.value === 0 },
				attrs: i,
				slots: l,
				name: "DialogTitle"
			});
		};
	}
});
//#endregion
//#region node_modules/@headlessui/vue/dist/components/transitions/transition.js
function g(e = "") {
	return e.split(/\s+/).filter((t) => t.length > 1);
}
var R = Symbol("TransitionContext");
var pe = ((a) => (a.Visible = "visible", a.Hidden = "hidden", a))(pe || {});
function me() {
	return inject(R, null) !== null;
}
function Te() {
	let e = inject(R, null);
	if (e === null) throw new Error("A <TransitionChild /> is used but it is missing a parent <TransitionRoot />.");
	return e;
}
function ge() {
	let e = inject(N, null);
	if (e === null) throw new Error("A <TransitionChild /> is used but it is missing a parent <TransitionRoot />.");
	return e;
}
var N = Symbol("NestingContext");
function L(e) {
	return "children" in e ? L(e.children) : e.value.filter(({ state: t }) => t === "visible").length > 0;
}
function Q(e) {
	let t = ref([]), a = ref(false);
	function s(n, r = S.Hidden) {
		let l = t.value.findIndex(({ id: f }) => f === n);
		l !== -1 && (u$1(r, {
			[S.Unmount]() {
				t.value.splice(l, 1);
			},
			[S.Hidden]() {
				t.value[l].state = "hidden";
			}
		}), !L(t) && a.value && e?.());
	}
	function h(n) {
		let r = t.value.find(({ id: l }) => l === n);
		return r ? r.state !== "visible" && (r.state = "visible") : t.value.push({
			id: n,
			state: "visible"
		}), () => s(n, S.Unmount);
	}
	return {
		children: t,
		register: h,
		unregister: s
	};
}
var W = N$4.RenderStrategy;
var he = defineComponent({
	props: {
		as: {
			type: [Object, String],
			default: "div"
		},
		show: {
			type: [Boolean],
			default: null
		},
		unmount: {
			type: [Boolean],
			default: true
		},
		appear: {
			type: [Boolean],
			default: false
		},
		enter: {
			type: [String],
			default: ""
		},
		enterFrom: {
			type: [String],
			default: ""
		},
		enterTo: {
			type: [String],
			default: ""
		},
		entered: {
			type: [String],
			default: ""
		},
		leave: {
			type: [String],
			default: ""
		},
		leaveFrom: {
			type: [String],
			default: ""
		},
		leaveTo: {
			type: [String],
			default: ""
		}
	},
	emits: {
		beforeEnter: () => true,
		afterEnter: () => true,
		beforeLeave: () => true,
		afterLeave: () => true
	},
	setup(e, { emit: t, attrs: a, slots: s, expose: h$1 }) {
		let n = ref(0);
		function r() {
			n.value |= i$2.Opening, t("beforeEnter");
		}
		function l() {
			n.value &= ~i$2.Opening, t("afterEnter");
		}
		function f() {
			n.value |= i$2.Closing, t("beforeLeave");
		}
		function S$2() {
			n.value &= ~i$2.Closing, t("afterLeave");
		}
		if (!me() && s$1()) return () => h(Se, {
			...e,
			onBeforeEnter: r,
			onAfterEnter: l,
			onBeforeLeave: f,
			onAfterLeave: S$2
		}, s);
		let d = ref(null), y = computed(() => e.unmount ? S.Unmount : S.Hidden);
		h$1({
			el: d,
			$el: d
		});
		let { show: v, appear: A } = Te(), { register: D, unregister: H } = ge(), i = ref(v.value ? "visible" : "hidden"), c = i$1(), P = Q(() => {
			i.value !== "hidden" && (i.value = "hidden", H(c), S$2());
		});
		watchEffect(() => {
			if (y.value === S.Hidden && c) {
				if (v.value && i.value !== "visible") {
					i.value = "visible";
					return;
				}
				u$1(i.value, {
					["hidden"]: () => H(c),
					["visible"]: () => D(c)
				});
			}
		});
		let j = g(e.enter), M = g(e.enterFrom);
		g(e.enterTo);
		g(e.entered);
		g(e.leave);
		g(e.leaveFrom);
		g(e.leaveTo);
		return provide(N, P), t$1(computed(() => u$1(i.value, {
			["visible"]: i$2.Open,
			["hidden"]: i$2.Closed
		}) | n.value)), () => {
			let { appear: o, show: E, enter: p, enterFrom: V, enterTo: Ce, entered: ye, leave: be, leaveFrom: Ee, leaveTo: Ve, ...U } = e, ne = { ref: d }, re = {
				...U,
				...A.value && v.value && c$1.isServer ? { class: normalizeClass([
					a.class,
					U.class,
					...j,
					...M
				]) } : {}
			};
			return A$2({
				theirProps: re,
				ourProps: ne,
				slot: {},
				slots: s,
				attrs: a,
				features: W,
				visible: i.value === "visible",
				name: "TransitionChild"
			});
		};
	}
});
var ce = he;
var Se = defineComponent({
	inheritAttrs: false,
	props: {
		as: {
			type: [Object, String],
			default: "div"
		},
		show: {
			type: [Boolean],
			default: null
		},
		unmount: {
			type: [Boolean],
			default: true
		},
		appear: {
			type: [Boolean],
			default: false
		},
		enter: {
			type: [String],
			default: ""
		},
		enterFrom: {
			type: [String],
			default: ""
		},
		enterTo: {
			type: [String],
			default: ""
		},
		entered: {
			type: [String],
			default: ""
		},
		leave: {
			type: [String],
			default: ""
		},
		leaveFrom: {
			type: [String],
			default: ""
		},
		leaveTo: {
			type: [String],
			default: ""
		}
	},
	emits: {
		beforeEnter: () => true,
		afterEnter: () => true,
		beforeLeave: () => true,
		afterLeave: () => true
	},
	setup(e, { emit: t, attrs: a, slots: s }) {
		let h$2 = l$1(), n = computed(() => e.show === null && h$2 !== null ? (h$2.value & i$2.Open) === i$2.Open : e.show);
		watchEffect(() => {
			if (![true, false].includes(n.value)) throw new Error("A <Transition /> is used but it is missing a `:show=\"true | false\"` prop.");
		});
		let r = ref(n.value ? "visible" : "hidden"), l = Q(() => {
			r.value = "hidden";
		}), f = ref(true), S = {
			show: n,
			appear: computed(() => e.appear || !f.value)
		};
		return provide(N, l), provide(R, S), () => {
			let d = T$1(e, [
				"show",
				"appear",
				"unmount",
				"onBeforeEnter",
				"onBeforeLeave",
				"onAfterEnter",
				"onAfterLeave"
			]), y = { unmount: e.unmount };
			return A$2({
				ourProps: {
					...y,
					as: "template"
				},
				theirProps: {},
				slot: {},
				slots: {
					...s,
					default: () => [h(ce, {
						onBeforeEnter: () => t("beforeEnter"),
						onAfterEnter: () => t("afterEnter"),
						onBeforeLeave: () => t("beforeLeave"),
						onAfterLeave: () => t("afterLeave"),
						...a,
						...y,
						...d
					}, s.default)]
				},
				attrs: {},
				features: W,
				visible: r.value === "visible",
				name: "Transition"
			});
		};
	}
});

export { Ge as G, Se as S, Ye as Y, he as h };
//# sourceMappingURL=transition-e-5g9u5m.mjs.map
