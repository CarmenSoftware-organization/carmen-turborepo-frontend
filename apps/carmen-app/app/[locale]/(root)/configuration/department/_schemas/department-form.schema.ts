import { z } from "zod";

/**
 * Factory function สำหรับสร้าง Department Schema พร้อม i18n messages
 * ใช้เฉพาะใน department form
 */
export const createDepartmentSchema = (messages: {
  nameRequired: string;
}) => z.object({
  name: z.string().min(1, messages.nameRequired),
  description: z.string().optional(),
  is_active: z.boolean(),
  users: z
    .object({
      add: z
        .array(
          z.object({
            id: z.string().min(1),
            isHod: z.boolean(),
          })
        )
        .optional(),
      update: z
        .array(
          z.object({
            id: z.string().min(1),
            isHod: z.boolean(),
          })
        )
        .optional(),
      remove: z
        .array(
          z.object({
            id: z.string().min(1),
          })
        )
        .optional(),
    })
    .optional(),
});

/**
 * Factory function สำหรับ Update Schema (รวม id)
 */
export const createDepartmentUpdateSchema = (messages: {
  nameRequired: string;
}) => createDepartmentSchema(messages).extend({
  id: z.string().uuid(),
});

/**
 * Inferred Types จาก Zod Schemas
 */
export type DepartmentFormData = z.infer<ReturnType<typeof createDepartmentSchema>>;
export type DepartmentUpdateData = z.infer<ReturnType<typeof createDepartmentUpdateSchema>>;
