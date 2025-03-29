import { z } from "zod";

export interface InventoryAdjustmentDTO {
    id: string;
    adj_no: string;
    adj_date: string;
    type: string;
    location: string;
    reason: string;
    item_count: number;
    status: string;
    total_value: number;
}

export interface PeriodEndDto {
    id: string;
    pe_no: string;
    pe_date: string;
    start_date: string;
    end_date: string;
    status: string;
    created_by: string;
    completed_at: string;
    note: string;
}

export const SpotCheckSchema = z.object({
    id: z.string().optional(),
    department: z.string(),
    location: z.string(),
    status: z.string(),
    requested_by: z.string(),
    date: z.string(),
    checked_items: z.number(),
    count_items: z.number(),
})

export type SpotCheckDto = z.infer<typeof SpotCheckSchema>;

export const PhysicalCountSchema = z.object({
    id: z.string().optional(),
    department: z.string(),
    location: z.string(),
    status: z.string(),
    requested_by: z.string(),
    date: z.string(),
    checked_items: z.number(),
    count_items: z.number(),
})

export type PhysicalCountDto = z.infer<typeof PhysicalCountSchema>;
