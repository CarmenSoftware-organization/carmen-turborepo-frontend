import { z } from 'zod';

export const AddressTypeCreateSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().uuid(),
  description: z.string().optional(),
  is_active: z.boolean().default(true).nullable().optional(),
});

export type AddressTypeCreateModel = z.infer<typeof AddressTypeCreateSchema>;

export class AddressTypeCreateDto implements AddressTypeCreateModel {
  id?: string;
  name!: string;
  description?: string;
  is_active?: boolean | null;
}

export const AddressTypeUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().uuid().optional(),
  description: z.string().optional(),
  is_active: z.boolean().default(true).nullable().optional(),
});

export type AddressTypeUpdateModel = z.infer<typeof AddressTypeUpdateSchema>;

export class AddressTypeUpdateDto implements AddressTypeUpdateModel {
  id!: string;
  name?: string;
  description?: string;
  is_active?: boolean | null;
}

