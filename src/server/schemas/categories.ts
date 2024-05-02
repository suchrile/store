import joi from 'joi'
import { CategoryCreateDto, CategoryUpdateDto } from '~/interfaces'

export const categorySlugSchema = joi.string()
export const categoryIdSchema = joi.number().integer().positive()
export const categoryIdsSchema = joi
  .array<number[]>()
  .items(categoryIdSchema)
  .required()

export const categoryUpdateSchema = joi.object({
  id: joi.number().integer().positive().required(),
  body: joi
    .object<CategoryUpdateDto>({
      id: categoryIdSchema.optional(),
      name: joi.string().optional(),
      parentId: categoryIdSchema.allow(null).optional(),
      view: joi.valid('cards', 'table').optional()
    })
    .required()
})

export const categoryCreateSchema = joi
  .object<CategoryCreateDto>({
    name: joi.string().required(),
    parentId: categoryIdSchema.allow(null).optional(),
    view: joi.valid('cards', 'table').optional()
  })
  .required()
