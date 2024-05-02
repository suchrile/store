<template>
  <div class="image-upload overflow-hidden">
    <MyImage
      :src="uploadedImageUrl || src"
      upload
      :remove="!!uploadedImageUrl || !!src"
      :show-labels="showLabels"
      class="image-upload__preview w-full h-full"
      @upload="imageInput.click()"
      @remove="remove"
    />
    <input
      ref="imageInput"
      type="file"
      accept="image/*"
      :hidden="true"
      @change="upload"
    >
  </div>
</template>

<script setup lang="ts">
import type { PropType, Ref } from 'vue'

defineProps({
  src: { type: String as PropType<string | null>, default: null },
  showLabels: { type: Boolean, default: true }
})
const emit = defineEmits(['upload', 'remove'])

const imageInput = ref()
const uploadedImageUrl: Ref<string | null> = ref(null)

const upload = (event: InputEvent) => {
  const target = event.target as HTMLInputElement
  const files = target.files as FileList
  const reader = new FileReader()
  reader.onload = (event) => {
    uploadedImageUrl.value = String(event.target?.result)
    emit('upload', uploadedImageUrl.value)
  }
  reader.readAsDataURL(files[0])
}
const remove = () => {
  uploadedImageUrl.value = null
  imageInput.value.value = null
  emit('remove')
}
</script>

<style scoped lang="scss"></style>
