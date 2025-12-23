// Pure TypeScript interfaces for Category entities

export interface CategoryDto {
  id: string;
  code: string;
  name: string;
  price_deviation_limit: number;
  qty_deviation_limit: number;
  description?: string;
  is_active: boolean;
  is_used_in_recipe: boolean;
  is_sold_directly: boolean;
  is_edit_type?: boolean;
  tax_profile_id?: string;
  tax_profile_name?: string;
  tax_rate?: number;
}

export interface SubCategoryDto {
  id: string;
  code: string;
  name: string;
  price_deviation_limit: number;
  qty_deviation_limit: number;
  description?: string;
  is_active: boolean;
  product_category_id: string;
  is_used_in_recipe: boolean;
  is_sold_directly: boolean;
  is_edit_type?: boolean;
  tax_profile_id?: string;
  tax_profile_name?: string;
  tax_rate?: number;
}

export interface ItemGroupDto {
  id: string;
  code: string;
  name: string;
  price_deviation_limit: number;
  qty_deviation_limit: number;
  description?: string;
  is_active: boolean;
  product_subcategory_id: string;
  is_used_in_recipe: boolean;
  is_sold_directly: boolean;
  is_edit_type?: boolean;
  tax_profile_id?: string;
  tax_profile_name?: string;
  tax_rate?: number;
}

// Form data types (without id field)
export interface CategoryFormData {
  code: string;
  name: string;
  price_deviation_limit: number;
  qty_deviation_limit: number;
  description?: string;
  is_active: boolean;
  is_used_in_recipe: boolean;
  is_sold_directly: boolean;
  is_edit_type?: boolean;
  tax_profile_id?: string;
  tax_profile_name?: string;
  tax_rate?: number;
}

export interface SubCategoryFormData {
  code: string;
  name: string;
  price_deviation_limit: number;
  qty_deviation_limit: number;
  description?: string;
  is_active: boolean;
  product_category_id: string;
  is_used_in_recipe: boolean;
  is_sold_directly: boolean;
  is_edit_type?: boolean;
  tax_profile_id?: string;
  tax_profile_name?: string;
  tax_rate?: number;
}

export interface ItemGroupFormData {
  code: string;
  name: string;
  price_deviation_limit: number;
  qty_deviation_limit: number;
  description?: string;
  is_active: boolean;
  product_subcategory_id: string;
  is_used_in_recipe: boolean;
  is_sold_directly: boolean;
  is_edit_type?: boolean;
  tax_profile_id?: string;
  tax_profile_name?: string;
  tax_rate?: number;
}

// Tree node type enum
export enum NODE_TYPE {
  CATEGORY = "category",
  SUBCATEGORY = "subcategory",
  ITEM_GROUP = "itemGroup",
}

// Tree node interface
export interface CategoryNode {
  id: string;
  name: string;
  code: string;
  description?: string;
  type: NODE_TYPE;
  children?: CategoryNode[];
  itemCount?: number;
  is_active?: boolean;
  product_category_id?: string;
  product_subcategory_id?: string;
  price_deviation_limit?: number;
  qty_deviation_limit?: number;
  is_used_in_recipe?: boolean;
  is_sold_directly?: boolean;
  tax_profile_id?: string;
  tax_profile_name?: string;
  tax_rate?: number;
}

// Re-export Zod schemas for backward compatibility
export {
  CategorySchema,
  SubCategorySchema,
  ItemGroupSchema,
  CategoryFormSchema,
  SubCategoryFormSchema,
  ItemGroupFormSchema,
  createCategorySchema,
  createSubCategorySchema,
  createItemGroupSchema,
} from "@/app/[locale]/(root)/product-management/category/_schemas/category-form.schema";
