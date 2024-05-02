import PagesService from '@/server/services/pages.service'

export default defineEventHandler(() => {
  return PagesService.findMany()
})
