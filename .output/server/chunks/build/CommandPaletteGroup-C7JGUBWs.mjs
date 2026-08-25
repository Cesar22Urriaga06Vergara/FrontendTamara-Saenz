import { c as __exportAll, _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { t as Avatar_default } from './Avatar-BOI4zec4.mjs';
import { t as Kbd_default } from './Kbd-rjcREfaE.mjs';
import { r as rt } from './combobox-C0tFQX7q.mjs';
import { s } from './keyboard-DE1QlhcY.mjs';
import { resolveComponent, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, renderSlot, openBlock, createBlock, createCommentVNode, Fragment, renderList, defineComponent, computed, useId, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderComponent, ssrRenderSlot, ssrRenderStyle } from 'vue/server-renderer';
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
import './ui.config-2s_B03nh.mjs';
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

//#region node_modules/@nuxt/ui/dist/runtime/components/navigation/CommandPaletteGroup.vue
var CommandPaletteGroup_exports = /* @__PURE__ */ __exportAll({ default: () => CommandPaletteGroup_default });
var _sfc_main = defineComponent({
	components: {
		HComboboxOption: rt,
		UIcon: Icon_default,
		UAvatar: Avatar_default,
		UKbd: Kbd_default
	},
	props: {
		group: {
			type: Object,
			required: true
		},
		query: {
			type: String,
			default: ""
		},
		groupAttribute: {
			type: String,
			required: true
		},
		commandAttribute: {
			type: String,
			required: true
		},
		selectedIcon: {
			type: String,
			required: true
		},
		ui: {
			type: Object,
			required: true
		}
	},
	setup(props) {
		const label = computed(() => {
			const label2 = props.group[props.groupAttribute];
			return typeof label2 === "function" ? label2(props.query) : label2;
		});
		function highlight(text, { indices, value }) {
			if (text === value) return "";
			let content = "";
			let nextUnhighlightedIndiceStartingIndex = 0;
			indices.forEach((indice) => {
				const lastIndiceNextIndex = indice[1] + 1;
				const isMatched = lastIndiceNextIndex - indice[0] >= props.query.length;
				content += [
					value.substring(nextUnhighlightedIndiceStartingIndex, indice[0]),
					isMatched && "<mark>",
					value.substring(indice[0], lastIndiceNextIndex),
					isMatched && "</mark>"
				].filter(Boolean).join("");
				nextUnhighlightedIndiceStartingIndex = lastIndiceNextIndex;
			});
			content += value.substring(nextUnhighlightedIndiceStartingIndex);
			const index = content.indexOf("<mark>");
			if (index > 60) content = `...${content.substring(index - 60)}`;
			return content;
		}
		s(() => useId());
		return {
			label,
			highlight
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_HComboboxOption = resolveComponent("HComboboxOption");
	const _component_UIcon = Icon_default;
	const _component_UAvatar = Avatar_default;
	const _component_UKbd = Kbd_default;
	_push(`<div${ssrRenderAttrs(mergeProps({ class: _ctx.ui.group.wrapper }, _attrs))}>`);
	if (_ctx.label) _push(`<h2 class="${ssrRenderClass(_ctx.ui.group.label)}">${ssrInterpolate(_ctx.label)}</h2>`);
	else _push(`<!---->`);
	_push(`<div class="${ssrRenderClass(_ctx.ui.group.container)}"${ssrRenderAttr("aria-label", _ctx.group[_ctx.groupAttribute])}><!--[-->`);
	ssrRenderList(_ctx.group.commands, (command, index) => {
		_push(ssrRenderComponent(_component_HComboboxOption, {
			key: `${_ctx.group.key}-${index}`,
			value: command,
			disabled: command.disabled,
			as: "template"
		}, {
			default: withCtx(({ active, selected }, _push, _parent, _scopeId) => {
				if (_push) {
					_push(`<div class="${ssrRenderClass([
						_ctx.ui.group.command.base,
						active ? _ctx.ui.group.command.active : _ctx.ui.group.command.inactive,
						command.disabled ? "cursor-not-allowed" : "cursor-pointer"
					])}"${_scopeId}><div class="${ssrRenderClass(_ctx.ui.group.command.container)}"${_scopeId}>`);
					ssrRenderSlot(_ctx.$slots, `${_ctx.group.key}-icon`, {
						group: _ctx.group,
						command,
						active,
						selected
					}, () => {
						if (command.icon) _push(ssrRenderComponent(_component_UIcon, {
							name: command.icon,
							class: [
								_ctx.ui.group.command.icon.base,
								active ? _ctx.ui.group.command.icon.active : _ctx.ui.group.command.icon.inactive,
								command.iconClass
							],
							"aria-hidden": "true"
						}, null, _parent, _scopeId));
						else if (command.avatar) _push(ssrRenderComponent(_component_UAvatar, mergeProps({ ref_for: true }, {
							size: _ctx.ui.group.command.avatar.size,
							...command.avatar
						}, {
							class: _ctx.ui.group.command.avatar.base,
							"aria-hidden": "true"
						}), null, _parent, _scopeId));
						else if (command.chip) _push(`<span class="${ssrRenderClass(_ctx.ui.group.command.chip.base)}" style="${ssrRenderStyle({ background: `#${command.chip}` })}"${_scopeId}></span>`);
						else _push(`<!---->`);
					}, _push, _parent, _scopeId);
					_push(`<div class="${ssrRenderClass([_ctx.ui.group.command.label, command.disabled && _ctx.ui.group.command.disabled])}"${_scopeId}>`);
					ssrRenderSlot(_ctx.$slots, `${_ctx.group.key}-command`, {
						group: _ctx.group,
						command,
						active,
						selected
					}, () => {
						if (command.prefix) _push(`<span class="${ssrRenderClass([command.prefixClass || _ctx.ui.group.command.prefix, "flex-shrink-0"])}"${_scopeId}>${ssrInterpolate(command.prefix)}</span>`);
						else _push(`<!---->`);
						_push(`<span class="${ssrRenderClass([{ "flex-none": command.suffix || command.matches?.length }, "truncate"])}"${_scopeId}>${ssrInterpolate(command[_ctx.commandAttribute])}</span>`);
						if (command.matches?.length) _push(`<span class="${ssrRenderClass([command.suffixClass || _ctx.ui.group.command.suffix, "truncate"])}"${_scopeId}>${_ctx.highlight(command[_ctx.commandAttribute], command.matches[0]) ?? ""}</span>`);
						else if (command.suffix) _push(`<span class="${ssrRenderClass([command.suffixClass || _ctx.ui.group.command.suffix, "truncate"])}"${_scopeId}>${ssrInterpolate(command.suffix)}</span>`);
						else _push(`<!---->`);
					}, _push, _parent, _scopeId);
					_push(`</div></div>`);
					if (selected) _push(ssrRenderComponent(_component_UIcon, {
						name: _ctx.selectedIcon,
						class: _ctx.ui.group.command.selectedIcon.base,
						"aria-hidden": "true"
					}, null, _parent, _scopeId));
					else if (active && (_ctx.group.active || _ctx.$slots[`${_ctx.group.key}-active`])) ssrRenderSlot(_ctx.$slots, `${_ctx.group.key}-active`, {
						group: _ctx.group,
						command,
						active,
						selected
					}, () => {
						if (_ctx.group.active) _push(`<span class="${ssrRenderClass(_ctx.ui.group.active)}"${_scopeId}>${ssrInterpolate(_ctx.group.active)}</span>`);
						else _push(`<!---->`);
					}, _push, _parent, _scopeId);
					else ssrRenderSlot(_ctx.$slots, `${_ctx.group.key}-inactive`, {
						group: _ctx.group,
						command,
						active,
						selected
					}, () => {
						if (command.shortcuts?.length) {
							_push(`<span class="${ssrRenderClass(_ctx.ui.group.command.shortcuts)}"${_scopeId}><!--[-->`);
							ssrRenderList(command.shortcuts, (shortcut) => {
								_push(ssrRenderComponent(_component_UKbd, { key: shortcut }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`${ssrInterpolate(shortcut)}`);
										else return [createTextVNode(toDisplayString(shortcut), 1)];
									}),
									_: 2
								}, _parent, _scopeId));
							});
							_push(`<!--]--></span>`);
						} else if (!command.disabled && _ctx.group.inactive) _push(`<span class="${ssrRenderClass(_ctx.ui.group.inactive)}"${_scopeId}>${ssrInterpolate(_ctx.group.inactive)}</span>`);
						else _push(`<!---->`);
					}, _push, _parent, _scopeId);
					_push(`</div>`);
				} else return [createVNode("div", { class: [
					_ctx.ui.group.command.base,
					active ? _ctx.ui.group.command.active : _ctx.ui.group.command.inactive,
					command.disabled ? "cursor-not-allowed" : "cursor-pointer"
				] }, [createVNode("div", { class: _ctx.ui.group.command.container }, [renderSlot(_ctx.$slots, `${_ctx.group.key}-icon`, {
					group: _ctx.group,
					command,
					active,
					selected
				}, () => [command.icon ? (openBlock(), createBlock(_component_UIcon, {
					key: 0,
					name: command.icon,
					class: [
						_ctx.ui.group.command.icon.base,
						active ? _ctx.ui.group.command.icon.active : _ctx.ui.group.command.icon.inactive,
						command.iconClass
					],
					"aria-hidden": "true"
				}, null, 8, ["name", "class"])) : command.avatar ? (openBlock(), createBlock(_component_UAvatar, mergeProps({
					key: 1,
					ref_for: true
				}, {
					size: _ctx.ui.group.command.avatar.size,
					...command.avatar
				}, {
					class: _ctx.ui.group.command.avatar.base,
					"aria-hidden": "true"
				}), null, 16, ["class"])) : command.chip ? (openBlock(), createBlock("span", {
					key: 2,
					class: _ctx.ui.group.command.chip.base,
					style: { background: `#${command.chip}` }
				}, null, 6)) : createCommentVNode("", true)]), createVNode("div", { class: [_ctx.ui.group.command.label, command.disabled && _ctx.ui.group.command.disabled] }, [renderSlot(_ctx.$slots, `${_ctx.group.key}-command`, {
					group: _ctx.group,
					command,
					active,
					selected
				}, () => [
					command.prefix ? (openBlock(), createBlock("span", {
						key: 0,
						class: ["flex-shrink-0", command.prefixClass || _ctx.ui.group.command.prefix]
					}, toDisplayString(command.prefix), 3)) : createCommentVNode("", true),
					createVNode("span", { class: ["truncate", { "flex-none": command.suffix || command.matches?.length }] }, toDisplayString(command[_ctx.commandAttribute]), 3),
					command.matches?.length ? (openBlock(), createBlock("span", {
						key: 1,
						class: ["truncate", command.suffixClass || _ctx.ui.group.command.suffix],
						innerHTML: _ctx.highlight(command[_ctx.commandAttribute], command.matches[0])
					}, null, 10, ["innerHTML"])) : command.suffix ? (openBlock(), createBlock("span", {
						key: 2,
						class: ["truncate", command.suffixClass || _ctx.ui.group.command.suffix]
					}, toDisplayString(command.suffix), 3)) : createCommentVNode("", true)
				])], 2)], 2), selected ? (openBlock(), createBlock(_component_UIcon, {
					key: 0,
					name: _ctx.selectedIcon,
					class: _ctx.ui.group.command.selectedIcon.base,
					"aria-hidden": "true"
				}, null, 8, ["name", "class"])) : active && (_ctx.group.active || _ctx.$slots[`${_ctx.group.key}-active`]) ? renderSlot(_ctx.$slots, `${_ctx.group.key}-active`, {
					group: _ctx.group,
					command,
					active,
					selected
				}, () => [_ctx.group.active ? (openBlock(), createBlock("span", {
					key: 0,
					class: _ctx.ui.group.active
				}, toDisplayString(_ctx.group.active), 3)) : createCommentVNode("", true)], void 0, 1) : renderSlot(_ctx.$slots, `${_ctx.group.key}-inactive`, {
					group: _ctx.group,
					command,
					active,
					selected
				}, () => [command.shortcuts?.length ? (openBlock(), createBlock("span", {
					key: 0,
					class: _ctx.ui.group.command.shortcuts
				}, [(openBlock(true), createBlock(Fragment, null, renderList(command.shortcuts, (shortcut) => {
					return openBlock(), createBlock(_component_UKbd, { key: shortcut }, {
						default: withCtx(() => [createTextVNode(toDisplayString(shortcut), 1)]),
						_: 2
					}, 1024);
				}), 128))], 2)) : !command.disabled && _ctx.group.inactive ? (openBlock(), createBlock("span", {
					key: 1,
					class: _ctx.ui.group.inactive
				}, toDisplayString(_ctx.group.inactive), 3)) : createCommentVNode("", true)], void 0, 2)], 2)];
			}),
			_: 2
		}, _parent));
	});
	_push(`<!--]--></div></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/navigation/CommandPaletteGroup.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var CommandPaletteGroup_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UCommandPaletteGroup" });

export { CommandPaletteGroup_exports as n, CommandPaletteGroup_default as t };
//# sourceMappingURL=CommandPaletteGroup-C7JGUBWs.mjs.map
