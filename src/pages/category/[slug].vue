<template>
  <div v-if="category" class="category-page">
    <div class="category-page__header">
      <h1 class="category-page__title">
        {{ category.name }}
      </h1>
      <div class="category-page__categories">
        <NuxtLink
          v-if="category.parentId"
          :to="'/category/' + category.parent.slug"
          class="category-page__parent-category"
        >
          <i class="pi pi-chevron-left" />
          <span>{{ category.parent.name }}</span>
        </NuxtLink>
        <NuxtLink
          v-for="subcategory in subcategories"
          :key="subcategory.id"
          :to="'/category/' + subcategory.slug"
          class="category-page__subcategory"
        >
          <span>{{ subcategory.name }}</span>
          <i class="pi pi-chevron-right" />
        </NuxtLink>
      </div>
    </div>
    <CatalogLayout :category="category" class="category-page__catalog" />
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import type { Category } from '@/interfaces'

const route = useRoute()

const category: Ref<Category | null> = ref(null)

const subcategories = computed(() =>
  category.value?.children.sort((a, b) => a.name.localeCompare(b.name))
)

const { data } = await useFetch<Category>(
  '/api/categories/' + route.params.slug,
  { key: String(route.params.slug) }
)
if (data.value) {
  category.value = {
    ...data.value,
    products: data.value.products.filter(product => !product.hidden)
  }
}

useHead({
  title: category.value?.name
})
</script>

<style scoped lang="scss">
.category-page {
  width: 100%;
  margin: 0 0 30px;
  &__header {
    display: grid;
    grid-template-columns: 280px 1fr;
    align-items: center;
    gap: 20px;
    min-height: 38.5px;
    margin: 15px 0;
  }
  &__title {
    margin: 0;
    padding-left: 13px;
    font-size: 22px;
    line-height: 1.1;
    position: relative;
    &::before {
      content: "";
      top: 0;
      left: 0;
      width: 3px;
      height: 100%;
      border-radius: 3px;
      background-color: var(--primary-color);
      position: absolute;
    }
  }
  &__categories {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    column-gap: 6px;
    row-gap: 6px;
    width: 100%;
    height: 100%;
  }
  &__subcategory,
  &__parent-category {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 20px;
    font-weight: 500;
    color: var(--text-color);
    text-decoration: none;
    white-space: nowrap;
    border-radius: var(--border-radius);
    border: 2px solid transparent;
    background-color: rgba(255, 255, 255, 1);
    transition: border-color 0.2s ease-in-out;
    & i {
      font-size: 11px;
      font-weight: 600;
      color: var(--primary-color);
    }
    &:hover {
      border-color: var(--purple-500);
    }
  }
  &__parent-category {
    margin-right: 8px;
  }

  @media screen and (max-width: 767px) {
    &__header {
      grid-template-columns: 1fr;
      margin: 20px 0;
    }
  }
}
</style>
