import { z } from "zod";

const DataTypeEnum = z.enum(["string", "date", "datetime", "number", "boolean", "dataset"]);

const InfoItemSchema = z.object({
  label: z.string(),
  value: z.string(),
  data_type: DataTypeEnum,
});

const VendorContactSchema = z.object({
  name: z.string(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  is_primary: z.boolean().optional(),
});

const VendorAddressDataSchema = z.object({
  address_line1: z.string(),
  address_line2: z.string().optional(),
  district: z.string(),
  province: z.string().optional(), // Made optional
  city: z.string().optional(), // Added city
  postal_code: z.string(),
  country: z.string(),
});

const VendorAddressSchema = z.object({
  address_type: z.string(),
  data: VendorAddressDataSchema,
});

const VendorFormSchemaValue = z.object({
  id: z.string().optional(),
  name: z.string(),
  code: z.string(),
  description: z.string().optional(),
  business_type: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  info: z.array(InfoItemSchema),
  vendor_address: z.array(VendorAddressSchema),
  vendor_contact: z.array(VendorContactSchema),
  is_active: z.boolean().optional(),
});
// DTO สำหรับส่งข้อมูลทั่วไป
export type VendorFormDto = z.infer<typeof VendorFormSchemaValue>;
export const VendorFormUpdateSchema = VendorFormSchemaValue.omit({ id: true });
export type VendorFormUpdateDto = z.infer<typeof VendorFormUpdateSchema>;

export interface VendorGetDto {
  id: string;
  name: string;
  code: string;
  description: string | null;
  note: string | null;
  business_type: {
    id: string;
    name: string;
  }[];
  tax_profile_id: string | null;
  tax_profile_name: string | null;
  tax_rate: number | null;
  is_active: boolean;
  info: {
    label: string;
    value: string;
    data_type: "string" | "date" | "datetime" | "number" | "boolean" | "dataset";
  }[];
  dimension: Record<string, any>;
  created_at?: string;
  created_by_id?: string;
  updated_at?: string;
  updated_by_id?: string | null;
  vendor_address?: {
    id: string;
    address_type: string;
    data: {
      address_line1?: string;
      address_line2?: string;
      sub_district?: string;
      district?: string;
      province?: string;
      city?: string;
      postal_code?: string;
      country?: string;
    };
    is_active: boolean;
  }[];
  vendor_contact?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    is_primary: boolean;
    description?: string | null;
    info?: any;
    is_active?: boolean;
  }[];
  tb_vendor_contact?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    is_primary: boolean;
    description: string | null;
    info: any;
  }[];
}

export const PriceListSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  code: z.string(),
  description: z.string(),
  is_active: z.boolean(),
  start_date: z.string(),
  end_date: z.string(),
});

export type PriceListDto = z.infer<typeof PriceListSchema>;
