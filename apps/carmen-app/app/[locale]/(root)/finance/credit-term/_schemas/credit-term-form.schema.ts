import { z } from "zod";
export const createCreditTermFormSchema = (messages: {
  nameRequired: string;
  valueMin: string;
}) =>
  z.object({
    name: z.string().min(1, messages.nameRequired),
    value: z.number().min(1, messages.valueMin),
    description: z.string().optional(),
    is_active: z.boolean(),
    note: z.string().optional(),
  });

export const createCreditTermEditSchema = (messages: {
  nameRequired: string;
  valueMin: string;
  invalidIdFormat: string;
}) =>
  createCreditTermFormSchema(messages).extend({
    id: z.string().uuid(messages.invalidIdFormat),
  });

export type CreditTermFormData = z.infer<
  ReturnType<typeof createCreditTermFormSchema>
>;
export type CreditTermEditData = z.infer<
  ReturnType<typeof createCreditTermEditSchema>
>;
