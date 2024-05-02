<template>
  <ScrollView vertical class="attribute-filter-checkboxes">
    <div
      v-for="value in attribute.values"
      :key="value.value"
      class="attribute-filter-checkboxes__value"
    >
      <div
        class="field-checkbox mb-0"
        :class="{
          'p-disabled': checkIfAttributeDisabled(attribute, value),
        }"
      >
        <Checkbox
          :model-value="modelValue[value]"
          :input-id="`attribute-filter-${attribute.id}-${value}`"
          binary
          @change="emit('change')"
          @update:model-value="
            emit('update:modelValue', { ...modelValue, [value]: $event })
          "
        />
        <label :for="`attribute-filter-${attribute.id}-${value}`">
          {{ getFormattedValue(value) }}
        </label>
      </div>
    </div>
  </ScrollView>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type {
  AttributeFilter,
  AttributeFilterCheckboxValue
} from '@/interfaces'
import { AttributeDataType } from '@/interfaces'
import { productAttributeBooleanOptions } from '@/consts'

const props = defineProps({
  modelValue: {
    type: Object as PropType<AttributeFilterCheckboxValue>,
    required: true
  },
  attribute: { type: Object as PropType<AttributeFilter>, required: true },
  checkIfAttributeDisabled: { type: Function, required: true }
})
const emit = defineEmits(['update:modelValue', 'change'])

const getFormattedValue = (value: any) => {
  const attribute = props.attribute
  if (attribute.dataType === AttributeDataType.DATE) {
    return new Date(value).toLocaleDateString()
  } else if (attribute.dataType === AttributeDataType.BOOLEAN) {
    return productAttributeBooleanOptions.find(
      option => option.value === value
    )!.label
  } else {
    return value
  }
}
</script>

<style scoped lang="scss">
.attribute-filter-checkboxes {
  padding: 5px;
  max-height: 206px;
  &__value {
    display: flex;
    align-items: center;
  }
  &__value:not(:last-child) {
    padding-bottom: 7px;
  }
}
</style>
