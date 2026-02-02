import { z } from "zod";
import { STOCK_IN_OUT_TYPE_PAYLOAD } from "./stock-in-out.dto";

export const baseAdjustmentTypeSchema = z.object({
  code: z.string(),
  name: z.string(),
  type: z.nativeEnum(STOCK_IN_OUT_TYPE_PAYLOAD),
  description: z.string(),
  is_active: z.boolean(),
});

export const adjustmentTypeDtoSchema = baseAdjustmentTypeSchema.extend({
  id: z.string(),
});

export const createAdjustmentTypeFormSchema = (messages: {
  codeRequired: string;
  codeMaxLength?: string;
  nameRequired: string;
  typeRequired: string;
}) =>
  z.object({
    code: z.string().trim().min(1, messages.codeRequired).max(5, messages.codeMaxLength),
    name: z.string().trim().min(1, messages.nameRequired),
    type: z.nativeEnum(STOCK_IN_OUT_TYPE_PAYLOAD, {
      required_error: messages.typeRequired,
      invalid_type_error: messages.typeRequired,
    }),
    description: z.string().trim(),
    is_active: z.boolean(),
  });

export type BaseAdjustmentType = z.infer<typeof baseAdjustmentTypeSchema>;
export type AdjustmentTypeDto = z.infer<typeof adjustmentTypeDtoSchema>;
export type AdjustmentTypeFormValues = z.infer<ReturnType<typeof createAdjustmentTypeFormSchema>>;
