import { o as o$1 } from './keyboard-DE1QlhcY.mjs';
import { c as c$1, w as w$2, h as h$1 } from './focus-management-DXpqooZk.mjs';
import { ref, computed, watchEffect } from 'vue';

//#region node_modules/@headlessui/vue/dist/utils/platform.js
function t() {
	return /iPhone/gi.test((void 0).navigator.platform) || /Mac/gi.test((void 0).navigator.platform) && (void 0).navigator.maxTouchPoints > 0;
}
function i() {
	return /Android/gi.test((void 0).navigator.userAgent);
}
function n() {
	return t() || i();
}
//#endregion
//#region node_modules/@headlessui/vue/dist/hooks/use-document-event.js
function u(e, t, n) {
	c$1.isServer || watchEffect((o) => {
		(void 0).addEventListener(e, t, n), o(() => (void 0).removeEventListener(e, t, n));
	});
}
//#endregion
//#region node_modules/@headlessui/vue/dist/hooks/use-window-event.js
function w$1(e, n, t) {
	c$1.isServer || watchEffect((o) => {
		(void 0).addEventListener(e, n, t), o(() => (void 0).removeEventListener(e, n, t));
	});
}
//#endregion
//#region node_modules/@headlessui/vue/dist/hooks/use-outside-click.js
function w(f, m, l = computed(() => true)) {
	function a(e, r) {
		if (!l.value || e.defaultPrevented) return;
		let t = r(e);
		if (t === null || !t.getRootNode().contains(t)) return;
		let c = function o(n) {
			return typeof n == "function" ? o(n()) : Array.isArray(n) || n instanceof Set ? n : [n];
		}(f);
		for (let o$1$1 of c) {
			if (o$1$1 === null) continue;
			let n = o$1$1 instanceof HTMLElement ? o$1$1 : o$1(o$1$1);
			if (n != null && n.contains(t) || e.composed && e.composedPath().includes(n)) return;
		}
		return !w$2(t, h$1.Loose) && t.tabIndex !== -1 && e.preventDefault(), m(e, t);
	}
	let u$1 = ref(null);
	u("pointerdown", (e) => {
		var r, t;
		l.value && (u$1.value = ((t = (r = e.composedPath) == null ? void 0 : r.call(e)) == null ? void 0 : t[0]) || e.target);
	}, true), u("mousedown", (e) => {
		var r, t;
		l.value && (u$1.value = ((t = (r = e.composedPath) == null ? void 0 : r.call(e)) == null ? void 0 : t[0]) || e.target);
	}, true), u("click", (e) => {
		n() || u$1.value && (a(e, () => u$1.value), u$1.value = null);
	}, true), u("touchend", (e) => a(e, () => e.target instanceof HTMLElement ? e.target : null), true), w$1("blur", (e) => a(e, () => (void 0).document.activeElement instanceof HTMLIFrameElement ? (void 0).document.activeElement : null), true);
}

export { w$1 as a, n, t, w };
//# sourceMappingURL=use-outside-click-E0zCHGRJ.mjs.map
