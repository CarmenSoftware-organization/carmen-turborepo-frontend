import { z } from 'zod';

export const ProductVendorCreateSchema = z.object({
  id: z.string().uuid().optional(),
  product_id: z.string().uuid(),
  vendor_id: z.string().uuid().nullable().optional(),
  description: z.string().nullable().optional(),
  is_active: z.boolean().default(true).nullable().optional(),
});

export type ProductVendorCreateModel = z.infer<
  typeof ProductVendorCreateSchema
>;

export class ProductVendorCreateDto implements ProductVendorCreateModel {
  id?: string;
  product_id!: string;
  vendor_id?: string | null;
  description?: string | null;
  is_active?: boolean | null;
}
export const ProductVendorUpdateSchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid().optional(),
  vendor_id: z.string().uuid().nullable().optional(),
  description: z.string().nullable().optional(),
  is_active: z.boolean().default(true).nullable().optional(),
});

export type ProductVendorUpdateModel = z.infer<
  typeof ProductVendorUpdateSchema
>;

export class ProductVendorUpdateDto implements ProductVendorUpdateModel {
  id!: string;
  product_id?: string;
  vendor_id?: string | null;
  description?: string | null;
  is_active?: boolean | null;
}
