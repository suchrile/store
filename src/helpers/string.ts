export const replaceSimilarLetters = (value: string) =>
  value.replace('ё', 'е').replace('ъ', 'ь')
export const deleteNonLetters = (value: string) =>
  value.replace(/[^a-zа-я]/g, '')
export const deleteSpaces = (value: string) => value.replace(' ', '')
export const modifyForSearch = (value: string) =>
  deleteNonLetters(
    replaceSimilarLetters(deleteSpaces(value.toLowerCase().trim()))
  )
