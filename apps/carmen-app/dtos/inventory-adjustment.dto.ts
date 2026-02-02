import { z } from "zod";
import { STOCK_IN_OUT_TYPE_PAYLOAD } from "./stock-in-out.dto";

export enum DOC_STATUS {
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

// Zod Schemas
const baseStockDetailsSchema = z.object({
  product_id: z.string(),
  product_name: z.string(),
  product_local_name: z.string(),
  location_id: z.string(),
  location_code: z.string(),
  location_name: z.string(),
  qty: z.number(),
  cost_per_unit: z.number(),
  total_cost: z.number(),
  description: z.string().optional(),
  note: z.string().optional(),
});

export const stockDetailsSchema = baseStockDetailsSchema.extend({
  id: z.string().optional(),
});

const baseInventoryAdjustmentSchema = z.object({
  description: z.string().optional(),
  doc_status: z.nativeEnum(DOC_STATUS),
  note: z.string().optional(),
  type: z.nativeEnum(STOCK_IN_OUT_TYPE_PAYLOAD),
  document_no: z.string(),
  details: z.array(stockDetailsSchema),
});

// Schema สำหรับ get all list (ไม่มี stock_in_detail)
export const inventoryAdjustmentListSchema = z.object({
  id: z.string(),
  so_no: z.string().optional(), // มีเฉพาะ stock-out
  si_no: z.string().optional(), // มีเฉพาะ stock-in
  description: z.string().optional(),
  doc_status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  type: z.nativeEnum(STOCK_IN_OUT_TYPE_PAYLOAD),
  document_no: z.string(),
});

export const inventoryAdjustmentStockInSchema = baseInventoryAdjustmentSchema.extend({
  id: z.string(),
  si_no: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const inventoryAdjustmentStockOutSchema = baseInventoryAdjustmentSchema.extend({
  id: z.string(),
  so_no: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const inventoryAdjustmentPayloadSchema = z.object({
  description: z.string().optional(),
  doc_status: z.string(),
  note: z.string().optional(),
  inventory_adjustment_type: z.nativeEnum(STOCK_IN_OUT_TYPE_PAYLOAD),
  details: z.object({
    add: z.array(baseStockDetailsSchema),
    update: z.array(stockDetailsSchema),
    remove: z.array(z.object({ id: z.string() })),
  }),
});

export const inventoryAdjustmentFormSchema = z.object({
  description: z.string().optional(),
  doc_status: z.string(),
  note: z.string().optional(),
  details: z.array(stockDetailsSchema),
});

// Inferred Types
export type BaseStockDetailsDto = z.infer<typeof baseStockDetailsSchema>;
export type StockDetailsDto = z.infer<typeof stockDetailsSchema>;
export type InventoryAdjustmentListDto = z.infer<typeof inventoryAdjustmentListSchema>;
export type InventoryAdjustmentStockInDto = z.infer<typeof inventoryAdjustmentStockInSchema>;
export type InventoryAdjustmentStockOutDto = z.infer<typeof inventoryAdjustmentStockOutSchema>;
export type InventoryAdjustmentPayloadDto = z.infer<typeof inventoryAdjustmentPayloadSchema>;
export type InventoryAdjustmentFormValues = z.infer<typeof inventoryAdjustmentFormSchema>;
