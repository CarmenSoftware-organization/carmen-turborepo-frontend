import { z } from "zod";

// ===== PO List Schemas =====
export const BasePoDtoSchema = z.object({
  po_no: z.string(),
  vendor_name: z.string(),
  description: z.string(),
  order_date: z.string(),
  delivery_date: z.string(),
  total_amount: z.number(),
});

export const PoListDtoSchema = BasePoDtoSchema.extend({
  id: z.string(),
});

// ===== PO Detail Schemas =====

// PR Detail reference within PO Detail
export const PoPrDetailDtoSchema = z.object({
  pr_detail_id: z.string(),
  order_qty: z.number(),
  order_unit_id: z.string(),
  order_unit_name: z.string(),
  order_base_qty: z.number(),
  order_base_unit_id: z.string(),
  order_base_unit_name: z.string(),
});

// PO Detail item
export const PoDetailItemDtoSchema = z.object({
  id: z.string().optional(),
  sequence: z.number(),
  product_id: z.string(),
  product_name: z.string(),
  product_local_name: z.string().nullable(),
  order_unit_id: z.string(),
  order_unit_name: z.string(),
  order_unit_conversion_factor: z.number(),
  order_qty: z.number(),
  base_unit_id: z.string(),
  base_unit_name: z.string(),
  base_qty: z.number(),
  price: z.number(),
  sub_total_price: z.number(),
  net_amount: z.number(),
  total_price: z.number(),
  tax_profile_id: z.string().nullable(),
  tax_profile_name: z.string().nullable(),
  tax_rate: z.number(),
  tax_amount: z.number(),
  is_tax_adjustment: z.boolean(),
  discount_rate: z.number(),
  discount_amount: z.number(),
  is_discount_adjustment: z.boolean(),
  is_foc: z.boolean(),
  pr_detail: z.array(PoPrDetailDtoSchema),
  description: z.string(),
  note: z.string(),
});

// Full PO Detail (for view/edit page)
export const PoDetailDtoSchema = z.object({
  id: z.string(),
  po_no: z.string(),
  vendor_id: z.string(),
  vendor_name: z.string(),
  delivery_date: z.string(),
  currency_id: z.string(),
  currency_name: z.string(),
  exchange_rate: z.number(),
  description: z.string(),
  order_date: z.string(),
  credit_term_id: z.string(),
  credit_term_name: z.string(),
  credit_term_value: z.number(),
  buyer_id: z.string(),
  buyer_name: z.string(),
  email: z.string(),
  remarks: z.string(),
  note: z.string(),
  details: z.array(PoDetailItemDtoSchema),
});

// ===== Types (inferred from schemas) =====
export type BasePoDto = z.infer<typeof BasePoDtoSchema>;
export type PoListDto = z.infer<typeof PoListDtoSchema>;
export type PoPrDetailDto = z.infer<typeof PoPrDetailDtoSchema>;
export type PoDetailItemDto = z.infer<typeof PoDetailItemDtoSchema>;
export type PoDetailDto = z.infer<typeof PoDetailDtoSchema>;
