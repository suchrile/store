<template>
  <div class="admin-settings-page">
    <div class="flex align-items-center justify-content-between">
      <h3 class="admin-settings-page__title">
        Настройки
      </h3>
      <Button
        icon="pi pi-save"
        label="Сохранить"
        severity="warning"
        :loading="isLoading"
        class="p-button-outlined"
        @click="submit"
      />
    </div>
    <div v-if="info" class="admin-settings-page__content">
      <TabView
        v-model:active-index="activeTabIndex"
        @tab-change="handleTabChange"
      >
        <TabPanel header="Приложение">
          <AdminSettingsTabApp v-model="info.app" :loading="isLoading" />
        </TabPanel>
        <TabPanel header="Контакты">
          <AdminSettingsTabContacts
            v-model="info.contacts"
            :loading="isLoading"
          />
        </TabPanel>
        <TabPanel header="Панель управления">
          <AdminSettingsTabAdminPanel />
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import type { Ref } from 'vue'
import type { Info } from '@/interfaces'

const router = useRouter()
const toast = useToast()
const info = useInfo()

const activeTabIndex: Ref<number> = ref(0)
const isLoading: Ref<boolean> = ref(false)

onMounted(() => {
  initCurrentTab()
})

const submit = async () => {
  isLoading.value = true
  const { data } = await useApiCall<Info>('/api/info', {
    method: 'PATCH',
    body: info.value
  })
  if (data) {
    info.value = data
    toast.add({
      severity: 'success',
      summary: 'Информация обновлена',
      detail: 'Информация успешно обновлена.',
      life: 3000
    })
  }
  isLoading.value = false
}

const initCurrentTab = () => {
  const queryTab = router.currentRoute.value.query.tab
  if (queryTab) {
    activeTabIndex.value = +queryTab
  }
}

const handleTabChange = () => {
  router.replace({ query: { tab: activeTabIndex.value } })
}

definePageMeta({
  layout: 'admin'
})
useHead({
  title: 'Настройки'
})
</script>
