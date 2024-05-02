import PagesService from '@/server/services/pages.service'
import { pageUpdateSchema } from '@/server/schemas/pages'

export default defineEventHandler(async (event) => {
  if (!event.context.authed) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const params = event.context.params!
  const body = await readBody(event)

  const { value, error } = pageUpdateSchema.validate({
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

  return PagesService.update(id, dto)
})
