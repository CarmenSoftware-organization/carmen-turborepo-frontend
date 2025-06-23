import { z } from "zod";

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

export type CreditNoteGetAllDto = z.infer<typeof CreditNoteSchema>;

export const creditNoteDetailSchema = z.object({
  id: z.string().optional(),
  credit_note_id: z.string().uuid(),
  inventory_transaction_id: z.string().uuid().nullable(),
  product_id: z.string().uuid(),
  sequence_no: z.number(),
  description: z.string().nullable(),
  note: z.string().nullable(),
  product_name: z.string().nullable(),
  product_local_name: z.string().optional(),
  qty: z.number(),
  amount: z.number(),
  info: z.string().nullable(),
  dimension: z.string().nullable(),
  doc_version: z.string(),
});

export type CreditNoteDetailDto = z.infer<typeof creditNoteDetailSchema>;

export const creditNoteDetailFormSchema = z.object({
  add: z.array(creditNoteDetailSchema),
  update: z.array(creditNoteDetailSchema),
  remove: z.array(z.string()),
});

export type CreditNoteDetailFormDto = z.infer<
  typeof creditNoteDetailFormSchema
>;

export const creditNoteFormSchema = z.object({
  cn_date: z.string(),
  note: z.string().nullable(),
  tb_credit_note_detail: creditNoteDetailFormSchema,
});

export type CreditNoteFormDto = z.infer<typeof creditNoteFormSchema>;
