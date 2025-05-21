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
    price_list_id: z.string().uuid().optional().nullable(),
    description: z.string().optional(),

    requested_qty: z.number().optional(),
    requested_unit_id: z.string().uuid().optional(),
    requested_unit_name: z.string().optional(),

    approved_qty: z.number().optional(),
    approved_unit_id: z.string().uuid().optional(),
    approved_unit_name: z.string().optional(),

    approved_base_qty: z.number().optional(),
    approved_base_unit_id: z.string().uuid().optional(),
    approved_conversion_rate: z.number().optional(),
    approved_base_unit_name: z.string().optional().nullable(),

    requested_conversion_rate: z.number().optional(),
    requested_inventory_qty: z.number().optional(),
    requested_inventory_unit_id: z.string().uuid().optional(),
    requested_inventory_unit_name: z.string().optional(),

    currency_id: z.string().uuid().optional(),
    currency_name: z.string().nullable().optional(),
    exchange_rate: z.number().optional(),
    dimension: z.object({
        project: z.string().optional(),
        cost_center: z.string().optional()
    }),
    price: z.number().optional(),
    total_price: z.number().optional(),
    foc: z.number().optional(),
    foc_unit_id: z.string().uuid().optional(),
    foc_unit_name: z.string().optional(),
    tax_type_inventory_id: z.string().uuid().optional().nullable(),
    tax_type: z.string().optional()
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
    current_workflow_status: z.string(),
    purchase_request_detail: z.array(z.object({
        price: z.number(),
        total_price: z.number()
    })).optional(),
    total_amount: z.number(),
    requestor_name: z.string()
});

// Schema for workflow history
export const workflowHistorySchema = z.object({
    status: z.string(),
    timestamp: z.string(),
    user: z.string()
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
    info: z.object({
        specifications: z.string().optional()
    }).optional()
});

// Schema สำหรับ purchase request detail ที่จะใช้ใน form
export const purchaseRequestDetailFormSchema = z.object({
    add: z.array(z.object(itemPrDetailBase)).optional().default([]),
    update: z.array(z.object(itemPrDetailBase)).optional().default([]),
    delete: z.array(z.string().uuid()).optional().default([])
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
    info: z.object({
        priority: z.string(),
        budget_code: z.string()
    }),
    dimension: z.object({
        cost_center: z.string(),
        project: z.string()
    }),
    workflow_history: z.array(workflowHistorySchema).optional(),
    purchase_request_detail: z.array(itemPrDetailSchema)
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
    info: z.object({
        priority: z.string(),
        budget_code: z.string()
    }),
    dimension: z.object({
        cost_center: z.string(),
        project: z.string()
    }),
    purchase_request_detail: purchaseRequestDetailFormSchema
});

// Schema ขยายเพิ่มเติมสำหรับ purchase request ที่มีฟิลด์เพิ่มเติม
export const purchaseRequestExtendedSchema = purchaseRequestByIdSchema.extend({
    workflow_id: z.string().optional(),
    current_workflow_status: z.string().optional()
});

// Type จาก Schema
export type GetAllPrDto = z.infer<typeof getAllPrSchema>;
export type WorkflowHistoryDto = z.infer<typeof workflowHistorySchema>;
export type ItemPrDetailDto = z.infer<typeof itemPrDetailSchema>;
export type ItemPrDetailExtendedDto = z.infer<typeof itemPrDetailExtendedSchema>;
export type PurchaseRequestByIdDto = z.infer<typeof purchaseRequestByIdSchema>;
export type PurchaseRequestExtendedDto = z.infer<typeof purchaseRequestExtendedSchema>;

// Type สำหรับ Form
export type PurchaseRequestDetailFormDto = z.infer<typeof purchaseRequestDetailFormSchema>;
export type PurchaseRequestFormDto = z.infer<typeof purchaseRequestFormSchema>;

// Type สำหรับ item ที่จะเพิ่มใหม่
export type ItemPrDetailAddDto = Omit<ItemPrDetailDto, 'id'>;

// Type สำหรับ item ที่จะ update
export type ItemPrDetailUpdateDto = ItemPrDetailDto & { id: string };

// Type สำหรับการ initialize form
export type InitPurchaseRequestFormValues = Partial<PurchaseRequestExtendedDto> & {
    purchase_request_detail?: ItemPrDetailExtendedDto[];
};