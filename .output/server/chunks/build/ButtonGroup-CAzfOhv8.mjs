import { j as getSlotsChildren, t as twMerge, m as mergeConfig, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default } from '../virtual/entry.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { a as useProvideButtonGroup } from './useButtonGroup-OQHG41CY.mjs';
import { b as button_default } from './button-BNOdwSP_.mjs';
import { defineComponent, toRef, computed, h } from 'vue';
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

//#region node_modules/@nuxt/ui/dist/runtime/ui.config/elements/buttonGroup.js
var buttonGroup_default = {
	wrapper: {
		horizontal: "inline-flex -space-x-px",
		vertical: "inline-flex flex-col -space-y-px"
	},
	rounded: "rounded-md",
	shadow: "shadow-sm",
	orientation: {
		"rounded-none": {
			horizontal: {
				start: "rounded-s-none",
				end: "rounded-e-none"
			},
			vertical: {
				start: "rounded-t-none",
				end: "rounded-b-none"
			}
		},
		"rounded-sm": {
			horizontal: {
				start: "rounded-s-sm",
				end: "rounded-e-sm"
			},
			vertical: {
				start: "rounded-t-sm",
				end: "rounded-b-sm"
			}
		},
		"rounded": {
			horizontal: {
				start: "rounded-s",
				end: "rounded-e"
			},
			vertical: {
				start: "rounded-t",
				end: "rounded-b"
			}
		},
		"rounded-md": {
			horizontal: {
				start: "rounded-s-md",
				end: "rounded-e-md"
			},
			vertical: {
				start: "rounded-t-md",
				end: "rounded-b-md"
			}
		},
		"rounded-lg": {
			horizontal: {
				start: "rounded-s-lg",
				end: "rounded-e-lg"
			},
			vertical: {
				start: "rounded-t-lg",
				end: "rounded-b-lg"
			}
		},
		"rounded-xl": {
			horizontal: {
				start: "rounded-s-xl",
				end: "rounded-e-xl"
			},
			vertical: {
				start: "rounded-t-xl",
				end: "rounded-b-xl"
			}
		},
		"rounded-2xl": {
			horizontal: {
				start: "rounded-s-2xl",
				end: "rounded-e-2xl"
			},
			vertical: {
				start: "rounded-t-2xl",
				end: "rounded-b-2xl"
			}
		},
		"rounded-3xl": {
			horizontal: {
				start: "rounded-s-3xl",
				end: "rounded-e-3xl"
			},
			vertical: {
				start: "rounded-t-3xl",
				end: "rounded-b-3xl"
			}
		},
		"rounded-full": {
			horizontal: {
				start: "rounded-s-full",
				end: "rounded-e-full"
			},
			vertical: {
				start: "rounded-t-full",
				end: "rounded-b-full"
			}
		}
	}
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/elements/ButtonGroup.js
var buttonConfig = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.button, button_default);
var buttonGroupConfig = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.buttonGroup, buttonGroup_default);
var ButtonGroup_default = defineComponent({
	name: "ButtonGroup",
	inheritAttrs: false,
	props: {
		size: {
			type: String,
			default: null,
			validator(value) {
				return Object.keys(buttonConfig.size).includes(value);
			}
		},
		orientation: {
			type: String,
			default: "horizontal",
			validator(value) {
				return ["horizontal", "vertical"].includes(value);
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
		}
	},
	setup(props, { slots }) {
		const { ui, attrs } = useUI("buttonGroup", toRef(props, "ui"), buttonGroupConfig);
		const children = computed(() => getSlotsChildren(slots));
		const wrapperClass = computed(() => {
			return twMerge(twJoin(ui.value.wrapper[props.orientation], ui.value.rounded, ui.value.shadow), props.class);
		});
		const rounded = computed(() => ui.value.orientation[ui.value.rounded][props.orientation]);
		useProvideButtonGroup({
			orientation: toRef(props, "orientation"),
			size: toRef(props, "size"),
			ui,
			rounded
		});
		return () => h("div", {
			class: wrapperClass.value,
			...attrs.value
		}, children.value);
	}
});

export { ButtonGroup_default as default };
//# sourceMappingURL=ButtonGroup-CAzfOhv8.mjs.map
