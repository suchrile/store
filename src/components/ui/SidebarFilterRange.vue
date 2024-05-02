<template>
  <div class="attribute-filter-range">
    <div
      class="attribute-filter-range__inputs"
      :class="{ 'p-disabled': attribute.min === attribute.max }"
    >
      <span>от</span>
      <InputNumber
        :model-value="state[0]"
        :min="attribute.min"
        :max="attribute.max"
        input-class="w-5rem py-2 text-center"
        @update:model-value="updateState([$event, modelValue[1]])"
      />
      <span>до</span>
      <InputNumber
        :model-value="state[1]"
        :min="attribute.min"
        :max="attribute.max"
        input-class="w-5rem py-2 text-center"
        @update:model-value="updateState([modelValue[0], $event])"
      />
    </div>

    <Slider
      v-model="state"
      :min="attribute.min"
      :max="attribute.max"
      :disabled="attribute.min === attribute.max"
      range
      class="mx-2"
      @slideend="updateState(state)"
    />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { AttributeFilter, AttributeFilterRangeValue } from '@/interfaces'

const props = defineProps({
  modelValue: {
    type: Object as PropType<AttributeFilterRangeValue>,
    required: true
  },
  attribute: { type: Object as PropType<AttributeFilter>, required: true }
})
const emit = defineEmits(['update:modelValue', 'update:dragging', 'change'])

const state = ref([...props.modelValue])

const updateState = (value: number[]) => {
  state.value = value
  emit('update:modelValue', value)
  emit('change')
}
</script>

<style scoped lang="scss">
.attribute-filter-range {
  padding: 5px;
  max-height: 206px;
  &__inputs {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 7px;
    margin-bottom: 21px !important;
  }
}
</style>
