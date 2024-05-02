<template>
  <div class="admin-categories-page">
    <h3>Список категорий</h3>

    <ui-tip target="categories" />

    <AdminDataTableToolbar
      v-model:search="filters.global.value"
      :delete-disabled="!selectedCategories.length"
      class="mb-4"
      @add="openDialog"
      @remove="confirmDeleteCategories"
    />

    <AdminCategoriesTable
      v-model:filters="filters"
      v-model:selected="selectedCategories"
      :value="nestedCategories"
      :loading="isCategoriesLoading"
      :paginator="true"
      @duplicate="duplicate"
      @edit="openDialog"
      @delete="confirmDeleteCategory"
    />

    <AdminCategoryDialog
      v-model:visible="isDialogOpen"
      :value="currentCategory"
      :categories="categories"
      :loading="isDialogLoading"
      @create="create"
      @update="update"
      @hide="dialogHideHandler"
    />
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { makeNested } from '@/helpers'
import { FilterMatchMode } from '@/interfaces'
import type {
  Category,
  CategoryDialogProp,
  DeleteManyResponse,
  DataTableFilterMeta
} from '@/interfaces'
import { undeletableCategoryId } from '~/consts'

const toast = useToast()
const confirm = useConfirm()

const categories: Ref<Category[]> = ref([])
const currentCategory: Ref<CategoryDialogProp> = ref({} as Category)
const selectedCategories: Ref<Category[]> = ref([])
const isCategoriesLoading: Ref<boolean> = ref(true)
const isDialogOpen: Ref<boolean> = ref(false)
const isDialogLoading: Ref<boolean> = ref(false)
const filters: Ref<DataTableFilterMeta> = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

const nestedCategories = computed(() =>
  makeNested(categories.value, 'id', 'parentId')
)

onMounted(async () => {
  await nextTick()
  await fetchCategories()
})

const create = async (category: CategoryDialogProp) => {
  isDialogLoading.value = true
  const { data } = await useApiCall<Category>('/api/categories', {
    method: 'POST',
    body: { ...category }
  })
  if (data) {
    categories.value.push(data)
    isDialogOpen.value = false
    toast.add({
      severity: 'success',
      summary: 'Категория создана',
      detail: `Категория «${data.name}» успешно создана.`,
      life: 3000
    })
  }
  isDialogLoading.value = false
}
const update = async (category: Category) => {
  isDialogLoading.value = true
  const { data } = await useApiCall<Category>(
    '/api/categories/' + category.id,
    {
      method: 'PATCH',
      body: {
        name: category.name,
        parentId: category.parentId,
        view: category.view
      }
    }
  )
  if (data) {
    const index = categories.value.findIndex(cat => cat.id === data.id)
    categories.value[index] = data
    isDialogOpen.value = false
    toast.add({
      severity: 'info',
      summary: 'Категория обновлена',
      detail: `Категория «${data.name}» успешно обновлена.`,
      life: 3000
    })
  }
  isDialogLoading.value = false
}
const deleteOne = async () => {
  const { data } = await useApiCall<Category>(
    '/api/categories/' + currentCategory.value.id,
    { method: 'DELETE' }
  )
  if (data) {
    toast.add({
      severity: 'warn',
      summary: 'Категория удалена',
      detail: `Категория «${currentCategory.value.name}» успешно удалена.`,
      life: 3000
    })
    await fetchCategories()
  }
}
const deleteMany = async () => {
  const selectedIds = selectedCategories.value.map(category => category.id)
  const { data } = await useApiCall<DeleteManyResponse>('/api/categories', {
    method: 'DELETE',
    body: selectedIds
  })
  if (data) {
    toast.add({
      severity: 'warn',
      summary: 'Категории удалены',
      detail: `Выбранные категории (${selectedIds.length}) успешно удалены.`,
      life: 3000
    })
    selectedCategories.value = []
    await fetchCategories()
  }
}
const duplicate = (category: Category) => {
  openDialog({
    name: category.name + ' копия',
    parentId: category.parentId,
    view: category.view
  })
}

const confirmDeleteCategory = (category: Category) => {
  currentCategory.value = category
  const childrenLength = category.children.length
  confirm.require({
    header: 'Удаление категории',
    message:
      `<p class="mb-2">Вы уверены, что хотите <b>удалить</b> категорию <b class="white-space-nowrap">«${currentCategory.value.name}»</b>?</p>` +
      (childrenLength
        ? ` <p class="mb-2">Все <b>подкатегории (${childrenLength})</b> также <b>будут удалены</b>.</p>`
        : '') +
      'Это действие <b>невозможно отменить</b>.',
    icon: 'pi pi-trash',
    acceptClass: 'p-button-danger',
    accept: () => deleteOne()
  })
}
const confirmDeleteCategories = () => {
  confirm.require({
    header: 'Удаление категорий',
    message: `<p class="mb-2">Вы уверены, что хотите <b>удалить</b> выбранные <b>(${selectedCategories.value.length}) категории</b>?</p><p class="mb-2">Все <b>подкатегории</b> также <b>будут удалены.</b></p> Это действие <b>невозможно отменить</b>.`,
    icon: 'pi pi-trash',
    acceptClass: 'p-button-danger',
    accept: () => deleteMany()
  })
}

const openDialog = (category: CategoryDialogProp) => {
  currentCategory.value = { ...category, view: category?.view || 'cards' }
  isDialogOpen.value = true
}
const dialogHideHandler = () => {
  currentCategory.value = {} as Category
}

const fetchCategories = async () => {
  const { data } = await useApiCall<Category[]>('/api/categories')
  if (data) {
    categories.value = data.sort((a, b) => {
      if (a.id === undeletableCategoryId) {
        return -1
      } else if (b.id === undeletableCategoryId) {
        return 0
      }
      return 0
    })
  }
  isCategoriesLoading.value = false
}

definePageMeta({
  layout: 'admin'
})
useHead({
  title: 'Категории'
})
</script>

<style lang="scss">
.admin-categories-page {
  .p-paginator-bottom {
    padding: 12px 0 0;
  }
}
</style>
