import { z } from 'zod';

export const PurchaseRequestTypeCreateSchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().min(1, 'name is required'),
	description: z.string().nullable().optional(),
	is_active: z.boolean().default(true).optional(),
});

export type PurchaseRequestTypeCreateModel = z.infer<
	typeof PurchaseRequestTypeCreateSchema
>;

export class PurchaseRequestTypeCreateDto
	implements PurchaseRequestTypeCreateModel
{
	id?: string;
	name!: string;
	description?: string | null;
	is_active?: boolean;
}

export const PurchaseRequestTypeUpdateSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, 'name is required'),
	description: z.string().nullable().optional(),
	is_active: z.boolean().default(true).optional(),
});

export type PurchaseRequestTypeUpdateModel = z.infer<
	typeof PurchaseRequestTypeUpdateSchema
>;

export class PurchaseRequestTypeUpdateDto
	implements PurchaseRequestTypeUpdateModel
{
	id!: string;
	name!: string;
	description?: string | null;
	is_active?: boolean;
}
