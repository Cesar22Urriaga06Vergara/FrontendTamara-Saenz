import { _ as _plugin_vue_export_helper_default, m as mergeConfig, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default } from '../virtual/entry.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { t } from './micro-task-Dv1257jF.mjs';
import { s, i, o as o$1, A, T, u as u$1, N, a as o } from './keyboard-DE1QlhcY.mjs';
import { O, T as T$1, i as i$1, P, N as N$1 } from './focus-management-DXpqooZk.mjs';
import { s as s$1 } from './use-resolve-button-type-DZKnDGM_.mjs';
import { f, u } from './hidden-UkYquSML.mjs';
import { resolveComponent, mergeProps, withCtx, createVNode, renderSlot, openBlock, createBlock, createCommentVNode, toDisplayString, Fragment, renderList, createTextVNode, defineComponent, toRef, ref, watch, nextTick, inject, computed, h, provide, watchEffect, useId, useSSRContext } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import { ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
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
import './components-CzgPFaUd.mjs';
import '@iconify/utils/lib/css/icon';

//#region node_modules/@nuxt/ui/dist/runtime/ui.config/navigation/tabs.js
var tabs_default = {
	wrapper: "relative space-y-2",
	container: "relative w-full",
	base: "focus:outline-none",
	list: {
		base: "relative",
		background: "bg-gray-100 dark:bg-gray-800",
		rounded: "rounded-lg",
		shadow: "",
		padding: "p-1",
		height: "h-10",
		width: "w-full",
		marker: {
			wrapper: "absolute top-[4px] left-[4px] duration-200 ease-out focus:outline-none",
			base: "w-full h-full",
			background: "bg-white dark:bg-gray-900",
			rounded: "rounded-md",
			shadow: "shadow-sm"
		},
		tab: {
			base: "relative inline-flex items-center justify-center flex-shrink-0 w-full ui-focus-visible:outline-0 ui-focus-visible:ring-2 ui-focus-visible:ring-primary-500 dark:ui-focus-visible:ring-primary-400 ui-not-focus-visible:outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200 ease-out",
			background: "",
			active: "text-gray-900 dark:text-white",
			inactive: "text-gray-500 dark:text-gray-400",
			height: "h-8",
			padding: "px-3",
			size: "text-sm",
			font: "font-medium",
			rounded: "rounded-md",
			shadow: "",
			icon: "w-4 h-4 flex-shrink-0 me-2"
		}
	}
};
//#endregion
//#region node_modules/@headlessui/vue/dist/internal/focus-sentinel.js
var d = defineComponent({
	props: { onFocus: {
		type: Function,
		required: true
	} },
	setup(t) {
		let n = ref(true);
		return () => n.value ? h(f, {
			as: "button",
			type: "button",
			features: u.Focusable,
			onFocus(o) {
				o.preventDefault();
				let e, a = 50;
				function r() {
					var u;
					if (a-- <= 0) {
						e && cancelAnimationFrame(e);
						return;
					}
					if ((u = t.onFocus) != null && u.call(t)) {
						n.value = false, cancelAnimationFrame(e);
						return;
					}
					e = requestAnimationFrame(r);
				}
				e = requestAnimationFrame(r);
			}
		}) : null;
	}
});
//#endregion
//#region node_modules/@headlessui/vue/dist/components/tabs/tabs.js
var te = ((s) => (s[s.Forwards = 0] = "Forwards", s[s.Backwards = 1] = "Backwards", s))(te || {});
var le = ((d) => (d[d.Less = -1] = "Less", d[d.Equal = 0] = "Equal", d[d.Greater = 1] = "Greater", d))(le || {});
var U = Symbol("TabsContext");
function C(a) {
	let b = inject(U, null);
	if (b === null) {
		let s = /* @__PURE__ */ new Error(`<${a} /> is missing a parent <TabGroup /> component.`);
		throw Error.captureStackTrace && Error.captureStackTrace(s, C), s;
	}
	return b;
}
var G = Symbol("TabsSSRContext");
var me = defineComponent({
	name: "TabGroup",
	emits: { change: (a) => true },
	props: {
		as: {
			type: [Object, String],
			default: "template"
		},
		selectedIndex: {
			type: [Number],
			default: null
		},
		defaultIndex: {
			type: [Number],
			default: 0
		},
		vertical: {
			type: [Boolean],
			default: false
		},
		manual: {
			type: [Boolean],
			default: false
		}
	},
	inheritAttrs: false,
	setup(a, { slots: b, attrs: s, emit: d$1 }) {
		var E;
		let i = ref((E = a.selectedIndex) != null ? E : a.defaultIndex), l = ref([]), r = ref([]), p = computed(() => a.selectedIndex !== null), R = computed(() => p.value ? a.selectedIndex : i.value);
		function y(t) {
			var c;
			let n = O(u$2.tabs.value, o$1), o$2 = O(u$2.panels.value, o$1), e = n.filter((I) => {
				var m;
				return !((m = o$1(I)) != null && m.hasAttribute("disabled"));
			});
			if (t < 0 || t > n.length - 1) {
				let I = u$1(i.value === null ? 0 : Math.sign(t - i.value), {
					[-1]: () => 1,
					[0]: () => u$1(Math.sign(t), {
						[-1]: () => 0,
						[0]: () => 0,
						[1]: () => 1
					}),
					[1]: () => 0
				}), m = u$1(I, {
					[0]: () => n.indexOf(e[0]),
					[1]: () => n.indexOf(e[e.length - 1])
				});
				m !== -1 && (i.value = m), u$2.tabs.value = n, u$2.panels.value = o$2;
			} else {
				let I = n.slice(0, t), h = [...n.slice(t), ...I].find((W) => e.includes(W));
				if (!h) return;
				let O = (c = n.indexOf(h)) != null ? c : u$2.selectedIndex.value;
				O === -1 && (O = u$2.selectedIndex.value), i.value = O, u$2.tabs.value = n, u$2.panels.value = o$2;
			}
		}
		let u$2 = {
			selectedIndex: computed(() => {
				var t, n;
				return (n = (t = i.value) != null ? t : a.defaultIndex) != null ? n : null;
			}),
			orientation: computed(() => a.vertical ? "vertical" : "horizontal"),
			activation: computed(() => a.manual ? "manual" : "auto"),
			tabs: l,
			panels: r,
			setSelectedIndex(t) {
				R.value !== t && d$1("change", t), p.value || y(t);
			},
			registerTab(t) {
				var o$3;
				if (l.value.includes(t)) return;
				let n = l.value[i.value];
				if (l.value.push(t), l.value = O(l.value, o$1), !p.value) {
					let e = (o$3 = l.value.indexOf(n)) != null ? o$3 : i.value;
					e !== -1 && (i.value = e);
				}
			},
			unregisterTab(t) {
				let n = l.value.indexOf(t);
				n !== -1 && l.value.splice(n, 1);
			},
			registerPanel(t) {
				r.value.includes(t) || (r.value.push(t), r.value = O(r.value, o$1));
			},
			unregisterPanel(t) {
				let n = r.value.indexOf(t);
				n !== -1 && r.value.splice(n, 1);
			}
		};
		provide(U, u$2);
		let T$2 = ref({
			tabs: [],
			panels: []
		}), x = ref(false);
		provide(G, computed(() => x.value ? null : T$2.value));
		computed(() => a.selectedIndex);
		return watchEffect(() => {
			if (!p.value || R.value == null || u$2.tabs.value.length <= 0) return;
			let t = O(u$2.tabs.value, o$1);
			t.some((o$4, e) => o$1(u$2.tabs.value[e]) !== o$1(o$4)) && u$2.setSelectedIndex(t.findIndex((o$5) => o$1(o$5) === o$1(u$2.tabs.value[R.value])));
		}), () => {
			let t = { selectedIndex: i.value };
			return h(Fragment, [l.value.length <= 0 && h(d, { onFocus: () => {
				for (let n of l.value) {
					let o$6 = o$1(n);
					if ((o$6 == null ? void 0 : o$6.tabIndex) === 0) return o$6.focus(), true;
				}
				return false;
			} }), A({
				theirProps: {
					...s,
					...T(a, [
						"selectedIndex",
						"defaultIndex",
						"manual",
						"vertical",
						"onChange"
					])
				},
				ourProps: {},
				slot: t,
				slots: b,
				attrs: s,
				name: "TabGroup"
			})]);
		};
	}
});
var pe = defineComponent({
	name: "TabList",
	props: { as: {
		type: [Object, String],
		default: "div"
	} },
	setup(a, { attrs: b, slots: s }) {
		let d = C("TabList");
		return () => {
			let i = { selectedIndex: d.selectedIndex.value }, l = {
				role: "tablist",
				"aria-orientation": d.orientation.value
			};
			return A({
				ourProps: l,
				theirProps: a,
				slot: i,
				attrs: b,
				slots: s,
				name: "TabList"
			});
		};
	}
});
var xe = defineComponent({
	name: "Tab",
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
	setup(a, { attrs: b, slots: s, expose: d }) {
		var o$7;
		let i$2 = (o$7 = a.id) != null ? o$7 : `headlessui-tabs-tab-${i()}`, l = C("Tab"), r = ref(null);
		d({
			el: r,
			$el: r
		});
		let p = inject(G), R = computed(() => {
			if (p.value) {
				let e = p.value.tabs.indexOf(i$2);
				return e === -1 ? p.value.tabs.push(i$2) - 1 : e;
			}
			return -1;
		}), y = computed(() => {
			let e = l.tabs.value.indexOf(r);
			return e === -1 ? R.value : e;
		}), u$3 = computed(() => y.value === l.selectedIndex.value);
		function T(e) {
			var I;
			let c = e();
			if (c === T$1.Success && l.activation.value === "auto") {
				let m = (I = i$1(r)) == null ? void 0 : I.activeElement, h = l.tabs.value.findIndex((O) => o$1(O) === m);
				h !== -1 && l.setSelectedIndex(h);
			}
			return c;
		}
		function x(e) {
			let c = l.tabs.value.map((m) => o$1(m)).filter(Boolean);
			if (e.key === o.Space || e.key === o.Enter) {
				e.preventDefault(), e.stopPropagation(), l.setSelectedIndex(y.value);
				return;
			}
			switch (e.key) {
				case o.Home:
				case o.PageUp: return e.preventDefault(), e.stopPropagation(), T(() => P(c, N$1.First));
				case o.End:
				case o.PageDown: return e.preventDefault(), e.stopPropagation(), T(() => P(c, N$1.Last));
			}
			if (T(() => u$1(l.orientation.value, {
				vertical() {
					return e.key === o.ArrowUp ? P(c, N$1.Previous | N$1.WrapAround) : e.key === o.ArrowDown ? P(c, N$1.Next | N$1.WrapAround) : T$1.Error;
				},
				horizontal() {
					return e.key === o.ArrowLeft ? P(c, N$1.Previous | N$1.WrapAround) : e.key === o.ArrowRight ? P(c, N$1.Next | N$1.WrapAround) : T$1.Error;
				}
			})) === T$1.Success) return e.preventDefault();
		}
		let w = ref(false);
		function E() {
			var e;
			w.value || (w.value = true, !a.disabled && ((e = o$1(r)) == null || e.focus({ preventScroll: true }), l.setSelectedIndex(y.value), t(() => {
				w.value = false;
			})));
		}
		function t$1(e) {
			e.preventDefault();
		}
		let n = s$1(computed(() => ({
			as: a.as,
			type: b.type
		})), r);
		return () => {
			var m, h;
			let e = {
				selected: u$3.value,
				disabled: (m = a.disabled) != null ? m : false
			}, { ...c } = a, I = {
				ref: r,
				onKeydown: x,
				onMousedown: t$1,
				onClick: E,
				id: i$2,
				role: "tab",
				type: n.value,
				"aria-controls": (h = o$1(l.panels.value[y.value])) == null ? void 0 : h.id,
				"aria-selected": u$3.value,
				tabIndex: u$3.value ? 0 : -1,
				disabled: a.disabled ? true : void 0
			};
			return A({
				ourProps: I,
				theirProps: c,
				slot: e,
				attrs: b,
				slots: s,
				name: "Tab"
			});
		};
	}
});
var Ie = defineComponent({
	name: "TabPanels",
	props: { as: {
		type: [Object, String],
		default: "div"
	} },
	setup(a, { slots: b, attrs: s }) {
		let d = C("TabPanels");
		return () => {
			let i = { selectedIndex: d.selectedIndex.value };
			return A({
				theirProps: a,
				ourProps: {},
				slot: i,
				attrs: s,
				slots: b,
				name: "TabPanels"
			});
		};
	}
});
var ye = defineComponent({
	name: "TabPanel",
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
		},
		tabIndex: {
			type: Number,
			default: 0
		}
	},
	setup(a, { attrs: b, slots: s, expose: d }) {
		var T;
		let i$3 = (T = a.id) != null ? T : `headlessui-tabs-panel-${i()}`, l = C("TabPanel"), r = ref(null);
		d({
			el: r,
			$el: r
		});
		let p = inject(G), R = computed(() => {
			if (p.value) {
				let x = p.value.panels.indexOf(i$3);
				return x === -1 ? p.value.panels.push(i$3) - 1 : x;
			}
			return -1;
		}), y = computed(() => {
			let x = l.panels.value.indexOf(r);
			return x === -1 ? R.value : x;
		}), u = computed(() => y.value === l.selectedIndex.value);
		return () => {
			var n;
			let x = { selected: u.value }, { tabIndex: w, ...E } = a, t = {
				ref: r,
				id: i$3,
				role: "tabpanel",
				"aria-labelledby": (n = o$1(l.tabs.value[y.value])) == null ? void 0 : n.id,
				tabIndex: u.value ? w : -1
			};
			return !u.value && a.unmount && !a.static ? h(f, {
				as: "span",
				"aria-hidden": true,
				...t
			}) : A({
				ourProps: t,
				theirProps: E,
				slot: x,
				attrs: b,
				slots: s,
				features: N.Static | N.RenderStrategy,
				visible: u.value,
				name: "TabPanel"
			});
		};
	}
});
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/navigation/Tabs.vue
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.tabs, tabs_default);
var _sfc_main = defineComponent({
	components: {
		UIcon: Icon_default,
		HTabGroup: me,
		HTabList: pe,
		HTab: xe,
		HTabPanels: Ie,
		HTabPanel: ye
	},
	inheritAttrs: false,
	props: {
		modelValue: {
			type: Number,
			default: void 0
		},
		orientation: {
			type: String,
			default: "horizontal",
			validator: (value) => ["horizontal", "vertical"].includes(value)
		},
		defaultIndex: {
			type: Number,
			default: 0
		},
		items: {
			type: Array,
			default: () => []
		},
		unmount: {
			type: Boolean,
			default: false
		},
		content: {
			type: Boolean,
			default: true
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
	emits: ["update:modelValue", "change"],
	setup(props, { emit }) {
		const { ui, attrs } = useUI("tabs", toRef(props, "ui"), config, toRef(props, "class"));
		const listRef = ref();
		const itemRefs = ref([]);
		const markerRef = ref();
		const selectedIndex = ref(props.modelValue || props.defaultIndex);
		function calcMarkerSize(index) {
			const tab = itemRefs.value[index]?.$el;
			if (!tab) return;
			if (!markerRef.value) return;
			markerRef.value.style.top = `${tab.offsetTop}px`;
			markerRef.value.style.left = `${tab.offsetLeft}px`;
			markerRef.value.style.width = `${tab.offsetWidth}px`;
			markerRef.value.style.height = `${tab.offsetHeight}px`;
		}
		function onChange(index) {
			selectedIndex.value = index;
			emit("change", index);
			if (props.modelValue !== void 0) emit("update:modelValue", selectedIndex.value);
			calcMarkerSize(selectedIndex.value);
		}
		useResizeObserver(listRef, () => {
			calcMarkerSize(selectedIndex.value);
		});
		watch(() => props.modelValue, (value) => {
			selectedIndex.value = value;
			calcMarkerSize(selectedIndex.value);
		});
		watch(() => props.items, async () => {
			await nextTick();
			calcMarkerSize(selectedIndex.value);
		}, { deep: true });
		s(() => useId());
		return {
			ui,
			attrs,
			listRef,
			itemRefs,
			markerRef,
			selectedIndex,
			onChange
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_HTabGroup = resolveComponent("HTabGroup");
	const _component_HTabList = resolveComponent("HTabList");
	const _component_HTab = resolveComponent("HTab");
	const _component_UIcon = Icon_default;
	const _component_HTabPanels = resolveComponent("HTabPanels");
	const _component_HTabPanel = resolveComponent("HTabPanel");
	_push(ssrRenderComponent(_component_HTabGroup, mergeProps({
		vertical: _ctx.orientation === "vertical",
		"selected-index": _ctx.selectedIndex,
		as: "div",
		class: _ctx.ui.wrapper
	}, _ctx.attrs, { onChange: _ctx.onChange }, _attrs), {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) {
				_push(ssrRenderComponent(_component_HTabList, {
					ref: "listRef",
					class: [
						_ctx.ui.list.base,
						_ctx.ui.list.background,
						_ctx.ui.list.rounded,
						_ctx.ui.list.shadow,
						_ctx.ui.list.padding,
						_ctx.ui.list.width,
						_ctx.orientation === "horizontal" && _ctx.ui.list.height,
						_ctx.orientation === "horizontal" && "inline-grid items-center"
					],
					style: [_ctx.orientation === "horizontal" && `grid-template-columns: repeat(${_ctx.items.length}, minmax(0, 1fr))`]
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<div class="${ssrRenderClass(_ctx.ui.list.marker.wrapper)}"${_scopeId}><div class="${ssrRenderClass([
								_ctx.ui.list.marker.base,
								_ctx.ui.list.marker.background,
								_ctx.ui.list.marker.rounded,
								_ctx.ui.list.marker.shadow
							])}"${_scopeId}></div></div><!--[-->`);
							ssrRenderList(_ctx.items, (item, index) => {
								_push(ssrRenderComponent(_component_HTab, {
									key: index,
									ref_for: true,
									ref: "itemRefs",
									disabled: item.disabled,
									as: "template"
								}, {
									default: withCtx(({ selected, disabled }, _push, _parent, _scopeId) => {
										if (_push) {
											_push(`<button${ssrRenderAttr("aria-label", item.ariaLabel)} class="${ssrRenderClass([
												_ctx.ui.list.tab.base,
												_ctx.ui.list.tab.background,
												_ctx.ui.list.tab.height,
												_ctx.ui.list.tab.padding,
												_ctx.ui.list.tab.size,
												_ctx.ui.list.tab.font,
												_ctx.ui.list.tab.rounded,
												_ctx.ui.list.tab.shadow,
												selected ? _ctx.ui.list.tab.active : _ctx.ui.list.tab.inactive
											])}"${_scopeId}>`);
											ssrRenderSlot(_ctx.$slots, "icon", {
												item,
												index,
												selected,
												disabled
											}, () => {
												if (item.icon) _push(ssrRenderComponent(_component_UIcon, {
													name: item.icon,
													class: _ctx.ui.list.tab.icon
												}, null, _parent, _scopeId));
												else _push(`<!---->`);
											}, _push, _parent, _scopeId);
											ssrRenderSlot(_ctx.$slots, "default", {
												item,
												index,
												selected,
												disabled
											}, () => {
												_push(`<span class="truncate"${_scopeId}>${ssrInterpolate(item.label)}</span>`);
											}, _push, _parent, _scopeId);
											_push(`</button>`);
										} else return [createVNode("button", {
											"aria-label": item.ariaLabel,
											class: [
												_ctx.ui.list.tab.base,
												_ctx.ui.list.tab.background,
												_ctx.ui.list.tab.height,
												_ctx.ui.list.tab.padding,
												_ctx.ui.list.tab.size,
												_ctx.ui.list.tab.font,
												_ctx.ui.list.tab.rounded,
												_ctx.ui.list.tab.shadow,
												selected ? _ctx.ui.list.tab.active : _ctx.ui.list.tab.inactive
											]
										}, [renderSlot(_ctx.$slots, "icon", {
											item,
											index,
											selected,
											disabled
										}, () => [item.icon ? (openBlock(), createBlock(_component_UIcon, {
											key: 0,
											name: item.icon,
											class: _ctx.ui.list.tab.icon
										}, null, 8, ["name", "class"])) : createCommentVNode("", true)]), renderSlot(_ctx.$slots, "default", {
											item,
											index,
											selected,
											disabled
										}, () => [createVNode("span", { class: "truncate" }, toDisplayString(item.label), 1)])], 10, ["aria-label"])];
									}),
									_: 2
								}, _parent, _scopeId));
							});
							_push(`<!--]-->`);
						} else return [createVNode("div", {
							ref: "markerRef",
							class: _ctx.ui.list.marker.wrapper
						}, [createVNode("div", { class: [
							_ctx.ui.list.marker.base,
							_ctx.ui.list.marker.background,
							_ctx.ui.list.marker.rounded,
							_ctx.ui.list.marker.shadow
						] }, null, 2)], 2), (openBlock(true), createBlock(Fragment, null, renderList(_ctx.items, (item, index) => {
							return openBlock(), createBlock(_component_HTab, {
								key: index,
								ref_for: true,
								ref: "itemRefs",
								disabled: item.disabled,
								as: "template"
							}, {
								default: withCtx(({ selected, disabled }) => [createVNode("button", {
									"aria-label": item.ariaLabel,
									class: [
										_ctx.ui.list.tab.base,
										_ctx.ui.list.tab.background,
										_ctx.ui.list.tab.height,
										_ctx.ui.list.tab.padding,
										_ctx.ui.list.tab.size,
										_ctx.ui.list.tab.font,
										_ctx.ui.list.tab.rounded,
										_ctx.ui.list.tab.shadow,
										selected ? _ctx.ui.list.tab.active : _ctx.ui.list.tab.inactive
									]
								}, [renderSlot(_ctx.$slots, "icon", {
									item,
									index,
									selected,
									disabled
								}, () => [item.icon ? (openBlock(), createBlock(_component_UIcon, {
									key: 0,
									name: item.icon,
									class: _ctx.ui.list.tab.icon
								}, null, 8, ["name", "class"])) : createCommentVNode("", true)]), renderSlot(_ctx.$slots, "default", {
									item,
									index,
									selected,
									disabled
								}, () => [createVNode("span", { class: "truncate" }, toDisplayString(item.label), 1)])], 10, ["aria-label"])]),
								_: 2
							}, 1032, ["disabled"]);
						}), 128))];
					}),
					_: 3
				}, _parent, _scopeId));
				if (_ctx.content) _push(ssrRenderComponent(_component_HTabPanels, { class: _ctx.ui.container }, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<!--[-->`);
							ssrRenderList(_ctx.items, (item, index) => {
								_push(ssrRenderComponent(_component_HTabPanel, {
									key: index,
									class: _ctx.ui.base,
									unmount: _ctx.unmount
								}, {
									default: withCtx(({ selected }, _push, _parent, _scopeId) => {
										if (_push) ssrRenderSlot(_ctx.$slots, item.slot || "item", {
											item,
											index,
											selected
										}, () => {
											_push(`${ssrInterpolate(item.content)}`);
										}, _push, _parent, _scopeId);
										else return [renderSlot(_ctx.$slots, item.slot || "item", {
											item,
											index,
											selected
										}, () => [createTextVNode(toDisplayString(item.content), 1)])];
									}),
									_: 2
								}, _parent, _scopeId));
							});
							_push(`<!--]-->`);
						} else return [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.items, (item, index) => {
							return openBlock(), createBlock(_component_HTabPanel, {
								key: index,
								class: _ctx.ui.base,
								unmount: _ctx.unmount
							}, {
								default: withCtx(({ selected }) => [renderSlot(_ctx.$slots, item.slot || "item", {
									item,
									index,
									selected
								}, () => [createTextVNode(toDisplayString(item.content), 1)])]),
								_: 2
							}, 1032, ["class", "unmount"]);
						}), 128))];
					}),
					_: 3
				}, _parent, _scopeId));
				else _push(`<!---->`);
			} else return [createVNode(_component_HTabList, {
				ref: "listRef",
				class: [
					_ctx.ui.list.base,
					_ctx.ui.list.background,
					_ctx.ui.list.rounded,
					_ctx.ui.list.shadow,
					_ctx.ui.list.padding,
					_ctx.ui.list.width,
					_ctx.orientation === "horizontal" && _ctx.ui.list.height,
					_ctx.orientation === "horizontal" && "inline-grid items-center"
				],
				style: [_ctx.orientation === "horizontal" && `grid-template-columns: repeat(${_ctx.items.length}, minmax(0, 1fr))`]
			}, {
				default: withCtx(() => [createVNode("div", {
					ref: "markerRef",
					class: _ctx.ui.list.marker.wrapper
				}, [createVNode("div", { class: [
					_ctx.ui.list.marker.base,
					_ctx.ui.list.marker.background,
					_ctx.ui.list.marker.rounded,
					_ctx.ui.list.marker.shadow
				] }, null, 2)], 2), (openBlock(true), createBlock(Fragment, null, renderList(_ctx.items, (item, index) => {
					return openBlock(), createBlock(_component_HTab, {
						key: index,
						ref_for: true,
						ref: "itemRefs",
						disabled: item.disabled,
						as: "template"
					}, {
						default: withCtx(({ selected, disabled }) => [createVNode("button", {
							"aria-label": item.ariaLabel,
							class: [
								_ctx.ui.list.tab.base,
								_ctx.ui.list.tab.background,
								_ctx.ui.list.tab.height,
								_ctx.ui.list.tab.padding,
								_ctx.ui.list.tab.size,
								_ctx.ui.list.tab.font,
								_ctx.ui.list.tab.rounded,
								_ctx.ui.list.tab.shadow,
								selected ? _ctx.ui.list.tab.active : _ctx.ui.list.tab.inactive
							]
						}, [renderSlot(_ctx.$slots, "icon", {
							item,
							index,
							selected,
							disabled
						}, () => [item.icon ? (openBlock(), createBlock(_component_UIcon, {
							key: 0,
							name: item.icon,
							class: _ctx.ui.list.tab.icon
						}, null, 8, ["name", "class"])) : createCommentVNode("", true)]), renderSlot(_ctx.$slots, "default", {
							item,
							index,
							selected,
							disabled
						}, () => [createVNode("span", { class: "truncate" }, toDisplayString(item.label), 1)])], 10, ["aria-label"])]),
						_: 2
					}, 1032, ["disabled"]);
				}), 128))]),
				_: 3
			}, 8, ["class", "style"]), _ctx.content ? (openBlock(), createBlock(_component_HTabPanels, {
				key: 0,
				class: _ctx.ui.container
			}, {
				default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.items, (item, index) => {
					return openBlock(), createBlock(_component_HTabPanel, {
						key: index,
						class: _ctx.ui.base,
						unmount: _ctx.unmount
					}, {
						default: withCtx(({ selected }) => [renderSlot(_ctx.$slots, item.slot || "item", {
							item,
							index,
							selected
						}, () => [createTextVNode(toDisplayString(item.content), 1)])]),
						_: 2
					}, 1032, ["class", "unmount"]);
				}), 128))]),
				_: 3
			}, 8, ["class"])) : createCommentVNode("", true)];
		}),
		_: 3
	}, _parent));
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/navigation/Tabs.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Tabs_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UTabs" });

export { Tabs_default as default };
//# sourceMappingURL=Tabs-DmM2sweY.mjs.map
