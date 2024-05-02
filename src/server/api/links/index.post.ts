import LinksRepository from '@/server/repositories/links.repository'
import { linkCreateSchema } from '@/server/schemas/links'

export default defineEventHandler(async (event) => {
  if (!event.context.authed) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const body = await readBody(event)

  const { value: dto, error } = linkCreateSchema.validate(body)

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  return LinksRepository.create(dto)
})
