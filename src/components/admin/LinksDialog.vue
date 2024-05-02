<template>
  <Dialog
    :header="dialogHeader"
    :visible="visible"
    :close-on-escape="!loading"
    :closable="!loading"
    modal
    class="p-fluid"
    style="width: 450px"
    @show="handleShow"
    @hide="handleHide"
    @keydown.enter="submit"
    @update:visible="$emit('update:visible', $event)"
  >
    <div class="field">
      <label for="link-dialog-title">Наименование</label>
      <InputText
        id="link-dialog-title"
        v-model.trim="link.title"
        autofocus
        :disabled="loading"
        placeholder="Например: Контакты"
        :class="{ 'p-invalid': v$.$dirty && v$.title.$errors.length }"
      />
      <div v-if="v$.$dirty && v$.title.$errors.length" class="mt-1">
        <small
          v-for="error in v$.title.$errors"
          :key="error.$uid"
          class="block p-error"
        >{{ error.$message }}</small>
      </div>
    </div>

    <div class="field">
      <label for="link-dialog-url">Ссылка</label>
      <InputText
        id="link-dialog-url"
        v-model.trim="link.url"
        :disabled="loading"
        placeholder="Например: https://mysite.ru/info"
        :class="{ 'p-invalid': v$.$dirty && v$.url.$errors.length }"
      />
      <div v-if="v$.$dirty && v$.url.$errors.length" class="mt-1">
        <small
          v-for="error in v$.url.$errors"
          :key="error.$uid"
          class="block p-error"
        >{{ error.$message }}</small>
      </div>
    </div>

    <div class="field-checkbox mb-0">
      <Checkbox
        v-model="link.newTab"
        input-id="link-dialog-new-tab"
        :disabled="loading"
        :binary="true"
      />
      <label for="link-dialog-new-tab">
        Открывать в новой вкладке браузера
      </label>
    </div>

    <template #footer>
      <Button
        label="Отменить"
        icon="pi pi-times"
        :disabled="loading"
        class="p-button-text"
        @click="$emit('update:visible', false)"
      />
      <Button
        :label="submitLabel"
        icon="pi pi-check"
        :loading="loading"
        class="p-button-text"
        @click="submit"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import type { ComputedRef, PropType, Ref } from 'vue'
import type { LinkDialogProp } from '@/interfaces'

const props = defineProps({
  value: { type: Object as PropType<LinkDialogProp>, required: true },
  visible: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['update:visible', 'create', 'edit', 'hide'])

const link: Ref<LinkDialogProp> = ref({} as LinkDialogProp)

const submitLabel: ComputedRef<string> = computed(() =>
  props.value.id ? 'Сохранить' : 'Добавить'
)
const dialogHeader: ComputedRef<string> = computed(
  () => (props.value.id ? 'Редактирование' : 'Добавление') + ' ссылки'
)

const rules = reactive({
  title: { required: helpers.withMessage('Обязательное поле', required) },
  url: { required: helpers.withMessage('Обязательное поле', required) }
})
const v$ = useVuelidate(rules, link)

const submit = async () => {
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) {
    return
  }
  if (props.value.id) {
    emit('edit', link.value)
  } else {
    emit('create', link.value)
  }
}

const handleShow = () => {
  link.value = props.value
}
const handleHide = () => {
  v$.value.$reset()
  link.value = {} as LinkDialogProp
  emit('hide')
}
</script>

<style lang="scss" scoped></style>
