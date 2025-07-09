import { z } from "zod";

export const taxProfileSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  tax_rate: z.number().min(0, { message: "Tax rate must be greater than 0" }),
  is_active: z.boolean().default(true),
});

export const taxProfileEditSchema = taxProfileSchema.extend({
  id: z.string().uuid({ message: "Invalid ID format" }),
});

export type TaxProfileFormData = z.infer<typeof taxProfileSchema>;
export type TaxProfileGetAllDto = TaxProfileFormData & {
  id: string;
};
export type TaxProfileEditDto = z.infer<typeof taxProfileEditSchema>;