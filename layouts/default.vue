<template>
  <div class="flex min-h-screen bg-slate-50">
    <SharedBannerReconexion />
    <LayoutSidebar />
    <div class="flex-1 flex flex-col min-w-0">
      <LayoutHeader />
      <main class="flex-1 min-w-0 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
