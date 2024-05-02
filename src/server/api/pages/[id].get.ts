import PagesService from '@/server/services/pages.service'
import { pageSlugSchema } from '@/server/schemas/pages'

export default defineEventHandler((event) => {
  const params = event.context.params!

  const { value: slug, error } = pageSlugSchema.required().validate(params.id)

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  return PagesService.findOne(slug)
})
