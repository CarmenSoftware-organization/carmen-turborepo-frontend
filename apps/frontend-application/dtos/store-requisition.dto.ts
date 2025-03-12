import { z } from 'zod';

export const StoreRequisitionCreateSchema = z.object({
  id: z.string().uuid().optional(),
  store_id: z.string().uuid(),
  product_id: z.string().uuid(),
  quantity: z.number().min(1),
  request_date: z.date(),
  remarks: z.string().optional(),
});

export type StoreRequisitionCreateModel = z.infer<
  typeof StoreRequisitionCreateSchema
>;

export class StoreRequisitionCreateDto implements StoreRequisitionCreateModel {
  id?: string;
  store_id!: string;
  product_id!: string;
  quantity!: number;
  request_date!: Date;
  remarks?: string;
}

export const StoreRequisitionUpdateSchema = z.object({
  id: z.string().uuid(),
  store_id: z.string().uuid().optional(),
  product_id: z.string().uuid().optional(),
  quantity: z.number().min(1).optional(),
  request_date: z.date().optional(),
  remarks: z.string().optional(),
});

export type StoreRequisitionUpdateModel = z.infer<
  typeof StoreRequisitionUpdateSchema
>;

export class StoreRequisitionUpdateDto implements StoreRequisitionUpdateModel {
  id!: string;
  store_id?: string;
  product_id?: string;
  quantity?: number;
  request_date?: Date;
  remarks?: string;
}
