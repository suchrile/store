import joi from 'joi'
import type { ProductCreateDto, ProductUpdateDto } from '@/interfaces'
import type { ProductFindManyArgs } from '@/server/types'

export const productIdSchema = joi.number().integer().positive()
export const productIdsSchema = joi.array().items(productIdSchema)

const productCategoryIdsSchema = joi.array().items(productIdSchema)

export const productQuerySchema = joi.object<ProductFindManyArgs>({
  search: joi.string().optional(),
  categoryId: joi.number().integer().positive().optional()
})

const imagesSchema = joi.array().items(
  joi.object({
    url: joi.string().uri().required(),
    isPrimary: joi.boolean().optional(),
    id: productIdSchema.optional(),
    productId: productIdSchema.optional(),
    publicId: joi.string().optional(),
    tempId: joi.any().optional()
  })
)

const attributesSchema = joi.array().items(
  joi.object({
    id: productIdSchema,
    value: joi
      .alternatives()
      .try(
        joi.array().items(
          joi.object({
            id: productIdSchema.required(),
            attributeId: productIdSchema.required(),
            label: joi.string().optional()
          })
        ),
        joi.date().iso(),
        joi.number(),
        joi.string(),
        joi.boolean()
      )
      .required()
  })
)

export const productCreateSchema = joi
  .object<ProductCreateDto>({
    name: joi.string().required(),
    description: joi.string().min(0).allow(null).optional(),
    hidden: joi.boolean().optional(),
    categoryIds: productCategoryIdsSchema.optional(),
    images: imagesSchema.optional(),
    attributes: attributesSchema.optional()
  })
  .required()

export const productUpdateSchema = joi
  .object({
    id: productIdSchema.required(),
    body: joi.object<ProductUpdateDto>({
      id: productIdSchema.optional(),
      name: joi.string().optional(),
      slug: joi.string().optional(),
      description: joi.string().min(0).allow(null).optional(),
      hidden: joi.boolean().optional(),
      categoryIds: productCategoryIdsSchema.optional(),
      categories: joi.any().optional(),
      images: imagesSchema.optional(),
      attributes: attributesSchema.optional()
    })
  })
  .required()
