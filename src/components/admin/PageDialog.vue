<template>
  <Dialog
    :header="dialogHeader"
    :visible="visible"
    :modal="true"
    :style="{ width: '450px' }"
    class="p-fluid"
    @show="handleShow"
    @hide="handleHide"
    @keydown.enter="submit"
    @update:visible="$emit('update:visible', $event)"
  >
    <div class="page-dialog">
      <div class="field mb-0">
        <label for="page-dialog-name">Заголовок</label>
        <InputText
          id="page-dialog-name"
          v-model.trim="page.title"
          autofocus
          placeholder="Введите заголовок страницы"
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
    </div>

    <template #footer>
      <Button
        icon="pi pi-times"
        label="Отменить"
        class="p-button-text"
        @click="emit('update:visible', false)"
      />
      <Button
        icon="pi pi-check"
        :label="submitLabel"
        :loading="loading"
        class="p-button-text"
        @click="submit"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import type { PropType, Ref } from 'vue'
import { helpers, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import type { PageDialogProp } from '@/interfaces'

const props = defineProps({
  value: { type: Object as PropType<PageDialogProp>, required: true },
  visible: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['update:visible', 'create', 'edit', 'hide'])

const page: Ref<PageDialogProp> = ref({} as PageDialogProp)

const dialogHeader: Ref<string> = ref('')
const submitLabel: Ref<string> = ref('')

const rules = reactive({
  title: { required: helpers.withMessage('Обязательное поле', required) }
})
const v$ = useVuelidate(rules, page)

const submit = async () => {
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) {
    return
  }
  if (props.value.slug) {
    emit('edit', page.value)
  } else {
    emit('create', page.value)
  }
}

const handleHide = () => {
  v$.value.$reset()
  emit('hide')
}

const handleShow = () => {
  page.value = props.value
  if (page.value.slug) {
    dialogHeader.value = 'Редактирование страницы'
    submitLabel.value = 'Сохранить'
  } else {
    dialogHeader.value = 'Добавление страницы'
    submitLabel.value = 'Добавить'
  }
}
</script>

<style scoped></style>
