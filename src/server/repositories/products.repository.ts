import { Prisma } from '@prisma/client'
import { prisma } from '@/server/repositories/index'
import { includeOptions } from '@/consts'
import type { ProductFindManyArgs } from '@/server/types'

class ProductsRepository {
  private readonly _repository

  constructor () {
    this._repository = prisma.product
  }

  create (dto: Prisma.ProductCreateInput) {
    return this._repository.create({
      data: dto,
      include: includeOptions
    })
  }

  update (id: number, dto: Prisma.ProductUpdateInput) {
    return this._repository.update({
      where: { id },
      data: dto,
      include: includeOptions
    })
  }

  findOneById (id: number) {
    return this._repository.findUnique({
      where: { id },
      include: includeOptions
    })
  }

  findOneBySlug (slug: string) {
    return this._repository.findUnique({
      where: { slug },
      include: includeOptions
    })
  }

  findManyWhereCertainCategories (categoryIds: number[]) {
    return this._repository.findMany({
      where: {
        categories: {
          every: { id: { in: categoryIds } },
          none: { id: { notIn: categoryIds } }
        }
      }
    })
  }

  findMany ({ categoryId, search }: ProductFindManyArgs) {
    return this._repository.findMany({
      where: {
        name: { contains: search, mode: 'insensitive' },
        categories: { some: { id: categoryId } }
      },
      include: includeOptions
    })
  }

  deleteOne (id: number) {
    return this._repository.delete({ where: { id } })
  }

  deleteMany (ids: number[]) {
    return this._repository.deleteMany({ where: { id: { in: ids } } })
  }

  connectCategories (id: number, categoryIds: number[]) {
    const categoryIdsConnectArray = categoryIds.map(id => ({ id }))
    return this._repository.update({
      where: { id },
      data: {
        categories: {
          connect: categoryIdsConnectArray
        }
      }
    })
  }
}

export default new ProductsRepository()
