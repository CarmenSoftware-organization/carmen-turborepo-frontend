import { z } from 'zod';

export const DeliveryPointCreateSchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().min(1, 'name must be at least 1 character'),
	is_active: z.boolean().default(true).optional(),
});

export type DeliveryPointCreateModel = z.infer<
	typeof DeliveryPointCreateSchema
>;

export class DeliveryPointCreateDto implements DeliveryPointCreateModel {
	id?: string;
	name!: string;
	is_active?: boolean;
}

export const DeliveryPointUpdateSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, 'name must be at least 1 character').optional(),
	is_active: z.boolean().default(true).optional(),
});

export type DeliveryPointUpdateModel = z.infer<
	typeof DeliveryPointUpdateSchema
>;

export class DeliveryPointUpdateDto implements DeliveryPointUpdateModel {
	id!: string;
	name?: string;
	is_active?: boolean;
}

