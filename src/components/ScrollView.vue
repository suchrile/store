<template>
  <div
    ref="wrapper"
    class="scroll"
    :class="{
      'scroll-x': horizontal,
      'scroll-y': vertical,
      'no-scrollbar': hideScrollbar,
    }"
    :style="{
      'max-height': maxHeight + 'px',
      'max-width': maxWidth + 'px',
      'padding-right': paddingRight,
      'padding-bottom': paddingBottom,
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  maxHeight: { type: Number, default: null },
  maxWidth: { type: Number, default: null },
  vertical: { type: Boolean, default: false },
  horizontal: { type: Boolean, default: false },
  hideScrollbar: { type: Boolean, default: false }
})

const wrapper = ref()
const height = ref()
const width = ref()
const resizeObserver = ref()

const paddingRight = computed(() =>
  props.maxHeight && props.maxHeight <= height.value ? 10 + 'px' : null
)
const paddingBottom = computed(() =>
  props.maxWidth && props.maxWidth <= width.value ? 10 + 'px' : null
)

onMounted(() => {
  resizeObserver.value = new ResizeObserver((entries) => {
    height.value = entries[0].contentRect.height
    width.value = entries[0].contentRect.width
  })
  resizeObserver.value.observe(wrapper.value)
})
onBeforeUnmount(() => {
  resizeObserver.value.disconnect()
})
</script>

<style scoped></style>
