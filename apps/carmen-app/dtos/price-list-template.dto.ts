export type StatusPriceListTemplate = "draft" | "active" | "inactive";

interface BasePriceListTemplateDto {
  name: string;
  status: StatusPriceListTemplate;
  description?: string;
  validity_period?: number | null;
  vendor_instructions?: string | null;
  created_at: Date;
  updated_at: Date;
}

interface CurrencyDto {
  id: string;
  code: string;
}

interface DefaultOrderDto {
  unit_id: string;
  unit_name: string;
}

interface MOQItemDto {
  unit_id: string;
  unit_name: string;
  note?: string;
  qty: number;
}

interface ProductDto {
  id: string;
  product_id?: string;
  product_name?: string | null;
  product_code?: string;
  doc_version?: number;
  name?: string; // keeping for compatibility until full migration
  code?: string; // keeping for compatibility until full migration
  default_order?: DefaultOrderDto;
  moq?: MOQItemDto[];
}

export interface RfpDtoPL {
  id: string;
  name: string;
  status: StatusPriceListTemplate | "completed" | "submit"; // Keep legacy statuses for RFP if needed, or align with new enum
  priority: "high" | "medium" | "low";
  description?: string;
  created_at: Date;
  res_rate: number;
  count_vendors: number;
}

export interface PriceListTemplateListDto extends BasePriceListTemplateDto {
  id: string;
}

export interface PriceListTemplateDetailsDto extends PriceListTemplateListDto {
  currency: CurrencyDto;
  products: ProductDto[];
  rfps: RfpDtoPL[];
}
