import { prisma } from '@/server/repositories'
import type { UserCreationAttrs } from '@/interfaces'

class UsersRepository {
  private readonly _repository

  constructor () {
    this._repository = prisma.user
  }

  create (data: UserCreationAttrs) {
    return this._repository.create({ data })
  }

  findOneById (id: number) {
    return this._repository.findUnique({ where: { id } })
  }

  findOneByUsername (username: string) {
    return this._repository.findUnique({ where: { username } })
  }

  update (id: number, data: UserCreationAttrs) {
    this._repository.update({ where: { id }, data })
  }
}

export default new UsersRepository()
