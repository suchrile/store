<template>
  <div class="products-view-options">
    <div class="products-view-options__sorting sorting">
      <span>Сортировка:</span>
      <Dropdown
        v-model="field"
        :options="fields"
        option-label="label"
        input-class="py-2"
        class="sorting__by"
        @change="handleSortChange"
      />
      <Dropdown
        v-model="order"
        :options="sortOrders"
        option-label="label"
        input-class="py-2"
        class="sorting__order"
        @change="handleSortChange"
      />
    </div>
    <div class="products-view-options__layout layout">
      <span>Вид:</span>
      <div class="layout__options">
        <i
          v-tooltip.bottom="'Сеткой'"
          class="layout__option"
          :class="{ active: currentLayout === 'grid' }"
          @click="setLayout('grid')"
        ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path
            d="M0 72C0 49.91 17.91 32 40 32H88C110.1 32 128 49.91 128 72V120C128 142.1 110.1 160 88 160H40C17.91 160 0 142.1 0 120V72zM0 232C0 209.9 17.91 192 40 192H88C110.1 192 128 209.9 128 232V280C128 302.1 110.1 320 88 320H40C17.91 320 0 302.1 0 280V232zM128 440C128 462.1 110.1 480 88 480H40C17.91 480 0 462.1 0 440V392C0 369.9 17.91 352 40 352H88C110.1 352 128 369.9 128 392V440zM160 72C160 49.91 177.9 32 200 32H248C270.1 32 288 49.91 288 72V120C288 142.1 270.1 160 248 160H200C177.9 160 160 142.1 160 120V72zM288 280C288 302.1 270.1 320 248 320H200C177.9 320 160 302.1 160 280V232C160 209.9 177.9 192 200 192H248C270.1 192 288 209.9 288 232V280zM160 392C160 369.9 177.9 352 200 352H248C270.1 352 288 369.9 288 392V440C288 462.1 270.1 480 248 480H200C177.9 480 160 462.1 160 440V392zM448 120C448 142.1 430.1 160 408 160H360C337.9 160 320 142.1 320 120V72C320 49.91 337.9 32 360 32H408C430.1 32 448 49.91 448 72V120zM320 232C320 209.9 337.9 192 360 192H408C430.1 192 448 209.9 448 232V280C448 302.1 430.1 320 408 320H360C337.9 320 320 302.1 320 280V232zM448 440C448 462.1 430.1 480 408 480H360C337.9 480 320 462.1 320 440V392C320 369.9 337.9 352 360 352H408C430.1 352 448 369.9 448 392V440z"
          /></svg></i>
        <i
          v-tooltip.bottom="'Списком'"
          class="layout__option"
          :class="{ active: currentLayout === 'list' }"
          @click="setLayout('list')"
        ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path
            d="M416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96zM416 352H32C14.33 352 0 337.7 0 320C0 302.3 14.33 288 32 288H416C433.7 288 448 302.3 448 320C448 337.7 433.7 352 416 352zM0 192C0 174.3 14.33 160 32 160H416C433.7 160 448 174.3 448 192C448 209.7 433.7 224 416 224H32C14.33 224 0 209.7 0 192zM416 480H32C14.33 480 0 465.7 0 448C0 430.3 14.33 416 32 416H416C433.7 416 448 430.3 448 448C448 465.7 433.7 480 416 480z"
          /></svg></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType, Ref } from 'vue'
import { sortOrders } from '@/consts'
import type { ProductSortField, SortOrder, ProductsLayout } from '@/interfaces'

const props = defineProps({
  fields: { type: Array as PropType<ProductSortField[]>, required: true },
  field: { type: Object as PropType<ProductSortField>, required: true },
  order: { type: Object as PropType<SortOrder>, required: true },
  layout: { type: String as PropType<ProductsLayout>, default: 'grid' }
})
const emit = defineEmits([
  'update:field',
  'update:order',
  'update:layout',
  'sortChange'
])

onMounted(() => {
  watch(props, () => {
    field.value = props.field
    order.value = props.order
    currentLayout.value = props.layout
  })
})

const field: Ref<ProductSortField> = ref(props.field)
const order: Ref<SortOrder> = ref(props.order)
const currentLayout: Ref<ProductsLayout> = ref('grid')

const handleSortChange = () => {
  emit('update:field', field.value)
  emit('update:order', order.value)
  emit('sortChange')
}

const setLayout = (value: ProductsLayout) => {
  currentLayout.value = value
  emit('update:layout', currentLayout.value)
}
</script>

<style scoped lang="scss">
.products-view-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 13px 17px;
  border-radius: var(--border-radius);
  background-color: white;
  & .sorting {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    &__by {
      min-width: 180px;
    }
    &__order {
      min-width: 160px;
    }
  }
  & .layout {
    display: flex;
    align-items: center;
    gap: 7px;
    &__options {
      display: flex;
      align-items: center;
    }
    &__option {
      height: 32px;
      padding: 5px;
      border-radius: 6px;
      aspect-ratio: 1 / 1;
      transition: background-color 0.2s ease;
      & svg {
        width: 100%;
        height: 100%;
        fill: var(--surface-400);
        transition: fill 0.2s ease;
      }
      &.active svg {
        fill: var(--primary-color);
      }
      &:hover {
        background-color: var(--surface-ground);
        cursor: pointer;
      }
    }
  }

  @media screen and (max-width: 767px) {
    padding: 15px 17px 17px;
    & .sorting {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      &__by,
      &__order {
        min-width: 100%;
      }
    }
    & .layout {
      display: none;
    }
  }
}
</style>
