import { z } from 'zod';

export const ProductSubCategoryCreateSchema = z.object({
	id: z.string().uuid().optional(),
	code: z.string().min(1, 'code must be at least 1 character').optional(),
	name: z.string().min(1, 'name must be at least 1 character'),
	description: z.string().optional(),
	is_active: z.boolean().default(true).optional(),
	product_category_id: z.string().uuid(),
});

export type ProductSubCategoryCreateModel = z.infer<
	typeof ProductSubCategoryCreateSchema
>;

export class ProductSubCategoryCreateDto
	implements ProductSubCategoryCreateModel
{
	id?: string;
	code?: string;
	name!: string;
	description?: string;
	is_active?: boolean;
	product_category_id!: string;
}

export const ProductSubCategoryUpdateSchema = z.object({
	id: z.string().uuid(),
	code: z.string().min(1, 'code must be at least 1 character').optional(),
	name: z.string().min(1, 'name must be at least 1 character'),
	description: z.string().optional(),
	is_active: z.boolean().default(true).optional(),
	product_category_id: z.string().uuid(),
});

export type ProductSubCategoryUpdateModel = z.infer<
	typeof ProductSubCategoryUpdateSchema
>;

export class ProductSubCategoryUpdateDto
	implements ProductSubCategoryUpdateModel
{
	id!: string;
	code?: string;
	name!: string;
	description?: string;
	is_active?: boolean;
	product_category_id!: string;
}
