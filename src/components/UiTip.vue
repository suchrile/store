<template>
  <div v-if="showTips" class="tip" :class="size">
    <Message icon="pi pi-info-circle">
      <div v-html="tip" />
    </Message>
  </div>
</template>

<script setup lang="ts">
import type { PropType, Ref } from 'vue'
import type { TipTarget } from '@/composables/useTips'

const props = defineProps({
  target: { type: String as PropType<TipTarget>, required: true },
  size: { type: String as PropType<'large' | 'small'>, default: 'large' }
})

const { useShowTips, generateTip } = useTips()
const showTips: Ref<boolean> = useShowTips()

const tip = computed(() => generateTip(props.target))
</script>

<style lang="scss">
.tip {
  & span {
    display: flex;
    align-items: center;
    white-space: pre-line;
    & i {
      font-size: 20px !important;
      margin: 0 8px 0 8px;
    }
  }
  .p-message .p-message-close {
    min-width: 28px;
  }
  &.large {
    .p-message {
      .p-message-wrapper {
        padding: 15px !important;
      }
      .p-message-icon {
        margin: 0 12px 0 0 !important;
      }
    }
  }
  &.small {
    .p-message {
      margin: 0 0 12px;
      .p-message-wrapper {
        padding: 10px !important;
      }
      .p-message-icon {
        margin: 0 10px 0 2px !important;
      }
      .p-message-text {
        font-size: 13px;
      }
    }
  }
}
</style>
