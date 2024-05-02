<template>
  <div class="product-dialog-attributes-tab attributes">
    <div class="attributes__add-field field mb-5">
      <label for="product-attributes-dropdown">Добавление атрибутов</label>
      <div class="flex gap-2">
        <AutoComplete
          id="product-attributes-dropdown"
          v-model="newAttribute"
          :suggestions="newAttributeSuggestions"
          :disabled="loading"
          option-label="name"
          dropdown
          placeholder="Начните вводить название атрибута"
          class="w-full"
          @change="searchValue = $event.value"
          @complete="getSuggestions($event)"
          @item-select="add()"
        >
          <template #empty>
            <span style="padding: 0 1.25rem">{{ emptySuggestionsText }}</span>
          </template>
        </AutoComplete>
      </div>
    </div>

    <ScrollView v-if="sortedAttributes.length" :max-height="400" vertical>
      <div class="attributes__list" style="min-height: 200px">
        <div
          v-for="attr in sortedAttributes"
          :key="attr.id"
          class="attributes__item field"
        >
          <div class="flex gap-2 align-items-end w-full">
            <div class="field mb-0" style="width: calc(100% - 49px)">
              <label :for="'product-dialog-attribute-' + attr.id">{{
                getAttributeLabel(attr.id)
              }}</label>
              <AdminProductDialogAttribute
                :id="'product-dialog-attribute-' + attr.id"
                :model-value="attributesValues[attr.id]"
                :attribute="attr"
                :loading="loading"
                :class="{
                  'p-invalid':
                    attr.required && v$.$dirty && v$[attr.id].$errors.length,
                }"
                @update:model-value="
                  emit('update:attributesValues', {
                    ...attributesValues,
                    [attr.id]: $event,
                  })
                "
              />
            </div>
            <div class="field mb-0" style="width: 42px">
              <Button
                v-tooltip.bottom="'Удалить'"
                icon="pi pi-trash"
                class="p-button-outlined p-button-danger p-button-icon-only"
                :disabled="loading"
                @click="remove(attr.id)"
              />
            </div>
          </div>
          <div v-if="attr.required && v$.$dirty && v$[attr.id].$errors.length">
            <small
              v-for="error in v$[attr.id].$errors"
              :key="error.$uid"
              class="p-error"
            >{{ error.$message }}</small>
          </div>
        </div>
      </div>
    </ScrollView>

    <div
      v-else
      class="flex align-items-center justify-content-center"
      style="height: 200px"
    >
      У этого товара нет атрибутов.
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, Ref } from 'vue'
import { AutoCompleteCompleteEvent } from 'primevue/autocomplete'
import { Validation } from '@vuelidate/core'
import { Attribute, AttributeValue } from '@/interfaces'

const props = defineProps({
  attributes: {
    type: Object as PropType<{ [key: string]: AttributeValue }>,
    required: true
  },
  attributesValues: {
    type: Object as PropType<{ [key: string]: any }>,
    required: true
  },
  v$: { type: Object as PropType<Validation>, required: true },
  loading: { type: Boolean, default: false }
})
const emit = defineEmits([
  'update:attributesValues',
  'update:attributes',
  'add',
  'delete'
])

const attributesList: Ref<Attribute[]> = ref([])
const searchValue: Ref<string> = ref('')
const newAttribute: Ref<Attribute | null> = ref(null)
const newAttributeSuggestions: Ref<Attribute[]> = ref([])

const unusedAttributes = computed(() =>
  attributesList.value.filter(
    attr => !Object.keys(props.attributes).includes(String(attr.id))
  )
)
const emptySuggestionsText = computed(() =>
  unusedAttributes.value.length
    ? `Атрибут «${searchValue.value.trim()}» не найден`
    : 'Нет доступных атрибутов'
)

const sortedAttributes = computed(() =>
  Object.values(props.attributes).sort((a, b) => a.name.localeCompare(b.name))
)

onMounted(async () => {
  await nextTick()
  await fetchAttributes()
})

const getSuggestions = ({ query }: AutoCompleteCompleteEvent) => {
  if (query) {
    newAttributeSuggestions.value = unusedAttributes.value.filter(attr =>
      attr.name.toLowerCase().includes(query.toLowerCase())
    )
  } else {
    newAttributeSuggestions.value = [...unusedAttributes.value]
  }
}

const add = () => {
  if (!newAttribute.value) {
    return
  }
  if (newAttribute.value?.required) {
    emit('add', newAttribute.value.id)
  }
  emit('update:attributesValues', {
    ...props.attributesValues,
    [newAttribute.value.id]: null
  })
  emit('update:attributes', {
    ...props.attributes,
    [newAttribute.value.id]: newAttribute.value
  })
  newAttribute.value = null
}
const remove = (id: number) => {
  const attribute = props.attributes[id]
  const attrs = props.attributes
  const attributesValues = props.attributesValues
  delete attrs[id]
  delete attributesValues[id]
  emit('update:attributesValues', attributesValues)
  if (attribute.required) {
    emit('delete', id)
  }
}

const getAttributeLabel = (id: number) => {
  const attribute = props.attributes[id]
  return attribute.name + (attribute.unit ? `, ${attribute.unit}` : '')
}

const fetchAttributes = async () => {
  const { data } = await useApiCall<Attribute[]>('/api/attributes')
  if (data) {
    attributesList.value = data
  }
}
</script>

<style scoped lang="scss">
.attributes {
  &__item:last-child {
    margin-bottom: 0;
  }
}
</style>
