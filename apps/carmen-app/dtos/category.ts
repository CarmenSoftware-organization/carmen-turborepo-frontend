import { z } from "zod";

// Base schemas for entities
export const CategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
});

export const SubCategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    category_id: z.string(),
});

export const ItemGroupSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    sub_category_id: z.string(),
});

// Form schemas for create/edit operations
export const CategoryFormSchema = CategorySchema.omit({ id: true });
export const SubCategoryFormSchema = SubCategorySchema.omit({ id: true });
export const ItemGroupFormSchema = ItemGroupSchema.omit({ id: true });

// DTOs
export type CategoryDto = z.infer<typeof CategorySchema>;
export type SubCategoryDto = z.infer<typeof SubCategorySchema>;
export type ItemGroupDto = z.infer<typeof ItemGroupSchema>;

// Form DTOs
export type CategoryFormData = z.infer<typeof CategoryFormSchema>;
export type SubCategoryFormData = z.infer<typeof SubCategoryFormSchema>;
export type ItemGroupFormData = z.infer<typeof ItemGroupFormSchema>;

// Tree node type
export type CategoryNode = {
    id: string;
    name: string;
    description?: string;
    type: "category" | "subcategory" | "itemGroup";
    children?: CategoryNode[];
    itemCount?: number;
}; 