import joi from 'joi'
import type { PageCreateDto, PageUpdateDto } from '@/interfaces'

export const pageIdSchema = joi.number().integer().positive()
export const pageSlugSchema = joi.string()

export const pageCreateSchema = joi
  .object<PageCreateDto>({
    title: joi.string().required()
  })
  .required()

export const pageUpdateSchema = joi.object({
  id: pageIdSchema.required(),
  body: joi
    .object<PageUpdateDto>({
      id: pageIdSchema.strip().optional(),
      slug: pageSlugSchema.strip().optional(),
      title: joi.string().optional(),
      content: joi.string().optional(),
      updatedAt: joi.any().strip()
    })
    .required()
})
