<template>
  <div v-if="product" class="product-page">
    <div class="product-page__header">
      <h1 class="product-page__title">
        {{ product.name }}
      </h1>
    </div>
    <div class="product-page__content">
      <div class="product-page__gallery gallery">
        <Galleria
          v-if="isMounted"
          :value="product.images"
          :num-visible="4"
          :thumbnails-position="viewportWidth > 768 ? 'left' : 'bottom'"
          vertical-thumbnail-view-port-height="344px"
        >
          <template #item="slotProps">
            <img
              :src="slotProps.item.url"
              :alt="slotProps.item.alt"
              class="gallery__image"
            >
          </template>
          <template #thumbnail="slotProps">
            <img
              :src="slotProps.item.url"
              :alt="slotProps.item.alt"
              class="gallery__thumbnail"
            >
          </template>
        </Galleria>
      </div>
      <div class="product-page__details details">
        <div class="details__item">
          <h5 class="details__item-title">
            Описание
          </h5>
          <div v-if="product.description" class="details__description">
            {{ product.description }}
          </div>
          <div v-else class="details__empty">
            У этого товара нет описания
          </div>
        </div>
        <div class="details__item">
          <h5 class="details__item-title">
            Характеристики
          </h5>
          <div
            v-if="product.attributes.length"
            class="details__attributes attributes"
          >
            <div
              v-for="attribute in product.attributes"
              :key="attribute.id"
              class="attributes__item"
            >
              <span class="attributes__item-name">{{ attribute.name }}</span>
              <span class="attributes__item-value">{{
                getAttributeValue(attribute)
              }}</span>
            </div>
          </div>
          <div v-else>
            <div class="details__empty">
              У этого товара нет характеристик
            </div>
          </div>
        </div>
        <div class="details__item">
          <h5 class="details__item-title">
            Категории
          </h5>
          <div class="details__categories">
            <NuxtLink
              v-for="category in product.categories"
              :key="category.id"
              :to="'/category/' + category.slug"
            >
              <Badge>
                {{ category.name }}
              </Badge>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import type {
  AttributeOption,
  AttributeValue,
  Product,
  ProductImage
} from '@/interfaces'
import { AttributeDataType } from '@/interfaces'
import { imagePlaceholderUrl, productAttributeBooleanOptions } from '@/consts'

const route = useRoute()

const product: Ref<Product | null> = ref(null)

const isMounted = ref(false)

const { width: viewportWidth } = useViewport()

onMounted(() => {
  isMounted.value = true
})

const { data } = await useFetch<Product>('/api/products/' + route.params.slug)
if (data.value) {
  product.value = data.value
  if (!product.value.images.length) {
    product.value.images.push({ url: imagePlaceholderUrl } as ProductImage)
  }
}

const getAttributeValue = (attribute: AttributeValue) => {
  let value
  if (attribute.dataType === AttributeDataType.DATE) {
    value = new Date(attribute.value).toLocaleDateString()
  } else if (attribute.dataType === AttributeDataType.BOOLEAN) {
    value = productAttributeBooleanOptions.find(
      option => option.value === attribute.value
    )!.label
  } else if (attribute.dataType === AttributeDataType.SELECT) {
    value = attribute.value
      .map((option: AttributeOption) => option.label)
      .join(', ')
  } else {
    value = attribute.value
  }
  return value + (attribute.unit ? ` ${attribute.unit}` : '')
}

useSeoMeta({
  title: product.value?.name,
  ogTitle: product.value?.name,
  description: product.value?.description,
  ogDescription: product.value?.description
})
</script>

<style lang="scss">
.product-page {
  height: 100%;
  flex: 1;
  margin: 20px 0;
  padding: 15px 25px 45px;
  border-radius: var(--border-radius);
  background-color: white;
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0 30px;
  }
  &__title {
    margin: 0;
    padding-left: 15px;
    font-size: 26px;
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
  &__actions {
  }
  &__content {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 25px;
  }
  & .details {
    width: 100%;
    &__item {
      &:not(:last-child) {
        margin-bottom: 20px;
      }
      &-title {
        margin: 0 0 10px;
      }
    }
    &__description,
    &__attributes,
    &__empty {
      padding: 15px 20px;
      border-radius: var(--border-radius);
      background-color: var(--surface-b);
    }
    &__description {
      white-space: pre-line;
    }
    &__empty {
      padding: 50px 15px;
      text-align: center;
      color: var(--text-color-secondary);
    }
    &__categories {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      & .p-badge {
        height: 100%;
        padding: 2px 12px;
        font-size: 12px;
        font-weight: 500;
        transition: background-color 0.2s ease-in-out;
        &:hover {
          background-color: var(--purple-600);
        }
      }
    }
    & .attributes {
      &__item {
        display: grid;
        grid-template-columns: 55% 1fr;
        align-items: end;
        gap: 6px;
        &:not(:last-child) {
          margin-bottom: 5px;
        }
        &-name {
          overflow: hidden;
          &:after {
            content: "";
            display: inline-block;
            width: 100%;
            margin: 0 -100% 0 6px;
            vertical-align: baseline;
            border-bottom: 1px dashed var(--gray-400);
          }
        }
        &-value {
          color: black;
        }
      }
    }
  }
  & .gallery {
    &__image,
    &__thumbnail {
      display: block;
      object-fit: cover;
      border-radius: var(--border-radius);
    }
    &__image {
      width: 630px;
      aspect-ratio: 1.5/1;
    }
    &__thumbnail {
      width: 82.25px;
      aspect-ratio: 1/1;
      border: 2px solid transparent;
    }
    .p-galleria-thumbnail-container {
      padding: 0 15px 0 0;
      background-color: transparent;
    }
    .p-galleria-thumbnail-items {
      height: auto;
      gap: 5px;
    }
    .p-galleria-thumbnail-item {
      opacity: 1;
    }
    .p-galleria-thumbnail-item-current .gallery__thumbnail {
      border-color: var(--primary-color);
    }
    .p-galleria-thumbnail-item-content {
      &:focus {
        box-shadow: none;
      }
    }
    .p-galleria-thumbnail-prev,
    .p-galleria-thumbnail-next {
      margin: 5px;
      color: var(--primary-color) !important;
    }
  }

  @media screen and (max-width: 767px) {
    margin: 0 -15px;
    padding: 15px 15px 45px;
    &__header {
      flex-direction: column;
      align-items: start;
      gap: 15px;
      margin: 10px 0 10px;
    }
    &__title {
      font-size: 22px;
    }
    &__content {
      grid-template-columns: 1fr;
    }
    & .details {
      & .attributes {
        &__item {
          grid-template-columns: 1fr 1fr;
        }
      }
    }
    & .gallery {
      max-width: calc(100vw - 30px);
      .p-galleria-thumbnail-container {
        padding: 15px 0 0;
      }
      .p-galleria-thumbnail-items {
        gap: unset;
      }
      .p-galleria-thumbnail-item {
        padding: 2px;
      }
      &__image {
        width: 100%;
      }
      &__thumbnail {
        max-height: 70px;
        max-width: 70px;
        width: 100%;
      }
      .p-galleria-thumbnail-prev,
      .p-galleria-thumbnail-next {
        margin: 0 6px 0 3px;
      }
    }
  }
}
</style>
