import ProductsService from '@/server/services/products.service'
import { productQuerySchema } from '@/server/schemas/products'

export default defineEventHandler((event) => {
  const query = getQuery(event)

  const { value, error } = productQuerySchema.validate(query)

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  return ProductsService.findMany(value)
})
