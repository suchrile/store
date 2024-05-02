<template>
  <div
    v-if="!isAuthChecked"
    class="h-full flex align-items-center justify-content-center"
  >
    <progress-spinner />
  </div>
  <div v-else>
    <ui-login-background />
    <div
      class="px-5 min-h-screen flex justify-content-center align-items-center"
    >
      <div
        class="border-1 surface-border surface-card border-round py-6 px-4 md:px-6 z-1"
      >
        <div class="mb-5">
          <div class="text-900 text-xl font-bold mb-2">
            Авторизация
          </div>
          <span class="text-600 font-medium">Введите данные для входа</span>
        </div>

        <form class="flex flex-column" @submit.prevent="submit">
          <div class="field mb-3">
            <span class="p-input-icon-left">
              <i class="pi pi-user" />
              <InputText
                id="sign-in-page-username"
                v-model.trim="formData.username"
                :disabled="isLoading"
                placeholder="Имя пользователя"
                class="w-full md:w-25rem"
              />
            </span>
          </div>

          <div class="field mb-5">
            <span class="p-input-icon-left">
              <i class="pi pi-lock" />
              <InputText
                id="sign-in-page-password"
                v-model.trim="formData.password"
                type="password"
                :disabled="isLoading"
                placeholder="Пароль"
                class="w-full md:w-25rem"
              />
            </span>
          </div>

          <Button
            type="submit"
            label="Войти"
            :loading="isLoading"
            :disabled="!isDataFullfilled"
            class="w-full mt-1"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { initAuth, useAuthLoading, useAccessToken, login } = useAuth()
const isLoading = useAuthLoading()
const isAuthChecked = ref(false)

const route = useRoute()
const info = useInfo()

onMounted(async () => {
  await nextTick()
  if (!route.query.redirected) {
    try {
      await initAuth()
    } catch {}
    if (useAccessToken().value) {
      await navigateTo('/admin')
    }
  }
  isLoading.value = false
  isAuthChecked.value = true
})

const formData = reactive({
  username: '',
  password: ''
})

const isDataFullfilled = computed(
  () => !!(formData.username && formData.password)
)

const submit = async () => {
  if (!isDataFullfilled.value) {
    return
  }
  try {
    await login(formData)
    await navigateTo('/admin')
  } catch (error) {
    formData.password = ''
  }
}

definePageMeta({
  layout: false
})
useHead({
  title: `Вход – Панель управления ${info.value.app.name}`
})
</script>
