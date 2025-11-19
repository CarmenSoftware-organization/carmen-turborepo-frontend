import { z } from "zod";

export const createDepartmentSchema = (messages: {
  nameRequired: string;
  codeRequired: string;
  nameMaxLength?: string;
  codeMaxLength?: string;
  descriptionMaxLength?: string;
}) =>
  z.object({
    name: z
      .string()
      .min(1, messages.nameRequired)
      .max(100, messages.nameMaxLength || "Name must not exceed 100 characters")
      .trim(),
    code: z
      .string()
      .min(1, messages.codeRequired)
      .max(20, messages.codeMaxLength || "Code must not exceed 20 characters")
      .trim()
      .toUpperCase(),
    description: z
      .string()
      .max(500, messages.descriptionMaxLength || "Description must not exceed 500 characters")
      .trim()
      .optional()
      .or(z.literal("")),
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

export const createDepartmentUpdateSchema = (messages: {
  nameRequired: string;
  codeRequired: string;
}) =>
  createDepartmentSchema(messages).extend({
    id: z.string().uuid(),
  });

export type DepartmentFormData = z.infer<ReturnType<typeof createDepartmentSchema>>;
export type DepartmentUpdateData = z.infer<ReturnType<typeof createDepartmentUpdateSchema>>;
