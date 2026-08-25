import { c as __exportAll, _ as _plugin_vue_export_helper_default, N as NuxtLink, t as twMerge, m as mergeConfig, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default } from '../virtual/entry.mjs';
import { g as getNuxtLinkProps } from './link-apSRv82-.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { u as useUI, d as dropdown_default } from './ui.config-2s_B03nh.mjs';
import { t as Avatar_default } from './Avatar-BOI4zec4.mjs';
import { t as Kbd_default } from './Kbd-rjcREfaE.mjs';
import { s, i, o as o$1, A as A$1, N, u, a as o } from './keyboard-DE1QlhcY.mjs';
import { w as w$1, h as h$1, _, v, N as N$1, O as O$1 } from './focus-management-DXpqooZk.mjs';
import { w } from './use-outside-click-E0zCHGRJ.mjs';
import { s as s$1 } from './use-resolve-button-type-DZKnDGM_.mjs';
import { u as u$1, i as i$1, c, f } from './calculate-active-index-CJA4E3gh.mjs';
import { l, i as i$2, t } from './open-closed-Css0b1VQ.mjs';
import { p } from './use-text-value-DhHPSnE-.mjs';
import { u as usePopper } from './usePopper-BCEqNZ_Z.mjs';
import { resolveComponent, mergeProps, withCtx, renderSlot, createVNode, resolveDynamicComponent, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList, Transition, defineComponent, toRef, computed, ref, watch, useId, watchEffect, nextTick, provide, inject, useSSRContext } from 'vue';
import { n as defu } from '../_/nitro.mjs';
import { twJoin } from 'tailwind-merge';
import { ssrRenderComponent, ssrRenderSlot, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderStyle, ssrRenderList, ssrRenderVNode, ssrInterpolate } from 'vue/server-renderer';
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
import '@iconify/vue';
import './components-CzgPFaUd.mjs';
import '@iconify/utils/lib/css/icon';
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

//#region node_modules/@headlessui/vue/dist/components/menu/menu.js
var Z = ((i) => (i[i.Open = 0] = "Open", i[i.Closed = 1] = "Closed", i))(Z || {});
var ee = ((i) => (i[i.Pointer = 0] = "Pointer", i[i.Other = 1] = "Other", i))(ee || {});
function te(o) {
	requestAnimationFrame(() => requestAnimationFrame(o));
}
var A = Symbol("MenuContext");
function O(o) {
	let M = inject(A, null);
	if (M === null) {
		let i = /* @__PURE__ */ new Error(`<${o} /> is missing a parent <Menu /> component.`);
		throw Error.captureStackTrace && Error.captureStackTrace(i, O), i;
	}
	return M;
}
var ge = defineComponent({
	name: "Menu",
	props: { as: {
		type: [Object, String],
		default: "template"
	} },
	setup(o$2, { slots: M, attrs: i }) {
		let I = ref(1), p = ref(null), e = ref(null), r = ref([]), f$1 = ref(""), d = ref(null), g = ref(1);
		function b(t = (a) => a) {
			let a = d.value !== null ? r.value[d.value] : null, n = O$1(t(r.value.slice()), (v) => o$1(v.dataRef.domRef)), s = a ? n.indexOf(a) : null;
			return s === -1 && (s = null), {
				items: n,
				activeItemIndex: s
			};
		}
		let l = {
			menuState: I,
			buttonRef: p,
			itemsRef: e,
			items: r,
			searchQuery: f$1,
			activeItemIndex: d,
			activationTrigger: g,
			closeMenu: () => {
				I.value = 1, d.value = null;
			},
			openMenu: () => I.value = 0,
			goToItem(t, a, n) {
				let s = b(), v = f(t === c.Specific ? {
					focus: c.Specific,
					id: a
				} : { focus: t }, {
					resolveItems: () => s.items,
					resolveActiveIndex: () => s.activeItemIndex,
					resolveId: (u) => u.id,
					resolveDisabled: (u) => u.dataRef.disabled
				});
				f$1.value = "", d.value = v, g.value = n != null ? n : 1, r.value = s.items;
			},
			search(t) {
				let n = f$1.value !== "" ? 0 : 1;
				f$1.value += t.toLowerCase();
				let v = (d.value !== null ? r.value.slice(d.value + n).concat(r.value.slice(0, d.value + n)) : r.value).find((h) => h.dataRef.textValue.startsWith(f$1.value) && !h.dataRef.disabled), u = v ? r.value.indexOf(v) : -1;
				u === -1 || u === d.value || (d.value = u, g.value = 1);
			},
			clearSearch() {
				f$1.value = "";
			},
			registerItem(t, a) {
				let n = b((s) => [...s, {
					id: t,
					dataRef: a
				}]);
				r.value = n.items, d.value = n.activeItemIndex, g.value = 1;
			},
			unregisterItem(t) {
				let a = b((n) => {
					let s = n.findIndex((v) => v.id === t);
					return s !== -1 && n.splice(s, 1), n;
				});
				r.value = a.items, d.value = a.activeItemIndex, g.value = 1;
			}
		};
		return w([p, e], (t, a) => {
			var n;
			l.closeMenu(), w$1(a, h$1.Loose) || (t.preventDefault(), (n = o$1(p)) == null || n.focus());
		}, computed(() => I.value === 0)), provide(A, l), t(computed(() => u(I.value, {
			[0]: i$2.Open,
			[1]: i$2.Closed
		}))), () => {
			let t = {
				open: I.value === 0,
				close: l.closeMenu
			};
			return A$1({
				ourProps: {},
				theirProps: o$2,
				slot: t,
				slots: M,
				attrs: i,
				name: "Menu"
			});
		};
	}
});
var Se = defineComponent({
	name: "MenuButton",
	props: {
		disabled: {
			type: Boolean,
			default: false
		},
		as: {
			type: [Object, String],
			default: "button"
		},
		id: {
			type: String,
			default: null
		}
	},
	setup(o$3, { attrs: M, slots: i$3, expose: I }) {
		var b;
		let p = (b = o$3.id) != null ? b : `headlessui-menu-button-${i()}`, e = O("MenuButton");
		I({
			el: e.buttonRef,
			$el: e.buttonRef
		});
		function r(l) {
			switch (l.key) {
				case o.Space:
				case o.Enter:
				case o.ArrowDown:
					l.preventDefault(), l.stopPropagation(), e.openMenu(), nextTick(() => {
						var t;
						(t = o$1(e.itemsRef)) == null || t.focus({ preventScroll: true }), e.goToItem(c.First);
					});
					break;
				case o.ArrowUp: l.preventDefault(), l.stopPropagation(), e.openMenu(), nextTick(() => {
					var t;
					(t = o$1(e.itemsRef)) == null || t.focus({ preventScroll: true }), e.goToItem(c.Last);
				});
			}
		}
		function f(l) {
			switch (l.key) {
				case o.Space: l.preventDefault();
			}
		}
		function d(l) {
			o$3.disabled || (e.menuState.value === 0 ? (e.closeMenu(), nextTick(() => {
				var t;
				return (t = o$1(e.buttonRef)) == null ? void 0 : t.focus({ preventScroll: true });
			})) : (l.preventDefault(), e.openMenu(), te(() => {
				var t;
				return (t = o$1(e.itemsRef)) == null ? void 0 : t.focus({ preventScroll: true });
			})));
		}
		let g = s$1(computed(() => ({
			as: o$3.as,
			type: M.type
		})), e.buttonRef);
		return () => {
			var n;
			let l = { open: e.menuState.value === 0 }, { ...t } = o$3, a = {
				ref: e.buttonRef,
				id: p,
				type: g.value,
				"aria-haspopup": "menu",
				"aria-controls": (n = o$1(e.itemsRef)) == null ? void 0 : n.id,
				"aria-expanded": e.menuState.value === 0,
				onKeydown: r,
				onKeyup: f,
				onClick: d
			};
			return A$1({
				ourProps: a,
				theirProps: t,
				slot: l,
				attrs: M,
				slots: i$3,
				name: "MenuButton"
			});
		};
	}
});
var Me = defineComponent({
	name: "MenuItems",
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
	setup(o$4, { attrs: M, slots: i$4, expose: I }) {
		var l$1;
		let p = (l$1 = o$4.id) != null ? l$1 : `headlessui-menu-items-${i()}`, e = O("MenuItems"), r = ref(null);
		I({
			el: e.itemsRef,
			$el: e.itemsRef
		}), i$1({
			container: computed(() => o$1(e.itemsRef)),
			enabled: computed(() => e.menuState.value === 0),
			accept(t) {
				return t.getAttribute("role") === "menuitem" ? NodeFilter.FILTER_REJECT : t.hasAttribute("role") ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
			},
			walk(t) {
				t.setAttribute("role", "none");
			}
		});
		function f(t) {
			var a;
			switch (r.value && clearTimeout(r.value), t.key) {
				case o.Space: if (e.searchQuery.value !== "") return t.preventDefault(), t.stopPropagation(), e.search(t.key);
				case o.Enter:
					if (t.preventDefault(), t.stopPropagation(), e.activeItemIndex.value !== null) {
						let s = e.items.value[e.activeItemIndex.value];
						(a = o$1(s.dataRef.domRef)) == null || a.click();
					}
					e.closeMenu(), _(o$1(e.buttonRef));
					break;
				case o.ArrowDown: return t.preventDefault(), t.stopPropagation(), e.goToItem(c.Next);
				case o.ArrowUp: return t.preventDefault(), t.stopPropagation(), e.goToItem(c.Previous);
				case o.Home:
				case o.PageUp: return t.preventDefault(), t.stopPropagation(), e.goToItem(c.First);
				case o.End:
				case o.PageDown: return t.preventDefault(), t.stopPropagation(), e.goToItem(c.Last);
				case o.Escape:
					t.preventDefault(), t.stopPropagation(), e.closeMenu(), nextTick(() => {
						var n;
						return (n = o$1(e.buttonRef)) == null ? void 0 : n.focus({ preventScroll: true });
					});
					break;
				case o.Tab:
					t.preventDefault(), t.stopPropagation(), e.closeMenu(), nextTick(() => v(o$1(e.buttonRef), t.shiftKey ? N$1.Previous : N$1.Next));
					break;
				default: t.key.length === 1 && (e.search(t.key), r.value = setTimeout(() => e.clearSearch(), 350));
			}
		}
		function d(t) {
			switch (t.key) {
				case o.Space: t.preventDefault();
			}
		}
		let g = l(), b = computed(() => g !== null ? (g.value & i$2.Open) === i$2.Open : e.menuState.value === 0);
		return () => {
			var s, v;
			let t = { open: e.menuState.value === 0 }, { ...a } = o$4, n = {
				"aria-activedescendant": e.activeItemIndex.value === null || (s = e.items.value[e.activeItemIndex.value]) == null ? void 0 : s.id,
				"aria-labelledby": (v = o$1(e.buttonRef)) == null ? void 0 : v.id,
				id: p,
				onKeydown: f,
				onKeyup: d,
				role: "menu",
				tabIndex: 0,
				ref: e.itemsRef
			};
			return A$1({
				ourProps: n,
				theirProps: a,
				slot: t,
				attrs: M,
				slots: i$4,
				features: N.RenderStrategy | N.Static,
				visible: b.value,
				name: "MenuItems"
			});
		};
	}
});
var be = defineComponent({
	name: "MenuItem",
	inheritAttrs: false,
	props: {
		as: {
			type: [Object, String],
			default: "template"
		},
		disabled: {
			type: Boolean,
			default: false
		},
		id: {
			type: String,
			default: null
		}
	},
	setup(o$5, { slots: M, attrs: i$5, expose: I }) {
		var v;
		let p$1 = (v = o$5.id) != null ? v : `headlessui-menu-item-${i()}`, e = O("MenuItem"), r = ref(null);
		I({
			el: r,
			$el: r
		});
		let f = computed(() => e.activeItemIndex.value !== null ? e.items.value[e.activeItemIndex.value].id === p$1 : false), d = p(r);
		computed(() => ({
			disabled: o$5.disabled,
			get textValue() {
				return d();
			},
			domRef: r
		}));
		watchEffect(() => {
			e.menuState.value === 0 && f.value && e.activationTrigger.value !== 0 && nextTick(() => {
				var u, h;
				return (h = (u = o$1(r)) == null ? void 0 : u.scrollIntoView) == null ? void 0 : h.call(u, { block: "nearest" });
			});
		});
		function b(u) {
			if (o$5.disabled) return u.preventDefault();
			e.closeMenu(), _(o$1(e.buttonRef));
		}
		function l() {
			if (o$5.disabled) return e.goToItem(c.Nothing);
			e.goToItem(c.Specific, p$1);
		}
		let t = u$1();
		function a(u) {
			t.update(u);
		}
		function n(u) {
			t.wasMoved(u) && (o$5.disabled || f.value || e.goToItem(c.Specific, p$1, 0));
		}
		function s(u) {
			t.wasMoved(u) && (o$5.disabled || f.value && e.goToItem(c.Nothing));
		}
		return () => {
			let { disabled: u, ...h } = o$5, C = {
				active: f.value,
				disabled: u,
				close: e.closeMenu
			};
			return A$1({
				ourProps: {
					id: p$1,
					ref: r,
					role: "menuitem",
					tabIndex: u === true ? void 0 : -1,
					"aria-disabled": u === true ? true : void 0,
					onClick: b,
					onFocus: l,
					onPointerenter: a,
					onMouseenter: a,
					onPointermove: n,
					onMousemove: n,
					onPointerleave: s,
					onMouseleave: s
				},
				theirProps: {
					...i$5,
					...h
				},
				slot: C,
				attrs: i$5,
				slots: M,
				name: "MenuItem"
			});
		};
	}
});
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/elements/Dropdown.vue
var Dropdown_exports = /* @__PURE__ */ __exportAll({ default: () => Dropdown_default });
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.dropdown, dropdown_default);
var _sfc_main = defineComponent({
	components: {
		HMenu: ge,
		HMenuButton: Se,
		HMenuItems: Me,
		HMenuItem: be,
		UIcon: Icon_default,
		UAvatar: Avatar_default,
		UKbd: Kbd_default
	},
	inheritAttrs: false,
	props: {
		items: {
			type: Array,
			default: () => []
		},
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
		popper: {
			type: Object,
			default: () => ({})
		},
		openDelay: {
			type: Number,
			default: () => config.default.openDelay
		},
		closeDelay: {
			type: Number,
			default: () => config.default.closeDelay
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
		const { ui, attrs } = useUI("dropdown", toRef(props, "ui"), config, toRef(props, "class"));
		const popper = computed(() => defu(props.mode === "hover" ? { offsetDistance: 0 } : {}, props.popper, ui.value.popper));
		const [trigger, container] = usePopper(popper.value);
		const menuApi = ref(null);
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
			if (!event.cancelable || !menuApi.value || props.mode === "click") return;
			if (menuApi.value.menuState === 0) menuApi.value.closeMenu();
			else menuApi.value.openMenu();
		}
		function onMouseEnter() {
			if (props.mode !== "hover" || !menuApi.value) return;
			if (closeTimeout) {
				clearTimeout(closeTimeout);
				closeTimeout = null;
			}
			if (menuApi.value.menuState === 0) return;
			openTimeout = openTimeout || setTimeout(() => {
				if (menuApi.value.openMenu) menuApi.value.openMenu();
				openTimeout = null;
			}, props.openDelay);
		}
		function onMouseLeave() {
			if (props.mode !== "hover" || !menuApi.value) return;
			if (openTimeout) {
				clearTimeout(openTimeout);
				openTimeout = null;
			}
			if (menuApi.value.menuState === 1) return;
			closeTimeout = closeTimeout || setTimeout(() => {
				if (menuApi.value.closeMenu) menuApi.value.closeMenu();
				closeTimeout = null;
			}, props.closeDelay);
		}
		function onClick(e, item, { href, navigate, close, isExternal }) {
			if (item.click) item.click(e);
			if (href && !isExternal) {
				navigate(e);
				close();
			}
		}
		watch(() => props.open, (newValue, oldValue) => {
			if (!menuApi.value) return;
			if (oldValue === void 0 || newValue === oldValue) return;
			if (newValue) menuApi.value.openMenu();
			else menuApi.value.closeMenu();
		});
		watch(() => menuApi.value?.menuState, (newValue, oldValue) => {
			if (oldValue === void 0 || newValue === oldValue) return;
			emit("update:open", newValue === 0);
		});
		const NuxtLink$1 = NuxtLink;
		s(() => useId());
		return {
			ui,
			attrs,
			popper,
			trigger,
			container,
			containerStyle,
			onTouchStart,
			onMouseEnter,
			onMouseLeave,
			onClick,
			getNuxtLinkProps,
			twMerge,
			twJoin,
			NuxtLink: NuxtLink$1
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_HMenu = resolveComponent("HMenu");
	const _component_HMenuButton = resolveComponent("HMenuButton");
	const _component_HMenuItems = resolveComponent("HMenuItems");
	const _component_NuxtLink = NuxtLink;
	const _component_HMenuItem = resolveComponent("HMenuItem");
	const _component_UIcon = Icon_default;
	const _component_UAvatar = Avatar_default;
	const _component_UKbd = Kbd_default;
	_push(ssrRenderComponent(_component_HMenu, mergeProps({
		as: "div",
		class: _ctx.ui.wrapper
	}, _ctx.attrs, { onMouseleave: _ctx.onMouseLeave }, _attrs), {
		default: withCtx(({ open }, _push, _parent, _scopeId) => {
			if (_push) {
				_push(ssrRenderComponent(_component_HMenuButton, {
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
							disabled: _ctx.disabled
						}, () => {
							_push(`<button${ssrIncludeBooleanAttr(_ctx.disabled) ? " disabled" : ""}${_scopeId}> Open </button>`);
						}, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "default", {
							open,
							disabled: _ctx.disabled
						}, () => [createVNode("button", { disabled: _ctx.disabled }, " Open ", 8, ["disabled"])])];
					}),
					_: 2
				}, _parent, _scopeId));
				if (open && _ctx.items.length) {
					_push(`<div class="${ssrRenderClass([_ctx.ui.container, _ctx.ui.width])}" style="${ssrRenderStyle(_ctx.containerStyle)}"${_scopeId}><template><div${_scopeId}>`);
					if (_ctx.popper.arrow) _push(`<div data-popper-arrow class="${ssrRenderClass(Object.values(_ctx.ui.arrow))}"${_scopeId}></div>`);
					else _push(`<!---->`);
					_push(ssrRenderComponent(_component_HMenuItems, {
						class: [
							_ctx.ui.base,
							_ctx.ui.divide,
							_ctx.ui.ring,
							_ctx.ui.rounded,
							_ctx.ui.shadow,
							_ctx.ui.background,
							_ctx.ui.height
						],
						static: ""
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<!--[-->`);
								ssrRenderList(_ctx.items, (subItems, index) => {
									_push(`<div class="${ssrRenderClass(_ctx.ui.padding)}"${_scopeId}><!--[-->`);
									ssrRenderList(subItems, (item, subIndex) => {
										_push(ssrRenderComponent(_component_NuxtLink, mergeProps({ key: subIndex }, { ref_for: true }, _ctx.getNuxtLinkProps(item), { custom: "" }), {
											default: withCtx(({ href, target, rel, navigate, isExternal, isActive }, _push, _parent, _scopeId) => {
												if (_push) _push(ssrRenderComponent(_component_HMenuItem, { disabled: item.disabled }, {
													default: withCtx(({ active, disabled: itemDisabled, close }, _push, _parent, _scopeId) => {
														if (_push) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(!!href ? "a" : "button"), {
															href: !itemDisabled ? href : void 0,
															rel,
															target,
															class: _ctx.twMerge(_ctx.twJoin(_ctx.ui.item.base, _ctx.ui.item.padding, _ctx.ui.item.size, _ctx.ui.item.rounded, active || isActive ? _ctx.ui.item.active : _ctx.ui.item.inactive, itemDisabled && _ctx.ui.item.disabled), item.class),
															onClick: ($event) => _ctx.onClick($event, item, {
																href,
																navigate,
																close,
																isExternal
															})
														}, {
															default: withCtx((_, _push, _parent, _scopeId) => {
																if (_push) ssrRenderSlot(_ctx.$slots, item.slot || "item", { item }, () => {
																	if (item.icon) _push(ssrRenderComponent(_component_UIcon, {
																		name: item.icon,
																		class: _ctx.twMerge(_ctx.twJoin(_ctx.ui.item.icon.base, active || isActive ? _ctx.ui.item.icon.active : _ctx.ui.item.icon.inactive), item.iconClass)
																	}, null, _parent, _scopeId));
																	else if (item.avatar) _push(ssrRenderComponent(_component_UAvatar, mergeProps({ ref_for: true }, {
																		size: _ctx.ui.item.avatar.size,
																		...item.avatar
																	}, { class: _ctx.ui.item.avatar.base }), null, _parent, _scopeId));
																	else _push(`<!---->`);
																	_push(`<span class="${ssrRenderClass(_ctx.twMerge(_ctx.ui.item.label, item.labelClass))}"${_scopeId}>${ssrInterpolate(item.label)}</span>`);
																	if (item.shortcuts?.length) {
																		_push(`<span class="${ssrRenderClass(_ctx.ui.item.shortcuts)}"${_scopeId}><!--[-->`);
																		ssrRenderList(item.shortcuts, (shortcut) => {
																			_push(ssrRenderComponent(_component_UKbd, { key: shortcut }, {
																				default: withCtx((_, _push, _parent, _scopeId) => {
																					if (_push) _push(`${ssrInterpolate(shortcut)}`);
																					else return [createTextVNode(toDisplayString(shortcut), 1)];
																				}),
																				_: 2
																			}, _parent, _scopeId));
																		});
																		_push(`<!--]--></span>`);
																	} else _push(`<!---->`);
																}, _push, _parent, _scopeId);
																else return [renderSlot(_ctx.$slots, item.slot || "item", { item }, () => [
																	item.icon ? (openBlock(), createBlock(_component_UIcon, {
																		key: 0,
																		name: item.icon,
																		class: _ctx.twMerge(_ctx.twJoin(_ctx.ui.item.icon.base, active || isActive ? _ctx.ui.item.icon.active : _ctx.ui.item.icon.inactive), item.iconClass)
																	}, null, 8, ["name", "class"])) : item.avatar ? (openBlock(), createBlock(_component_UAvatar, mergeProps({
																		key: 1,
																		ref_for: true
																	}, {
																		size: _ctx.ui.item.avatar.size,
																		...item.avatar
																	}, { class: _ctx.ui.item.avatar.base }), null, 16, ["class"])) : createCommentVNode("", true),
																	createVNode("span", { class: _ctx.twMerge(_ctx.ui.item.label, item.labelClass) }, toDisplayString(item.label), 3),
																	item.shortcuts?.length ? (openBlock(), createBlock("span", {
																		key: 2,
																		class: _ctx.ui.item.shortcuts
																	}, [(openBlock(true), createBlock(Fragment, null, renderList(item.shortcuts, (shortcut) => {
																		return openBlock(), createBlock(_component_UKbd, { key: shortcut }, {
																			default: withCtx(() => [createTextVNode(toDisplayString(shortcut), 1)]),
																			_: 2
																		}, 1024);
																	}), 128))], 2)) : createCommentVNode("", true)
																])];
															}),
															_: 2
														}), _parent, _scopeId);
														else return [(openBlock(), createBlock(resolveDynamicComponent(!!href ? "a" : "button"), {
															href: !itemDisabled ? href : void 0,
															rel,
															target,
															class: _ctx.twMerge(_ctx.twJoin(_ctx.ui.item.base, _ctx.ui.item.padding, _ctx.ui.item.size, _ctx.ui.item.rounded, active || isActive ? _ctx.ui.item.active : _ctx.ui.item.inactive, itemDisabled && _ctx.ui.item.disabled), item.class),
															onClick: ($event) => _ctx.onClick($event, item, {
																href,
																navigate,
																close,
																isExternal
															})
														}, {
															default: withCtx(() => [renderSlot(_ctx.$slots, item.slot || "item", { item }, () => [
																item.icon ? (openBlock(), createBlock(_component_UIcon, {
																	key: 0,
																	name: item.icon,
																	class: _ctx.twMerge(_ctx.twJoin(_ctx.ui.item.icon.base, active || isActive ? _ctx.ui.item.icon.active : _ctx.ui.item.icon.inactive), item.iconClass)
																}, null, 8, ["name", "class"])) : item.avatar ? (openBlock(), createBlock(_component_UAvatar, mergeProps({
																	key: 1,
																	ref_for: true
																}, {
																	size: _ctx.ui.item.avatar.size,
																	...item.avatar
																}, { class: _ctx.ui.item.avatar.base }), null, 16, ["class"])) : createCommentVNode("", true),
																createVNode("span", { class: _ctx.twMerge(_ctx.ui.item.label, item.labelClass) }, toDisplayString(item.label), 3),
																item.shortcuts?.length ? (openBlock(), createBlock("span", {
																	key: 2,
																	class: _ctx.ui.item.shortcuts
																}, [(openBlock(true), createBlock(Fragment, null, renderList(item.shortcuts, (shortcut) => {
																	return openBlock(), createBlock(_component_UKbd, { key: shortcut }, {
																		default: withCtx(() => [createTextVNode(toDisplayString(shortcut), 1)]),
																		_: 2
																	}, 1024);
																}), 128))], 2)) : createCommentVNode("", true)
															])]),
															_: 2
														}, 1032, [
															"href",
															"rel",
															"target",
															"class",
															"onClick"
														]))];
													}),
													_: 2
												}, _parent, _scopeId));
												else return [createVNode(_component_HMenuItem, { disabled: item.disabled }, {
													default: withCtx(({ active, disabled: itemDisabled, close }) => [(openBlock(), createBlock(resolveDynamicComponent(!!href ? "a" : "button"), {
														href: !itemDisabled ? href : void 0,
														rel,
														target,
														class: _ctx.twMerge(_ctx.twJoin(_ctx.ui.item.base, _ctx.ui.item.padding, _ctx.ui.item.size, _ctx.ui.item.rounded, active || isActive ? _ctx.ui.item.active : _ctx.ui.item.inactive, itemDisabled && _ctx.ui.item.disabled), item.class),
														onClick: ($event) => _ctx.onClick($event, item, {
															href,
															navigate,
															close,
															isExternal
														})
													}, {
														default: withCtx(() => [renderSlot(_ctx.$slots, item.slot || "item", { item }, () => [
															item.icon ? (openBlock(), createBlock(_component_UIcon, {
																key: 0,
																name: item.icon,
																class: _ctx.twMerge(_ctx.twJoin(_ctx.ui.item.icon.base, active || isActive ? _ctx.ui.item.icon.active : _ctx.ui.item.icon.inactive), item.iconClass)
															}, null, 8, ["name", "class"])) : item.avatar ? (openBlock(), createBlock(_component_UAvatar, mergeProps({
																key: 1,
																ref_for: true
															}, {
																size: _ctx.ui.item.avatar.size,
																...item.avatar
															}, { class: _ctx.ui.item.avatar.base }), null, 16, ["class"])) : createCommentVNode("", true),
															createVNode("span", { class: _ctx.twMerge(_ctx.ui.item.label, item.labelClass) }, toDisplayString(item.label), 3),
															item.shortcuts?.length ? (openBlock(), createBlock("span", {
																key: 2,
																class: _ctx.ui.item.shortcuts
															}, [(openBlock(true), createBlock(Fragment, null, renderList(item.shortcuts, (shortcut) => {
																return openBlock(), createBlock(_component_UKbd, { key: shortcut }, {
																	default: withCtx(() => [createTextVNode(toDisplayString(shortcut), 1)]),
																	_: 2
																}, 1024);
															}), 128))], 2)) : createCommentVNode("", true)
														])]),
														_: 2
													}, 1032, [
														"href",
														"rel",
														"target",
														"class",
														"onClick"
													]))]),
													_: 2
												}, 1032, ["disabled"])];
											}),
											_: 2
										}, _parent, _scopeId));
									});
									_push(`<!--]--></div>`);
								});
								_push(`<!--]-->`);
							} else return [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.items, (subItems, index) => {
								return openBlock(), createBlock("div", {
									key: index,
									class: _ctx.ui.padding
								}, [(openBlock(true), createBlock(Fragment, null, renderList(subItems, (item, subIndex) => {
									return openBlock(), createBlock(_component_NuxtLink, mergeProps({ key: subIndex }, { ref_for: true }, _ctx.getNuxtLinkProps(item), { custom: "" }), {
										default: withCtx(({ href, target, rel, navigate, isExternal, isActive }) => [createVNode(_component_HMenuItem, { disabled: item.disabled }, {
											default: withCtx(({ active, disabled: itemDisabled, close }) => [(openBlock(), createBlock(resolveDynamicComponent(!!href ? "a" : "button"), {
												href: !itemDisabled ? href : void 0,
												rel,
												target,
												class: _ctx.twMerge(_ctx.twJoin(_ctx.ui.item.base, _ctx.ui.item.padding, _ctx.ui.item.size, _ctx.ui.item.rounded, active || isActive ? _ctx.ui.item.active : _ctx.ui.item.inactive, itemDisabled && _ctx.ui.item.disabled), item.class),
												onClick: ($event) => _ctx.onClick($event, item, {
													href,
													navigate,
													close,
													isExternal
												})
											}, {
												default: withCtx(() => [renderSlot(_ctx.$slots, item.slot || "item", { item }, () => [
													item.icon ? (openBlock(), createBlock(_component_UIcon, {
														key: 0,
														name: item.icon,
														class: _ctx.twMerge(_ctx.twJoin(_ctx.ui.item.icon.base, active || isActive ? _ctx.ui.item.icon.active : _ctx.ui.item.icon.inactive), item.iconClass)
													}, null, 8, ["name", "class"])) : item.avatar ? (openBlock(), createBlock(_component_UAvatar, mergeProps({
														key: 1,
														ref_for: true
													}, {
														size: _ctx.ui.item.avatar.size,
														...item.avatar
													}, { class: _ctx.ui.item.avatar.base }), null, 16, ["class"])) : createCommentVNode("", true),
													createVNode("span", { class: _ctx.twMerge(_ctx.ui.item.label, item.labelClass) }, toDisplayString(item.label), 3),
													item.shortcuts?.length ? (openBlock(), createBlock("span", {
														key: 2,
														class: _ctx.ui.item.shortcuts
													}, [(openBlock(true), createBlock(Fragment, null, renderList(item.shortcuts, (shortcut) => {
														return openBlock(), createBlock(_component_UKbd, { key: shortcut }, {
															default: withCtx(() => [createTextVNode(toDisplayString(shortcut), 1)]),
															_: 2
														}, 1024);
													}), 128))], 2)) : createCommentVNode("", true)
												])]),
												_: 2
											}, 1032, [
												"href",
												"rel",
												"target",
												"class",
												"onClick"
											]))]),
											_: 2
										}, 1032, ["disabled"])]),
										_: 2
									}, 1040);
								}), 128))], 2);
							}), 128))];
						}),
						_: 2
					}, _parent, _scopeId));
					_push(`</div></template></div>`);
				} else _push(`<!---->`);
			} else return [createVNode(_component_HMenuButton, {
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
					disabled: _ctx.disabled
				}, () => [createVNode("button", { disabled: _ctx.disabled }, " Open ", 8, ["disabled"])])]),
				_: 2
			}, 1032, [
				"disabled",
				"class",
				"onMouseenter",
				"onTouchstartPassive"
			]), open && _ctx.items.length ? (openBlock(), createBlock("div", {
				key: 0,
				ref: "container",
				class: [_ctx.ui.container, _ctx.ui.width],
				style: _ctx.containerStyle,
				onMouseenter: _ctx.onMouseEnter
			}, [createVNode(Transition, mergeProps({ appear: "" }, _ctx.ui.transition), {
				default: withCtx(() => [createVNode("div", null, [_ctx.popper.arrow ? (openBlock(), createBlock("div", {
					key: 0,
					"data-popper-arrow": "",
					class: Object.values(_ctx.ui.arrow)
				}, null, 2)) : createCommentVNode("", true), createVNode(_component_HMenuItems, {
					class: [
						_ctx.ui.base,
						_ctx.ui.divide,
						_ctx.ui.ring,
						_ctx.ui.rounded,
						_ctx.ui.shadow,
						_ctx.ui.background,
						_ctx.ui.height
					],
					static: ""
				}, {
					default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.items, (subItems, index) => {
						return openBlock(), createBlock("div", {
							key: index,
							class: _ctx.ui.padding
						}, [(openBlock(true), createBlock(Fragment, null, renderList(subItems, (item, subIndex) => {
							return openBlock(), createBlock(_component_NuxtLink, mergeProps({ key: subIndex }, { ref_for: true }, _ctx.getNuxtLinkProps(item), { custom: "" }), {
								default: withCtx(({ href, target, rel, navigate, isExternal, isActive }) => [createVNode(_component_HMenuItem, { disabled: item.disabled }, {
									default: withCtx(({ active, disabled: itemDisabled, close }) => [(openBlock(), createBlock(resolveDynamicComponent(!!href ? "a" : "button"), {
										href: !itemDisabled ? href : void 0,
										rel,
										target,
										class: _ctx.twMerge(_ctx.twJoin(_ctx.ui.item.base, _ctx.ui.item.padding, _ctx.ui.item.size, _ctx.ui.item.rounded, active || isActive ? _ctx.ui.item.active : _ctx.ui.item.inactive, itemDisabled && _ctx.ui.item.disabled), item.class),
										onClick: ($event) => _ctx.onClick($event, item, {
											href,
											navigate,
											close,
											isExternal
										})
									}, {
										default: withCtx(() => [renderSlot(_ctx.$slots, item.slot || "item", { item }, () => [
											item.icon ? (openBlock(), createBlock(_component_UIcon, {
												key: 0,
												name: item.icon,
												class: _ctx.twMerge(_ctx.twJoin(_ctx.ui.item.icon.base, active || isActive ? _ctx.ui.item.icon.active : _ctx.ui.item.icon.inactive), item.iconClass)
											}, null, 8, ["name", "class"])) : item.avatar ? (openBlock(), createBlock(_component_UAvatar, mergeProps({
												key: 1,
												ref_for: true
											}, {
												size: _ctx.ui.item.avatar.size,
												...item.avatar
											}, { class: _ctx.ui.item.avatar.base }), null, 16, ["class"])) : createCommentVNode("", true),
											createVNode("span", { class: _ctx.twMerge(_ctx.ui.item.label, item.labelClass) }, toDisplayString(item.label), 3),
											item.shortcuts?.length ? (openBlock(), createBlock("span", {
												key: 2,
												class: _ctx.ui.item.shortcuts
											}, [(openBlock(true), createBlock(Fragment, null, renderList(item.shortcuts, (shortcut) => {
												return openBlock(), createBlock(_component_UKbd, { key: shortcut }, {
													default: withCtx(() => [createTextVNode(toDisplayString(shortcut), 1)]),
													_: 2
												}, 1024);
											}), 128))], 2)) : createCommentVNode("", true)
										])]),
										_: 2
									}, 1032, [
										"href",
										"rel",
										"target",
										"class",
										"onClick"
									]))]),
									_: 2
								}, 1032, ["disabled"])]),
								_: 2
							}, 1040);
						}), 128))], 2);
					}), 128))]),
					_: 3
				}, 8, ["class"])])]),
				_: 3
			}, 16)], 46, ["onMouseenter"])) : createCommentVNode("", true)];
		}),
		_: 3
	}, _parent));
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/elements/Dropdown.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Dropdown_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UDropdown" });

export { Dropdown_exports as n, Dropdown_default as t };
//# sourceMappingURL=Dropdown-BjJ7vUzi.mjs.map
