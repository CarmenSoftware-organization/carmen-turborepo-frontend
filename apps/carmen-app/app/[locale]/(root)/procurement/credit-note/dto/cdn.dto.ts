import { CREDIT_NOTE_TYPE } from "@/constants/enum";
import { z } from "zod";

export interface CreditNoteDetailItemDto {
  id: string;
  credit_note_id: string;
  inventory_transaction_id?: string;
  sequence_no: number;
  description?: string;
  note?: string;
  location_id: string;
  location_name?: string;
  product_id: string;
  product_name: string;
  product_local_name?: string;
  return_qty: number;
  return_unit_id: string;
  return_unit_name?: string;
  return_conversion_factor: number;
  return_base_qty: number;
  price: number;
  tax_type_inventory_id: string;
  tax_type: string;
  tax_rate: string;
  tax_amount: number;
  is_tax_adjustment: boolean;
  discount_rate: string;
  discount_amount?: number;
  is_discount_adjustment: boolean;
  extra_cost_amount: number;
  base_price: string;
  base_tax_amount: number;
  base_discount_amount: number;
  base_extra_cost_amount: number;
  total_price: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dimension?: any;
  doc_version: string;
  created_at: string;
  created_by_id: string;
  updated_at: string;
  updated_by_id?: string;
  deleted_at?: string;
  deleted_by_id?: string;
}

export interface CreditNoteByIdDto {
  id: string;
  cn_no: string;
  cn_date: string;
  doc_status: string;
  credit_note_type: string;
  vendor_id: string;
  vendor_name?: string;
  currency_id?: string;
  currency_name?: string;
  exchange_rate?: number;
  exchange_rate_date: string;
  grn_id?: string;
  grn_no?: string;
  grn_date?: string;
  cn_reason_id?: string;
  cn_reason_name?: string;
  cn_reason_description?: string;
  invoice_no?: string;
  invoice_date?: string;
  tax_invoice_no?: string;
  tax_invoice_date?: string;
  note: string;
  description?: string;
  workflow_id?: string;
  workflow_name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  workflow_obj?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  workflow_history?: any;
  workflow_current_stage?: string;
  workflow_previous_stage?: string;
  workflow_next_stage?: string;
  user_action?: string;
  last_action_name?: string;
  last_action_date?: string;
  last_action_by_id?: string;
  last_action_by_name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dimension?: any;
  doc_version: string;
  created_at: string;
  created_by_id: string;
  updated_at: string;
  updated_by_id?: string;
  deleted_at?: string;
  deleted_by_id?: string;
  credit_note_detail: CreditNoteDetailItemDto[];
}

export const creditNoteDetailItemSchemaDto = z.object({
  id: z.string().optional(),
  description: z.string().optional(),
  note: z.string().optional(),
  location_id: z.string().uuid(),
  product_id: z.string().uuid(),
  return_qty: z.number(),
  return_unit_id: z.string().uuid(),
  return_conversion_factor: z.number(),
  return_base_qty: z.number(),
  price: z.number(),
  tax_type_inventory_id: z.string().uuid(),
  tax_rate: z.number(),
  tax_amount: z.number(),
  is_tax_adjustment: z.boolean(),
  discount_rate: z.number(),
  discount_amount: z.number(),
  is_discount_adjustment: z.boolean(),
  extra_cost_amount: z.number(),
  base_price: z.number(),
  base_tax_amount: z.number(),
  base_discount_amount: z.number(),
  base_extra_cost_amount: z.number(),
  total_price: z.number(),
});

export type CreditNoteDetailFormItemDto = z.infer<
  typeof creditNoteDetailItemSchemaDto
>;

// Schema สำหรับ form ที่รวม data สำหรับ init values
export const creditNoteDetailSchemaWithData = z.object({
  data: z.array(creditNoteDetailItemSchemaDto).optional(),
  add: z.array(creditNoteDetailItemSchemaDto).optional(),
  update: z.array(creditNoteDetailItemSchemaDto).optional(),
  remove: z.array(z.object({ id: z.string().uuid() })).optional(),
});

export const baseCreditNoteSchema = z.object({
  cn_date: z.string().datetime(),
  credit_note_type: z.nativeEnum(CREDIT_NOTE_TYPE),
  vendor_id: z.string().uuid(),
  currency_id: z.string().uuid(),
  exchange_rate: z.number(),
  exchange_rate_date: z.string().datetime(),
  grn_id: z.string().uuid(),
  cn_reason_id: z.string().optional(),
  invoice_no: z.string(),
  invoice_date: z.string().datetime(),
  tax_invoice_no: z.string(),
  tax_invoice_date: z.string().datetime(),
  note: z.string(),
  description: z.string().nullable(),
  credit_note_detail: creditNoteDetailSchemaWithData,
});

// ✅ Schema credit_note_detail สำหรับ submit (ไม่มี `data`) — reuse ด้วย .omit()
export const creditNoteDetailSchemaWithoutData = creditNoteDetailSchemaWithData.omit({
  data: true,
});

// ✅ Schema สำหรับใช้ในฟอร์ม
export const creditNoteFormSchemaDto = baseCreditNoteSchema.extend({
  credit_note_detail: creditNoteDetailSchemaWithData,
});

// ✅ Schema สำหรับส่งข้อมูล (submit)
export const creditNoteSubmitSchemaDto = baseCreditNoteSchema.extend({
  credit_note_detail: creditNoteDetailSchemaWithoutData,
});

// ✅ Types
export type CreditNoteFormDto = z.infer<typeof creditNoteFormSchemaDto>;
export type CreditNoteSubmitDto = z.infer<typeof creditNoteSubmitSchemaDto>;
