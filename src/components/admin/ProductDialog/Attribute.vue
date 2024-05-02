<template>
  <InputText
    v-if="attribute.dataType === AttributeDataType.STRING"
    :id="'product-attribute-' + attribute.id"
    :model-value="modelValue"
    :disabled="loading"
    placeholder="Введите строковое значение"
    @update:model-value="emit('update:modelValue', $event)"
  />
  <InputNumber
    v-else-if="attribute.dataType === AttributeDataType.INTEGER"
    :id="'product-attribute-' + attribute.id"
    :model-value="modelValue"
    :disabled="loading"
    placeholder="Введите целочисленное значение"
    @update:model-value="emit('update:modelValue', $event)"
  />
  <InputNumber
    v-else-if="attribute.dataType === AttributeDataType.FLOAT"
    :id="'product-attribute-' + attribute.id"
    :model-value="modelValue"
    :max-fraction-digits="5"
    :disabled="loading"
    placeholder="Введите числовое значение с плавающей запятой"
    @update:model-value="emit('update:modelValue', $event)"
  />
  <SelectButton
    v-else-if="attribute.dataType === AttributeDataType.BOOLEAN"
    :model-value="modelValue"
    :options="productAttributeBooleanOptions"
    option-label="label"
    option-value="value"
    :disabled="loading"
    @update:model-value="emit('update:modelValue', $event)"
  />
  <Calendar
    v-else-if="attribute.dataType === AttributeDataType.DATE"
    :id="'product-attribute-' + attribute.id"
    :model-value="modelValue && new Date(modelValue)"
    date-format="dd.mm.yy"
    :disabled="loading"
    placeholder="Выберите дату"
    @update:model-value="
      emit('update:modelValue', new Date($event).toISOString())
    "
  />
  <MultiSelect
    v-else-if="attribute.dataType === AttributeDataType.SELECT"
    :id="'product-attribute-' + attribute.id"
    :model-value="modelValue"
    :options="attribute.options"
    option-label="label"
    display="chip"
    :show-toggle-all="false"
    :disabled="loading"
    placeholder="Выберите значения из списка"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { AttributeValue } from '@/interfaces'
import { AttributeDataType } from '@/interfaces'
import { productAttributeBooleanOptions } from '@/consts'

defineProps({
  modelValue: { type: undefined, required: true },
  attribute: { type: Object as PropType<AttributeValue>, required: true },
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])
</script>

<style scoped></style>
