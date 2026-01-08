export type PlStatusType = "active" | "draft" | "submit" | "inactive";

export interface DateRange {
  from: string;
  to: string;
}

export interface VendorDto {
  id: string;
  name: string;
}

export interface CurrencyDto {
  id: string;
  name: string;
  code?: string;
  exchangeRateDate?: string;
}

export interface RfpDto {
  id: string;
  name: string;
}

export interface MoqDto {
  minQuantity: number;
  unit: string;
  price: number;
  leadTimeDays: number;
}

export interface ProductPlDto {
  id: string;
  code: string;
  name: string;
  moqs: MoqDto[];
  taxRate: number;
  totalAmount: number;
  priceChange: number;
  lastUpdate: string;
}

export interface TaxProfileDto {
  id: string;
  name: string;
  rate: number;
}

export interface PriceListDetailItemDto {
  id: string;
  sequence_no: number;
  moq_qty: number;
  unit_id: string;
  unit_name: string | null;
  lead_time_days: number;
  price_without_tax: number;
  tax_amt: number;
  price: number;
  tax_profile_id: string;
  is_active: boolean;
  note: string | null;
  info: Record<string, any>;
  product_id: string;
  product_name: string;
  tax_profile: TaxProfileDto;
}

export interface BasePriceList {
  no?: string;
  name: string;
  status: PlStatusType;
  description?: string;
  vendor: VendorDto;
  currency: CurrencyDto;
  effectivePeriod: string;
  note?: string;
}

export interface PriceListDtoList extends BasePriceList {
  id: string;
}

export interface PriceListDetailDto extends BasePriceList {
  pricelist_detail: PriceListDetailItemDto[];
}

export interface PriceListCreateDto {
  no?: string;
  name: string;
  vendorId: string;
  rfpId?: string;
  description?: string;
  status: PlStatusType;
  currencyId: string;
  effectivePeriod: DateRange;
}

export interface PriceListUpdateDto extends PriceListCreateDto {
  products?: Array<{
    id: string;
    moqs: MoqDto[];
  }>;
}
