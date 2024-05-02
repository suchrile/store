<template>
  <Dialog
    :header="dialogHeader"
    :modal="true"
    :visible="visible"
    :close-on-escape="!loading"
    :closable="!loading"
    :style="{ width: '450px' }"
    class="p-fluid"
    @show="showHandler"
    @hide="hideHandler"
    @update:visible="$emit('update:visible', $event)"
    @keydown.enter="submit"
  >
    <div class="field" :class="{ 'mb-0': isCategoryUndeletable }">
      <label for="category-dialog-name">Наименование</label>
      <InputText
        id="category-dialog-name"
        v-model.trim="category.name"
        :disabled="loading"
        placeholder="Введите наименование категории"
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

    <div v-if="!isCategoryUndeletable" class="flex align-items-end gap-2">
      <div class="field w-full">
        <label for="category-dialog-parent-id">Родительская категория</label>
        <div class="relative">
          <TreeSelect
            id="category-dialog-parent-id"
            v-model="parentId"
            :options="categoriesTree"
            :disabled="loading"
            selection-mode="single"
            placeholder="Без родительской категории"
            :class="{ 'p-invalid': v$.$dirty && v$.parentId.$errors.length }"
          />
          <i
            v-if="parentId"
            class="p-dropdown-clear-icon pi pi-times absolute top-50 cursor-pointer"
            style="right: 3rem"
            @click="parentId = null"
          />
        </div>
      </div>
      <div v-if="v$.$dirty && v$.parentId.$errors.length" class="mt-1">
        <small
          v-for="error in v$.parentId.$errors"
          :key="error.$uid"
          class="block p-error"
        >{{ error.$message }}</small>
      </div>
    </div>

    <div class="field mb-0">
      <label for="category-dialog-name">Отображать товары</label>
      <div class="flex flex-wrap gap-3 mt-1">
        <div class="flex align-items-center">
          <RadioButton
            v-model="category.view"
            input-id="category-view-cards"
            name="category-view-cards"
            value="cards"
          />
          <label for="category-view-cards" class="ml-2">Карточками</label>
        </div>
        <div class="flex align-items-center">
          <RadioButton
            v-model="category.view"
            input-id="category-view-table"
            name="category-view-table"
            value="table"
          />
          <label for="category-view-table" class="ml-2">Таблицей</label>
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        icon="pi pi-times"
        label="Отменить"
        :disabled="loading"
        class="p-button-text"
        @click="$emit('hide')"
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
import { ComputedRef, PropType, Ref } from 'vue'
import { helpers, numeric, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import type { TreeNode } from 'primevue/tree'
import type { Category } from '@/interfaces'
import { makeNested } from '@/helpers'
import { undeletableCategoryId } from '@/consts'
import { CategoryDialogProp } from '@/interfaces'

const props = defineProps({
  value: { type: Object as PropType<CategoryDialogProp>, required: true },
  categories: { type: Object as PropType<Category[]>, required: true },
  visible: { type: Boolean, required: true },
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['update:visible', 'hide', 'create', 'update'])

const category: Ref<CategoryDialogProp> = ref({} as CategoryDialogProp)
const parentId: Ref<{ [id: string]: boolean } | null> = ref(null)

const submitLabel: ComputedRef<string> = computed(() =>
  category.value.id ? 'Сохранить' : 'Добавить'
)
const dialogHeader: ComputedRef<string> = computed(
  () => `${category.value.id ? 'Редактирование' : 'Добавление'} категории`
)
const isCategoryUndeletable = computed(
  () => category.value.id === undeletableCategoryId
)
const categoriesTree: ComputedRef<TreeNode[]> = computed(() => {
  const filtered = props.categories.filter(
    cat =>
      cat.id !== undeletableCategoryId &&
      cat.id !== category.value.id &&
      cat.parentId !== category.value.id
  )
  const mapped = filtered.map(cat => ({
    key: String(cat.id),
    label: cat.name,
    parentId: cat.parentId
  }))
  return makeNested(mapped, 'key', 'parentId')
})

const rules = computed(() => ({
  name: { required: helpers.withMessage('Обязательное поле', required) },
  parentId: { numeric: helpers.withMessage('Некорректное значение', numeric) }
}))
const v$ = useVuelidate(rules, category)

const showHandler = () => {
  category.value = props.value
  parentId.value = category.value.parentId
    ? { [category.value.parentId]: true }
    : null
}

const hideHandler = () => {
  v$.value.$reset()
  category.value = {} as Category
  parentId.value = null
}

const submit = async () => {
  category.value.parentId = parentId.value && +Object.keys(parentId.value)[0]
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) {
    return
  }
  if (category.value.id) {
    emit('update', category.value)
  } else {
    emit('create', category.value)
  }
}
</script>

<style scoped></style>
