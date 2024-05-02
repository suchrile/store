import { PrismaPromise } from '.prisma/client'
import { prisma } from '@/server/repositories/index'
import type {
  Link,
  LinkCreateDto,
  LinkUpdateDto,
  LinkUpdateManyDto
} from '@/interfaces'

class LinksRepository {
  private readonly _repository

  constructor () {
    this._repository = prisma.link
  }

  create (dto: LinkCreateDto) {
    return this._repository.create({ data: dto })
  }

  findOne (id: number) {
    return this._repository.findUnique({ where: { id } })
  }

  findMany () {
    return this._repository.findMany()
  }

  update (id: number, dto: LinkUpdateDto) {
    return this._repository.update({ where: { id }, data: dto })
  }

  async updateMany (dto: LinkUpdateManyDto) {
    const promises: PrismaPromise<Link>[] = []
    dto.forEach((link) => {
      promises.push(
        this.update(link.id, { ...link, sortOrder: link.sortOrder })
      )
    })
    await prisma.$transaction(promises)
    return this.findMany()
  }

  deleteOne (id: number) {
    return this._repository.delete({ where: { id } })
  }

  deleteMany (ids: number[]) {
    return this._repository.deleteMany({ where: { id: { in: ids } } })
  }
}

export default new LinksRepository()
