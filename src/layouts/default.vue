<template>
  <div class="layout-default">
    <Header />
    <div class="container overflow-hidden">
      <slot />
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
const info = useInfo()

useServerSeoMeta({
  description: info.value.app.description,
  ogDescription: info.value.app.description
})
useHead({
  titleTemplate: (title) => {
    if (title) { return `${title} – ${info.value.app.name}` } else { return info.value.app.name }
  }
})
</script>

<style scoped lang="scss">
.layout-default {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100%;
  @media screen and (max-width: 767px) {
    .container {
      width: 100%;
      padding: 0 15px;
    }
  }
}
</style>
