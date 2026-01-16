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
  exchange_rate: string;
  exchange_rate_date: string | null;
  requested_qty: string;
  requested_unit_id: string;
  requested_unit_name: string;
  requested_unit_conversion_factor: string;
  requested_base_qty: string;
  foc_qty: string;
  foc_unit_id: string;
  foc_unit_name: string;
  foc_unit_conversion_factor: string;
  foc_base_qty: string;
  tax_profile_id: string | null;
  tax_profile_name: string | null;
  tax_rate: string;
  tax_amount: string;
  base_tax_amount: string;
  is_tax_adjustment: boolean;
  discount_rate: string;
  discount_amount: string;
  base_discount_amount: string;
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

const examplePo: PurchaseRequestTemplateDto[] = [
  {
    id: "1439d3bd-f2ce-4e18-b1bb-a157e36ef660",
    name: "Office Supplies Template",
    description: "Monthly office supplies purchase request template",
    workflow_id: "ab2457b4-90f5-43cf-b0c8-9ae25d63504d",
    workflow_name: "test1",
    department_id: "dbc424a8-ee07-4821-a500-19f51610710d",
    department_name: "KC Department",
    is_active: true,
    note: "Use this template for regular office supply orders",
    info: {
      category: "office_supplies",
      priority: "normal",
    },
    dimension: [],
    created_at: "2026-01-15T07:13:38.956Z",
    created_by_id: "b33c6500-b0c3-4e99-8467-db4a10de069e",
    updated_at: "2026-01-15T07:13:38.956Z",
    updated_by_id: null,
    deleted_at: null,
    deleted_by_id: null,
    purchase_request_template_detail: [
      {
        id: "401f68df-7a9a-4eb7-b98b-ac76c4471c23",
        purchase_request_template_id: "1439d3bd-f2ce-4e18-b1bb-a157e36ef660",
        location_id: "54817bac-053a-4c45-beb0-53015ea63c59",
        location_code: null,
        location_name: "Staff Canteen",
        delivery_point_id: "03d8b4bd-31f0-4e25-8188-a6478c5026b3",
        delivery_point_name: null,
        product_id: "faf29e8b-2a5e-4e59-b598-7c4514c1c3ca",
        product_name: "Ground Pork",
        product_local_name: null,
        inventory_unit_id: "566c45dd-d5fa-4820-99d6-29b24ef06289",
        inventory_unit_name: null,
        description: "Standard A4 printing paper",
        comment: "Prefer recycled paper",
        currency_id: "db3283c4-54cb-47e3-82ef-44f9abdb68c0",
        currency_name: null,
        exchange_rate: "1",
        exchange_rate_date: null,
        requested_qty: "100",
        requested_unit_id: "566c45dd-d5fa-4820-99d6-29b24ef06289",
        requested_unit_name: "BAG",
        requested_unit_conversion_factor: "1",
        requested_base_qty: "100",
        foc_qty: "5",
        foc_unit_id: "566c45dd-d5fa-4820-99d6-29b24ef06289",
        foc_unit_name: "BAG",
        foc_unit_conversion_factor: "1",
        foc_base_qty: "5",
        tax_profile_id: null,
        tax_profile_name: null,
        tax_rate: "7",
        tax_amount: "350",
        base_tax_amount: "350",
        is_tax_adjustment: false,
        discount_rate: "5",
        discount_amount: "250",
        base_discount_amount: "250",
        is_discount_adjustment: false,
        is_active: true,
        info: {},
        dimension: [],
        doc_version: 0,
        created_at: "2026-01-15T07:13:39.082Z",
        created_by_id: "b33c6500-b0c3-4e99-8467-db4a10de069e",
        updated_at: "2026-01-15T07:13:39.082Z",
        updated_by_id: null,
        deleted_at: null,
        deleted_by_id: null,
      },
    ],
  },
];
