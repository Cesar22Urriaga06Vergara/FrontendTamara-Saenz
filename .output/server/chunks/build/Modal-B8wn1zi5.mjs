import { c as __exportAll, _ as _plugin_vue_export_helper_default, m as mergeConfig, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default } from '../virtual/entry.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { s } from './keyboard-DE1QlhcY.mjs';
import { h as he, S as Se, G as Ge, Y as Ye } from './transition-e-5g9u5m.mjs';
import { resolveComponent, mergeProps, withCtx, createVNode, renderSlot, openBlock, createBlock, createCommentVNode, defineComponent, toRef, computed, useId, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrRenderSlot } from 'vue/server-renderer';
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
import './micro-task-Dv1257jF.mjs';
import './active-element-history-BkxR87qo.mjs';
import './focus-management-DXpqooZk.mjs';
import './use-outside-click-E0zCHGRJ.mjs';
import './hidden-UkYquSML.mjs';
import './open-closed-Css0b1VQ.mjs';
import './portal-BOf15iST.mjs';
import './description-xz0pTumQ.mjs';

//#region node_modules/@nuxt/ui/dist/runtime/ui.config/overlays/modal.js
var modal_default = {
	wrapper: "relative z-50",
	inner: "fixed inset-0 overflow-y-auto",
	container: "flex min-h-full items-end sm:items-center justify-center text-center",
	padding: "p-4 sm:p-0",
	margin: "sm:my-8",
	base: "relative text-left rtl:text-right flex flex-col",
	overlay: {
		base: "fixed inset-0 transition-opacity",
		background: "bg-gray-200/75 dark:bg-gray-800/75",
		transition: {
			enter: "ease-out duration-300",
			enterFrom: "opacity-0",
			enterTo: "opacity-100",
			leave: "ease-in duration-200",
			leaveFrom: "opacity-100",
			leaveTo: "opacity-0"
		}
	},
	background: "bg-white dark:bg-gray-900",
	ring: "",
	rounded: "rounded-lg",
	shadow: "shadow-xl",
	width: "w-full sm:max-w-lg",
	height: "",
	fullscreen: "w-screen h-screen",
	transition: {
		enter: "ease-out duration-300",
		enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
		enterTo: "opacity-100 translate-y-0 sm:scale-100",
		leave: "ease-in duration-200",
		leaveFrom: "opacity-100 translate-y-0 sm:scale-100",
		leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
	}
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/overlays/Modal.vue
var Modal_exports = /* @__PURE__ */ __exportAll({ default: () => Modal_default });
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.modal, modal_default);
var _sfc_main = defineComponent({
	components: {
		HDialog: Ye,
		HDialogPanel: Ge,
		TransitionRoot: Se,
		TransitionChild: he
	},
	inheritAttrs: false,
	props: {
		modelValue: {
			type: Boolean,
			default: false
		},
		appear: {
			type: Boolean,
			default: false
		},
		overlay: {
			type: Boolean,
			default: true
		},
		transition: {
			type: Boolean,
			default: true
		},
		preventClose: {
			type: Boolean,
			default: false
		},
		fullscreen: {
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
	emits: [
		"update:modelValue",
		"close",
		"close-prevented",
		"after-leave"
	],
	setup(props, { emit }) {
		const { ui, attrs } = useUI("modal", toRef(props, "ui"), config, toRef(props, "class"));
		const isOpen = computed({
			get() {
				return props.modelValue;
			},
			set(value) {
				emit("update:modelValue", value);
			}
		});
		const transitionClass = computed(() => {
			if (!props.transition) return {};
			return { ...ui.value.transition };
		});
		function close(value) {
			if (props.preventClose) {
				emit("close-prevented");
				return;
			}
			isOpen.value = value;
			emit("close");
		}
		const onAfterLeave = () => {
			emit("after-leave");
		};
		s(() => useId());
		return {
			ui,
			attrs,
			isOpen,
			transitionClass,
			onAfterLeave,
			close
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_TransitionRoot = resolveComponent("TransitionRoot");
	const _component_HDialog = resolveComponent("HDialog");
	const _component_TransitionChild = resolveComponent("TransitionChild");
	const _component_HDialogPanel = resolveComponent("HDialogPanel");
	_push(ssrRenderComponent(_component_TransitionRoot, mergeProps({
		appear: _ctx.appear,
		show: _ctx.isOpen,
		as: "template",
		onAfterLeave: _ctx.onAfterLeave
	}, _attrs), {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(ssrRenderComponent(_component_HDialog, mergeProps({ class: _ctx.ui.wrapper }, _ctx.attrs, { onClose: _ctx.close }), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (_ctx.overlay) _push(ssrRenderComponent(_component_TransitionChild, mergeProps({
							as: "template",
							appear: _ctx.appear
						}, _ctx.ui.overlay.transition, { class: _ctx.ui.overlay.transition.enterFrom }), {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<div class="${ssrRenderClass([_ctx.ui.overlay.base, _ctx.ui.overlay.background])}"${_scopeId}></div>`);
								else return [createVNode("div", { class: [_ctx.ui.overlay.base, _ctx.ui.overlay.background] }, null, 2)];
							}),
							_: 1
						}, _parent, _scopeId));
						else _push(`<!---->`);
						_push(`<div class="${ssrRenderClass(_ctx.ui.inner)}"${_scopeId}><div class="${ssrRenderClass([_ctx.ui.container, !_ctx.fullscreen && _ctx.ui.padding])}"${_scopeId}>`);
						_push(ssrRenderComponent(_component_TransitionChild, mergeProps({
							as: "template",
							appear: _ctx.appear
						}, _ctx.transitionClass, { class: _ctx.transitionClass.enterFrom }), {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_component_HDialogPanel, { class: [
									_ctx.ui.base,
									_ctx.ui.background,
									_ctx.ui.ring,
									_ctx.ui.shadow,
									_ctx.fullscreen ? _ctx.ui.fullscreen : [
										_ctx.ui.width,
										_ctx.ui.height,
										_ctx.ui.rounded,
										_ctx.ui.margin
									]
								] }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
										else return [renderSlot(_ctx.$slots, "default")];
									}),
									_: 3
								}, _parent, _scopeId));
								else return [createVNode(_component_HDialogPanel, { class: [
									_ctx.ui.base,
									_ctx.ui.background,
									_ctx.ui.ring,
									_ctx.ui.shadow,
									_ctx.fullscreen ? _ctx.ui.fullscreen : [
										_ctx.ui.width,
										_ctx.ui.height,
										_ctx.ui.rounded,
										_ctx.ui.margin
									]
								] }, {
									default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
									_: 3
								}, 8, ["class"])];
							}),
							_: 3
						}, _parent, _scopeId));
						_push(`</div></div>`);
					} else return [_ctx.overlay ? (openBlock(), createBlock(_component_TransitionChild, mergeProps({
						key: 0,
						as: "template",
						appear: _ctx.appear
					}, _ctx.ui.overlay.transition, { class: _ctx.ui.overlay.transition.enterFrom }), {
						default: withCtx(() => [createVNode("div", { class: [_ctx.ui.overlay.base, _ctx.ui.overlay.background] }, null, 2)]),
						_: 1
					}, 16, ["appear", "class"])) : createCommentVNode("", true), createVNode("div", { class: _ctx.ui.inner }, [createVNode("div", { class: [_ctx.ui.container, !_ctx.fullscreen && _ctx.ui.padding] }, [createVNode(_component_TransitionChild, mergeProps({
						as: "template",
						appear: _ctx.appear
					}, _ctx.transitionClass, { class: _ctx.transitionClass.enterFrom }), {
						default: withCtx(() => [createVNode(_component_HDialogPanel, { class: [
							_ctx.ui.base,
							_ctx.ui.background,
							_ctx.ui.ring,
							_ctx.ui.shadow,
							_ctx.fullscreen ? _ctx.ui.fullscreen : [
								_ctx.ui.width,
								_ctx.ui.height,
								_ctx.ui.rounded,
								_ctx.ui.margin
							]
						] }, {
							default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
							_: 3
						}, 8, ["class"])]),
						_: 3
					}, 16, ["appear", "class"])], 2)], 2)];
				}),
				_: 3
			}, _parent, _scopeId));
			else return [createVNode(_component_HDialog, mergeProps({ class: _ctx.ui.wrapper }, _ctx.attrs, { onClose: _ctx.close }), {
				default: withCtx(() => [_ctx.overlay ? (openBlock(), createBlock(_component_TransitionChild, mergeProps({
					key: 0,
					as: "template",
					appear: _ctx.appear
				}, _ctx.ui.overlay.transition, { class: _ctx.ui.overlay.transition.enterFrom }), {
					default: withCtx(() => [createVNode("div", { class: [_ctx.ui.overlay.base, _ctx.ui.overlay.background] }, null, 2)]),
					_: 1
				}, 16, ["appear", "class"])) : createCommentVNode("", true), createVNode("div", { class: _ctx.ui.inner }, [createVNode("div", { class: [_ctx.ui.container, !_ctx.fullscreen && _ctx.ui.padding] }, [createVNode(_component_TransitionChild, mergeProps({
					as: "template",
					appear: _ctx.appear
				}, _ctx.transitionClass, { class: _ctx.transitionClass.enterFrom }), {
					default: withCtx(() => [createVNode(_component_HDialogPanel, { class: [
						_ctx.ui.base,
						_ctx.ui.background,
						_ctx.ui.ring,
						_ctx.ui.shadow,
						_ctx.fullscreen ? _ctx.ui.fullscreen : [
							_ctx.ui.width,
							_ctx.ui.height,
							_ctx.ui.rounded,
							_ctx.ui.margin
						]
					] }, {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
						_: 3
					}, 8, ["class"])]),
					_: 3
				}, 16, ["appear", "class"])], 2)], 2)]),
				_: 3
			}, 16, ["class", "onClose"])];
		}),
		_: 3
	}, _parent));
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/overlays/Modal.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Modal_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UModal" });

export { Modal_exports as n, Modal_default as t };
//# sourceMappingURL=Modal-B8wn1zi5.mjs.map
