import { A, o as o$1 } from './keyboard-DE1QlhcY.mjs';
import { i, c as c$1 } from './focus-management-DXpqooZk.mjs';
import { a as w$1 } from './use-outside-click-E0zCHGRJ.mjs';
import { f as f$1, u as u$1 } from './hidden-UkYquSML.mjs';
import { ref, inject, defineComponent, provide, h, watchEffect, computed, getCurrentInstance, watch, Teleport, reactive } from 'vue';

//#region node_modules/@headlessui/vue/dist/hooks/use-event-listener.js
function E(n, e, o, r) {
	c$1.isServer || watchEffect((t) => {
		n = n != null ? n : void 0, n.addEventListener(e, o, r), t(() => n.removeEventListener(e, o, r));
	});
}
//#endregion
//#region node_modules/@headlessui/vue/dist/hooks/use-tab-direction.js
var d$1 = ((r) => (r[r.Forwards = 0] = "Forwards", r[r.Backwards = 1] = "Backwards", r))(d$1 || {});
function n() {
	let o = ref(0);
	return w$1("keydown", (e) => {
		e.key === "Tab" && (o.value = e.shiftKey ? 1 : 0);
	}), o;
}
//#endregion
//#region node_modules/@headlessui/vue/dist/hooks/use-root-containers.js
function N({ defaultContainers: o$2 = [], portals: i$1, mainTreeNodeRef: H } = {}) {
	let t = ref(null), r = i(t);
	function u() {
		var l, f, a;
		let n = [];
		for (let e of o$2) e !== null && (e instanceof HTMLElement ? n.push(e) : "value" in e && e.value instanceof HTMLElement && n.push(e.value));
		if (i$1 != null && i$1.value) for (let e of i$1.value) n.push(e);
		for (let e of (l = r == null ? void 0 : r.querySelectorAll("html > *, body > *")) != null ? l : []) e !== (void 0).body && e !== (void 0).head && e instanceof HTMLElement && e.id !== "headlessui-portal-root" && (e.contains(o$1(t)) || e.contains((a = (f = o$1(t)) == null ? void 0 : f.getRootNode()) == null ? void 0 : a.host) || n.some((M) => e.contains(M)) || n.push(e));
		return n;
	}
	return {
		resolveContainers: u,
		contains(n) {
			return u().some((l) => l.contains(n));
		},
		mainTreeNodeRef: t,
		MainTreeNode() {
			return H != null ? null : h(f$1, {
				features: u$1.Hidden,
				ref: t
			});
		}
	};
}
function v() {
	let o = ref(null);
	return {
		mainTreeNodeRef: o,
		MainTreeNode() {
			return h(f$1, {
				features: u$1.Hidden,
				ref: o
			});
		}
	};
}
//#endregion
//#region node_modules/@headlessui/vue/dist/internal/portal-force-root.js
var e = Symbol("ForcePortalRootContext");
function s() {
	return inject(e, false);
}
var u = defineComponent({
	name: "ForcePortalRoot",
	props: {
		as: {
			type: [Object, String],
			default: "template"
		},
		force: {
			type: Boolean,
			default: false
		}
	},
	setup(o, { slots: t, attrs: r }) {
		return provide(e, o.force), () => {
			let { force: f, ...n } = o;
			return A({
				theirProps: n,
				ourProps: {},
				slot: {},
				slots: t,
				attrs: r,
				name: "ForcePortalRoot"
			});
		};
	}
});
//#endregion
//#region node_modules/@headlessui/vue/dist/components/portal/portal.js
function x(e) {
	let t = i(e);
	if (!t) {
		if (e === null) return null;
		throw new Error(`[Headless UI]: Cannot find ownerDocument for contextElement: ${e}`);
	}
	let l = t.getElementById("headlessui-portal-root");
	if (l) return l;
	let r = t.createElement("div");
	return r.setAttribute("id", "headlessui-portal-root"), t.body.appendChild(r);
}
var f = /* @__PURE__ */ new WeakMap();
function U(e) {
	var t;
	return (t = f.get(e)) != null ? t : 0;
}
function M(e, t) {
	let l = t(U(e));
	return l <= 0 ? f.delete(e) : f.set(e, l), l;
}
var $ = defineComponent({
	name: "Portal",
	props: { as: {
		type: [Object, String],
		default: "div"
	} },
	setup(e, { slots: t, attrs: l }) {
		let r = ref(null);
		computed(() => i(r));
		let o$1$1 = s(), u = inject(H, null), n = ref(o$1$1 === true || u == null ? x(r.value) : u.resolveTarget());
		n.value && M(n.value, (a) => a + 1);
		let c = ref(false);
		watchEffect(() => {
			o$1$1 || u != null && (n.value = u.resolveTarget());
		});
		let v = inject(d, null), g = false;
		getCurrentInstance();
		return watch(r, () => {
			if (g || !v) return;
			o$1(r) && (g = true);
		}), () => {
			if (!c.value || n.value === null) return null;
			let a = {
				ref: r,
				"data-headlessui-portal": ""
			};
			return h(Teleport, { to: n.value }, A({
				ourProps: a,
				theirProps: e,
				slot: {},
				attrs: l,
				slots: t,
				name: "Portal"
			}));
		};
	}
});
var d = Symbol("PortalParentContext");
function q() {
	let e = inject(d, null), t = ref([]);
	function l(o) {
		return t.value.push(o), e && e.register(o), () => r(o);
	}
	function r(o) {
		let u = t.value.indexOf(o);
		u !== -1 && t.value.splice(u, 1), e && e.unregister(o);
	}
	let i = {
		register: l,
		unregister: r,
		portals: t
	};
	return [t, defineComponent({
		name: "PortalWrapper",
		setup(o, { slots: u }) {
			return provide(d, i), () => {
				var n;
				return (n = u.default) == null ? void 0 : n.call(u);
			};
		}
	})];
}
var H = Symbol("PortalGroupContext");
var z = defineComponent({
	name: "PortalGroup",
	props: {
		as: {
			type: [Object, String],
			default: "template"
		},
		target: {
			type: Object,
			default: null
		}
	},
	setup(e, { attrs: t, slots: l }) {
		let r = reactive({ resolveTarget() {
			return e.target;
		} });
		return provide(H, r), () => {
			let { target: i, ...o } = e;
			return A({
				theirProps: o,
				ourProps: {},
				slot: {},
				attrs: t,
				slots: l,
				name: "PortalGroup"
			});
		};
	}
});

export { $, E, N, d$1 as d, n, q, u, v, z };
//# sourceMappingURL=portal-BOf15iST.mjs.map
