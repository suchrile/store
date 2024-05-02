import CategoriesService from '@/server/services/categories.service'
import { undeletableCategoryId } from '@/consts'
import { categoryCreateSchema } from '@/server/schemas/categories'

export default defineEventHandler(async (event) => {
  if (!event.context.authed) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const body = await readBody(event)

  const { value: dto, error } = categoryCreateSchema.validate(body)

  if (error) {
    throw createError({ statusCode: 400, message: error.message })
  }

  if (dto.parentId && dto.parentId === undeletableCategoryId) {
    throw new Error(
      `The parent category identifier cannot be equal to ${undeletableCategoryId}.`
    )
  }

  return CategoriesService.create(dto)
})
