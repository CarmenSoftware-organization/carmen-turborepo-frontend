import { z } from 'zod';

export const VendorCreateSchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().min(1, 'name is required'),
	description: z.string().optional(),
	is_active: z.boolean().default(true).optional(),
});

export type VendorCreateModel = z.infer<typeof VendorCreateSchema>;

export class VendorCreateDto implements VendorCreateModel {
	id?: string;
	name!: string;
	description?: string;
	is_active?: boolean;
}

export const VendorUpdateSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, 'name is required').optional(),
	description: z.string().optional(),
	is_active: z.boolean().default(true).optional(),
});

export type VendorUpdateModel = z.infer<typeof VendorUpdateSchema>;

export class VendorUpdateDto implements VendorUpdateModel {
	id!: string;
	name?: string;
	description?: string;
	is_active?: boolean;
}