<template>
  <Toolbar>
    <template #start>
      <Button
        label="Добавить"
        icon="pi pi-plus"
        class="p-button-success mr-2"
        @click="emit('add')"
      />
      <Button
        label="Удалить выбранное"
        icon="pi pi-trash"
        class="p-button-danger"
        :disabled="deleteDisabled"
        @click="emit('remove')"
      />
    </template>
    <template #end>
      <span class="p-input-icon-left" style="width: 300px">
        <i class="pi pi-search" />
        <InputText
          :model-value="search"
          placeholder="Поиск..."
          class="w-full"
          @update:model-value="emit('update:search', $event.trim())"
        />
      </span>
    </template>
  </Toolbar>
</template>

<script setup lang="ts">
defineProps({
  search: { type: String, default: '' },
  deleteDisabled: { type: Boolean, default: true }
})
const emit = defineEmits(['update:search', 'add', 'remove'])
</script>

<style scoped></style>
