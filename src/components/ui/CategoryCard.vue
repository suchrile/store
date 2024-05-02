<template>
  <div class="category-card">
    <!--    <MyImage class="category-card__image" />-->
    <div class="category-card__name">
      {{ value.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Category } from '@/interfaces'

defineProps({
  value: { type: Object as PropType<Category>, required: true }
})
</script>

<style lang="scss">
.category-card {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1/0.25;
  border-radius: 10px;
  background-color: #fff;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: box-shadow 0.2s ease-in-out;
  &:hover {
    box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.12);
  }
  &__image {
    aspect-ratio: 1/1;
  }
  &__name {
    padding: 15px;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
  }
}
</style>
