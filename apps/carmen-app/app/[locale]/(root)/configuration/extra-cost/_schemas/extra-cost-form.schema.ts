import { z } from "zod";

/**
 * Factory function สำหรับสร้าง Extra Cost Schema พร้อม i18n messages
 * ใช้เฉพาะใน extra-cost form
 */
export const createExtraCostFormSchema = (messages: {
  nameRequired: string;
}) => z.object({
  name: z.string().min(1, messages.nameRequired),
  description: z.string().optional(),
  note: z.string().optional(),
  is_active: z.boolean(),
  info: z.string().optional(),
  dimension: z.string().optional(),
});

/**
 * Factory function สำหรับ Update Schema (รวม id)
 */
export const createExtraCostUpdateSchema = (messages: {
  nameRequired: string;
}) => createExtraCostFormSchema(messages).extend({
  id: z.string(),
});

/**
 * Inferred Types จาก Zod Schemas
 */
export type ExtraCostFormData = z.infer<ReturnType<typeof createExtraCostFormSchema>>;
export type ExtraCostUpdateData = z.infer<ReturnType<typeof createExtraCostUpdateSchema>>;
