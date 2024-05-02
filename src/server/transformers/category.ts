import type { Category } from '@prisma/client'
import type { PrismaProductWithIncludes } from '@/interfaces'
import { transformProduct } from '@/server/transformers/product'

export const transformCategory = (
  category: Category & { products: PrismaProductWithIncludes[] }
) => ({
  ...category,
  products: category.products.map(prod => transformProduct(prod))
})
