<template>
  <Dialog
    :visible="visible"
    :style="{ width: '450px' }"
    :header="header"
    :modal="true"
    @update:visible="$emit('update:visible', $event)"
  >
    <div class="confirmation-content flex align-items-center">
      <i class="pi mr-3" :class="icon" style="font-size: 2rem" />
      <span v-html="text" />
    </div>
    <template #footer>
      <Button
        :label="cancelButtonLabel"
        icon="pi pi-times"
        :class="cancelButtonClass"
        @click="$emit('update:visible', false)"
      />
      <Button
        :label="confirmButtonLabel"
        icon="pi pi-check"
        :class="confirmButtonClass"
        @click="$emit('confirm')"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
defineProps({
  visible: Boolean,
  header: { type: String, default: 'Подтверждение' },
  icon: { type: String, default: 'pi-exclamation-circle' },
  text: { type: String, required: true },
  cancelButtonLabel: { type: String, default: 'Отменить' },
  confirmButtonLabel: { type: String, default: 'Подтвердить' },
  cancelButtonClass: { type: String, default: 'p-button-text' },
  confirmButtonClass: { type: String, default: 'p-button-text' }
})
defineEmits(['update:visible', 'confirm'])
</script>

<style scoped></style>
