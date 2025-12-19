// Status Types
export type StatusRfp = "active" | "inactive" | "draft" | "submit" | "completed";
export type StatusVendor = "completed" | "pending" | "in_progress";
export type PriorityType = "high" | "medium" | "low";
export type RfpType = "buy" | "sell" | "recurring";
export type SubmitMethodType = "auto" | "manual";

// Base Types matching payload structure

export interface RfpVendorDto {
  id: string;
  vendor_id: string;
  vendor_name: string;
  vendor_code: string;
  has_submitted: boolean;
}

export interface RfpPricelistTemplateDto {
  id: string;
  name: string;
  status: string;
  currency: {
    id: string;
    code: string;
  };
}

// Main List DTO
export interface RfpDto {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  custom_message: string | null;
  email_template_id: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dimension: Record<string, any>;
  doc_version: number;
  created_at: string;
  updated_at: string;
  pricelist_template: RfpPricelistTemplateDto;
  vendor_count: number;
  vendors: RfpVendorDto[];
  status: StatusRfp; // Added back status from payload (assuming string status maps to this)
}

// Re-adding omitted types for Mock/Hooks compatibility
// Assuming Create/Update/Detail will eventually match the new structure,
// for now patching them to allow codebase to compile.

export interface RfpCreateDto {
  name: string;
  status: StatusRfp;
  description?: string; // mapped to custom_message
  valid_period: number; // used to calc end_date
  vendors?: { add: string[] }; // simplified for now
}

export interface RfpUpdateDto extends RfpCreateDto {
  template_id?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings?: any;
}

export interface RfpDetailDto extends RfpDto {
  // Add specific detail fields if any, currently extending RfpDto
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings?: any;
  template?: {
    id: string;
    [key: string]: any;
  };
}
