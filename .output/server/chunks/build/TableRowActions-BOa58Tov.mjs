import { t as Button_default } from './Button-CoYovqJ9.mjs';
import { t as Dropdown_default } from './Dropdown-BjJ7vUzi.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';

//#region components/ui/TableRowActions.vue?vue&type=script&setup=true&lang.ts
var TableRowActions_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "TableRowActions",
	__ssrInlineRender: true,
	props: {
		activo: { type: Boolean },
		editLabel: { default: "Editar" },
		bajaLabel: { default: "Dar de baja" },
		reactivarLabel: { default: "Reactivar" },
		disabled: { type: Boolean }
	},
	emits: [
		"editar",
		"baja",
		"reactivar"
	],
	setup(__props, { emit: __emit }) {
		/** Menú de acciones por fila de tabla: Editar + Dar de baja/Reactivar según `activo`. */
		const props = __props;
		const emit = __emit;
		const items = computed(() => [[{
			label: props.editLabel,
			icon: "i-heroicons-pencil-square",
			click: () => emit("editar")
		}], props.activo ? [{
			label: props.bajaLabel,
			icon: "i-heroicons-trash",
			click: () => emit("baja")
		}] : [{
			label: props.reactivarLabel,
			icon: "i-heroicons-arrow-path",
			click: () => emit("reactivar")
		}]]);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UDropdown = Dropdown_default;
			const _component_UButton = Button_default;
			_push(ssrRenderComponent(_component_UDropdown, mergeProps({
				items: unref(items),
				disabled: __props.disabled
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UButton, {
						icon: "i-heroicons-ellipsis-horizontal",
						color: "gray",
						variant: "ghost",
						size: "sm",
						disabled: __props.disabled
					}, null, _parent, _scopeId));
					else return [createVNode(_component_UButton, {
						icon: "i-heroicons-ellipsis-horizontal",
						color: "gray",
						variant: "ghost",
						size: "sm",
						disabled: __props.disabled
					}, null, 8, ["disabled"])];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region components/ui/TableRowActions.vue
var _sfc_setup = TableRowActions_vue_vue_type_script_setup_true_lang_default.setup;
TableRowActions_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/TableRowActions.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var TableRowActions_default = Object.assign(TableRowActions_vue_vue_type_script_setup_true_lang_default, { __name: "UiTableRowActions" });

export { TableRowActions_default as T };
//# sourceMappingURL=TableRowActions-BOa58Tov.mjs.map
