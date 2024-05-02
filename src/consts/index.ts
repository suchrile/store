import { AttributeDataType, SortOrder } from '@/interfaces'

export const undeletableCategoryId = 1

export const imagePlaceholderUrl = '/product-placeholder.svg'

export const ProductAttributeDataTypes = [
  { label: 'Выбор', value: AttributeDataType.SELECT },
  { label: 'Текст', value: AttributeDataType.STRING },
  { label: 'Целое число', value: AttributeDataType.INTEGER },
  { label: 'Дробное число', value: AttributeDataType.FLOAT },
  { label: 'Булево значение', value: AttributeDataType.BOOLEAN },
  { label: 'Дата', value: AttributeDataType.DATE }
]

export const productStatuses = [
  { value: true, label: 'Скрыт' },
  { value: false, label: 'Активен' }
]

export const productAttributeBooleanOptions = [
  { label: 'Да', value: true },
  { label: 'Нет', value: false }
]

export const productAttributeBoolean = {
  true: 'Да',
  false: 'Нет'
}

export const sortOrders: SortOrder[] = [
  { label: 'По возрастанию', name: 'asc', value: 1 },
  { label: 'По убыванию', name: 'desc', value: -1 }
]

export const includeOptions = {
  images: true,
  categories: true,
  attributes: {
    include: {
      attribute: { include: { options: true } },
      stringValue: true,
      integerValue: true,
      floatValue: true,
      booleanValue: true,
      dateValue: true,
      selectValue: { include: { option: true } }
    }
  }
}
