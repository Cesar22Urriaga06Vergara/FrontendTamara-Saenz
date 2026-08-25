import { _ as _plugin_vue_export_helper_default, t as twMerge, m as mergeConfig, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default } from '../virtual/entry.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { t as Button_default } from './Button-CoYovqJ9.mjs';
import { mergeProps, defineComponent, toRef, ref, computed, useSSRContext } from 'vue';
import { useScroll, useElementSize, useResizeObserver } from '@vueuse/core';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrRenderSlot, ssrRenderComponent } from 'vue/server-renderer';
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
import 'tailwind-merge';
import '@iconify/vue';
import './link-apSRv82-.mjs';
import './Icon-DzlsKOwd.mjs';
import './components-CzgPFaUd.mjs';
import '@iconify/utils/lib/css/icon';
import './useButtonGroup-OQHG41CY.mjs';
import './button-BNOdwSP_.mjs';
import './Link-CnaKOPmE.mjs';

//#region node_modules/@nuxt/ui/dist/runtime/ui.config/elements/carousel.js
var carousel_default = {
	wrapper: "relative",
	container: "relative w-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth",
	item: "flex flex-none snap-center",
	arrows: { wrapper: "flex items-center justify-between" },
	indicators: {
		wrapper: "absolute flex items-center justify-center gap-3 bottom-4 inset-x-0",
		base: "rounded-full h-3 w-3",
		active: "bg-primary-500 dark:bg-primary-400",
		inactive: "bg-gray-100 dark:bg-gray-800"
	},
	default: {
		prevButton: {
			color: "black",
			class: "rtl:[&_span:first-child]:rotate-180 absolute start-4 top-1/2 transform -translate-y-1/2 rounded-full",
			icon: "i-heroicons-chevron-left-20-solid"
		},
		nextButton: {
			color: "black",
			class: "rtl:[&_span:last-child]:rotate-180 absolute end-4 top-1/2 transform -translate-y-1/2 rounded-full",
			icon: "i-heroicons-chevron-right-20-solid"
		}
	}
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/composables/useCarouselScroll.js
var useCarouselScroll = (el) => {
	ref(0);
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/elements/Carousel.vue
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.carousel, carousel_default);
var _sfc_main = defineComponent({
	components: { UButton: Button_default },
	inheritAttrs: false,
	props: {
		items: {
			type: Array,
			default: () => []
		},
		arrows: {
			type: Boolean,
			default: false
		},
		indicators: {
			type: Boolean,
			default: false
		},
		dir: {
			type: String,
			default: "ltr"
		},
		prevButton: {
			type: Object,
			default: () => config.default.prevButton
		},
		nextButton: {
			type: Object,
			default: () => config.default.nextButton
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
			default: void 0
		}
	},
	setup(props, { expose }) {
		const { ui, attrs } = useUI("carousel", toRef(props, "ui"), config, toRef(props, "class"));
		const carouselRef = ref();
		const itemWidth = ref(0);
		const { x } = useScroll(carouselRef, { behavior: "smooth" });
		const { width: carouselWidth } = useElementSize(carouselRef);
		useCarouselScroll();
		useResizeObserver(carouselRef, (entries) => {
			const [entry] = entries;
			itemWidth.value = entry?.target?.firstElementChild?.clientWidth || 0;
		});
		const isRtl = computed(() => props.dir === "rtl");
		const currentPage = computed(() => {
			if (!itemWidth.value) return 0;
			return isRtl.value ? Math.round(-x.value / itemWidth.value) + 1 : Math.round(x.value / itemWidth.value) + 1;
		});
		const pages = computed(() => {
			if (!itemWidth.value) return 0;
			const itemDivisions = Math.round(carouselWidth.value / itemWidth.value);
			if (props.items.length <= itemDivisions) return 0;
			return props.items.length - itemDivisions + 1;
		});
		const isFirst = computed(() => currentPage.value <= 1);
		const isLast = computed(() => currentPage.value === pages.value);
		function onClickNext() {
			x.value += isRtl.value ? -itemWidth.value : itemWidth.value;
		}
		function onClickPrev() {
			x.value -= isRtl.value ? -itemWidth.value : itemWidth.value;
		}
		function onClick(page) {
			x.value = (page - 1) * itemWidth.value * (isRtl.value ? -1 : 1);
		}
		expose({
			pages,
			page: currentPage,
			prev: onClickPrev,
			next: onClickNext,
			select: onClick
		});
		return {
			ui,
			attrs,
			isFirst,
			isLast,
			carouselRef,
			pages,
			currentPage,
			onClickNext,
			onClickPrev,
			onClick,
			twMerge
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_UButton = Button_default;
	_push(`<div${ssrRenderAttrs(mergeProps({ class: _ctx.ui.wrapper }, _ctx.attrs, { dir: _ctx.dir }, _attrs))} data-v-7b800b32><div class="${ssrRenderClass([_ctx.ui.container, "no-scrollbar"])}" data-v-7b800b32><!--[-->`);
	ssrRenderList(_ctx.items, (item, index) => {
		_push(`<div class="${ssrRenderClass(_ctx.ui.item)}"${ssrRenderAttr("role", _ctx.indicators ? "tabpanel" : null)} data-v-7b800b32>`);
		ssrRenderSlot(_ctx.$slots, "default", {
			item,
			index
		}, null, _push, _parent);
		_push(`</div>`);
	});
	_push(`<!--]--></div>`);
	if (_ctx.arrows) {
		_push(`<div class="${ssrRenderClass(_ctx.ui.arrows.wrapper)}" data-v-7b800b32>`);
		ssrRenderSlot(_ctx.$slots, "prev", {
			onClick: _ctx.onClickPrev,
			disabled: _ctx.isFirst
		}, () => {
			if (_ctx.prevButton) _push(ssrRenderComponent(_component_UButton, mergeProps({ disabled: _ctx.isFirst }, {
				..._ctx.ui.default.prevButton,
				..._ctx.prevButton
			}, {
				class: _ctx.twMerge(_ctx.ui.default.prevButton.class, _ctx.prevButton?.class),
				"aria-label": "Prev",
				onClick: _ctx.onClickPrev
			}), null, _parent));
			else _push(`<!---->`);
		}, _push, _parent);
		ssrRenderSlot(_ctx.$slots, "next", {
			onClick: _ctx.onClickNext,
			disabled: _ctx.isLast
		}, () => {
			if (_ctx.nextButton) _push(ssrRenderComponent(_component_UButton, mergeProps({ disabled: _ctx.isLast }, {
				..._ctx.ui.default.nextButton,
				..._ctx.nextButton
			}, {
				class: _ctx.twMerge(_ctx.ui.default.nextButton.class, _ctx.nextButton?.class),
				"aria-label": "Next",
				onClick: _ctx.onClickNext
			}), null, _parent));
			else _push(`<!---->`);
		}, _push, _parent);
		_push(`</div>`);
	} else _push(`<!---->`);
	if (_ctx.indicators) {
		_push(`<div role="tablist" class="${ssrRenderClass(_ctx.ui.indicators.wrapper)}" data-v-7b800b32><!--[-->`);
		ssrRenderList(_ctx.pages, (page) => {
			ssrRenderSlot(_ctx.$slots, "indicator", {
				onClick: _ctx.onClick,
				active: page === _ctx.currentPage,
				page
			}, () => {
				_push(`<button type="button" role="tab"${ssrRenderAttr("aria-selected", page === _ctx.currentPage)} class="${ssrRenderClass([_ctx.ui.indicators.base, page === _ctx.currentPage ? _ctx.ui.indicators.active : _ctx.ui.indicators.inactive])}"${ssrRenderAttr("aria-label", `set slide ${page}`)} data-v-7b800b32></button>`);
			}, _push, _parent);
		});
		_push(`<!--]--></div>`);
	} else _push(`<!---->`);
	_push(`</div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/elements/Carousel.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Carousel_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-7b800b32"]]), { __name: "UCarousel" });

export { Carousel_default as default };
//# sourceMappingURL=Carousel-C8Gg_dEV.mjs.map
