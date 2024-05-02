import CategoriesService from '@/server/services/categories.service'
import { categorySlugSchema } from '@/server/schemas/categories'

export default defineEventHandler((event) => {
  const params = event.context.params!

  const { value: slug, error } = categorySlugSchema.validate(params.id)

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  return CategoriesService.findOneBySlug(slug)
})
