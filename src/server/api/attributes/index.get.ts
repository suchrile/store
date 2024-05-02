import attributesService from '@/server/services/attributes.service'

export default defineEventHandler(() => {
  return attributesService.findMany()
})
