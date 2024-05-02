export const useViewport = () => {
  const width = ref(0)

  const updateWidth = () => {
    width.value = window.innerWidth
  }

  onMounted(() => {
    window.addEventListener('resize', updateWidth)
    updateWidth()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateWidth)
  })

  return { width }
}
