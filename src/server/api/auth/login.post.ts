import AuthService from '@/server/services/auth.service'
import { LoginSchema } from '@/server/schemas/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { value: dto, error } = LoginSchema.validate(body)

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  const { accessToken, refreshToken } = await AuthService.login(dto)

  setCookie(event, 'refresh_token', refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: true
  })

  return { accessToken }
})
