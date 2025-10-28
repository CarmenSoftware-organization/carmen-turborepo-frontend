import { z } from "zod";
import { CREDIT_NOTE_TYPE } from "@/constants/enum";

/**
 * Credit Note Schemas - Zod validation schemas
 * Pure TypeScript interfaces moved to: dtos/credit-note.dto.ts
 */

// ================================
// Schemas for GetAll/List Response
// ================================

const CreditNoteDetailSchema = z.object({
  id: z.string().uuid(),
  credit_note_id: z.string().uuid(),
  inventory_transaction_id: z.string().uuid().nullable(),
  sequence_no: z.number(),
  description: z.string().nullable(),
  note: z.string().nullable(),
  product_id: z.string().uuid(),
  product_name: z.string().nullable(),
  product_local_name: z.string().nullable(),
  qty: z.string(),
  amount: z.string(),
  info: z.unknown().nullable(),
  dimension: z.unknown().nullable(),
  doc_version: z.string(),
  created_at: z.string(),
  created_by_id: z.string().uuid(),
  updated_at: z.string(),
  updated_by_id: z.string().uuid().nullable(),
});

export const CreditNoteSchema = z.object({
  id: z.string().uuid().optional(),
  cn_no: z.string(),
  cn_date: z.string(),
  doc_status: z.string(),
  note: z.string().optional(),
  workflow_id: z.string().uuid().optional(),
  workflow_name: z.string().optional(),
  workflow_obj: z.unknown().optional(),
  workflow_history: z.unknown().optional(),
  current_workflow_status: z.string().optional(),
  workflow_previous_step: z.string().optional(),
  workflow_next_step: z.string().optional(),
  current_user_action: z.string().optional(),
  last_action_name: z.string().optional(),
  last_action_date: z.string().optional(),
  last_action_by_id: z.string().uuid().optional(),
  last_action_by_name: z.string().optional(),
  info: z.unknown().optional(),
  dimension: z.unknown().optional(),
  doc_version: z.string(),
  created_at: z.string(),
  created_by_id: z.string().uuid(),
  updated_at: z.string(),
  updated_by_id: z.string().uuid().optional(),
  tb_credit_note_detail: z.array(CreditNoteDetailSchema),
});

// ================================
// Schemas for Form
// ================================

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
  grn_date: z.string().datetime(),
  cn_reason_id: z.string().optional(),
  invoice_no: z.string(),
  invoice_date: z.string().datetime(),
  tax_invoice_no: z.string(),
  tax_invoice_date: z.string().datetime(),
  note: z.string(),
  description: z.string().nullish(),
  credit_note_detail: creditNoteDetailSchemaWithData,
});

// Schema credit_note_detail สำหรับ submit (ไม่มี `data`)
export const creditNoteDetailSchemaWithoutData =
  creditNoteDetailSchemaWithData.omit({
    data: true,
  });

// Schema สำหรับใช้ในฟอร์ม
export const creditNoteFormSchemaDto = baseCreditNoteSchema.extend({
  credit_note_detail: creditNoteDetailSchemaWithData,
});

// Schema สำหรับส่งข้อมูล (submit)
export const creditNoteSubmitSchemaDto = baseCreditNoteSchema.extend({
  credit_note_detail: creditNoteDetailSchemaWithoutData,
});

// ================================
// Inferred Types
// ================================

export type CreditNoteDetailFormItemDto = z.infer<
  typeof creditNoteDetailItemSchemaDto
>;
export type CreditNoteFormDto = z.infer<typeof creditNoteFormSchemaDto>;
export type CreditNoteSubmitDto = z.infer<typeof creditNoteSubmitSchemaDto>;
export type CreditNoteGetAllDto = z.infer<typeof CreditNoteSchema>;
