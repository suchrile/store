<template>
  <div>
    <HeaderTop
      v-if="
        links.length || info.contacts.email || info.contacts.phoneNumbers.length
      "
    />

    <header class="header">
      <div class="header__container">
        <div class="flex align-items-center gap-3">
          <i
            class="header__burger pi pi-bars"
            style="margin-top: 1px"
            @click="isSidebarVisible = true"
          />
          <NuxtLink to="/" class="header__logo">
            {{ info.app.name }}
          </NuxtLink>
        </div>
        <div class="flex w-full gap-4">
          <div class="header__catalog header-catalog">
            <Button
              label="Каталог"
              icon="pi pi-bars"
              class="header-catalog__toggle"
              @click="toggleCatalog"
            />
            <div
              ref="catalog"
              class="catalog"
              :class="{ active: isCatalogOpen }"
            >
              <div class="py-4" style="max-width: 1220px; margin: 0 auto">
                <div class="grid column-gap-7 m-0">
                  <div class="col-fixed col-3 p-0 category__list">
                    <div
                      v-for="category of categories"
                      :key="category.id"
                      class="category__item"
                      :class="{ active: checkIfCurrentCategory(category) }"
                      @mouseover="setCurrentCategory(category)"
                      @click="handleCategoryClick(category)"
                    >
                      <span>{{ category.name }}</span>
                      <i
                        v-if="category.children.length"
                        class="pi pi-chevron-right text-sm"
                      />
                    </div>
                  </div>

                  <div class="col p-0">
                    <div v-if="currentCategory" class="subcategory__list">
                      <div
                        v-for="sub in currentCategory.children"
                        :key="sub.id"
                        class="subcategory__item"
                        @click="handleCategoryClick(category)"
                      >
                        {{ sub.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="header__search w-full">
            <span class="header__search-input p-input-icon-left w-full">
              <i class="pi pi-search" />
              <InputText
                v-model="searchField"
                placeholder="Поиск..."
                class="w-full"
                @keydown.enter="search"
              />
            </span>
          </div>
        </div>
        <div class="header__request-price">
          <Button
            label="Запросить прайс"
            class="white-space-nowrap"
            @click="isRequestPriceDialogVisible = true"
          />
        </div>
      </div>
    </header>
    <HeaderCatalogSidebar
      v-model:visible="isSidebarVisible"
      :categories="categories"
    />
    <RequestPriceDialog v-model:visible="isRequestPriceDialogVisible" />
    <BlockUI
      :blocked="isCatalogOpen"
      :full-screen="true"
      style="z-index: 1"
      :auto-z-index="false"
    />
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import type { Category, Link } from '@/interfaces'
import { makeNested } from '@/helpers'
import { undeletableCategoryId } from '@/consts'
import HeaderTop from '~/components/HeaderTop.vue'

const catalog = ref()

const info = useInfo()
const isCatalogOpen: Ref<boolean> = ref(false)
const isSidebarVisible: Ref<boolean> = ref(false)
const isRequestPriceDialogVisible: Ref<boolean> = ref(false)
const links: Ref<Link[]> = ref([])
const categories: Ref<(Category & { children: Category[] })[]> = ref([])
const currentCategory = ref()
const searchField: Ref<string> = ref('')

const { data } = await useApiCall<Link[]>('/api/links')
if (data) { links.value = data }

onMounted(async () => {
  await nextTick()
  await fetchCategories()
})

const handleCategoryClick = async (category: Category) => {
  await toggleCatalog()
  await navigateTo(`/category/${category.slug}`)
}

const toggleCatalog = async () => {
  if (isCatalogOpen.value) {
    const blockui = document.querySelector('.p-blockui')
    blockui?.removeEventListener('click', toggleCatalog)
    catalog.value.style.maxHeight = 0
    isCatalogOpen.value = false
  } else {
    isCatalogOpen.value = true
    catalog.value.style.maxHeight = catalog.value.scrollHeight + 'px'
    await nextTick()
    const blockui = document.querySelector('.p-blockui')
    blockui?.addEventListener('click', toggleCatalog)
  }
}

const setCurrentCategory = (category: Category) => {
  currentCategory.value = category
}
const checkIfCurrentCategory = (category: Category) => {
  if (!currentCategory.value) { return }
  return currentCategory.value.id === category.id
}

const search = async () => {
  if (!searchField.value) { return }
  isCatalogOpen.value && (await toggleCatalog())
  await navigateTo('/search/' + searchField.value)
}

const fetchCategories = async () => {
  const { data } = await useApiCall<Category[]>('/api/categories')
  if (data) {
    data.sort((a, b) => {
      if (a.id === undeletableCategoryId) { return 1 }
      if (b.id === undeletableCategoryId) { return -1 }
      return a.name.localeCompare(b.name)
    })
    categories.value = makeNested(data, 'id', 'parentId')
    currentCategory.value = categories.value[0]
  }
}
</script>

<style scoped lang="scss">
.catalog {
  width: 100%;
  max-height: 0;
  left: 0;
  bottom: 0;
  padding: 0 15px;
  color: rgba(0, 0, 0, 0.85);
  background-color: white;
  transition: max-height 0.3s ease;
  transform: translateY(100%);
  transform-origin: top;
  overflow: hidden;
  position: absolute;
}

.category__list {
  position: relative;
  &::after {
    content: '';
    top: 0;
    right: -15px;
    width: 1px;
    height: 100%;
    background-color: var(--surface-300);
    position: absolute;
  }
}

.category__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  font-size: 15px;
  text-decoration: none;
  color: black;
  border-radius: 8px;
  cursor: pointer;

  &.active {
    color: white;
    background-color: var(--purple-500);
  }
}

.subcategory__list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: start;
  column-gap: 15px;
}

.subcategory__item {
  max-width: 100%;
  padding: 6px 0;
  font-size: 15px;
  font-weight: 500;
  color: black;
  white-space: nowrap;
  text-decoration: none;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  &:hover::after {
    transform: scale(1);
  }

  &::after {
    content: '';
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2.5px;
    transform: scale(0);
    transform-origin: left;
    border-radius: 3px;
    background-color: var(--purple-500);
    transition: transform 0.3s ease;
    position: absolute;
  }
}

.header {
  height: 80px;
  width: 100%;
  //color: white;
  //background: linear-gradient(var(--purple-500), var(--purple-600));
  color: rgba(0, 0, 0, 0.8);
  background: #fafafc;
  position: relative;
  z-index: 2;

  &__burger {
    display: none;
  }

  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 100px;
    height: 100%;
    max-width: var(--max-container-width);
    margin: 0 auto;
  }

  &__logo {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    white-space: nowrap;
    user-select: none;
    text-decoration: none;
    color: inherit;
  }

  &__search {
  }

  &__request-price {
    display: flex;
    gap: 25px;
  }

  @media screen and (max-width: 1220px) {
    &__container {
      gap: 50px;
      padding: 0 15px;
    }
    .subcategory__list {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media screen and (max-width: 767px) {
    &__container {
      gap: 15px;
    }
    .header {
      &__burger {
        display: block;
        font-size: 24px;
      }
      &__logo {
        font-size: 20px;
      }
      &__search {
        display: none;
      }
    }
    .header-catalog {
      display: none;
    }
  }
}
</style>
