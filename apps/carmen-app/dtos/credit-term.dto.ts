import { z } from "zod";

const creditTermBaseSchema = z.object({
    name: z.string().min(1, "Name is required"),
    value: z.number().min(0, "Value must be a positive number"),
    description: z.string().optional(),
    is_active: z.boolean(),
    note: z.string().optional(),
});

export const createCreditTermSchema = creditTermBaseSchema;

export const getAllCreditTermSchema = creditTermBaseSchema.extend({
    id: z.string().uuid("Invalid ID format"),
});

export const updateCreditTermSchema = createCreditTermSchema;

export type GetAllCreditTermDto = z.infer<typeof getAllCreditTermSchema>;
export type CreateCreditTermFormValues = z.infer<typeof createCreditTermSchema>;
export type UpdateCreditTermDto = z.infer<typeof updateCreditTermSchema>;
