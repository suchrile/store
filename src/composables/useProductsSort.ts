import type { Ref } from 'vue'
import { sortOrders } from '@/consts'
import { AttributeDataType } from '@/interfaces'
import type { Product, ProductSortField, SortOrder } from '@/interfaces'

export const useProductsSort = (value: Product[]) => {
  const router = useRouter()
  const route = useRoute()

  const products: Ref<Product[]> = ref(value)
  const sortableFields: Ref<ProductSortField[]> = ref([
    { field: 'name' as keyof Product, label: 'Наименование' }
  ])
  const currentSortField: Ref<ProductSortField> = ref(sortableFields.value[0])
  const sortOrder: Ref<SortOrder> = ref(sortOrders[0])

  const init = (value: Product[]) => {
    products.value = value
    initFields()
    initSort()
  }

  const initFields = () => {
    products.value.forEach((prod) => {
      prod.attributes.forEach((attr) => {
        const isAttributeFilterExists = sortableFields.value.some(
          filter => filter.attrId === attr.id
        )
        const isAttributeSortable =
          attr.sortable && attr.dataType !== AttributeDataType.SELECT
        if (!isAttributeFilterExists && isAttributeSortable) {
          sortableFields.value.push({ label: attr.name, attrId: attr.id })
        }
      })
    })
    currentSortField.value = sortableFields.value[0]
  }

  const initSort = () => {
    const sortQuery = route.query.sort
    const orderQuery = route.query.order
    if (!sortQuery || !orderQuery) { return }
    const sortTarget = String(sortQuery).split('-')[0]
    const sortValue = String(sortQuery).split('-')[1]
    if (sortTarget === 'field') {
      const field = sortableFields.value.find(f => f.field === sortValue)
      if (!field) { return }
      currentSortField.value = {
        field: sortValue as keyof Product,
        label: field.label
      }
    } else if (sortTarget === 'attr') {
      const field = sortableFields.value.find(f => f.attrId === +sortValue)
      if (!field) { return }
      currentSortField.value = {
        label: field.label,
        attrId: +sortValue
      }
    }
    const order = sortOrders.find(o => o.name === orderQuery)
    if (order) {
      sortOrder.value = order
    }
  }

  const setSort = async () => {
    await router.replace({
      query: {
        ...route.query,
        sort: currentSortField.value.attrId
          ? `attr-${currentSortField.value.attrId}`
          : `field-${currentSortField.value.field}`,
        order: sortOrder.value.name
      }
    })
  }

  const sort = async (newProducts: Product[]) => {
    products.value = newProducts
    await setSort()
    if (currentSortField.value.attrId) {
      return sortByAttribute()
    } else if (currentSortField.value.field) {
      return sortByField()
    }
    return products.value
  }

  const sortByField = () => {
    const field = currentSortField.value.field
    if (!field) { return products.value }
    return products.value.sort((a, b) => {
      return (
        sortOrder.value.value * String(a[field]).localeCompare(String(b[field]))
      )
    })
  }

  const sortByAttribute = () => {
    const attributeId = currentSortField.value.attrId
    const productsWithSortingAttribute: Product[] = []
    const productsWithoutSortingAttribute: Product[] = []

    products.value.forEach((product) => {
      if (
        product.attributes.some(
          attr => attr.id === attributeId && attr.value !== null
        )
      ) {
        productsWithSortingAttribute.push(product)
      } else {
        productsWithoutSortingAttribute.push(product)
      }
    })

    productsWithSortingAttribute.sort((a, b) => {
      const attrA = a.attributes.find(attr => attr.id === attributeId)!
      const attrB = b.attributes.find(attr => attr.id === attributeId)!
      let comparison
      if (
        attrA.dataType === AttributeDataType.INTEGER ||
        attrA.dataType === AttributeDataType.FLOAT
      ) {
        comparison = attrA.value - attrB.value
      } else if (attrA.dataType === AttributeDataType.STRING) {
        comparison = attrA.value.localeCompare(attrB.value)
      } else if (attrA.dataType === AttributeDataType.BOOLEAN) {
        comparison = attrA.value === attrB.value ? 0 : attrA.value ? -1 : 1
      }
      return sortOrder.value.value * comparison
    })

    return productsWithSortingAttribute.concat(productsWithoutSortingAttribute)
  }

  init(products.value)
  initSort()

  return {
    sortableFields,
    currentSortField,
    sortOrder,
    initFields,
    initSort,
    setSort,
    sort,
    init
  }
}
