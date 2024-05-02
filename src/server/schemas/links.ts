import joi from 'joi'
import type { LinkCreateDto, LinkUpdateDto } from '@/interfaces'
import { Link } from '@/interfaces'

export const linkIdSchema = joi.number().integer().positive()
export const linkIdsSchema = joi
  .array<number[]>()
  .items(linkIdSchema)
  .required()

export const linkCreateSchema = joi
  .object<LinkCreateDto>({
    title: joi.string().required(),
    url: joi.string().uri().required(),
    sortOrder: joi.number().integer().min(0).required(),
    newTab: joi.boolean().optional()
  })
  .required()

export const linkUpdateSchema = joi.object({
  id: linkIdSchema.required(),
  body: joi
    .object<LinkUpdateDto>({
      id: joi.number().integer().positive().optional(),
      title: joi.string().optional(),
      url: joi.string().uri().optional(),
      newTab: joi.boolean().optional(),
      sortOrder: joi.number().integer().min(0).optional()
    })
    .required()
})

export const linksUpdateSchema = joi
  .array<Link[]>()
  .items(
    joi.object<Link>({
      id: joi.number().integer().positive().required(),
      sortOrder: joi.number().integer().min(0).required(),
      title: joi.string().optional(),
      url: joi.string().uri().optional(),
      newTab: joi.boolean().optional()
    })
  )
  .required()
