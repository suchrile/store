import joi from 'joi'
import type { Info } from '@/interfaces'

export const infoSchema = joi
  .object<Info>({
    app: joi.object({
      name: joi.string().min(0).required(),
      description: joi.string().min(0).required(),
      keywords: joi.string().min(0).required(),
      defaultCategoryId: joi.number().integer().positive().required()
    }),
    contacts: joi.object({
      email: joi.string().email().allow('').required(),
      phoneNumbers: joi.array().items(joi.string()).required(),
      address: joi.string().min(0).required()
    })
  })
  .required()
