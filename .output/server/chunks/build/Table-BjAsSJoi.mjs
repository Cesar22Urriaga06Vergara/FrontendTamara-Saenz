import { c as __exportAll, _ as _plugin_vue_export_helper_default, g as get, m as mergeConfig, v as virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default } from '../virtual/entry.mjs';
import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { u as useUI } from './ui.config-2s_B03nh.mjs';
import { t as Progress_default } from './Progress-DTxdHI_T.mjs';
import { t as Checkbox_default } from './Checkbox-IBRiz-C1.mjs';
import { t as Button_default } from './Button-CoYovqJ9.mjs';
import { mergeProps, defineComponent, toRef, computed, toRaw, useSSRContext } from 'vue';
import { H as upperFirst, n as defu, F as isEqual } from '../_/nitro.mjs';
import { useVModel } from '@vueuse/core';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderSlot, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderComponent } from 'vue/server-renderer';
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
import 'tailwind-merge';
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
import './useFormGroup-BLFts8mq.mjs';
import './link-apSRv82-.mjs';
import './useButtonGroup-OQHG41CY.mjs';
import './button-BNOdwSP_.mjs';
import './Link-CnaKOPmE.mjs';

//#region node_modules/@nuxt/ui/dist/runtime/ui.config/data/table.js
var table_default = {
	wrapper: "relative overflow-x-auto",
	base: "min-w-full table-fixed",
	divide: "divide-y divide-gray-300 dark:divide-gray-700",
	thead: "relative",
	tbody: "divide-y divide-gray-200 dark:divide-gray-800",
	caption: "sr-only",
	tr: {
		base: "",
		selected: "bg-gray-50 dark:bg-gray-800/50",
		expanded: "bg-gray-50 dark:bg-gray-800/50",
		active: "hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
	},
	th: {
		base: "text-left rtl:text-right",
		padding: "px-4 py-3.5",
		color: "text-gray-900 dark:text-white",
		font: "font-semibold",
		size: "text-sm"
	},
	td: {
		base: "whitespace-nowrap",
		padding: "px-4 py-4",
		color: "text-gray-500 dark:text-gray-400",
		font: "",
		size: "text-sm"
	},
	checkbox: { padding: "ps-4" },
	loadingState: {
		wrapper: "flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14",
		label: "text-sm text-center text-gray-900 dark:text-white",
		icon: "w-6 h-6 mx-auto text-gray-400 dark:text-gray-500 mb-4 animate-spin"
	},
	emptyState: {
		wrapper: "flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14",
		label: "text-sm text-center text-gray-900 dark:text-white",
		icon: "w-6 h-6 mx-auto text-gray-400 dark:text-gray-500 mb-4"
	},
	expand: { icon: "transform transition-transform duration-200" },
	progress: { wrapper: "absolute inset-x-0 -bottom-[0.5px] p-0" },
	default: {
		sortAscIcon: "i-heroicons-bars-arrow-up-20-solid",
		sortDescIcon: "i-heroicons-bars-arrow-down-20-solid",
		sortButton: {
			icon: "i-heroicons-arrows-up-down-20-solid",
			trailing: true,
			square: true,
			color: "gray",
			variant: "ghost",
			class: "-m-1.5"
		},
		expandButton: {
			icon: "i-heroicons-chevron-down",
			color: "gray",
			variant: "ghost",
			size: "xs",
			class: "-my-1.5 align-middle"
		},
		checkbox: { color: "primary" },
		progress: {
			color: "primary",
			animation: "carousel"
		},
		loadingState: {
			icon: "i-heroicons-arrow-path-20-solid",
			label: "Loading..."
		},
		emptyState: {
			icon: "i-heroicons-circle-stack-20-solid",
			label: "No items."
		}
	}
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/data/Table.vue
var Table_exports = /* @__PURE__ */ __exportAll({ default: () => Table_default });
var config = mergeConfig(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.strategy, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fapp_config_default.ui.table, table_default);
function defaultComparator(a, z) {
	return isEqual(a, z);
}
function defaultSort(a, b, direction) {
	if (a === b) return 0;
	if (direction === "asc") return a < b ? -1 : 1;
	else return a > b ? -1 : 1;
}
function getStringifiedSet(arr) {
	return new Set(arr.map((item) => JSON.stringify(item)));
}
function accessor(key) {
	return (obj) => get(obj, key);
}
var _sfc_main = defineComponent({
	components: {
		UIcon: Icon_default,
		UButton: Button_default,
		UProgress: Progress_default,
		UCheckbox: Checkbox_default
	},
	inheritAttrs: false,
	props: {
		modelValue: {
			type: Array,
			default: null
		},
		by: {
			type: [String, Function],
			default: () => defaultComparator
		},
		rows: {
			type: Array,
			default: () => []
		},
		columns: {
			type: Array,
			default: null
		},
		columnAttribute: {
			type: String,
			default: "label"
		},
		sort: {
			type: Object,
			default: () => ({})
		},
		sortMode: {
			type: String,
			default: "auto"
		},
		sortButton: {
			type: Object,
			default: () => config.default.sortButton
		},
		sortAscIcon: {
			type: String,
			default: () => config.default.sortAscIcon
		},
		sortDescIcon: {
			type: String,
			default: () => config.default.sortDescIcon
		},
		expandButton: {
			type: Object,
			default: () => config.default.expandButton
		},
		expand: {
			type: Object,
			default: () => null
		},
		loading: {
			type: Boolean,
			default: false
		},
		loadingState: {
			type: Object,
			default: () => config.default.loadingState
		},
		emptyState: {
			type: Object,
			default: () => config.default.emptyState
		},
		caption: {
			type: String,
			default: null
		},
		progress: {
			type: Object,
			default: () => config.default.progress
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
		multipleExpand: {
			type: Boolean,
			default: true
		},
		singleSelect: {
			type: Boolean,
			default: false
		}
	},
	emits: [
		"update:modelValue",
		"update:sort",
		"update:expand",
		"select:all"
	],
	setup(props, { emit, attrs: $attrs }) {
		const { ui, attrs } = useUI("table", toRef(props, "ui"), config, toRef(props, "class"));
		const columns = computed(() => {
			const defaultColumns = props.columns ?? Object.keys(props.rows[0]).map((key) => ({
				key,
				label: upperFirst(key),
				sortable: false,
				class: void 0,
				sort: defaultSort
			}));
			if (defaultColumns.find((v) => v.key === "select") || !props.modelValue) return defaultColumns;
			return [{
				key: "select",
				sortable: false,
				class: void 0,
				sort: defaultSort
			}, ...defaultColumns];
		});
		const sort = useVModel(props, "sort", emit, {
			passive: true,
			defaultValue: defu({}, props.sort, {
				column: null,
				direction: "asc"
			})
		});
		const expand = useVModel(props, "expand", emit, {
			passive: true,
			defaultValue: defu({}, props.expand, {
				openedRows: [],
				row: null
			})
		});
		const savedSort = {
			column: sort.value.column,
			direction: null
		};
		const rows = computed(() => {
			if (!sort.value?.column || props.sortMode === "manual") return props.rows;
			const { column, direction } = sort.value;
			return props.rows.slice().sort((a, b) => {
				const aValue = get(a, column);
				const bValue = get(b, column);
				return (columns.value.find((col) => col.key === column)?.sort ?? defaultSort)(aValue, bValue, direction);
			});
		});
		const selected = computed({
			get() {
				return props.modelValue;
			},
			set(value) {
				emit("update:modelValue", value);
			}
		});
		const totalRows = computed(() => props.rows.length);
		const countCheckedRow = computed(() => {
			const selectedData = getStringifiedSet(selected.value);
			const rowsData = getStringifiedSet(props.rows);
			return Array.from(selectedData).filter((item) => rowsData.has(item)).length;
		});
		const indeterminate = computed(() => {
			if (!selected.value || !props.rows) return false;
			return countCheckedRow.value > 0 && countCheckedRow.value < totalRows.value;
		});
		const isAllRowChecked = computed(() => countCheckedRow.value === totalRows.value);
		const emptyState = computed(() => {
			if (props.emptyState === null) return null;
			return {
				...ui.value.default.emptyState,
				...props.emptyState
			};
		});
		const loadingState = computed(() => {
			if (props.loadingState === null) return null;
			return {
				...ui.value.default.loadingState,
				...props.loadingState
			};
		});
		function compare(a, z) {
			if (typeof props.by === "string") {
				const accesorFn = accessor(props.by);
				return accesorFn(a) === accesorFn(z);
			}
			return props.by(a, z);
		}
		function isSelected(row) {
			if (!props.modelValue) return false;
			return selected.value.some((item) => compare(toRaw(item), toRaw(row)));
		}
		function onSort(column) {
			if (sort.value.column === column.key) {
				const direction = !column.direction || column.direction === "asc" ? "desc" : "asc";
				if (sort.value.direction === direction) sort.value = defu({}, savedSort, {
					column: null,
					direction: "asc"
				});
				else sort.value = {
					column: sort.value.column,
					direction: sort.value.direction === "asc" ? "desc" : "asc"
				};
			} else sort.value = {
				column: column.key,
				direction: column.direction || "asc"
			};
		}
		function onSelect(row) {
			const selection = (void 0).getSelection();
			if (selection && selection.toString().length > 0) return;
			if (!$attrs.onSelect) return;
			$attrs.onSelect(row);
		}
		function onContextmenu(event, row) {
			if (!$attrs.onContextmenu) return;
			$attrs.onContextmenu(event, row);
		}
		function selectAllRows() {
			const newSelected = [...selected.value];
			props.rows.forEach((row) => {
				if (!isSelected(row)) newSelected.push(row);
			});
			selected.value = newSelected;
		}
		function onChange(checked) {
			if (checked) selectAllRows();
			else selected.value = [];
			emit("select:all", checked);
		}
		function onChangeCheckbox(checked, row) {
			if (checked) selected.value = props.singleSelect ? [row] : [...selected.value, row];
			else selected.value = selected.value.filter((value) => !compare(toRaw(value), toRaw(row)));
		}
		function getRowData(row, rowKey, defaultValue = "") {
			return get(row, rowKey, defaultValue);
		}
		function isExpanded(row) {
			return expand.value?.openedRows ? expand.value.openedRows.some((openedRow) => compare(openedRow, row)) : false;
		}
		function toggleOpened(row) {
			expand.value = {
				openedRows: isExpanded(row) ? expand.value.openedRows.filter((v) => !compare(v, row)) : props.multipleExpand ? [...expand.value.openedRows, row] : [row],
				row
			};
		}
		function getAriaSort(column) {
			if (!column.sortable) return;
			if (sort.value.column !== column.key) return "none";
			if (sort.value.direction === "asc") return "ascending";
			if (sort.value.direction === "desc") return "descending";
		}
		return {
			ui,
			attrs,
			sort,
			columns,
			rows,
			selected,
			indeterminate,
			emptyState,
			loadingState,
			isAllRowChecked,
			onChangeCheckbox,
			isSelected,
			onSort,
			onSelect,
			onContextmenu,
			onChange,
			getRowData,
			toggleOpened,
			getAriaSort,
			isExpanded
		};
	}
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_UCheckbox = Checkbox_default;
	const _component_UButton = Button_default;
	const _component_UProgress = Progress_default;
	const _component_UIcon = Icon_default;
	_push(`<div${ssrRenderAttrs(mergeProps({ class: _ctx.ui.wrapper }, _ctx.attrs, _attrs))}><table class="${ssrRenderClass([_ctx.ui.base, _ctx.ui.divide])}">`);
	if (_ctx.$slots.caption || _ctx.caption) ssrRenderSlot(_ctx.$slots, "caption", {}, () => {
		_push(`<caption class="${ssrRenderClass(_ctx.ui.caption)}">${ssrInterpolate(_ctx.caption)}</caption>`);
	}, _push, _parent);
	else _push(`<!---->`);
	_push(`<thead class="${ssrRenderClass(_ctx.ui.thead)}"><tr class="${ssrRenderClass(_ctx.ui.tr.base)}">`);
	if (_ctx.expand) _push(`<th scope="col" class="${ssrRenderClass(_ctx.ui.tr.base)}"><span class="sr-only">Expand</span></th>`);
	else _push(`<!---->`);
	_push(`<!--[-->`);
	ssrRenderList(_ctx.columns, (column, index) => {
		_push(`<th scope="col" class="${ssrRenderClass([
			_ctx.ui.th.base,
			_ctx.ui.th.padding,
			_ctx.ui.th.color,
			_ctx.ui.th.font,
			_ctx.ui.th.size,
			column.key === "select" && _ctx.ui.checkbox.padding,
			column.class
		])}"${ssrRenderAttr("aria-sort", _ctx.getAriaSort(column))}>`);
		if (!_ctx.singleSelect && _ctx.modelValue && column.key === "select") ssrRenderSlot(_ctx.$slots, "select-header", {
			indeterminate: _ctx.indeterminate,
			checked: _ctx.isAllRowChecked,
			change: _ctx.onChange
		}, () => {
			_push(ssrRenderComponent(_component_UCheckbox, mergeProps({
				"model-value": _ctx.isAllRowChecked,
				indeterminate: _ctx.indeterminate
			}, { ref_for: true }, _ctx.ui.default.checkbox, {
				"aria-label": "Select all",
				onChange: _ctx.onChange
			}), null, _parent));
		}, _push, _parent);
		else ssrRenderSlot(_ctx.$slots, `${column.key}-header`, {
			column,
			sort: _ctx.sort,
			onSort: _ctx.onSort
		}, () => {
			if (column.sortable) _push(ssrRenderComponent(_component_UButton, mergeProps({ ref_for: true }, {
				..._ctx.ui.default.sortButton || {},
				..._ctx.sortButton
			}, {
				icon: !_ctx.sort.column || _ctx.sort.column !== column.key ? _ctx.sortButton.icon || _ctx.ui.default.sortButton.icon : _ctx.sort.direction === "asc" ? _ctx.sortAscIcon : _ctx.sortDescIcon,
				label: column[_ctx.columnAttribute],
				onClick: ($event) => _ctx.onSort(column)
			}), null, _parent));
			else _push(`<span>${ssrInterpolate(column[_ctx.columnAttribute])}</span>`);
		}, _push, _parent);
		_push(`</th>`);
	});
	_push(`<!--]--></tr>`);
	if (_ctx.loading && _ctx.progress) {
		_push(`<tr><td${ssrRenderAttr("colspan", 0)} class="${ssrRenderClass(_ctx.ui.progress.wrapper)}">`);
		_push(ssrRenderComponent(_component_UProgress, mergeProps({
			..._ctx.ui.default.progress || {},
			..._ctx.progress
		}, { size: "2xs" }), null, _parent));
		_push(`</td></tr>`);
	} else _push(`<!---->`);
	_push(`</thead><tbody class="${ssrRenderClass(_ctx.ui.tbody)}">`);
	if (_ctx.loadingState && _ctx.loading && !_ctx.rows.length) {
		_push(`<tr><td${ssrRenderAttr("colspan", _ctx.columns.length + (_ctx.modelValue ? 1 : 0) + (_ctx.expand ? 1 : 0))}>`);
		ssrRenderSlot(_ctx.$slots, "loading-state", {}, () => {
			_push(`<div class="${ssrRenderClass(_ctx.ui.loadingState.wrapper)}">`);
			if (_ctx.loadingState.icon) _push(ssrRenderComponent(_component_UIcon, {
				name: _ctx.loadingState.icon,
				class: _ctx.ui.loadingState.icon,
				"aria-hidden": "true"
			}, null, _parent));
			else _push(`<!---->`);
			_push(`<p class="${ssrRenderClass(_ctx.ui.loadingState.label)}">${ssrInterpolate(_ctx.loadingState.label)}</p></div>`);
		}, _push, _parent);
		_push(`</td></tr>`);
	} else if (_ctx.emptyState && !_ctx.rows.length) {
		_push(`<tr><td${ssrRenderAttr("colspan", _ctx.columns.length + (_ctx.modelValue ? 1 : 0) + (_ctx.expand ? 1 : 0))}>`);
		ssrRenderSlot(_ctx.$slots, "empty-state", {}, () => {
			_push(`<div class="${ssrRenderClass(_ctx.ui.emptyState.wrapper)}">`);
			if (_ctx.emptyState.icon) _push(ssrRenderComponent(_component_UIcon, {
				name: _ctx.emptyState.icon,
				class: _ctx.ui.emptyState.icon,
				"aria-hidden": "true"
			}, null, _parent));
			else _push(`<!---->`);
			_push(`<p class="${ssrRenderClass(_ctx.ui.emptyState.label)}">${ssrInterpolate(_ctx.emptyState.label)}</p></div>`);
		}, _push, _parent);
		_push(`</td></tr>`);
	} else {
		_push(`<!--[-->`);
		ssrRenderList(_ctx.rows, (row, index) => {
			_push(`<!--[--><tr class="${ssrRenderClass([
				_ctx.ui.tr.base,
				_ctx.isSelected(row) && _ctx.ui.tr.selected,
				_ctx.isExpanded(row) && _ctx.ui.tr.expanded,
				_ctx.$attrs.onSelect && _ctx.ui.tr.active,
				row?.class
			])}">`);
			if (_ctx.expand) {
				_push(`<td class="${ssrRenderClass([
					_ctx.ui.td.base,
					_ctx.ui.td.padding,
					_ctx.ui.td.color,
					_ctx.ui.td.font,
					_ctx.ui.td.size
				])}">`);
				if (_ctx.$slots["expand-action"]) ssrRenderSlot(_ctx.$slots, "expand-action", {
					row,
					isExpanded: _ctx.isExpanded(row),
					toggle: () => _ctx.toggleOpened(row)
				}, null, _push, _parent);
				else _push(ssrRenderComponent(_component_UButton, mergeProps({ disabled: row.disabledExpand }, { ref_for: true }, {
					..._ctx.ui.default.expandButton || {},
					..._ctx.expandButton
				}, {
					ui: { icon: { base: [_ctx.ui.expand.icon, _ctx.isExpanded(row) && "rotate-180"].join(" ") } },
					onClick: ($event) => _ctx.toggleOpened(row)
				}), null, _parent));
				_push(`</td>`);
			} else _push(`<!---->`);
			_push(`<!--[-->`);
			ssrRenderList(_ctx.columns, (column, subIndex) => {
				_push(`<td class="${ssrRenderClass([
					_ctx.ui.td.base,
					_ctx.ui.td.padding,
					_ctx.ui.td.color,
					_ctx.ui.td.font,
					_ctx.ui.td.size,
					column?.rowClass,
					row[column.key]?.class,
					column.key === "select" && _ctx.ui.checkbox.padding
				])}">`);
				if (_ctx.modelValue && column.key === "select") {
					_push(`<span>`);
					ssrRenderSlot(_ctx.$slots, "select-data", {
						checked: _ctx.isSelected(row),
						change: (ev) => _ctx.onChangeCheckbox(ev, row)
					}, () => {
						_push(ssrRenderComponent(_component_UCheckbox, mergeProps({ "model-value": _ctx.isSelected(row) }, { ref_for: true }, _ctx.ui.default.checkbox, {
							"aria-label": "Select row",
							onChange: ($event) => _ctx.onChangeCheckbox($event, row)
						}), null, _parent));
					}, _push, _parent);
					_push(`</span>`);
				} else ssrRenderSlot(_ctx.$slots, `${column.key}-data`, {
					column,
					row,
					index,
					getRowData: (defaultValue) => _ctx.getRowData(row, column.key, defaultValue)
				}, () => {
					_push(`${ssrInterpolate(_ctx.getRowData(row, column.key))}`);
				}, _push, _parent);
				_push(`</td>`);
			});
			_push(`<!--]--></tr>`);
			if (_ctx.isExpanded(row)) {
				_push(`<tr><td colspan="100%">`);
				ssrRenderSlot(_ctx.$slots, "expand", {
					row,
					index
				}, null, _push, _parent);
				_push(`</td></tr>`);
			} else _push(`<!---->`);
			_push(`<!--]-->`);
		});
		_push(`<!--]-->`);
	}
	_push(`</tbody></table></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/data/Table.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Table_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "UTable" });

export { Table_exports as n, Table_default as t };
//# sourceMappingURL=Table-BjAsSJoi.mjs.map
