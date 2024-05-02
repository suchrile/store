<template>
  <div class="header-top">
    <div class="header-top__container">
      <div v-if="links.length" class="header-top__links">
        <NuxtLink
          v-for="link in links"
          :key="link.id"
          :href="link.url"
          :target="link.newTab ? '_blank' : '_self'"
        >
          {{ link.title }}
        </NuxtLink>
      </div>

      <div class="header-top__contacts contacts">
        <div
          v-if="info.contacts.phoneNumbers.length"
          class="contacts__phone-numbers phone-numbers"
        >
          <i class="pi pi-phone" />
          <NuxtLink :href="`tel:${info.contacts.phoneNumbers[0]}`">
            {{ info.contacts.phoneNumbers[0] }}
          </NuxtLink>
          <div v-if="info.contacts.phoneNumbers.length > 1">
            <i class="pi pi-chevron-down" />
            <div class="phone-numbers__hidden hidden-phone-numbers">
              <div
                v-for="phoneNumber in info.contacts.phoneNumbers"
                :key="phoneNumber"
                class="hidden-phone-numbers__item"
              >
                <i class="pi pi-phone" />
                <NuxtLink :href="`tel:${phoneNumber}`">
                  {{ phoneNumber }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        <div v-if="info.contacts.email" class="contacts__email">
          <i class="pi pi-at" />
          <NuxtLink :href="`mailto:${info.contacts.email}`">
            {{ info.contacts.email }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { Link } from '~/interfaces'

const info = useInfo()

const links: Ref<Link[]> = ref([])

const { data } = await useFetch<Link[]>('/api/links')
if (data.value) {
  links.value = data.value.sort((a, b) => a.sortOrder - b.sortOrder)
}
</script>

<style scoped lang="scss">
.header-top {
  min-height: 46px;
  //background-color: var(--purple-800);
  background-color: rgba(0, 0, 0, 0.85);
  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 50px;
    max-width: var(--max-container-width);
    margin: 0 auto;
    padding: 15px 0;
    color: white;
    & a {
      text-decoration: none;
    }
  }
  &__links {
    display: flex;
    flex-wrap: wrap;
    column-gap: 20px;
    row-gap: 10px;
    & a {
      color: inherit;
      opacity: 0.85;
      transition: opacity 0.2s ease-in-out;
      &:hover {
        opacity: 1;
      }
    }
  }
  & .contacts {
    display: flex;
    gap: 12px;
    font-size: 15px;
    &__phone-numbers,
    .hidden-phone-numbers__item,
    &__email {
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
      & i {
        font-size: 16px;
      }
      & i.pi-chevron-down {
        font-size: 10px;
        margin-top: 1px;
      }
    }
    &__email a {
      //color: white;
      color: rgba(255,255,255,0.9);
      text-decoration: none;
    }
    &__phone-numbers {
      position: relative;
      padding: 0 15px;
      font-size: 14px;
      & a {
        //color: white;
        color: rgba(255,255,255,0.9);
      }
      &:hover {
        .hidden-phone-numbers {
          opacity: 1;
          visibility: visible;
        }
      }
      & .hidden-phone-numbers {
        position: absolute;
        width: 100%;
        top: -100px;
        left: 0;
        padding: 100px 15px 18px;
        border-radius: 0 0 var(--border-radius) var(--border-radius);
        background-color: white;
        box-shadow: 0 4px 8px 0 rgba(34, 60, 80, 0.2);
        z-index: 3;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease-in-out;
        &__item {
          font-weight: 600;
          color: var(--purple-700);
          & a {
            color: var(--purple-700);
          }
          &:not(:last-child) {
            margin-bottom: 10px;
          }
        }
      }
    }
  }

  @media screen and (max-width: 1220px) {
    padding: 0 15px;
  }

  @media screen and (max-width: 767px) {
    &__container {
      flex-direction: column;
    }
    &__links {
      display: none;
    }
    & .contacts {
      flex-wrap: wrap;
      justify-content: center;
      &__phone-numbers {
        font-size: 15px;
      }
      &__email {
        padding-right: 15px;
      }
    }
  }
}
</style>
