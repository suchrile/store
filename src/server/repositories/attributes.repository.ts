import { prisma } from '@/server/repositories'
import type {
  AttributeCreateDto,
  AttributeOptionCreateDto,
  AttributeUpdateDto
} from '@/interfaces'

class AttributesRepository {
  private readonly _repository
  private readonly _selectRepository

  constructor () {
    this._repository = prisma.productAttribute
    this._selectRepository = prisma.productAttributeSelectOption
  }

  async create (dto: AttributeCreateDto) {
    return await this._repository.create({
      data: {
        name: dto.name,
        dataType: dto.dataType,
        unit: dto.unit,
        showInCatalog: dto.showInCatalog,
        sortable: dto.sortable,
        filterable: dto.filterable,
        options: dto.options && { createMany: { data: dto.options } }
      }
    })
  }

  findOne (id: number) {
    return this._repository.findUnique({
      where: { id },
      include: { options: true }
    })
  }

  findMany (ids?: number[]) {
    return this._repository.findMany({
      where: { id: { in: ids } },
      include: { options: true }
    })
  }

  async update (id: number, dto: AttributeUpdateDto) {
    const existingOptionIds = dto.options
      ?.filter(option => option.id)
      .map(option => option.id)
    const optionsToCreate = dto.options?.filter(
      option => !option.id
    ) as AttributeOptionCreateDto[]

    await this._repository.update({
      where: { id },
      data: {
        name: dto.name,
        unit: dto.unit,
        showInCatalog: dto.showInCatalog,
        sortable: dto.sortable,
        filterable: dto.filterable,
        options: dto.options && {
          deleteMany: { id: { notIn: existingOptionIds } },
          createMany: { data: optionsToCreate }
        }
      }
    })

    return this.findOne(id)
  }

  deleteOne (id: number) {
    return this._repository.delete({ where: { id } })
  }

  deleteMany (ids: number[]) {
    return this._repository.deleteMany({ where: { id: { in: ids } } })
  }
}

export default new AttributesRepository()
