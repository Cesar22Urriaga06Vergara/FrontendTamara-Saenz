import { a as useAuthStore } from '../virtual/entry.mjs';
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
import { T as TableRowActions_default } from './TableRowActions-BOa58Tov.mjs';
import { defineComponent, ref, reactive, computed, watch, withCtx, createTextVNode, unref, isRef, createVNode, openBlock, createBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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
import './Dropdown-BjJ7vUzi.mjs';
import './Kbd-rjcREfaE.mjs';

//#region pages/clientes/index.vue?vue&type=script&setup=true&lang.ts
/** Directorio de Clientes (arrendatarios). Búsqueda estricta por cédula/documento. */
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const auth = useAuthStore();
		const clientes = ref([]);
		const cargando = ref(true);
		const busqueda = ref("");
		const error = ref("");
		const page = ref(1);
		const limit = ref(10);
		const total = ref(0);
		const columnas = [
			{
				key: "numeroDocumento",
				label: "Documento"
			},
			{
				key: "nombreCompleto",
				label: "Nombre completo"
			},
			{
				key: "telefono",
				label: "Teléfono"
			},
			{
				key: "email",
				label: "Correo"
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
		const modalAbierto = ref(false);
		const clienteEditando = ref(null);
		const formulario = reactive({
			numeroDocumento: "",
			tipoDocumento: "CC",
			nombreCompleto: "",
			email: "",
			telefono: "",
			direccion: ""
		});
		const guardando = ref(false);
		const modalBajaAbierto = ref(false);
		const procesandoBaja = ref(false);
		const clienteParaBaja = ref(null);
		async function cargar() {
			cargando.value = true;
			try {
				if (busqueda.value) {
					clientes.value = await useApiFetch("/clientes/buscar", { params: {
						documento: busqueda.value,
						nombre: busqueda.value
					} });
					total.value = clientes.value.length;
				} else {
					const data = await useApiFetch("/clientes", { params: {
						page: page.value,
						limit: limit.value
					} });
					clientes.value = data.data;
					total.value = data.total;
				}
				error.value = "";
			} catch (e) {
				error.value = e?.data?.message || "No fue posible cargar los clientes.";
			} finally {
				cargando.value = false;
			}
		}
		function resetearFormulario() {
			Object.assign(formulario, {
				numeroDocumento: "",
				tipoDocumento: "CC",
				nombreCompleto: "",
				email: "",
				telefono: "",
				direccion: ""
			});
		}
		function abrirCreacion() {
			clienteEditando.value = null;
			resetearFormulario();
			modalAbierto.value = true;
		}
		function abrirEdicion(cliente) {
			clienteEditando.value = cliente;
			Object.assign(formulario, {
				numeroDocumento: cliente.numeroDocumento,
				tipoDocumento: cliente.tipoDocumento,
				nombreCompleto: cliente.nombreCompleto,
				email: cliente.email,
				telefono: cliente.telefono,
				direccion: cliente.direccion
			});
			modalAbierto.value = true;
		}
		async function guardar() {
			error.value = "";
			guardando.value = true;
			try {
				if (clienteEditando.value) await useApiFetch(`/clientes/${clienteEditando.value.id}`, {
					method: "PATCH",
					body: formulario
				});
				else await useApiFetch("/clientes", {
					method: "POST",
					body: formulario
				});
				modalAbierto.value = false;
				resetearFormulario();
				await cargar();
			} catch (e) {
				error.value = e?.data?.message || "No fue posible guardar el cliente.";
			} finally {
				guardando.value = false;
			}
		}
		function confirmarBaja(cliente) {
			clienteParaBaja.value = cliente;
			modalBajaAbierto.value = true;
		}
		async function ejecutarBaja() {
			error.value = "";
			procesandoBaja.value = true;
			try {
				await useApiFetch(`/clientes/${clienteParaBaja.value.id}`, {
					method: "PATCH",
					body: { activo: false }
				});
				modalBajaAbierto.value = false;
				await cargar();
			} catch (e) {
				error.value = e?.data?.message || "No fue posible dar de baja al cliente.";
			} finally {
				procesandoBaja.value = false;
			}
		}
		async function alternarActivo(cliente) {
			error.value = "";
			try {
				await useApiFetch(`/clientes/${cliente.id}`, {
					method: "PATCH",
					body: { activo: true }
				});
				await cargar();
			} catch (e) {
				error.value = e?.data?.message || "No fue posible reactivar al cliente.";
			}
		}
		const formularioValido = computed(() => formulario.numeroDocumento.trim().length > 0 && formulario.nombreCompleto.trim().length > 0 && (!formulario.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email)));
		watch(busqueda, () => {
			page.value = 1;
			cargar();
		});
		watch(page, cargar);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UButton = Button_default;
			const _component_UAlert = Alert_default;
			const _component_UCard = Card_default;
			const _component_UInput = Input_default;
			const _component_UTable = Table_default;
			const _component_UBadge = Badge_default;
			const _component_UiTableRowActions = TableRowActions_default;
			const _component_UIcon = Icon_default;
			const _component_UPagination = Pagination_default;
			const _component_UModal = Modal_default;
			const _component_UFormGroup = FormGroup_default;
			const _component_USelectMenu = SelectMenu_default;
			const _component_UiConfirmModal = ConfirmModal_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-4"><h1 class="text-xl font-semibold text-slate-900">Clientes</h1>`);
			_push(ssrRenderComponent(_component_UButton, {
				color: "amber",
				icon: "i-heroicons-plus",
				onClick: abrirCreacion
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Nuevo cliente`);
					else return [createTextVNode("Nuevo cliente")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			if (unref(error)) _push(ssrRenderComponent(_component_UAlert, {
				color: "red",
				variant: "subtle",
				title: unref(error),
				class: "mb-4"
			}, null, _parent));
			else _push(`<!---->`);
			_push(ssrRenderComponent(_component_UCard, { class: "mb-4" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UInput, {
						modelValue: unref(busqueda),
						"onUpdate:modelValue": ($event) => isRef(busqueda) ? busqueda.value = $event : null,
						placeholder: "Buscar por cédula o nombre…",
						icon: "i-heroicons-magnifying-glass",
						class: "w-72"
					}, null, _parent, _scopeId));
					else return [createVNode(_component_UInput, {
						modelValue: unref(busqueda),
						"onUpdate:modelValue": ($event) => isRef(busqueda) ? busqueda.value = $event : null,
						placeholder: "Buscar por cédula o nombre…",
						icon: "i-heroicons-magnifying-glass",
						class: "w-72"
					}, null, 8, ["modelValue", "onUpdate:modelValue"])];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UCard, null, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_UTable, {
							rows: unref(clientes),
							columns: columnas,
							loading: unref(cargando)
						}, {
							"activo-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_component_UBadge, {
									color: row.activo ? "emerald" : "gray",
									variant: "subtle"
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`${ssrInterpolate(row.activo ? "Activo" : "Inactivo")}`);
										else return [createTextVNode(toDisplayString(row.activo ? "Activo" : "Inactivo"), 1)];
									}),
									_: 2
								}, _parent, _scopeId));
								else return [createVNode(_component_UBadge, {
									color: row.activo ? "emerald" : "gray",
									variant: "subtle"
								}, {
									default: withCtx(() => [createTextVNode(toDisplayString(row.activo ? "Activo" : "Inactivo"), 1)]),
									_: 2
								}, 1032, ["color"])];
							}),
							"acciones-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) {
									if (unref(auth).esAdministrador) _push(ssrRenderComponent(_component_UiTableRowActions, {
										activo: row.activo,
										onEditar: ($event) => abrirEdicion(row),
										onBaja: ($event) => confirmarBaja(row),
										onReactivar: ($event) => alternarActivo(row)
									}, null, _parent, _scopeId));
									else _push(`<!---->`);
								} else return [unref(auth).esAdministrador ? (openBlock(), createBlock(_component_UiTableRowActions, {
									key: 0,
									activo: row.activo,
									onEditar: ($event) => abrirEdicion(row),
									onBaja: ($event) => confirmarBaja(row),
									onReactivar: ($event) => alternarActivo(row)
								}, null, 8, [
									"activo",
									"onEditar",
									"onBaja",
									"onReactivar"
								])) : createCommentVNode("", true)];
							}),
							"empty-state": withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="text-center py-10 text-slate-400"${_scopeId}>`);
									_push(ssrRenderComponent(_component_UIcon, {
										name: "i-heroicons-user-group",
										class: "w-10 h-10 mx-auto mb-2"
									}, null, _parent, _scopeId));
									_push(`<p${_scopeId}>No hay clientes que coincidan con la búsqueda.</p></div>`);
								} else return [createVNode("div", { class: "text-center py-10 text-slate-400" }, [createVNode(_component_UIcon, {
									name: "i-heroicons-user-group",
									class: "w-10 h-10 mx-auto mb-2"
								}), createVNode("p", null, "No hay clientes que coincidan con la búsqueda.")])];
							}),
							_: 1
						}, _parent, _scopeId));
						if (!unref(busqueda)) {
							_push(`<div class="flex justify-end mt-4"${_scopeId}>`);
							_push(ssrRenderComponent(_component_UPagination, {
								modelValue: unref(page),
								"onUpdate:modelValue": ($event) => isRef(page) ? page.value = $event : null,
								"page-count": unref(limit),
								total: unref(total)
							}, null, _parent, _scopeId));
							_push(`</div>`);
						} else _push(`<!---->`);
					} else return [createVNode(_component_UTable, {
						rows: unref(clientes),
						columns: columnas,
						loading: unref(cargando)
					}, {
						"activo-data": withCtx(({ row }) => [createVNode(_component_UBadge, {
							color: row.activo ? "emerald" : "gray",
							variant: "subtle"
						}, {
							default: withCtx(() => [createTextVNode(toDisplayString(row.activo ? "Activo" : "Inactivo"), 1)]),
							_: 2
						}, 1032, ["color"])]),
						"acciones-data": withCtx(({ row }) => [unref(auth).esAdministrador ? (openBlock(), createBlock(_component_UiTableRowActions, {
							key: 0,
							activo: row.activo,
							onEditar: ($event) => abrirEdicion(row),
							onBaja: ($event) => confirmarBaja(row),
							onReactivar: ($event) => alternarActivo(row)
						}, null, 8, [
							"activo",
							"onEditar",
							"onBaja",
							"onReactivar"
						])) : createCommentVNode("", true)]),
						"empty-state": withCtx(() => [createVNode("div", { class: "text-center py-10 text-slate-400" }, [createVNode(_component_UIcon, {
							name: "i-heroicons-user-group",
							class: "w-10 h-10 mx-auto mb-2"
						}), createVNode("p", null, "No hay clientes que coincidan con la búsqueda.")])]),
						_: 1
					}, 8, ["rows", "loading"]), !unref(busqueda) ? (openBlock(), createBlock("div", {
						key: 0,
						class: "flex justify-end mt-4"
					}, [createVNode(_component_UPagination, {
						modelValue: unref(page),
						"onUpdate:modelValue": ($event) => isRef(page) ? page.value = $event : null,
						"page-count": unref(limit),
						total: unref(total)
					}, null, 8, [
						"modelValue",
						"onUpdate:modelValue",
						"page-count",
						"total"
					])])) : createCommentVNode("", true)];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UModal, {
				modelValue: unref(modalAbierto),
				"onUpdate:modelValue": ($event) => isRef(modalAbierto) ? modalAbierto.value = $event : null
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UCard, null, {
						header: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(unref(clienteEditando) ? "Editar cliente" : "Nuevo cliente")}</p>`);
							else return [createVNode("p", { class: "font-semibold text-slate-900" }, toDisplayString(unref(clienteEditando) ? "Editar cliente" : "Nuevo cliente"), 1)];
						}),
						footer: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex justify-end gap-2"${_scopeId}>`);
								_push(ssrRenderComponent(_component_UButton, {
									color: "gray",
									variant: "ghost",
									onClick: ($event) => modalAbierto.value = false
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`Cancelar`);
										else return [createTextVNode("Cancelar")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UButton, {
									color: "amber",
									loading: unref(guardando),
									disabled: !unref(formularioValido),
									onClick: guardar
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`${ssrInterpolate(unref(clienteEditando) ? "Guardar cambios" : "Crear cliente")}`);
										else return [createTextVNode(toDisplayString(unref(clienteEditando) ? "Guardar cambios" : "Crear cliente"), 1)];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
								color: "gray",
								variant: "ghost",
								onClick: ($event) => modalAbierto.value = false
							}, {
								default: withCtx(() => [createTextVNode("Cancelar")]),
								_: 1
							}, 8, ["onClick"]), createVNode(_component_UButton, {
								color: "amber",
								loading: unref(guardando),
								disabled: !unref(formularioValido),
								onClick: guardar
							}, {
								default: withCtx(() => [createTextVNode(toDisplayString(unref(clienteEditando) ? "Guardar cambios" : "Crear cliente"), 1)]),
								_: 1
							}, 8, ["loading", "disabled"])])];
						}),
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="grid grid-cols-2 gap-3"${_scopeId}>`);
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Tipo documento" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_USelectMenu, {
											modelValue: unref(formulario).tipoDocumento,
											"onUpdate:modelValue": ($event) => unref(formulario).tipoDocumento = $event,
											options: [
												"CC",
												"CE",
												"NIT",
												"PAS"
											]
										}, null, _parent, _scopeId));
										else return [createVNode(_component_USelectMenu, {
											modelValue: unref(formulario).tipoDocumento,
											"onUpdate:modelValue": ($event) => unref(formulario).tipoDocumento = $event,
											options: [
												"CC",
												"CE",
												"NIT",
												"PAS"
											]
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UFormGroup, {
									label: "Número documento",
									required: ""
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UInput, {
											modelValue: unref(formulario).numeroDocumento,
											"onUpdate:modelValue": ($event) => unref(formulario).numeroDocumento = $event
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UInput, {
											modelValue: unref(formulario).numeroDocumento,
											"onUpdate:modelValue": ($event) => unref(formulario).numeroDocumento = $event
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UFormGroup, {
									label: "Nombre completo",
									class: "col-span-2",
									required: ""
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UInput, {
											modelValue: unref(formulario).nombreCompleto,
											"onUpdate:modelValue": ($event) => unref(formulario).nombreCompleto = $event
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UInput, {
											modelValue: unref(formulario).nombreCompleto,
											"onUpdate:modelValue": ($event) => unref(formulario).nombreCompleto = $event
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Correo" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UInput, {
											modelValue: unref(formulario).email,
											"onUpdate:modelValue": ($event) => unref(formulario).email = $event,
											type: "email"
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UInput, {
											modelValue: unref(formulario).email,
											"onUpdate:modelValue": ($event) => unref(formulario).email = $event,
											type: "email"
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Teléfono" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UInput, {
											modelValue: unref(formulario).telefono,
											"onUpdate:modelValue": ($event) => unref(formulario).telefono = $event
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UInput, {
											modelValue: unref(formulario).telefono,
											"onUpdate:modelValue": ($event) => unref(formulario).telefono = $event
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UFormGroup, {
									label: "Dirección",
									class: "col-span-2"
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UInput, {
											modelValue: unref(formulario).direccion,
											"onUpdate:modelValue": ($event) => unref(formulario).direccion = $event
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UInput, {
											modelValue: unref(formulario).direccion,
											"onUpdate:modelValue": ($event) => unref(formulario).direccion = $event
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
								createVNode(_component_UFormGroup, { label: "Tipo documento" }, {
									default: withCtx(() => [createVNode(_component_USelectMenu, {
										modelValue: unref(formulario).tipoDocumento,
										"onUpdate:modelValue": ($event) => unref(formulario).tipoDocumento = $event,
										options: [
											"CC",
											"CE",
											"NIT",
											"PAS"
										]
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode(_component_UFormGroup, {
									label: "Número documento",
									required: ""
								}, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(formulario).numeroDocumento,
										"onUpdate:modelValue": ($event) => unref(formulario).numeroDocumento = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode(_component_UFormGroup, {
									label: "Nombre completo",
									class: "col-span-2",
									required: ""
								}, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(formulario).nombreCompleto,
										"onUpdate:modelValue": ($event) => unref(formulario).nombreCompleto = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode(_component_UFormGroup, { label: "Correo" }, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(formulario).email,
										"onUpdate:modelValue": ($event) => unref(formulario).email = $event,
										type: "email"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode(_component_UFormGroup, { label: "Teléfono" }, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(formulario).telefono,
										"onUpdate:modelValue": ($event) => unref(formulario).telefono = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode(_component_UFormGroup, {
									label: "Dirección",
									class: "col-span-2"
								}, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(formulario).direccion,
										"onUpdate:modelValue": ($event) => unref(formulario).direccion = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								})
							])];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(_component_UCard, null, {
						header: withCtx(() => [createVNode("p", { class: "font-semibold text-slate-900" }, toDisplayString(unref(clienteEditando) ? "Editar cliente" : "Nuevo cliente"), 1)]),
						footer: withCtx(() => [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
							color: "gray",
							variant: "ghost",
							onClick: ($event) => modalAbierto.value = false
						}, {
							default: withCtx(() => [createTextVNode("Cancelar")]),
							_: 1
						}, 8, ["onClick"]), createVNode(_component_UButton, {
							color: "amber",
							loading: unref(guardando),
							disabled: !unref(formularioValido),
							onClick: guardar
						}, {
							default: withCtx(() => [createTextVNode(toDisplayString(unref(clienteEditando) ? "Guardar cambios" : "Crear cliente"), 1)]),
							_: 1
						}, 8, ["loading", "disabled"])])]),
						default: withCtx(() => [createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
							createVNode(_component_UFormGroup, { label: "Tipo documento" }, {
								default: withCtx(() => [createVNode(_component_USelectMenu, {
									modelValue: unref(formulario).tipoDocumento,
									"onUpdate:modelValue": ($event) => unref(formulario).tipoDocumento = $event,
									options: [
										"CC",
										"CE",
										"NIT",
										"PAS"
									]
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							createVNode(_component_UFormGroup, {
								label: "Número documento",
								required: ""
							}, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(formulario).numeroDocumento,
									"onUpdate:modelValue": ($event) => unref(formulario).numeroDocumento = $event
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							createVNode(_component_UFormGroup, {
								label: "Nombre completo",
								class: "col-span-2",
								required: ""
							}, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(formulario).nombreCompleto,
									"onUpdate:modelValue": ($event) => unref(formulario).nombreCompleto = $event
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							createVNode(_component_UFormGroup, { label: "Correo" }, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(formulario).email,
									"onUpdate:modelValue": ($event) => unref(formulario).email = $event,
									type: "email"
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							createVNode(_component_UFormGroup, { label: "Teléfono" }, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(formulario).telefono,
									"onUpdate:modelValue": ($event) => unref(formulario).telefono = $event
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							createVNode(_component_UFormGroup, {
								label: "Dirección",
								class: "col-span-2"
							}, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(formulario).direccion,
									"onUpdate:modelValue": ($event) => unref(formulario).direccion = $event
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							})
						])]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UiConfirmModal, {
				modelValue: unref(modalBajaAbierto),
				"onUpdate:modelValue": ($event) => isRef(modalBajaAbierto) ? modalBajaAbierto.value = $event : null,
				title: "Dar de baja",
				message: `¿Confirma dar de baja a ${unref(clienteParaBaja)?.nombreCompleto}?`,
				loading: unref(procesandoBaja),
				color: "red",
				onConfirm: ejecutarBaja,
				onCancel: ($event) => modalBajaAbierto.value = false
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region pages/clientes/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/clientes/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var clientes_default = index_vue_vue_type_script_setup_true_lang_default;

export { clientes_default as default };
//# sourceMappingURL=clientes-C2pAhtkp.mjs.map
