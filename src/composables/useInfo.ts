import { undeletableCategoryId } from '~/consts'
import type { Info } from '@/interfaces'

export const useInfo = () =>
  useState<Info>('info', () => ({
    app: {
      name: '',
      description: '',
      keywords: '',
      defaultCategoryId: undeletableCategoryId
    },
    contacts: {
      email: '',
      phoneNumbers: [],
      address: ''
    }
  }))
