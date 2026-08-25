import { _ as _plugin_vue_export_helper_default, o as omit, m as mergeConfig, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default } from '../virtual/entry.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { b as button_default } from './button-BNOdwSP_.mjs';
import { t as Button_default } from './Button-CoYovqJ9.mjs';
import { s, A, N as N$1, o as o$1, i as i$1, u, a as o } from './keyboard-DE1QlhcY.mjs';
import { s as s$1 } from './use-resolve-button-type-DZKnDGM_.mjs';
import { l, i, t } from './open-closed-Css0b1VQ.mjs';
import { resolveComponent, mergeProps, withCtx, createVNode, renderSlot, createTextVNode, toDisplayString, withKeys, Transition, openBlock, createBlock, withDirectives, vShow, defineComponent, toRef, computed, ref, watch, provide, watchEffect, inject, useId, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderSlot, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
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
import './components-CzgPFaUd.mjs';
import '@iconify/utils/lib/css/icon';
import './link-apSRv82-.mjs';
import './useButtonGroup-OQHG41CY.mjs';
import './Link-CnaKOPmE.mjs';

//#region node_modules/@nuxt/ui/dist/runtime/ui.config/elements/accordion.js
var accordion_default = {
	wrapper: "w-full flex flex-col",
	container: "w-full flex flex-col",
	item: {
		base: "",
		size: "text-sm",
		color: "text-gray-500 dark:text-gray-400",
		padding: "pt-1.5 pb-3",
		icon: "ms-auto transform transition-transform duration-200 flex-shrink-0"
	},
	transition: {
		enterActiveClass: "overflow-hidden transition-[height] duration-200 ease-out",
		leaveActiveClass: "overflow-hidden transition-[height] duration-200 ease-out"
	},
	default: {
		openIcon: "i-heroicons-chevron-down-20-solid",
		closeIcon: "",
		class: "mb-1.5 w-full",
		variant: "soft",
		truncate: true
	}
};
//#endregion
//#region node_modules/@headlessui/vue/dist/components/disclosure/disclosure.js
var $ = ((o) => (o[o.Open = 0] = "Open", o[o.Closed = 1] = "Closed", o))($ || {});
var T = Symbol("DisclosureContext");
function O(t) {
	let r = inject(T, null);
	if (r === null) {
		let o = /* @__PURE__ */ new Error(`<${t} /> is missing a parent <Disclosure /> component.`);
		throw Error.captureStackTrace && Error.captureStackTrace(o, O), o;
	}
	return r;
}
var k = Symbol("DisclosurePanelContext");
function U() {
	return inject(k, null);
}
var N = defineComponent({
	name: "Disclosure",
	props: {
		as: {
			type: [Object, String],
			default: "template"
		},
		defaultOpen: {
			type: [Boolean],
			default: false
		}
	},
	setup(t$1, { slots: r, attrs: o$2 }) {
		let s = ref(t$1.defaultOpen ? 0 : 1), e = ref(null), i$2 = ref(null), n = {
			buttonId: ref(`headlessui-disclosure-button-${i$1()}`),
			panelId: ref(`headlessui-disclosure-panel-${i$1()}`),
			disclosureState: s,
			panel: e,
			button: i$2,
			toggleDisclosure() {
				s.value = u(s.value, {
					[0]: 1,
					[1]: 0
				});
			},
			closeDisclosure() {
				s.value !== 1 && (s.value = 1);
			},
			close(l) {
				n.closeDisclosure();
				(() => l ? l instanceof HTMLElement ? l : l.value instanceof HTMLElement ? o$1(l) : o$1(n.button) : o$1(n.button))()?.focus();
			}
		};
		return provide(T, n), t(computed(() => u(s.value, {
			[0]: i.Open,
			[1]: i.Closed
		}))), () => {
			let { defaultOpen: l, ...a } = t$1, c = {
				open: s.value === 0,
				close: n.close
			};
			return A({
				theirProps: a,
				ourProps: {},
				slot: c,
				slots: r,
				attrs: o$2,
				name: "Disclosure"
			});
		};
	}
});
var Q = defineComponent({
	name: "DisclosureButton",
	props: {
		as: {
			type: [Object, String],
			default: "button"
		},
		disabled: {
			type: [Boolean],
			default: false
		},
		id: {
			type: String,
			default: null
		}
	},
	setup(t, { attrs: r, slots: o$3, expose: s }) {
		let e = O("DisclosureButton"), i = U(), n = computed(() => i === null ? false : i.value === e.panelId.value);
		let l = ref(null);
		s({
			el: l,
			$el: l
		}), n.value || watchEffect(() => {
			e.button.value = l.value;
		});
		let a = s$1(computed(() => ({
			as: t.as,
			type: r.type
		})), l);
		function c() {
			var u;
			t.disabled || (n.value ? (e.toggleDisclosure(), (u = o$1(e.button)) == null || u.focus()) : e.toggleDisclosure());
		}
		function D(u) {
			var S;
			if (!t.disabled) if (n.value) switch (u.key) {
				case o.Space:
				case o.Enter:
					u.preventDefault(), u.stopPropagation(), e.toggleDisclosure(), (S = o$1(e.button)) == null || S.focus();
					break;
			}
			else switch (u.key) {
				case o.Space:
				case o.Enter:
					u.preventDefault(), u.stopPropagation(), e.toggleDisclosure();
					break;
			}
		}
		function v(u) {
			switch (u.key) {
				case o.Space: u.preventDefault();
			}
		}
		return () => {
			var C;
			let u = { open: e.disclosureState.value === 0 }, { id: S, ...K } = t, M = n.value ? {
				ref: l,
				type: a.value,
				onClick: c,
				onKeydown: D
			} : {
				id: (C = e.buttonId.value) != null ? C : S,
				ref: l,
				type: a.value,
				"aria-expanded": e.disclosureState.value === 0,
				"aria-controls": e.disclosureState.value === 0 || o$1(e.panel) ? e.panelId.value : void 0,
				disabled: t.disabled ? true : void 0,
				onClick: c,
				onKeydown: D,
				onKeyup: v
			};
			return A({
				ourProps: M,
				theirProps: K,
				slot: u,
				attrs: r,
				slots: o$3,
				name: "DisclosureButton"
			});
		};
	}
});
var V = defineComponent({
	name: "DisclosurePanel",
	props: {
		as: {
			type: [Object, String],
			default: "div"
		},
		static: {
			type: Boolean,
			default: false
		},
		unmount: {
			type: Boolean,
			default: true
		},
		id: {
			type: String,
			default: null
		}
	},
	setup(t, { attrs: r, slots: o, expose: s }) {
		let e = O("DisclosurePanel");
		s({
			el: e.panel,
			$el: e.panel
		}), provide(k, e.panelId);
		let i$1 = l(), n = computed(() => i$1 !== null ? (i$1.value & i.Open) === i.Open : e.disclosureState.value === 0);
		return () => {
			var v;
			let l = {
				open: e.disclosureState.value === 0,
				close: e.close
			}, { id: a, ...c } = t, D = {
				id: (v = e.panelId.value) != null ? v : a,
				ref: e.panel
			};
			return A({
				ourProps: D,
				theirProps: c,
				slot: l,
				attrs: r,
				slots: o,
				features: N$1.RenderStrategy | N$1.Static,
				visible: n.value,
				name: "DisclosurePanel"
			});
		};
	}
});
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/elements/Accordion.vue
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.accordion, accordion_default);
var configButton = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.button, button_default);
var _sfc_main = defineComponent({
	components: {
		HDisclosure: N,
		HDisclosureButton: Q,
		HDisclosurePanel: V,
		UIcon: Icon_default,
		UButton: Button_default
	},
	inheritAttrs: false,
	props: {
		items: {
			type: Array,
			default: () => []
		},
		defaultOpen: {
			type: Boolean,
			default: false
		},
		openIcon: {
			type: String,
			default: () => config.default.openIcon
		},
		unmount: {
			type: Boolean,
			default: false
		},
		closeIcon: {
			type: String,
			default: () => config.default.closeIcon
		},
		multiple: {
			type: Boolean,
			default: false
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
	emits: ["open", "close"],
	setup(props, { emit }) {
		const { ui, attrs } = useUI("accordion", toRef(props, "ui"), config, toRef(props, "class"));
		const uiButton = computed(() => configButton);
		const buttonRefs = ref([]);
		const openedStates = computed(() => buttonRefs.value.map(({ open }) => open));
		watch(openedStates, (newValue, oldValue) => {
			for (const index in newValue) {
				const isOpenBefore = oldValue[index];
				const isOpenAfter = newValue[index];
				if (!isOpenBefore && isOpenAfter) emit("open", index);
				else if (isOpenBefore && !isOpenAfter) emit("close", index);
			}
		}, { immediate: true });
		function closeOthers(currentIndex, e) {
			if (!props.items[currentIndex].closeOthers && props.multiple) return;
			buttonRefs.value.forEach((button2) => {
				if (button2.open) button2.close(e.target);
			});
		}
		function onEnter(_el, done) {
			const el = _el;
			el.style.height = "0";
			el.offsetHeight;
			el.style.height = el.scrollHeight + "px";
			el.addEventListener("transitionend", done, { once: true });
		}
		function onBeforeLeave(_el) {
			const el = _el;
			el.style.height = el.scrollHeight + "px";
			el.offsetHeight;
		}
		function onAfterEnter(_el) {
			const el = _el;
			el.style.height = "auto";
		}
		function onLeave(_el, done) {
			const el = _el;
			el.style.height = "0";
			el.addEventListener("transitionend", done, { once: true });
		}
		s(() => useId());
		return {
			ui,
			uiButton,
			attrs,
			buttonRefs,
			closeOthers,
			omit,
			onEnter,
			onBeforeLeave,
			onAfterEnter,
			onLeave
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_HDisclosure = resolveComponent("HDisclosure");
	const _component_HDisclosureButton = resolveComponent("HDisclosureButton");
	const _component_UButton = Button_default;
	const _component_UIcon = Icon_default;
	const _component_HDisclosurePanel = resolveComponent("HDisclosurePanel");
	_push(`<div${ssrRenderAttrs(mergeProps({ class: _ctx.ui.wrapper }, _attrs))}><!--[-->`);
	ssrRenderList(_ctx.items, (item, index) => {
		_push(ssrRenderComponent(_component_HDisclosure, {
			key: index,
			as: "div",
			class: _ctx.ui.container,
			"default-open": _ctx.defaultOpen || item.defaultOpen
		}, {
			default: withCtx(({ open, close }, _push, _parent, _scopeId) => {
				if (_push) {
					_push(ssrRenderComponent(_component_HDisclosureButton, {
						ref_for: true,
						ref: () => _ctx.buttonRefs[index] = {
							open,
							close
						},
						as: "template",
						disabled: item.disabled,
						onClick: ($event) => _ctx.closeOthers(index, $event),
						onKeydown: [($event) => _ctx.closeOthers(index, $event), ($event) => _ctx.closeOthers(index, $event)]
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) ssrRenderSlot(_ctx.$slots, "default", {
								item,
								index,
								open,
								close
							}, () => {
								_push(ssrRenderComponent(_component_UButton, mergeProps({ ref_for: true }, {
									..._ctx.omit(_ctx.ui.default, ["openIcon", "closeIcon"]),
									..._ctx.attrs,
									..._ctx.omit(item, [
										"slot",
										"disabled",
										"content",
										"defaultOpen"
									])
								}), {
									trailing: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UIcon, {
											name: !open ? _ctx.openIcon : _ctx.closeIcon ? _ctx.closeIcon : _ctx.openIcon,
											class: [
												open && !_ctx.closeIcon ? "-rotate-180" : "",
												_ctx.uiButton.icon.size[item.size || _ctx.uiButton.default.size],
												_ctx.ui.item.icon
											]
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UIcon, {
											name: !open ? _ctx.openIcon : _ctx.closeIcon ? _ctx.closeIcon : _ctx.openIcon,
											class: [
												open && !_ctx.closeIcon ? "-rotate-180" : "",
												_ctx.uiButton.icon.size[item.size || _ctx.uiButton.default.size],
												_ctx.ui.item.icon
											]
										}, null, 8, ["name", "class"])];
									}),
									_: 2
								}, _parent, _scopeId));
							}, _push, _parent, _scopeId);
							else return [renderSlot(_ctx.$slots, "default", {
								item,
								index,
								open,
								close
							}, () => [createVNode(_component_UButton, mergeProps({ ref_for: true }, {
								..._ctx.omit(_ctx.ui.default, ["openIcon", "closeIcon"]),
								..._ctx.attrs,
								..._ctx.omit(item, [
									"slot",
									"disabled",
									"content",
									"defaultOpen"
								])
							}), {
								trailing: withCtx(() => [createVNode(_component_UIcon, {
									name: !open ? _ctx.openIcon : _ctx.closeIcon ? _ctx.closeIcon : _ctx.openIcon,
									class: [
										open && !_ctx.closeIcon ? "-rotate-180" : "",
										_ctx.uiButton.icon.size[item.size || _ctx.uiButton.default.size],
										_ctx.ui.item.icon
									]
								}, null, 8, ["name", "class"])]),
								_: 2
							}, 1040)])];
						}),
						_: 2
					}, _parent, _scopeId));
					_push(``);
					if (_ctx.unmount) _push(ssrRenderComponent(_component_HDisclosurePanel, {
						class: [
							_ctx.ui.item.base,
							_ctx.ui.item.size,
							_ctx.ui.item.color,
							_ctx.ui.item.padding
						],
						unmount: ""
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) ssrRenderSlot(_ctx.$slots, item.slot || "item", {
								item,
								index,
								open,
								close
							}, () => {
								_push(`${ssrInterpolate(item.content)}`);
							}, _push, _parent, _scopeId);
							else return [renderSlot(_ctx.$slots, item.slot || "item", {
								item,
								index,
								open,
								close
							}, () => [createTextVNode(toDisplayString(item.content), 1)])];
						}),
						_: 2
					}, _parent, _scopeId));
					else {
						_push(`<div style="${ssrRenderStyle(open ? null : { display: "none" })}"${_scopeId}>`);
						_push(ssrRenderComponent(_component_HDisclosurePanel, {
							class: [
								_ctx.ui.item.base,
								_ctx.ui.item.size,
								_ctx.ui.item.color,
								_ctx.ui.item.padding
							],
							static: ""
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) ssrRenderSlot(_ctx.$slots, item.slot || "item", {
									item,
									index,
									open,
									close
								}, () => {
									_push(`${ssrInterpolate(item.content)}`);
								}, _push, _parent, _scopeId);
								else return [renderSlot(_ctx.$slots, item.slot || "item", {
									item,
									index,
									open,
									close
								}, () => [createTextVNode(toDisplayString(item.content), 1)])];
							}),
							_: 2
						}, _parent, _scopeId));
						_push(`</div>`);
					}
				} else return [createVNode(_component_HDisclosureButton, {
					ref_for: true,
					ref: () => _ctx.buttonRefs[index] = {
						open,
						close
					},
					as: "template",
					disabled: item.disabled,
					onClick: ($event) => _ctx.closeOthers(index, $event),
					onKeydown: [withKeys(($event) => _ctx.closeOthers(index, $event), ["enter"]), withKeys(($event) => _ctx.closeOthers(index, $event), ["space"])]
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
						item,
						index,
						open,
						close
					}, () => [createVNode(_component_UButton, mergeProps({ ref_for: true }, {
						..._ctx.omit(_ctx.ui.default, ["openIcon", "closeIcon"]),
						..._ctx.attrs,
						..._ctx.omit(item, [
							"slot",
							"disabled",
							"content",
							"defaultOpen"
						])
					}), {
						trailing: withCtx(() => [createVNode(_component_UIcon, {
							name: !open ? _ctx.openIcon : _ctx.closeIcon ? _ctx.closeIcon : _ctx.openIcon,
							class: [
								open && !_ctx.closeIcon ? "-rotate-180" : "",
								_ctx.uiButton.icon.size[item.size || _ctx.uiButton.default.size],
								_ctx.ui.item.icon
							]
						}, null, 8, ["name", "class"])]),
						_: 2
					}, 1040)])]),
					_: 2
				}, 1032, [
					"disabled",
					"onClick",
					"onKeydown"
				]), createVNode(Transition, mergeProps({ ref_for: true }, _ctx.ui.transition, {
					onEnter: _ctx.onEnter,
					onAfterEnter: _ctx.onAfterEnter,
					onBeforeLeave: _ctx.onBeforeLeave,
					onLeave: _ctx.onLeave
				}), {
					default: withCtx(() => [_ctx.unmount ? (openBlock(), createBlock(_component_HDisclosurePanel, {
						key: 0,
						class: [
							_ctx.ui.item.base,
							_ctx.ui.item.size,
							_ctx.ui.item.color,
							_ctx.ui.item.padding
						],
						unmount: ""
					}, {
						default: withCtx(() => [renderSlot(_ctx.$slots, item.slot || "item", {
							item,
							index,
							open,
							close
						}, () => [createTextVNode(toDisplayString(item.content), 1)])]),
						_: 2
					}, 1032, ["class"])) : withDirectives((openBlock(), createBlock("div", { key: 1 }, [createVNode(_component_HDisclosurePanel, {
						class: [
							_ctx.ui.item.base,
							_ctx.ui.item.size,
							_ctx.ui.item.color,
							_ctx.ui.item.padding
						],
						static: ""
					}, {
						default: withCtx(() => [renderSlot(_ctx.$slots, item.slot || "item", {
							item,
							index,
							open,
							close
						}, () => [createTextVNode(toDisplayString(item.content), 1)])]),
						_: 2
					}, 1032, ["class"])], 512)), [[vShow, open]])]),
					_: 2
				}, 1040, [
					"onEnter",
					"onAfterEnter",
					"onBeforeLeave",
					"onLeave"
				])];
			}),
			_: 2
		}, _parent));
	});
	_push(`<!--]--></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/elements/Accordion.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Accordion_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UAccordion" });

export { Accordion_default as default };
//# sourceMappingURL=Accordion-CoIQPlDu.mjs.map
