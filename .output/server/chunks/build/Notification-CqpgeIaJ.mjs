import { c as __exportAll, _ as _plugin_vue_export_helper_default, t as twMerge, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default, m as mergeConfig, k as vue_demi_exports } from '../virtual/entry.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { t as Avatar_default } from './Avatar-BOI4zec4.mjs';
import { t as Button_default } from './Button-CoYovqJ9.mjs';
import { mergeProps, defineComponent, toRef, ref, computed, watch, watchEffect, useSSRContext } from 'vue';
import { useTimestamp } from '@vueuse/core';
import { twJoin } from 'tailwind-merge';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderSlot, ssrInterpolate, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
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
import '@iconify/vue';
import './components-CzgPFaUd.mjs';
import '@iconify/utils/lib/css/icon';
import './link-apSRv82-.mjs';
import './useButtonGroup-OQHG41CY.mjs';
import './button-BNOdwSP_.mjs';
import './Link-CnaKOPmE.mjs';

//#region node_modules/@nuxt/ui/dist/runtime/ui.config/overlays/notification.js
var notification_default = {
	wrapper: "w-full pointer-events-auto",
	container: "relative overflow-hidden",
	inner: "w-0 flex-1",
	title: "text-sm font-medium text-gray-900 dark:text-white",
	description: "mt-1 text-sm leading-4 text-gray-500 dark:text-gray-400",
	descriptionOnly: "mt-0 leading-5",
	actions: "flex items-center gap-2 mt-3 flex-shrink-0",
	background: "bg-white dark:bg-gray-900",
	shadow: "shadow-lg",
	rounded: "rounded-lg",
	padding: "p-4",
	gap: "gap-3",
	ring: "ring-1 ring-gray-200 dark:ring-gray-800",
	icon: {
		base: "flex-shrink-0 w-5 h-5",
		color: "text-{color}-500 dark:text-{color}-400"
	},
	avatar: {
		base: "flex-shrink-0 self-center",
		size: "md"
	},
	progress: {
		base: "absolute bottom-0 end-0 start-0 h-1",
		background: "bg-{color}-500 dark:bg-{color}-400"
	},
	transition: {
		enterActiveClass: "transform ease-out duration-300 transition",
		enterFromClass: "translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2",
		enterToClass: "translate-y-0 opacity-100 sm:translate-x-0",
		leaveActiveClass: "transition ease-in duration-100",
		leaveFromClass: "opacity-100",
		leaveToClass: "opacity-0"
	},
	default: {
		color: "primary",
		icon: null,
		timeout: 5e3,
		closeButton: {
			icon: "i-heroicons-x-mark-20-solid",
			color: "gray",
			variant: "link",
			padded: false
		},
		actionButton: {
			size: "xs",
			color: "white"
		}
	}
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/composables/useTimer.js
function useTimer(cb, interval, options) {
	let timer = null;
	const { pause: tPause, resume: tResume, timestamp } = useTimestamp({
		...{},
		controls: true
	});
	const startTime = (0, vue_demi_exports.ref)(null);
	const remaining = (0, vue_demi_exports.computed)(() => {
		if (!startTime.value) return 0;
		return interval - (timestamp.value - startTime.value);
	});
	function set(...args) {
		timer = setTimeout(() => {
			timer = null;
			startTime.value = null;
			cb(...args);
		}, remaining.value);
	}
	function clear() {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	}
	function start() {
		startTime.value = Date.now();
		set();
	}
	function stop() {
		clear();
		tPause();
	}
	function pause() {
		clear();
		tPause();
	}
	function resume() {
		set();
		tResume();
		startTime.value = (startTime.value || 0) + (Date.now() - timestamp.value);
	}
	start();
	return {
		start,
		stop,
		pause,
		resume,
		remaining
	};
}
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/overlays/Notification.vue
var Notification_exports = /* @__PURE__ */ __exportAll({ default: () => Notification_default });
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.notification, notification_default);
var _sfc_main = defineComponent({
	components: {
		UIcon: Icon_default,
		UAvatar: Avatar_default,
		UButton: Button_default
	},
	inheritAttrs: false,
	props: {
		id: {
			type: [String, Number],
			required: true
		},
		title: {
			type: String,
			default: null
		},
		description: {
			type: String,
			default: null
		},
		icon: {
			type: String,
			default: () => config.default.icon
		},
		avatar: {
			type: Object,
			default: null
		},
		closeButton: {
			type: Object,
			default: () => config.default.closeButton
		},
		timeout: {
			type: Number,
			default: () => config.default.timeout
		},
		actions: {
			type: Array,
			default: () => []
		},
		callback: {
			type: Function,
			default: null
		},
		color: {
			type: String,
			default: () => config.default.color,
			validator(value) {
				return ["gray", ...virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.colors].includes(value);
			}
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
		},
		pauseTimeoutOnHover: {
			type: Boolean,
			default: true
		}
	},
	emits: ["close"],
	setup(props, { emit }) {
		const { ui, attrs } = useUI("notification", toRef(props, "ui"), config);
		let timer = null;
		const remaining = ref(props.timeout);
		const wrapperClass = computed(() => {
			return twMerge(twJoin(ui.value.wrapper, ui.value.background?.replaceAll("{color}", props.color), ui.value.rounded, ui.value.shadow, ui.value.ring?.replaceAll("{color}", props.color)), props.class);
		});
		const progressClass = computed(() => {
			return twJoin(ui.value.progress.base, ui.value.progress.background?.replaceAll("{color}", props.color));
		});
		const progressStyle = computed(() => {
			return { width: `${remaining.value / props.timeout * 100 || 0}%` };
		});
		const iconClass = computed(() => {
			return twJoin(ui.value.icon.base, ui.value.icon.color?.replaceAll("{color}", props.color));
		});
		function onMouseover() {
			if (props.pauseTimeoutOnHover && timer) timer.pause();
		}
		function onMouseleave() {
			if (props.pauseTimeoutOnHover && timer) timer.resume();
		}
		function onClose() {
			if (timer) timer.stop();
			if (props.callback) props.callback();
			emit("close");
		}
		function onAction(action) {
			if (timer) timer.stop();
			if (action.click) action.click();
			emit("close");
		}
		function initTimer() {
			if (timer) timer.stop();
			if (!props.timeout) return;
			timer = useTimer(() => {
				onClose();
			}, props.timeout);
			watchEffect(() => {
				remaining.value = timer.remaining.value;
			});
		}
		watch(() => props.timeout, initTimer);
		return {
			ui,
			attrs,
			wrapperClass,
			progressClass,
			progressStyle,
			iconClass,
			onMouseover,
			onMouseleave,
			onClose,
			onAction,
			twMerge
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_UIcon = Icon_default;
	const _component_UAvatar = Avatar_default;
	const _component_UButton = Button_default;
	_push(`<template><div${ssrRenderAttrs(mergeProps({
		class: _ctx.wrapperClass,
		role: "status"
	}, _ctx.attrs, _attrs))}><div class="${ssrRenderClass([
		_ctx.ui.container,
		_ctx.ui.rounded,
		_ctx.ui.ring
	])}"><div class="${ssrRenderClass([[
		_ctx.ui.padding,
		_ctx.ui.gap,
		{
			"items-start": _ctx.description || _ctx.$slots.description,
			"items-center": !_ctx.description && !_ctx.$slots.description
		}
	], "flex"])}">`);
	if (_ctx.icon) _push(ssrRenderComponent(_component_UIcon, {
		name: _ctx.icon,
		class: _ctx.iconClass
	}, null, _parent));
	else _push(`<!---->`);
	if (_ctx.avatar) _push(ssrRenderComponent(_component_UAvatar, mergeProps({
		size: _ctx.ui.avatar.size,
		..._ctx.avatar
	}, { class: _ctx.ui.avatar.base }), null, _parent));
	else _push(`<!---->`);
	_push(`<div class="${ssrRenderClass(_ctx.ui.inner)}">`);
	if (_ctx.title || _ctx.$slots.title) {
		_push(`<p class="${ssrRenderClass(_ctx.ui.title)}">`);
		ssrRenderSlot(_ctx.$slots, "title", { title: _ctx.title }, () => {
			_push(`${ssrInterpolate(_ctx.title)}`);
		}, _push, _parent);
		_push(`</p>`);
	} else _push(`<!---->`);
	if (_ctx.description || _ctx.$slots.description) {
		_push(`<div class="${ssrRenderClass(_ctx.twMerge(_ctx.ui.description, !_ctx.title && !_ctx.$slots.title && _ctx.ui.descriptionOnly))}">`);
		ssrRenderSlot(_ctx.$slots, "description", { description: _ctx.description }, () => {
			_push(`${ssrInterpolate(_ctx.description)}`);
		}, _push, _parent);
		_push(`</div>`);
	} else _push(`<!---->`);
	if ((_ctx.description || _ctx.$slots.description) && _ctx.actions.length) {
		_push(`<div class="${ssrRenderClass(_ctx.ui.actions)}"><!--[-->`);
		ssrRenderList(_ctx.actions, (action, index) => {
			_push(ssrRenderComponent(_component_UButton, mergeProps({ key: index }, { ref_for: true }, {
				..._ctx.ui.default.actionButton || {},
				...action
			}, { onClick: ($event) => _ctx.onAction(action) }), null, _parent));
		});
		_push(`<!--]--></div>`);
	} else _push(`<!---->`);
	_push(`</div>`);
	if (_ctx.closeButton || !_ctx.description && !_ctx.$slots.description && _ctx.actions.length) {
		_push(`<div class="${ssrRenderClass(_ctx.twMerge(_ctx.ui.actions, "mt-0"))}">`);
		if (!_ctx.description && !_ctx.$slots.description && _ctx.actions.length) {
			_push(`<!--[-->`);
			ssrRenderList(_ctx.actions, (action, index) => {
				_push(ssrRenderComponent(_component_UButton, mergeProps({ key: index }, { ref_for: true }, {
					..._ctx.ui.default.actionButton || {},
					...action
				}, { onClick: ($event) => _ctx.onAction(action) }), null, _parent));
			});
			_push(`<!--]-->`);
		} else _push(`<!---->`);
		if (_ctx.closeButton) _push(ssrRenderComponent(_component_UButton, mergeProps({ "aria-label": "Close" }, {
			..._ctx.ui.default.closeButton || {},
			..._ctx.closeButton
		}, { onClick: _ctx.onClose }), null, _parent));
		else _push(`<!---->`);
		_push(`</div>`);
	} else _push(`<!---->`);
	_push(`</div>`);
	if (_ctx.timeout) _push(`<div class="${ssrRenderClass(_ctx.progressClass)}" style="${ssrRenderStyle(_ctx.progressStyle)}"></div>`);
	else _push(`<!---->`);
	_push(`</div></div></template>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/overlays/Notification.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Notification_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UNotification" });

export { Notification_exports as n, Notification_default as t };
//# sourceMappingURL=Notification-CqpgeIaJ.mjs.map
