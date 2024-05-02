/* eslint-disable no-use-before-define */

import { TreeNode } from 'primevue/tree'
import {
  Product as PrismaProduct,
  ProductImage as PrismaProductImage,
  Category as PrismaCategory,
  ProductAttribute,
  ProductAttributeValue,
  ProductAttributeBooleanValue,
  ProductAttributeDateValue,
  ProductAttributeFloatValue,
  ProductAttributeIntegerValue,
  ProductAttributeSelectValue,
  ProductAttributeStringValue,
  ProductAttributeSelectOption
} from '@prisma/client'

export type DatabaseObject<T> = {
  id: number;
  data: T;
};

export type Info = {
  app: {
    name: string;
    description: string;
    keywords: string;
    defaultCategoryId: number;
  };
  contacts: {
    email: string;
    phoneNumbers: string[];
    address: string;
  };
};

export interface DeleteManyResponse {
  count: number;
}
export interface UserCreationAttrs {
  username: string;
  password: string;
}
export interface User extends UserCreationAttrs {
  id: number;
}

export interface CategoryCreateDto {
  name: string;
  parentId?: number;
  view?: 'cards' | 'table';
}

export interface CategoryUpdateDto {
  id: number;
  slug?: string;
  name?: string;
  parentId?: number;
  view?: 'cards' | 'table';
}

export interface CategoryDialogProp {
  id?: number;
  name: string;
  parentId?: number | null;
  view?: 'cards' | 'table';
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  parentId: number | null;
  view: 'cards' | 'table';
  parent: Pick<Category, 'slug' | 'name'>;
  children: Category[];
  products: Product[];
  _count: { products: number; children: number };
}

export type AttributeValue = {
  id: number;
  name: string;
  dataType: AttributeDataType;
  value: any;
  unit: string | null;
  showInCatalog: boolean;
  sortable: boolean;
  filterable: boolean;
  options: AttributeOption[];
};

export enum AttributeDataType {
  STRING = 'string',
  INTEGER = 'integer',
  FLOAT = 'float',
  BOOLEAN = 'boolean',
  DATE = 'date',
  SELECT = 'select',
}

export type AttributeOption = { id: number; label: string };
export type AttributeOptionCreateDto = { id: number; label: string };
export type AttributeDialogOption = { id?: number; label: string };

export type ProductImageCreateDto = {
  url: string;
  isPrimary: boolean;
};

export type ProductImageUpdateDto = {
  id?: number;
  url: string;
  isPrimary: boolean;
};

export type ProductDialogImageTabProp = {
  tempId: string;
  url: string;
  isPrimary: boolean;
};

export type ProductImage = {
  id: number;
  publicId: string;
  url: string;
  isPrimary: boolean;
};

export interface ProductCreateDto {
  name: string;
  description?: string;
  hidden?: boolean;
  images?: ProductImageCreateDto[];
  categoryIds: number[];
  attributes?: AttributeValue[];
}

export interface ProductUpdateDto {
  id?: number;
  name?: string;
  slug?: string;
  description?: string;
  hidden?: boolean;
  images?: [ProductImageCreateDto, ProductImage];
  categoryIds?: number[];
  categories: Category[];
  attributes?: AttributeValue[];
}

export interface ProductDialogProp {
  id?: number;
  name: string;
  slug?: string;
  description: string | null;
  hidden: boolean;
  images?: ProductImage[];
  categories?: Category[];
  attributes?: AttributeValue[];
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  hidden: boolean;
  slug: string;
  images: ProductImage[];
  categories: Category[];
  attributes: AttributeValue[];
}

export interface AttributeCreateDto {
  name: string;
  dataType: AttributeDataType;
  unit?: string;
  showInCatalog?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  options?: AttributeOptionCreateDto[];
  categoryIds: number[];
}

export interface AttributeUpdateDto {
  id: number;
  name?: string;
  unit?: string;
  dataType?: AttributeDataType;
  showInCatalog?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  options?: (AttributeOption & AttributeOptionCreateDto)[];
  categoryIds?: number[];
  categories?: Category[];
}

export interface AttributeDialogProp {
  id?: number;
  name: string;
  dataType: AttributeDataType;
  unit: string | null;
  showInCatalog: boolean;
  sortable: boolean;
  filterable: boolean;
  options: AttributeOption[];
  categories: Category[];
}

export interface Attribute {
  id: number;
  name: string;
  dataType: AttributeDataType;
  unit: string | null;
  showInCatalog: boolean;
  sortable: boolean;
  filterable: boolean;
  options: AttributeOption[];
  categories: Category[];
}

export interface PageCreateDto {
  title: string;
}

export interface PageUpdateDto {
  id: number;
  slug?: string;
  title?: string;
  content?: string;
  updatedAt?: string;
}

export interface PageDialogProp {
  id: number;
  slug: string;
  title: string;
}

export interface Page {
  id: number;
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface LinkCreateDto {
  title: string;
  url: string;
  sortOrder: number;
  newTab?: boolean;
}

export interface LinkUpdateDto {
  id: number;
  title?: string;
  url?: string;
  newTab?: boolean;
  sortOrder?: number;
}

export type LinkUpdateManyDto = LinkUpdateDto[];

export interface LinkDialogProp {
  id?: number;
  title: string;
  url: string;
  newTab: boolean;
  sortOrder: number;
}

export interface Link {
  id: number;
  title: string;
  url: string;
  newTab: boolean;
  sortOrder: number;
}

// =================================

export type TreeNodeConstructorOptions<T> = Omit<TreeNode, 'key' | 'label'> & {
  uniqueKey: keyof T;
  parentKey: keyof T;
  labelKey: keyof T;
};

export enum FilterMatchMode {
  STARTS_WITH = 'startsWith',
  CONTAINS = 'contains',
  ARRAY_CONTAINS_BY_ID = 'arrayContainsById',
  NOT_CONTAINS = 'notContains',
  ENDS_WITH = 'endsWith',
  EQUALS = 'equals',
  NOT_EQUALS = 'notEquals',
  IN = 'in',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUAL_TO = 'lte',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUAL_TO = 'gte',
  BETWEEN = 'between',
  DATE_IS = 'dateIs',
  DATE_IS_NOT = 'dateIsNot',
  DATE_BEFORE = 'dateBefore',
  DATE_AFTER = 'dateAfter',
}

export type DataTableFilterMeta = { [key: string]: DataTableFilterMetaData };

export interface DataTableFilterMetaData {
  value: any;
  matchMode: FilterMatchMode;
}

export type PrismaProductWithIncludes = PrismaProduct & {
  images: PrismaProductImage[];
  categories: PrismaCategory[];
  attributes: (ProductAttributeValue & {
    attribute: ProductAttribute & { options: ProductAttributeSelectOption[] };
    stringValue: ProductAttributeStringValue | null;
    integerValue: ProductAttributeIntegerValue | null;
    floatValue: ProductAttributeFloatValue | null;
    booleanValue: ProductAttributeBooleanValue | null;
    dateValue: ProductAttributeDateValue | null;
    selectValue:
      | (ProductAttributeSelectValue & {
          option: ProductAttributeSelectOption;
        })[]
      | null;
  })[];
};

export type PrismaProductAttributeNotSelectValue =
  | (ProductAttributeStringValue | null)
  | (ProductAttributeIntegerValue | null)
  | (ProductAttributeFloatValue | null)
  | (ProductAttributeBooleanValue | null)
  | (ProductAttributeDateValue | null);

export type ProductSortField = {
  field?: keyof Product;
  attrId?: number;
  label: string;
};

export type SortOrder = {
  label: string;
  name: 'asc' | 'desc';
  value: 1 | -1;
};

export type ProductsLayout = 'grid' | 'list';

export type AttributeFilter = {
  id: number;
  name: string;
  unit: string | null;
  dataType: string;
  values: any[];
  min?: number;
  max?: number;
};
export type AttributesFilter = { [key: string]: AttributeFilter };
export type AttributeFiltersState = {
  [key: string]: FilterStateCheckbox | FilterStateBoolean | FilterStateRange;
};
export type AttributeFilterState<T> = { [key: string]: T };
export type FilterStateCheckbox =
  AttributeFilterState<AttributeFilterCheckboxValue>;
export type FilterStateBoolean =
  AttributeFilterState<AttributeFilterRadioValue>;
export type FilterStateRange = AttributeFilterState<AttributeFilterRangeValue>;
export type AttributeFilterCheckboxValue = { [key: string]: boolean };
export type AttributeFilterRangeValue = [number, number];
export type AttributeFilterRadioValue = boolean | null;

export type RouteQuery = { [key: string]: string[] };
