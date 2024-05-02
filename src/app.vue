<template>
  <div class="h-full">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toast
      position="bottom-right"
      success-icon="pi pi-check-circle"
      warn-icon="pi pi-exclamation-triangle"
      info-icon="pi pi-exclamation-circle"
      error-icon="pi pi-times-circle"
    />
    <ConfirmDialog>
      <template #message="slotProps">
        <div class="flex align-items-center pl-1" style="max-width: 500px">
          <i :class="slotProps.message.icon" style="font-size: 2rem" />
          <p class="mx-4 my-0" v-html="slotProps.message.message" />
        </div>
      </template>
    </ConfirmDialog>
    <NuxtLink
      href="/sitemap"
      style="
        position: absolute;
        top: -100vh;
        left: -100vw;
        opacity: 0;
        visibility: hidden;
      "
    />
  </div>
</template>

<script setup lang="ts">
import type { Info } from '@/interfaces'

const info = useInfo()

const { data } = await useFetch<Info>('/api/info')
if (data.value) {
  info.value = data.value
}
</script>
