<template>
  <div class="search-page w-full">
    <div class="search-page__header">
      <div class="search-page__title">
        <h1>{{ route.params.query }}</h1>
        <div v-if="productsCount" class="mt-2">
          {{ getSearchSummary() }}
        </div>
      </div>

      <div v-if="categoriesCount" class="search-page__subcategories">
        <div
          v-for="category in categories"
          :key="category.id"
          :class="{ active: category.id === activeCategoryId }"
          class="search-page__subcategory"
          @click="setActiveCategoryId(category.id)"
        >
          <span>{{ category.name }}</span>
          <div class="search-page__subcategory-badge">
            {{ category.products.length }}
          </div>
        </div>
      </div>
    </div>
    <CatalogLayout
      v-if="categories[activeCategoryId]"
      :category="categories[activeCategoryId]"
    />
  </div>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import type { Category, Product } from '@/interfaces'

const router = useRouter()
const route = useRoute()

const categories: Ref<{ [key: number]: Category & { products: Product[] } }> =
  ref({})
const activeCategoryId: Ref<number | null> = ref(null)
const categoriesCount: Ref<number> = ref(0)
const productsCount: Ref<number> = ref(0)

const setCategories = (products: Product[]) => {
  products.forEach((prod) => {
    const narrowCategories = prod.categories.filter(
      cat => !prod.categories.some(c => c.parentId === cat.id)
    )
    narrowCategories.forEach((cat) => {
      if (!categories.value[cat.id]) {
        categories.value[cat.id] = { ...cat, products: [prod] }
      } else {
        categories.value[cat.id].products.push(prod)
      }
    })
  })
  categoriesCount.value = Object.keys(categories.value).length
  productsCount.value = products.length
  setActiveCategoryId(
    Number(route.query.categoryId) || Number(Object.keys(categories.value)[0])
  )
}

const getSearchSummary = () => {
  const productsText =
    productsCount.value === 1
      ? 'товар'
      : productsCount.value > 1 && productsCount.value <= 4
        ? 'товара'
        : 'товаров'
  const categoriesText =
    categoriesCount.value === 1 ? 'категории' : 'категориях'
  return `${productsCount.value} ${productsText} в ${categoriesCount.value} ${categoriesText}`
}

const setActiveCategoryId = async (id: number | undefined) => {
  if (!id) {
    return
  }
  activeCategoryId.value = id
  await nextTick()
  await router.replace({ query: { ...route.query, categoryId: id } })
}

const { data } = await useFetch<Product[]>('/api/products', {
  query: { search: route.params.query }
})
if (data.value) {
  setCategories(data.value)
}

useHead({
  title: String(route.params.query)
})
</script>

<style scoped lang="scss">
.search-page {
  margin-bottom: 30px;
  &__header {
    display: grid;
    grid-template-columns: 280px 1fr;
    align-items: center;
    gap: 20px;
    min-height: 38.5px;
    margin: 15px 0;
  }
  &__title {
    padding-left: 13px;
    & h1 {
      margin: 0;
      font-size: 22px;
      line-height: 1.1;
    }
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
  &__subcategories {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    column-gap: 6px;
    row-gap: 6px;
    width: 100%;
    height: 100%;
  }
  &__subcategory {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 15px;
    border-radius: var(--border-radius);
    border: 2px solid transparent;
    background-color: white;
    transition: border-color 0.2s ease-in-out;
    cursor: pointer;
    user-select: none;
    & span {
      font-weight: 500;
      text-decoration: none;
      white-space: nowrap;
    }
    &-badge {
      color: var(--gray-500);
    }
    &.active,
    &:hover {
      border-color: var(--purple-500);
    }
  }

  @media screen and (max-width: 767px) {
    &__header {
      grid-template-columns: 1fr;
      margin: 20px 0;
    }
  }
}
</style>
