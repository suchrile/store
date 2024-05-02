import JwtService from '@/server/services/jwt.service'

export default defineEventHandler((event) => {
  const accessToken = event.req.headers.authorization?.split(' ')[1]
  if (accessToken) {
    try {
      JwtService.decodeAccessToken(accessToken)
      event.context.authed = true
    } catch {
      event.context.authed = false
    }
  }
})
