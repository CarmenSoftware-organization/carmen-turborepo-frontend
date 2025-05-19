import { z } from "zod";

export type GetAllPrDto = {
    id: string;
    department_name: string;
    description: string;
    is_active: boolean;
    pr_date: string;
    pr_no: string;
    pr_status: string;
    current_workflow_status: string;
    purchase_request_detail?: Array<{
        price: number;
        total_price: number;
    }>
    total_amount: number;
    requestor_name: string;
};

export type PurchaseRequestByIdDto = {
    id: string;
    pr_no: string;
    pr_date: string;
    pr_status: string;
    requestor_id: string;
    requestor_name: string;
    department_id: string;
    department_name: string;
    is_active: boolean;
    doc_version: string;
    note?: string;
    description?: string;
    info: {
        priority: string;
        budget_code: string;
    };
    dimension: {
        cost_center: string;
        project: string;
    };
    workflow_history?: {
        status: string;
        timestamp: string;
        user: string;
    }[];
    purchase_request_detail: PurchaseRequestDetail[];
};

export type PurchaseRequestDetail = {
    location_id: string;
    location_name: string;
    product_id: string;
    product_name: string;
    vendor_id: string;
    vendor_name: string;
    price_list_id: string;
    description: string;
    requested_qty: number;
    requested_unit_id: string;
    requested_unit_name: string;
    approved_qty: number;
    approved_unit_id: string;
    approved_unit_name: string;
    currency_id: string;
    exchange_rate: number;
    dimension: {
        project: string;
        cost_center: string;
    };
    price: number;
    total_price: number;
    foc: number;
    foc_unit_id: string;
    foc_unit_name: string;
    tax_type_inventory_id: string;
    tax_type: string;
};


export const purchaseRequestSchema = z.object({
    pr_date: z.string().datetime(),
    workflow_id: z.string().uuid(),
    current_workflow_status: z.string(),
    pr_status: z.string(),
    requestor_id: z.string().uuid(),
    department_id: z.string().uuid(),
    is_active: z.boolean(),
    doc_version: z.number(),
    note: z.string().optional(),
    description: z.string().optional(),
    info: z.object({
        priority: z.string(),
        budget_code: z.string(),
    }),
    dimension: z.object({
        cost_center: z.string(),
        project: z.string(),
    }),
    purchase_request_detail: z.object({
        add: z.array(
            z.object({
                location_id: z.string().uuid(),
                product_id: z.string().uuid(),
                vendor_id: z.string().uuid(),
                price_list_id: z.string().uuid(),
                description: z.string(),
                requested_qty: z.number(),
                requested_unit_id: z.string().uuid(),
                approved_qty: z.number(),
                approved_unit_id: z.string().uuid(),
                currency_id: z.string().uuid(),
                exchange_rate: z.number(),
                exchange_rate_date: z.string().datetime(),
                price: z.number(),
                total_price: z.number(),
                foc: z.number(),
                foc_unit_id: z.string().uuid(),
                tax_type_inventory_id: z.string().uuid(),
                tax_type: z.string(),
                tax_rate: z.number(),
                tax_amount: z.number(),
                is_tax_adjustment: z.boolean(),
                is_discount: z.boolean(),
                discount_rate: z.number(),
                discount_amount: z.number(),
                is_discount_adjustment: z.boolean(),
                is_active: z.boolean(),
                note: z.string(),
                info: z.object({
                    specifications: z.string(),
                }),
                dimension: z.object({
                    cost_center: z.string(),
                    project: z.string(),
                }),
            })
        ),
    }),
});


export type PurchaseRequestPostDto = z.infer<typeof purchaseRequestSchema>;
