<template>
  <header class="h-7rem">
    <div
      class="container h-full flex align-items-center justify-content-between"
    >
      <h2>Панель управления</h2>
      <Button
        label="Выйти"
        icon="pi pi-sign-out"
        class="header__button-logout p-button-text"
        @click="logout"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
const { logout } = useAuth()
</script>
