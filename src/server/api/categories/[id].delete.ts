import CategoriesService from '@/server/services/categories.service'
import { undeletableCategoryId } from '@/consts'
import { categoryIdSchema } from '@/server/schemas/categories'

export default defineEventHandler((event) => {
  if (!event.context.authed) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const params = event.context.params!

  const { value: id, error } = categoryIdSchema.validate(+params.id)

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  if (id === undeletableCategoryId) {
    throw createError({
      statusCode: 400,
      message: `The category with ID ${undeletableCategoryId} cannot be deleted.`
    })
  }

  return CategoriesService.deleteOne(id)
})
