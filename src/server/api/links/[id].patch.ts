import LinksRepository from '@/server/repositories/links.repository'
import { linkUpdateSchema } from '@/server/schemas/links'

export default defineEventHandler(async (event) => {
  if (!event.context.authed) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const params = event.context.params!
  const body = await readBody(event)

  const { value, error } = linkUpdateSchema.validate({
    id: params.id,
    body
  })

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  const { id, body: dto } = value

  return LinksRepository.update(id, dto)
})
