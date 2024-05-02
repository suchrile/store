<template>
  <DataTable
    :value="value"
    :expanded-rows="expanded"
    :selection="selected"
    :filters="filters"
    :loading="loading"
    :rows="10"
    :paginator="paginator"
    :rows-per-page-options="[10, 20, 30]"
    :sort-order="-1"
    :table-class="loading ? 'h-15rem' : ''"
    paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    current-page-report-template="Категорий на странице:"
    data-key="id"
    sort-field="_count.products"
    responsive-layout="scroll"
    filter-display="menu"
    striped-rows
    removable-sort
    @update:selection="emit('update:selected')"
    @update:filters="emit('update:filters')"
  >
    <Column :expander="true" header-style="width: 4rem">
      <template #body="slotProps">
        <Button
          v-if="slotProps.data.children.length"
          :icon="computeExpandIconName(slotProps.data)"
          class="p-row-toggler"
          @click="toggleExpansion(slotProps.data)"
        />
      </template>
    </Column>

    <Column selection-mode="single" style="width: 3rem" :exportable="false">
      <template #body="slotProps">
        <checkbox
          v-if="slotProps.data.id !== undeletableCategoryId"
          :model-value="checkIfCategorySelected(slotProps.data.id)"
          :binary="true"
          @input="toggleSelection(slotProps.data, $event)"
        />
      </template>
    </Column>

    <Column
      field="name"
      header="Наименование"
      :sortable="true"
      style="min-width: 16rem"
    />

    <Column
      field="_count.children"
      header="Количество подкатегорий"
      :sortable="true"
      style="max-width: 150px"
    />

    <Column
      field="_count.products"
      header="Количество товаров"
      :sortable="true"
      style="max-width: 150px"
    >
      <template #body="slotProps">
        {{ countProducts(slotProps.data) }}
      </template>
    </Column>

    <Column :exportable="false" style="width: 200px">
      <template #body="slotProps">
        <div class="admin-table__row-actions">
          <Button
            v-if="slotProps.data.id !== undeletableCategoryId"
            v-tooltip.bottom="'Дублировать'"
            icon="pi pi-copy"
            class="p-button-rounded p-button-success p-button-outlined"
            @click="emit('duplicate', slotProps.data)"
          />
          <Button
            v-tooltip.bottom="'Редактировать'"
            icon="pi pi-pencil"
            class="p-button-rounded p-button-info p-button-outlined"
            @click="emit('edit', slotProps.data)"
          />
          <Button
            v-if="slotProps.data.id !== undeletableCategoryId"
            v-tooltip.bottom="'Удалить'"
            icon="pi pi-trash"
            class="p-button-rounded p-button-danger p-button-outlined"
            @click="emit('delete', slotProps.data)"
          />
        </div>
      </template>
    </Column>

    <template v-if="!loading" #empty>
      <div class="flex align-items-center justify-content-center h-15rem">
        Не найдено ни одной категории.
      </div>
    </template>

    <template #expansion="slotProps">
      <div class="bg-blue-500" style="padding-left: 4px; margin-left: 25px">
        <AdminCategoriesTable
          :value="slotProps.data.children"
          :selected="selected"
          :expanded="expanded"
          :filters="filters"
          :loading="false"
          @duplicate="emit('duplicate', $event)"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
          @update:selected="emit('update:selected', $event)"
        />
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import type { PropType, Ref } from 'vue'
import { DataTableFilterMeta } from 'primevue/datatable'
import { undeletableCategoryId } from '@/consts'
import type { Category } from '@/interfaces'

const props = defineProps({
  value: { type: Array as PropType<Category[]>, default: () => [] },
  selected: { type: Array as PropType<Category[]>, default: () => [] },
  filters: { type: Object as PropType<DataTableFilterMeta>, required: true },
  loading: { type: Boolean, default: true },
  paginator: { type: Boolean, default: false }
})
const emit = defineEmits([
  'update:selected',
  'update:filters',
  'duplicate',
  'edit',
  'delete'
])

const expanded: Ref<Category[]> = ref([])

const countProducts = (category: Category) => {
  const count = category._count.products
  const countChildren = category.children.reduce(
    (acc, value) => acc + value._count.products,
    0
  )
  const countUnspecified = category._count.products - countChildren
  if (category.children.length && count > countChildren) {
    return `${count} (${countUnspecified} не распределено)`
  } else {
    return count
  }
}

const computeExpandIconName = (row: Category) => {
  return expanded.value.find(el => el.id === row.id)
    ? 'pi pi-chevron-down'
    : 'pi pi-chevron-right'
}
const toggleExpansion = (row: Category) => {
  if (expanded.value.find(cat => cat.id === row.id)) {
    expanded.value = expanded.value.filter(el => el.id !== row.id)
  } else {
    expanded.value = [...expanded.value, row]
  }
}

const checkIfCategorySelected = (id: number) =>
  !!props.selected.find(cat => cat.id === id)
const toggleSelection = (category: Category, isNotSelected: boolean) => {
  if (isNotSelected) {
    emit('update:selected', [...props.selected, category])
  } else {
    emit(
      'update:selected',
      props.selected.filter(cat => cat.id !== category.id)
    )
  }
}
</script>
