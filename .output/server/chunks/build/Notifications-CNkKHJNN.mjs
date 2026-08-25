import { _ as _plugin_vue_export_helper_default, t as twMerge, p as useState, m as mergeConfig, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default } from '../virtual/entry.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { t as Notification_default } from './Notification-CqpgeIaJ.mjs';
import { mergeProps, createSlots, renderList, withCtx, renderSlot, defineComponent, toRef, computed, useSSRContext } from 'vue';
import { twJoin } from 'tailwind-merge';
import { ssrRenderTeleport, ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
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
import '@iconify/vue';
import './Icon-DzlsKOwd.mjs';
import './components-CzgPFaUd.mjs';
import '@iconify/utils/lib/css/icon';
import './Avatar-BOI4zec4.mjs';
import './Button-CoYovqJ9.mjs';
import './link-apSRv82-.mjs';
import './useButtonGroup-OQHG41CY.mjs';
import './button-BNOdwSP_.mjs';
import './Link-CnaKOPmE.mjs';

//#region node_modules/@nuxt/ui/dist/runtime/ui.config/overlays/notifications.js
var notifications_default = {
	wrapper: "fixed flex flex-col justify-end z-[55]",
	position: "bottom-0 end-0",
	width: "w-full sm:w-96",
	container: "px-4 sm:px-6 py-6 space-y-3 overflow-y-auto"
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/composables/useToast.js
function useToast() {
	const notifications = useState("notifications", () => []);
	function add(notification) {
		const body = {
			id: (/* @__PURE__ */ new Date()).getTime().toString(),
			...notification
		};
		if (notifications.value.findIndex((n) => n.id === body.id) === -1) notifications.value.push(body);
		return body;
	}
	function remove(id) {
		notifications.value = notifications.value.filter((n) => n.id !== id);
	}
	function update(id, notification) {
		const index = notifications.value.findIndex((n) => n.id === id);
		if (index !== -1) {
			const previous = notifications.value[index];
			notifications.value.splice(index, 1, {
				...previous,
				...notification
			});
		}
	}
	function clear() {
		notifications.value = [];
	}
	return {
		add,
		remove,
		update,
		clear
	};
}
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/overlays/Notifications.vue
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.notifications, notifications_default);
var _sfc_main = defineComponent({
	components: { UNotification: Notification_default },
	inheritAttrs: false,
	props: {
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
	setup(props) {
		const { ui, attrs } = useUI("notifications", toRef(props, "ui"), config);
		return {
			ui,
			attrs,
			toast: useToast(),
			notifications: useState("notifications", () => []),
			wrapperClass: computed(() => {
				return twMerge(twJoin(ui.value.wrapper, ui.value.position, ui.value.width), props.class);
			})
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_UNotification = Notification_default;
	ssrRenderTeleport(_push, (_push) => {
		if (_ctx.notifications.length) {
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: _ctx.wrapperClass,
				role: "region"
			}, _ctx.attrs))}><div class="${ssrRenderClass(_ctx.ui.container)}"><!--[-->`);
			ssrRenderList(_ctx.notifications, (notification) => {
				_push(`<div>`);
				_push(ssrRenderComponent(_component_UNotification, mergeProps({ ref_for: true }, notification, {
					class: notification.click && "cursor-pointer",
					onClick: ($event) => notification.click && notification.click(notification),
					onClose: ($event) => _ctx.toast.remove(notification.id)
				}), createSlots({ _: 2 }, [renderList(_ctx.$slots, (_, name) => {
					return {
						name,
						fn: withCtx((slotData, _push, _parent, _scopeId) => {
							if (_push) ssrRenderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotData), null, _push, _parent, _scopeId);
							else return [renderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotData))];
						})
					};
				})]), _parent));
				_push(`</div>`);
			});
			_push(`<!--]--></div></div>`);
		} else _push(`<!---->`);
	}, "body", false, _parent);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/overlays/Notifications.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Notifications_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UNotifications" });

export { Notifications_default as default };
//# sourceMappingURL=Notifications-CNkKHJNN.mjs.map
