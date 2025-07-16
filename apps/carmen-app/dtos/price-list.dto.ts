import { TaxType } from "@/constants/enum";
import { z } from "zod";


export const priceListSchema = z.object({
    vendor_id: z.string(),
    vendor: z.object({
        id: z.string(),
        name: z.string(),
    }).optional(),
    from_date: z.date(),
    to_date: z.date().optional(),
    product_id: z.string().optional(),
    product_name: z.string().optional(),
    unit_id: z.string().optional(),
    unit_name: z.string().optional(),
    price: z.number().optional(),
    price_without_vat: z.number().optional(),
    price_with_vat: z.number().optional(),
    tax_type: z.nativeEnum(TaxType).optional(),
    tax_rate: z.number().optional(),
    is_active: z.boolean().optional(),
    note: z.string().optional(),
    info: z.record(z.any()).optional(),
    dimension: z.string().optional(),
});

export const updatePriceListSchema = priceListSchema.partial().extend({
    id: z.string(),
});

export type CreatePriceListDto = z.infer<typeof priceListSchema>;
export type UpdatePriceListDto = z.infer<typeof updatePriceListSchema>;
export interface PriceListDto {
    id?: string;
    vendor_id: string;
    vendor: {
        id: string;
        name: string;
    };
    from_date: string;
    to_date: string;
    pricelist_detail: {
        id: string;
        sequence_no: number;
        price: number;
        price_without_vat: number;
        price_with_vat: number;
        tax_profile_id: string;
        tax_profile_name: string;
        tax_rate: number;
        is_active: boolean;
        note: string;
        info: Record<string, string>;
        dimension: Record<string, string>;
        tb_product: {
            id: string;
            name: string;
        };
    }[];
};

