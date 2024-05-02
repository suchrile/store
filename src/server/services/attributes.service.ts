import { ProductAttribute, ProductAttributeSelectOption } from '@prisma/client'
import { prisma } from '@/server/repositories'
import AttributesRepository from '@/server/repositories/attributes.repository'
import {
  AttributeCreateDto,
  AttributeDataType,
  AttributeUpdateDto
} from '@/interfaces'
import type { AttributeValue } from '@/interfaces'

class AttributesService {
  private readonly _repository
  private readonly _valuesRepository

  constructor () {
    this._repository = AttributesRepository
    this._valuesRepository = prisma.productAttributeValue
  }

  create (dto: AttributeCreateDto) {
    return this._repository.create(dto)
  }

  update (id: number, dto: AttributeUpdateDto) {
    return this._repository.update(id, dto)
  }

  findOne (id: number) {
    return this._repository.findOne(id)
  }

  findMany (ids?: number[]) {
    return this._repository.findMany(ids)
  }

  deleteOne (id: number) {
    return this._repository.deleteOne(id)
  }

  deleteMany (ids: number[]) {
    return this._repository.deleteMany(ids)
  }

  async setAttributes (productId: number, attributesValues: AttributeValue[]) {
    const attrValueIds = attributesValues.map(attrValue => attrValue.id)
    const attributes = await this.findMany(attrValueIds)
    const promises = []

    for (const attrValue of attributesValues) {
      const attribute = attributes.find(attr => attr.id === attrValue.id)
      if (!attribute) { continue }

      const upsertValuesPromise = this._setValues(
        productId,
        attribute,
        attrValue.value
      )
      promises.push(upsertValuesPromise)
    }

    const deleteValuesPromise = this._valuesRepository.deleteMany({
      where: { productId, attributeId: { notIn: attrValueIds } }
    })
    promises.push(deleteValuesPromise)

    return prisma.$transaction(promises)
  }

  private _setValues (
    productId: number,
    attribute: ProductAttribute,
    value: any
  ) {
    const attributeValue = this._getValueByDataType(attribute.dataType, value)
    const createOptions = this._getCreateOptions(attribute, attributeValue)
    const updateOptions = this._getUpdateOptions(attribute, attributeValue)
    return this._valuesRepository.upsert({
      where: {
        productId_attributeId: { productId, attributeId: attribute.id }
      },
      update: { [attribute.dataType + 'Value']: updateOptions },
      create: {
        product: { connect: { id: productId } },
        attribute: { connect: { id: attribute.id } },
        [attribute.dataType + 'Value']: createOptions
      }
    })
  }

  private _getValueByDataType (dataType: string, value: any) {
    if (dataType === AttributeDataType.SELECT) {
      return value.map((option: ProductAttributeSelectOption) => ({
        optionId: option.id
      }))
    }
    return value
  }

  private _getCreateOptions (attribute: ProductAttribute, value: any) {
    let createOptions
    if (attribute.dataType === AttributeDataType.SELECT) {
      createOptions = { createMany: { data: value } }
    } else {
      createOptions = { create: { value } }
    }
    return createOptions
  }

  private _getUpdateOptions (attribute: ProductAttribute, value: any) {
    const deleteOptions = this._getDeleteOptions(attribute, value)
    let updateOptions
    if (attribute.dataType === AttributeDataType.SELECT) {
      updateOptions = {
        ...deleteOptions,
        createMany: { data: value } // skipDuplicates: true
      }
    } else {
      updateOptions = { update: { value } }
    }
    return updateOptions
  }

  private _getDeleteOptions (attribute: ProductAttribute, value: any) {
    if (attribute.dataType !== AttributeDataType.SELECT) { return }
    return {
      deleteMany: {
        optionId: {
          notIn: value.map((option: ProductAttributeSelectOption) => option.id)
        }
      }
    }
  }
}

export default new AttributesService()
