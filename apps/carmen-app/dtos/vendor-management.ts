import { z } from "zod";

export const VendorSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    bu_type: z.string(),
    address: z.string(),
    contact_person: z.object({
        name: z.string(),
        phone: z.string(),
        email: z.string(),
    }),
});

export type VendorDto = z.infer<typeof VendorSchema>;

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


