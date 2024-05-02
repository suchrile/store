<template>
  <div class="field-checkbox mb-0">
    <input-switch v-model="showTips" name="show-tips" @input="setShowTips" />
    <label for="show-tips">Показывать подсказки</label>
  </div>
</template>

<script setup lang="ts">
const { useShowTips, setShowTips } = useTips()
const showTips = useShowTips()
</script>
