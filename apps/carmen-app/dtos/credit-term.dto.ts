export interface CreditTermGetAllDto {
    id: string;
    name: string;
    value: string;
    description?: string;
    is_active: boolean;
    note?: string;
}

export interface CreateCreditTermDto {
    name: string;
    value: number;
    description?: string;
    is_active: boolean;
    note?: string;
}

import { z } from "zod";

export const createCreditTermSchema = z.object({
    name: z.string().min(1, "Name is required"),
    value: z.number().min(0, "Value must be a positive number"),
    description: z.string().optional(),
    is_active: z.boolean(),
    note: z.string().optional(),
});

export type CreateCreditTermFormValues = z.infer<typeof createCreditTermSchema>;
