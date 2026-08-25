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
import { t as Textarea_default } from './Textarea-E1R2aU6E.mjs';
import { u as useApiFetch } from './useApiFetch-B8kTc45P.mjs';
import { u as useFormatoCO } from './useFormatoCO-CX_CcnnC.mjs';
import { defineComponent, ref, reactive, watch, withCtx, createTextVNode, unref, createVNode, toDisplayString, isRef, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
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

//#region pages/inmuebles/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const { moneda } = useFormatoCO();
		const cargando = ref(true);
		const inmuebles = ref([]);
		const barrios = ref([]);
		const total = ref(0);
		const page = ref(1);
		const limit = ref(10);
		const filtros = reactive({
			busqueda: "",
			barrio: "",
			estado: ""
		});
		const columnas = [
			{
				key: "consecutivo",
				label: "No."
			},
			{
				key: "direccion",
				label: "Dirección"
			},
			{
				key: "barrio",
				label: "Barrio"
			},
			{
				key: "canonValor",
				label: "Canon"
			},
			{
				key: "depositoValor",
				label: "Depósito"
			},
			{
				key: "estado",
				label: "Estado"
			},
			{
				key: "acciones",
				label: ""
			}
		];
		const estadoColor = {
			DISPONIBLE: "emerald",
			OCUPADO: "amber",
			MANTENIMIENTO: "orange",
			INACTIVO: "gray"
		};
		const estadosEditables = ["MANTENIMIENTO", "INACTIVO"];
		function opcionesEstado(inmueble) {
			const opciones = [inmueble.estado, ...estadosEditables.filter((e) => e !== inmueble.estado)];
			if (inmueble.estado === "MANTENIMIENTO" || inmueble.estado === "INACTIVO") opciones.push("DISPONIBLE");
			return opciones;
		}
		const error = ref("");
		const modalAbierto = ref(false);
		const inmuebleEditando = ref(null);
		const guardando = ref(false);
		const formulario = reactive({
			direccion: "",
			barrio: "",
			canonValor: 0,
			depositoValor: 0,
			codigoEnergia: "",
			codigoAgua: "",
			codigoGas: "",
			observaciones: "",
			estado: ""
		});
		async function cargar() {
			cargando.value = true;
			try {
				const data = await useApiFetch("/inmuebles", { params: {
					...filtros,
					page: page.value,
					limit: limit.value
				} });
				inmuebles.value = data.data;
				total.value = data.total;
			} catch (e) {
				error.value = e?.data?.message || "No fue posible cargar los inmuebles.";
			} finally {
				cargando.value = false;
			}
		}
		async function cargarBarrios() {
			barrios.value = await useApiFetch("/inmuebles/barrios");
		}
		function resetearFormulario() {
			Object.assign(formulario, {
				direccion: "",
				barrio: "",
				canonValor: 0,
				depositoValor: 0,
				codigoEnergia: "",
				codigoAgua: "",
				codigoGas: "",
				observaciones: "",
				estado: ""
			});
		}
		function abrirCreacion() {
			error.value = "";
			inmuebleEditando.value = null;
			resetearFormulario();
			modalAbierto.value = true;
		}
		function abrirEdicion(inmueble) {
			error.value = "";
			inmuebleEditando.value = inmueble;
			Object.assign(formulario, {
				direccion: inmueble.direccion,
				barrio: inmueble.barrio,
				canonValor: Number(inmueble.canonValor),
				depositoValor: inmueble.depositoValor != null ? Number(inmueble.depositoValor) : 0,
				codigoEnergia: inmueble.codigoEnergia || "",
				codigoAgua: inmueble.codigoAgua || "",
				codigoGas: inmueble.codigoGas || "",
				observaciones: inmueble.observaciones || "",
				estado: inmueble.estado
			});
			modalAbierto.value = true;
		}
		async function guardar() {
			error.value = "";
			guardando.value = true;
			try {
				if (inmuebleEditando.value) {
					const body = {
						direccion: formulario.direccion,
						barrio: formulario.barrio,
						canonValor: formulario.canonValor,
						depositoValor: formulario.depositoValor,
						codigoEnergia: formulario.codigoEnergia || void 0,
						codigoAgua: formulario.codigoAgua || void 0,
						codigoGas: formulario.codigoGas || void 0,
						observaciones: formulario.observaciones || void 0
					};
					if (opcionesEstado(inmuebleEditando.value).includes(formulario.estado) && formulario.estado !== inmuebleEditando.value.estado) body.estado = formulario.estado;
					await useApiFetch(`/inmuebles/${inmuebleEditando.value.id}`, {
						method: "PATCH",
						body
					});
				} else await useApiFetch("/inmuebles", {
					method: "POST",
					body: {
						direccion: formulario.direccion,
						barrio: formulario.barrio,
						canonValor: formulario.canonValor,
						depositoValor: formulario.depositoValor,
						codigoEnergia: formulario.codigoEnergia || void 0,
						codigoAgua: formulario.codigoAgua || void 0,
						codigoGas: formulario.codigoGas || void 0,
						observaciones: formulario.observaciones || void 0
					}
				});
				modalAbierto.value = false;
				resetearFormulario();
				await cargar();
				await cargarBarrios();
			} catch (e) {
				error.value = e?.data?.message || "No fue posible guardar el inmueble.";
			} finally {
				guardando.value = false;
			}
		}
		watch([
			() => filtros.busqueda,
			() => filtros.barrio,
			() => filtros.estado
		], () => {
			page.value = 1;
			cargar();
		});
		watch(page, cargar);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UButton = Button_default;
			const _component_UCard = Card_default;
			const _component_UInput = Input_default;
			const _component_USelectMenu = SelectMenu_default;
			const _component_UTable = Table_default;
			const _component_UBadge = Badge_default;
			const _component_UIcon = Icon_default;
			const _component_UPagination = Pagination_default;
			const _component_UModal = Modal_default;
			const _component_UAlert = Alert_default;
			const _component_UFormGroup = FormGroup_default;
			const _component_UTextarea = Textarea_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-4"><h1 class="text-xl font-semibold text-slate-900">Inmuebles</h1>`);
			_push(ssrRenderComponent(_component_UButton, {
				color: "amber",
				icon: "i-heroicons-plus",
				onClick: abrirCreacion
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Nuevo inmueble `);
					else return [createTextVNode(" Nuevo inmueble ")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			_push(ssrRenderComponent(_component_UCard, { class: "mb-4" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="flex flex-wrap gap-3"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UInput, {
							modelValue: unref(filtros).busqueda,
							"onUpdate:modelValue": ($event) => unref(filtros).busqueda = $event,
							placeholder: "Buscar por dirección o barrio…",
							icon: "i-heroicons-magnifying-glass",
							class: "w-64"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_USelectMenu, {
							modelValue: unref(filtros).barrio,
							"onUpdate:modelValue": ($event) => unref(filtros).barrio = $event,
							options: ["", ...unref(barrios)],
							placeholder: "Barrio",
							class: "w-48"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_USelectMenu, {
							modelValue: unref(filtros).estado,
							"onUpdate:modelValue": ($event) => unref(filtros).estado = $event,
							options: [
								"",
								"DISPONIBLE",
								"OCUPADO",
								"MANTENIMIENTO",
								"INACTIVO"
							],
							placeholder: "Estado",
							class: "w-48"
						}, null, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "flex flex-wrap gap-3" }, [
						createVNode(_component_UInput, {
							modelValue: unref(filtros).busqueda,
							"onUpdate:modelValue": ($event) => unref(filtros).busqueda = $event,
							placeholder: "Buscar por dirección o barrio…",
							icon: "i-heroicons-magnifying-glass",
							class: "w-64"
						}, null, 8, ["modelValue", "onUpdate:modelValue"]),
						createVNode(_component_USelectMenu, {
							modelValue: unref(filtros).barrio,
							"onUpdate:modelValue": ($event) => unref(filtros).barrio = $event,
							options: ["", ...unref(barrios)],
							placeholder: "Barrio",
							class: "w-48"
						}, null, 8, [
							"modelValue",
							"onUpdate:modelValue",
							"options"
						]),
						createVNode(_component_USelectMenu, {
							modelValue: unref(filtros).estado,
							"onUpdate:modelValue": ($event) => unref(filtros).estado = $event,
							options: [
								"",
								"DISPONIBLE",
								"OCUPADO",
								"MANTENIMIENTO",
								"INACTIVO"
							],
							placeholder: "Estado",
							class: "w-48"
						}, null, 8, ["modelValue", "onUpdate:modelValue"])
					])];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UCard, null, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_UTable, {
							rows: unref(inmuebles),
							columns: columnas,
							loading: unref(cargando)
						}, {
							"consecutivo-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(row.consecutivo || "—")}`);
								else return [createTextVNode(toDisplayString(row.consecutivo || "—"), 1)];
							}),
							"canonValor-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(unref(moneda)(row.canonValor))}`);
								else return [createTextVNode(toDisplayString(unref(moneda)(row.canonValor)), 1)];
							}),
							"depositoValor-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(`${ssrInterpolate(row.depositoValor != null ? unref(moneda)(row.depositoValor) : "—")}`);
								else return [createTextVNode(toDisplayString(row.depositoValor != null ? unref(moneda)(row.depositoValor) : "—"), 1)];
							}),
							"estado-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_component_UBadge, {
									color: estadoColor[row.estado] || "gray",
									variant: "subtle"
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`${ssrInterpolate(row.estado)}`);
										else return [createTextVNode(toDisplayString(row.estado), 1)];
									}),
									_: 2
								}, _parent, _scopeId));
								else return [createVNode(_component_UBadge, {
									color: estadoColor[row.estado] || "gray",
									variant: "subtle"
								}, {
									default: withCtx(() => [createTextVNode(toDisplayString(row.estado), 1)]),
									_: 2
								}, 1032, ["color"])];
							}),
							"acciones-data": withCtx(({ row }, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_component_UButton, {
									icon: "i-heroicons-pencil-square",
									color: "gray",
									variant: "ghost",
									size: "sm",
									onClick: ($event) => abrirEdicion(row)
								}, null, _parent, _scopeId));
								else return [createVNode(_component_UButton, {
									icon: "i-heroicons-pencil-square",
									color: "gray",
									variant: "ghost",
									size: "sm",
									onClick: ($event) => abrirEdicion(row)
								}, null, 8, ["onClick"])];
							}),
							"empty-state": withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="text-center py-10 text-slate-400"${_scopeId}>`);
									_push(ssrRenderComponent(_component_UIcon, {
										name: "i-heroicons-building-office-2",
										class: "w-10 h-10 mx-auto mb-2"
									}, null, _parent, _scopeId));
									_push(`<p${_scopeId}>No hay inmuebles que coincidan con los filtros.</p></div>`);
								} else return [createVNode("div", { class: "text-center py-10 text-slate-400" }, [createVNode(_component_UIcon, {
									name: "i-heroicons-building-office-2",
									class: "w-10 h-10 mx-auto mb-2"
								}), createVNode("p", null, "No hay inmuebles que coincidan con los filtros.")])];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`<div class="flex justify-end mt-4"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UPagination, {
							modelValue: unref(page),
							"onUpdate:modelValue": ($event) => isRef(page) ? page.value = $event : null,
							"page-count": unref(limit),
							total: unref(total)
						}, null, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode(_component_UTable, {
						rows: unref(inmuebles),
						columns: columnas,
						loading: unref(cargando)
					}, {
						"consecutivo-data": withCtx(({ row }) => [createTextVNode(toDisplayString(row.consecutivo || "—"), 1)]),
						"canonValor-data": withCtx(({ row }) => [createTextVNode(toDisplayString(unref(moneda)(row.canonValor)), 1)]),
						"depositoValor-data": withCtx(({ row }) => [createTextVNode(toDisplayString(row.depositoValor != null ? unref(moneda)(row.depositoValor) : "—"), 1)]),
						"estado-data": withCtx(({ row }) => [createVNode(_component_UBadge, {
							color: estadoColor[row.estado] || "gray",
							variant: "subtle"
						}, {
							default: withCtx(() => [createTextVNode(toDisplayString(row.estado), 1)]),
							_: 2
						}, 1032, ["color"])]),
						"acciones-data": withCtx(({ row }) => [createVNode(_component_UButton, {
							icon: "i-heroicons-pencil-square",
							color: "gray",
							variant: "ghost",
							size: "sm",
							onClick: ($event) => abrirEdicion(row)
						}, null, 8, ["onClick"])]),
						"empty-state": withCtx(() => [createVNode("div", { class: "text-center py-10 text-slate-400" }, [createVNode(_component_UIcon, {
							name: "i-heroicons-building-office-2",
							class: "w-10 h-10 mx-auto mb-2"
						}), createVNode("p", null, "No hay inmuebles que coincidan con los filtros.")])]),
						_: 1
					}, 8, ["rows", "loading"]), createVNode("div", { class: "flex justify-end mt-4" }, [createVNode(_component_UPagination, {
						modelValue: unref(page),
						"onUpdate:modelValue": ($event) => isRef(page) ? page.value = $event : null,
						"page-count": unref(limit),
						total: unref(total)
					}, null, 8, [
						"modelValue",
						"onUpdate:modelValue",
						"page-count",
						"total"
					])])];
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
							if (_push) _push(`<p class="font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(unref(inmuebleEditando) ? "Editar inmueble" : "Nuevo inmueble")}</p>`);
							else return [createVNode("p", { class: "font-semibold text-slate-900" }, toDisplayString(unref(inmuebleEditando) ? "Editar inmueble" : "Nuevo inmueble"), 1)];
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
									onClick: guardar
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`${ssrInterpolate(unref(inmuebleEditando) ? "Guardar cambios" : "Crear inmueble")}`);
										else return [createTextVNode(toDisplayString(unref(inmuebleEditando) ? "Guardar cambios" : "Crear inmueble"), 1)];
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
								onClick: guardar
							}, {
								default: withCtx(() => [createTextVNode(toDisplayString(unref(inmuebleEditando) ? "Guardar cambios" : "Crear inmueble"), 1)]),
								_: 1
							}, 8, ["loading"])])];
						}),
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								if (unref(error)) _push(ssrRenderComponent(_component_UAlert, {
									color: "red",
									variant: "subtle",
									title: unref(error),
									class: "mb-3"
								}, null, _parent, _scopeId));
								else _push(`<!---->`);
								_push(`<div class="grid grid-cols-2 gap-3"${_scopeId}>`);
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
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Barrio" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UInput, {
											modelValue: unref(formulario).barrio,
											"onUpdate:modelValue": ($event) => unref(formulario).barrio = $event
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UInput, {
											modelValue: unref(formulario).barrio,
											"onUpdate:modelValue": ($event) => unref(formulario).barrio = $event
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								if (unref(inmuebleEditando)) _push(ssrRenderComponent(_component_UFormGroup, { label: "Estado" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_USelectMenu, {
											modelValue: unref(formulario).estado,
											"onUpdate:modelValue": ($event) => unref(formulario).estado = $event,
											options: opcionesEstado(unref(inmuebleEditando))
										}, null, _parent, _scopeId));
										else return [createVNode(_component_USelectMenu, {
											modelValue: unref(formulario).estado,
											"onUpdate:modelValue": ($event) => unref(formulario).estado = $event,
											options: opcionesEstado(unref(inmuebleEditando))
										}, null, 8, [
											"modelValue",
											"onUpdate:modelValue",
											"options"
										])];
									}),
									_: 1
								}, _parent, _scopeId));
								else _push(`<!---->`);
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Canon" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UInput, {
											modelValue: unref(formulario).canonValor,
											"onUpdate:modelValue": ($event) => unref(formulario).canonValor = $event,
											modelModifiers: { number: true },
											type: "number",
											min: "0"
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UInput, {
											modelValue: unref(formulario).canonValor,
											"onUpdate:modelValue": ($event) => unref(formulario).canonValor = $event,
											modelModifiers: { number: true },
											type: "number",
											min: "0"
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Depósito" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UInput, {
											modelValue: unref(formulario).depositoValor,
											"onUpdate:modelValue": ($event) => unref(formulario).depositoValor = $event,
											modelModifiers: { number: true },
											type: "number",
											min: "0"
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UInput, {
											modelValue: unref(formulario).depositoValor,
											"onUpdate:modelValue": ($event) => unref(formulario).depositoValor = $event,
											modelModifiers: { number: true },
											type: "number",
											min: "0"
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Código energía" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UInput, {
											modelValue: unref(formulario).codigoEnergia,
											"onUpdate:modelValue": ($event) => unref(formulario).codigoEnergia = $event
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UInput, {
											modelValue: unref(formulario).codigoEnergia,
											"onUpdate:modelValue": ($event) => unref(formulario).codigoEnergia = $event
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Código agua" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UInput, {
											modelValue: unref(formulario).codigoAgua,
											"onUpdate:modelValue": ($event) => unref(formulario).codigoAgua = $event
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UInput, {
											modelValue: unref(formulario).codigoAgua,
											"onUpdate:modelValue": ($event) => unref(formulario).codigoAgua = $event
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UFormGroup, { label: "Código gas" }, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UInput, {
											modelValue: unref(formulario).codigoGas,
											"onUpdate:modelValue": ($event) => unref(formulario).codigoGas = $event
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UInput, {
											modelValue: unref(formulario).codigoGas,
											"onUpdate:modelValue": ($event) => unref(formulario).codigoGas = $event
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(ssrRenderComponent(_component_UFormGroup, {
									label: "Observaciones",
									class: "col-span-2"
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_component_UTextarea, {
											modelValue: unref(formulario).observaciones,
											"onUpdate:modelValue": ($event) => unref(formulario).observaciones = $event
										}, null, _parent, _scopeId));
										else return [createVNode(_component_UTextarea, {
											modelValue: unref(formulario).observaciones,
											"onUpdate:modelValue": ($event) => unref(formulario).observaciones = $event
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [unref(error) ? (openBlock(), createBlock(_component_UAlert, {
								key: 0,
								color: "red",
								variant: "subtle",
								title: unref(error),
								class: "mb-3"
							}, null, 8, ["title"])) : createCommentVNode("", true), createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
								createVNode(_component_UFormGroup, {
									label: "Dirección",
									class: "col-span-2"
								}, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(formulario).direccion,
										"onUpdate:modelValue": ($event) => unref(formulario).direccion = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode(_component_UFormGroup, { label: "Barrio" }, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(formulario).barrio,
										"onUpdate:modelValue": ($event) => unref(formulario).barrio = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								unref(inmuebleEditando) ? (openBlock(), createBlock(_component_UFormGroup, {
									key: 0,
									label: "Estado"
								}, {
									default: withCtx(() => [createVNode(_component_USelectMenu, {
										modelValue: unref(formulario).estado,
										"onUpdate:modelValue": ($event) => unref(formulario).estado = $event,
										options: opcionesEstado(unref(inmuebleEditando))
									}, null, 8, [
										"modelValue",
										"onUpdate:modelValue",
										"options"
									])]),
									_: 1
								})) : createCommentVNode("", true),
								createVNode(_component_UFormGroup, { label: "Canon" }, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(formulario).canonValor,
										"onUpdate:modelValue": ($event) => unref(formulario).canonValor = $event,
										modelModifiers: { number: true },
										type: "number",
										min: "0"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode(_component_UFormGroup, { label: "Depósito" }, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(formulario).depositoValor,
										"onUpdate:modelValue": ($event) => unref(formulario).depositoValor = $event,
										modelModifiers: { number: true },
										type: "number",
										min: "0"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode(_component_UFormGroup, { label: "Código energía" }, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(formulario).codigoEnergia,
										"onUpdate:modelValue": ($event) => unref(formulario).codigoEnergia = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode(_component_UFormGroup, { label: "Código agua" }, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(formulario).codigoAgua,
										"onUpdate:modelValue": ($event) => unref(formulario).codigoAgua = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode(_component_UFormGroup, { label: "Código gas" }, {
									default: withCtx(() => [createVNode(_component_UInput, {
										modelValue: unref(formulario).codigoGas,
										"onUpdate:modelValue": ($event) => unref(formulario).codigoGas = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								createVNode(_component_UFormGroup, {
									label: "Observaciones",
									class: "col-span-2"
								}, {
									default: withCtx(() => [createVNode(_component_UTextarea, {
										modelValue: unref(formulario).observaciones,
										"onUpdate:modelValue": ($event) => unref(formulario).observaciones = $event
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								})
							])];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(_component_UCard, null, {
						header: withCtx(() => [createVNode("p", { class: "font-semibold text-slate-900" }, toDisplayString(unref(inmuebleEditando) ? "Editar inmueble" : "Nuevo inmueble"), 1)]),
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
							onClick: guardar
						}, {
							default: withCtx(() => [createTextVNode(toDisplayString(unref(inmuebleEditando) ? "Guardar cambios" : "Crear inmueble"), 1)]),
							_: 1
						}, 8, ["loading"])])]),
						default: withCtx(() => [unref(error) ? (openBlock(), createBlock(_component_UAlert, {
							key: 0,
							color: "red",
							variant: "subtle",
							title: unref(error),
							class: "mb-3"
						}, null, 8, ["title"])) : createCommentVNode("", true), createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
							createVNode(_component_UFormGroup, {
								label: "Dirección",
								class: "col-span-2"
							}, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(formulario).direccion,
									"onUpdate:modelValue": ($event) => unref(formulario).direccion = $event
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							createVNode(_component_UFormGroup, { label: "Barrio" }, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(formulario).barrio,
									"onUpdate:modelValue": ($event) => unref(formulario).barrio = $event
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							unref(inmuebleEditando) ? (openBlock(), createBlock(_component_UFormGroup, {
								key: 0,
								label: "Estado"
							}, {
								default: withCtx(() => [createVNode(_component_USelectMenu, {
									modelValue: unref(formulario).estado,
									"onUpdate:modelValue": ($event) => unref(formulario).estado = $event,
									options: opcionesEstado(unref(inmuebleEditando))
								}, null, 8, [
									"modelValue",
									"onUpdate:modelValue",
									"options"
								])]),
								_: 1
							})) : createCommentVNode("", true),
							createVNode(_component_UFormGroup, { label: "Canon" }, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(formulario).canonValor,
									"onUpdate:modelValue": ($event) => unref(formulario).canonValor = $event,
									modelModifiers: { number: true },
									type: "number",
									min: "0"
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							createVNode(_component_UFormGroup, { label: "Depósito" }, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(formulario).depositoValor,
									"onUpdate:modelValue": ($event) => unref(formulario).depositoValor = $event,
									modelModifiers: { number: true },
									type: "number",
									min: "0"
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							createVNode(_component_UFormGroup, { label: "Código energía" }, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(formulario).codigoEnergia,
									"onUpdate:modelValue": ($event) => unref(formulario).codigoEnergia = $event
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							createVNode(_component_UFormGroup, { label: "Código agua" }, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(formulario).codigoAgua,
									"onUpdate:modelValue": ($event) => unref(formulario).codigoAgua = $event
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							createVNode(_component_UFormGroup, { label: "Código gas" }, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(formulario).codigoGas,
									"onUpdate:modelValue": ($event) => unref(formulario).codigoGas = $event
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							createVNode(_component_UFormGroup, {
								label: "Observaciones",
								class: "col-span-2"
							}, {
								default: withCtx(() => [createVNode(_component_UTextarea, {
									modelValue: unref(formulario).observaciones,
									"onUpdate:modelValue": ($event) => unref(formulario).observaciones = $event
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							})
						])]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region pages/inmuebles/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/inmuebles/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var inmuebles_default = index_vue_vue_type_script_setup_true_lang_default;

export { inmuebles_default as default };
//# sourceMappingURL=inmuebles-BUxteiE7.mjs.map
