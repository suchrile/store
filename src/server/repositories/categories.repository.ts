import { prisma } from '@/server/repositories'
import { includeOptions } from '@/consts'
import type { CategoryCreateDto, CategoryUpdateDto } from '@/interfaces'

class CategoriesRepository {
  private readonly _repository

  constructor () {
    this._repository = prisma.category
  }

  create (dto: CategoryCreateDto, slug: string) {
    return this._repository.create({
      data: { ...dto, slug },
      include: { _count: true }
    })
  }

  findOneById (id: number) {
    return this._repository.findUnique({
      where: { id },
      include: {
        children: true,
        products: { include: includeOptions }
      }
    })
  }

  findOneBySlug (slug: string) {
    return this._repository.findUnique({
      where: { slug },
      include: {
        parent: { select: { slug: true, name: true } },
        children: true,
        products: { include: includeOptions }
      }
    })
  }

  findMany () {
    return this._repository.findMany({ include: { _count: true } })
  }

  update (id: number, dto: CategoryUpdateDto) {
    return this._repository.update({
      where: { id },
      data: dto,
      include: { _count: true }
    })
  }

  deleteOne (id: number) {
    return this._repository.delete({ where: { id } })
  }

  deleteMany = (ids: number[]) => {
    return this._repository.deleteMany({ where: { id: { in: ids } } })
  }
}

export default new CategoriesRepository()
