import { ref, computed } from 'vue';

//#region node_modules/@headlessui/vue/dist/hooks/use-controllable.js
function d(u, e, r) {
	let i = ref(r == null ? void 0 : r.value), f = computed(() => u.value !== void 0);
	return [computed(() => f.value ? u.value : i.value), function(t) {
		return f.value || (i.value = t), e == null ? void 0 : e(t);
	}];
}
//#endregion
//#region node_modules/@headlessui/vue/dist/utils/form.js
function e(i = {}, s = null, t = []) {
	for (let [r, n] of Object.entries(i)) o(t, f(s, r), n);
	return t;
}
function f(i, s) {
	return i ? i + "[" + s + "]" : s;
}
function o(i, s, t) {
	if (Array.isArray(t)) for (let [r, n] of t.entries()) o(i, f(s, r.toString()), n);
	else t instanceof Date ? i.push([s, t.toISOString()]) : typeof t == "boolean" ? i.push([s, t ? "1" : "0"]) : typeof t == "string" ? i.push([s, t]) : typeof t == "number" ? i.push([s, `${t}`]) : t == null ? i.push([s, ""]) : e(t, s, i);
}
function p(i) {
	var t, r;
	let s = (t = i == null ? void 0 : i.form) != null ? t : i.closest("form");
	if (s) {
		for (let n of s.elements) if (n !== i && (n.tagName === "INPUT" && n.type === "submit" || n.tagName === "BUTTON" && n.type === "submit" || n.nodeName === "INPUT" && n.type === "image")) {
			n.click();
			return;
		}
		(r = s.requestSubmit) == null || r.call(s);
	}
}

export { d, e, p };
//# sourceMappingURL=form-BjTHmaPY.mjs.map
