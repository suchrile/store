<template>
  <div class="admin-links-page">
    <h3 class="admin-links-page__title">
      Список ссылок
    </h3>

    <ui-tip target="links" />

    <AdminDataTableToolbar
      v-model:search="filters.global.value"
      :delete-disabled="!selected.length"
      class="admin-links-page__toolbar mb-4"
      @add="openDialog"
      @remove="confirmDeleteMany"
    />
    <div class="admin-links__table">
      <DataTable
        v-model:selection="selected"
        v-model:filters="filters"
        :value="links"
        :loading="isLoading"
        data-key="id"
        reorderable-columns
        removable-sort
        striped-rows
        paginator
        :rows="10"
        :rows-per-page-options="[10, 20, 30]"
        responsive-layout="scroll"
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        current-page-report-template="Ссылок на странице:"
        :table-class="isLoading ? 'h-15rem' : ''"
        class="admin-links-page__datatable"
        @row-reorder="onRowReorder($event)"
      >
        <Column
          row-reorder
          header-style="width: 3rem"
          :reorderable-column="false"
        />
        <Column
          selection-mode="multiple"
          style="width: 3rem"
          :exportable="false"
        />
        <Column field="title" header="Наименование" :sortable="true" />
        <Column field="url" header="Ссылка" :sortable="true" />
        <Column :exportable="false" style="width: 154px">
          <template #body="slotProps">
            <div class="admin-table__row-actions">
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
                @click="confirmDeleteOne(slotProps.data)"
              />
            </div>
          </template>
        </Column>

        <template v-if="!isLoading" #empty>
          <div class="flex align-items-center justify-content-center h-15rem">
            Не найдено ни одной ссылки.
          </div>
        </template>
      </DataTable>
    </div>
    <AdminLinksDialog
      v-model:visible="isDialogOpen"
      :value="current"
      :loading="isDialogLoading"
      @create="create"
      @edit="update"
      @hide="handleDialogHide"
    />
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import type { DataTableRowReorderEvent } from 'primevue/datatable'
import type { DeleteManyResponse, Link, LinkDialogProp } from '@/interfaces'
import { DataTableFilterMeta, FilterMatchMode } from '@/interfaces'

const toast = useToast()
const confirm = useConfirm()

const links: Ref<Link[]> = ref([])
const selected: Ref<Link[]> = ref([])
const current: Ref<LinkDialogProp> = ref({} as LinkDialogProp)
const isDialogOpen: Ref<boolean> = ref(false)
const isLoading: Ref<boolean> = ref(true)
const isDialogLoading: Ref<boolean> = ref(false)
const filters: Ref<DataTableFilterMeta> = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

onMounted(async () => {
  await nextTick()
  await fetchLinks()
})

const onRowReorder = async (event: DataTableRowReorderEvent) => {
  await updateMany(
    event.value.map((link, index) => ({ ...link, sortOrder: index }))
  )
}

const create = async (link: LinkDialogProp) => {
  isDialogLoading.value = true
  const { data } = await useApiCall<Link>('/api/links', {
    method: 'POST',
    body: { ...link, sortOrder: links.value.length + 1 }
  })
  if (data) {
    links.value.push(data)
    toast.add({
      severity: 'success',
      summary: 'Ссылка создана',
      detail: `Ссылка «${link.title}» успешно создана.`,
      life: 3000
    })
    isDialogOpen.value = false
  }
  isDialogLoading.value = false
}
const update = async (link: Link) => {
  isDialogLoading.value = true
  const { data } = await useApiCall<Link>('/api/links/' + link.id, {
    method: 'PATCH',
    body: link
  })
  if (data) {
    const index = links.value.findIndex(el => el.id === link.id)
    links.value[index] = data
    toast.add({
      severity: 'info',
      summary: 'Ссылка обновлена',
      detail: `Ссылка «${link.title}» успешно обновлена.`,
      life: 3000
    })
    isDialogOpen.value = false
  }
  isDialogLoading.value = false
}
const updateMany = async (toUpdate: Link[]) => {
  isLoading.value = true
  const { data } = await useApiCall<Link[]>('/api/links', {
    method: 'PATCH',
    body: toUpdate
  })
  if (data) {
    links.value = data
  }
  isLoading.value = false
}
const deleteOne = async () => {
  isLoading.value = true
  const title = current.value.title
  const { data } = await useApiCall<Link>('/api/links/' + current.value.id, {
    method: 'DELETE'
  })
  if (data) {
    links.value = links.value.filter(el => el.id !== data.id)
    toast.add({
      severity: 'warn',
      summary: 'Ссылка удалена',
      detail: `Ссылка «${title}» успешно удалена.`,
      life: 3000
    })
  }
  isLoading.value = false
}
const deleteMany = async () => {
  isLoading.value = true
  const selectedIds = selected.value.map(link => link.id)
  const { data } = await useApiCall<DeleteManyResponse>('/api/links', {
    method: 'DELETE',
    body: selectedIds
  })
  if (data) {
    links.value = links.value.filter(el => !selectedIds.includes(el.id))
    toast.add({
      severity: 'warn',
      summary: 'Ссылки удалены',
      detail: `Выбранные ссылки (${selectedIds.length}) успешно удалены.`,
      life: 3000
    })
    selected.value = []
  }
  isLoading.value = false
}

const confirmDeleteOne = (link: Link) => {
  current.value = link
  confirm.require({
    header: 'Удаление ссылки',
    message:
      `<p class="mb-2">Вы уверены, что хотите <b>удалить</b> ссылку <b>«${current.value.title}»</b>?</p>` +
      'Это действие <b>невозможно отменить</b>.',
    icon: 'pi pi-trash',
    acceptClass: 'p-button-danger',
    accept: () => deleteOne()
  })
}
const confirmDeleteMany = () => {
  confirm.require({
    header: 'Удаление ссылок',
    message: `<p class="mb-2">Вы уверены, что хотите <b>удалить</b> выбранные <b>(${selected.value.length}) ссылки</b>?</p></p> Это действие <b>невозможно отменить</b>.`,
    icon: 'pi pi-trash',
    acceptClass: 'p-button-danger',
    accept: () => deleteMany()
  })
}

const openDialog = (link: LinkDialogProp) => {
  current.value = { ...link }
  isDialogOpen.value = true
}
const handleDialogHide = () => {
  current.value = {} as Link
}

const fetchLinks = async () => {
  const { data } = await useApiCall<Link[]>('/api/links')
  if (data) {
    links.value = data.sort((a, b) => a.sortOrder - b.sortOrder)
  }
  isLoading.value = false
}

definePageMeta({
  layout: 'admin'
})
useHead({
  title: 'Ссылки'
})
</script>

<style lang="scss">
.admin-links-page {
  &__description {
    margin: 0 0 -5px 15px;
    & span {
      display: flex;
      align-items: center;
    }
    & i {
      font-size: 16px;
      padding: 6px;
      margin: 0 8px 0 8px;
      border-radius: var(--border-radius);
      background-color: white;
    }
  }

  & .p-datatable-loading-overlay {
    background-color: rgba(0, 0, 0, 0.1);
  }
  & .p-datatable-loading-icon {
    color: var(--blue-500);
  }
  & .p-paginator-bottom {
    padding: 12px 0 0;
  }
}
</style>
