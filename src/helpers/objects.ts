import { TreeNode, TreeSelectionKeys } from 'primevue/tree'
import { TreeNodeConstructorOptions } from '@/interfaces'

export const getUniqueListByKey = <T>(arr: T[], key: keyof T) => {
  if (!arr) {
    return []
  }
  return [...new Map(arr.map(item => [item[key], item])).values()]
}

export const sortCompareBy = <T>(
  field: keyof T,
  order: 1 | -1,
  primer: Function | null = null
) => {
  const key = (x: T) => (primer ? primer(x[field]) : x[field])
  return (a: T, b: T) => {
    a = key(a)
    b = key(b)
    return order * (a < b ? -1 : b < a ? 1 : 0)
  }
}

export const makeNested = <T>(
  arr: T[],
  uniqueKey: keyof T,
  parentKey: keyof T
) => {
  const nestedCategories: (T & { children: T[] })[] = []
  const itemMap = arr.reduce((acc, item) => {
    const itemUniqueKey = String(item[uniqueKey])
    acc[itemUniqueKey] = { ...item, children: [] }
    return acc
  }, {} as { [key: string]: T & { children: T[] } })
  arr.forEach((item) => {
    const itemUniqueKey = item[uniqueKey]
    const itemParentUniqueKey = item[parentKey]
    const parent = itemMap[String(itemParentUniqueKey)]
    if (parent) {
      parent.children.push(itemMap[String(itemUniqueKey)])
    } else {
      nestedCategories.push(itemMap[String(itemUniqueKey)])
    }
  })
  return nestedCategories
}

export const mapToNodeTree = <T>(
  arr: T[],
  { uniqueKey, parentKey, labelKey, ...optional }: TreeNodeConstructorOptions<T>
): TreeNode[] => {
  const nestedArr = makeNested(arr, uniqueKey, parentKey)
  return mapDeep<T & { children: T[] }, TreeNode>(
    nestedArr,
    'children',
    item => ({
      key: String(item[uniqueKey]),
      label: String(item[labelKey]),
      children: item.children as TreeNode[],
      ...optional
    })
  )
}

export const mapToTreeSelectionKeys = <T>(
  arr: T[],
  selectedArr: T[],
  uniqueKey: keyof T,
  parentKey: keyof T
) => {
  const result: TreeSelectionKeys = {}
  selectedArr.forEach((item) => {
    const itemKey = String(item[uniqueKey])
    const childrenLength = arr.filter(
      el => el[parentKey] === item[uniqueKey]
    ).length
    const checkedChildrenLength = selectedArr.filter(
      el => el[parentKey] === item[uniqueKey]
    ).length
    if (childrenLength && childrenLength > checkedChildrenLength) {
      result[itemKey] = { checked: false, partialChecked: true }
    } else {
      result[itemKey] = { checked: true, partialChecked: false }
    }
  })
  return result
}

export const flattenDeep = <T>(arr: T[], key: keyof T): T[] => {
  const acc: T[] = []
  forEachDeep(arr, key, (item) => {
    acc.push(item)
  })
  return acc
}

export const mapDeep = <T, U>(
  arr: T[],
  key: keyof T,
  callback: (item: T) => U
): U[] => {
  return arr.map((item) => {
    const children = item[key]
    const toCallback =
      Array.isArray(children) && children.length
        ? { ...item, [key]: mapDeep(children, key, callback) }
        : item
    return callback(toCallback)
  })
}

export const forEachDeep = <T>(
  arr: T[],
  key: keyof T,
  callback: (item: T) => void
): void => {
  arr.forEach((item) => {
    const children = item[key]
    Array.isArray(children) &&
      children.length &&
      forEachDeep(children, key, callback)
    callback(item)
  })
}

export const filterDeep = <T>(
  arr: T[],
  key: keyof T,
  callback: (item: T) => boolean
): T[] => {
  return arr.filter((item) => {
    const children = item[key]
    Array.isArray(children) &&
      children.length &&
      filterDeep(children, key, callback)
    return callback(item)
  })
}

export const filterFromDeep = <T>(
  arr: T[],
  key: keyof T,
  callback: (item: T) => boolean
): T[] => {
  const flat = flattenDeep(arr, key)
  return flat.filter(item => callback(item))
}

export const findDeep = <T>(
  arr: T[],
  key: keyof T,
  callback: (item: T) => boolean
): T | undefined => {
  for (const item of arr) {
    const children = item[key]
    if (callback(item)) {
      return item
    } else if (children && Array.isArray(children) && children.length) {
      const target = findDeep(children, key, callback)
      if (target) {
        return target
      }
    }
  }
}

export const pushDeep = <T>(
  arr: T[],
  childrenKey: keyof T,
  value: T,
  where: (item: T) => boolean,
  allowRoot = false
): T[] => {
  const result = arr
  const target = findDeep(arr, childrenKey, item => where(item))
  if (target) {
    const targetChildren = target[childrenKey] as T[]
    targetChildren.push(value)
  } else {
    allowRoot && result.push(value)
  }
  return result
}

export const updateDeep = <T>(
  arr: T[],
  childrenKey: keyof T,
  newValue: T,
  where: (item: T) => boolean
): T[] => {
  return mapDeep(arr, childrenKey, (item) => {
    return where(item) ? newValue : item
  })
}
