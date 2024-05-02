import slugify from 'slugify'
import PagesRepository from '@/server/repositories/pages.repository'
import type { PageCreateDto, PageUpdateDto } from '@/interfaces'

class PagesService {
  private readonly _repository

  constructor () {
    this._repository = PagesRepository
  }

  create (dto: PageCreateDto) {
    const slug = this._getSlug(dto.title)
    return this._repository.create(dto, slug)
  }

  update (id: number, dto: PageUpdateDto) {
    const slug = dto.title && this._getSlug(dto.title)
    return this._repository.update(id, { ...dto, slug })
  }

  findOne (slug: string) {
    return this._repository.findOne(slug)
  }

  findMany () {
    return this._repository.findMany()
  }

  deleteOne (id: number) {
    return this._repository.deleteOne(id)
  }

  deleteMany (ids: number[]) {
    return this._repository.deleteMany(ids)
  }

  private _getSlug (value: string) {
    return slugify(value, { locale: 'ru', strict: true, lower: true })
  }
}

export default new PagesService()
