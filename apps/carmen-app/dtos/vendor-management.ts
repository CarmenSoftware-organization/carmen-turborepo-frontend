import { z } from "zod";

const DataTypeEnum = z.enum([
    "string",
    "date",
    "datetime",
    "number",
    "boolean",
    "dataset",
]);

const InfoItemSchema = z.object({
    label: z.string(),
    value: z.string(),
    data_type: DataTypeEnum,
});

const AddressSchema = z.object({
    line_1: z.string().optional(),
    line_2: z.string().optional(),
    sub_district: z.string().optional(),
    district: z.string().optional(),
    province: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().optional(),
});

const VendorContactSchema = z.object({
    contact_type: z.string(),
    description: z.string(),
    info: z.array(InfoItemSchema),
});


const VendorAddressSchema = z.object({
    address_type: z.literal("contact_address"),
    address: AddressSchema,
});

const VendorFormSchemaValue = z.object({
    id: z.string().optional(),
    name: z.string(),
    description: z.string().optional(),
    info: z.array(InfoItemSchema),
    vendor_address: z.array(VendorAddressSchema),
    vendor_contact: z.array(VendorContactSchema),
    is_active: z.boolean(),
});
// DTO สำหรับส่งข้อมูลทั่วไป
export type VendorFormDto = z.infer<typeof VendorFormSchemaValue>;
export const VendorFormUpdateSchema = VendorFormSchemaValue.omit({ id: true });
export type VendorFormUpdateDto = z.infer<typeof VendorFormUpdateSchema>;
export interface VendorGetDto {
    id: string;
    name: string;
    description: string;
    info: {
        label: string;
        value: string;
        data_type: "string" | "date" | "datetime" | "number" | "boolean" | "dataset";
    }[];
    is_active: boolean;
    created_at?: string;
    created_by_id?: string;
    updated_at?: string;
    updated_by_id?: string | null;
    vendor_address?: {
        id: string;
        address_type: "contact_address";
        address: {
            line_1?: string;
            line_2?: string;
            sub_district?: string;
            district?: string;
            province?: string;
            postal_code?: string;
            country?: string;
        };
        is_active: boolean;
    }[];
    vendor_contact?: {
        id: string;
        contact_type: string;
        description: string;
        info: {
            label: string;
            value: string;
            data_type: "string" | "date" | "datetime" | "number" | "boolean" | "dataset";
        }[];
        is_active: boolean;
    }[];
}

export const PriceListSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    code: z.string(),
    description: z.string(),
    status: z.boolean(),
    start_date: z.string(),
    end_date: z.string()
});

export type PriceListDto = z.infer<typeof PriceListSchema>;


