<template>
  <div />
</template>

<script setup lang="ts">
import type { Category } from '@/interfaces'

const defaultCategoryId = useInfo().value.app.defaultCategoryId

const { data } = await useFetch<Category[]>('/api/categories')
if (data.value) {
  if (defaultCategoryId) {
    const category = data.value.find(cat => cat.id === defaultCategoryId)
    if (category) {
      navigateTo('/category/' + category.slug)
    }
  } else {
    navigateTo('/category/' + data.value[0].slug)
  }
}
</script>
