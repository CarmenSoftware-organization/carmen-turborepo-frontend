import { z } from "zod";

/**
 * Factory function สำหรับสร้าง Zod Schema พร้อม i18n messages
 * ใช้เฉพาะใน currency form
 */
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

/**
 * Factory function สำหรับ Create Schema
 */
export const createCurrencyCreateSchema = (messages: {
  codeRequired: string;
  nameRequired: string;
  symbolRequired: string;
  symbolMax: string;
  exchangeRatePositive: string;
}) => createCurrencyBaseSchema(messages);

/**
 * Factory function สำหรับ Update Schema (รวม id)
 */
export const createCurrencyUpdateSchema = (messages: {
  codeRequired: string;
  nameRequired: string;
  symbolRequired: string;
  symbolMax: string;
  exchangeRatePositive: string;
}) => createCurrencyBaseSchema(messages).extend({
  id: z.string().min(1),
});

/**
 * Inferred Types จาก Zod Schemas
 */
export type CurrencyFormData = z.infer<ReturnType<typeof createCurrencyBaseSchema>>;
export type CurrencyCreateData = z.infer<ReturnType<typeof createCurrencyCreateSchema>>;
export type CurrencyUpdateData = z.infer<ReturnType<typeof createCurrencyUpdateSchema>>;
