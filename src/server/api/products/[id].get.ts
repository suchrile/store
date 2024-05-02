import joi from 'joi'
import ProductsService from '@/server/services/products.service'

export default defineEventHandler((event) => {
  const params = event.context.params!

  const schema = joi.string().required()

  const { value: slug, error } = schema.validate(params.id)

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  return ProductsService.findOneBySlug(slug)
})
