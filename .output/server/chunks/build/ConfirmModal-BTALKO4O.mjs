import { t as Card_default } from './Card-j-DCNf6K.mjs';
import { t as Modal_default } from './Modal-B8wn1zi5.mjs';
import { t as Button_default } from './Button-CoYovqJ9.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';

//#region components/ui/ConfirmModal.vue?vue&type=script&setup=true&lang.ts
var ConfirmModal_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "ConfirmModal",
	__ssrInlineRender: true,
	props: {
		modelValue: { type: Boolean },
		title: {},
		message: {},
		confirmLabel: { default: "Confirmar" },
		cancelLabel: { default: "Cancelar" },
		loading: { type: Boolean },
		color: { default: "red" }
	},
	emits: [
		"update:modelValue",
		"confirm",
		"cancel"
	],
	setup(__props, { emit: __emit }) {
		/** Modal de confirmación reutilizable para acciones destructivas (ej: baja lógica). */
		const emit = __emit;
		function cancelar() {
			emit("cancel");
			emit("update:modelValue", false);
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UModal = Modal_default;
			const _component_UCard = Card_default;
			const _component_UButton = Button_default;
			_push(ssrRenderComponent(_component_UModal, mergeProps({
				"model-value": __props.modelValue,
				"onUpdate:modelValue": ($event) => emit("update:modelValue", $event)
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UCard, null, {
						header: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(__props.title)}</p>`);
							else return [createVNode("p", { class: "font-semibold text-slate-900" }, toDisplayString(__props.title), 1)];
						}),
						footer: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex justify-end gap-2"${_scopeId}>`);
								_push(ssrRenderComponent(_component_UButton, {
									color: "gray",
									variant: "ghost",
									disabled: __props.loading,
									onClick: cancelar
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`${ssrInterpolate(__props.cancelLabel)}`);
										else return [createTextVNode(toDisplayString(__props.cancelLabel), 1)];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UButton, {
									color: __props.color,
									loading: __props.loading,
									onClick: ($event) => emit("confirm")
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`${ssrInterpolate(__props.confirmLabel)}`);
										else return [createTextVNode(toDisplayString(__props.confirmLabel), 1)];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
								color: "gray",
								variant: "ghost",
								disabled: __props.loading,
								onClick: cancelar
							}, {
								default: withCtx(() => [createTextVNode(toDisplayString(__props.cancelLabel), 1)]),
								_: 1
							}, 8, ["disabled"]), createVNode(_component_UButton, {
								color: __props.color,
								loading: __props.loading,
								onClick: ($event) => emit("confirm")
							}, {
								default: withCtx(() => [createTextVNode(toDisplayString(__props.confirmLabel), 1)]),
								_: 1
							}, 8, [
								"color",
								"loading",
								"onClick"
							])])];
						}),
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<p class="text-sm text-slate-600"${_scopeId}>${ssrInterpolate(__props.message)}</p>`);
							else return [createVNode("p", { class: "text-sm text-slate-600" }, toDisplayString(__props.message), 1)];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(_component_UCard, null, {
						header: withCtx(() => [createVNode("p", { class: "font-semibold text-slate-900" }, toDisplayString(__props.title), 1)]),
						footer: withCtx(() => [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
							color: "gray",
							variant: "ghost",
							disabled: __props.loading,
							onClick: cancelar
						}, {
							default: withCtx(() => [createTextVNode(toDisplayString(__props.cancelLabel), 1)]),
							_: 1
						}, 8, ["disabled"]), createVNode(_component_UButton, {
							color: __props.color,
							loading: __props.loading,
							onClick: ($event) => emit("confirm")
						}, {
							default: withCtx(() => [createTextVNode(toDisplayString(__props.confirmLabel), 1)]),
							_: 1
						}, 8, [
							"color",
							"loading",
							"onClick"
						])])]),
						default: withCtx(() => [createVNode("p", { class: "text-sm text-slate-600" }, toDisplayString(__props.message), 1)]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region components/ui/ConfirmModal.vue
var _sfc_setup = ConfirmModal_vue_vue_type_script_setup_true_lang_default.setup;
ConfirmModal_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/ConfirmModal.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var ConfirmModal_default = Object.assign(ConfirmModal_vue_vue_type_script_setup_true_lang_default, { __name: "UiConfirmModal" });

export { ConfirmModal_default as C };
//# sourceMappingURL=ConfirmModal-BTALKO4O.mjs.map
