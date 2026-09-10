<template>
  <div class="flex min-h-screen bg-slate-100 text-slate-900">
    <SharedBannerReconexion />
    <LayoutSidebar />
    <div class="flex min-w-0 flex-1 flex-col">
      <LayoutHeader />
      <main class="min-w-0 flex-1 bg-[radial-gradient(circle_at_top,_rgba(207,160,82,0.08),_transparent_24%),_linear-gradient(to_bottom,_#f8fafc,_#f1f5f9)] px-4 py-5 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-[1600px]">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
