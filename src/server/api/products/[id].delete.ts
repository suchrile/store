import ProductsService from '@/server/services/products.service'
import { productIdSchema } from '@/server/schemas/products'

export default defineEventHandler((event) => {
  if (!event.context.authed) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const params = event.context.params!

  const { value: id, error } = productIdSchema.validate(params.id)

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  return ProductsService.deleteOne(id)
})
