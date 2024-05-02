<template>
  <div class="attribute-filter-radio-buttons">
    <div
      :class="{ 'p-disabled': checkIfAttributeDisabled(attribute, true) }"
      class="attribute-filter-radio-buttons__value"
    >
      <RadioButton
        :model-value="modelValue"
        :input-id="`attribute-filter-${attribute.id}-true`"
        :value="true"
        @change="emit('change')"
        @update:model-value="emit('update:modelValue', $event)"
      />
      <label :for="`attribute-filter-${attribute.id}-true`" class="ml-2">
        Да
      </label>
    </div>

    <div
      :class="{ 'p-disabled': checkIfAttributeDisabled(attribute, false) }"
      class="attribute-filter-radio-buttons__value"
    >
      <RadioButton
        :model-value="modelValue"
        :input-id="`attribute-filter-${attribute.id}-false`"
        :value="false"
        @change="emit('change')"
        @update:model-value="emit('update:modelValue', $event)"
      />
      <label :for="`attribute-filter-${attribute.id}-false`" class="ml-2">
        Нет
      </label>
    </div>

    <div class="attribute-filter-radio-buttons__value">
      <RadioButton
        :model-value="modelValue === null && 'nomatter'"
        :input-id="`attribute-filter-${attribute.id}-nomatter`"
        :value="'nomatter'"
        @change="emit('change')"
        @update:model-value="emit('update:modelValue', null)"
      />
      <label :for="`attribute-filter-${attribute.id}-nomatter`" class="ml-2">
        Не важно
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { AttributeFilter } from '@/interfaces'

defineProps({
  modelValue: {
    type: [Boolean, null] as PropType<boolean | null>,
    required: true
  },
  attribute: { type: Object as PropType<AttributeFilter>, required: true },
  checkIfAttributeDisabled: { type: Function, required: true }
})
const emit = defineEmits(['update:modelValue', 'change'])
</script>

<style scoped lang="scss">
.attribute-filter-radio-buttons {
  padding: 5px;
  max-height: 206px;
  &__value {
    display: flex;
    align-items: center;
  }
  &__value:not(:last-child) {
    margin-bottom: 7px;
  }
}
</style>
