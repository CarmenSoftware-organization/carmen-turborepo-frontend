import { z } from "zod";

// Base item type สำหรับใช้ซ้ำในหลายๆที่
const itemPrDetailBase = {
  id: z.string().uuid().optional(),
  location_id: z.string().uuid().optional(),
  location_name: z.string().optional(),
  product_id: z.string().uuid().optional(),
  product_name: z.string().optional(),
  vendor_id: z.string().uuid().optional(),
  vendor_name: z.string().optional(),
  price_list_id: z.string().optional().nullable(),
  pricelist_detail_id: z.string().optional().nullable(),
  description: z.string().optional(),

  requested_qty: z.number().optional(),
  requested_unit_id: z.string().uuid().optional(),
  requested_unit_name: z.string().optional(),
  requested_conversion_unit_factor: z.number().optional(),

  approved_qty: z.number().optional(),
  approved_unit_id: z.string().uuid().optional(),
  approved_unit_name: z.string().optional(),
  approved_conversion_unit_factor: z.number().optional(),

  approved_base_qty: z.number().optional(),
  requested_base_qty: z.number().optional(),
  inventory_unit_id: z.string().optional().nullable(),

  currency_id: z.string().uuid().optional(),
  currency_name: z.string().nullable().optional(),
  exchange_rate: z.number().optional(),
  price: z.number().optional(),
  total_price: z.number().optional(),
  foc: z.number().optional(),
  foc_unit_id: z.string().uuid().optional(),
  foc_unit_name: z.string().optional(),
  tax_type_inventory_id: z.string().optional().nullable(),
  tax_type: z.string().optional(),
};

// Schema สำหรับ get all purchase requests
export const getAllPrSchema = z.object({
  id: z.string().uuid(),
  department_name: z.string(),
  description: z.string().optional(),
  is_active: z.boolean(),
  pr_date: z.string(),
  pr_no: z.string(),
  pr_status: z.string(),
  pr_type: z.string().optional(),
  current_workflow_status: z.string(),
  workflow_name: z.string().optional(),
  purchase_request_detail: z
    .array(
      z.object({
        price: z.number(),
        total_price: z.number(),
      })
    )
    .optional(),
  total_amount: z.number(),
  requestor_name: z.string(),
});

// Schema for workflow history
export const workflowHistorySchema = z.object({
  stage: z.string(),
  user_id: z.string().uuid(),
  user_name: z.string(),
  status: z.string(),
  timestamp: z.string(),
});

// Schema สำหรับ item detail เมื่อดึงข้อมูลจาก API
export const itemPrDetailSchema = z.object(itemPrDetailBase);

// Schema ขยายเพิ่มเติมสำหรับ item ที่มีฟิลด์เพิ่มเติม
export const itemPrDetailExtendedSchema = itemPrDetailSchema.extend({
  id: z.string().uuid().optional(),
  exchange_rate_date: z.string().optional(),
  tax_rate: z.number().optional(),
  tax_amount: z.number().optional(),
  is_tax_adjustment: z.boolean().optional(),
  is_discount: z.boolean().optional(),
  discount_rate: z.number().optional(),
  discount_amount: z.number().optional(),
  is_discount_adjustment: z.boolean().optional(),
  is_active: z.boolean().optional(),
  note: z.string().optional(),
});

// Schema สำหรับ purchase request detail ที่จะใช้ใน form
export const purchaseRequestDetailFormSchema = z.object({
  add: z.array(z.object(itemPrDetailBase)).optional().default([]),
  update: z.array(z.object(itemPrDetailBase)).optional().default([]),
  delete: z.array(z.string().uuid()).optional().default([]),
});

// Schema สำหรับ purchase request เมื่อดึงข้อมูลจาก API
export const purchaseRequestByIdSchema = z.object({
  id: z.string().uuid(),
  pr_no: z.string(),
  pr_date: z.string(),
  pr_status: z.string(),
  requestor_id: z.string().uuid(),
  requestor_name: z.string(),
  department_id: z.string().uuid(),
  department_name: z.string(),
  is_active: z.boolean(),
  doc_version: z.string(),
  note: z.string().optional(),
  description: z.string().optional(),
  workflow_id: z.string().uuid().optional(),
  workflow_history: z.array(workflowHistorySchema).optional(),
  purchase_request_detail: z.array(itemPrDetailSchema),
  created_at: z.string().datetime().optional(),
  workflow_name: z.string().optional(),
});

// Schema สำหรับ purchase request ที่จะใช้ใน form (POST/PUT)
export const purchaseRequestFormSchema = z.object({
  id: z.string().uuid().optional(), // optional สำหรับกรณีสร้างใหม่
  pr_no: z.string().optional(), // อาจจะ generate โดย backend
  pr_date: z.string(),
  pr_status: z.string().optional(), // อาจจะถูกกำหนดโดย backend
  requestor_id: z.string().uuid(),
  requestor_name: z.string().optional(), // อาจจะดึงจาก backend จาก id
  department_id: z.string().uuid(),
  department_name: z.string().optional(), // อาจจะดึงจาก backend จาก id
  is_active: z.boolean().optional().default(true),
  doc_version: z.string().optional(),
  note: z.string().optional(),
  description: z.string().optional(),
  workflow_id: z.string().uuid().optional(),
  workflow_name: z.string().optional(),
  purchase_request_detail: purchaseRequestDetailFormSchema,
});

// Schema ขยายเพิ่มเติมสำหรับ purchase request ที่มีฟิลด์เพิ่มเติม
export const purchaseRequestExtendedSchema = purchaseRequestByIdSchema.extend({
  workflow_id: z.string().optional(),
  workflow_name: z.string().optional(),
  current_workflow_status: z.string().optional(),
});

// Type จาก Schema
export type GetAllPrDto = z.infer<typeof getAllPrSchema>;
export type WorkflowHistoryDto = z.infer<typeof workflowHistorySchema>;
export type ItemPrDetailDto = z.infer<typeof itemPrDetailSchema>;
export type ItemPrDetailExtendedDto = z.infer<
  typeof itemPrDetailExtendedSchema
>;
export type PurchaseRequestByIdDto = z.infer<typeof purchaseRequestByIdSchema>;
export type PurchaseRequestExtendedDto = z.infer<
  typeof purchaseRequestExtendedSchema
>;

// Type สำหรับ Form
export type PurchaseRequestDetailFormDto = z.infer<
  typeof purchaseRequestDetailFormSchema
>;
export type PurchaseRequestFormDto = z.infer<typeof purchaseRequestFormSchema>;

// Type สำหรับ item ที่จะเพิ่มใหม่
export type ItemPrDetailAddDto = Omit<ItemPrDetailDto, "id">;

// Type สำหรับ item ที่จะ update
export type ItemPrDetailUpdateDto = ItemPrDetailDto & { id: string };

// Type สำหรับการ initialize form
export type InitPurchaseRequestFormValues =
  Partial<PurchaseRequestExtendedDto> & {
    purchase_request_detail?: ItemPrDetailExtendedDto[];
  };

const wfHistorySchema = z.object({
  status: z.string(),
  timestamp: z.string(), // Consider z.coerce.date() if you want to parse as Date
  user: z.string(),
});

export const purchaseRequestDetailItemSchema = z.object({
  location_id: z.string().uuid(),
  product_id: z.string().uuid(),
  vendor_id: z.string().uuid(),
  price_list_id: z.string(),
  description: z.string(),
  requested_qty: z.number(),
  requested_unit_id: z.string().uuid(),
  approved_qty: z.number(),
  approved_unit_id: z.string().uuid(),
  approved_base_qty: z.number(),
  approved_conversion_rate: z.number(),
  requested_conversion_rate: z.number(),
  requested_base_qty: z.number(),
  currency_id: z.string().uuid(),
  currency_name: z.string().optional(),
  exchange_rate: z.number().transform((val) => parseFloat(val.toString())),
  exchange_rate_date: z.string().datetime(),
  price: z.number().transform((val) => parseFloat(val.toString())),
  total_price: z.number().transform((val) => parseFloat(val.toString())),
  foc: z.number(),
  foc_unit_id: z.string().uuid(),
  tax_type: z.string(),
  tax_rate: z.number().transform((val) => parseFloat(val.toString())),
  tax_amount: z.number().transform((val) => parseFloat(val.toString())),
  is_tax_adjustment: z.boolean(),
  is_discount: z.boolean(),
  discount_rate: z.number().transform((val) => parseFloat(val.toString())),
  discount_amount: z.number().transform((val) => parseFloat(val.toString())),
  is_discount_adjustment: z.boolean(),
  is_active: z.boolean(),
  delivery_date: z.string().datetime(),
  delivery_point_id: z.string().uuid(),
  note: z.string(),
});

export type PurchaseRequestDetailItemDto = z.infer<
  typeof purchaseRequestDetailItemSchema
>;

export const prSchemaV2 = z.object({
  pr_no: z.string().optional(),
  pr_date: z.string().datetime(),
  current_workflow_status: z.string().optional(),
  workflow_history: z.array(wfHistorySchema),
  pr_status: z.string().optional(),
  requestor_id: z.string().uuid(),
  department_id: z.string().uuid(),
  is_active: z.boolean(),
  workflow_id: z.string().uuid(),
  workflow_name: z.string().optional(),
  doc_version: z.number().transform((val) => parseFloat(val.toString())),
  description: z.string().optional(),
  note: z.string(),
  purchase_request_detail: z.object({
    add: z.array(purchaseRequestDetailItemSchema).optional(),
    update: z.array(purchaseRequestDetailItemSchema).optional(),
    delete: z
      .array(
        z.object({
          id: z.string().uuid(),
        })
      )
      .optional(),
  }),
});

export type PrSchemaV2Dto = z.infer<typeof prSchemaV2>;
