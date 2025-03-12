import { z } from 'zod';

export const ProductItemGroupCreateSchema = z.object({
	id: z.string().uuid().optional(),
	code: z.string().min(1, 'code must be at least 1 character').optional(),
	name: z.string().min(1, 'name is required'),
	description: z.string().optional(),
	is_active: z.boolean().default(true).optional(),
	product_subcategory_id: z.string().uuid(),
});

export type ProductItemGroupCreateModel = z.infer<
	typeof ProductItemGroupCreateSchema
>;

export class ProductItemGroupCreateDto implements ProductItemGroupCreateModel {
	id?: string;
	code?: string;
	name!: string;
	description?: string;
	is_active?: boolean;
	product_subcategory_id!: string;
}

export const ProductItemGroupUpdateSchema = z.object({
	id: z.string().uuid(),
	code: z.string().min(1, 'code must be at least 1 character').optional(),
	name: z.string().min(1, 'name is required'),
	description: z.string().optional(),
	is_active: z.boolean().default(true).optional(),
	product_subcategory_id: z.string().uuid(),
});

export type ProductItemGroupUpdateModel = z.infer<
	typeof ProductItemGroupUpdateSchema
>;

export class ProductItemGroupUpdateDto implements ProductItemGroupUpdateModel {
	id!: string;
	code?: string;
	name!: string;
	description?: string;
	is_active?: boolean;
	product_subcategory_id!: string;
}
