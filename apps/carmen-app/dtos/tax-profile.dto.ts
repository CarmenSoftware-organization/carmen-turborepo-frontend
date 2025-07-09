import { z } from "zod";

export const taxProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  tax_rate: z
    .number({
      required_error: "Tax rate is required",
      invalid_type_error: "Tax rate must be a number",
    })
    .min(0, "Tax rate must be 0 or greater")
    .max(100, "Tax rate cannot exceed 100%"),
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
