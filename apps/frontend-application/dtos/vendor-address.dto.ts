import { z } from 'zod';

export const VendorAddressCreateSchema = z.object({
  id: z.string().uuid().optional(),
  vendor_id: z.string().uuid(),
  address_type_id: z.string().uuid(),
  address: z.string().optional(),
  is_active: z.boolean().default(true).nullable().optional(),
});

export type VendorAddressCreateModel = z.infer<
  typeof VendorAddressCreateSchema
>;

export class VendorAddressCreateDto implements VendorAddressCreateModel {
  id?: string;
  vendor_id!: string;
  address_type_id!: string;
  address?: string;
  is_active?: boolean | null;
}

export const VendorAddressUpdateSchema = z.object({
  id: z.string().uuid(),
  vendor_id: z.string().uuid().optional(),
  address_type_id: z.string().uuid().optional(),
  address: z.string().optional(),
  is_active: z.boolean().default(true).nullable().optional(),
});

export type VendorAddressUpdateModel = z.infer<
  typeof VendorAddressUpdateSchema
>;

export class VendorAddressUpdateDto implements VendorAddressUpdateModel {
  id!: string;
  vendor_id?: string;
  address_type_id?: string;
  address?: string;
  is_active?: boolean | null;
}
