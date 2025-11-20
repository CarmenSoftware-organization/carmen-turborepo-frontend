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
  code: string;
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

export interface BasePriceList {
  no: string;
  vendor: VendorDto;
  rfp?: RfpDto;
  description?: string;
  status: PlStatusType;
  itemsCount: number;
  currency: CurrencyDto;
  isActive: boolean;
  effectivePeriod: DateRange;
  lastUpdate: string;
}

export interface PriceListDtoList extends BasePriceList {
  id: string;
}

export interface PriceListDetailDto extends PriceListDtoList {
  products: ProductPlDto[];
}

export interface PriceListCreateDto {
  no: string;
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
