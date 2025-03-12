import { z } from 'zod';

export const StoreRequisitionDetailCreateSchema = z.object({
  id: z.string().uuid().optional(),
  store_requisition_id: z.string().uuid(),
  product_id: z.string().uuid(),
  quantity: z.number().min(1),
  unit_price: z.number().min(0),
  total_price: z.number().min(0),
});

export type StoreRequisitionDetailCreateModel = z.infer<
  typeof StoreRequisitionDetailCreateSchema
>;

export class StoreRequisitionDetailCreateDto
  implements StoreRequisitionDetailCreateModel
{
  id?: string;
  store_requisition_id!: string;
  product_id!: string;
  quantity!: number;
  unit_price!: number;
  total_price!: number;
}

export const StoreRequisitionDetailUpdateSchema = z.object({
  id: z.string().uuid(),
  store_requisition_id: z.string().uuid().optional(),
  product_id: z.string().uuid().optional(),
  quantity: z.number().min(1).optional(),
  unit_price: z.number().min(0).optional(),
  total_price: z.number().min(0).optional(),
});

export type StoreRequisitionDetailUpdateModel = z.infer<
  typeof StoreRequisitionDetailUpdateSchema
>;

export class StoreRequisitionDetailUpdateDto
  implements StoreRequisitionDetailUpdateModel
{
  id!: string;
  store_requisition_id?: string;
  product_id?: string;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
}
