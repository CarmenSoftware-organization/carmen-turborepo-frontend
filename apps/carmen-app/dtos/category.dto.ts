import { z } from "zod";

// Schema factory functions that accept custom validation messages
export const createCategorySchema = (messages?: { codeRequired?: string; nameRequired?: string }) => z.object({
    id: z.string(),
    code: z.string().min(1, { message: messages?.codeRequired ?? "Code is required" }),
    name: z.string().min(1, { message: messages?.nameRequired ?? "Name is required" }),
    price_deviation_limit: z.number(),
    qty_deviation_limit: z.number(),
    description: z.string().optional(),
    is_active: z.boolean(),
    is_used_in_recipe: z.boolean(),
    is_sold_directly: z.boolean(),
    is_edit_type: z.boolean().optional(),
});

export const createSubCategorySchema = (messages?: { codeRequired?: string; nameRequired?: string }) => z.object({
    id: z.string(),
    code: z.string().min(1, { message: messages?.codeRequired ?? "Code is required" }),
    name: z.string().min(1, { message: messages?.nameRequired ?? "Name is required" }),
    price_deviation_limit: z.number(),
    qty_deviation_limit: z.number(),
    description: z.string().optional(),
    is_active: z.boolean(),
    product_category_id: z.string(),
    is_used_in_recipe: z.boolean(),
    is_sold_directly: z.boolean(),
    is_edit_type: z.boolean().optional(),
});

export const createItemGroupSchema = (messages?: { codeRequired?: string; nameRequired?: string }) => z.object({
    id: z.string(),
    code: z.string().min(1, { message: messages?.codeRequired ?? "Code is required" }),
    name: z.string().min(1, { message: messages?.nameRequired ?? "Name is required" }),
    price_deviation_limit: z.number(),
    qty_deviation_limit: z.number(),
    description: z.string().optional(),
    is_active: z.boolean(),
    product_subcategory_id: z.string(),
    is_used_in_recipe: z.boolean(),
    is_sold_directly: z.boolean(),
    is_edit_type: z.boolean().optional(),
});

// Base schemas for entities (backward compatibility with default messages)
export const CategorySchema = createCategorySchema();
export const SubCategorySchema = createSubCategorySchema();
export const ItemGroupSchema = createItemGroupSchema();

export type CategoryDto = z.infer<typeof CategorySchema>;
export type SubCategoryDto = z.infer<typeof SubCategorySchema>;
export type ItemGroupDto = z.infer<typeof ItemGroupSchema>;

// Form schemas for create/edit operations
export const CategoryFormSchema = CategorySchema.omit({ id: true });
export const SubCategoryFormSchema = SubCategorySchema.omit({ id: true });
export const ItemGroupFormSchema = ItemGroupSchema.omit({ id: true });

// Form DTOs
export type CategoryFormData = z.infer<typeof CategoryFormSchema>;
export type SubCategoryFormData = z.infer<typeof SubCategoryFormSchema>;
export type ItemGroupFormData = z.infer<typeof ItemGroupFormSchema>;

// Tree node type
export enum NODE_TYPE {
    CATEGORY = "category",
    SUBCATEGORY = "subcategory",
    ITEM_GROUP = "itemGroup"
}

export type CategoryNode = {
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
}; 