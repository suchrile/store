import ProductsService from '@/server/services/products.service'
import { productUpdateSchema } from '@/server/schemas/products'

export default defineEventHandler(async (event) => {
  if (!event.context.authed) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const params = event.context.params!

  const body = await readBody(event)

  const { value, error } = productUpdateSchema.validate({
    id: params.id,
    body
  })

  const { id, body: dto } = value

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  return ProductsService.update(id, dto)
})
