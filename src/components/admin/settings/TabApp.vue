<template>
  <div class="p-fluid" style="width: 500px">
    <div class="field">
      <label for="admin-settings-app-name">Название сайта</label>
      <InputText
        id="admin-settings-app-name"
        :model-value="modelValue.name"
        :disabled="loading"
        placeholder="ИП Яровицына"
        @update:model-value="
          emit('update:modelValue', { ...modelValue, name: $event })
        "
      />
    </div>
    <div class="field">
      <label for="admin-settings-app-description">Описание</label>
      <Textarea
        id="admin-settings-app-description"
        :model-value="modelValue.description"
        :disabled="loading"
        :rows="4"
        :auto-resize="true"
        placeholder="Введите описание сайта"
        @update:model-value="
          emit('update:modelValue', { ...modelValue, description: $event })
        "
      />
    </div>
    <div class="field">
      <label for="admin-settings-app-keywords">Ключевые слова</label>
      <InputText
        id="admin-settings-app-keywords"
        :model-value="modelValue.keywords"
        :disabled="loading"
        placeholder="Ткани, Иваново, Купить ткани в Иваново"
        @update:model-value="
          emit('update:modelValue', { ...modelValue, keywords: $event })
        "
      />
    </div>
    <div class="field">
      <label for="admin-settings-app-keywords">Категория по умолчанию</label>
      <TreeSelect
        id="admin-settings-app-keywords"
        :model-value="findCategoryById(modelValue.defaultCategoryId)"
        :options="nestedCategories"
        :disabled="loading"
        selection-mode="single"
        placeholder="Выберите категорию"
        @update:model-value="
          emit('update:modelValue', {
            ...modelValue,
            defaultCategoryId: Number(Object.keys($event)[0]),
          })
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, Ref } from 'vue'
import type { TreeNode } from 'primevue/tree'
import type { Category, Info } from '@/interfaces'
import { mapToNodeTree } from '~/helpers'

defineProps({
  modelValue: { type: Object as PropType<Info['app']>, required: true },
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

const categories: Ref<Category[]> = ref([])
const nestedCategories: Ref<TreeNode[]> = ref([])

onMounted(async () => {
  await nextTick()
  await fetchCategories()
})

const findCategoryById = (id: number) => {
  const category = categories.value.find(cat => cat.id === id)
  if (category) {
    return { [category.id]: true }
  }
}

const fetchCategories = async () => {
  const { data } = await useApiCall<Category[]>('/api/categories')
  if (data) {
    categories.value = data
    nestedCategories.value = mapToNodeTree(data, {
      uniqueKey: 'id',
      labelKey: 'name',
      parentKey: 'parentId'
    })
  }
}
</script>
