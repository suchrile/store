import attributesService from '@/server/services/attributes.service'
import { attributeIdSchema } from '@/server/schemas/attributes'

export default defineEventHandler((event) => {
  const params = event.context.params!

  const { value: id, error } = attributeIdSchema.validate(params.id)

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  return attributesService.findOne(id)
})
