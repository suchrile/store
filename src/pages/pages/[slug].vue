<template>
  <div v-if="page" class="page-view">
    <div class="page-view__header">
      <h1 class="page-view__title">
        {{ page.title }}
      </h1>
      <span class="page-view__last-update">
        Последнее обновление: {{ getDate(page.updatedAt) }}
      </span>
    </div>

    <div class="ql-snow">
      <div class="page-view__content ql-editor" v-html="page.content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import type { Page } from '@/interfaces'

const route = useRoute()

const page: Ref<Page | null> = ref(null)

const { data } = await useFetch<Page>('/api/pages/' + route.params.slug)
if (data.value) {
  page.value = data.value
}

const getDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU')
}

useHead({
  title: page.value?.title
})
</script>

<style lang="scss">
.page-view {
  width: 100%;
  height: 100%;
  padding-bottom: 40px;
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    margin-top: 20px;
  }
  &__title {
    margin: 0;
    padding-left: 15px;
    font-size: 22px;
    line-height: 1.1;
    position: relative;
    &::before {
      content: "";
      top: 0;
      left: 0;
      width: 3.5px;
      height: 100%;
      border-radius: 3px;
      background-color: var(--primary-color);
      position: absolute;
    }
  }
  &__last-update {
    text-align: right;
    font-weight: 500;
    color: var(--text-color-secondary);
  }
  &__content {
    min-height: 300px;
    margin-top: 20px;
    padding: 20px 40px 30px;
    border-radius: var(--border-radius);
    background-color: white;
  }

  @media screen and (max-width: 767px) {
    &__content {
      padding: 12px 20px 20px;
    }
  }
}
</style>
