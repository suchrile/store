import CategoriesService from '@/server/services/categories.service'

export default defineEventHandler(() => {
  return CategoriesService.findMany()
})
