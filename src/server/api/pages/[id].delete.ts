import PagesService from '@/server/services/pages.service'
import { pageIdSchema } from '@/server/schemas/pages'

export default defineEventHandler((event) => {
  if (!event.context.authed) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const params = event.context.params!

  const { value: id, error } = pageIdSchema.validate(params.id)

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  return PagesService.deleteOne(id)
})
