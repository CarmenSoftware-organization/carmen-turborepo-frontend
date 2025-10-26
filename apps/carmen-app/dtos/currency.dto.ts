import { z } from "zod";

// Schema factory for i18n support
export const createCurrencyBaseSchema = (messages: {
    codeRequired: string;
    nameRequired: string;
    symbolRequired: string;
    symbolMax: string;
    exchangeRatePositive: string;
}) => z.object({
    code: z.string().min(1, messages.codeRequired),
    name: z.string().min(1, messages.nameRequired),
    description: z.string().optional(),
    is_active: z.boolean(),
    symbol: z.string().min(1, messages.symbolRequired).max(5, messages.symbolMax),
    exchange_rate: z.number().positive(messages.exchangeRatePositive)
});

// Default schemas for backward compatibility
const defaultMessages = {
    codeRequired: 'Currency code is required',
    nameRequired: 'Currency name is required',
    symbolRequired: 'Currency symbol is required',
    symbolMax: 'Currency symbol must not exceed 5 characters',
    exchangeRatePositive: 'Exchange rate must be a positive number',
};

export const currencyBaseSchema = createCurrencyBaseSchema(defaultMessages);

export const currencyCreateSchema = currencyBaseSchema;

export const currencyGetSchema = currencyBaseSchema.extend({
    id: z.string().min(1),
});

export const currencyUpdateSchema = currencyGetSchema;

// Schema factories for i18n
export const createCurrencyCreateSchema = (messages: {
    codeRequired: string;
    nameRequired: string;
    symbolRequired: string;
    symbolMax: string;
    exchangeRatePositive: string;
}) => createCurrencyBaseSchema(messages);

export const createCurrencyUpdateSchema = (messages: {
    codeRequired: string;
    nameRequired: string;
    symbolRequired: string;
    symbolMax: string;
    exchangeRatePositive: string;
}) => createCurrencyBaseSchema(messages).extend({
    id: z.string().min(1),
});

export type CurrencyCreateDto = z.infer<typeof currencyCreateSchema>;
export type CurrencyUpdateDto = z.infer<typeof currencyUpdateSchema>;
export type CurrencyGetDto = z.infer<typeof currencyGetSchema>;
