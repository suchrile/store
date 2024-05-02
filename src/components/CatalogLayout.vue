<template>
  <div class="catalog">
    <CatalogSidebar
      v-if="!width || width > 767"
      :products="category.products"
      class="catalog__filters"
    />

    <div v-if="width && width <= 767">
      <Button
        icon="pi pi-filter"
        label="Показать фильтры"
        class="catalog__show-filters"
        @click="isSidebarVisible = true"
      />
      <Sidebar
        v-model:visible="isSidebarVisible"
        :block-scroll="true"
        position="right"
        class="catalog__sidebar w-full"
      >
        <template #header>
          <div class="flex align-items-center gap-2">
            <i
              class="pi pi-filter font-bold text-2xl text-primary"
              style="margin-top: 1px"
            />
            <span class="text-2xl font-bold justify-self-start">Фильтры</span>
          </div>
        </template>
        <CatalogSidebar
          :products="category.products"
          class="catalog__sidebar-filters"
        />
      </Sidebar>
    </div>

    <CatalogProducts
      v-if="category.view === 'cards'"
      :products="category.products"
      class="catalog__products"
    />
    <CatalogProductsTable
      v-else-if="category.view === 'table'"
      :products="category.products"
      class="catalog__products"
    />
  </div>
</template>

<script setup lang="ts">
import type { PropType, Ref } from 'vue'
import type { Category } from '@/interfaces'

defineProps({
  category: { type: Object as PropType<Category>, required: true }
})

const isSidebarVisible: Ref<boolean> = ref(false)

const { width } = useViewport()
</script>

<style scoped lang="scss">
.catalog {
  display: grid;
  grid-template-columns: 280px 1fr;
  align-items: start;
  gap: 20px;
  width: 100%;
  &__show-filters {
    display: none;
  }

  @media screen and (max-width: 767px) {
    display: block;
    &__filters {
      display: none;
      visibility: hidden;
    }
    &__show-filters {
      display: block;
      width: 100%;
      margin-bottom: 15px;
    }
  }
}
</style>
