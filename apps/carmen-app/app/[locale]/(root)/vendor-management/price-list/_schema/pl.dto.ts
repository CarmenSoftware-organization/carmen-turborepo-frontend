export interface Vendor {
  id: string;
  name: string;
}

export interface Currency {
  id: string;
  name: string;
}

export interface TaxProfile {
  rate: number;
}

export interface PricelistItemDetail {
  id: string;
  sequence_no: number;
  moq_qty: number;
  unit_id: string;
  unit_name: string | null;
  lead_time_days: number;
  price_wirhout_tax: number; // หมายเหตุ: ใน JSON เขียนสะกดผิด (wirhout) จึงตั้งตามต้นฉบับ
  tax_amt: number;
  price: number;
  tax_profile_id: string;
  is_active: boolean;
  note: string | null;
  info: Record<string, any>; // สำหรับ object ว่าง {}
  product_id: string;
  product_name: string;
  tax_profile: TaxProfile;
}

export interface PricelistDetail {
  id: string;
  no: string;
  name: string;
  status: "draft" | "active" | string; // สามารถระบุ enum ที่แน่นอนได้ถ้าทราบ
  description: string;
  vendor: Vendor;
  currency: Currency;
  effectivePeriod: string | string[] | { from: string; to: string }; // "Wed, 07 Jan 2026 ... - Fri, 09 Jan 2026 ..."
  note: string;
  pricelist_detail: PricelistItemDetail[];
}
