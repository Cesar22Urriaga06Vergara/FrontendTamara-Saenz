import { i, A } from './keyboard-DE1QlhcY.mjs';
import { ref, provide, computed, defineComponent, unref, inject } from 'vue';

//#region node_modules/@headlessui/vue/dist/components/description/description.js
var u = Symbol("DescriptionContext");
function w() {
	let t = inject(u, null);
	if (t === null) throw new Error("Missing parent");
	return t;
}
function k({ slot: t = ref({}), name: o = "Description", props: s = {} } = {}) {
	let e = ref([]);
	function r(n) {
		return e.value.push(n), () => {
			let i = e.value.indexOf(n);
			i !== -1 && e.value.splice(i, 1);
		};
	}
	return provide(u, {
		register: r,
		slot: t,
		name: o,
		props: s
	}), computed(() => e.value.length > 0 ? e.value.join(" ") : void 0);
}
defineComponent({
	name: "Description",
	props: {
		as: {
			type: [Object, String],
			default: "p"
		},
		id: {
			type: String,
			default: null
		}
	},
	setup(t, { attrs: o, slots: s }) {
		var n;
		let e = (n = t.id) != null ? n : `headlessui-description-${i()}`, r = w();
		return () => {
			let { name: i = "Description", slot: l = ref({}), props: d = {} } = r, { ...c } = t, f = {
				...Object.entries(d).reduce((a, [g, m]) => Object.assign(a, { [g]: unref(m) }), {}),
				id: e
			};
			return A({
				ourProps: f,
				theirProps: c,
				slot: l.value,
				attrs: o,
				slots: s,
				name: i
			});
		};
	}
});

export { k };
//# sourceMappingURL=description-xz0pTumQ.mjs.map
