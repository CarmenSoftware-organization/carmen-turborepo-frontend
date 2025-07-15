import { z } from "zod";

export const currencyBaseSchema = z.object({
    code: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
    is_active: z.boolean(),
    symbol: z.string().min(1).max(3),
    exchange_rate: z.number().positive()
});

export const currencyCreateSchema = currencyBaseSchema;

export const currencyGetSchema = currencyBaseSchema.extend({
    id: z.string().min(1),
});

export const currencyUpdateSchema = currencyGetSchema;

export type CurrencyCreateDto = z.infer<typeof currencyCreateSchema>;
export type CurrencyUpdateDto = z.infer<typeof currencyUpdateSchema>;
export type CurrencyGetDto = z.infer<typeof currencyGetSchema>;
