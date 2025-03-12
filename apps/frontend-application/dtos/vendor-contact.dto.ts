import { z } from 'zod';

export const VendorContactCreateSchema = z.object({
  id: z.string().uuid().optional(),
  vendor_id: z.string().uuid(),
  contact_type_id: z.string().uuid(),
  description: z.string().optional(),
  is_active: z.boolean().default(true).nullable().optional(),
});

export type VendorContactCreateModel = z.infer<
  typeof VendorContactCreateSchema
>;

export class VendorContactCreateDto implements VendorContactCreateModel {
  id?: string;
  vendor_id!: string;
  contact_type_id!: string;
  description?: string;
  is_active?: boolean | null;
}

export const VendorContactUpdateSchema = z.object({
  id: z.string().uuid(),
  vendor_id: z.string().uuid().optional(),
  contact_type_id: z.string().uuid().optional(),
  description: z.string().optional(),
  is_active: z.boolean().default(true).nullable().optional(),
});

export type VendorContactUpdateModel = z.infer<
  typeof VendorContactUpdateSchema
>;

export class VendorContactUpdateDto implements VendorContactUpdateModel {
  id!: string;
  vendor_id?: string;
  contact_type_id?: string;
  description?: string;
  is_active?: boolean | null;
}
