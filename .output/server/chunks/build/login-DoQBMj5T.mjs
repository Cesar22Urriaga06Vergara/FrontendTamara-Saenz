import { a as useAuthStore, N as NuxtLink, b as useRuntimeConfig } from '../virtual/entry.mjs';
import { u as useMarcaEmpresa } from './useMarcaEmpresa-zrKUsI4h.mjs';
import { t as Alert_default } from './Alert-Bv_RgsgM.mjs';
import { t as FormGroup_default } from './FormGroup-Y-Nkh3aN.mjs';
import { t as Button_default } from './Button-CoYovqJ9.mjs';
import { t as Input_default } from './Input-BVUEIOT9.mjs';
import { defineComponent, ref, reactive, mergeProps, unref, withCtx, isRef, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderComponent } from 'vue/server-renderer';
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
import './Icon-DzlsKOwd.mjs';
import './components-CzgPFaUd.mjs';
import '@iconify/utils/lib/css/icon';
import './ui.config-2s_B03nh.mjs';
import './Avatar-BOI4zec4.mjs';
import './link-apSRv82-.mjs';
import './useButtonGroup-OQHG41CY.mjs';
import './button-BNOdwSP_.mjs';
import './Link-CnaKOPmE.mjs';
import './useFormGroup-BLFts8mq.mjs';

//#region pages/login.vue?vue&type=script&setup=true&lang.ts
var login_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "login",
	__ssrInlineRender: true,
	setup(__props) {
		useAuthStore();
		const config = useRuntimeConfig();
		const marca = useMarcaEmpresa();
		const email = ref("");
		const password = ref("");
		const mostrarPassword = ref(false);
		const cargando = ref(false);
		const error = ref("");
		const erroresCampo = reactive({
			email: "",
			password: ""
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UFormGroup = FormGroup_default;
			const _component_UInput = Input_default;
			const _component_UButton = Button_default;
			const _component_UAlert = Alert_default;
			const _component_NuxtLink = NuxtLink;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex" }, _attrs))}><div class="hidden lg:flex w-1/2 bg-[#1A1A1A] text-white flex-col justify-between p-12 relative overflow-hidden"><div class="absolute inset-0 opacity-10 bg-gradient-to-br from-[#CFA052] to-transparent"></div><div class="relative z-10"><p class="text-2xl font-bold tracking-tight">${ssrInterpolate(unref(config).public.appName)}</p></div><div class="relative z-10"><p class="text-4xl font-serif italic text-[#CFA052] leading-tight"> &quot;${ssrInterpolate(unref(config).public.appSlogan)}&quot; </p><p class="mt-4 text-[#9AA0A8] text-sm max-w-sm"> Control centralizado de recaudo, contratos y novedades operativas de todo el portafolio inmobiliario. </p></div><p class="relative z-10 text-xs text-[#6B6F75]">© ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} — Todos los derechos reservados.</p></div><div class="flex-1 flex items-center justify-center bg-slate-50 p-8"><div class="w-full max-w-sm"><img${ssrRenderAttr("src", unref(marca).logoSrc.value || "/Logo.png")} alt="Inversiones Tamara &amp; Saenz" class="h-20 w-auto mx-auto mb-8"><h2 class="text-2xl font-semibold text-slate-900 mb-1 text-center">Iniciar sesión</h2><p class="text-sm text-slate-600 mb-6 text-center">Ingresa tus credenciales para continuar.</p><form class="space-y-4" novalidate>`);
			_push(ssrRenderComponent(_component_UFormGroup, {
				label: "Correo electrónico",
				error: unref(erroresCampo).email
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UInput, {
						modelValue: unref(email),
						"onUpdate:modelValue": [($event) => isRef(email) ? email.value = $event : null, ($event) => unref(erroresCampo).email = ""],
						type: "email",
						placeholder: "usuario@tamarasaenz.com",
						icon: "i-heroicons-envelope"
					}, null, _parent, _scopeId));
					else return [createVNode(_component_UInput, {
						modelValue: unref(email),
						"onUpdate:modelValue": [($event) => isRef(email) ? email.value = $event : null, ($event) => unref(erroresCampo).email = ""],
						type: "email",
						placeholder: "usuario@tamarasaenz.com",
						icon: "i-heroicons-envelope"
					}, null, 8, ["modelValue", "onUpdate:modelValue"])];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UFormGroup, {
				label: "Contraseña",
				error: unref(erroresCampo).password
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UInput, {
						modelValue: unref(password),
						"onUpdate:modelValue": [($event) => isRef(password) ? password.value = $event : null, ($event) => unref(erroresCampo).password = ""],
						type: unref(mostrarPassword) ? "text" : "password",
						placeholder: "••••••••",
						icon: "i-heroicons-lock-closed"
					}, {
						trailing: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(ssrRenderComponent(_component_UButton, {
								icon: unref(mostrarPassword) ? "i-heroicons-eye-slash" : "i-heroicons-eye",
								color: "gray",
								variant: "link",
								padded: false,
								class: "pointer-events-auto",
								"aria-label": unref(mostrarPassword) ? "Ocultar contraseña" : "Mostrar contraseña",
								onClick: ($event) => mostrarPassword.value = !unref(mostrarPassword)
							}, null, _parent, _scopeId));
							else return [createVNode(_component_UButton, {
								icon: unref(mostrarPassword) ? "i-heroicons-eye-slash" : "i-heroicons-eye",
								color: "gray",
								variant: "link",
								padded: false,
								class: "pointer-events-auto",
								"aria-label": unref(mostrarPassword) ? "Ocultar contraseña" : "Mostrar contraseña",
								onClick: ($event) => mostrarPassword.value = !unref(mostrarPassword)
							}, null, 8, [
								"icon",
								"aria-label",
								"onClick"
							])];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(_component_UInput, {
						modelValue: unref(password),
						"onUpdate:modelValue": [($event) => isRef(password) ? password.value = $event : null, ($event) => unref(erroresCampo).password = ""],
						type: unref(mostrarPassword) ? "text" : "password",
						placeholder: "••••••••",
						icon: "i-heroicons-lock-closed"
					}, {
						trailing: withCtx(() => [createVNode(_component_UButton, {
							icon: unref(mostrarPassword) ? "i-heroicons-eye-slash" : "i-heroicons-eye",
							color: "gray",
							variant: "link",
							padded: false,
							class: "pointer-events-auto",
							"aria-label": unref(mostrarPassword) ? "Ocultar contraseña" : "Mostrar contraseña",
							onClick: ($event) => mostrarPassword.value = !unref(mostrarPassword)
						}, null, 8, [
							"icon",
							"aria-label",
							"onClick"
						])]),
						_: 1
					}, 8, [
						"modelValue",
						"onUpdate:modelValue",
						"type"
					])];
				}),
				_: 1
			}, _parent));
			if (unref(error)) _push(ssrRenderComponent(_component_UAlert, {
				color: "red",
				variant: "subtle",
				title: unref(error),
				icon: "i-heroicons-exclamation-triangle"
			}, null, _parent));
			else _push(`<!---->`);
			_push(ssrRenderComponent(_component_UButton, {
				type: "submit",
				block: "",
				size: "lg",
				loading: unref(cargando),
				class: "!bg-[#CFA052] hover:!bg-[#B98D42] !text-[#1A1A1A] font-semibold focus-visible:!ring-[#CFA052]"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Ingresar `);
					else return [createTextVNode(" Ingresar ")];
				}),
				_: 1
			}, _parent));
			_push(`<p class="text-center text-sm text-slate-500"> ¿Primera vez que usas el sistema? `);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/registro",
				class: "font-medium text-[#B98D42] hover:underline"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Crear cuenta de Administrador`);
					else return [createTextVNode("Crear cuenta de Administrador")];
				}),
				_: 1
			}, _parent));
			_push(`</p></form></div></div></div>`);
		};
	}
});
//#endregion
//#region pages/login.vue
var _sfc_setup = login_vue_vue_type_script_setup_true_lang_default.setup;
login_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var login_default = login_vue_vue_type_script_setup_true_lang_default;

export { login_default as default };
//# sourceMappingURL=login-DoQBMj5T.mjs.map
