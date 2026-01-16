export interface PurchaseRequestTemplateDetailDto {
  id: string;
  purchase_request_template_id: string;
  location_id: string;
  location_code: string | null;
  location_name: string;
  delivery_point_id: string;
  delivery_point_name: string | null;
  product_id: string;
  product_name: string;
  product_local_name: string | null;
  inventory_unit_id: string;
  inventory_unit_name: string | null;
  description: string;
  comment: string;
  currency_id: string;
  currency_name: string | null;
  exchange_rate: number;
  exchange_rate_date: string | null;
  requested_qty: number;
  requested_unit_id: string;
  requested_unit_name: string;
  requested_unit_conversion_factor: number;
  requested_base_qty: number;
  foc_qty: number;
  foc_unit_id: string;
  foc_unit_name: string;
  foc_unit_conversion_factor: number;
  foc_base_qty: number;
  tax_profile_id: string | null;
  tax_profile_name: string | null;
  tax_rate: number;
  tax_amount: number;
  base_tax_amount: number;
  is_tax_adjustment: boolean;
  discount_rate: number;
  discount_amount: number;
  base_discount_amount: number;
  is_discount_adjustment: boolean;
  is_active: boolean;
  info: Record<string, unknown>;
  dimension: unknown[];
  doc_version: number;
  created_at: string;
  created_by_id: string;
  updated_at: string;
  updated_by_id: string | null;
  deleted_at: string | null;
  deleted_by_id: string | null;
}

export interface PurchaseRequestTemplateInfo {
  category: string;
  priority: string;
}

export interface PurchaseRequestTemplateDto {
  id: string;
  name: string;
  description: string;
  workflow_id: string;
  workflow_name: string;
  department_id: string;
  department_name: string;
  is_active: boolean;
  note: string;
  info: PurchaseRequestTemplateInfo;
  dimension: unknown[];
  created_at: string;
  created_by_id: string;
  updated_at: string;
  updated_by_id: string | null;
  deleted_at: string | null;
  deleted_by_id: string | null;
  purchase_request_template_detail: PurchaseRequestTemplateDetailDto[];
}
