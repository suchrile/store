<template>
  <Dialog
    header="Запрос прайс-листа"
    :modal="true"
    :visible="visible"
    :closable="!isLoading"
    :close-on-escape="!isLoading"
    :style="{ width: '450px' }"
    class="p-fluid"
    @update:visible="$emit('update:visible', $event)"
    @hide="hideHandler"
    @keydown.enter="submit"
  >
    <div v-if="!isSubmitted" class="request-price-form">
      <div class="field">
        <label for="request-price-name">
          Ваше имя
          <span v-if="v$.name" class="text-red-500">*</span>
        </label>
        <InputText
          id="request-price-name"
          v-model.trim="formData.name"
          :disabled="isLoading"
          placeholder="Иванов Иван Иванович"
          :class="{ 'p-invalid': v$.$dirty && v$.name.$errors.length }"
          autofocus
        />
        <div v-if="v$.$dirty && v$.name?.$errors.length" class="mt-1">
          <small
            v-for="error in v$.name.$errors"
            :key="error.$uid"
            class="block p-error"
          >{{ error.$message }}</small>
        </div>
      </div>

      <div class="field">
        <label for="request-price-phone">Номер телефона</label>
        <InputMask
          id="request-price-phone"
          v-model.trim="formData.phone"
          :disabled="isLoading"
          mask="+7 (999) 999-99-99"
          placeholder="+7 (493) 299-99-99"
        />
      </div>

      <div class="field">
        <label for="request-price-email">
          Email
          <span v-if="v$.email" class="text-red-500">*</span>
        </label>
        <InputText
          id="request-price-email"
          v-model.trim="formData.email"
          :disabled="isLoading"
          placeholder="ivanov@mail.ru"
          :class="{ 'p-invalid': v$.$dirty && v$.email?.$errors.length }"
        />
        <div v-if="v$.$dirty && v$.email.$errors.length" class="mt-1">
          <small
            v-for="error in v$.email.$errors"
            :key="error.$uid"
            class="block p-error"
          >{{ error.$message }}</small>
        </div>
      </div>

      <div class="field">
        <label for="request-price-company">Название компании</label>
        <InputText
          id="request-price-company"
          v-model.trim="formData.company"
          :disabled="isLoading"
          placeholder="ИП Иванов ИИ"
        />
      </div>

      <div class="field">
        <label for="request-price-city">Город</label>
        <InputText
          id="request-price-city"
          v-model.trim="formData.city"
          :disabled="isLoading"
          placeholder="Иваново"
        />
      </div>

      <div class="field mb-0">
        <label for="request-price-comment">Комментарий</label>
        <Textarea
          id="request-price-comment"
          v-model.trim="formData.comment"
          :disabled="isLoading"
          :rows="4"
          class="min-w-full max-w-full"
          style="min-height: 89px"
        />
      </div>
    </div>
    <div
      v-else
      class="flex flex-column align-items-center gap-4 my-8 text-center"
    >
      <i class="pi pi-send text-6xl text-primary" />
      <span class="text-xl font-medium line-height-3">Запрос отправлен. <br>
        Ответим Вам как можно скорее.</span>
    </div>
    <template #footer>
      <Button
        v-if="!isSubmitted"
        label="Закрыть"
        icon="pi pi-times"
        :disabled="isLoading"
        class="p-button-text"
        @click="$emit('update:visible', false)"
      />
      <Button
        v-if="!isSubmitted"
        icon="pi pi-send"
        label="Отправить"
        :loading="isLoading"
        class="p-button-text"
        @click="submit"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { helpers, required, email } from '@vuelidate/validators'

defineProps({
  visible: { type: Boolean, default: false }
})
const emit = defineEmits(['update:visible'])

type RequestPriceForm = {
  name: string;
  company: string;
  city: string;
  email: string;
  phone: string;
  comment: string;
};

const formData: RequestPriceForm = reactive({
  name: '',
  company: '',
  city: '',
  email: '',
  phone: '',
  comment: ''
})
const isLoading: Ref<boolean> = ref(false)
const isSubmitted: Ref<boolean> = ref(false)

const rules = reactive({
  name: { required: helpers.withMessage('Обязательное поле', required) },
  email: {
    email: helpers.withMessage('Некорректный формат Email', email),
    required: helpers.withMessage('Обязательное поле', required)
  }
})
const v$ = useVuelidate(rules, formData)

const submit = async () => {
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) { return }
  isLoading.value = true
  const { data } = await useApiCall('/api/mailer', {
    method: 'POST',
    body: formData
  })
  if (data) {
    isSubmitted.value = true
    setTimeout(() => emit('update:visible', false), 5000)
  }
  isLoading.value = false
}

const hideHandler = () => {
  v$.value.$reset()
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 767px) {
  .request-price-form {
    padding-top: 10px;
  }
}
</style>
