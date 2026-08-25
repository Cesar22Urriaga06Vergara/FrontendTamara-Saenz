import { c as __exportAll, _ as _plugin_vue_export_helper_default, m as mergeConfig, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default } from '../virtual/entry.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { b as button_default } from './button-BNOdwSP_.mjs';
import { t as Button_default } from './Button-CoYovqJ9.mjs';
import { mergeProps, defineComponent, toRef, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import 'nostics';
import 'nostics/formatters/ansi';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:path';
import '@vue/shared';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@vueuse/core';
import 'tailwind-merge';
import '@iconify/vue';
import './link-apSRv82-.mjs';
import './Icon-DzlsKOwd.mjs';
import './components-CzgPFaUd.mjs';
import '@iconify/utils/lib/css/icon';
import './useButtonGroup-OQHG41CY.mjs';
import './Link-CnaKOPmE.mjs';

//#region node_modules/@nuxt/ui/dist/runtime/ui.config/navigation/pagination.js
var pagination_default = {
	wrapper: "flex items-center -space-x-px",
	base: "",
	rounded: "first:rounded-s-md last:rounded-e-md",
	default: {
		size: "sm",
		activeButton: { color: "primary" },
		inactiveButton: { color: "white" },
		firstButton: {
			color: "white",
			class: "rtl:[&_span:first-child]:rotate-180",
			icon: "i-heroicons-chevron-double-left-20-solid"
		},
		lastButton: {
			color: "white",
			class: "rtl:[&_span:last-child]:rotate-180",
			icon: "i-heroicons-chevron-double-right-20-solid"
		},
		prevButton: {
			color: "white",
			class: "rtl:[&_span:first-child]:rotate-180",
			icon: "i-heroicons-chevron-left-20-solid"
		},
		nextButton: {
			color: "white",
			class: "rtl:[&_span:last-child]:rotate-180",
			icon: "i-heroicons-chevron-right-20-solid"
		}
	}
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/navigation/Pagination.vue
var Pagination_exports = /* @__PURE__ */ __exportAll({ default: () => Pagination_default });
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.pagination, pagination_default);
var buttonConfig = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.button, button_default);
var _sfc_main = defineComponent({
	components: { UButton: Button_default },
	inheritAttrs: false,
	props: {
		modelValue: {
			type: Number,
			required: true
		},
		pageCount: {
			type: Number,
			default: 10
		},
		total: {
			type: Number,
			required: true
		},
		max: {
			type: Number,
			default: 7,
			validate(value) {
				return value >= 5 && value < Number.MAX_VALUE;
			}
		},
		disabled: {
			type: Boolean,
			default: false
		},
		size: {
			type: String,
			default: () => config.default.size,
			validator(value) {
				return Object.keys(buttonConfig.size).includes(value);
			}
		},
		to: {
			type: Function,
			default: null
		},
		activeButton: {
			type: Object,
			default: () => config.default.activeButton
		},
		inactiveButton: {
			type: Object,
			default: () => config.default.inactiveButton
		},
		showFirst: {
			type: Boolean,
			default: false
		},
		showLast: {
			type: Boolean,
			default: false
		},
		firstButton: {
			type: Object,
			default: () => config.default.firstButton
		},
		lastButton: {
			type: Object,
			default: () => config.default.lastButton
		},
		prevButton: {
			type: Object,
			default: () => config.default.prevButton
		},
		nextButton: {
			type: Object,
			default: () => config.default.nextButton
		},
		divider: {
			type: String,
			default: "…"
		},
		class: {
			type: [
				String,
				Object,
				Array
			],
			default: () => ""
		},
		ui: {
			type: Object,
			default: () => ({})
		}
	},
	emits: ["update:modelValue"],
	setup(props, { emit }) {
		const { ui, attrs } = useUI("pagination", toRef(props, "ui"), config, toRef(props, "class"));
		const currentPage = computed({
			get() {
				return props.modelValue;
			},
			set(value) {
				emit("update:modelValue", value);
			}
		});
		const pages = computed(() => Array.from({ length: Math.ceil(props.total / props.pageCount) }, (_, i) => i + 1));
		const displayedPages = computed(() => {
			const totalPages = pages.value.length;
			const current = currentPage.value;
			const maxDisplayedPages = Math.max(props.max, 5);
			const r = Math.floor((Math.min(maxDisplayedPages, totalPages) - 5) / 2);
			const r1 = current - r;
			const r2 = current + r;
			const beforeWrapped = r1 - 1 > 1;
			const afterWrapped = r2 + 1 < totalPages;
			const items = [];
			if (totalPages <= maxDisplayedPages) {
				for (let i = 1; i <= totalPages; i++) items.push(i);
				return items;
			}
			items.push(1);
			if (beforeWrapped) items.push(props.divider);
			if (!afterWrapped) {
				const addedItems = current + r + 2 - totalPages;
				for (let i = current - r - addedItems; i <= current - r - 1; i++) items.push(i);
			}
			for (let i = Math.max(2, r1); i <= Math.min(totalPages, r2); i++) items.push(i);
			if (!beforeWrapped) {
				const addedItems = 1 - (current - r - 2);
				for (let i = current + r + 1; i <= current + r + addedItems; i++) items.push(i);
			}
			if (afterWrapped) items.push(props.divider);
			if (r2 < totalPages) items.push(totalPages);
			if (items.length >= 3 && items[1] === props.divider && items[2] === 3) items[1] = 2;
			if (items.length >= 3 && items[items.length - 2] === props.divider && items[items.length - 1] === items.length) items[items.length - 2] = items.length - 1;
			return items;
		});
		const canGoFirstOrPrev = computed(() => currentPage.value > 1);
		const canGoLastOrNext = computed(() => currentPage.value < pages.value.length);
		function onClickFirst() {
			if (!canGoFirstOrPrev.value) return;
			currentPage.value = 1;
		}
		function onClickLast() {
			if (!canGoLastOrNext.value) return;
			currentPage.value = pages.value.length;
		}
		function onClickPage(page) {
			if (typeof page === "string") return;
			currentPage.value = page;
		}
		function onClickPrev() {
			if (!canGoFirstOrPrev.value) return;
			currentPage.value--;
		}
		function onClickNext() {
			if (!canGoLastOrNext.value) return;
			currentPage.value++;
		}
		return {
			ui,
			attrs,
			currentPage,
			pages,
			displayedPages,
			canGoLastOrNext,
			canGoFirstOrPrev,
			onClickPrev,
			onClickNext,
			onClickPage,
			onClickFirst,
			onClickLast
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_UButton = Button_default;
	_push(`<div${ssrRenderAttrs(mergeProps({ class: _ctx.ui.wrapper }, _ctx.attrs, _attrs))}>`);
	ssrRenderSlot(_ctx.$slots, "first", {
		onClick: _ctx.onClickFirst,
		canGoFirst: _ctx.canGoFirstOrPrev
	}, () => {
		if (_ctx.firstButton && _ctx.showFirst) _push(ssrRenderComponent(_component_UButton, mergeProps({
			size: _ctx.size,
			to: _ctx.to?.(1),
			disabled: !_ctx.canGoFirstOrPrev || _ctx.disabled,
			class: [_ctx.ui.base, _ctx.ui.rounded]
		}, {
			..._ctx.ui.default.firstButton || {},
			..._ctx.firstButton
		}, {
			ui: { rounded: "" },
			"aria-label": "First",
			onClick: _ctx.onClickFirst
		}), null, _parent));
		else _push(`<!---->`);
	}, _push, _parent);
	ssrRenderSlot(_ctx.$slots, "prev", {
		onClick: _ctx.onClickPrev,
		canGoPrev: _ctx.canGoFirstOrPrev
	}, () => {
		if (_ctx.prevButton) _push(ssrRenderComponent(_component_UButton, mergeProps({
			size: _ctx.size,
			to: _ctx.to?.(_ctx.currentPage - 1),
			disabled: !_ctx.canGoFirstOrPrev || _ctx.disabled,
			class: [_ctx.ui.base, _ctx.ui.rounded]
		}, {
			..._ctx.ui.default.prevButton || {},
			..._ctx.prevButton
		}, {
			ui: { rounded: "" },
			"aria-label": "Prev",
			onClick: _ctx.onClickPrev
		}), null, _parent));
		else _push(`<!---->`);
	}, _push, _parent);
	_push(`<!--[-->`);
	ssrRenderList(_ctx.displayedPages, (page, index) => {
		_push(ssrRenderComponent(_component_UButton, mergeProps({
			key: `${page}-${index}`,
			to: typeof page === "number" ? _ctx.to?.(page) : null,
			size: _ctx.size,
			disabled: _ctx.disabled,
			label: `${page}`
		}, { ref_for: true }, page === _ctx.currentPage ? {
			..._ctx.ui.default.activeButton || {},
			..._ctx.activeButton
		} : {
			..._ctx.ui.default.inactiveButton || {},
			..._ctx.inactiveButton
		}, {
			class: [
				{
					"pointer-events-none": typeof page === "string",
					"z-[1]": page === _ctx.currentPage
				},
				_ctx.ui.base,
				_ctx.ui.rounded
			],
			ui: { rounded: "" },
			onClick: () => _ctx.onClickPage(page)
		}), null, _parent));
	});
	_push(`<!--]-->`);
	ssrRenderSlot(_ctx.$slots, "next", {
		onClick: _ctx.onClickNext,
		canGoNext: _ctx.canGoLastOrNext
	}, () => {
		if (_ctx.nextButton) _push(ssrRenderComponent(_component_UButton, mergeProps({
			size: _ctx.size,
			to: _ctx.to?.(_ctx.currentPage + 1),
			disabled: !_ctx.canGoLastOrNext || _ctx.disabled,
			class: [_ctx.ui.base, _ctx.ui.rounded]
		}, {
			..._ctx.ui.default.nextButton || {},
			..._ctx.nextButton
		}, {
			ui: { rounded: "" },
			"aria-label": "Next",
			onClick: _ctx.onClickNext
		}), null, _parent));
		else _push(`<!---->`);
	}, _push, _parent);
	ssrRenderSlot(_ctx.$slots, "last", {
		onClick: _ctx.onClickLast,
		canGoLast: _ctx.canGoLastOrNext
	}, () => {
		if (_ctx.lastButton && _ctx.showLast) _push(ssrRenderComponent(_component_UButton, mergeProps({
			size: _ctx.size,
			to: _ctx.to?.(_ctx.pages.length),
			disabled: !_ctx.canGoLastOrNext || _ctx.disabled,
			class: [_ctx.ui.base, _ctx.ui.rounded]
		}, {
			..._ctx.ui.default.lastButton || {},
			..._ctx.lastButton
		}, {
			ui: { rounded: "" },
			"aria-label": "Last",
			onClick: _ctx.onClickLast
		}), null, _parent));
		else _push(`<!---->`);
	}, _push, _parent);
	_push(`</div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/navigation/Pagination.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Pagination_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UPagination" });

export { Pagination_exports as n, Pagination_default as t };
//# sourceMappingURL=Pagination-CVW3oGYj.mjs.map
