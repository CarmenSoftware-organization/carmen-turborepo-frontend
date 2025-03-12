import { z } from 'zod';

export const PurchaseOrderCreateSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'name is required'),
  description: z.string().optional(),
  is_active: z.boolean().default(true).nullable().optional(),
});

export type PurchaseOrderCreateModel = z.infer<
  typeof PurchaseOrderCreateSchema
>;

export class PurchaseOrderCreateDto implements PurchaseOrderCreateModel {
  id?: string;
  name!: string;
  description?: string;
  is_active?: boolean | null;
}

export const PurchaseOrderUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'name is required').optional(),
  description: z.string().optional(),
  is_active: z.boolean().default(true).nullable().optional(),
});

export type PurchaseOrderUpdateModel = z.infer<
  typeof PurchaseOrderUpdateSchema
>;

export class PurchaseOrderUpdateDto implements PurchaseOrderUpdateModel {
  id!: string;
  name?: string;
  description?: string;
  is_active?: boolean | null;
}

export const PurchaseOrderDetailCreateSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'name is required').optional(),
  description: z.string().optional(),
  is_active: z.boolean().default(true).nullable().optional(),
  purchase_order_id: z.string().uuid(),
});

export type PurchaseOrderDetailCreateModel = z.infer<
  typeof PurchaseOrderDetailCreateSchema
>;

export class PurchaseOrderDetailCreateDto
  implements PurchaseOrderDetailCreateModel
{
  id?: string;
  name?: string;
  description?: string;
  is_active?: boolean | null;
  purchase_order_id!: string;
}

export const PurchaseOrderDetailUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'name is required').optional(),
  description: z.string().optional(),
  is_active: z.boolean().default(true).nullable().optional(),
  purchase_order_id: z.string().uuid().optional(),
});

export type PurchaseOrderDetailUpdateModel = z.infer<
  typeof PurchaseOrderDetailUpdateSchema
>;

export class PurchaseOrderDetailUpdateDto
  implements PurchaseOrderDetailUpdateModel
{
  id!: string;
  name?: string;
  description?: string;
  is_active?: boolean | null;
  purchase_order_id?: string;
}
