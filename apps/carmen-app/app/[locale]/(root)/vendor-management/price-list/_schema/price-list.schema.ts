import { z } from "zod";

export const priceListSchema = z.object({
  no: z.string().min(1, "Price list number is required"),
  vendorId: z.string().min(1, "Vendor is required"),
  rfpId: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["active", "draft", "submit", "inactive"]),
  currencyId: z.string().min(1, "Currency is required"),
  effectivePeriod: z.string().min(1, "Effective period is required"),
  products: z
    .array(
      z.object({
        id: z.string(),
        moqs: z.array(
          z.object({
            minQuantity: z.number().min(0),
            unit: z.string(),
            price: z.number().min(0),
            leadTimeDays: z.number().min(0),
          })
        ),
      })
    )
    .optional(),
});

export type PriceListFormData = z.infer<typeof priceListSchema>;
