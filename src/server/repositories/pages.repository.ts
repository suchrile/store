import { prisma } from '@/server/repositories/index'
import type { PageCreateDto, PageUpdateDto } from '@/interfaces'

class PagesRepository {
  private readonly _repository

  constructor () {
    this._repository = prisma.page
  }

  create (dto: PageCreateDto, slug: string) {
    return this._repository.create({ data: { ...dto, slug } })
  }

  findOne (slug: string) {
    return this._repository.findUnique({ where: { slug } })
  }

  findMany () {
    return this._repository.findMany()
  }

  update (id: number, dto: PageUpdateDto) {
    return this._repository.update({ where: { id }, data: dto })
  }

  deleteOne (id: number) {
    return this._repository.delete({ where: { id } })
  }

  deleteMany (ids: number[]) {
    return this._repository.deleteMany({
      where: { id: { in: ids } }
    })
  }
}

export default new PagesRepository()
