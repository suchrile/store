<template>
  <footer class="footer">
    <div class="footer__container container">
      <span>&copy; {{ year }} {{ info.app.name }} Inc. All rights reserved.</span>
      <div class="footer__links">
        <NuxtLink to="https://www.apple.com/legal/privacy" target="_blank">
          Privacy Policy
        </NuxtLink>
        <NuxtLink to="https://www.apple.com/legal/internet-services/terms/site.html" target="_blank">
          Terms of Use
        </NuxtLink>
        <NuxtLink to="https://www.apple.com/us/shop/goto/help/sales_refunds" target="_blank">
          Sales and Refunds
        </NuxtLink>
        <NuxtLink to="https://www.apple.com/legal" target="_blank">
          Legal
        </NuxtLink>
      </div>
      <span>Russia</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
const info = useInfo()
const year = new Date().getFullYear()
</script>

<style scoped lang="scss">
.footer {
  width: 100%;
  padding: 16px 0;
  color: rgba(255, 255, 255, 0.8);
  cursor: default;
  background-color: rgba(0,0,0,0.85);
  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__logo {
    margin: 0;
  }
  &__links {
    display: flex;
    column-gap: 20px;
    & a {
      color: inherit;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  @media screen and (max-width: 767px) {
    &__container {
      width: 100%;
      flex-direction: column-reverse;
      gap: 24px;
    }
    &__links {
      flex-direction: column;
      align-items: center;
      row-gap: 12px;
    }
  }
}
</style>
