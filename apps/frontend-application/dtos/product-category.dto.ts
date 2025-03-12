import { z } from 'zod';

export const ProductCategoryCreateSchema = z.object({
	id: z.string().uuid().optional(),
	code: z.string().min(1, 'code must be at least 1 character'),
	name: z.string().min(1, 'name must be at least 1 character'),
	description: z.string().optional(),
	is_active: z.boolean().default(true).optional(),
});

export type ProductCategoryCreateModel = z.infer<
	typeof ProductCategoryCreateSchema
>;

export class ProductCategoryCreateDto implements ProductCategoryCreateModel {
	id?: string;
	code!: string;
	name!: string;
	description?: string;
	is_active?: boolean;
}

export const ProductCategoryUpdateSchema = z.object({
	id: z.string().uuid(),
	code: z.string().min(1, 'code must be at least 1 character').optional(),
	name: z.string().min(1, 'name must be at least 1 character').optional(),
	description: z.string().optional(),
	is_active: z.boolean().default(true).optional(),
});

export type ProductCategoryUpdateModel = z.infer<
	typeof ProductCategoryUpdateSchema
>;

export class ProductCategoryUpdateDto implements ProductCategoryUpdateModel {
	id!: string;
	code?: string;
	name?: string;
	description?: string;
	is_active?: boolean;
}

