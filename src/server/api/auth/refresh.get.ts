import JwtService from '@/server/services/jwt.service'

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'refresh_token')

  if (!refreshToken) {
    throw createError({
      statusCode: 401,
      message:
        'Не удалось обновить токен доступа. Пожалуйста, авторизуйтесь снова'
    })
  }

  let accessToken

  try {
    accessToken = await JwtService.refreshAccessToken(refreshToken)
  } catch {
    throw createError({
      statusCode: 401,
      message: 'Ваша сессия истекла. Пожалуйста, авторизуйтесь снова'
    })
  }

  return { accessToken }
})
