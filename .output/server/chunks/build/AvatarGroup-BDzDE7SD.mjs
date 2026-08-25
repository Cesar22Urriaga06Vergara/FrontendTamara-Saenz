import { j as getSlotsChildren, t as twMerge, m as mergeConfig, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default } from '../virtual/entry.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { t as Avatar_default, r as avatar_default } from './Avatar-BOI4zec4.mjs';
import { defineComponent, toRef, computed, cloneVNode, h } from 'vue';
import { twJoin } from 'tailwind-merge';
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
import 'vue/server-renderer';
import 'devalue';
import '@vueuse/core';
import '@iconify/vue';
import './Icon-DzlsKOwd.mjs';
import './components-CzgPFaUd.mjs';
import '@iconify/utils/lib/css/icon';

//#region node_modules/@nuxt/ui/dist/runtime/ui.config/elements/avatarGroup.js
var avatarGroup_default = {
	wrapper: "inline-flex flex-row-reverse justify-end",
	ring: "ring-2 ring-white dark:ring-gray-900",
	margin: "-me-1.5 first:me-0"
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/elements/AvatarGroup.js
var avatarConfig = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.avatar, avatar_default);
var avatarGroupConfig = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.avatarGroup, avatarGroup_default);
var AvatarGroup_default = defineComponent({
	inheritAttrs: false,
	props: {
		size: {
			type: String,
			default: null,
			validator(value) {
				return Object.keys(avatarConfig.size).includes(value);
			}
		},
		max: {
			type: Number,
			default: null
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
	setup(props, { slots }) {
		const { ui, attrs } = useUI("avatarGroup", toRef(props, "ui"), avatarGroupConfig, toRef(props, "class"));
		const children = computed(() => getSlotsChildren(slots));
		const max = computed(() => typeof props.max === "string" ? Number.parseInt(props.max, 10) : props.max);
		const clones = computed(() => children.value.map((node, index) => {
			const vProps = {};
			if (!props.max || max.value && index < max.value) {
				if (props.size) vProps.size = props.size;
				vProps.class = node.props.class || "";
				vProps.class = twMerge(twJoin(vProps.class, ui.value.ring, ui.value.margin), vProps.class);
				return cloneVNode(node, vProps);
			}
			if (max.value !== void 0 && index === max.value) return h(Avatar_default, {
				size: props.size || avatarConfig.default.size,
				text: `+${children.value.length - max.value}`,
				class: twJoin(ui.value.ring, ui.value.margin)
			});
			return null;
		}).filter(Boolean).reverse());
		return () => h("div", {
			class: ui.value.wrapper,
			...attrs.value
		}, clones.value);
	}
});

export { AvatarGroup_default as default };
//# sourceMappingURL=AvatarGroup-BDzDE7SD.mjs.map
