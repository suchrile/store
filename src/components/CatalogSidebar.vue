<template>
  <aside class="attribute-filters">
    <div
      v-if="!isLoading && Object.keys(attributes).length"
      class="attribute-filters__list"
    >
      <div
        v-for="attr in attributes"
        :key="attr.id"
        class="attribute-filters__item attribute"
      >
        <h6 class="attribute__name">
          {{ attr.name + (attr.unit ? `, ${attr.unit}` : "") }}
        </h6>

        <UiSidebarFilterRange
          v-if="
            attr.dataType === AttributeDataType.INTEGER ||
              attr.dataType === AttributeDataType.FLOAT
          "
          v-model="filtersStateRange[attr.id]"
          :attribute="attr"
          @change="setFiltersState"
        />

        <UiSidebarFilterRadioButtons
          v-else-if="attr.dataType === AttributeDataType.BOOLEAN"
          v-model="filtersStateBoolean[attr.id]"
          :attribute="attr"
          :check-if-attribute-disabled="checkIfAttributeDisabled"
          @change="setFiltersState"
        />

        <UiSidebarFilterCheckboxes
          v-else
          v-model="filtersStateCheckbox[attr.id]"
          :attribute="attr"
          :check-if-attribute-disabled="checkIfAttributeDisabled"
          @change="setFiltersState"
        />

        <Divider class="m-0 py-3" />
      </div>
    </div>

    <div v-else-if="isLoading" class="attribute-filters__loading">
      <ProgressSpinner />
    </div>

    <div v-else class="attribute-filters__empty">
      Нет доступных для фильтрации атрибутов
    </div>

    <Button
      label="Сбросить все"
      :disabled="isResetButtonDisabled"
      class="attribute-filters__reset"
      @click="clearFiltersState()"
    />
  </aside>
</template>

<script setup lang="ts">
import type { PropType, Ref } from 'vue'
import type { LocationQuery } from 'vue-router'
import {
  AttributeDataType,
  AttributeFilter,
  AttributeFilterCheckboxValue,
  AttributeFiltersState,
  AttributeOption,
  AttributesFilter,
  AttributeValue,
  FilterStateBoolean,
  FilterStateCheckbox,
  FilterStateRange,
  Product,
  RouteQuery
} from '@/interfaces'

const props = defineProps({
  products: { type: Array as PropType<Product[]>, required: true }
})

const router = useRouter()

const attributes: Ref<AttributesFilter> = ref({})
const filtersStateRange: FilterStateRange = reactive({})
const filtersStateCheckbox: FilterStateCheckbox = reactive({})
const filtersStateBoolean: FilterStateBoolean = reactive({})
const isLoading: Ref<boolean> = ref(true)

onMounted(() => {
  initAttributes()
  isLoading.value = false

  watch(props, () => {
    isLoading.value = true
    resetState()
    initAttributes()
    isLoading.value = false
  })
})

const resetState = () => {
  Object.keys(attributes.value).forEach((aid) => {
    delete filtersStateRange[aid]
    delete filtersStateCheckbox[aid]
    delete filtersStateBoolean[aid]
  })
  attributes.value = {}
}

const isResetButtonDisabled = computed(() => {
  if (isLoading.value) {
    return true
  }
  const checkboxDefaults = Object.values(filtersStateCheckbox).every(val =>
    Object.values(val).every(val => !val)
  )
  const rangeDefaults = Object.keys(filtersStateRange).every((key) => {
    return (
      filtersStateRange[key][0] === attributes.value[key].min &&
      filtersStateRange[key][1] === attributes.value[key].max
    )
  })
  const booleanDefaults = Object.values(filtersStateBoolean).every(
    val => val === null
  )
  return checkboxDefaults && rangeDefaults && booleanDefaults
})

const initAttributes = () => {
  const selectAttributes = []
  const checkboxAttributes = []
  const booleanAttributes = []
  const rangeAttributes = []
  for (const product of props.products) {
    product.attributes.forEach((attr) => {
      if (!attr.filterable) { return }
      if (attributes.value[attr.id]) { return }
      attributes.value[attr.id] = {
        id: attr.id,
        name: attr.name,
        unit: attr.unit,
        dataType: attr.dataType,
        values: []
      }
      filtersStateCheckbox[attr.id] = {}
    })
    for (const attr of product.attributes) {
      if (!attr.filterable) { continue }
      switch (attr.dataType) {
        case AttributeDataType.INTEGER:
        case AttributeDataType.FLOAT:
          rangeAttributes.push(attr)
          break
        case AttributeDataType.SELECT:
          selectAttributes.push(attr)
          break
        case AttributeDataType.BOOLEAN:
          booleanAttributes.push(attr)
          break
        default:
          checkboxAttributes.push(attr)
      }
    }
    initSelectAttributes(selectAttributes)
    initCheckboxAttributes(checkboxAttributes)
    initRangeAttributes(rangeAttributes)
    initBooleanAttributes(booleanAttributes)
  }
  initFiltersState()
}

const initSelectAttributes = (attrs: AttributeValue[]) => {
  attrs.forEach((attr) => {
    attr.value.forEach((option: AttributeOption) => {
      const value = option.label
      if (!attributes.value[attr.id].values.includes(value)) {
        attributes.value[attr.id].values.push(value)
        filtersStateCheckbox[attr.id][value] = false
      }
    })
  })
}

const initCheckboxAttributes = (attrs: AttributeValue[]) => {
  attrs.forEach((attr) => {
    const value = attr.value
    if (!attributes.value[attr.id].values.includes(value)) {
      attributes.value[attr.id].values.push(value)
      filtersStateCheckbox[attr.id][value] = false
    }
  })
}

const initBooleanAttributes = (attrs: AttributeValue[]) => {
  attrs.forEach((attr) => {
    filtersStateBoolean[attr.id] = null
  })
}

const initRangeAttributes = (attrs: AttributeValue[]) => {
  attrs.forEach((attr) => {
    attributes.value[attr.id].values.push(attr.value)
  })
  attrs.forEach((attr) => {
    const min = Math.min(...attributes.value[attr.id].values)
    const max = Math.max(...attributes.value[attr.id].values)
    attributes.value[attr.id].min = min
    attributes.value[attr.id].max = max
    filtersStateRange[attr.id] = [min, max]
  })
}

const initFiltersState = () => {
  const routeQuery = router.currentRoute.value.query
  const query: RouteQuery = {}
  for (const queryKey in routeQuery) {
    if (!queryKey.includes('paf')) {
      continue
    }
    const filterKey = queryKey.replace('paf', '')
    const filterValue = routeQuery[queryKey]
    let decodedFilterValue: string[]
    if (Array.isArray(filterValue)) {
      decodedFilterValue = filterValue.map(el =>
        decodeURIComponent(String(el))
      )
    } else {
      decodedFilterValue = [decodeURIComponent(String(filterValue))]
    }
    query[filterKey] = decodedFilterValue
  }

  for (const filterKey in query) {
    const filterValue = query[filterKey]
    const isRangeValue =
      filterValue.length === 1 && ~filterValue[0].indexOf('~')
    if (isRangeValue) {
      const values = filterValue[0].split('~').map(val => +val)
      filtersStateRange[filterKey] = [values[0], values[1]]
    } else if (attributes.value[filterKey].dataType === 'boolean') {
      filtersStateBoolean[filterKey] = Boolean(filterValue[0])
    } else {
      filtersStateCheckbox[filterKey] = filterValue.reduce((attr, value) => {
        attr[value] = true
        return attr
      }, {} as { [key: string]: boolean })
    }
  }
}

const setFiltersState = () => {
  const query: LocationQuery = {}
  for (const filterKey in filtersStateCheckbox) {
    const filterValue = filtersStateCheckbox[filterKey]
    const values = Object.keys(filterValue)
      .filter(value => filterValue[value])
      .map(el => encodeURIComponent(el))
    if (values.length > 0) {
      query['paf' + filterKey] = values
    }
  }
  for (const filterKey in filtersStateRange) {
    const filterValue = filtersStateRange[filterKey]
    const attr = attributes.value[filterKey]
    if (attr.min !== filterValue[0] || attr.max !== filterValue[1]) {
      query['paf' + filterKey] = filterValue.join('~')
    }
  }
  for (const filterKey in filtersStateBoolean) {
    if (filtersStateBoolean[filterKey] !== null) {
      query['paf' + filterKey] = String(filtersStateBoolean[filterKey])
    }
  }
  router.replace({ query: { ...getNoFilterQuery(), ...query } })
}

const clearFiltersState = () => {
  for (const filterKey in filtersStateCheckbox) {
    filtersStateCheckbox[filterKey] = {} as AttributeFilterCheckboxValue
  }
  for (const filterKey in filtersStateRange) {
    const attr = attributes.value[filterKey]
    filtersStateRange[filterKey] = [attr.min!, attr.max!]
  }
  for (const filterKey in filtersStateBoolean) {
    filtersStateBoolean[filterKey] = null
  }
  router.replace({ query: getNoFilterQuery() })
}

const getNoFilterQuery = () => {
  const query = { ...router.currentRoute.value.query }
  Object.keys(query).forEach((key) => {
    if (key.includes('paf')) {
      delete query[key]
    }
  })
  return query
}

const checkIfAttributeDisabled = (attr: AttributeFilter, value: any) => {
  if (
    attr.dataType !== AttributeDataType.INTEGER &&
    attr.dataType !== AttributeDataType.FLOAT &&
    filtersStateCheckbox[attr.id][value]
  ) {
    return false
  }
  let currentFilter
  if (attr.dataType === AttributeDataType.BOOLEAN) {
    currentFilter = { [attr.id]: value }
  } else {
    currentFilter = {
      [attr.id]: { ...filtersStateCheckbox[attr.id], [String(value)]: true }
    }
  }
  const filter: AttributeFiltersState = {
    ...filtersStateCheckbox,
    ...filtersStateBoolean,
    ...filtersStateRange,
    ...currentFilter
  }
  const query = getQuery(filter)
  return !filterProducts(query)
}

const filterProducts = (query: RouteQuery) => {
  return props.products.some((product) => {
    return Object.keys(query).every((key) => {
      const filterValue = query[key]
      const attribute = product.attributes.find(attr => attr.id === +key)
      if (!attribute) {
        return false
      }
      const isRangeValue =
        filterValue.length === 1 && ~filterValue[0].indexOf('~')
      if (isRangeValue) {
        const minmax = filterValue[0].split('~')
        return attribute.value >= minmax[0] && attribute.value <= minmax[1]
      } else {
        return filterValue.some((value) => {
          return Array.isArray(attribute.value)
            ? attribute.value.some(option => option.label === value)
            : String(attribute.value) === value
        })
      }
    })
  })
}

const getQuery = (filter: AttributeFiltersState) => {
  const query: { [key: string]: string[] } = {}
  for (const filterKey in filter) {
    const filterValue = filter[filterKey]
    const isRangeAttribute = Array.isArray(filterValue)
    if (isRangeAttribute) {
      const attr = attributes.value[filterKey]
      if (attr.min !== filterValue[0] || attr.max !== filterValue[1]) {
        query[filterKey] = [filterValue.join('~')]
      }
    } else if (
      attributes.value[filterKey].dataType === AttributeDataType.BOOLEAN
    ) {
      if (filterValue !== null) {
        query[filterKey] = [String(filterValue)]
      }
    } else {
      const values = Object.keys(filterValue).filter(
        value => filterValue[value]
      )
      if (values.length > 0) {
        query[filterKey] = values
      }
    }
  }
  return query
}
</script>

<style scoped lang="scss">
.attribute-filters {
  padding: 15px 10px;
  border-radius: 10px;
  background-color: white;
  & .attribute {
    &__name {
      margin-top: 0;
      margin-bottom: 8px;
      padding: 0 5px;
      font-size: 15px;
    }
  }
  &__loading,
  &__empty {
    height: 430px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__loading {
    & .p-progress-spinner {
      width: 60px;
      height: 60px;
    }
  }
  &__empty {
    padding: 0 20px;
    text-align: center;
    color: var(--text-color-secondary);
  }
  &__reset {
    width: 100%;
    flex-shrink: 0;
  }

  @media screen and (max-width: 767px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-shrink: 0;
    min-height: 100%;
    &__loading,
    &__empty {
      flex-grow: 1;
    }
  }
}
</style>
