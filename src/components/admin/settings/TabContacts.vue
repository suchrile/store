<template>
  <div class="p-fluid" style="width: 350px">
    <div class="field">
      <label for="admin-settings-contacts-email">Email</label>
      <InputText
        id="admin-settings-contacts-email"
        :model-value="modelValue.email"
        :disabled="loading"
        placeholder="info@fabric37.ru"
        @update:model-value="
          emit('update:modelValue', { ...modelValue, email: $event })
        "
      />
    </div>

    <div class="field">
      <label for="admin-settings-contacts-phone-numbers">
        Номера телефонов
      </label>
      <div
        v-if="modelValue.phoneNumbers.length"
        class="flex flex-wrap gap-2 mt-1 mb-3"
      >
        <Chip
          v-for="phoneNumber in modelValue.phoneNumbers"
          :key="phoneNumber"
          :label="phoneNumber"
          :removable="!loading"
          @remove="removePhoneNumber(phoneNumber)"
        />
      </div>
      <InputMask
        id="admin-settings-contacts-phone-numbers"
        v-model="addPhoneNumberField"
        :disabled="loading"
        mask="+7 (999) 999-99-99"
        placeholder="+7 (493) 288-88-88"
        @keydown.enter.stop="addPhoneNumber"
      />
      <small class="block mt-1 p-text-secondary">
        Введите номер телефона и нажмите Enter, чтобы добавить
      </small>
    </div>

    <div class="field">
      <label for="admin-settings-contacts-address">Адрес</label>
      <InputText
        id="admin-settings-contacts-address"
        :model-value="modelValue.address"
        :disabled="loading"
        placeholder="г. Иваново, просп. Ленина, 62"
        @update:model-value="
          emit('update:modelValue', { ...modelValue, address: $event })
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, Ref } from 'vue'
import type { Info } from '@/interfaces'

const props = defineProps({
  modelValue: { type: Object as PropType<Info['contacts']>, required: true },
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

const addPhoneNumberField: Ref<string> = ref('')

const addPhoneNumber = () => {
  if (!addPhoneNumberField.value) { return }
  emit('update:modelValue', {
    ...props.modelValue,
    phoneNumbers: [...props.modelValue.phoneNumbers, addPhoneNumberField.value]
  })
  addPhoneNumberField.value = ''
}
const removePhoneNumber = (phoneNumber: string) => {
  emit('update:modelValue', {
    ...props.modelValue,
    phoneNumbers: props.modelValue.phoneNumbers.filter(
      p => p !== phoneNumber
    )
  })
}
</script>

<style scoped></style>
