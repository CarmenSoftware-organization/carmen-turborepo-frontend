// Status Types
export type StatusRfp = "active" | "inactive" | "draft" | "submit" | "completed";
export type StatusVendor = "completed" | "pending" | "in_progress";
export type PriorityType = "high" | "medium" | "low";
export type RfpType = "buy" | "sell" | "recurring";
export type SubmitMethodType = "auto" | "manual";

// Base Types matching payload structure

export interface RfpVendorDto {
  id: string; // The relation ID, e.g. "d4c83059-..."
  vendor_id: string; // The actual vendor ID, e.g. "b8695db5-..."
  vendor_name: string;
  vendor_code: string;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  has_submitted?: boolean; // Optional as not in json but might be computed
}

export interface MoqDto {
  qty: number;
  note: string;
  unit_id: string;
  unit_name: string;
}

export interface ProductDto {
  id: string;
  product_id: string;
  product_name: string | null;
  product_code: string;
  moq: MoqDto[];
}

export interface RfpPricelistTemplateDto {
  id: string;
  name: string;
  status: string;
  validity_period: number | null;
  vendor_instructions: string | null;
  currency: {
    id: string;
    code: string;
  };
  products: ProductDto[];
}

// {
//     "data": {
//         "id": "3e105961-4167-46d5-b5a2-7b269da177cc",
//         "name": "Solar Energy Equipment - Project Pricing",
//         "start_date": "2026-02-01T08:30:00.000Z",
//         "end_date": "2026-12-31T17:30:00.000Z",
//         "custom_message": "Prices include professional installation and 5-year maintenance warranty.",
//         "email_template_id": "e4220b22-861d-4c31-8930-74673322748a",
//         "info": "Photovoltaic panels, hybrid inverters, and battery storage solutions.",
//         "dimension": "Green Energy Sector",
//         "doc_version": 0,
//         "created_at": "2025-12-22T03:30:22.170Z",
//         "updated_at": "2025-12-22T03:30:22.170Z",
//         "pricelist_template": {
//             "id": "ddfa5b14-f13d-4f1d-b60a-658d2af230a5",
//             "name": "Standard Beverage Price Template 3",
//             "status": "draft",
//             "validity_period": null,
//             "vendor_instructions": null,
//             "currency": {
//                 "id": "db3283c4-54cb-47e3-82ef-44f9abdb68c0",
//                 "code": "THB"
//             },
//             "products": [
//                 {
//                     "id": "f1086bfb-3405-49f6-9eb1-09c3e05c9665",
//                     "product_id": "8591a8e1-2e6d-49e1-97e4-38f769080d37",
//                     "product_name": null,
//                     "product_code": "TR-001",
//                     "moq": [
//                         {
//                             "qty": 100,
//                             "note": "This is minimum order qty",
//                             "unit_id": "22356348-b7fc-4566-a890-e7f3ae307836",
//                             "unit_name": "PCS"
//                         },
//                         {
//                             "qty": 10,
//                             "note": "Order in box of 12",
//                             "unit_id": "90fb9fee-f153-4801-92a9-617f6cb71565",
//                             "unit_name": "BOX12"
//                         }
//                     ]
//                 },
//                 {
//                     "id": "47391eef-bf68-4538-b2f5-a908280cfe59",
//                     "product_id": "8591a8e1-2e6d-49e1-97e4-38f769080d37",
//                     "product_name": null,
//                     "product_code": "TR-001",
//                     "moq": [
//                         {
//                             "qty": 100,
//                             "note": "This is minimum order qty",
//                             "unit_id": "22356348-b7fc-4566-a890-e7f3ae307836",
//                             "unit_name": "PCS"
//                         },
//                         {
//                             "qty": 10,
//                             "note": "Order in box of 12",
//                             "unit_id": "90fb9fee-f153-4801-92a9-617f6cb71565",
//                             "unit_name": "BOX12"
//                         }
//                     ]
//                 }
//             ]
// Main Detail DTO (Get ID)
export interface RfpDetailDto {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  custom_message: string;
  email_template_id: string;
  info: string;
  dimension: string;
  doc_version: number;
  created_at: string;
  updated_at: string;
  pricelist_template: RfpPricelistTemplateDto;
  vendors: RfpVendorDto[];

  // Optional/Computed fields that might exist in other contexts or legacy
  status?: StatusRfp;
}

export type RfpDto = RfpDetailDto; // Alias for backward compatibility

// Create/Update Types
export interface RfpCreateDto {
  name: string;
  pricelist_template_id?: string;
  start_date: string;
  end_date: string;
  custom_message?: string;
  email_template_id?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info?: any;
  dimension?: string;
  vendors?: {
    add: RfpVendorDto[];
  };
}

export interface RfpUpdateDto extends RfpCreateDto {
  // Update specific fields if any
}

// Compat type for VendorTab
export interface VendorStatus {
  id: string;
  name: string;
  email?: string;
  status: StatusVendor;
  progress: number;
  last_activity: Date;
  is_send: boolean;
}
