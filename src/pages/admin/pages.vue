<template>
  <div class="admin-pages">
    <div class="admin-pages__header header">
      <h3 class="header__title">
        Страницы
      </h3>
      <div class="flex gap-3">
        <div class="flex gap-2">
          <Button
            v-tooltip.bottom="'Добавить'"
            icon="pi pi-plus"
            label="Добавить"
            severity="success"
            class="p-button-outlined p-button-icon-only"
            @click="isDialogOpen = true"
          />
          <Button
            v-tooltip.bottom="'Удалить'"
            icon="pi pi-trash"
            label="Удалить"
            severity="danger"
            :loading="isLoading"
            :disabled="!pages.length"
            class="p-button-outlined p-button-icon-only"
            @click="confirmDelete"
          />
        </div>
        <div class="flex gap-2">
          <Button
            v-tooltip.bottom="'Предпросмотр'"
            icon="pi pi-external-link"
            label="Предпросмотр"
            severity="secondary"
            :disabled="!pages.length"
            class="p-button-outlined p-button-icon-only"
            @click="openPage"
          />
          <Button
            v-tooltip.bottom="'Редактировать'"
            icon="pi pi-pencil"
            label="Редактировать"
            severity="info"
            :disabled="!pages.length"
            class="p-button-outlined p-button-icon-only"
            @click="openDialog"
          />
        </div>
        <div>
          <Button
            v-tooltip.bottom="'Сохранить'"
            icon="pi pi-save"
            label="Сохранить"
            severity="warning"
            :loading="isLoading"
            :disabled="isSaveButtonDisabled"
            :class="isSaveButtonDisabled && 'p-button-outlined'"
            class="p-button-icon-only"
            @click="updateContent"
          />
        </div>
      </div>
    </div>

    <TabView
      v-if="pages.length"
      v-model:active-index="activePageIndex"
      scrollable
      @tab-change="handleTabChange"
    >
      <TabPanel v-for="page in pages" :key="page.id" :header="page.title">
        <div class="page">
          <AdminEditor v-model="content" />
        </div>
      </TabPanel>
    </TabView>

    <div
      v-else-if="isPagesLoading"
      class="flex align-items-center justify-content-center h-28rem"
    >
      <ProgressSpinner class="w-4rem -mt-8" />
    </div>

    <div v-else class="admin-pages__empty">
      <i class="pi pi-search text-4xl" />
      <span>Не найдено ни одной страницы</span>
    </div>

    <AdminPageDialog
      v-model:visible="isDialogOpen"
      :value="currentPage"
      :loading="isLoading"
      @create="create"
      @edit="update"
      @hide="handleDialogClose"
    />
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import type { Page } from '@/interfaces'

const toast = useToast()
const confirm = useConfirm()

const pages: Ref<Page[]> = ref([])
const currentPage: Ref<Page> = ref({} as Page)
const content: Ref<string> = ref('')
const activePageIndex: Ref<number> = ref(0)
const isDialogOpen: Ref<boolean> = ref(false)
const isLoading: Ref<boolean> = ref(false)
const isPagesLoading: Ref<boolean> = ref(true)

const isSaveButtonDisabled = computed(
  () =>
    !pages.value.length ||
    pages.value[activePageIndex.value]?.content === content.value
)

onMounted(async () => {
  await nextTick()
  await fetchPages()
})

const create = async (page: Page) => {
  isLoading.value = true
  const { data } = await useApiCall<Page>('/api/pages', {
    method: 'POST',
    body: page
  })
  if (data) {
    pages.value.push(data)
    activePageIndex.value = pages.value.length - 1
    content.value = pages.value[activePageIndex.value].content
    toast.add({
      severity: 'success',
      summary: 'Страница создана',
      detail: `Страница «${page.title}» успешно создана.`,
      life: 3000
    })
  }
  isDialogOpen.value = false
  isLoading.value = false
}
const update = async (page: Page) => {
  isLoading.value = true
  const { data } = await useApiCall<Page>('/api/pages/' + page.id, {
    method: 'PATCH',
    body: { title: page.title }
  })
  if (data) {
    pages.value[activePageIndex.value] = data
    toast.add({
      severity: 'info',
      summary: 'Страница обновлена',
      detail: `Страница «${data.title}» успешно обновлена.`,
      life: 3000
    })
  }
  isDialogOpen.value = false
  isLoading.value = false
}
const updateContent = async () => {
  isLoading.value = true
  const { data } = await useApiCall<Page>(
    '/api/pages/' + pages.value[activePageIndex.value].id,
    { method: 'PATCH', body: { content: content.value } }
  )
  if (data) {
    pages.value[activePageIndex.value] = data
    toast.add({
      severity: 'info',
      summary: 'Страница обновлена',
      detail: `Страница «${data.title}» успешно обновлена.`,
      life: 3000
    })
  }
  isLoading.value = false
}
const deletePage = async () => {
  isLoading.value = true
  const { data } = await useApiCall<Page>(
    '/api/pages/' + pages.value[activePageIndex.value].id,
    { method: 'DELETE' }
  )
  if (data) {
    pages.value = pages.value.filter(page => page.slug !== data.slug)
    activePageIndex.value = pages.value.length - 1
    content.value = pages.value[activePageIndex.value]?.content || ''
    toast.add({
      severity: 'warn',
      summary: 'Страница удалена',
      detail: `Страница «${data.title}» успешно удалена.`,
      life: 3000
    })
  }
  isLoading.value = false
}

const confirmDelete = () => {
  confirm.require({
    header: 'Удаление страницы',
    message: `<p class="mb-2">Вы уверены, что хотите <b>удалить</b> страницу <b>«${
      pages.value[activePageIndex.value].title
    }»</b>?</p>Это действие <b>невозможно отменить</b>.`,
    icon: 'pi pi-trash',
    acceptClass: 'p-button-danger',
    accept: () => deletePage()
  })
}

const openDialog = () => {
  currentPage.value = { ...pages.value[activePageIndex.value] }
  isDialogOpen.value = true
}

const openPage = () => {
  window.open('/pages/' + pages.value[activePageIndex.value].slug, '_blank')
}

const handleDialogClose = () => {
  currentPage.value = {} as Page
}

const handleTabChange = () => {
  content.value = pages.value[activePageIndex.value].content
}

const fetchPages = async () => {
  const { data } = await useApiCall<Page[]>('/api/pages')
  if (data && data.length) {
    pages.value = data.sort((a, b) => a.title.localeCompare(b.title))
    content.value = pages.value[activePageIndex.value].content
  }
  isPagesLoading.value = false
}

definePageMeta({
  layout: 'admin'
})
useHead({
  title: 'Страницы'
})
</script>

<style lang="scss">
.admin-pages {
  & .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 16px 0 6px;
    &__title {
      margin: 0;
    }
  }
  & .page {
    &__editor {
      margin-top: 15px;
      & .ql-editor {
        min-height: 400px;
      }
    }
  }
  &__empty {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 140px 20px 200px;
    font-size: 15px;
    text-align: center;
    color: var(--text-color-secondary);
  }
}
</style>
