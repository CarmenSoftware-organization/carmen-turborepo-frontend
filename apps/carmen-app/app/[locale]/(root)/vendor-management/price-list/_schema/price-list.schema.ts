import { z } from "zod";

const dateRangeSchema = z.object({
  from: z.string().min(1, "Start date is required"),
  to: z.string().min(1, "End date is required"),
});

export const priceListSchema = z.object({
  no: z.string().optional(),
  name: z.string(),
  vendorId: z.string().min(1, "Vendor is required"),
  rfpId: z.string().optional(),
  description: z.string().optional(),
  note: z.string().optional(),
  status: z.enum(["active", "draft", "submit", "inactive"]),
  currencyId: z.string().min(1, "Currency is required"),
  effectivePeriod: dateRangeSchema,
  pricelist_detail: z
    .array(
      z.object({
        sequence_no: z.number().optional(),
        product_id: z.string().min(1, "Product is required"),
        unit_id: z.string().optional(),
        tax_profile_id: z.string().optional(),
        tax_rate: z.number().optional(),
        moq_qty: z.number().min(0, "MOQ must be greater than or equal to 0"),
        price: z.number().min(0, "Price must be greater than or equal to 0"),
        lead_time_days: z.number().min(0).optional(),
      })
    )
    .optional(),
});

export type PriceListFormData = z.infer<typeof priceListSchema>;
