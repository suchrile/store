import AttributesService from '@/server/services/attributes.service'
import { attributeUpdateSchema } from '@/server/schemas/attributes'

export default defineEventHandler(async (event) => {
  if (!event.context.authed) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const params = event.context.params!
  const body = await readBody(event)

  const { value, error } = attributeUpdateSchema.validate({
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

  return AttributesService.update(id, dto)
})
