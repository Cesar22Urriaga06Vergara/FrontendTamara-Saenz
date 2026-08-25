import { _ as _plugin_vue_export_helper_default, m as mergeConfig, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default } from '../virtual/entry.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { t as Button_default } from './Button-CoYovqJ9.mjs';
import { u as ut, i as it, l as lt } from './combobox-C0tFQX7q.mjs';
import { s } from './keyboard-DE1QlhcY.mjs';
import { t as CommandPaletteGroup_default } from './CommandPaletteGroup-C7JGUBWs.mjs';
import { resolveComponent, mergeProps, withCtx, createSlots, renderList, renderSlot, openBlock, createBlock, Fragment, withDirectives, createVNode, createCommentVNode, vShow, toDisplayString, defineComponent, toRef, ref, computed, watch, useId, useSSRContext } from 'vue';
import { n as defu } from '../_/nitro.mjs';
import { useDebounceFn } from '@vueuse/core';
import { twJoin } from 'tailwind-merge';
import { ssrRenderComponent, ssrRenderClass, ssrRenderStyle, ssrRenderList, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
import { useFuse } from '@vueuse/integrations/useFuse';
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
import './link-apSRv82-.mjs';
import './useButtonGroup-OQHG41CY.mjs';
import './button-BNOdwSP_.mjs';
import './Link-CnaKOPmE.mjs';
import './form-BjTHmaPY.mjs';
import './active-element-history-BkxR87qo.mjs';
import './micro-task-Dv1257jF.mjs';
import './focus-management-DXpqooZk.mjs';
import './use-outside-click-E0zCHGRJ.mjs';
import './use-resolve-button-type-DZKnDGM_.mjs';
import './calculate-active-index-CJA4E3gh.mjs';
import './hidden-UkYquSML.mjs';
import './open-closed-Css0b1VQ.mjs';
import '@tanstack/vue-virtual';
import './Avatar-BOI4zec4.mjs';
import './Kbd-rjcREfaE.mjs';

//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/navigation/CommandPalette.vue
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.commandPalette, {
	wrapper: "flex flex-col flex-1 min-h-0 divide-y divide-gray-100 dark:divide-gray-800",
	container: "relative flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 scroll-py-2",
	input: {
		wrapper: "relative flex items-center",
		base: "w-full placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-0 text-gray-900 dark:text-white focus:ring-0 focus:outline-none",
		padding: "px-4",
		height: "h-12",
		size: "sm:text-sm",
		icon: {
			base: "pointer-events-none absolute start-4 text-gray-400 dark:text-gray-500",
			loading: "animate-spin",
			size: "h-5 w-5",
			padding: "ps-11"
		},
		closeButton: {
			base: "absolute end-4",
			padding: "pe-10"
		}
	},
	emptyState: {
		wrapper: "flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14",
		label: "text-sm text-center text-gray-900 dark:text-white",
		queryLabel: "text-sm text-center text-gray-900 dark:text-white",
		icon: "w-6 h-6 mx-auto text-gray-400 dark:text-gray-500 mb-4"
	},
	group: {
		wrapper: "p-2",
		label: "px-2.5 my-2 text-xs font-semibold text-gray-900 dark:text-white",
		container: "text-sm text-gray-700 dark:text-gray-200",
		command: {
			base: "flex justify-between select-none items-center rounded-md px-2.5 py-1.5 gap-2 relative",
			active: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
			inactive: "",
			label: "flex items-center gap-1.5 min-w-0",
			prefix: "text-gray-400 dark:text-gray-500",
			suffix: "text-gray-400 dark:text-gray-500",
			container: "flex items-center gap-1.5 min-w-0",
			icon: {
				base: "flex-shrink-0 w-5 h-5",
				active: "text-gray-900 dark:text-white",
				inactive: "text-gray-400 dark:text-gray-500"
			},
			selectedIcon: { base: "h-5 w-5 text-gray-900 dark:text-white flex-shrink-0" },
			avatar: {
				base: "flex-shrink-0",
				size: "2xs"
			},
			chip: { base: "flex-shrink-0 w-2 h-2 mx-1 rounded-full" },
			disabled: "opacity-50",
			shortcuts: "hidden md:inline-flex flex-shrink-0 gap-0.5"
		},
		active: "flex-shrink-0 text-gray-500 dark:text-gray-400",
		inactive: "flex-shrink-0 text-gray-500 dark:text-gray-400"
	},
	default: {
		icon: "i-heroicons-magnifying-glass-20-solid",
		loadingIcon: "i-heroicons-arrow-path-20-solid",
		emptyState: {
			icon: "i-heroicons-magnifying-glass-20-solid",
			label: "We couldn't find any items.",
			queryLabel: "We couldn't find any items with that term. Please try again."
		},
		closeButton: null,
		selectedIcon: "i-heroicons-check-20-solid"
	}
});
var _sfc_main = defineComponent({
	components: {
		HCombobox: lt,
		HComboboxInput: it,
		HComboboxOptions: ut,
		UIcon: Icon_default,
		UButton: Button_default,
		CommandPaletteGroup: CommandPaletteGroup_default
	},
	inheritAttrs: false,
	props: {
		modelValue: {
			type: [
				String,
				Number,
				Object,
				Array
			],
			default: null
		},
		by: {
			type: String,
			default: "id"
		},
		multiple: {
			type: Boolean,
			default: false
		},
		nullable: {
			type: Boolean,
			default: false
		},
		searchable: {
			type: Boolean,
			default: true
		},
		loading: {
			type: Boolean,
			default: false
		},
		groups: {
			type: Array,
			default: () => []
		},
		icon: {
			type: String,
			default: () => config.default.icon
		},
		loadingIcon: {
			type: String,
			default: () => config.default.loadingIcon
		},
		selectedIcon: {
			type: String,
			default: () => config.default.selectedIcon
		},
		closeButton: {
			type: Object,
			default: () => config.default.closeButton
		},
		emptyState: {
			type: Object,
			default: () => config.default.emptyState
		},
		placeholder: {
			type: String,
			default: "Search..."
		},
		groupAttribute: {
			type: String,
			default: "label"
		},
		commandAttribute: {
			type: String,
			default: "label"
		},
		autoselect: {
			type: Boolean,
			default: true
		},
		autoclear: {
			type: Boolean,
			default: true
		},
		debounce: {
			type: Number,
			default: 200
		},
		fuse: {
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
	emits: ["update:modelValue", "close"],
	setup(props, { emit, expose }) {
		const { ui, attrs } = useUI("commandPalette", toRef(props, "ui"), config, toRef(props, "class"));
		const query = ref("");
		const comboboxInput = ref();
		const comboboxApi = ref(null);
		const isLoading = ref(false);
		const options = computed(() => defu({}, props.fuse, {
			fuseOptions: { keys: [props.commandAttribute] },
			resultLimit: 12,
			matchAllWhenSearchEmpty: true
		}));
		const commands = computed(() => {
			const commands2 = [];
			for (const group of props.groups) if (!group.search && !group.static) commands2.push(...group.commands?.map((command) => ({
				...command,
				group: group.key
			})) || []);
			return commands2;
		});
		const searchResults = ref({});
		const { results } = useFuse(query, commands, options);
		function getGroupWithCommands(group, commands2) {
			if (!group) return;
			if (group.filter && typeof group.filter === "function") commands2 = group.filter(query.value, commands2);
			return {
				...group,
				commands: commands2.slice(0, options.value.resultLimit)
			};
		}
		const groups = computed(() => {
			if (!results.value) return [];
			const groupedCommands = results.value.reduce((acc, command) => {
				const { item, ...data } = command;
				if (!item.group) return acc;
				acc[item.group] ||= [];
				acc[item.group].push({
					...item,
					...data
				});
				return acc;
			}, {});
			const groups2 = Object.entries(groupedCommands).map(([key, commands2]) => {
				const group = props.groups.find((group2) => group2.key === key);
				if (!group) return null;
				return getGroupWithCommands(group, commands2);
			}).filter(Boolean);
			const searchGroups = props.groups.filter((group) => !!group.search && searchResults.value[group.key]?.length).map((group) => {
				return getGroupWithCommands(group, [...searchResults.value[group.key] || []]);
			});
			const staticGroups = props.groups.filter((group) => group.static && group.commands?.length).map((group) => {
				return getGroupWithCommands(group, group.commands);
			});
			return [
				...groups2,
				...searchGroups,
				...staticGroups
			];
		});
		const debouncedSearch = useDebounceFn(async () => {
			const searchableGroups = props.groups.filter((group) => !!group.search);
			if (!searchableGroups.length) return;
			isLoading.value = true;
			await Promise.all(searchableGroups.map(async (group) => {
				searchResults.value[group.key] = await group.search(query.value);
			}));
			isLoading.value = false;
			activateFirstOption();
		}, props.debounce);
		watch(query, () => {
			debouncedSearch();
			activateFirstOption();
		});
		const iconName = computed(() => {
			if ((props.loading || isLoading.value) && props.loadingIcon) return props.loadingIcon;
			return props.icon;
		});
		const iconClass = computed(() => {
			return twJoin(ui.value.input.icon.base, ui.value.input.icon.size, (props.loading || isLoading.value) && props.loadingIcon && ui.value.input.icon.loading);
		});
		const emptyState = computed(() => {
			if (props.emptyState === null) return null;
			return {
				...ui.value.default.emptyState,
				...props.emptyState
			};
		});
		function activateFirstOption() {
			setTimeout(() => {
				comboboxInput.value?.$el.dispatchEvent(new KeyboardEvent("keydown", { key: "PageUp" }));
			}, 0);
		}
		function onSelect(option) {
			emit("update:modelValue", option, { query: query.value });
			if (props.autoclear) setTimeout(() => {
				query.value = "";
			}, 0);
		}
		function onClear() {
			if (query.value) query.value = "";
			else emit("close");
		}
		expose({
			query,
			updateQuery: (q) => {
				query.value = q;
			},
			comboboxApi,
			results
		});
		s(() => useId());
		return {
			ui,
			attrs,
			groups,
			comboboxInput,
			query,
			iconName,
			iconClass,
			emptyState,
			onSelect,
			onClear
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_HCombobox = resolveComponent("HCombobox");
	const _component_UIcon = Icon_default;
	const _component_HComboboxInput = resolveComponent("HComboboxInput");
	const _component_UButton = Button_default;
	const _component_HComboboxOptions = resolveComponent("HComboboxOptions");
	const _component_CommandPaletteGroup = resolveComponent("CommandPaletteGroup");
	_push(ssrRenderComponent(_component_HCombobox, mergeProps({
		by: _ctx.by,
		"model-value": _ctx.modelValue,
		multiple: _ctx.multiple,
		nullable: _ctx.nullable,
		class: _ctx.ui.wrapper
	}, _ctx.attrs, {
		as: "div",
		"onUpdate:modelValue": _ctx.onSelect
	}, _attrs), {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) {
				_push(`<div class="${ssrRenderClass(_ctx.ui.input.wrapper)}" style="${ssrRenderStyle(_ctx.searchable ? null : { display: "none" })}"${_scopeId}>`);
				if (_ctx.iconName) _push(ssrRenderComponent(_component_UIcon, {
					name: _ctx.iconName,
					class: _ctx.iconClass,
					"aria-hidden": "true"
				}, null, _parent, _scopeId));
				else _push(`<!---->`);
				_push(ssrRenderComponent(_component_HComboboxInput, {
					ref: "comboboxInput",
					value: _ctx.query,
					class: [
						_ctx.ui.input.base,
						_ctx.ui.input.size,
						_ctx.ui.input.height,
						_ctx.ui.input.padding,
						_ctx.icon && _ctx.ui.input.icon.padding,
						_ctx.closeButton && _ctx.ui.input.closeButton.padding
					],
					placeholder: _ctx.placeholder,
					"aria-label": _ctx.placeholder,
					autocomplete: "off",
					onChange: ($event) => _ctx.query = $event.target.value
				}, null, _parent, _scopeId));
				if (_ctx.closeButton) _push(ssrRenderComponent(_component_UButton, mergeProps({ "aria-label": "Close" }, {
					..._ctx.ui.default.closeButton || {},
					..._ctx.closeButton
				}, {
					class: _ctx.ui.input.closeButton.base,
					onClick: _ctx.onClear
				}), null, _parent, _scopeId));
				else _push(`<!---->`);
				_push(`</div>`);
				if (_ctx.groups.length) _push(ssrRenderComponent(_component_HComboboxOptions, {
					static: "",
					hold: "",
					as: "div",
					"aria-label": "Commands",
					class: _ctx.ui.container
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<!--[-->`);
							ssrRenderList(_ctx.groups, (group) => {
								_push(ssrRenderComponent(_component_CommandPaletteGroup, {
									key: group.key,
									query: _ctx.query,
									group,
									"group-attribute": _ctx.groupAttribute,
									"command-attribute": _ctx.commandAttribute,
									"selected-icon": _ctx.selectedIcon,
									ui: _ctx.ui
								}, createSlots({ _: 2 }, [renderList(_ctx.$slots, (_, name) => {
									return {
										name,
										fn: withCtx((slotData, _push, _parent, _scopeId) => {
											if (_push) ssrRenderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotData), null, _push, _parent, _scopeId);
											else return [renderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotData))];
										})
									};
								})]), _parent, _scopeId));
							});
							_push(`<!--]-->`);
						} else return [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.groups, (group) => {
							return openBlock(), createBlock(_component_CommandPaletteGroup, {
								key: group.key,
								query: _ctx.query,
								group,
								"group-attribute": _ctx.groupAttribute,
								"command-attribute": _ctx.commandAttribute,
								"selected-icon": _ctx.selectedIcon,
								ui: _ctx.ui
							}, createSlots({ _: 2 }, [renderList(_ctx.$slots, (_, name) => {
								return {
									name,
									fn: withCtx((slotData) => [renderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotData))])
								};
							})]), 1032, [
								"query",
								"group",
								"group-attribute",
								"command-attribute",
								"selected-icon",
								"ui"
							]);
						}), 128))];
					}),
					_: 3
				}, _parent, _scopeId));
				else if (_ctx.emptyState) ssrRenderSlot(_ctx.$slots, "empty-state", {}, () => {
					_push(`<div class="${ssrRenderClass(_ctx.ui.emptyState.wrapper)}"${_scopeId}>`);
					if (_ctx.emptyState.icon) _push(ssrRenderComponent(_component_UIcon, {
						name: _ctx.emptyState.icon,
						class: _ctx.ui.emptyState.icon,
						"aria-hidden": "true"
					}, null, _parent, _scopeId));
					else _push(`<!---->`);
					_push(`<p class="${ssrRenderClass(_ctx.query ? _ctx.ui.emptyState.queryLabel : _ctx.ui.emptyState.label)}"${_scopeId}>${ssrInterpolate(_ctx.query ? _ctx.emptyState.queryLabel : _ctx.emptyState.label)}</p></div>`);
				}, _push, _parent, _scopeId);
				else _push(`<!---->`);
			} else return [withDirectives(createVNode("div", { class: _ctx.ui.input.wrapper }, [
				_ctx.iconName ? (openBlock(), createBlock(_component_UIcon, {
					key: 0,
					name: _ctx.iconName,
					class: _ctx.iconClass,
					"aria-hidden": "true"
				}, null, 8, ["name", "class"])) : createCommentVNode("", true),
				createVNode(_component_HComboboxInput, {
					ref: "comboboxInput",
					value: _ctx.query,
					class: [
						_ctx.ui.input.base,
						_ctx.ui.input.size,
						_ctx.ui.input.height,
						_ctx.ui.input.padding,
						_ctx.icon && _ctx.ui.input.icon.padding,
						_ctx.closeButton && _ctx.ui.input.closeButton.padding
					],
					placeholder: _ctx.placeholder,
					"aria-label": _ctx.placeholder,
					autocomplete: "off",
					onChange: ($event) => _ctx.query = $event.target.value
				}, null, 8, [
					"value",
					"class",
					"placeholder",
					"aria-label",
					"onChange"
				]),
				_ctx.closeButton ? (openBlock(), createBlock(_component_UButton, mergeProps({
					key: 1,
					"aria-label": "Close"
				}, {
					..._ctx.ui.default.closeButton || {},
					..._ctx.closeButton
				}, {
					class: _ctx.ui.input.closeButton.base,
					onClick: _ctx.onClear
				}), null, 16, ["class", "onClick"])) : createCommentVNode("", true)
			], 2), [[vShow, _ctx.searchable]]), _ctx.groups.length ? (openBlock(), createBlock(_component_HComboboxOptions, {
				key: 0,
				static: "",
				hold: "",
				as: "div",
				"aria-label": "Commands",
				class: _ctx.ui.container
			}, {
				default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.groups, (group) => {
					return openBlock(), createBlock(_component_CommandPaletteGroup, {
						key: group.key,
						query: _ctx.query,
						group,
						"group-attribute": _ctx.groupAttribute,
						"command-attribute": _ctx.commandAttribute,
						"selected-icon": _ctx.selectedIcon,
						ui: _ctx.ui
					}, createSlots({ _: 2 }, [renderList(_ctx.$slots, (_, name) => {
						return {
							name,
							fn: withCtx((slotData) => [renderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotData))])
						};
					})]), 1032, [
						"query",
						"group",
						"group-attribute",
						"command-attribute",
						"selected-icon",
						"ui"
					]);
				}), 128))]),
				_: 3
			}, 8, ["class"])) : _ctx.emptyState ? renderSlot(_ctx.$slots, "empty-state", {}, () => [createVNode("div", { class: _ctx.ui.emptyState.wrapper }, [_ctx.emptyState.icon ? (openBlock(), createBlock(_component_UIcon, {
				key: 0,
				name: _ctx.emptyState.icon,
				class: _ctx.ui.emptyState.icon,
				"aria-hidden": "true"
			}, null, 8, ["name", "class"])) : createCommentVNode("", true), createVNode("p", { class: _ctx.query ? _ctx.ui.emptyState.queryLabel : _ctx.ui.emptyState.label }, toDisplayString(_ctx.query ? _ctx.emptyState.queryLabel : _ctx.emptyState.label), 3)], 2)], void 0, 1) : createCommentVNode("", true)];
		}),
		_: 3
	}, _parent));
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/navigation/CommandPalette.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var CommandPalette_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UCommandPalette" });

export { CommandPalette_default as default };
//# sourceMappingURL=CommandPalette-D5Z87_SV.mjs.map
