import ProductsService from '@/server/services/products.service'
import { productIdsSchema } from '@/server/schemas/products'

export default defineEventHandler(async (event) => {
  if (!event.context.authed) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const query = await getQuery(event)

  const { value: ids, error } = productIdsSchema.validate(query.ids)

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  return ProductsService.deleteMany(ids)
})
