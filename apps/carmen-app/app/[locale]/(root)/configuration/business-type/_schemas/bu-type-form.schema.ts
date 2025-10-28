import { z } from "zod";

export const createBuTypeFormSchema = (messages: {
  nameRequired: string;
}) => z.object({
  name: z.string().min(1, messages.nameRequired),
  description: z.string().optional(),
  note: z.string().optional(),
  is_active: z.boolean(),
});

export const createBuTypeEditSchema = (messages: {
  nameRequired: string;
}) => createBuTypeFormSchema(messages).extend({
  id: z.string().uuid(),
});

// Types - ใช้ ReturnType กับ z.infer
export type BuTypeFormData = z.infer<ReturnType<typeof createBuTypeFormSchema>>;
export type BuTypeEditData = z.infer<ReturnType<typeof createBuTypeEditSchema>>;