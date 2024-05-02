<template>
  <div class="catalog-products">
    <UiProductsSortAndViewOptions
      v-model:field="currentSortField"
      v-model:order="sortOrder"
      v-model:layout="productsLayout"
      :fields="sortableFields"
      @sort-change="handleSortChange"
    />

    <div
      v-if="filteredProducts.length"
      class="catalog-products__list"
      :class="'layout-' + productsLayout"
    >
      <TransitionGroup name="list">
        <NuxtLink
          v-for="product in filteredProducts"
          :key="product.id"
          :to="'/product/' + product.slug"
          target="_blank"
          class="catalog-products__item"
        >
          <UiProductCard :product="product" :layout="productsLayout" />
        </NuxtLink>
      </TransitionGroup>
    </div>

    <div
      v-else-if="products.length && !filteredProducts.length"
      class="catalog-products__empty"
    >
      <i class="pi pi-filter text-5xl" />
      <span class="text-lg font-medium">
        По заданным фильтрам товары не найдены
      </span>
    </div>

    <div v-else class="catalog-products__empty">
      <i class="pi pi-search text-5xl" />
      <span class="text-lg font-medium">
        {{
          route.name === "search-query"
            ? "По вашему запросу ничего не найдено"
            : "В этой категории пока нет товаров"
        }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType, Ref } from 'vue'
import type { Product, ProductsLayout } from '@/interfaces'

const props = defineProps({
  products: { type: Array as PropType<Product[]>, required: true }
})

const route = useRoute()

const { sortableFields, currentSortField, sortOrder, init, sort } =
  useProductsSort(props.products)

const filteredProducts: Ref<Product[]> = ref(props.products)
const productsLayout: Ref<ProductsLayout> = ref('grid')

onMounted(() => {
  watch(props, async () => {
    init(props.products)
    filterProducts()
    filteredProducts.value = await sort(filteredProducts.value)
  })
  watch(route, () => {
    filterProducts()
  })
})

const handleSortChange = async () => {
  filteredProducts.value = await sort(filteredProducts.value)
}

const filterProducts = () => {
  const query = getFilterQuery()
  filteredProducts.value = props.products.filter((product) => {
    return Object.keys(query).every((key) => {
      const queryValue = query[key]
      let value
      if (Array.isArray(queryValue)) {
        value = queryValue.map(el => decodeURIComponent(String(el)))
      } else {
        value = [decodeURIComponent(String(queryValue))]
      }
      const attribute = product.attributes.find(
        attr => attr.id === parseInt(key.replace('paf', ''))
      )
      if (!attribute) {
        return false
      }
      const isRangeValue = value.length === 1 && ~value[0].indexOf('~')
      if (isRangeValue) {
        const minmax = value[0].split('~')
        return attribute.value >= minmax[0] && attribute.value <= minmax[1]
      } else {
        return value.some((value) => {
          return Array.isArray(attribute.value)
            ? attribute.value.some(option => option.label === value)
            : String(attribute.value) === value
        })
      }
    })
  })
}

const getFilterQuery = () => {
  const query = { ...route.query }
  Object.keys(query).forEach((key) => {
    if (!key.includes('paf')) {
      delete query[key]
    }
  })
  return query
}

filterProducts()
filteredProducts.value = await sort(filteredProducts.value)
</script>

<style lang="scss">
.catalog-products {
  &__list {
    display: grid;
    gap: 15px;
    position: relative;
    &.layout-grid {
      grid-template-columns: repeat(3, 1fr);
      & a.list-leave-active {
        width: calc(100% / 3 - 10px);
      }
    }
    &.layout-list {
      grid-template-columns: 1fr;
      & a.list-leave-active {
        width: 100%;
      }
    }
  }
  &__item {
    text-decoration: none;
  }
  &__empty {
    height: 430px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__empty {
    flex-direction: column;
    gap: 15px;
    padding: 150px 20px;
    color: var(--text-color-secondary);
  }

  .p-dropdown-trigger {
    width: min-content !important;
    padding-right: 10px;
    & span {
      font-size: 11px;
    }
  }

  @media screen and (max-width: 767px) {
    &__list {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 10px;
    }
    .catalog-products {
      &__empty {
        height: 100px;
      }
    }
  }
}

@media screen and (min-width: 768px) {
  .list-move,
  .list-enter-active,
  .list-leave-active {
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
  }
  .list-leave-active {
    position: absolute;
    z-index: -1;
  }
}
</style>
