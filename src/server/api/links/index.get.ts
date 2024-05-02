import LinksRepository from '@/server/repositories/links.repository'

export default defineEventHandler(() => {
  return LinksRepository.findMany()
})
