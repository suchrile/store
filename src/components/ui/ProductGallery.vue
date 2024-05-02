<template>
  <Galleria
    v-if="images.length > 1"
    :value="sortedImages"
    :show-indicators="true"
    :show-indicators-on-item="true"
    :change-item-on-indicator-hover="true"
    :show-thumbnails="false"
    class="galleria"
  >
    <template #item="slotProps">
      <img
        :src="slotProps.item.url"
        :alt="productName"
        class="galleria__image"
      >
    </template>
    <template #indicator>
      <div class="galleria__indicator" />
    </template>
  </Galleria>
  <MyImage v-else :src="images[0]?.url" class="galleria__image" />
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { ProductImage } from '@/interfaces'

const props = defineProps({
  productName: { type: String, required: true },
  images: { type: Array as PropType<ProductImage[]>, required: true }
})

const sortedImages = computed(() =>
  [...props.images].sort((a, b) => +b.isPrimary - +a.isPrimary)
)
</script>

<style lang="scss">
.galleria {
  width: 100%;
  &__image {
    width: 100%;
    object-fit: cover;
    aspect-ratio: 1/1;
  }
  &__indicator {
    width: 100%;
    height: 4px;
    border-radius: 4px;
    background-color: #00000010;
  }
}

.p-galleria-indicators {
  height: 100%;
  margin: 0 !important;
  padding: 0 !important;
  background-color: transparent !important;
}
.p-galleria-indicator {
  width: 100%;
  margin-right: 3px !important;
  padding-top: calc(100% - 3px);
  &:last-child {
    margin-right: 0 !important;
  }
  &.p-highlight {
    .galleria__indicator {
      background-color: var(--primary-color);
    }
  }
}

@media screen and (max-width: 767px) {
  .p-galleria-indicators {
    display: none !important;
  }
}
</style>
