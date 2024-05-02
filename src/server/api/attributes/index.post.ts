import AttributesService from '@/server/services/attributes.service'
import { attributeCreateSchema } from '@/server/schemas/attributes'

export default defineEventHandler(async (event) => {
  if (!event.context.authed) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const body = await readBody(event)

  const { value: dto, error } = attributeCreateSchema.validate(body)

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  return AttributesService.create(dto)
})
