<template>
  <div class="catalog-products">
    <DataTable
      v-if="filteredTableData.length"
      :value="filteredTableData"
      striped-rows
      removable-sort
      scrollable
    >
      <Column
        field="name"
        header="Наименование"
        :sortable="true"
        :show-filter-match-modes="false"
        :show-filter-operator="false"
        :show-add-button="false"
        style="min-width: 250px"
      >
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="Поиск по наименованию"
            @input="filterCallback"
          />
        </template>
      </Column>
      <Column
        v-for="attr in attributes"
        :key="attr.id"
        :field="`attributes.${attr.id}`"
        :header="attr.name"
        :sortable="true"
        :show-filter-operator="false"
        :show-add-button="false"
        style="min-width: 150px"
      >
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="Введите значение"
            @input="filterCallback"
          />
        </template>
      </Column>
    </DataTable>

    <div v-else class="catalog-products__empty">
      <i class="pi pi-search text-5xl" />
      <span class="text-lg font-medium">
        {{
          route.name === "search-query"
            ? "По вашему запросу ничего не найдено"
            : "В этой категории пока нет товаров"
        }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType, Ref } from 'vue'
import type { Product } from '@/interfaces'
import {
  AttributeDataType,
  AttributeOption,
  AttributeValue
} from '@/interfaces'
import { productAttributeBooleanOptions } from '~/consts'

const props = defineProps({
  products: { type: Array as PropType<Product[]>, required: true }
})

interface TableRowData {
  id: number;
  name: string;
  attributes: { [id: string]: string };
  dbAttributes: Product['attributes'];
}

type ProductAttribute = {
  id: number;
  name: string;
};

const route = useRoute()

const tableData: Ref<TableRowData[]> = ref([])
const filteredTableData: Ref<TableRowData[]> = ref([])
const attributes: Ref<ProductAttribute[]> = ref([])

const getAttributeValue = (attribute?: AttributeValue) => {
  if (!attribute) {
    return '—'
  }
  let value
  if (attribute.dataType === AttributeDataType.SELECT) {
    value = attribute.value
      .map((option: AttributeOption) => option.label)
      .join(', ')
  } else if (attribute.dataType === AttributeDataType.DATE) {
    value = new Date(attribute.value).toLocaleDateString()
  } else if (attribute.dataType === AttributeDataType.BOOLEAN) {
    value = productAttributeBooleanOptions.find(
      option => option.value === attribute.value
    )!.label
  } else {
    value = attribute.value
  }
  return String(value)
}

const initAttributes = () => {
  attributes.value = props.products?.reduce((acc, product) => {
    product.attributes.forEach((pAttr) => {
      !acc.find(attr => attr.id === pAttr.id) &&
        pAttr.showInCatalog &&
        acc.push({
          id: pAttr.id,
          name: pAttr.name + (pAttr.unit ? `, ${pAttr.unit}` : '')
        })
    })
    return acc
  }, [] as ProductAttribute[])
}

const initTableData = () => {
  tableData.value = props.products.map((product) => {
    return {
      id: product.id,
      name: product.name,
      attributes: attributes.value.reduce((acc, attr) => {
        acc[attr.id] = getAttributeValue(
          product.attributes.find(pAttr => pAttr.id === attr.id)
        )
        return acc
      }, {} as TableRowData['attributes']),
      dbAttributes: product.attributes
    }
  })
}

const filterDataTable = () => {
  const query = getFilterQuery()
  filteredTableData.value = tableData.value.filter((product) => {
    return Object.keys(query).every((key) => {
      const queryValue = query[key]
      let value
      if (Array.isArray(queryValue)) {
        value = queryValue.map(el => decodeURIComponent(String(el)))
      } else {
        value = [decodeURIComponent(String(queryValue))]
      }
      const attribute = product.dbAttributes.find(
        attr => attr.id === parseInt(key.replace('paf', ''))
      )
      if (!attribute) {
        return false
      }
      const isRangeValue = value.length === 1 && ~value[0].indexOf('~')
      if (isRangeValue) {
        const minmax = value[0].split('~')
        return attribute.value >= minmax[0] && attribute.value <= minmax[1]
      } else {
        return value.some((value) => {
          return Array.isArray(attribute.value)
            ? attribute.value.some(option => option.label === value)
            : String(attribute.value) === value
        })
      }
    })
  })
}

const getFilterQuery = () => {
  const query = { ...route.query }
  Object.keys(query).forEach((key) => {
    if (!key.includes('paf')) {
      delete query[key]
    }
  })
  return query
}

onMounted(() => {
  watch(props, () => {
    initAttributes()
    initTableData()
    filterDataTable()
  })
  watch(route, () => {
    filterDataTable()
  })
})

initAttributes()
initTableData()
filterDataTable()
</script>

<style lang="scss">
.catalog-products {
  border-radius: 10px;
  overflow: hidden;
  &__empty {
    height: 430px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__empty {
    flex-direction: column;
    gap: 15px;
    padding: 150px 20px;
    color: var(--text-color-secondary);
  }
  & th:first-child {
    border-radius: 10px 0 0 0;
  }
  & th:last-child {
    border-radius: 0 10px 0 0;
  }
  & tr:last-child {
    border-radius: 0 0 10px 10px;
  }
  & .p-sortable-column-icon {
    margin-left: 1rem !important;
  }

  @media screen and (max-width: 767px) {
    .catalog-products {
      &__empty {
        height: 100px;
      }
    }
  }
}
</style>
