import { o as o$1, u } from './keyboard-DE1QlhcY.mjs';
import { nextTick } from 'vue';

//#region node_modules/@headlessui/vue/dist/utils/env.js
var i$1 = Object.defineProperty;
var d = (t, e, r) => e in t ? i$1(t, e, {
	enumerable: true,
	configurable: true,
	writable: true,
	value: r
}) : t[e] = r;
var n = (t, e, r) => (d(t, typeof e != "symbol" ? e + "" : e, r), r);
var s = class {
	constructor() {
		n(this, "current", this.detect());
		n(this, "currentId", 0);
	}
	set(e) {
		this.current !== e && (this.currentId = 0, this.current = e);
	}
	reset() {
		this.set(this.detect());
	}
	nextId() {
		return ++this.currentId;
	}
	get isServer() {
		return this.current === "server";
	}
	get isClient() {
		return this.current === "client";
	}
	detect() {
		return "server";
	}
};
var c$1 = new s();
//#endregion
//#region node_modules/@headlessui/vue/dist/utils/owner.js
function i(r) {
	if (c$1.isServer) return null;
	if (r instanceof Node) return r.ownerDocument;
	if (r != null && r.hasOwnProperty("value")) {
		let n = o$1(r);
		if (n) return n.ownerDocument;
	}
}
//#endregion
//#region node_modules/@headlessui/vue/dist/utils/focus-management.js
var c = [
	"[contentEditable=true]",
	"[tabindex]",
	"a[href]",
	"area[href]",
	"button:not([disabled])",
	"iframe",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])"
].map((e) => `${e}:not([tabindex='-1'])`).join(",");
var N = ((n) => (n[n.First = 1] = "First", n[n.Previous = 2] = "Previous", n[n.Next = 4] = "Next", n[n.Last = 8] = "Last", n[n.WrapAround = 16] = "WrapAround", n[n.NoScroll = 32] = "NoScroll", n))(N || {});
var T = ((o) => (o[o.Error = 0] = "Error", o[o.Overflow = 1] = "Overflow", o[o.Success = 2] = "Success", o[o.Underflow = 3] = "Underflow", o))(T || {});
var F = ((t) => (t[t.Previous = -1] = "Previous", t[t.Next = 1] = "Next", t))(F || {});
function E(e = (void 0).body) {
	return e == null ? [] : Array.from(e.querySelectorAll(c)).sort((r, t) => Math.sign((r.tabIndex || Number.MAX_SAFE_INTEGER) - (t.tabIndex || Number.MAX_SAFE_INTEGER)));
}
var h$1 = ((t) => (t[t.Strict = 0] = "Strict", t[t.Loose = 1] = "Loose", t))(h$1 || {});
function w(e, r = 0) {
	var t;
	return e === ((t = i(e)) == null ? void 0 : t.body) ? false : u(r, {
		[0]() {
			return e.matches(c);
		},
		[1]() {
			let l = e;
			for (; l !== null;) {
				if (l.matches(c)) return true;
				l = l.parentElement;
			}
			return false;
		}
	});
}
function _(e) {
	let r = i(e);
	nextTick(() => {
		r && !w(r.activeElement, 0) && S(e);
	});
}
var y = ((t) => (t[t.Keyboard = 0] = "Keyboard", t[t.Mouse = 1] = "Mouse", t))(y || {});
function S(e) {
	e?.focus({ preventScroll: true });
}
var H = ["textarea", "input"].join(",");
function I(e) {
	var r, t;
	return (t = (r = e == null ? void 0 : e.matches) == null ? void 0 : r.call(e, H)) != null ? t : false;
}
function O(e, r = (t) => t) {
	return e.slice().sort((t, l) => {
		let o = r(t), i = r(l);
		if (o === null || i === null) return 0;
		let n = o.compareDocumentPosition(i);
		return n & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : n & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
	});
}
function v(e, r) {
	return P(E(), r, { relativeTo: e });
}
function P(e, r, { sorted: t = true, relativeTo: l = null, skipElements: o = [] } = {}) {
	var m;
	let i = (m = Array.isArray(e) ? e.length > 0 ? e[0].ownerDocument : void 0 : e == null ? void 0 : e.ownerDocument) != null ? m : void 0, n = Array.isArray(e) ? t ? O(e) : e : E(e);
	o.length > 0 && n.length > 1 && (n = n.filter((s) => !o.includes(s))), l = l != null ? l : i.activeElement;
	let x = (() => {
		if (r & 5) return 1;
		if (r & 10) return -1;
		throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
	})(), p = (() => {
		if (r & 1) return 0;
		if (r & 2) return Math.max(0, n.indexOf(l)) - 1;
		if (r & 4) return Math.max(0, n.indexOf(l)) + 1;
		if (r & 8) return n.length - 1;
		throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
	})(), L = r & 32 ? { preventScroll: true } : {}, a = 0, d = n.length, u;
	do {
		if (a >= d || a + d <= 0) return 0;
		let s = p + a;
		if (r & 16) s = (s + d) % d;
		else {
			if (s < 0) return 3;
			if (s >= d) return 1;
		}
		u = n[s], u?.focus(L), a += x;
	} while (u !== i.activeElement);
	return r & 6 && I(u) && u.select(), 2;
}

export { E, N, O, P, S, T, _, c$1 as c, h$1 as h, i, v, w };
//# sourceMappingURL=focus-management-DXpqooZk.mjs.map
