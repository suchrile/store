import joi from 'joi'
import type { AuthLoginDto } from '@/server/types/auth'

export const LoginSchema = joi
  .object<AuthLoginDto>({
    username: joi.string().required(),
    password: joi.string().required()
  })
  .required()
