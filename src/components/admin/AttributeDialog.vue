<template>
  <Dialog
    :header="dialogHeader"
    :modal="true"
    :visible="visible"
    :close-on-escape="!loading"
    :closable="!loading"
    :style="{ width: '450px' }"
    class="p-fluid"
    @update:visible="$emit('update:visible', $event)"
    @show="showHandler"
    @hide="hideHandler"
    @keydown.enter="submit"
  >
    <div class="field">
      <label for="product-attribute-name">Наименование</label>
      <InputText
        id="product-attribute-name"
        v-model.trim="attribute.name"
        :disabled="loading"
        placeholder="Например: Ширина"
        :class="{ 'p-invalid': v$.$dirty && v$.name.$errors.length }"
        autofocus
      />
      <div v-if="v$.$dirty && v$.name.$errors.length" class="mt-1">
        <small
          v-for="error in v$.name.$errors"
          :key="error.$uid"
          class="block p-error"
        >{{ error.$message }}</small>
      </div>
    </div>

    <div class="field">
      <label for="product-attribute-unit">Единица измерения</label>
      <InputText
        id="product-attribute-unit"
        v-model.trim="attribute.unit"
        :disabled="loading"
        placeholder="Например: см, гр, шт"
      />
    </div>

    <div class="field">
      <label for="product-attribute-data-type">Тип данных</label>
      <Dropdown
        id="product-attribute-data-type"
        v-model="attribute.dataType"
        :options="ProductAttributeDataTypes"
        :disabled="!!attribute.id || loading"
        option-label="label"
        option-value="value"
        placeholder="Выберите тип данных атрибута"
        :class="{
          'p-invalid': v$.$dirty && v$.dataType.$errors.length,
        }"
      />
      <div v-if="v$.$dirty && v$.dataType.$errors.length" class="mt-1">
        <small
          v-for="error in v$.dataType.$errors"
          :key="error.$uid"
          class="block p-error"
        >{{ error.$message }}</small>
      </div>
    </div>

    <div
      v-if="attribute.dataType === AttributeDataType.SELECT"
      class="product-attribute-options"
    >
      <div class="field">
        <label for="product-attribute-unit">Опции</label>
        <InputText
          id="product-attribute-unit"
          v-model.trim="optionsInput"
          :disabled="loading"
          placeholder="Введите название опции и нажмите Enter"
          @keydown.enter.stop="addOption"
        />
      </div>

      <div v-if="options.length" class="field">
        <div class="flex flex-wrap gap-2">
          <Chip
            v-for="option in options"
            :key="option.label"
            :label="option.label"
            :removable="!loading"
            @remove="removeOption(option)"
          />
        </div>
      </div>
    </div>

    <div class="field-checkbox mt-4 mb-2">
      <Checkbox
        v-model="attribute.showInCatalog"
        input-id="product-attribute-show-in-catalog"
        :disabled="loading"
        :binary="true"
      />
      <label for="product-attribute-show-in-catalog">Показывать в каталоге</label>
    </div>

    <div class="field-checkbox mb-2">
      <Checkbox
        v-model="attribute.sortable"
        input-id="product-attribute-sortable"
        :disabled="loading"
        :binary="true"
      />
      <label for="product-attribute-sortable">Использовать для сортировки</label>
    </div>

    <div class="field-checkbox mb-0">
      <Checkbox
        v-model="attribute.filterable"
        input-id="product-attribute-filterable"
        :disabled="loading"
        :binary="true"
      />
      <label for="product-attribute-filterable">Использовать для фильтрации</label>
    </div>

    <template #footer>
      <Button
        icon="pi pi-times"
        label="Отменить"
        :disabled="loading"
        class="p-button-text"
        @click="$emit('update:visible', false)"
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
import { useVuelidate } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import type { ComputedRef, PropType, Ref } from 'vue'
import type { AttributeDialogOption, AttributeDialogProp } from '@/interfaces'
import { AttributeDataType } from '@/interfaces'
import { ProductAttributeDataTypes } from '@/consts'

const props = defineProps({
  value: { type: Object as PropType<AttributeDialogProp>, required: true },
  visible: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['update:visible', 'create', 'edit', 'close'])

const attribute: Ref<AttributeDialogProp> = ref({} as AttributeDialogProp)
const optionsInput: Ref<string> = ref('')
const options: Ref<AttributeDialogOption[]> = ref([])

const submitLabel: ComputedRef<string> = computed(() =>
  props.value.id ? 'Сохранить' : 'Добавить'
)
const dialogHeader: ComputedRef<string> = computed(
  () => (props.value.id ? 'Редактирование' : 'Добавление') + ' атрибута'
)

const rules = computed(() => ({
  name: { required: helpers.withMessage('Обязательное поле', required) },
  dataType: { required: helpers.withMessage('Обязательное поле', required) }
}))
let v$ = useVuelidate(rules, attribute)

const addOption = () => {
  const isOptionExists = options.value.some(
    option => option.label === optionsInput.value
  )
  if (!isOptionExists) {
    options.value.push({ label: optionsInput.value })
  }
  optionsInput.value = ''
}

const removeOption = (option: AttributeDialogOption) => {
  options.value = options.value.filter(item => item.label !== option.label)
}

const submit = async () => {
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) {
    return
  }
  const toEmit = {
    ...attribute.value,
    unit: attribute.value.unit || null,
    options: options.value
  }
  if (props.value.id) {
    emit('edit', toEmit)
  } else {
    emit('create', toEmit)
  }
}

const showHandler = () => {
  attribute.value = props.value
  options.value = attribute.value.options || []
  v$ = useVuelidate(rules, attribute)
}

const hideHandler = () => {
  v$.value.$reset()
  attribute.value = {} as AttributeDialogProp
  optionsInput.value = ''
  options.value = []
  emit('close')
}
</script>

<style lang="scss" scoped></style>
