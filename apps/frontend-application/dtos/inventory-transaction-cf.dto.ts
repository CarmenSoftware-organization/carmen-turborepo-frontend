import { z } from 'zod';

export const InventoryTransactionCFCreateSchema = z.object({
  id: z.string().uuid().optional(),
  inventory_transaction_detail_id: z.string().uuid(),
  lot_name: z.string(),
  lot_index: z.number().int().min(1).default(1),
  qty: z.number(),
  cost: z.number().optional(),
});

export type InventoryTransactionCFCreateModel = z.infer<
  typeof InventoryTransactionCFCreateSchema
>;

export class InventoryTransactionCFCreateDto
  implements InventoryTransactionCFCreateModel
{
  id?: string;
  inventory_transaction_detail_id!: string;
  lot_name!: string;
  lot_index!: number;
  qty!: number;
  cost?: number;
}
export const InventoryTransactionCFUpdateSchema = z.object({
  id: z.string().uuid(),
  inventory_transaction_detail_id: z.string().uuid().optional(),
  lot_name: z.string().optional(),
  lot_index: z.number().int().min(1).optional(),
  qty: z.number().optional(),
  cost: z.number().optional(),
});

export type InventoryTransactionCFUpdateModel = z.infer<
  typeof InventoryTransactionCFUpdateSchema
>;

export class InventoryTransactionCFUpdateDto
  implements InventoryTransactionCFUpdateModel
{
  id!: string;
  inventory_transaction_detail_id?: string;
  lot_name?: string;
  lot_index?: number;
  qty?: number;
  cost?: number;
}
