import * as e from 'vue';
import { cloneVNode, h, Fragment } from 'vue';

//#region node_modules/@headlessui/vue/dist/hooks/use-id.js
var r;
var n = Symbol("headlessui.useid");
var o$2 = 0;
var i = (r = e.useId) != null ? r : function() {
	return e.inject(n, () => `${++o$2}`)();
};
function s(t) {
	e.provide(n, t);
}
//#endregion
//#region node_modules/@headlessui/vue/dist/utils/dom.js
function o$1(e) {
	var l;
	if (e == null || e.value == null) return null;
	let n = (l = e.value.$el) != null ? l : e.value;
	return n instanceof Node ? n : null;
}
//#endregion
//#region node_modules/@headlessui/vue/dist/utils/match.js
function u(r, n, ...a) {
	if (r in n) {
		let e = n[r];
		return typeof e == "function" ? e(...a) : e;
	}
	let t = /* @__PURE__ */ new Error(`Tried to handle "${r}" but there is no handler defined. Only defined handlers are: ${Object.keys(n).map((e) => `"${e}"`).join(", ")}.`);
	throw Error.captureStackTrace && Error.captureStackTrace(t, u), t;
}
//#endregion
//#region node_modules/@headlessui/vue/dist/utils/render.js
var N = ((o) => (o[o.None = 0] = "None", o[o.RenderStrategy = 1] = "RenderStrategy", o[o.Static = 2] = "Static", o))(N || {});
var S = ((e) => (e[e.Unmount = 0] = "Unmount", e[e.Hidden = 1] = "Hidden", e))(S || {});
function A({ visible: r = true, features: t = 0, ourProps: e, theirProps: o, ...i }) {
	var a;
	let n = j(o, e), l = Object.assign(i, { props: n });
	if (r || t & 2 && n.static) return y(l);
	if (t & 1) return u((a = n.unmount) == null || a ? 0 : 1, {
		[0]() {
			return null;
		},
		[1]() {
			return y({
				...i,
				props: {
					...n,
					hidden: true,
					style: { display: "none" }
				}
			});
		}
	});
	return y(l);
}
function y({ props: r, attrs: t, slots: e, slot: o, name: i }) {
	var m, h$1;
	let { as: n, ...l } = T(r, ["unmount", "static"]), a = (m = e.default) == null ? void 0 : m.call(e, o), d = {};
	if (o) {
		let u = false, c = [];
		for (let [p, f] of Object.entries(o)) typeof f == "boolean" && (u = true), f === true && c.push(p);
		u && (d["data-headlessui-state"] = c.join(" "));
	}
	if (n === "template") {
		if (a = b(a != null ? a : []), Object.keys(l).length > 0 || Object.keys(t).length > 0) {
			let [u, ...c] = a != null ? a : [];
			if (!v(u) || c.length > 0) throw new Error([
				"Passing props on \"template\"!",
				"",
				`The current component <${i} /> is rendering a "template".`,
				"However we need to passthrough the following props:",
				Object.keys(l).concat(Object.keys(t)).map((s) => s.trim()).filter((s, g, R) => R.indexOf(s) === g).sort((s, g) => s.localeCompare(g)).map((s) => `  - ${s}`).join(`
`),
				"",
				"You can apply a few solutions:",
				["Add an `as=\"...\"` prop, to ensure that we render an actual element instead of a \"template\".", "Render a single element as the child so that we can forward the props onto that element."].map((s) => `  - ${s}`).join(`
`)
			].join(`
`));
			let p = j((h$1 = u.props) != null ? h$1 : {}, l, d), f = cloneVNode(u, p, true);
			for (let s in p) s.startsWith("on") && (f.props || (f.props = {}), f.props[s] = p[s]);
			return f;
		}
		return Array.isArray(a) && a.length === 1 ? a[0] : a;
	}
	return h(n, Object.assign({}, l, d), { default: () => a });
}
function b(r) {
	return r.flatMap((t) => t.type === Fragment ? b(t.children) : [t]);
}
function j(...r) {
	if (r.length === 0) return {};
	if (r.length === 1) return r[0];
	let t = {}, e = {};
	for (let i of r) for (let n in i) n.startsWith("on") && typeof i[n] == "function" ? (e[n] ?? (e[n] = []), e[n].push(i[n])) : t[n] = i[n];
	if (t.disabled || t["aria-disabled"]) return Object.assign(t, Object.fromEntries(Object.keys(e).map((i) => [i, void 0])));
	for (let i in e) Object.assign(t, { [i](n, ...l) {
		let a = e[i];
		for (let d of a) {
			if (n instanceof Event && n.defaultPrevented) return;
			d(n, ...l);
		}
	} });
	return t;
}
function E(r) {
	let t = Object.assign({}, r);
	for (let e in t) t[e] === void 0 && delete t[e];
	return t;
}
function T(r, t = []) {
	let e = Object.assign({}, r);
	for (let o of t) o in e && delete e[o];
	return e;
}
function v(r) {
	return r == null ? false : typeof r.type == "string" || typeof r.type == "object" || typeof r.type == "function";
}
//#endregion
//#region node_modules/@headlessui/vue/dist/keyboard.js
var o = ((r) => (r.Space = " ", r.Enter = "Enter", r.Escape = "Escape", r.Backspace = "Backspace", r.Delete = "Delete", r.ArrowLeft = "ArrowLeft", r.ArrowUp = "ArrowUp", r.ArrowRight = "ArrowRight", r.ArrowDown = "ArrowDown", r.Home = "Home", r.End = "End", r.PageUp = "PageUp", r.PageDown = "PageDown", r.Tab = "Tab", r))(o || {});

export { A, E, N, S, T, o as a, i, o$1 as o, s, u };
//# sourceMappingURL=keyboard-DE1QlhcY.mjs.map
