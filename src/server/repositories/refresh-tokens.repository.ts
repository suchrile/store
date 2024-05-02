import { prisma } from '@/server/repositories/index'

class RefreshTokensRepository {
  private readonly _repository

  constructor () {
    this._repository = prisma.refreshToken
  }

  create (userId: number, token: string) {
    return this._repository.create({ data: { userId, token } })
  }

  getOne (token: string) {
    return this._repository.findUnique({ where: { token } })
  }

  remove (token: string) {
    return this._repository.delete({ where: { token } })
  }
}

export default new RefreshTokensRepository()
