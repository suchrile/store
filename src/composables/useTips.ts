const tips = {
  products: [
    'Товары можно сортировать по возврастанию и убыванию определенного параметра – просто кликните на название колонки.',
    'Для поиска товаров можно использовать любые данные из таблицы.',
    'Товары можно скрывать из каталога. Для этого в окне редактирования товара поставьте галочку «Не показывать в каталоге».',
    'Для фильтрации товаров по нужным параметрам нажните на иконку фильтра в названии колонки.',
    'Быстро узнать, скрыт ли товар из каталога, можно по столбцу «Статус».'
  ],
  'product-add-photo': [
    'Чтобы добавить новое фото товара – кликните на окно предпросмотра выше.'
  ],
  'product-add-color': [
    'Если нужный цвет появился в выпадающем списке – выберите его.'
  ],
  categories: [
    '<span>При удалении категории, все товары, которые в ней находились, автоматически переносятся в неудаляемую категорию «Без категории».</span>' +
      '<span>Вы можете изменить её название.</span>'
  ],
  links: [
    '<span>Здесь вы можете изменять ссылки, которые отображаются в шапке сайта.</span>' +
      '<span>Чтобы изменить порядок отображения ссылок в шапке, потяните за значок <i class="pi pi-align-justify text-xl"></i> и переместите ссылку в нужную позицию.</span>'
  ]
}

export type tipsState = {
  [key in keyof typeof tips]: number[];
};
export type TipTarget = keyof typeof tips;

export const useTips = () => {
  const useShowTips = () => useState('show_tips', () => false)

  onMounted(() => setShowTips(localStorage.getItem('show_tips') === 'true'))

  const setShowTips = (value: boolean) => {
    localStorage.setItem('show_tips', value.toString())
    const showTips = useShowTips()
    showTips.value = value
  }

  const generateTip = (target: keyof typeof tips) => {
    const targetTipsArray: string[] = tips[target]
    const tipsState: tipsState = JSON.parse(
      localStorage.getItem('shown_tips') ?? '{}'
    )
    const targetTipsState = tipsState[target] ?? []
    const isAllTargetTipsShown =
      targetTipsState.length >= targetTipsArray.length
    const newTargetTipIndex = isAllTargetTipsShown ? 0 : targetTipsState.length
    const newTargetTipsState = isAllTargetTipsShown
      ? [newTargetTipIndex]
      : [...targetTipsState, newTargetTipIndex]
    localStorage.setItem(
      'shown_tips',
      JSON.stringify({ ...tipsState, [target]: newTargetTipsState })
    )
    return targetTipsArray[newTargetTipIndex]
  }

  return { tips, useShowTips, setShowTips, generateTip }
}
