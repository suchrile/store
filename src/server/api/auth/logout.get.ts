import AuthService from '@/server/services/auth.service'

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'refresh_token')

  if (!refreshToken) {
    return { message: 'OK' }
  }

  await AuthService.logout(refreshToken)

  deleteCookie(event, 'refresh_token')

  return { message: 'OK' }
})
