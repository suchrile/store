<template>
  <div class="h-full flex align-items-center justify-content-center">
    <progress-spinner />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})
onBeforeMount(() => {
  navigateTo('/admin/products')
})
</script>
