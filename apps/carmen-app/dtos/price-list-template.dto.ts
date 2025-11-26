export type StatusPriceListTemplate = "draft" | "active" | "inactive";

interface BasePriceListTemplateDto {
  name: string;
  status: StatusPriceListTemplate;
  description?: string;
  valid_period: number;
  vendor_instruction?: string;
  create_date: Date;
  update_date: Date;
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
  name: string;
  code: string;
  default_order?: DefaultOrderDto;
  moq?: MOQItemDto[];
}

interface RfpDtoPL {
  id: string;
  name: string;
  status: StatusPriceListTemplate | "completed" | "submit"; // Keep legacy statuses for RFP if needed, or align with new enum
  priority: "high" | "medium" | "low";
  description?: string;
  create_date: Date;
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
