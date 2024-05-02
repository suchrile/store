import type {
  PrismaProductWithIncludes,
  PrismaProductAttributeNotSelectValue
} from '@/interfaces'
import { AttributeDataType } from '@/interfaces'

export const transformProduct = (product: PrismaProductWithIncludes) => ({
  ...product,
  attributes: product.attributes.map((attr) => {
    const valueType = attr.attribute.dataType
    const valueField = attr[`${valueType}Value`]
    if (valueType === AttributeDataType.SELECT) {
      const value = attr.selectValue!.map(
        selectOption => selectOption.option
      )
      return { ...attr.attribute, value }
    } else {
      const field = valueField as PrismaProductAttributeNotSelectValue
      return { ...attr.attribute, value: field!.value }
    }
  })
})
