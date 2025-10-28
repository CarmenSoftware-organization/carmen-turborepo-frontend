/**
 * GRN DTO - Pure TypeScript interfaces
 * Zod schemas moved to: app/.../goods-received-note/_schemas/grn-form.schema.ts
 */

import { ALLOCATE_EXTRA_COST_TYPE, DOC_TYPE, TaxType } from "@/constants/enum";

/**
 * Good Received Note Detail Item DTO
 */
export interface GoodReceivedNoteDetailItemDto {
  id?: string;
  sequence_no: number;
  location_id: string;
  product_id: string;
  order_qty: number;
  order_unit_id: string;
  received_qty: number;
  received_unit_id: string;
  foc_qty: number;
  foc_unit_id: string;
  price: number;
  tax_type_inventory_id: string;
  tax_type: TaxType;
  tax_rate: number;
  tax_amount: number;
  is_tax_adjustment: boolean;
  total_amount: number;
  delivery_point_id: string;
  base_price: number;
  base_qty: number;
  extra_cost: number;
  total_cost: number;
  discount_rate: number;
  discount_amount: number;
  expired_date: string;
}

/**
 * Extra Cost Detail Item DTO
 */
export interface ExtraCostDetailFormValues {
  id?: string;
  extra_cost_type_id?: string;
  amount?: number;
  tax_type_inventory_id?: string;
  tax_type?: TaxType;
  tax_rate?: number;
  tax_amount?: number;
  is_tax_adjustment?: boolean;
  note?: string;
}

/**
 * Extra Cost DTO
 */
export interface ExtraCostDetailItemDto {
  name?: string;
  allocate_extra_cost_type?: ALLOCATE_EXTRA_COST_TYPE;
  note?: string;
  extra_cost_detail: {
    initData?: ExtraCostDetailFormValues[];
    add: ExtraCostDetailFormValues[];
    update: ExtraCostDetailFormValues[];
    delete: string[];
  };
}

/**
 * Base GRN DTO
 */
export interface BaseGrnDto {
  name?: string;
  grn_no?: string;
  invoice_no?: string;
  invoice_date?: string;
  description?: string;
  doc_status?: string;
  doc_type?: DOC_TYPE;
  vendor_id?: string;
  currency_id?: string;
  currency_rate?: number;
  workflow_id: string;
  workflow_object?: string;
  workflow_history?: string;
  current_workflow_status?: string;
  signature_image_url?: string;
  received_by_id: string;
  received_at?: string;
  credit_term_id?: string;
  payment_due_date?: string;
  note?: string;
  info?: string;
  dimension?: string;
  extra_cost?: ExtraCostDetailItemDto;
}

/**
 * Create GRN DTO
 */
export interface CreateGRNDto extends BaseGrnDto {
  good_received_note_detail?: {
    initData?: GoodReceivedNoteDetailItemDto[];
    add?: GoodReceivedNoteDetailItemDto[];
    update?: GoodReceivedNoteDetailItemDto[];
    delete?: string[];
  };
}

/**
 * Get GRN By ID DTO
 */
export interface GetGrnByIdDto extends BaseGrnDto {
  id: string;
  created_at: string;
  good_received_note_detail: GoodReceivedNoteDetailItemDto[];
}

/**
 * GRN List DTO (for listing GRNs)
 */
export interface GoodsReceivedNoteListDto {
  id: string;
  grn_no: string;
  description?: string;
  vendor_name: string;
  total_amount: number;
  is_active: boolean;
  created_at: string;
}

// Re-export Zod schemas for backward compatibility
export {
  goodReceivedNoteDetailItemSchema,
  extraCostDetailItemSchema,
  extraCostSchema,
  baseGrnSchema,
  grnPostSchema,
  grnByIdSchema,
} from "@/app/[locale]/(root)/procurement/goods-received-note/_schemas/grn-form.schema";
