<template>
  <div class="admin-product-page">
    <h3>Список товаров</h3>

    <ui-tip target="products" />

    <AdminDataTableToolbar
      v-model:search="filters.global.value"
      :delete-disabled="!selectedProducts.length"
      class="mb-4"
      @add="openEditProductDialog"
      @remove="confirmDeleteProducts"
    />

    <DataTable
      v-model:selection="selectedProducts"
      v-model:filters="filters"
      :value="products"
      :rows="10"
      :loading="isProductsLoading"
      :paginator="true"
      paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rows-per-page-options="[10, 20, 30]"
      :global-filter-fields="['name', 'color', 'category.name', 'hidden']"
      :table-class="isProductsLoading ? 'h-15rem' : ''"
      data-key="id"
      removable-sort
      current-page-report-template="Товаров на странице:"
      responsive-layout="scroll"
      filter-display="menu"
    >
      <Column
        selection-mode="multiple"
        style="width: 3rem"
        :exportable="false"
      />

      <Column header="Изображение">
        <template #body="slotProps">
          <MyImage
            :src="getProductImage(slotProps.data.id) || imagePlaceholderUrl"
            :preview="!!getProductImage(slotProps.data.id)"
            class="w-7rem border-round"
            style="aspect-ratio: 1.5 / 1"
          />
        </template>
      </Column>

      <Column
        field="name"
        header="Наименование"
        :sortable="true"
        style="min-width: 250px"
      />

      <Column
        :show-filter-match-modes="false"
        field="categories"
        header="Категории"
        style="min-width: 10rem"
      >
        <template #filterheader>
          <div class="font-bold" style="padding: 18px 18px 0">
            Фильтр по категориям
          </div>
        </template>
        <template #body="slotProps">
          {{ slotProps.data.categories.map((cat) => cat.name).join(", ") }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <div class="w-20rem">
            <MultiSelect
              v-model="filterModel.value"
              :options="uniqueCategories"
              :show-toggle-all="false"
              :filter="true"
              option-label="name"
              placeholder="Любые категории"
              class="p-column-filter"
              @change="filterCallback()"
            />
          </div>
        </template>
      </Column>

      <Column
        :sortable="true"
        :show-filter-match-modes="false"
        field="hidden"
        header="Статус"
        export-header="Скрыт"
        style="min-width: 120px"
      >
        <template #body="slotProps">
          <span
            :class="
              'product-badge status-' +
                (slotProps.data.hidden ? 'hidden' : 'active')
            "
          >{{ computeHiddenLabel(slotProps.data.hidden) }}</span>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <div class="mb-3 font-bold">
            Фильтр по статусу
          </div>
          <Dropdown
            v-model="filterModel.value"
            :options="productStatuses"
            option-value="value"
            placeholder="Любой"
            class="p-column-filter"
            @change="filterCallback()"
          >
            <template #value="slotProps">
              <span
                v-if="slotProps.value !== null"
                :class="
                  'product-badge status-' +
                    (slotProps.value ? 'hidden' : 'active')
                "
              >{{ computeHiddenLabel(slotProps.value) }}</span>
              <span v-else>{{ slotProps.placeholder }}</span>
            </template>
            <template #option="slotProps">
              <span
                :class="
                  'product-badge status-' +
                    (slotProps.option.value ? 'hidden' : 'active')
                "
              >
                {{ slotProps.option.label }}</span>
            </template>
          </Dropdown>
        </template>
      </Column>

      <Column :exportable="false" style="width: 200px">
        <template #body="slotProps">
          <div class="admin-table__row-actions">
            <Button
              v-tooltip.bottom="'Дублировать'"
              icon="pi pi-copy"
              class="p-button-rounded p-button-outlined p-button-success"
              @click="duplicate(slotProps.data)"
            />
            <Button
              v-tooltip.bottom="'Редактировать'"
              icon="pi pi-pencil"
              class="p-button-rounded p-button-outlined p-button-info"
              @click="openEditProductDialog(slotProps.data)"
            />
            <Button
              v-tooltip.bottom="'Удалить'"
              icon="pi pi-trash"
              class="p-button-rounded p-button-outlined p-button-danger"
              @click="confirmDeleteProduct(slotProps.data)"
            />
          </div>
        </template>
      </Column>

      <template v-if="!isProductsLoading" #empty>
        <div class="flex align-items-center justify-content-center h-15rem">
          Не найдено ни одного товара.
        </div>
      </template>
    </DataTable>

    <ProductDialog
      v-model:visible="isDialogOpen"
      :product="currentProduct"
      :loading="dialogLoading"
      @create="create"
      @update="update"
      @hide="onDialogHide"
    />
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import type { ComputedRef, Ref } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import ProductDialog from '@/components/admin/ProductDialog/index.vue'
import type {
  Category,
  DataTableFilterMeta,
  Product,
  ProductDialogProp
} from '@/interfaces'
import { getUniqueListByKey } from '@/helpers'
import { DeleteManyResponse, FilterMatchMode } from '@/interfaces'
import { imagePlaceholderUrl, productStatuses } from '@/consts'

const toast = useToast()
const confirm = useConfirm()

const products: Ref<Product[]> = ref([])
const currentProduct: Ref<ProductDialogProp> = ref({} as ProductDialogProp)
const selectedProducts: Ref<Product[]> = ref([])
const isProductsLoading: Ref<boolean> = ref(true)
const dialogLoading: Ref<boolean> = ref(false)
const isDialogOpen: Ref<boolean> = ref(false)
const filters: Ref<DataTableFilterMeta> = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  categories: { value: null, matchMode: FilterMatchMode.ARRAY_CONTAINS_BY_ID },
  hidden: { value: null, matchMode: FilterMatchMode.EQUALS }
})

const uniqueCategories: ComputedRef<Category[]> = computed(() => {
  const flatCategories = products.value.reduce((acc: Category[], product) => {
    acc.push(...product.categories)
    return acc
  }, [])
  return getUniqueListByKey<Category>(flatCategories, 'id')
})

onMounted(async () => {
  await nextTick()
  await fetchProducts()
})

const openEditProductDialog = (product = {} as ProductDialogProp) => {
  currentProduct.value = { ...product }
  isDialogOpen.value = true
}
const duplicate = (product: Product) => {
  openEditProductDialog({
    ...product,
    id: undefined,
    slug: undefined,
    categories: undefined,
    name: product.name + ' копия'
  })
}

const confirmDeleteProduct = (prod: Product) => {
  currentProduct.value = prod
  confirm.require({
    header: 'Удаление товара',
    message: `<p class="mb-2">Вы уверены, что хотите <b>удалить</b> товар <b>«${currentProduct.value.name}»</b>?</p>Это действие <b>невозможно отменить</b>.`,
    icon: 'pi pi-trash',
    acceptClass: 'p-button-danger',
    accept: () => deleteProduct()
  })
}
const confirmDeleteProducts = () => {
  confirm.require({
    header: 'Удаление товаров',
    message: `<p class="mb-1">Вы уверены, что хотите <b>удалить</b> выбранные <b>(${selectedProducts.value.length}) товары</b>?</p>Это действие <b>невозможно отменить</b>.`,
    icon: 'pi pi-trash',
    acceptClass: 'p-button-danger',
    accept: () => deleteProducts()
  })
}

const create = async (product: ProductDialogProp) => {
  dialogLoading.value = true
  const { data } = await useApiCall<Product>('/api/products', {
    method: 'POST',
    body: product
  })
  if (data) {
    products.value.push(data)
    dialogLoading.value = false
    isDialogOpen.value = false
    toast.add({
      severity: 'success',
      summary: 'Товар добавлен',
      detail: `Товар «${product.name}» успешно добавлен.`,
      life: 3000
    })
  }
  dialogLoading.value = false
}
const update = async (product: ProductDialogProp) => {
  dialogLoading.value = true
  const { data } = await useApiCall<Product>('/api/products/' + product.id, {
    method: 'PATCH',
    body: product
  })
  if (data) {
    products.value[products.value.findIndex(prod => prod.id === product.id)] =
      data
    dialogLoading.value = false
    isDialogOpen.value = false
    toast.add({
      severity: 'info',
      summary: 'Товар обновлен',
      detail: `Товар «${product.name}» успешно обновлен.`,
      life: 3000
    })
  }
  dialogLoading.value = false
}
const deleteProduct = async () => {
  isProductsLoading.value = true
  const productName = currentProduct.value.name
  const { data } = await useApiCall<Product>(
    '/api/products/' + currentProduct.value.id,
    { method: 'DELETE' }
  )
  if (data) {
    products.value = products.value.filter(
      (val: Product) => val.id !== currentProduct.value.id
    )
    isProductsLoading.value = false
    toast.add({
      severity: 'warn',
      summary: 'Товар удален',
      detail: `Товар «${productName}» успешно удален.`,
      life: 3000
    })
  }
  isProductsLoading.value = false
}
const deleteProducts = async () => {
  isProductsLoading.value = true
  const selectedIds = selectedProducts.value.map(
    (product: Product) => product.id
  )
  const { data } = await useApiCall<DeleteManyResponse>('/api/products/', {
    method: 'DELETE',
    query: { ids: selectedIds }
  })
  if (data) {
    products.value = products.value.filter(
      (product: Product) => !selectedIds.includes(product.id)
    )
    selectedProducts.value = []
    isProductsLoading.value = false
    toast.add({
      severity: 'warn',
      summary: 'Товары удалены',
      detail: `Выбранные товары (${data.count}) успешно удалены.`,
      life: 3000
    })
  }
  isProductsLoading.value = false
}

const computeHiddenLabel = (isHidden: boolean) =>
  productStatuses.find(status => status.value === isHidden)?.label

const getProductImage = (productId: Product['id']) => {
  const product = products.value.find(prod => prod.id === productId)
  return product?.images.find(img => img.isPrimary)?.url
}

const onDialogHide = () => {
  currentProduct.value = {} as Product
}

const fetchProducts = async () => {
  isProductsLoading.value = true
  const { data } = await useApiCall<Product[]>('/api/products')
  if (data) {
    products.value = data
  }
  isProductsLoading.value = false
}

definePageMeta({
  layout: 'admin'
})
useHead({
  title: 'Товары'
})
</script>

<style lang="scss">
.admin-product-page {
  .p-paginator-bottom {
    padding: 12px 0 0;
  }
}
</style>
