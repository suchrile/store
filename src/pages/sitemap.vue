<template>
  <div class="links">
    <NuxtLink v-for="url in urls" :key="url.url" :href="url.url" class="link">
      {{ url.name }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const urls = ref()

const { data } = await useFetch('/api/_sitemap-urls')
if (data.value) {
  urls.value = data.value
}
</script>

<style scoped lang="scss">
.links {
  margin: 20px 0;
}
.link {
  display: block;
  &:not(:last-child) {
    margin-bottom: 5px;
  }
}
</style>
