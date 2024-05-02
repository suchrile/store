<template>
  <div class="product-dialog-main-tab">
    <div class="field">
      <label for="product-dialog-name">Наименование</label>
      <InputText
        id="product-dialog-name"
        :model-value="product.name"
        :disabled="loading"
        placeholder="Введите наименование"
        autofocus
        :class="{ 'p-invalid': v$.$dirty && v$.product.name.$errors.length }"
        @update:model-value="
          emit('update:product', { ...product, name: $event.trim() })
        "
      />
      <div v-if="v$.$dirty && v$.product.name.$errors.length" class="errors">
        <small
          v-for="error in v$.product.name.$errors"
          :key="error.$uid"
          class="p-error"
        >{{ error.$message }}</small>
      </div>
    </div>

    <div class="field">
      <label for="product-dialog-description">Описание</label>
      <Textarea
        id="product-dialog-description"
        :model-value="product.description || ''"
        :disabled="loading"
        placeholder="Введите описание"
        class="product-add-dialog__description w-full"
        style="min-height: 90px"
        @update:model-value="
          emit('update:product', { ...product, description: $event.trim() })
        "
      />
    </div>

    <div class="field">
      <label for="product-dialog-categories">Категории</label>
      <TreeSelect
        id="product-dialog-categories"
        :model-value="selectedCategories"
        :options="categories"
        :disabled="loading"
        selection-mode="checkbox"
        placeholder="Выберите категории"
        :class="{ 'p-invalid': v$.$dirty && v$.categoryIds.$errors.length }"
        @update:model-value="emit('update:selectedCategories', $event)"
      />
      <div v-if="v$.$dirty && v$.categoryIds.$errors.length" class="errors">
        <small
          v-for="error in v$.categoryIds.$errors"
          :key="error.$uid"
          class="p-error"
        >{{ error.$message }}</small>
      </div>
    </div>

    <div class="field-checkbox mt-4 mb-0">
      <Checkbox
        :model-value="product.hidden"
        input-id="product-dialog-show-in-catalog"
        :binary="true"
        :disabled="loading"
        @input="emit('update:product', { ...product, hidden: $event })"
      />
      <label for="product-dialog-show-in-catalog">Не показывать в каталоге</label>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { TreeNode, TreeSelectionKeys } from 'primevue/tree'
import type { Validation } from '@vuelidate/core'
import type { ProductDialogProp } from '@/interfaces'

defineProps({
  product: { type: Object as PropType<ProductDialogProp>, required: true },
  categories: { type: Object as PropType<TreeNode[]>, required: true },
  selectedCategories: {
    type: Object as PropType<TreeSelectionKeys>,
    required: true
  },
  v$: { type: Object as PropType<Validation>, required: true },
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['update:product', 'update:selectedCategories'])
</script>

<style scoped></style>
