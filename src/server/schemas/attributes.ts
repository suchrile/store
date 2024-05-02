import joi from 'joi'
import type { ProductAttributeSelectOption } from '@prisma/client'
import type { AttributeCreateDto, AttributeUpdateDto } from '@/interfaces'

export const attributeIdSchema = joi.number().integer().positive()
export const attributeIdsSchema = joi
  .array<number[]>()
  .items(attributeIdSchema)
const attributeOptionsSchema = joi.array<ProductAttributeSelectOption>().items(
  joi.object({
    id: joi.number().integer().positive().optional(),
    attributeId: joi.number().strip(),
    label: joi.string().required()
  })
)

export const attributeCreateSchema = joi
  .object<AttributeCreateDto>({
    name: joi.string().required(),
    dataType: joi.string().required(),
    unit: joi.string().min(0).allow(null).optional(),
    showInCatalog: joi.boolean().optional(),
    sortable: joi.boolean().optional(),
    filterable: joi.boolean().optional(),
    options: attributeOptionsSchema.optional()
  })
  .required()

export const attributeUpdateSchema = joi
  .object({
    id: attributeIdSchema.required(),
    body: joi.object<AttributeUpdateDto>({
      id: attributeIdSchema.required(),
      name: joi.string().optional(),
      unit: joi.string().min(0).allow(null).optional(),
      dataType: joi.string().strip(),
      showInCatalog: joi.boolean().optional(),
      sortable: joi.boolean().optional(),
      filterable: joi.boolean().optional(),
      options: attributeOptionsSchema.optional(),
      categories: joi.any().strip()
    })
  })
  .required()
