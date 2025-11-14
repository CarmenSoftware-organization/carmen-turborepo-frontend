import * as z from "zod";

export const priceListTemplateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.enum(["active", "inactive", "draft", "submit", "completed"]),
  description: z.string().optional(),
  valid_period: z.number().min(1, "Valid period must be at least 1 day"),
  currency_id: z.string().optional(),
  products: z.object({
    add: z.array(z.object({ id: z.string() })),
    remove: z.array(z.object({ id: z.string() })),
  }),
});

export type PriceListTemplateFormValues = z.infer<typeof priceListTemplateFormSchema>;
