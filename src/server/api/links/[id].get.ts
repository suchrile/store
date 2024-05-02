import LinksRepository from '@/server/repositories/links.repository'
import { linkIdSchema } from '@/server/schemas/links'

export default defineEventHandler((event) => {
  const params = event.context.params!

  const { value: id, error } = linkIdSchema.validate(params.id)

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  return LinksRepository.findOne(id)
})
