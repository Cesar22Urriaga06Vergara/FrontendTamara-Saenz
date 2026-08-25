import { _ as _plugin_vue_export_helper_default, m as mergeConfig, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default } from '../virtual/entry.mjs';
import { u as useUI, c as arrow } from './ui.config-2s_B03nh.mjs';
import { s, i, o as o$1, A, u as u$1, N as N$2, a as o } from './keyboard-DE1QlhcY.mjs';
import { i as i$1, P, N, E, w as w$1, h as h$1, T } from './focus-management-DXpqooZk.mjs';
import { w } from './use-outside-click-E0zCHGRJ.mjs';
import { s as s$1 } from './use-resolve-button-type-DZKnDGM_.mjs';
import { f, u } from './hidden-UkYquSML.mjs';
import { l, i as i$2, t } from './open-closed-Css0b1VQ.mjs';
import { n, q, N as N$1, E as E$1, d as d$1, v } from './portal-BOf15iST.mjs';
import { u as usePopper } from './usePopper-BCEqNZ_Z.mjs';
import { resolveComponent, mergeProps, withCtx, renderSlot, createVNode, openBlock, createBlock, Transition, createCommentVNode, defineComponent, toRef, computed, ref, watch, provide, watchEffect, h, Fragment, inject, shallowRef, useId, useSSRContext } from 'vue';
import { n as defu } from '../_/nitro.mjs';
import { ssrRenderComponent, ssrRenderSlot, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import 'nostics';
import 'nostics/formatters/ansi';
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

//#region node_modules/@nuxt/ui/dist/runtime/ui.config/overlays/popover.js
var popover_default = {
	wrapper: "relative",
	container: "z-50 group",
	trigger: "inline-flex w-full",
	width: "",
	background: "bg-white dark:bg-gray-900",
	shadow: "shadow-lg",
	rounded: "rounded-md",
	ring: "ring-1 ring-gray-200 dark:ring-gray-800",
	base: "overflow-hidden focus:outline-none relative",
	transition: {
		enterActiveClass: "transition ease-out duration-200",
		enterFromClass: "opacity-0 translate-y-1",
		enterToClass: "opacity-100 translate-y-0",
		leaveActiveClass: "transition ease-in duration-150",
		leaveFromClass: "opacity-100 translate-y-0",
		leaveToClass: "opacity-0 translate-y-1"
	},
	overlay: {
		base: "fixed inset-0 transition-opacity z-50",
		background: "bg-gray-200/75 dark:bg-gray-800/75",
		transition: {
			enterActiveClass: "ease-out duration-200",
			enterFromClass: "opacity-0",
			enterToClass: "opacity-100",
			leaveActiveClass: "ease-in duration-150",
			leaveFromClass: "opacity-100",
			leaveToClass: "opacity-0"
		}
	},
	popper: { strategy: "fixed" },
	default: {
		openDelay: 0,
		closeDelay: 0
	},
	arrow
};
//#endregion
//#region node_modules/@headlessui/vue/dist/components/popover/popover.js
var Se = ((s) => (s[s.Open = 0] = "Open", s[s.Closed = 1] = "Closed", s))(Se || {});
var re = Symbol("PopoverContext");
function U(d) {
	let P = inject(re, null);
	if (P === null) {
		let s = /* @__PURE__ */ new Error(`<${d} /> is missing a parent <${ye.name} /> component.`);
		throw Error.captureStackTrace && Error.captureStackTrace(s, U), s;
	}
	return P;
}
var le = Symbol("PopoverGroupContext");
function ae() {
	return inject(le, null);
}
var ue = Symbol("PopoverPanelContext");
function ge() {
	return inject(ue, null);
}
var ye = defineComponent({
	name: "Popover",
	inheritAttrs: false,
	props: { as: {
		type: [Object, String],
		default: "div"
	} },
	setup(d, { slots: P, attrs: s, expose: h$2 }) {
		var u$2;
		let f = ref(null);
		h$2({
			el: f,
			$el: f
		});
		let t$1 = ref(1), o$2 = ref(null), y = ref(null), v = ref(null), m = ref(null), b = computed(() => i$1(f)), E$2 = computed(() => {
			var L, $;
			if (!o$1(o$2) || !o$1(m)) return false;
			for (let x of (void 0).querySelectorAll("body > *")) if (Number(x == null ? void 0 : x.contains(o$1(o$2))) ^ Number(x == null ? void 0 : x.contains(o$1(m)))) return true;
			let e = E(), r = e.indexOf(o$1(o$2)), l = (r + e.length - 1) % e.length, g = (r + 1) % e.length, G = e[l], C = e[g];
			return !((L = o$1(m)) != null && L.contains(G)) && !(($ = o$1(m)) != null && $.contains(C));
		}), a = {
			popoverState: t$1,
			buttonId: ref(null),
			panelId: ref(null),
			panel: m,
			button: o$2,
			isPortalled: E$2,
			beforePanelSentinel: y,
			afterPanelSentinel: v,
			togglePopover() {
				t$1.value = u$1(t$1.value, {
					[0]: 1,
					[1]: 0
				});
			},
			closePopover() {
				t$1.value !== 1 && (t$1.value = 1);
			},
			close(e) {
				a.closePopover();
				(() => e ? e instanceof HTMLElement ? e : e.value instanceof HTMLElement ? o$1(e) : o$1(a.button) : o$1(a.button))()?.focus();
			}
		};
		provide(re, a), t(computed(() => u$1(t$1.value, {
			[0]: i$2.Open,
			[1]: i$2.Closed
		})));
		let S = {
			buttonId: a.buttonId,
			panelId: a.panelId,
			close() {
				a.closePopover();
			}
		}, c = ae(), I = c == null ? void 0 : c.registerPopover, [F, w$2] = q(), i = N$1({
			mainTreeNodeRef: c == null ? void 0 : c.mainTreeNodeRef,
			portals: F,
			defaultContainers: [o$2, m]
		});
		function p() {
			var e, r, l, g;
			return (g = c == null ? void 0 : c.isFocusWithinPopoverGroup()) != null ? g : ((e = b.value) == null ? void 0 : e.activeElement) && (((r = o$1(o$2)) == null ? void 0 : r.contains(b.value.activeElement)) || ((l = o$1(m)) == null ? void 0 : l.contains(b.value.activeElement)));
		}
		return watchEffect(() => I == null ? void 0 : I(S)), E$1((u$2 = b.value) == null ? void 0 : u$2.defaultView, "focus", (e) => {
			var r, l;
			e.target !== void 0 && e.target instanceof HTMLElement && t$1.value === 0 && (p() || o$2 && m && (i.contains(e.target) || (r = o$1(a.beforePanelSentinel)) != null && r.contains(e.target) || (l = o$1(a.afterPanelSentinel)) != null && l.contains(e.target) || a.closePopover()));
		}, true), w(i.resolveContainers, (e, r) => {
			var l;
			a.closePopover(), w$1(r, h$1.Loose) || (e.preventDefault(), (l = o$1(o$2)) == null || l.focus());
		}, computed(() => t$1.value === 0)), () => {
			let e = {
				open: t$1.value === 0,
				close: a.close
			};
			return h(Fragment, [h(w$2, {}, () => A({
				theirProps: {
					...d,
					...s
				},
				ourProps: { ref: f },
				slot: e,
				slots: P,
				attrs: s,
				name: "Popover"
			})), h(i.MainTreeNode)]);
		};
	}
});
var Ge = defineComponent({
	name: "PopoverButton",
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
	inheritAttrs: false,
	setup(d$1$1, { attrs: P$1, slots: s, expose: h$3 }) {
		var u$3;
		let f$1 = (u$3 = d$1$1.id) != null ? u$3 : `headlessui-popover-button-${i()}`, t = U("PopoverButton"), o$3 = computed(() => i$1(t.button));
		h$3({
			el: t.button,
			$el: t.button
		});
		let y = ae(), v = y == null ? void 0 : y.closeOthers, m = ge(), b = computed(() => m === null ? false : m.value === t.panelId.value), E$3 = ref(null), a = `headlessui-focus-sentinel-${i()}`;
		b.value || watchEffect(() => {
			t.button.value = o$1(E$3);
		});
		let S = s$1(computed(() => ({
			as: d$1$1.as,
			type: P$1.type
		})), E$3);
		function c(e) {
			var r, l, g, G, C;
			if (b.value) {
				if (t.popoverState.value === 1) return;
				switch (e.key) {
					case o.Space:
					case o.Enter: e.preventDefault(), (l = (r = e.target).click) == null || l.call(r), t.closePopover(), (g = o$1(t.button)) == null || g.focus();
				}
			} else switch (e.key) {
				case o.Space:
				case o.Enter:
					e.preventDefault(), e.stopPropagation(), t.popoverState.value === 1 && v?.(t.buttonId.value), t.togglePopover();
					break;
				case o.Escape:
					if (t.popoverState.value !== 0) return v == null ? void 0 : v(t.buttonId.value);
					if (!o$1(t.button) || (G = o$3.value) != null && G.activeElement && !((C = o$1(t.button)) != null && C.contains(o$3.value.activeElement))) return;
					e.preventDefault(), e.stopPropagation(), t.closePopover();
					break;
			}
		}
		function I(e) {
			b.value || e.key === o.Space && e.preventDefault();
		}
		function F(e) {
			var r, l;
			d$1$1.disabled || (b.value ? (t.closePopover(), (r = o$1(t.button)) == null || r.focus()) : (e.preventDefault(), e.stopPropagation(), t.popoverState.value === 1 && v?.(t.buttonId.value), t.togglePopover(), (l = o$1(t.button)) == null || l.focus()));
		}
		function w(e) {
			e.preventDefault(), e.stopPropagation();
		}
		let i$3 = n();
		function p() {
			let e = o$1(t.panel);
			if (!e) return;
			function r() {
				u$1(i$3.value, {
					[d$1.Forwards]: () => P(e, N.First),
					[d$1.Backwards]: () => P(e, N.Last)
				}) === T.Error && P(E().filter((g) => g.dataset.headlessuiFocusGuard !== "true"), u$1(i$3.value, {
					[d$1.Forwards]: N.Next,
					[d$1.Backwards]: N.Previous
				}), { relativeTo: o$1(t.button) });
			}
			r();
		}
		return () => {
			let e = t.popoverState.value === 0, r = { open: e }, { ...l } = d$1$1, g = b.value ? {
				ref: E$3,
				type: S.value,
				onKeydown: c,
				onClick: F
			} : {
				ref: E$3,
				id: f$1,
				type: S.value,
				"aria-expanded": t.popoverState.value === 0,
				"aria-controls": o$1(t.panel) ? t.panelId.value : void 0,
				disabled: d$1$1.disabled ? true : void 0,
				onKeydown: c,
				onKeyup: I,
				onClick: F,
				onMousedown: w
			};
			return h(Fragment, [A({
				ourProps: g,
				theirProps: {
					...P$1,
					...l
				},
				slot: r,
				attrs: P$1,
				slots: s,
				name: "PopoverButton"
			}), e && !b.value && t.isPortalled.value && h(f, {
				id: a,
				features: u.Focusable,
				"data-headlessui-focus-guard": true,
				as: "button",
				type: "button",
				onFocus: p
			})]);
		};
	}
});
defineComponent({
	name: "PopoverOverlay",
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
		}
	},
	setup(d, { attrs: P, slots: s }) {
		let h = U("PopoverOverlay"), f = `headlessui-popover-overlay-${i()}`, t = l(), o = computed(() => t !== null ? (t.value & i$2.Open) === i$2.Open : h.popoverState.value === 0);
		function y() {
			h.closePopover();
		}
		return () => {
			let v = { open: h.popoverState.value === 0 };
			return A({
				ourProps: {
					id: f,
					"aria-hidden": true,
					onClick: y
				},
				theirProps: d,
				slot: v,
				attrs: P,
				slots: s,
				features: N$2.RenderStrategy | N$2.Static,
				visible: o.value,
				name: "PopoverOverlay"
			});
		};
	}
});
var je = defineComponent({
	name: "PopoverPanel",
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
		focus: {
			type: Boolean,
			default: false
		},
		id: {
			type: String,
			default: null
		}
	},
	inheritAttrs: false,
	setup(d$2, { attrs: P$2, slots: s, expose: h$4 }) {
		var w;
		let f$2 = (w = d$2.id) != null ? w : `headlessui-popover-panel-${i()}`, { focus: t } = d$2, o$4 = U("PopoverPanel"), y = computed(() => i$1(o$4.panel)), v = `headlessui-focus-sentinel-before-${i()}`, m = `headlessui-focus-sentinel-after-${i()}`;
		h$4({
			el: o$4.panel,
			$el: o$4.panel
		}), provide(ue, o$4.panelId), watchEffect(() => {
			var p, u;
			if (!t || o$4.popoverState.value !== 0 || !o$4.panel) return;
			let i = (p = y.value) == null ? void 0 : p.activeElement;
			(u = o$1(o$4.panel)) != null && u.contains(i) || P(o$1(o$4.panel), N.First);
		});
		let b = l(), E$4 = computed(() => b !== null ? (b.value & i$2.Open) === i$2.Open : o$4.popoverState.value === 0);
		function a(i) {
			var p, u;
			switch (i.key) {
				case o.Escape:
					if (o$4.popoverState.value !== 0 || !o$1(o$4.panel) || y.value && !((p = o$1(o$4.panel)) != null && p.contains(y.value.activeElement))) return;
					i.preventDefault(), i.stopPropagation(), o$4.closePopover(), (u = o$1(o$4.button)) == null || u.focus();
			}
		}
		function S(i) {
			var u, e, r, l, g;
			let p = i.relatedTarget;
			p && o$1(o$4.panel) && ((u = o$1(o$4.panel)) != null && u.contains(p) || (o$4.closePopover(), ((r = (e = o$1(o$4.beforePanelSentinel)) == null ? void 0 : e.contains) != null && r.call(e, p) || (g = (l = o$1(o$4.afterPanelSentinel)) == null ? void 0 : l.contains) != null && g.call(l, p)) && p.focus({ preventScroll: true })));
		}
		let c = n();
		function I() {
			let i = o$1(o$4.panel);
			if (!i) return;
			function p() {
				u$1(c.value, {
					[d$1.Forwards]: () => {
						var e;
						P(i, N.First) === T.Error && ((e = o$1(o$4.afterPanelSentinel)) == null || e.focus());
					},
					[d$1.Backwards]: () => {
						var u;
						(u = o$1(o$4.button)) == null || u.focus({ preventScroll: true });
					}
				});
			}
			p();
		}
		function F() {
			let i = o$1(o$4.panel);
			if (!i) return;
			function p() {
				u$1(c.value, {
					[d$1.Forwards]: () => {
						let u = o$1(o$4.button), e = o$1(o$4.panel);
						if (!u) return;
						let r = E(), l = r.indexOf(u), g = r.slice(0, l + 1), C = [...r.slice(l + 1), ...g];
						for (let L of C.slice()) if (L.dataset.headlessuiFocusGuard === "true" || e != null && e.contains(L)) {
							let $ = C.indexOf(L);
							$ !== -1 && C.splice($, 1);
						}
						P(C, N.First, { sorted: false });
					},
					[d$1.Backwards]: () => {
						var e;
						P(i, N.Previous) === T.Error && ((e = o$1(o$4.button)) == null || e.focus());
					}
				});
			}
			p();
		}
		return () => {
			let i = {
				open: o$4.popoverState.value === 0,
				close: o$4.close
			}, { focus: p, ...u$1 } = d$2, e = {
				ref: o$4.panel,
				id: f$2,
				onKeydown: a,
				onFocusout: t && o$4.popoverState.value === 0 ? S : void 0,
				tabIndex: -1
			};
			return A({
				ourProps: e,
				theirProps: {
					...P$2,
					...u$1
				},
				attrs: P$2,
				slot: i,
				slots: {
					...s,
					default: (...r) => {
						var l;
						return [h(Fragment, [
							E$4.value && o$4.isPortalled.value && h(f, {
								id: v,
								ref: o$4.beforePanelSentinel,
								features: u.Focusable,
								"data-headlessui-focus-guard": true,
								as: "button",
								type: "button",
								onFocus: I
							}),
							(l = s.default) == null ? void 0 : l.call(s, ...r),
							E$4.value && o$4.isPortalled.value && h(f, {
								id: m,
								ref: o$4.afterPanelSentinel,
								features: u.Focusable,
								"data-headlessui-focus-guard": true,
								as: "button",
								type: "button",
								onFocus: F
							})
						])];
					}
				},
				features: N$2.RenderStrategy | N$2.Static,
				visible: E$4.value,
				name: "PopoverPanel"
			});
		};
	}
});
defineComponent({
	name: "PopoverGroup",
	inheritAttrs: false,
	props: { as: {
		type: [Object, String],
		default: "div"
	} },
	setup(d, { attrs: P, slots: s, expose: h$5 }) {
		let f = ref(null), t = shallowRef([]), o$5 = computed(() => i$1(f)), y = v();
		h$5({
			el: f,
			$el: f
		});
		function v$1(a) {
			let S = t.value.indexOf(a);
			S !== -1 && t.value.splice(S, 1);
		}
		function m(a) {
			return t.value.push(a), () => {
				v$1(a);
			};
		}
		function b() {
			var c;
			let a = o$5.value;
			if (!a) return false;
			let S = a.activeElement;
			return (c = o$1(f)) != null && c.contains(S) ? true : t.value.some((I) => {
				var F, w;
				return ((F = a.getElementById(I.buttonId.value)) == null ? void 0 : F.contains(S)) || ((w = a.getElementById(I.panelId.value)) == null ? void 0 : w.contains(S));
			});
		}
		function E(a) {
			for (let S of t.value) S.buttonId.value !== a && S.close();
		}
		return provide(le, {
			registerPopover: m,
			unregisterPopover: v$1,
			isFocusWithinPopoverGroup: b,
			closeOthers: E,
			mainTreeNodeRef: y.mainTreeNodeRef
		}), () => h(Fragment, [A({
			ourProps: { ref: f },
			theirProps: {
				...d,
				...P
			},
			slot: {},
			attrs: P,
			slots: s,
			name: "PopoverGroup"
		}), h(y.MainTreeNode)]);
	}
});
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/overlays/Popover.vue
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.popover, popover_default);
var _sfc_main = defineComponent({
	components: {
		HPopover: ye,
		HPopoverButton: Ge,
		HPopoverPanel: je
	},
	inheritAttrs: false,
	props: {
		mode: {
			type: String,
			default: "click",
			validator: (value) => ["click", "hover"].includes(value)
		},
		open: {
			type: Boolean,
			default: void 0
		},
		disabled: {
			type: Boolean,
			default: false
		},
		openDelay: {
			type: Number,
			default: () => config.default.openDelay
		},
		closeDelay: {
			type: Number,
			default: () => config.default.closeDelay
		},
		overlay: {
			type: Boolean,
			default: false
		},
		popper: {
			type: Object,
			default: () => ({})
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
	emits: ["update:open"],
	setup(props, { emit }) {
		const { ui, attrs } = useUI("popover", toRef(props, "ui"), config, toRef(props, "class"));
		const popper = computed(() => defu(props.mode === "hover" ? { offsetDistance: 0 } : {}, props.popper, ui.value.popper));
		const [trigger, container] = usePopper(popper.value);
		const popover2 = ref(null);
		const popoverApi = ref(null);
		let openTimeout = null;
		let closeTimeout = null;
		const containerStyle = computed(() => {
			if (props.mode !== "hover") return {};
			const offsetDistance = props.popper?.offsetDistance || ui.value.popper?.offsetDistance || 8;
			const placement = popper.value.placement?.split("-")[0];
			const padding = `${offsetDistance}px`;
			if (placement === "top" || placement === "bottom") return {
				paddingTop: padding,
				paddingBottom: padding
			};
			else if (placement === "left" || placement === "right") return {
				paddingLeft: padding,
				paddingRight: padding
			};
			else return {
				paddingTop: padding,
				paddingBottom: padding,
				paddingLeft: padding,
				paddingRight: padding
			};
		});
		function onTouchStart(event) {
			if (!event.cancelable || !popoverApi.value || props.mode === "click") return;
			if (popoverApi.value.popoverState === 0) popoverApi.value.closePopover();
			else popoverApi.value.togglePopover();
		}
		function onMouseEnter() {
			if (props.mode !== "hover" || !popoverApi.value) return;
			if (closeTimeout) {
				clearTimeout(closeTimeout);
				closeTimeout = null;
			}
			if (popoverApi.value.popoverState === 0) return;
			openTimeout = openTimeout || setTimeout(() => {
				if (popoverApi.value.togglePopover) popoverApi.value.togglePopover();
				openTimeout = null;
			}, props.openDelay);
		}
		function onMouseLeave() {
			if (props.mode !== "hover" || !popoverApi.value) return;
			if (openTimeout) {
				clearTimeout(openTimeout);
				openTimeout = null;
			}
			if (popoverApi.value.popoverState === 1) return;
			closeTimeout = closeTimeout || setTimeout(() => {
				if (popoverApi.value.closePopover) popoverApi.value.closePopover();
				closeTimeout = null;
			}, props.closeDelay);
		}
		watch(() => props.open, (newValue, oldValue) => {
			if (!popoverApi.value) return;
			if (oldValue === void 0 || newValue === oldValue) return;
			if (newValue) popoverApi.value.popoverState = 0;
			else popoverApi.value.closePopover();
		});
		watch(() => popoverApi.value?.popoverState, (newValue, oldValue) => {
			if (oldValue === void 0 || newValue === oldValue) return;
			emit("update:open", newValue === 0);
		});
		s(() => useId());
		return {
			ui,
			attrs,
			popover: popover2,
			popper,
			trigger,
			container,
			containerStyle,
			onTouchStart,
			onMouseEnter,
			onMouseLeave
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_HPopover = resolveComponent("HPopover");
	const _component_HPopoverButton = resolveComponent("HPopoverButton");
	const _component_HPopoverPanel = resolveComponent("HPopoverPanel");
	_push(ssrRenderComponent(_component_HPopover, mergeProps({
		ref: "popover",
		class: _ctx.ui.wrapper
	}, _ctx.attrs, { onMouseleave: _ctx.onMouseLeave }, _attrs), {
		default: withCtx(({ open, close }, _push, _parent, _scopeId) => {
			if (_push) {
				_push(ssrRenderComponent(_component_HPopoverButton, {
					ref: "trigger",
					as: "div",
					disabled: _ctx.disabled,
					class: _ctx.ui.trigger,
					role: "button",
					onMouseenter: _ctx.onMouseEnter,
					onTouchstart: _ctx.onTouchStart
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "default", {
							open,
							close
						}, () => {
							_push(`<button${ssrIncludeBooleanAttr(_ctx.disabled) ? " disabled" : ""}${_scopeId}> Open </button>`);
						}, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "default", {
							open,
							close
						}, () => [createVNode("button", { disabled: _ctx.disabled }, " Open ", 8, ["disabled"])])];
					}),
					_: 2
				}, _parent, _scopeId));
				if (_ctx.overlay) {
					_push(`<template>`);
					if (open) _push(`<div class="${ssrRenderClass([_ctx.ui.overlay.base, _ctx.ui.overlay.background])}"${_scopeId}></div>`);
					else _push(`<!---->`);
					_push(`</template>`);
				} else _push(`<!---->`);
				if (open) {
					_push(`<div class="${ssrRenderClass([_ctx.ui.container, _ctx.ui.width])}" style="${ssrRenderStyle(_ctx.containerStyle)}"${_scopeId}><template><div${_scopeId}>`);
					if (_ctx.popper.arrow) _push(`<div data-popper-arrow class="${ssrRenderClass(Object.values(_ctx.ui.arrow))}"${_scopeId}></div>`);
					else _push(`<!---->`);
					_push(ssrRenderComponent(_component_HPopoverPanel, {
						class: [
							_ctx.ui.base,
							_ctx.ui.background,
							_ctx.ui.ring,
							_ctx.ui.rounded,
							_ctx.ui.shadow
						],
						static: ""
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) ssrRenderSlot(_ctx.$slots, "panel", {
								open,
								close
							}, null, _push, _parent, _scopeId);
							else return [renderSlot(_ctx.$slots, "panel", {
								open,
								close
							})];
						}),
						_: 2
					}, _parent, _scopeId));
					_push(`</div></template></div>`);
				} else _push(`<!---->`);
			} else return [
				createVNode(_component_HPopoverButton, {
					ref: "trigger",
					as: "div",
					disabled: _ctx.disabled,
					class: _ctx.ui.trigger,
					role: "button",
					onMouseenter: _ctx.onMouseEnter,
					onTouchstartPassive: _ctx.onTouchStart
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
						open,
						close
					}, () => [createVNode("button", { disabled: _ctx.disabled }, " Open ", 8, ["disabled"])])]),
					_: 2
				}, 1032, [
					"disabled",
					"class",
					"onMouseenter",
					"onTouchstartPassive"
				]),
				_ctx.overlay ? (openBlock(), createBlock(Transition, mergeProps({
					key: 0,
					appear: ""
				}, _ctx.ui.overlay.transition), {
					default: withCtx(() => [open ? (openBlock(), createBlock("div", {
						key: 0,
						class: [_ctx.ui.overlay.base, _ctx.ui.overlay.background]
					}, null, 2)) : createCommentVNode("", true)]),
					_: 2
				}, 1040)) : createCommentVNode("", true),
				open ? (openBlock(), createBlock("div", {
					key: 1,
					ref: "container",
					class: [_ctx.ui.container, _ctx.ui.width],
					style: _ctx.containerStyle,
					onMouseenter: _ctx.onMouseEnter
				}, [createVNode(Transition, mergeProps({ appear: "" }, _ctx.ui.transition), {
					default: withCtx(() => [createVNode("div", null, [_ctx.popper.arrow ? (openBlock(), createBlock("div", {
						key: 0,
						"data-popper-arrow": "",
						class: Object.values(_ctx.ui.arrow)
					}, null, 2)) : createCommentVNode("", true), createVNode(_component_HPopoverPanel, {
						class: [
							_ctx.ui.base,
							_ctx.ui.background,
							_ctx.ui.ring,
							_ctx.ui.rounded,
							_ctx.ui.shadow
						],
						static: ""
					}, {
						default: withCtx(() => [renderSlot(_ctx.$slots, "panel", {
							open,
							close
						})]),
						_: 2
					}, 1032, ["class"])])]),
					_: 2
				}, 1040)], 46, ["onMouseenter"])) : createCommentVNode("", true)
			];
		}),
		_: 3
	}, _parent));
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/overlays/Popover.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Popover_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UPopover" });

export { Popover_default as default };
//# sourceMappingURL=Popover-CkvFVXKZ.mjs.map
