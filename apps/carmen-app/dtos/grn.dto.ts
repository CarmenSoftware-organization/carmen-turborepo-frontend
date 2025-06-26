import { ALLOCATE_EXTRA_COST_TYPE, DOC_TYPE, TaxType } from "@/constants/enum";
import { z } from "zod";

const goodReceivedNoteDetailItemSchema = z.object({
  sequence_no: z.number(),
  location_id: z.string().uuid(),
  product_id: z.string().uuid(),
  order_qty: z.number(),
  order_unit_id: z.string().uuid(),
  received_qty: z.number(),
  received_unit_id: z.string().uuid(),
  foc_qty: z.number(),
  foc_unit_id: z.string().uuid(),
  price: z.number(),
  tax_type_inventory_id: z.string().uuid(),
  tax_type: z.enum(["none", "included", "excluded"]),
  tax_rate: z.number(),
  tax_amount: z.number(),
  is_tax_adjustment: z.boolean(),
  total_amount: z.number(),
  delivery_point_id: z.string().uuid(),
  base_price: z.number(),
  base_qty: z.number(),
  extra_cost: z.number(),
  total_cost: z.number(),
  discount_rate: z.number(),
  discount_amount: z.number(),
  is_discount_adjustment: z.boolean(),
  expired_date: z.string().datetime(),
  note: z.string(),
  info: z.string(),
  dimension: z.string(),
});

export type GoodReceivedNoteDetailItemDto = z.infer<
  typeof goodReceivedNoteDetailItemSchema
>;

export const extraCostDetailItemSchema = z.object({
  id: z.string().uuid().optional(),
  extra_cost_type_id: z.string().uuid().optional(),
  amount: z.number().optional(),
  tax_type_inventory_id: z.string().uuid().optional(),
  tax_type: z.nativeEnum(TaxType).optional(),
  tax_rate: z.number().optional(),
  tax_amount: z.number().optional(),
  is_tax_adjustment: z.boolean().optional(),
  note: z.string().optional(),
});

export type ExtraCostDetailFormValues = z.infer<
  typeof extraCostDetailItemSchema
>;

export const extraCostSchema = z.object({
  name: z.string().optional(),
  allocate_extra_cost_type: z.nativeEnum(ALLOCATE_EXTRA_COST_TYPE).optional(),
  note: z.string().optional(),
  extra_cost_detail: z.object({
    add: z.array(extraCostDetailItemSchema),
    update: z.array(extraCostDetailItemSchema),
    delete: z.array(z.string().uuid()),
  }),
});

export type ExtraCostDetailItemDto = z.infer<
  typeof extraCostSchema
>;

export const baseGrnSchema = z.object({
  name: z.string().optional(),
  grn_no: z.string().optional(),
  invoice_no: z.string().optional(),
  invoice_date: z.string().optional(),
  description: z.string().optional(),
  doc_status: z.string().optional(),
  doc_type: z.nativeEnum(DOC_TYPE).optional(),
  vendor_id: z.string().uuid().optional(),
  currency_id: z.string().uuid().optional(),
  currency_rate: z.number().optional(),
  workflow_id: z.string().uuid().optional(),
  workflow_object: z.string().optional(),
  workflow_history: z.string().optional(),
  current_workflow_status: z.string().optional(),
  signature_image_url: z.string().optional(),
  received_by_id: z.string().uuid().optional(),
  received_at: z.string().optional(),
  credit_term_id: z.string().uuid().optional(),
  payment_due_date: z.string().optional(),
  note: z.string().optional(),
  info: z.string().optional(),
  dimension: z.string().optional(),
  extra_cost: extraCostSchema.optional(),
});

// create grn
export const grnPostSchema = baseGrnSchema.extend({
  good_received_note_detail: z
    .object({
      initData: z.array(goodReceivedNoteDetailItemSchema).optional(),
      add: z.array(goodReceivedNoteDetailItemSchema).optional(),
      update: z.array(goodReceivedNoteDetailItemSchema).optional(),
      delete: z.array(z.string().uuid()).optional(),
    })
    .optional(),
});
export type CreateGRNDto = z.infer<typeof grnPostSchema>;

// get grn by id
export const grnByIdSchema = baseGrnSchema.extend({
  id: z.string().uuid(),
  created_at: z.string(),
  good_received_note_detail: z.array(goodReceivedNoteDetailItemSchema),
});

export type GetGrnByIdDto = z.infer<typeof grnByIdSchema>;

export interface GoodsReceivedNoteListDto {
  id: string;
  name: string;
  grn_no: string;
  description?: string;
  vendor_name: string;
  total_amount: number;
  is_active: boolean;
  created_at: string;
}
