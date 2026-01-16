import { z } from "zod";

// Schema สำหรับ PR Detail
const PRDetailSchema = z.object({
  pr_detail_id: z.string().uuid(),
  order_qty: z.number().positive(),
  order_unit_id: z.string().uuid(),
  order_unit_name: z.string(),
  order_base_qty: z.number().positive(),
  order_base_unit_id: z.string().uuid(),
  order_base_unit_name: z.string(),
});

const DetailSchema = z.object({
  sequence: z.number().int().positive(),
  product_id: z.string().uuid(),
  product_name: z.string(),
  product_local_name: z.string(),
  order_unit_id: z.string().uuid(),
  order_unit_name: z.string(),
  order_unit_conversion_factor: z.number().positive(),
  order_qty: z.number().positive(),
  base_unit_id: z.string().uuid(),
  base_unit_name: z.string(),
  base_qty: z.number().positive(),
  price: z.number().min(0),
  sub_total_price: z.number().min(0),
  net_amount: z.number().min(0),
  total_price: z.number().min(0),
  tax_profile_id: z.string().uuid(),
  tax_profile_name: z.string(),
  tax_rate: z.number().min(0).max(100),
  tax_amount: z.number().min(0),
  is_tax_adjustment: z.boolean(),
  discount_rate: z.number().min(0).max(100),
  discount_amount: z.number().min(0),
  is_discount_adjustment: z.boolean(),
  is_foc: z.boolean(),
  pr_detail: z.array(PRDetailSchema),
  description: z.string(),
  note: z.string(),
});

// Schema หลัก
export const PurchaseOrderPayloadSchema = z.object({
  vendor_id: z.string().uuid(),
  vendor_name: z.string().min(1),
  delivery_date: z.string().datetime(),
  currency_id: z.string().uuid(),
  currency_name: z.string().min(1),
  exchange_rate: z.number().positive(),
  description: z.string(),
  order_date: z.string().datetime(),
  credit_term_id: z.string().uuid(),
  credit_term_name: z.string().min(1),
  credit_term_value: z.number().int().positive(),
  buyer_id: z.string().uuid(),
  buyer_name: z.string(),
  email: z.string(),
  remarks: z.string(),
  note: z.string(),
  details: z.array(DetailSchema).min(1),
});

// Infer TypeScript types
export type PurchaseOrderPayload = z.infer<typeof PurchaseOrderPayloadSchema>;
export type Detail = z.infer<typeof DetailSchema>;
export type PRDetail = z.infer<typeof PRDetailSchema>;

export const validatePayload = (data: unknown) => {
  try {
    const validatedData = PurchaseOrderPayloadSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }
    return { success: false, errors: [] };
  }
};

export const validatePayloadSafe = (data: unknown) => {
  return PurchaseOrderPayloadSchema.safeParse(data);
};
