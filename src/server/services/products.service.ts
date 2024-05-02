import slugify from 'slugify'
import { PrismaPromise } from '@prisma/client'
import ProductsRepository from '@/server/repositories/products.repository'
import ImagesService from '@/server/services/images.service'
import AttributesService from '@/server/services/attributes.service'
import { undeletableCategoryId } from '@/consts'
import { transformProduct } from '@/server/transformers/product'
import type {
  PrismaProductWithIncludes,
  ProductCreateDto,
  ProductUpdateDto
} from '@/interfaces'
import type { ProductFindManyArgs } from '@/server/types'

class ProductsService {
  private readonly _repository
  private readonly _imageService
  private readonly _attributesService

  constructor () {
    this._repository = ProductsRepository
    this._imageService = ImagesService
    this._attributesService = AttributesService
  }

  async create (dto: ProductCreateDto) {
    const categoryIdsToConnect = dto.categoryIds.map(id => ({ id }))

    const product = await this._catchErrors(
      this._repository.create({
        name: dto.name,
        description: dto.description,
        hidden: dto.hidden,
        categories: { connect: categoryIdsToConnect },
        slug: slugify(dto.name + ' ' + Date.now(), {
          locale: 'ru',
          lower: true,
          strict: true
        })
      })
    )

    if (dto.images) {
      await this._imageService.updateImages(
        product.id,
        product.images,
        dto.images
      )
    }

    if (dto.attributes) {
      await this._attributesService.setAttributes(product.id, dto.attributes)
    }

    return this.findOneById(product.id)
  }

  async update (id: number, dto: ProductUpdateDto) {
    const categoryIdsToConnect = dto.categoryIds?.map(cid => ({ id: cid }))

    const product = await this._catchErrors(
      this._repository.update(id, {
        name: dto.name,
        description: dto.description,
        hidden: dto.hidden,
        categories: dto.categoryIds && { set: categoryIdsToConnect },
        slug:
          dto.name &&
          slugify(dto.name + ' ' + Date.now(), {
            locale: 'ru',
            lower: true,
            strict: true
          })
      })
    )

    if (product && dto.images) {
      await this._imageService.updateImages(
        product.id,
        product.images,
        dto.images
      )
    }

    if (product && dto.attributes) {
      await this._attributesService.setAttributes(product.id, dto.attributes)
    }

    return this.findOneById(id)
  }

  setDefaultCategory (id: number) {
    return this._repository.connectCategories(id, [undeletableCategoryId])
  }

  async findOneById (id: number) {
    const product = await this._repository.findOneById(id)
    if (product) {
      return transformProduct(product)
    }
    return null
  }

  async findOneBySlug (slug: string) {
    const product = await this._repository.findOneBySlug(slug)
    if (product) {
      return transformProduct(product)
    }
    return null
  }

  findManyWhereCertainCategories (categoryIds: number[]) {
    return this._repository.findManyWhereCertainCategories(categoryIds)
  }

  async findMany (query: ProductFindManyArgs) {
    const products = await this._repository.findMany(query)
    return products.map(prod => transformProduct(prod))
  }

  deleteOne (id: number) {
    return this._repository.deleteOne(id)
  }

  deleteMany (ids: number[]) {
    return this._repository.deleteMany(ids)
  }

  private async _catchErrors (
    promise: PrismaPromise<PrismaProductWithIncludes>
  ) {
    try {
      return await promise
    } catch (error) {
      throw error
    }
  }
}

export default new ProductsService()
