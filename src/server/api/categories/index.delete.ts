import CategoriesService from '@/server/services/categories.service'
import { categoryIdsSchema } from '@/server/schemas/categories'

export default defineEventHandler(async (event) => {
  if (!event.context.authed) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const body = await readBody(event)

  const { value: dto, error } = categoryIdsSchema.validate(body)

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  return CategoriesService.deleteMany(dto)
})
