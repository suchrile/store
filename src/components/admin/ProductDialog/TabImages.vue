<template>
  <div class="product-dialog-images-tab images">
    <div class="field mb-4">
      <label
        for="product-dialog-images-tab-images-main"
        class="mb-3"
      >Основное изображение</label>
      <ImageUpload
        id="product-dialog-images-tab-images-main"
        :src="primary?.url"
        class="images__main border-round"
        style="aspect-ratio: 1.5/1"
        @upload="handlePrimaryUpload"
        @remove="deleteImage(primary!.tempId)"
      />
    </div>

    <div class="field mb-0">
      <label
        for="images-additional"
        class="mb-3"
      >Дополнительные изображения</label>
      <ScrollView :max-height="205" vertical>
        <div id="images-additional" class="images__additional">
          <div
            class="images__additional-upload"
            @click="additionalImagesInput.click()"
          >
            <i class="pi pi-plus" />
          </div>
          <input
            ref="additionalImagesInput"
            type="file"
            accept="image/*"
            multiple
            hidden
            @change="handleAdditionalUpload"
          >
          <TransitionGroup name="list">
            <MyImage
              v-for="image in additional"
              :key="image.tempId"
              :src="image.url"
              :data-temp-id="image.tempId"
              preview
              remove
              class="border-round image-preview"
              style="aspect-ratio: 1.5/1"
              @remove="deleteImage(image.tempId)"
            />
          </TransitionGroup>
        </div>
      </ScrollView>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef, PropType } from 'vue'
import { v4 as uuid } from 'uuid'
import type { ProductDialogImageTabProp } from '@/interfaces'

const props = defineProps({
  images: {
    type: Array as PropType<ProductDialogImageTabProp[]>,
    default: () => [],
    required: true
  },
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['update:images'])

const additionalImagesInput = ref()

const primary: ComputedRef<ProductDialogImageTabProp | undefined> = computed(
  () => props.images.find(img => img.isPrimary)
)
const additional: ComputedRef<ProductDialogImageTabProp[]> = computed(() =>
  props.images.filter(img => !img.isPrimary)
)

const deleteImage = (tempId: string) => {
  emit(
    'update:images',
    props.images.filter(img => img.tempId !== tempId)
  )
}

const handlePrimaryUpload = (url: string) => {
  const toEmit = props.images.filter(
    img => !img.isPrimary && img.url !== url
  )
  emit('update:images', [...toEmit, { tempId: uuid(), url, isPrimary: true }])
}

const handleAdditionalUpload = (event: InputEvent) => {
  const target = event.target as HTMLInputElement
  const files = target.files as FileList
  for (const file of files) {
    const reader = new FileReader()
    reader.onload = (event) => {
      const url = event.target!.result
      if (!props.images.find(img => img.url === url)) {
        emit('update:images', [...props.images, { tempId: uuid(), url }])
      }
    }
    reader.readAsDataURL(file)
  }
  additionalImagesInput.value.value = null
}
</script>

<style scoped lang="scss">
.images {
  .image-preview {
    box-shadow: 0 0 10px #00000015;
  }
  &__additional {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    &-upload {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #00000010;
      aspect-ratio: 1.5 / 1;
      box-shadow: 0 0 10px #00000015;
      border-radius: var(--border-radius);
      overflow: hidden;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;
      z-index: 1;
      & i {
        font-size: 38px;
        font-weight: 700;
        color: #00000040;
        transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;
      }
      &:hover {
        background-color: #00000020;
        & i {
          transform: scale(0.8);
          color: #00000050;
        }
      }
    }
  }
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.list-leave-active {
  max-width: calc(100% / 3 - 12px);
  position: absolute;
  z-index: 0;
}
</style>
