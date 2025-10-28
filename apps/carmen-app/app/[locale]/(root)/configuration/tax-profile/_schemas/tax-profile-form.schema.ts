import { z } from "zod";

/**
 * Factory function สำหรับสร้าง Tax Profile Form Schema พร้อม i18n messages
 */
export const createTaxProfileFormSchema = (messages: {
  nameRequired: string;
  taxRateRequired: string;
  taxRateInvalid: string;
  taxRateMin: string;
  taxRateMax: string;
}) =>
  z.object({
    name: z
      .string()
      .min(1, messages.nameRequired),
    tax_rate: z
      .number({
        required_error: messages.taxRateRequired,
        invalid_type_error: messages.taxRateInvalid,
      })
      .min(0, messages.taxRateMin)
      .max(100, messages.taxRateMax),
    is_active: z.boolean().default(true),
  });

/**
 * Factory function สำหรับสร้าง Tax Profile Edit Schema พร้อม i18n messages
 */
export const createTaxProfileEditSchema = (messages: {
  nameRequired: string;
  taxRateRequired: string;
  taxRateInvalid: string;
  taxRateMin: string;
  taxRateMax: string;
  invalidIdFormat: string;
}) =>
  createTaxProfileFormSchema(messages).extend({
    id: z.string().uuid({ message: messages.invalidIdFormat }),
  });

export type TaxProfileFormData = z.infer<
  ReturnType<typeof createTaxProfileFormSchema>
>;
export type TaxProfileEditData = z.infer<
  ReturnType<typeof createTaxProfileEditSchema>
>;
