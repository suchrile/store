<template>
  <div class="product-card" :class="layout + '-view'">
    <div class="product-card__images">
      <UiProductGallery :images="product.images" :product-name="product.name" />
    </div>
    <div class="product-card__content">
      <h6 class="product-card__name">
        {{ product.name }}
      </h6>
      <div v-if="layout === 'list'" class="product-card__attributes attributes">
        <div v-for="attr in attributes" :key="attr.id" class="attributes__item">
          {{ getAttributeValue(attr) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { AttributeOption, AttributeValue, Product } from '@/interfaces'
import { AttributeDataType } from '@/interfaces'
import { productAttributeBooleanOptions } from '@/consts'

const props = defineProps({
  product: { type: Object as PropType<Product>, required: true },
  layout: { type: String as PropType<'grid' | 'list'>, default: 'grid' }
})

const attributes = computed(() =>
  props.product.attributes.filter(attr => attr.showInCatalog)
)

const getAttributeValue = (attribute: AttributeValue) => {
  let value
  if (attribute.dataType === AttributeDataType.SELECT) {
    value = attribute.value
      .map((option: AttributeOption) => option.label)
      .join(', ')
  } else if (attribute.dataType === AttributeDataType.DATE) {
    value = new Date(attribute.value).toLocaleDateString()
  } else if (attribute.dataType === AttributeDataType.BOOLEAN) {
    value = productAttributeBooleanOptions.find(
      option => option.value === attribute.value
    )!.label
  } else {
    value = attribute.value
  }
  return (
    `${attribute.name}: ${value}` + (attribute.unit ? ` ${attribute.unit}` : '')
  )
}
</script>

<style lang="scss">
.product-card {
  font-size: 13px;
  color: var(--text-color);
  &.list-view {
    display: grid;
    grid-template-columns: 200px 1fr;
    font-size: 14px;
    .product-card__images {
      border-radius: 10px 0 0 10px;
      overflow: hidden;
    }
    .product-card__content {
      padding: 20px 30px;
      background-color: #fff;
      border-radius: 0 10px 10px 0;
    }
    .product-card__name {
      height: 44px;
      font-size: 18px;
    }
  }
  &__images {
    border-radius: 10px 10px 0 0;
    overflow: hidden;
  }
  &__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
    padding: 12px;
    background-color: #fff;
    border-radius: 0 0 10px 10px;
  }
  &__name {
    display: -webkit-box;
    min-height: 35px;
    margin: 0;
    font-size: 15px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  & .attributes {
    &__item:not(:last-child) {
      margin-bottom: 3px;
    }
  }

  @media screen and (max-width: 767px) {
    &__name {
      -webkit-line-clamp: unset;
    }
  }
}
</style>
