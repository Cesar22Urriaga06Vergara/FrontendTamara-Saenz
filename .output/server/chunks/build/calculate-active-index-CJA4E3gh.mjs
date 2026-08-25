import { i as i$1 } from './focus-management-DXpqooZk.mjs';
import { ref, watchEffect } from 'vue';

//#region node_modules/@headlessui/vue/dist/hooks/use-tracked-pointer.js
function r(e) {
	return [e.screenX, e.screenY];
}
function u$1() {
	let e = ref([-1, -1]);
	return {
		wasMoved(n) {
			let t = r(n);
			return e.value[0] === t[0] && e.value[1] === t[1] ? false : (e.value = t, true);
		},
		update(n) {
			e.value = r(n);
		}
	};
}
//#endregion
//#region node_modules/@headlessui/vue/dist/hooks/use-tree-walker.js
function i({ container: e, accept: t, walk: d, enabled: o }) {
	watchEffect(() => {
		let r = e.value;
		if (!r || o !== void 0 && !o.value) return;
		let l = i$1(e);
		if (!l) return;
		let c = Object.assign((f) => t(f), { acceptNode: t }), n = l.createTreeWalker(r, NodeFilter.SHOW_ELEMENT, c, false);
		for (; n.nextNode();) d(n.currentNode);
	});
}
//#endregion
//#region node_modules/@headlessui/vue/dist/utils/calculate-active-index.js
function u(l) {
	throw new Error("Unexpected object: " + l);
}
var c = ((i) => (i[i.First = 0] = "First", i[i.Previous = 1] = "Previous", i[i.Next = 2] = "Next", i[i.Last = 3] = "Last", i[i.Specific = 4] = "Specific", i[i.Nothing = 5] = "Nothing", i))(c || {});
function f(l, n) {
	let t = n.resolveItems();
	if (t.length <= 0) return null;
	let r = n.resolveActiveIndex(), s = r != null ? r : -1;
	switch (l.focus) {
		case 0:
			for (let e = 0; e < t.length; ++e) if (!n.resolveDisabled(t[e], e, t)) return e;
			return r;
		case 1:
			s === -1 && (s = t.length);
			for (let e = s - 1; e >= 0; --e) if (!n.resolveDisabled(t[e], e, t)) return e;
			return r;
		case 2:
			for (let e = s + 1; e < t.length; ++e) if (!n.resolveDisabled(t[e], e, t)) return e;
			return r;
		case 3:
			for (let e = t.length - 1; e >= 0; --e) if (!n.resolveDisabled(t[e], e, t)) return e;
			return r;
		case 4:
			for (let e = 0; e < t.length; ++e) if (n.resolveId(t[e], e, t) === l.id) return e;
			return r;
		case 5: return null;
		default: u(l);
	}
}

export { c, f, i, u$1 as u };
//# sourceMappingURL=calculate-active-index-CJA4E3gh.mjs.map
