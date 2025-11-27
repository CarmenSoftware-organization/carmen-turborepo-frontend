import { z } from "zod";

// ============================================
// Enums
// ============================================
export const PriceTemplateStatusEnum = z.enum(["draft", "active", "inactive"]);
export type PriceTemplateStatus = z.infer<typeof PriceTemplateStatusEnum>;

// ============================================
// Base Schemas
// ============================================

// Currency
export const CurrencySchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(3).max(3),
});
export type Currency = z.infer<typeof CurrencySchema>;

// Default Order Unit
export const DefaultOrderSchema = z.object({
  unit_id: z.string().uuid(),
  unit_name: z.string().min(1),
});
export type DefaultOrder = z.infer<typeof DefaultOrderSchema>;

// Minimum Order Quantity (MOQ)
export const MOQItemSchema = z.object({
  unit_id: z.string().uuid(),
  unit_name: z.string().min(1),
  note: z.string().optional(),
  qty: z.number().int().positive(),
});
export type MOQItem = z.infer<typeof MOQItemSchema>;

// ============================================
// Product Schemas
// ============================================

// Product in GET response (full details)
export const PriceTemplateProductSchema = z.object({
  id: z.string().uuid(),
  product_id: z.string(),
  name: z.string().min(1),
  code: z.string().min(1),
  default_order: DefaultOrderSchema,
  moq: z.array(MOQItemSchema),
});
export type PriceTemplateProduct = z.infer<typeof PriceTemplateProductSchema>;

// Product for POST/PATCH add operation
export const ProductAddInputSchema = z.object({
  product_id: z.string(),
  default_order: DefaultOrderSchema.optional(),
  moq: z.array(MOQItemSchema).optional(),
});
export type ProductAddInput = z.infer<typeof ProductAddInputSchema>;

// Product for PATCH update operation
export const ProductUpdateInputSchema = z.object({
  product_id: z.string().uuid(),
  default_order: DefaultOrderSchema.optional(),
  moq: z.array(MOQItemSchema).optional(),
});
export type ProductUpdateInput = z.infer<typeof ProductUpdateInputSchema>;

// Product for PATCH remove operation
export const ProductRemoveInputSchema = z.object({
  id: z.string().uuid(),
});
export type ProductRemoveInput = z.infer<typeof ProductRemoveInputSchema>;

// Products modification object for PATCH
export const ProductsModificationSchema = z.object({
  add: z.array(ProductAddInputSchema).optional(),
  update: z.array(ProductUpdateInputSchema).optional(),
  remove: z.array(ProductRemoveInputSchema).optional(),
});
export type ProductsModification = z.infer<typeof ProductsModificationSchema>;

// ============================================
// GET Response Schema
// ============================================
export const PriceTemplateResponseSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  status: PriceTemplateStatusEnum,
  description: z.string().optional(),
  valid_period: z.number().int().positive(),
  create_date: z.string().datetime(),
  update_date: z.string().datetime(),
  vendor_instruction: z.string().optional(),
  currency: CurrencySchema,
  products: z.array(PriceTemplateProductSchema),
});
export type PriceTemplateResponse = z.infer<typeof PriceTemplateResponseSchema>;

// ============================================
// POST Request Schema
// ============================================
export const CreatePriceTemplateRequestSchema = z.object({
  name: z.string().min(1).max(255),
  status: PriceTemplateStatusEnum.default("draft"),
  description: z.string().max(1000).optional(),
  valid_period: z.number().int().positive().max(365),
  vendor_instruction: z.string().max(2000).optional(),
  currency_id: z.string().uuid(),
  products: z.object({
    add: z.array(ProductAddInputSchema),
  }),
});
export type CreatePriceTemplateRequest = z.infer<typeof CreatePriceTemplateRequestSchema>;

// POST Response
export const CreatePriceTemplateResponseSchema = z.object({
  id: z.string().uuid(),
});
export type CreatePriceTemplateResponse = z.infer<typeof CreatePriceTemplateResponseSchema>;

// ============================================
// PATCH Request Schema
// ============================================
export const UpdatePriceTemplateRequestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  status: PriceTemplateStatusEnum.optional(),
  description: z.string().max(1000).optional(),
  valid_period: z.number().int().positive().max(365).optional(),
  vendor_instruction: z.string().max(2000).optional(),
  currency_id: z.string().uuid().optional(),
  products: ProductsModificationSchema.optional(),
});
export type UpdatePriceTemplateRequest = z.infer<typeof UpdatePriceTemplateRequestSchema>;

// ============================================
// DELETE Response Schema
// ============================================
export const DeletePriceTemplateResponseSchema = z.boolean();
export type DeletePriceTemplateResponse = z.infer<typeof DeletePriceTemplateResponseSchema>;

// ============================================
// Path Parameters
// ============================================
export const PriceTemplateParamsSchema = z.object({
  id: z.string().uuid(),
});
export type PriceTemplateParams = z.infer<typeof PriceTemplateParamsSchema>;

// ============================================
// API Summary Types (for documentation)
// ============================================
export type PriceTemplateAPI = {
  // GET /api/price-template/:id
  get: {
    params: PriceTemplateParams;
    response: PriceTemplateResponse;
  };
  // POST /api/price-template
  create: {
    request: CreatePriceTemplateRequest;
    response: CreatePriceTemplateResponse;
  };
  // PATCH /api/price-template/:id
  update: {
    params: PriceTemplateParams;
    request: UpdatePriceTemplateRequest;
    response: PriceTemplateResponse;
  };
  // DELETE /api/price-template/:id
  delete: {
    params: PriceTemplateParams;
    response: DeletePriceTemplateResponse;
  };
};
