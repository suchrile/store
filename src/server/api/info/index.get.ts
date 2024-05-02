import InfoService from '@/server/services/info.service'

export default defineEventHandler(() => {
  return InfoService.get()
})
