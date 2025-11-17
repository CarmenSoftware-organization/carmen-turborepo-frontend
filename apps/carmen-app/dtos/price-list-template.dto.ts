export type StatusPriceListTemplate = "active" | "inactive" | "draft" | "submit" | "completed";

interface BasePriceListTemplateDto {
  name: string;
  status: StatusPriceListTemplate;
  description?: string;
  valid_period: number;
  create_date: Date;
  update_date: Date;
}

interface CurrencyDto {
  id: string;
  code: string;
}

interface ProductDto {
  id: string;
  name: string;
  code: string;
}

interface RfpDtoPL {
  id: string;
  name: string;
  status: StatusPriceListTemplate;
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
