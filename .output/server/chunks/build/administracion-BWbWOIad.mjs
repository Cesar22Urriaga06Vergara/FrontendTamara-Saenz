import { t as Icon_default } from './Icon-DzlsKOwd.mjs';
import { t as Table_default } from './Table-BjAsSJoi.mjs';
import { t as Badge_default } from './Badge-Dji78drx.mjs';
import { t as Alert_default } from './Alert-Bv_RgsgM.mjs';
import { t as FormGroup_default } from './FormGroup-Y-Nkh3aN.mjs';
import { t as Card_default } from './Card-j-DCNf6K.mjs';
import { t as Pagination_default } from './Pagination-CVW3oGYj.mjs';
import { t as Modal_default } from './Modal-B8wn1zi5.mjs';
import { t as Button_default } from './Button-CoYovqJ9.mjs';
import { t as SelectMenu_default } from './SelectMenu-Bw_jkCZn.mjs';
import { t as Input_default } from './Input-BVUEIOT9.mjs';
import { C as ConfirmModal_default } from './ConfirmModal-BTALKO4O.mjs';
import { u as useApiFetch } from './useApiFetch-B8kTc45P.mjs';
import { defineComponent, ref, reactive, watch, mergeProps, withCtx, createTextVNode, unref, createVNode, toDisplayString, isRef, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import '../virtual/entry.mjs';
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
import './Progress-DTxdHI_T.mjs';
import './Checkbox-IBRiz-C1.mjs';
import './useFormGroup-BLFts8mq.mjs';
import './useButtonGroup-OQHG41CY.mjs';
import './Avatar-BOI4zec4.mjs';
import './button-BNOdwSP_.mjs';
import './keyboard-DE1QlhcY.mjs';
import './transition-e-5g9u5m.mjs';
import './micro-task-Dv1257jF.mjs';
import './active-element-history-BkxR87qo.mjs';
import './focus-management-DXpqooZk.mjs';
import './use-outside-click-E0zCHGRJ.mjs';
import './hidden-UkYquSML.mjs';
import './open-closed-Css0b1VQ.mjs';
import './portal-BOf15iST.mjs';
import './description-xz0pTumQ.mjs';
import './link-apSRv82-.mjs';
import './Link-CnaKOPmE.mjs';
import './form-BjTHmaPY.mjs';
import './combobox-C0tFQX7q.mjs';
import './use-resolve-button-type-DZKnDGM_.mjs';
import './calculate-active-index-CJA4E3gh.mjs';
import '@tanstack/vue-virtual';
import './use-text-value-DhHPSnE-.mjs';
import './usePopper-BCEqNZ_Z.mjs';

//#region pages/administracion/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* Panel de Administración — EXCLUSIVO Administrador (protegido por middleware global).
		* Gestión de Usuarios (RBAC). Los parámetros globales de Empresa (mora, horizonte de
		* canon, datos corporativos, logo) se editan únicamente desde /configuracion — antes
		* se duplicaban aquí, generando dos pantallas para el mismo recurso (H9).
		*/
		const usuarios = ref([]);
		const cargandoUsuarios = ref(true);
		const paginaUsuarios = ref(1);
		const limiteUsuarios = ref(10);
		const totalUsuarios = ref(0);
		const columnasUsuarios = [
			{
				key: "nombreCompleto",
				label: "Nombre"
			},
			{
				key: "email",
				label: "Correo"
			},
			{
				key: "rol",
				label: "Rol"
			},
			{
				key: "activo",
				label: "Estado"
			},
			{
				key: "acciones",
				label: ""
			}
		];
		const errorUsuarios = ref("");
		const modalUsuarioAbierto = ref(false);
		const nuevoUsuario = reactive({
			nombreCompleto: "",
			email: "",
			password: "",
			rol: "RECEPCIONISTA"
		});
		const creandoUsuario = ref(false);
		async function cargarUsuarios() {
			cargandoUsuarios.value = true;
			try {
				const data = await useApiFetch("/usuarios", { params: {
					page: paginaUsuarios.value,
					limit: limiteUsuarios.value
				} });
				usuarios.value = data.data;
				totalUsuarios.value = data.total;
				errorUsuarios.value = "";
			} catch (e) {
				errorUsuarios.value = e?.data?.message || "No fue posible cargar los usuarios.";
			} finally {
				cargandoUsuarios.value = false;
			}
		}
		watch(paginaUsuarios, cargarUsuarios);
		async function crearUsuario() {
			errorUsuarios.value = "";
			creandoUsuario.value = true;
			try {
				await useApiFetch("/usuarios", {
					method: "POST",
					body: nuevoUsuario
				});
				modalUsuarioAbierto.value = false;
				Object.assign(nuevoUsuario, {
					nombreCompleto: "",
					email: "",
					password: "",
					rol: "RECEPCIONISTA"
				});
				await cargarUsuarios();
			} catch (e) {
				errorUsuarios.value = e?.data?.message || "No fue posible crear el usuario.";
			} finally {
				creandoUsuario.value = false;
			}
		}
		const modalDesactivarAbierto = ref(false);
		const usuarioParaDesactivar = ref(null);
		const desactivando = ref(false);
		function alternarActivo(usuario) {
			errorUsuarios.value = "";
			if (usuario.activo) {
				usuarioParaDesactivar.value = usuario;
				modalDesactivarAbierto.value = true;
				return;
			}
			activarUsuario(usuario);
		}
		async function activarUsuario(usuario) {
			errorUsuarios.value = "";
			try {
				await useApiFetch(`/usuarios/${usuario.id}`, {
					method: "PATCH",
					body: { activo: true }
				});
				await cargarUsuarios();
			} catch (e) {
				errorUsuarios.value = e?.data?.message || "No fue posible activar el usuario.";
			}
		}
		async function confirmarDesactivar() {
			if (!usuarioParaDesactivar.value) return;
			errorUsuarios.value = "";
			desactivando.value = true;
			try {
				await useApiFetch(`/usuarios/${usuarioParaDesactivar.value.id}`, {
					method: "PATCH",
					body: { activo: false }
				});
				modalDesactivarAbierto.value = false;
				await cargarUsuarios();
			} catch (e) {
				errorUsuarios.value = e?.data?.message || "No fue posible desactivar el usuario.";
			} finally {
				desactivando.value = false;
			}
		}
		const modalPasswordAbierto = ref(false);
		const usuarioParaPassword = ref(null);
		const nuevaPassword = ref("");
		const restableciendoPassword = ref(false);
		function abrirResetPassword(usuario) {
			errorUsuarios.value = "";
			usuarioParaPassword.value = usuario;
			nuevaPassword.value = "";
			modalPasswordAbierto.value = true;
		}
		async function confirmarResetPassword() {
			if (!usuarioParaPassword.value || nuevaPassword.value.length < 8) return;
			restableciendoPassword.value = true;
			try {
				await useApiFetch(`/usuarios/${usuarioParaPassword.value.id}/password`, {
					method: "PATCH",
					body: { nuevaPassword: nuevaPassword.value }
				});
				modalPasswordAbierto.value = false;
			} catch (e) {
				errorUsuarios.value = e?.data?.message || "No fue posible restablecer la contraseña.";
			} finally {
				restableciendoPassword.value = false;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UButton = Button_default;
			const _component_UCard = Card_default;
			const _component_UAlert = Alert_default;
			const _component_UTable = Table_default;
			const _component_UBadge = Badge_default;
			const _component_UIcon = Icon_default;
			const _component_UPagination = Pagination_default;
			const _component_UModal = Modal_default;
			const _component_UFormGroup = FormGroup_default;
			const _component_UInput = Input_default;
			const _component_USelectMenu = SelectMenu_default;
			const _component_UiConfirmModal = ConfirmModal_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex items-center justify-between"><h1 class="text-xl font-semibold text-slate-900">Administración</h1>`);
			_push(ssrRenderComponent(_component_UButton, {
				color: "gray",
				variant: "soft",
				icon: "i-heroicons-cog-6-tooth",
				to: "/configuracion"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Parámetros de la empresa `);
					else return [createTextVNode(" Parámetros de la empresa ")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			_push(ssrRenderComponent(_component_UCard, null, {
				header: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="flex items-center justify-between"${_scopeId}><p class="font-semibold text-slate-900"${_scopeId}>Usuarios (RBAC)</p>`);
						_push(ssrRenderComponent(_component_UButton, {
							color: "amber",
							icon: "i-heroicons-plus",
							size: "sm",
							onClick: ($event) => modalUsuarioAbierto.value = true
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Nuevo usuario `);
								else return [createTextVNode(" Nuevo usuario ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "flex items-center justify-between" }, [createVNode("p", { class: "font-semibold text-slate-900" }, "Usuarios (RBAC)"), createVNode(_component_UButton, {
						color: "amber",
						icon: "i-heroicons-plus",
						size: "sm",
						onClick: ($event) => modalUsuarioAbierto.value = true
					}, {
						default: withCtx(() => [createTextVNode(" Nuevo usuario ")]),
						_: 1
					}, 8, ["onClick"])])];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (unref(errorUsuarios)) _push(ssrRenderComponent(_component_UAlert, {
							color: "red",
							variant: "subtle",
							title: unref(errorUsuarios),
							class: "mb-3"
						}, null, _parent, _scopeId));
						else _push(`<!---->`);
						_push(ssrRenderComponent(_component_UTable, {
							rows: unref(usuarios),
							columns: columnasUsuarios,
							loading: unref(cargandoUsuarios)
						}, {
							"rol-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_component_UBadge, {
									color: row.rol === "ADMINISTRADOR" ? "amber" : "gray",
									variant: "subtle"
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`${ssrInterpolate(row.rol)}`);
										else return [createTextVNode(toDisplayString(row.rol), 1)];
									}),
									_: 2
								}, _parent, _scopeId));
								else return [createVNode(_component_UBadge, {
									color: row.rol === "ADMINISTRADOR" ? "amber" : "gray",
									variant: "subtle"
								}, {
									default: withCtx(() => [createTextVNode(toDisplayString(row.rol), 1)]),
									_: 2
								}, 1032, ["color"])];
							}),
							"activo-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_component_UButton, {
									size: "xs",
									color: row.activo ? "emerald" : "gray",
									variant: "soft",
									onClick: ($event) => alternarActivo(row)
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`${ssrInterpolate(row.activo ? "Activo" : "Inactivo")}`);
										else return [createTextVNode(toDisplayString(row.activo ? "Activo" : "Inactivo"), 1)];
									}),
									_: 2
								}, _parent, _scopeId));
								else return [createVNode(_component_UButton, {
									size: "xs",
									color: row.activo ? "emerald" : "gray",
									variant: "soft",
									onClick: ($event) => alternarActivo(row)
								}, {
									default: withCtx(() => [createTextVNode(toDisplayString(row.activo ? "Activo" : "Inactivo"), 1)]),
									_: 2
								}, 1032, ["color", "onClick"])];
							}),
							"acciones-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_component_UButton, {
									size: "xs",
									color: "gray",
									variant: "ghost",
									icon: "i-heroicons-key",
									onClick: ($event) => abrirResetPassword(row)
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(` Restablecer contraseña `);
										else return [createTextVNode(" Restablecer contraseña ")];
									}),
									_: 2
								}, _parent, _scopeId));
								else return [createVNode(_component_UButton, {
									size: "xs",
									color: "gray",
									variant: "ghost",
									icon: "i-heroicons-key",
									onClick: ($event) => abrirResetPassword(row)
								}, {
									default: withCtx(() => [createTextVNode(" Restablecer contraseña ")]),
									_: 1
								}, 8, ["onClick"])];
							}),
							"empty-state": withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="text-center py-10 text-slate-400"${_scopeId}>`);
									_push(ssrRenderComponent(_component_UIcon, {
										name: "i-heroicons-users",
										class: "w-10 h-10 mx-auto mb-2"
									}, null, _parent, _scopeId));
									_push(`<p${_scopeId}>No hay usuarios registrados.</p></div>`);
								} else return [createVNode("div", { class: "text-center py-10 text-slate-400" }, [createVNode(_component_UIcon, {
									name: "i-heroicons-users",
									class: "w-10 h-10 mx-auto mb-2"
								}), createVNode("p", null, "No hay usuarios registrados.")])];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`<div class="flex justify-end mt-4"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UPagination, {
							modelValue: unref(paginaUsuarios),
							"onUpdate:modelValue": ($event) => isRef(paginaUsuarios) ? paginaUsuarios.value = $event : null,
							"page-count": unref(limiteUsuarios),
							total: unref(totalUsuarios)
						}, null, _parent, _scopeId));
						_push(`</div>`);
					} else return [
						unref(errorUsuarios) ? (openBlock(), createBlock(_component_UAlert, {
							key: 0,
							color: "red",
							variant: "subtle",
							title: unref(errorUsuarios),
							class: "mb-3"
						}, null, 8, ["title"])) : createCommentVNode("", true),
						createVNode(_component_UTable, {
							rows: unref(usuarios),
							columns: columnasUsuarios,
							loading: unref(cargandoUsuarios)
						}, {
							"rol-data": withCtx(({ row }) => [createVNode(_component_UBadge, {
								color: row.rol === "ADMINISTRADOR" ? "amber" : "gray",
								variant: "subtle"
							}, {
								default: withCtx(() => [createTextVNode(toDisplayString(row.rol), 1)]),
								_: 2
							}, 1032, ["color"])]),
							"activo-data": withCtx(({ row }) => [createVNode(_component_UButton, {
								size: "xs",
								color: row.activo ? "emerald" : "gray",
								variant: "soft",
								onClick: ($event) => alternarActivo(row)
							}, {
								default: withCtx(() => [createTextVNode(toDisplayString(row.activo ? "Activo" : "Inactivo"), 1)]),
								_: 2
							}, 1032, ["color", "onClick"])]),
							"acciones-data": withCtx(({ row }) => [createVNode(_component_UButton, {
								size: "xs",
								color: "gray",
								variant: "ghost",
								icon: "i-heroicons-key",
								onClick: ($event) => abrirResetPassword(row)
							}, {
								default: withCtx(() => [createTextVNode(" Restablecer contraseña ")]),
								_: 1
							}, 8, ["onClick"])]),
							"empty-state": withCtx(() => [createVNode("div", { class: "text-center py-10 text-slate-400" }, [createVNode(_component_UIcon, {
								name: "i-heroicons-users",
								class: "w-10 h-10 mx-auto mb-2"
							}), createVNode("p", null, "No hay usuarios registrados.")])]),
							_: 1
						}, 8, ["rows", "loading"]),
						createVNode("div", { class: "flex justify-end mt-4" }, [createVNode(_component_UPagination, {
							modelValue: unref(paginaUsuarios),
							"onUpdate:modelValue": ($event) => isRef(paginaUsuarios) ? paginaUsuarios.value = $event : null,
							"page-count": unref(limiteUsuarios),
							total: unref(totalUsuarios)
						}, null, 8, [
							"modelValue",
							"onUpdate:modelValue",
							"page-count",
							"total"
						])])
					];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UModal, {
				modelValue: unref(modalUsuarioAbierto),
				"onUpdate:modelValue": ($event) => isRef(modalUsuarioAbierto) ? modalUsuarioAbierto.value = $event : null
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UCard, null, {
						header: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>Nuevo usuario</p>`);
							else return [createVNode("p", { class: "font-semibold text-slate-900" }, "Nuevo usuario")];
						}),
						footer: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex justify-end gap-2"${_scopeId}>`);
								_push(ssrRenderComponent(_component_UButton, {
									color: "gray",
									variant: "ghost",
									onClick: ($event) => modalUsuarioAbierto.value = false
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`Cancelar`);
										else return [createTextVNode("Cancelar")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UButton, {
									color: "amber",
									loading: unref(creandoUsuario),
									onClick: crearUsuario
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`Crear usuario`);
										else return [createTextVNode("Crear usuario")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
								color: "gray",
								variant: "ghost",
								onClick: ($event) => modalUsuarioAbierto.value = false
							}, {
								default: withCtx(() => [createTextVNode("Cancelar")]),
								_: 1
							}, 8, ["onClick"]), createVNode(_component_UButton, {
								color: "amber",
								loading: unref(creandoUsuario),
								onClick: crearUsuario
							}, {
								default: withCtx(() => [createTextVNode("Crear usuario")]),
								_: 1
							}, 8, ["loading"])])];
						}),
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="space-y-3"${_scopeId}>`);
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Nombre completo" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UInput, {
											modelValue: unref(nuevoUsuario).nombreCompleto,
											"onUpdate:modelValue": ($event) => unref(nuevoUsuario).nombreCompleto = $event
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UInput, {
											modelValue: unref(nuevoUsuario).nombreCompleto,
											"onUpdate:modelValue": ($event) => unref(nuevoUsuario).nombreCompleto = $event
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Correo electrónico" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UInput, {
											modelValue: unref(nuevoUsuario).email,
											"onUpdate:modelValue": ($event) => unref(nuevoUsuario).email = $event,
											type: "email"
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UInput, {
											modelValue: unref(nuevoUsuario).email,
											"onUpdate:modelValue": ($event) => unref(nuevoUsuario).email = $event,
											type: "email"
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Contraseña temporal" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UInput, {
											modelValue: unref(nuevoUsuario).password,
											"onUpdate:modelValue": ($event) => unref(nuevoUsuario).password = $event,
											type: "password"
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UInput, {
											modelValue: unref(nuevoUsuario).password,
											"onUpdate:modelValue": ($event) => unref(nuevoUsuario).password = $event,
											type: "password"
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Rol" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_USelectMenu, {
											modelValue: unref(nuevoUsuario).rol,
											"onUpdate:modelValue": ($event) => unref(nuevoUsuario).rol = $event,
											options: ["ADMINISTRADOR", "RECEPCIONISTA"]
										}, null, _parent, _scopeId));
										else return [createVNode(_component_USelectMenu, {
											modelValue: unref(nuevoUsuario).rol,
											"onUpdate:modelValue": ($event) => unref(nuevoUsuario).rol = $event,
											options: ["ADMINISTRADOR", "RECEPCIONISTA"]
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "space-y-3" }, [
								createVNode(_component_UFormGroup, { label: "Nombre completo" }, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(nuevoUsuario).nombreCompleto,
										"onUpdate:modelValue": ($event) => unref(nuevoUsuario).nombreCompleto = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode(_component_UFormGroup, { label: "Correo electrónico" }, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(nuevoUsuario).email,
										"onUpdate:modelValue": ($event) => unref(nuevoUsuario).email = $event,
										type: "email"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode(_component_UFormGroup, { label: "Contraseña temporal" }, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(nuevoUsuario).password,
										"onUpdate:modelValue": ($event) => unref(nuevoUsuario).password = $event,
										type: "password"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode(_component_UFormGroup, { label: "Rol" }, {
									default: withCtx(() => [createVNode(_component_USelectMenu, {
										modelValue: unref(nuevoUsuario).rol,
										"onUpdate:modelValue": ($event) => unref(nuevoUsuario).rol = $event,
										options: ["ADMINISTRADOR", "RECEPCIONISTA"]
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								})
							])];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(_component_UCard, null, {
						header: withCtx(() => [createVNode("p", { class: "font-semibold text-slate-900" }, "Nuevo usuario")]),
						footer: withCtx(() => [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
							color: "gray",
							variant: "ghost",
							onClick: ($event) => modalUsuarioAbierto.value = false
						}, {
							default: withCtx(() => [createTextVNode("Cancelar")]),
							_: 1
						}, 8, ["onClick"]), createVNode(_component_UButton, {
							color: "amber",
							loading: unref(creandoUsuario),
							onClick: crearUsuario
						}, {
							default: withCtx(() => [createTextVNode("Crear usuario")]),
							_: 1
						}, 8, ["loading"])])]),
						default: withCtx(() => [createVNode("div", { class: "space-y-3" }, [
							createVNode(_component_UFormGroup, { label: "Nombre completo" }, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(nuevoUsuario).nombreCompleto,
									"onUpdate:modelValue": ($event) => unref(nuevoUsuario).nombreCompleto = $event
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							createVNode(_component_UFormGroup, { label: "Correo electrónico" }, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(nuevoUsuario).email,
									"onUpdate:modelValue": ($event) => unref(nuevoUsuario).email = $event,
									type: "email"
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							createVNode(_component_UFormGroup, { label: "Contraseña temporal" }, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(nuevoUsuario).password,
									"onUpdate:modelValue": ($event) => unref(nuevoUsuario).password = $event,
									type: "password"
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							createVNode(_component_UFormGroup, { label: "Rol" }, {
								default: withCtx(() => [createVNode(_component_USelectMenu, {
									modelValue: unref(nuevoUsuario).rol,
									"onUpdate:modelValue": ($event) => unref(nuevoUsuario).rol = $event,
									options: ["ADMINISTRADOR", "RECEPCIONISTA"]
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							})
						])]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UModal, {
				modelValue: unref(modalPasswordAbierto),
				"onUpdate:modelValue": ($event) => isRef(modalPasswordAbierto) ? modalPasswordAbierto.value = $event : null
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UCard, null, {
						header: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>Restablecer contraseña — ${ssrInterpolate(unref(usuarioParaPassword)?.nombreCompleto)}</p>`);
							else return [createVNode("p", { class: "font-semibold text-slate-900" }, "Restablecer contraseña — " + toDisplayString(unref(usuarioParaPassword)?.nombreCompleto), 1)];
						}),
						footer: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex justify-end gap-2"${_scopeId}>`);
								_push(ssrRenderComponent(_component_UButton, {
									color: "gray",
									variant: "ghost",
									onClick: ($event) => modalPasswordAbierto.value = false
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`Cancelar`);
										else return [createTextVNode("Cancelar")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UButton, {
									color: "amber",
									loading: unref(restableciendoPassword),
									disabled: unref(nuevaPassword).length < 8,
									onClick: confirmarResetPassword
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(` Restablecer `);
										else return [createTextVNode(" Restablecer ")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
								color: "gray",
								variant: "ghost",
								onClick: ($event) => modalPasswordAbierto.value = false
							}, {
								default: withCtx(() => [createTextVNode("Cancelar")]),
								_: 1
							}, 8, ["onClick"]), createVNode(_component_UButton, {
								color: "amber",
								loading: unref(restableciendoPassword),
								disabled: unref(nuevaPassword).length < 8,
								onClick: confirmarResetPassword
							}, {
								default: withCtx(() => [createTextVNode(" Restablecer ")]),
								_: 1
							}, 8, ["loading", "disabled"])])];
						}),
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(ssrRenderComponent(_component_UFormGroup, { label: "Nueva contraseña (mínimo 8 caracteres)" }, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(ssrRenderComponent(_component_UInput, {
										modelValue: unref(nuevaPassword),
										"onUpdate:modelValue": ($event) => isRef(nuevaPassword) ? nuevaPassword.value = $event : null,
										type: "password"
									}, null, _parent, _scopeId));
									else return [createVNode(_component_UInput, {
										modelValue: unref(nuevaPassword),
										"onUpdate:modelValue": ($event) => isRef(nuevaPassword) ? nuevaPassword.value = $event : null,
										type: "password"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])];
								}),
								_: 1
							}, _parent, _scopeId));
							else return [createVNode(_component_UFormGroup, { label: "Nueva contraseña (mínimo 8 caracteres)" }, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(nuevaPassword),
									"onUpdate:modelValue": ($event) => isRef(nuevaPassword) ? nuevaPassword.value = $event : null,
									type: "password"
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							})];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(_component_UCard, null, {
						header: withCtx(() => [createVNode("p", { class: "font-semibold text-slate-900" }, "Restablecer contraseña — " + toDisplayString(unref(usuarioParaPassword)?.nombreCompleto), 1)]),
						footer: withCtx(() => [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
							color: "gray",
							variant: "ghost",
							onClick: ($event) => modalPasswordAbierto.value = false
						}, {
							default: withCtx(() => [createTextVNode("Cancelar")]),
							_: 1
						}, 8, ["onClick"]), createVNode(_component_UButton, {
							color: "amber",
							loading: unref(restableciendoPassword),
							disabled: unref(nuevaPassword).length < 8,
							onClick: confirmarResetPassword
						}, {
							default: withCtx(() => [createTextVNode(" Restablecer ")]),
							_: 1
						}, 8, ["loading", "disabled"])])]),
						default: withCtx(() => [createVNode(_component_UFormGroup, { label: "Nueva contraseña (mínimo 8 caracteres)" }, {
							default: withCtx(() => [createVNode(_component_UInput, {
								modelValue: unref(nuevaPassword),
								"onUpdate:modelValue": ($event) => isRef(nuevaPassword) ? nuevaPassword.value = $event : null,
								type: "password"
							}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
							_: 1
						})]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UiConfirmModal, {
				modelValue: unref(modalDesactivarAbierto),
				"onUpdate:modelValue": ($event) => isRef(modalDesactivarAbierto) ? modalDesactivarAbierto.value = $event : null,
				title: "Desactivar usuario",
				message: `¿Confirma desactivar a ${unref(usuarioParaDesactivar)?.nombreCompleto}? No podrá iniciar sesión hasta que se reactive.`,
				"confirm-label": "Desactivar",
				loading: unref(desactivando),
				color: "red",
				onConfirm: confirmarDesactivar,
				onCancel: ($event) => modalDesactivarAbierto.value = false
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region pages/administracion/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/administracion/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var administracion_default = index_vue_vue_type_script_setup_true_lang_default;

export { administracion_default as default };
//# sourceMappingURL=administracion-BWbWOIad.mjs.map
