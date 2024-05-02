<template>
  <div class="admin-attributes-page">
    <h3>Список атрибутов</h3>

    <AdminDataTableToolbar
      v-model:search="filters.global.value"
      :delete-disabled="!selectedAttributes.length"
      class="mb-4"
      @add="openDialog"
      @remove="confirmDeleteAttributes"
    />

    <DataTable
      v-model:selection="selectedAttributes"
      v-model:expanded-rows="expandedRows"
      v-model:filters="filters"
      :value="attributes"
      :rows="10"
      :sort-order="-1"
      :loading="isLoading"
      :paginator="true"
      :rows-per-page-options="[10, 20, 30]"
      :table-class="isLoading ? 'h-15rem' : ''"
      paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      current-page-report-template="Атрибутов на странице:"
      data-key="id"
      sort-field="_count.products"
      responsive-layout="scroll"
      filter-display="menu"
      removable-sort
      striped-rows
    >
      <Column
        selection-mode="multiple"
        style="width: 3rem"
        :exportable="false"
      />

      <Column field="name" header="Наименование" :sortable="true" />

      <Column
        field="dataType"
        header="Тип данных"
        :sortable="true"
        :show-filter-match-modes="false"
        style="max-width: 100px"
      >
        <template #body="slotProps">
          {{
            ProductAttributeDataTypes.find(
              (t) => t.value === slotProps.data.dataType
            ).label
          }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Dropdown
            v-model="filterModel.value"
            :options="ProductAttributeDataTypes"
            option-label="label"
            option-value="value"
            placeholder="Выберите тип"
            class="p-column-filter"
            style="min-width: 12rem"
            :show-clear="true"
            @change="filterCallback()"
          />
        </template>
      </Column>

      <Column
        field="unit"
        header="Единица измерения"
        :sortable="true"
        :show-filter-match-modes="false"
        style="max-width: 100px"
      >
        <template #body="slotProps">
          {{ slotProps.data.unit ?? "–" }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Dropdown
            v-model="filterModel.value"
            :options="units"
            placeholder="Единица измерения"
            class="p-column-filter"
            style="min-width: 12rem"
            :show-clear="true"
            @change="filterCallback()"
          >
            <template #option="slotProps">
              {{ slotProps.option || "–" }}
            </template>
          </Dropdown>
        </template>
      </Column>

      <Column :exportable="false" style="width: 200px">
        <template #body="slotProps">
          <div class="admin-table__row-actions">
            <Button
              v-tooltip.bottom="'Дублировать'"
              icon="pi pi-copy"
              class="p-button-rounded p-button-success p-button-outlined"
              @click="duplicateAttribute(slotProps.data)"
            />
            <Button
              v-tooltip.bottom="'Редактировать'"
              icon="pi pi-pencil"
              class="p-button-rounded p-button-info p-button-outlined"
              @click="openDialog(slotProps.data)"
            />
            <Button
              v-tooltip.bottom="'Удалить'"
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger p-button-outlined"
              @click="confirmDeleteAttribute(slotProps.data)"
            />
          </div>
        </template>
      </Column>

      <template v-if="!isLoading" #empty>
        <div class="flex align-items-center justify-content-center h-15rem">
          Не найдено ни одного атрибута.
        </div>
      </template>
    </DataTable>

    <AdminAttributeDialog
      v-model:visible="isAttributeEditDialogOpen"
      :value="currentAttribute"
      :loading="isDialogLoading"
      @create="create"
      @edit="update"
      @close="closeHandler"
    />
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef, Ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { ProductAttributeDataTypes } from '@/consts'
import { FilterMatchMode } from '@/interfaces'
import type {
  Attribute,
  AttributeDialogProp,
  DeleteManyResponse,
  DataTableFilterMeta
} from '@/interfaces'

const toast = useToast()
const confirm = useConfirm()

const attributes: Ref<Attribute[]> = ref([])
const currentAttribute: Ref<AttributeDialogProp> = ref({} as Attribute)
const selectedAttributes: Ref<Attribute[]> = ref([])
const isLoading: Ref<boolean> = ref(true)
const isDialogLoading: Ref<boolean> = ref(false)
const isAttributeEditDialogOpen: Ref<boolean> = ref(false)
const expandedRows: Ref<Attribute[]> = ref([])
const filters: Ref<DataTableFilterMeta> = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  dataType: { value: null, matchMode: FilterMatchMode.EQUALS },
  unit: { value: null, matchMode: FilterMatchMode.EQUALS }
})

const units: ComputedRef<(string | null)[]> = computed(() => [
  ...new Set(attributes.value.map(attr => attr.unit))
])

onMounted(async () => {
  await nextTick()
  await loadAttributes()
})

const create = async (attribute: Attribute) => {
  isDialogLoading.value = true
  const { data } = await useApiCall<Attribute>('/api/attributes', {
    method: 'POST',
    body: attribute
  })
  if (data) {
    attributes.value.push(data)
    isAttributeEditDialogOpen.value = false
    toast.add({
      severity: 'success',
      summary: 'Атрибут создан',
      detail: `Атрибут «${attribute.name}» успешно создан.`,
      life: 3000
    })
  }
  isDialogLoading.value = false
}
const update = async (attribute: Attribute) => {
  isDialogLoading.value = true
  const { data } = await useApiCall<Attribute>(
    '/api/attributes/' + attribute.id,
    { method: 'PATCH', body: attribute }
  )
  if (data) {
    const index = attributes.value.findIndex(attr => attr.id === data.id)
    attributes.value[index] = data
    isAttributeEditDialogOpen.value = false
    toast.add({
      severity: 'info',
      summary: 'Атрибут обновлен',
      detail: `Атрибут «${attribute.name}» успешно обновлен.`,
      life: 3000
    })
  }
  isDialogLoading.value = false
}
const removeOne = async () => {
  const attributeLabel = currentAttribute.value.name
  const { data } = await useApiCall<Attribute>(
    '/api/attributes/' + currentAttribute.value.id,
    { method: 'DELETE' }
  )
  if (data) {
    attributes.value = attributes.value.filter(
      cat => cat.id !== currentAttribute.value.id
    )
    isAttributeEditDialogOpen.value = false
    toast.add({
      severity: 'warn',
      summary: 'Атрибут удален',
      detail: `Атрибут «${attributeLabel}» успешно удален.`,
      life: 3000
    })
  }
}
const removeMany = async () => {
  const selectedIds = selectedAttributes.value.map(category => category.id)
  const { data } = await useApiCall<DeleteManyResponse>('/api/attributes', {
    method: 'DELETE',
    query: { ids: selectedIds }
  })
  if (data) {
    attributes.value = attributes.value.filter(
      cat => !selectedIds.includes(cat.id)
    )
    selectedAttributes.value = []
    toast.add({
      severity: 'warn',
      summary: 'Атрибуты удалены',
      detail: `Выбранные атрибуты (${data.count}) успешно удалены.`,
      life: 3000
    })
  }
}

const duplicateAttribute = (attribute: Attribute) => {
  openDialog({ ...attribute, id: undefined, name: attribute.name + ' копия' })
}

const openDialog = (attribute = {} as AttributeDialogProp) => {
  currentAttribute.value = { ...attribute }
  isAttributeEditDialogOpen.value = true
}

const confirmDeleteAttribute = (attribute: Attribute) => {
  currentAttribute.value = attribute
  confirm.require({
    header: 'Удаление атрибута',
    message: `<p class="mb-2">Вы уверены, что хотите <b>удалить</b> атрибут <b class="white-space-nowrap">«${currentAttribute.value.name}»</b>?</p><p class="mb-2">Этот атрибут <b>будет удален у всех товаров</b>, которые его используют.</p>Это действие <b>невозможно отменить</b>.`,
    icon: 'pi pi-trash',
    acceptClass: 'p-button-danger',
    accept: () => removeOne()
  })
}
const confirmDeleteAttributes = () => {
  confirm.require({
    header: 'Удаление атрибутов',
    message: `<p class="mb-2">Вы уверены, что хотите <b>удалить</b> выбранные <b>(${selectedAttributes.value.length}) атрибуты</b>?</p><p class="mb-2">Эти атрибуты <b>будут удалены у всех товаров</b>, которые их используют.</p>Это действие <b>невозможно отменить</b>.`,
    icon: 'pi pi-trash',
    acceptClass: 'p-button-danger',
    accept: () => removeMany()
  })
}

const closeHandler = () => {
  currentAttribute.value = {} as Attribute
}

const loadAttributes = async () => {
  const { data } = await useFetch<Attribute[]>('/api/attributes')
  if (!data.value) {
    return
  }
  attributes.value = data.value
  isLoading.value = false
}

definePageMeta({
  layout: 'admin'
})
useHead({
  title: 'Атрибуты'
})
</script>

<style lang="scss">
.admin-attributes-page {
  .p-datatable-loading-overlay {
    background-color: rgba(0, 0, 0, 0.1);
  }
  .p-datatable-loading-icon {
    color: var(--blue-500);
  }
  .p-paginator-bottom {
    padding: 12px 0 0;
  }
}

.p-datatable-row-expansion {
  & > td {
    padding: 15px 0 !important;
  }
}
</style>
