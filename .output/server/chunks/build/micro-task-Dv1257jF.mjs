//#region node_modules/@headlessui/vue/dist/utils/micro-task.js
function t(e) {
	typeof queueMicrotask == "function" ? queueMicrotask(e) : Promise.resolve().then(e).catch((o) => setTimeout(() => {
		throw o;
	}));
}

export { t };
//# sourceMappingURL=micro-task-Dv1257jF.mjs.map
