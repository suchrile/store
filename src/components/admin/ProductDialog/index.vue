<template>
  <Dialog
    class="product-add-dialog p-fluid"
    :header="dialogHeader"
    :modal="true"
    :visible="visible"
    :closable="!loading"
    :close-on-escape="!loading"
    style="width: 500px"
    @show="showHandler"
    @hide="hideHandler"
    @update:visible="$emit('update:visible', $event)"
  >
    <TabView v-model:active-index="activeTabIndex">
      <TabPanel header="Основное">
        <LazyAdminProductDialogTabMain
          v-model:product="product"
          v-model:selected-categories="selectedCategories"
          :categories="categories"
          :v$="v$"
          :loading="loading"
        />
      </TabPanel>

      <TabPanel header="Изображения">
        <AdminProductDialogTabImages
          v-model:images="images"
          :loading="loading"
        />
      </TabPanel>

      <TabPanel header="Атрибуты">
        <AdminProductDialogTabAttributes
          v-model:attributes="attributes"
          v-model:attributesValues="attributesValues"
          :v$="v$.attributes"
          :loading="loading"
          @add="addAttributeRule"
          @delete="deleteAttributeRule"
        />
      </TabPanel>
    </TabView>

    <template #footer>
      <Button
        label="Отменить"
        icon="pi pi-times"
        class="p-button-text"
        :disabled="loading"
        @click="$emit('update:visible', false)"
      />
      <Button
        :label="submitLabel"
        icon="pi pi-check"
        class="p-button-text"
        :loading="loading"
        @click="submit"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import type { PropType, Ref } from 'vue'
import { v4 as uuid } from 'uuid'
import { useVuelidate } from '@vuelidate/core'
import type { ValidationArgs } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import type { TreeNode, TreeSelectionKeys } from 'primevue/tree'
import { mapToNodeTree, mapToTreeSelectionKeys } from '@/helpers'
import type {
  AttributeValue,
  Category,
  Product,
  ProductDialogProp,
  ProductDialogImageTabProp
} from '@/interfaces'

const props = defineProps({
  product: { type: Object as PropType<ProductDialogProp>, required: true },
  visible: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['update:visible', 'hide', 'create', 'update'])

const product: Ref<ProductDialogProp> = ref({} as ProductDialogProp)
const attributes: Ref<{ [key: number]: AttributeValue }> = ref({})
const attributesValues: Ref<{ [key: number]: any }> = ref({})
const categories: Ref<TreeNode[]> = ref([])
const selectedCategories: Ref<TreeSelectionKeys> = ref({})
const images: Ref<ProductDialogImageTabProp[]> = ref([])
const activeTabIndex: Ref<number> = ref(0)

const rules = reactive({
  product: {
    name: { required: helpers.withMessage('Обязательное поле', required) }
  },
  categoryIds: { required: helpers.withMessage('Обязательное поле', required) },
  attributes: {} as { [key: number]: ValidationArgs }
})
const toValidate = reactive({
  product,
  categoryIds: selectedCategories,
  attributes: attributesValues
})
const v$ = useVuelidate(rules, toValidate)

const dialogHeader = computed(
  () => (product.value.id ? 'Редактирование' : 'Добавление') + ' товара'
)
const submitLabel = computed(() =>
  product.value.id ? 'Сохранить' : 'Добавить'
)

onMounted(async () => {
  await nextTick()
  await fetchCategories()
})

const addAttributeRule = (id: number) => {
  rules.attributes[id] = {
    required: helpers.withMessage('Обязательное поле', required)
  }
}
const deleteAttributeRule = (id: number) => {
  delete rules.attributes[id]
}

const transformImages = () => {
  images.value = product.value.images.map(img => ({
    ...img,
    tempId: uuid()
  }))
}
const transformCategories = () => {
  selectedCategories.value = mapToTreeSelectionKeys(
    categories.value,
    product.value.categories,
    'id',
    'parentId'
  )
}
const transformAttributes = () => {
  product.value.attributes.forEach((attr) => {
    attributes.value[attr.id] = attr
    attributesValues.value[attr.id] = attr.value
    if (attr.required) {
      rules.attributes[attr.id] = {
        required: helpers.withMessage('Обязательное поле', required)
      }
    }
  })
}

const switchToInvalidTab = () => {
  if (v$.value.product.$errors.length || v$.value.categoryIds.$errors.length) {
    activeTabIndex.value = 0
  } else if (v$.value.attributes.$errors.length) {
    activeTabIndex.value = 2
  }
}

const showHandler = () => {
  product.value = props.product
  if (product.value.id) {
    transformImages()
    transformCategories()
    transformAttributes()
  }
}
const hideHandler = () => {
  product.value = {} as Product
  images.value = []
  selectedCategories.value = {}
  attributes.value = {}
  attributesValues.value = {}
  activeTabIndex.value = 0
  rules.attributes = {}
  v$.value.$reset()
  emit('hide')
}

const submit = async () => {
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) {
    switchToInvalidTab()
    return
  }

  const toEmit = {
    ...product.value,
    attributes: Object.keys(attributesValues.value).map(key => ({
      id: +key,
      value: attributesValues.value[+key]
    })),
    images: images.value,
    categoryIds: Object.keys(selectedCategories.value).map(el =>
      parseInt(el)
    )
  }

  if (product.value.id) {
    emit('update', toEmit)
  } else {
    emit('create', toEmit)
  }
}

const fetchCategories = async () => {
  const { data } = await useApiCall<Category[]>('/api/categories')
  if (data) {
    categories.value = mapToNodeTree(data, {
      uniqueKey: 'id',
      parentKey: 'parentId',
      labelKey: 'name'
    })
  }
}
</script>

<style lang="scss">
.product-add-dialog {
  .p-tabview-nav-link {
    padding: 14px !important;
  }
  .p-tabview-panels {
    padding: 25px 0 0;
  }
}
</style>
