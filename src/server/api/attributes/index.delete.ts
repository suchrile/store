import attributesService from '@/server/services/attributes.service'
import { attributeIdsSchema } from '@/server/schemas/attributes'

export default defineEventHandler((event) => {
  if (!event.context.authed) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const query = getQuery(event)

  const { value: ids, error } = attributeIdsSchema.validate(query.ids)

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  return attributesService.deleteMany(ids)
})
