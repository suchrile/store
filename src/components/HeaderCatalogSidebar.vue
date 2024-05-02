<template>
  <Sidebar
    :visible="visible"
    class="header-catalog-sidebar w-full"
    @update:visible="emit('update:visible', $event)"
  >
    <template #header>
      <div class="flex align-items-center gap-2">
        <i
          class="pi pi-bars text-2xl text-primary font-bold"
          style="margin-top: 1px"
        />
        <span class="text-2xl font-bold">Меню</span>
      </div>
    </template>

    <div class="header-catalog-sidebar__links">
      <NuxtLink
        v-for="link in links"
        :key="link.id"
        :href="link.url"
        :target="link.newTab ? '_blank' : '_self'"
        class="header-catalog-sidebar__link"
        @click="emit('update:visible', false)"
      >
        {{ link.title }}
      </NuxtLink>
    </div>

    <span class="p-input-icon-left w-full mt-1 mb-4">
      <i class="pi pi-search" />
      <InputText
        v-model.trim="searchField"
        placeholder="Поиск по наименованию или артикулу"
        class="w-full"
        @keydown.enter="search"
      />
    </span>

    <Accordion
      :active-index="activeIndex"
      @tab-click="handleTabClick($event.index)"
    >
      <AccordionTab
        v-for="category in categories"
        :key="category.id"
        :header="category.name"
      >
        <NuxtLink
          v-for="sub in category.children"
          :key="sub.id"
          :to="'/category/' + sub.slug"
          class="header-catalog-sidebar__category-child"
          @click="emit('update:visible', false)"
        >
          <span>{{ sub.name }}</span>
          <i class="pi pi-chevron-right" />
        </NuxtLink>
      </AccordionTab>
    </Accordion>
  </Sidebar>
</template>

<script setup lang="ts">
import type { PropType, Ref } from 'vue'
import type { Category, Link } from '@/interfaces'

const props = defineProps({
  categories: { type: Array as PropType<Category[]>, required: true },
  visible: { type: Boolean, default: false }
})
const emit = defineEmits(['update:visible'])

const links: Ref<Link[]> = ref([])
const activeIndex: Ref<number | null> = ref(null)
const searchField: Ref<string> = ref('')

const { data } = await useFetch<Link[]>('/api/links')
if (data.value) {
  links.value = data.value.sort((a, b) => a.sortOrder - b.sortOrder)
}

const search = async () => {
  await navigateTo('/search/' + searchField.value)
  emit('update:visible', false)
}

const handleTabClick = async (index: number) => {
  if (activeIndex.value === index || !props.categories[index].children.length) {
    const slug = props.categories[index].slug
    await navigateTo('/category/' + slug)
    emit('update:visible', false)
  } else {
    activeIndex.value = index
  }
}
</script>

<style lang="scss">
.header-catalog-sidebar {
  &__category-child {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
    color: var(--text-primary);
    border-radius: var(--border-radius);
    background-color: var(--surface-100);
    & i {
      color: var(--primary-color);
    }
    &:not(:last-child) {
      margin-bottom: 6px;
    }
  }
  &__links {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    column-gap: 25px;
    row-gap: 10px;
    padding: 10px 0 20px;
  }
  &__link {
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
    color: var(--text-color);
  }
}
</style>
