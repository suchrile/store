import slugify from 'slugify'
import { prisma } from '@/server/repositories'
import CategoriesRepository from '@/server/repositories/categories.repository'
import ProductsService from '@/server/services/products.service'
import { transformCategory } from '@/server/transformers/category'
import type { CategoryCreateDto, CategoryUpdateDto } from '@/interfaces'

class CategoriesService {
  private readonly _repository
  private readonly _productsService

  constructor () {
    this._repository = CategoriesRepository
    this._productsService = ProductsService
  }

  create (dto: CategoryCreateDto) {
    const slug = this._getSlug(dto.name)
    return this._repository.create(dto, slug)
  }

  update (id: number, dto: CategoryUpdateDto) {
    const slug = dto.name && this._getSlug(dto.name)
    return this._repository.update(id, { ...dto, slug })
  }

  async findOneById (id: number) {
    const category = await this._repository.findOneById(id)
    if (category) {
      return transformCategory(category)
    }
    return null
  }

  async findOneBySlug (slug: string) {
    const category = await this._repository.findOneBySlug(slug)
    if (category) {
      return transformCategory(category)
    }
    return null
  }

  findMany () {
    return this._repository.findMany()
  }

  async deleteOne (id: number) {
    const products = await this._productsService.findManyWhereCertainCategories(
      [id]
    )
    const changeProductsCategoryPromises = products.reduce(
      (acc: any[], product) => {
        acc.push(this._productsService.setDefaultCategory(product.id))
        return acc
      },
      []
    )
    const categoriesDeletePromise = this._repository.deleteOne(id)

    return prisma.$transaction([
      ...changeProductsCategoryPromises,
      categoriesDeletePromise
    ])
  }

  async deleteMany (ids: number[]) {
    const products = await this._productsService.findManyWhereCertainCategories(
      ids
    )
    const changeProductsCategoryPromises = products.reduce(
      (acc: any[], product) => {
        acc.push(this._productsService.setDefaultCategory(product.id))
        return acc
      },
      []
    )
    const categoriesDeletePromise = this._repository.deleteMany(ids)

    return prisma.$transaction([
      ...changeProductsCategoryPromises,
      categoriesDeletePromise
    ])
  }

  private _getSlug = (value: string) => {
    return slugify(value + ' ' + Date.now(), {
      locale: 'ru',
      lower: true,
      strict: true
    })
  }
}

export default new CategoriesService()
