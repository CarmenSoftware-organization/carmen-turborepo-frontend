import { z } from 'zod';

export const InventoryTransactionCreateSchema = z.object({
  id: z.string().uuid().optional(),
  product_id: z.string().uuid(),
  quantity: z.number().min(1),
  transaction_type: z.enum(['IN', 'OUT']),
  transaction_date: z.date(),
  remarks: z.string().optional(),
});

export type InventoryTransactionCreateModel = z.infer<
  typeof InventoryTransactionCreateSchema
>;

export class InventoryTransactionCreateDto
  implements InventoryTransactionCreateModel
{
  id?: string;
  product_id!: string;
  quantity!: number;
  transaction_type!: 'IN' | 'OUT';
  transaction_date!: Date;
  remarks?: string;
}

export const InventoryTransactionUpdateSchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid().optional(),
  quantity: z.number().min(1).optional(),
  transaction_type: z.enum(['IN', 'OUT']).optional(),
  transaction_date: z.date().optional(),
  remarks: z.string().optional(),
});

export type InventoryTransactionUpdateModel = z.infer<
  typeof InventoryTransactionUpdateSchema
>;

export class InventoryTransactionUpdateDto
  implements InventoryTransactionUpdateModel
{
  id!: string;
  product_id?: string;
  quantity?: number;
  transaction_type?: 'IN' | 'OUT';
  transaction_date?: Date;
  remarks?: string;
}
