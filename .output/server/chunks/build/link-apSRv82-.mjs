//#region node_modules/@nuxt/ui/dist/runtime/utils/link.js
var nuxtLinkProps = {
	to: {
		type: [String, Object],
		default: void 0,
		required: false
	},
	href: {
		type: [String, Object],
		default: void 0,
		required: false
	},
	target: {
		type: String,
		default: void 0,
		required: false
	},
	rel: {
		type: String,
		default: void 0,
		required: false
	},
	noRel: {
		type: Boolean,
		default: void 0,
		required: false
	},
	prefetch: {
		type: Boolean,
		default: void 0,
		required: false
	},
	noPrefetch: {
		type: Boolean,
		default: void 0,
		required: false
	},
	activeClass: {
		type: String,
		default: void 0,
		required: false
	},
	exactActiveClass: {
		type: String,
		default: void 0,
		required: false
	},
	prefetchedClass: {
		type: String,
		default: void 0,
		required: false
	},
	replace: {
		type: Boolean,
		default: void 0,
		required: false
	},
	ariaCurrentValue: {
		type: String,
		default: void 0,
		required: false
	},
	external: {
		type: Boolean,
		default: void 0,
		required: false
	}
};
var uLinkProps = {
	as: {
		type: String,
		default: "button"
	},
	type: {
		type: String,
		default: "button"
	},
	disabled: {
		type: Boolean,
		default: null
	},
	active: {
		type: Boolean,
		default: void 0
	},
	exact: {
		type: Boolean,
		default: false
	},
	exactQuery: {
		type: Boolean,
		default: false
	},
	exactHash: {
		type: Boolean,
		default: false
	},
	inactiveClass: {
		type: String,
		default: void 0
	}
};
var getNuxtLinkProps = (props) => {
	return Object.keys(nuxtLinkProps).reduce((acc, key) => {
		if (props[key] !== void 0) acc[key] = props[key];
		return acc;
	}, {});
};
var getULinkProps = (props) => {
	const keys = Object.keys(props);
	const ariaKeys = keys.filter((key) => key.startsWith("aria-"));
	const dataKeys = keys.filter((key) => key.startsWith("data-"));
	return [
		...Object.keys(nuxtLinkProps),
		...Object.keys(uLinkProps),
		...ariaKeys,
		...dataKeys
	].reduce((acc, key) => {
		if (props[key] !== void 0) acc[key] = props[key];
		return acc;
	}, {});
};

export { getULinkProps as a, getNuxtLinkProps as g, nuxtLinkProps as n };
//# sourceMappingURL=link-apSRv82-.mjs.map
