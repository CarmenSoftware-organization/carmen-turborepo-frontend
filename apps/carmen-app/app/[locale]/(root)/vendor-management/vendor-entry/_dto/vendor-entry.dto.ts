interface UnitDto {
  id: string;
  name: string;
}

interface CurrencyDto {
  id: string;
  code: string;
}

export interface MoqTierDto {
  id: string;
  minimumQuantity: number; // ต้องสั่งขั้นต่ำเท่าไหร่
  price: number;
  leadTimeInDays?: number;
}

export interface VendorItemDto {
  id: string;
  code: string;
  description?: string;
  unit: UnitDto;
  price: number; // ราคาพื้นฐาน (tier แรก)
  leadTimeInDays?: number;
  moqTiers: MoqTierDto[]; // ช่วงราคาตามปริมาณ
}

export interface VendorEntryDto {
  id: string;
  vendorId: string;
  vendorName: string;
  currency: CurrencyDto;
  status: string;
  items: VendorItemDto[];
}

export interface CreateVendorItemDto {
  code: string;
  description?: string;
  unit: UnitDto;
  price: number;
  leadTimeInDays?: number;
  moqTiers?: Array<{
    minimumQuantity: number;
    price: number;
    leadTimeInDays?: number;
  }>;
}
