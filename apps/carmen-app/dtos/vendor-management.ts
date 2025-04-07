import { z } from "zod";


export const VendorSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    info: z.any().optional(),
    is_active: z.boolean(),
});

// DTO สำหรับส่งข้อมูลทั่วไป
export type VendorDto = z.infer<typeof VendorSchema>;

// DTO สำหรับฟอร์ม (ไม่มี id)
export const VendorFormSchema = VendorSchema.omit({ id: true });
export type VendorFormDto = z.infer<typeof VendorFormSchema>;


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


