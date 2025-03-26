import { z } from "zod";

export const currencySchema = z.object({
    id: z.string().min(1).optional(),
    code: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    is_active: z.boolean(),
    symbol: z.string().min(1),
    exchange_rate: z.number(),
});

export type CurrencyDto = z.infer<typeof currencySchema>;
