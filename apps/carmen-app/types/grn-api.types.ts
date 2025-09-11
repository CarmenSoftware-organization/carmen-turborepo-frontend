// Types for GRN API Response (Read-only, for display purposes)
// These types match the actual API response structure

export interface BaseEntity {
  id: string;
  doc_version: string;
  created_at: string;
  created_by_id: string;
  updated_at: string;
  updated_by_id: string | null;
  deleted_at: string | null;
  deleted_by_id: string | null;
}

export interface GrnDetailItem extends BaseEntity {
  inventory_transaction_id: string | null;
  good_received_note_id: string;
  purchase_order_detail_id: string | null;
  sequence_no: number;
  location_id: string;
  location_name: string;
  product_id: string;
  product_name: string;
  product_local_name: string;
  inventory_unit_id: string | null;
  inventory_unit_name: string | null;
  order_qty: string;
  order_unit_id: string;
  order_unit_name: string;
  order_unit_conversion_factor: string | null;
  order_base_qty: string | null;
  received_qty: string;
  received_unit_id: string;
  received_unit_name: string;
  received_unit_conversion_factor: string | null;
  received_base_qty: string | null;
  foc_qty: string;
  foc_unit_id: string;
  foc_unit_name: string;
  foc_unit_conversion_factor: string | null;
  foc_base_qty: string | null;
  price: string;
  tax_profile_id: string | null;
  tax_profile_name: string | null;
  tax_rate: string;
  tax_amount: string;
  is_tax_adjustment: boolean;
  total_amount: string;
  delivery_point_id: string;
  delivery_point_name: string;
  base_price: string;
  base_qty: string;
  extra_cost: string;
  total_cost: string;
  discount_rate: string;
  discount_amount: string | null;
  is_discount_adjustment: boolean;
  expired_date: string | null;
  note: string | null;
  info: any | null;
  dimension: any | null;
}

export interface ExtraCostItem extends BaseEntity {
  name: string;
  good_received_note_id: string;
  allocate_extra_cost_type: string | null;
  description: string | null;
  note: string;
  info: any | null;
}

export interface ExtraCostDetailItem extends BaseEntity {
  extra_cost_id: string;
  sequence_no: number;
  extra_cost_type_id: string;
  name: string | null;
  description: string | null;
  note: string;
  amount: string;
  tax_profile_id: string | null;
  tax_profile_name: string | null;
  tax_rate: string;
  tax_amount: string;
  is_tax_adjustment: boolean;
  info: any | null;
  dimension: any | null;
}

export interface GrnApiResponse extends BaseEntity {
  grn_no: string;
  grn_date: string | null;
  invoice_no: string;
  invoice_date: string;
  description: string;
  doc_status: string;
  doc_type: string;
  vendor_id: string;
  vendor_name: string;
  currency_id: string;
  currency_name: string;
  currency_rate: string;
  workflow_id: string;
  workflow_name: string | null;
  workflow_history: any | null;
  workflow_current_stage: string | null;
  workflow_previous_stage: string | null;
  workflow_next_stage: string | null;
  user_action: string | null;
  last_action: string;
  last_action_at_date: string | null;
  last_action_by_id: string | null;
  last_action_by_name: string | null;
  is_consignment: boolean;
  is_cash: boolean;
  signature_image_url: string;
  received_by_id: string;
  received_by_name: string | null;
  received_at: string;
  credit_term_id: string;
  credit_term_name: string;
  credit_term_days: number;
  payment_due_date: string;
  is_active: boolean;
  note: string | null;
  info: any | null;
  dimension: any | null;
  good_received_note_detail: GrnDetailItem[];
  extra_cost: ExtraCostItem[];
  extra_cost_detail: ExtraCostDetailItem[];
}

// Type for API response wrapper
export interface GrnApiResponseWrapper {
  data: GrnApiResponse;
}