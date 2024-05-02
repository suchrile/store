import joi from 'joi'
import type { RequestPriceMailDto } from '@/server/types/mail'

export const mailSchema = joi
  .object<RequestPriceMailDto>({
    name: joi.string().required(),
    email: joi.string().email().required(),
    company: joi.string().min(0).optional(),
    city: joi.string().min(0).optional(),
    phone: joi.string().min(0).optional(),
    comment: joi.string().min(0).optional()
  })
  .required()
