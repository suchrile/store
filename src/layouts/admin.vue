<template>
  <div
    v-if="isLoading"
    class="h-full flex align-items-center justify-content-center"
  >
    <progress-spinner />
  </div>
  <div v-else class="admin-layout">
    <ui-header-admin />
    <main class="admin-layout__page">
      <div class="container mx-auto h-full">
        <div class="card py-3 w-full">
          <TabMenu :model="routes" />
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>
<script setup lang="ts">
import type { Ref } from 'vue'
import type { MenuItem } from 'primevue/menuitem'

const routes: Ref<MenuItem[]> = ref([
  { label: 'Товары', icon: 'pi pi-fw pi-shopping-bag', to: '/admin/products' },
  { label: 'Категории', icon: 'pi pi-fw pi-filter', to: '/admin/categories' },
  { label: 'Атрибуты', icon: 'pi pi-fw pi-list', to: '/admin/attributes' },
  { label: 'Страницы', icon: 'pi pi-fw pi-bookmark', to: '/admin/pages' },
  { label: 'Ссылки', icon: 'pi pi-fw pi-link', to: '/admin/links' },
  { label: 'Настройки', icon: 'pi pi-fw pi-cog', to: '/admin/settings' }
])

const info = useInfo()
const { initAuth, useAuthLoading } = useAuth()
const isLoading = useAuthLoading()

onMounted(async () => {
  await nextTick()
  try {
    await initAuth()
  } catch {}
})

useHead({
  titleTemplate: (title) => {
    if (title) { return `${title} – Панель управления ${info.value.app.name}` } else { return `Панель управления – ${info.value.app.name}` }
  }
})
</script>

<style lang="scss">
.loading-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  &__spinner {
    width: 200px;
    height: 200px;
  }
}
.admin-layout {
  height: 100vh;

  &__page {
    width: 100%;
    padding: 0 20px;
    overflow: auto;
  }
}
</style>
