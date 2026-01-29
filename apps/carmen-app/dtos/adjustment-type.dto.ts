import { z } from "zod";

// Enum
export enum ADJUSTMENT_TYPE {
  STOCK_IN = "stock_in",
  STOCK_OUT = "stock_out",
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

const baseAdjustmentSchema = z.object({
  description: z.string().optional(),
  doc_status: z.string(),
  note: z.string().optional(),
  stock_in_detail: z.array(stockDetailsSchema),
});

export const adjustmentTypeListSchema = baseAdjustmentSchema.extend({
  id: z.string(),
  adjustment_type: z.nativeEnum(ADJUSTMENT_TYPE),
});

export const adjustmentStockInSchema = baseAdjustmentSchema.extend({
  id: z.string(),
  adjustment_type: z.literal(ADJUSTMENT_TYPE.STOCK_IN),
});

export const adjustmentStockOutSchema = baseAdjustmentSchema.extend({
  id: z.string(),
  adjustment_type: z.literal(ADJUSTMENT_TYPE.STOCK_OUT),
});

export const adjustmentTypePayloadSchema = z.object({
  description: z.string().optional(),
  doc_status: z.string(),
  note: z.string().optional(),
  adjustment_type: z.nativeEnum(ADJUSTMENT_TYPE),
  stock_in_detail: z.object({
    add: z.array(baseStockDetailsSchema),
    update: z.array(stockDetailsSchema),
    remove: z.array(z.object({ id: z.string() })),
  }),
});

// Inferred Types
export type BaseStockDetailsDto = z.infer<typeof baseStockDetailsSchema>;
export type StockDetailsDto = z.infer<typeof stockDetailsSchema>;
export type AdjustmentTypeList = z.infer<typeof adjustmentTypeListSchema>;
export type AdjustmentStockInDto = z.infer<typeof adjustmentStockInSchema>;
export type AdjustmentStockOutDto = z.infer<typeof adjustmentStockOutSchema>;
export type AdjustmentTypePayloadDto = z.infer<typeof adjustmentTypePayloadSchema>;
