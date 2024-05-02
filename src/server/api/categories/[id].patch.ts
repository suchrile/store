import CategoriesService from '@/server/services/categories.service'
import { undeletableCategoryId } from '@/consts'
import { categoryUpdateSchema } from '@/server/schemas/categories'

export default defineEventHandler(async (event) => {
  if (!event.context.authed) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const params = event.context.params!
  const body = await readBody(event)

  const { value, error } = categoryUpdateSchema.validate({
    id: +params.id,
    body
  })

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  const { id, body: dto } = value

  if (dto.parentId && dto.parentId === undeletableCategoryId) {
    throw createError({
      statusCode: 400,
      message: `The parent category identifier cannot be equal to ${undeletableCategoryId}.`
    })
  }

  return CategoriesService.update(id, dto)
})
