import { z } from "zod";

const dateRangeSchema = z.object({
  from: z.string().min(1, "Start date is required"),
  to: z.string().min(1, "End date is required"),
});

export const priceListSchema = z.object({
  no: z.string().min(1, "Price list number is required"),
  vendorId: z.string().min(1, "Vendor is required"),
  rfpId: z.string().optional(),
  description: z.string().optional(),
  note: z.string().optional(),
  status: z.enum(["active", "draft", "submit", "inactive"]),
  currencyId: z.string().min(1, "Currency is required"),
  effectivePeriod: dateRangeSchema,
  products: z
    .array(
      z.object({
        id: z.string(), // This will act as product_id
        code: z.string().optional(),
        name: z.string().optional(),
        moqs: z.array(
          z.object({
            minQuantity: z.number().min(0),
            unit: z.string().optional(), // Display unit name
            unitId: z.string().optional(), // ID for payload
            price: z.number().min(0),
            leadTimeDays: z.number().min(0),
            taxProfileId: z.string().optional(),
            taxRate: z.number().optional(),
          })
        ),
      })
    )
    .optional(),
});

export type PriceListFormData = z.infer<typeof priceListSchema>;
