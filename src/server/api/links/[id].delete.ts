import LinksRepository from '@/server/repositories/links.repository'
import { linkIdSchema } from '@/server/schemas/links'

export default defineEventHandler((event) => {
  if (!event.context.authed) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const params = event.context.params!

  const { value: id, error } = linkIdSchema.validate(params.id)

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  return LinksRepository.deleteOne(id)
})
