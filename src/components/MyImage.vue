<template>
  <div class="image" :class="{ tinted }">
    <Image
      ref="image"
      :src="src || imagePlaceholderUrl"
      :preview="preview"
      class="image__preview w-full h-full flex align-items-center justify-content-center pointer-events-none"
    />
    <div
      class="image__overlay overlay w-full h-full grid top-0 left-0 m-0 absolute"
    >
      <div
        v-if="upload"
        class="overlay__action action upload col"
        @click="emit('upload')"
      >
        <div class="action__content">
          <i class="pi pi-cloud-upload text-2xl" />
          <span v-if="showLabels" class="line-height-1">Загрузить</span>
        </div>
      </div>
      <div
        v-if="preview"
        class="overlay__action action preview col"
        @click="triggerPreview"
      >
        <div class="action__content">
          <i class="pi pi-eye text-2xl" />
          <span v-if="showLabels" class="line-height-1">Посмотреть</span>
        </div>
      </div>
      <div
        v-if="remove"
        class="overlay__action action remove col"
        @click="emit('remove')"
      >
        <div class="action__content">
          <i class="pi pi-trash text-2xl" />
          <span v-if="showLabels" class="line-height-1">Удалить</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { imagePlaceholderUrl } from '@/consts'

defineProps({
  src: {
    type: String as PropType<string | null | undefined>,
    default: imagePlaceholderUrl
  },
  preview: { type: Boolean, default: false },
  upload: { type: Boolean, default: false },
  remove: { type: Boolean, default: false },
  showLabels: { type: Boolean, default: false },
  tinted: { type: Boolean, default: true }
})
const emit = defineEmits(['upload', 'remove'])

const image = ref()

const triggerPreview = () => {
  const trigger = image.value.$el.querySelector(
    '.p-image-preview-indicator'
  ) as HTMLButtonElement
  trigger.click()
}
</script>

<style scoped lang="scss">
.image {
  backdrop-filter: blur(0);
  overflow: hidden;
  position: relative;
  &.tinted {
    .action {
      &.preview:hover {
        background-color: #6366f1bf;
      }
      &.remove:hover {
        background-color: #ff3d32b2;
      }
      &.upload:hover {
        background-color: #3b82f6b2;
      }
    }
  }
}
.action {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0;
  opacity: 0;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    font-size: 13px;
    font-weight: 600;
    color: white;
  }
  &:hover {
    opacity: 1;
  }
}
</style>
