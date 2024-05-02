import { prisma } from '@/server/repositories/index'

class ObjectsRepository {
  private readonly _repository

  constructor () {
    this._repository = prisma.object
  }

  create<T extends object> (dto: T) {
    return this._repository.create({ data: { data: dto } })
  }

  update<T extends object> (id: number, dto: T) {
    return this._repository.update({
      where: { id },
      data: { data: dto }
    })
  }

  upsert<T extends object> (id: number, dto: T) {
    return this._repository.upsert({
      where: { id },
      create: { data: dto },
      update: { data: dto }
    })
  }

  findOne (id: number) {
    return this._repository.findUnique({ where: { id } })
  }

  findMany (ids?: number[]) {
    return this._repository.findMany({ where: { id: { in: ids } } })
  }

  deleteOne (id: number) {
    return this._repository.delete({ where: { id } })
  }

  deleteMany (ids: number[]) {
    return this._repository.deleteMany({ where: { id: { in: ids } } })
  }
}

export default new ObjectsRepository()
