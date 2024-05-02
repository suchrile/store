import { compare } from 'bcrypt'
import JwtService from '@/server/services/jwt.service'
import UsersRepository from '@/server/repositories/users.repository'
import type { AuthLoginDto } from '@/server/types/auth'

class AuthService {
  protected readonly _jwtService

  constructor () {
    this._jwtService = JwtService
  }

  async login ({ username, password }: AuthLoginDto) {
    const user = await UsersRepository.findOneByUsername(username)

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Неправильное имя пользователя или пароль'
      })
    }

    const doesThePasswordMatch = await compare(password, user.password)

    if (!doesThePasswordMatch) {
      throw createError({
        statusCode: 401,
        message: 'Неправильное имя пользователя или пароль'
      })
    }

    const { accessToken, refreshToken } = await this._jwtService.generateTokens(
      user.id
    )

    return { accessToken, refreshToken }
  }

  logout (refreshToken: string) {
    return this._jwtService.removeRefreshToken(refreshToken)
  }
}

export default new AuthService()
