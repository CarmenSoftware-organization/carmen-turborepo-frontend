import { ALLOCATE_EXTRA_COST_TYPE, DOC_TYPE, TaxType } from "@/constants/enum";
import { z } from "zod";

const goodReceivedNoteDetailItemSchema = z.object({
  id: z.string().uuid().optional(),
  purchase_order_detail_id: z.string().uuid().optional(),
  sequence_no: z.number().optional(),
  location_id: z.string().uuid(),
  product_id: z.string().uuid(),
  order_qty: z.number().optional(),
  order_unit_id: z.string().uuid().optional(),
  received_qty: z.number().optional(),
  received_unit_id: z.string().uuid().optional(),
  is_foc: z.boolean().optional(),
  foc_qty: z.number().optional(),
  foc_unit_id: z.string().uuid().optional(),
  price: z.number().optional(),
  tax_type_inventory_id: z.string().uuid().optional(),
  tax_type: z.string().optional(),
  tax_rate: z.number().optional(),
  tax_amount: z.number().optional(),
  is_tax_adjustment: z.boolean().optional(),
  total_amount: z.number().optional(),
  delivery_point_id: z.string().uuid().optional(),
  base_price: z.number().optional(),
  base_qty: z.number().optional(),
  extra_cost: z.number().optional(),
  total_cost: z.number().optional(),
  is_discount: z.boolean().optional(),
  discount_rate: z.number().optional(),
  discount_amount: z.number().optional(),
  is_discount_adjustment: z.boolean().optional(),
  expired_date: z.string().optional(),
  note: z.string().optional(),
  exchange_rate: z.number().optional(),
  info: z.string().optional(),
  dimension: z.string().optional(),
});

export type GoodReceivedNoteDetailItemDto = z.infer<
  typeof goodReceivedNoteDetailItemSchema
>;

const extraCostDetailItemSchema = z.object({
  id: z.string().uuid().optional(),
  extra_cost_type_id: z.string().uuid().optional(),
  amount: z.number().optional(),
  is_tax: z.boolean().optional(),
  tax_type_inventory_id: z.string().uuid().optional(),
  tax_type: z.nativeEnum(TaxType).optional(),
  tax_rate: z.number().optional(),
  tax_amount: z.number().optional(),
  is_tax_adjustment: z.boolean().optional(),
  note: z.string().optional(),
  info: z.string().optional(),
  dimension: z.string().optional(),
});

const extraCostSchema = z.object({
  name: z.string().optional(),
  allocate_extra_cost_type: z.nativeEnum(ALLOCATE_EXTRA_COST_TYPE).optional(),
  note: z.string().optional(),
  info: z.string().optional(),
  extra_cost_detail: z.object({
    add: z.array(extraCostDetailItemSchema),
    update: z.array(extraCostDetailItemSchema),
    delete: z.array(z.string().uuid()),
  }),
});

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
  is_consignment: z.boolean().optional(),
  is_cash: z.boolean().optional(),
  signature_image_url: z.string().optional(),
  received_by_id: z.string().uuid().optional(),
  received_at: z.string().optional(),
  credit_term_id: z.string().uuid().optional(),
  payment_due_date: z.string().optional(),
  is_active: z.boolean().optional(),
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
