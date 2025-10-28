import { CREDIT_NOTE_TYPE } from "@/constants/enum";

/**
 * Credit Note DTO - Pure TypeScript interfaces
 * Zod schemas moved to: app/.../credit-note/_schemas/credit-note.schema.ts
 */

// ================================
// Interfaces for API Response
// ================================

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
  info?: unknown;
  dimension?: unknown;
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
  workflow_obj?: unknown;
  workflow_history?: unknown;
  workflow_current_stage?: string;
  workflow_previous_stage?: string;
  workflow_next_stage?: string;
  user_action?: string;
  last_action_name?: string;
  last_action_date?: string;
  last_action_by_id?: string;
  last_action_by_name?: string;
  info?: unknown;
  dimension?: unknown;
  doc_version: string;
  created_at: string;
  created_by_id: string;
  updated_at: string;
  updated_by_id?: string;
  deleted_at?: string;
  deleted_by_id?: string;
  credit_note_detail: CreditNoteDetailItemDto[];
}

export interface CreditNoteGetAllDto {
  id?: string;
  cn_no: string;
  cn_date: string;
  doc_status: string;
  note?: string;
  workflow_id?: string;
  workflow_name?: string;
  workflow_obj?: unknown;
  workflow_history?: unknown;
  current_workflow_status?: string;
  workflow_previous_step?: string;
  workflow_next_step?: string;
  current_user_action?: string;
  last_action_name?: string;
  last_action_date?: string;
  last_action_by_id?: string;
  last_action_by_name?: string;
  info?: unknown;
  dimension?: unknown;
  doc_version: string;
  created_at: string;
  created_by_id: string;
  updated_at: string;
  updated_by_id?: string;
  tb_credit_note_detail: {
    id: string;
    credit_note_id: string;
    inventory_transaction_id?: string | null;
    sequence_no: number;
    description?: string | null;
    note?: string | null;
    product_id: string;
    product_name?: string | null;
    product_local_name?: string | null;
    qty: string;
    amount: string;
    info?: unknown | null;
    dimension?: unknown | null;
    doc_version: string;
    created_at: string;
    created_by_id: string;
    updated_at: string;
    updated_by_id?: string | null;
  }[];
}

// ================================
// Form DTOs
// ================================

export interface CreditNoteDetailFormItemDto {
  id?: string;
  description?: string;
  note?: string;
  location_id: string;
  product_id: string;
  return_qty: number;
  return_unit_id: string;
  return_conversion_factor: number;
  return_base_qty: number;
  price: number;
  tax_type_inventory_id: string;
  tax_rate: number;
  tax_amount: number;
  is_tax_adjustment: boolean;
  discount_rate: number;
  discount_amount: number;
  is_discount_adjustment: boolean;
  extra_cost_amount: number;
  base_price: number;
  base_tax_amount: number;
  base_discount_amount: number;
  base_extra_cost_amount: number;
  total_price: number;
}

export interface CreditNoteDetailWithData {
  data?: CreditNoteDetailFormItemDto[];
  add?: CreditNoteDetailFormItemDto[];
  update?: CreditNoteDetailFormItemDto[];
  remove?: { id: string }[];
}

export interface CreditNoteFormDto {
  cn_date: string;
  credit_note_type: CREDIT_NOTE_TYPE;
  vendor_id: string;
  currency_id: string;
  exchange_rate: number;
  exchange_rate_date: string;
  grn_id: string;
  grn_date: string;
  cn_reason_id?: string;
  invoice_no: string;
  invoice_date: string;
  tax_invoice_no: string;
  tax_invoice_date: string;
  note: string;
  description?: string | null;
  credit_note_detail: CreditNoteDetailWithData;
}

export interface CreditNoteSubmitDto {
  cn_date: string;
  credit_note_type: CREDIT_NOTE_TYPE;
  vendor_id: string;
  currency_id: string;
  exchange_rate: number;
  exchange_rate_date: string;
  grn_id: string;
  grn_date: string;
  cn_reason_id?: string;
  invoice_no: string;
  invoice_date: string;
  tax_invoice_no: string;
  tax_invoice_date: string;
  note: string;
  description?: string | null;
  credit_note_detail: Omit<CreditNoteDetailWithData, "data">;
}
