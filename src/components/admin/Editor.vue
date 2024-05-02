<template>
  <Editor
    :model-value="modelValue"
    class="page__editor"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #toolbar>
      <span class="ql-formats">
        <button v-tooltip.bottom="'Заголовок'" value="1" class="ql-header" />
        <button v-tooltip.bottom="'Подзаголовок'" value="2" class="ql-header" />
      </span>
      <span class="ql-formats">
        <button v-tooltip.bottom="'Полужирный'" class="ql-bold" />
        <button v-tooltip.bottom="'Курсив'" class="ql-italic" />
        <button v-tooltip.bottom="'Подчеркнутый'" class="ql-underline" />
        <button v-tooltip.bottom="'Зачеркнутый'" class="ql-strike" />
      </span>
      <span class="ql-formats">
        <select class="ql-color" />
        <select class="ql-background" />
      </span>
      <span class="ql-formats">
        <button
          v-tooltip.bottom="'Нумерация'"
          value="ordered"
          class="ql-list"
        />
        <button v-tooltip.bottom="'Маркеры'" value="bullet" class="ql-list" />
      </span>
      <span class="ql-formats">
        <button
          v-tooltip.bottom="'Увеличить отступ'"
          value="+1"
          class="ql-indent"
        />
        <button
          v-tooltip.bottom="'Уменьшить отступ'"
          value="-1"
          class="ql-indent"
        />
      </span>
      <span class="ql-formats">
        <button
          v-tooltip.bottom="'По центру'"
          value="center"
          class="ql-align"
        />
        <button
          v-tooltip.bottom="'По правому краю'"
          value="right"
          class="ql-align"
        />
        <button
          v-tooltip.bottom="'По ширине'"
          value="justify"
          class="ql-align"
        />
      </span>
      <span class="ql-formats">
        <button
          v-tooltip.bottom="'Нижний индекс'"
          value="sub"
          class="ql-script"
        />
        <button
          v-tooltip.bottom="'Верхний индекс'"
          value="super"
          class="ql-script"
        />
      </span>
      <span class="ql-formats">
        <button v-tooltip.bottom="'Ссылка'" class="ql-link" />
        <button v-tooltip.bottom="'Цитата'" class="ql-blockquote" />
      </span>
      <span class="ql-formats">
        <button
          v-tooltip.bottom="'Очистить формат'"
          value="center"
          class="ql-clean"
        />
      </span>
    </template>
  </Editor>
</template>

<script setup lang="ts">
defineProps({
  modelValue: { type: String, default: '' }
})
defineEmits(['update:modelValue'])
</script>

<style scoped></style>
