import { z } from "zod";

// ===== PR Detail Schema (reference from PR) =====
export const PoPrDetailSchema = z.object({
  pr_detail_id: z.string(),
  order_qty: z.coerce.number(),
  order_unit_id: z.string(),
  order_unit_name: z.string(),
  order_base_qty: z.coerce.number(),
  order_base_unit_id: z.string(),
  order_base_unit_name: z.string(),
});

// ===== PO Detail Item Schema =====
export const PoDetailItemSchema = z.object({
  id: z.string().optional(),
  sequence: z.coerce.number().int(),
  product_id: z.string(),
  product_name: z.string(),
  product_local_name: z.string().nullable().optional(),
  order_unit_id: z.string(),
  order_unit_name: z.string(),
  order_unit_conversion_factor: z.coerce.number(),
  order_qty: z.coerce.number(),
  base_unit_id: z.string(),
  base_unit_name: z.string(),
  base_qty: z.coerce.number(),
  price: z.coerce.number(),
  sub_total_price: z.coerce.number(),
  net_amount: z.coerce.number(),
  total_price: z.coerce.number(),
  tax_profile_id: z.string().nullable().optional(),
  tax_profile_name: z.string().nullable().optional(),
  tax_rate: z.coerce.number(),
  tax_amount: z.coerce.number(),
  is_tax_adjustment: z.boolean(),
  discount_rate: z.coerce.number(),
  discount_amount: z.coerce.number(),
  is_discount_adjustment: z.boolean(),
  is_foc: z.boolean(),
  pr_detail: z.array(PoPrDetailSchema).optional(),
  description: z.string().optional(),
  note: z.string().optional(),
});

// ===== Create PO Detail Schema (for add) =====
export const CreatePoDetailSchema = PoDetailItemSchema.omit({ id: true });

// ===== Update PO Detail Schema (requires id) =====
export const UpdatePoDetailSchema = PoDetailItemSchema.extend({
  id: z.string(),
});

// ===== Delete PO Detail Schema =====
export const DeletePoDetailSchema = z.object({
  id: z.string(),
});

// ===== PO Detail Form Schema (add/update/delete) =====
export const PoDetailFormSchema = z.object({
  add: z.array(CreatePoDetailSchema).optional(),
  update: z.array(UpdatePoDetailSchema).optional(),
  delete: z.array(DeletePoDetailSchema).optional(),
});

// ===== Base PO Schema =====
const BasePoSchema = z.object({
  vendor_id: z.string().min(1, "Vendor is required"),
  vendor_name: z.string().optional(),
  delivery_date: z.string(),
  currency_id: z.string().min(1, "Currency is required"),
  currency_name: z.string().optional(),
  exchange_rate: z.coerce.number(),
  description: z.string().optional(),
  order_date: z.string(),
  credit_term_id: z.string().optional(),
  credit_term_name: z.string().optional(),
  credit_term_value: z.coerce.number().optional(),
  buyer_id: z.string().optional(),
  buyer_name: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  remarks: z.string().optional(),
  note: z.string().optional(),
});

// ===== PO Form Schema (for react-hook-form) =====
export const PoFormSchema = BasePoSchema.extend({
  id: z.string().optional(),
  details: PoDetailFormSchema.optional(),
});

// ===== Create PO Schema (for API request) =====
export const CreatePoSchema = BasePoSchema.extend({
  details: z
    .object({
      add: z.array(CreatePoDetailSchema).optional(),
    })
    .optional(),
});

// ===== Update PO Schema (for API request) =====
export const UpdatePoSchema = BasePoSchema.extend({
  id: z.string(),
  details: PoDetailFormSchema.optional(),
});

// ===== Types =====
export type PoPrDetailDto = z.infer<typeof PoPrDetailSchema>;
export type PoDetailItemDto = z.infer<typeof PoDetailItemSchema>;
export type CreatePoDetailDto = z.infer<typeof CreatePoDetailSchema>;
export type UpdatePoDetailDto = z.infer<typeof UpdatePoDetailSchema>;
export type DeletePoDetailDto = z.infer<typeof DeletePoDetailSchema>;
export type PoDetailFormDto = z.infer<typeof PoDetailFormSchema>;
export type PoFormValues = z.infer<typeof PoFormSchema>;
export type CreatePoDto = z.infer<typeof CreatePoSchema>;
export type UpdatePoDto = z.infer<typeof UpdatePoSchema>;

// ===== Legacy exports (for backward compatibility) =====
export const PurchaseOrderPayloadSchema = CreatePoSchema;
export type PurchaseOrderPayload = CreatePoDto;
export type Detail = PoDetailItemDto;
export type PRDetail = PoPrDetailDto;

export const validatePayload = (data: unknown) => {
  try {
    const validatedData = CreatePoSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }
    return { success: false, errors: [] };
  }
};

export const validatePayloadSafe = (data: unknown) => {
  return CreatePoSchema.safeParse(data);
};
