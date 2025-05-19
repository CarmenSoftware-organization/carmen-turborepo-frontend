import { z } from "zod";

export type GetAllPrDto = {
    id: string;
    department_name: string;
    description: string;
    is_active: boolean;
    pr_date: string;
    pr_no: string;
    pr_status: string;
    purchase_request_detail?: Array<{
        price: number;
        total_price: number;
    }>
    total_amount: number;
    requestor_name: string;
}

export const purchaseRequestSchema = z.object({
    pr_date: z.string().datetime().optional(),
    pr_no: z.string().optional(),
    note: z.string().optional(),
    description: z.string().optional(),
    workflow_id: z.string().uuid().optional(),
    workflow_obj: z.object({
        status: z.string().optional(),
        assigned_to: z.string().optional(),
    }),
    workflow_history: z
        .array(
            z.object({
                status: z.string(),
                timestamp: z.string(),
                user: z.string().uuid(),
            }),
        )
        .optional(),
    current_workflow_status: z.string().optional(),
    pr_status: z.string().optional(),
    requestor_id: z.string().uuid().optional(),
    requestor_name: z.string().optional(),
    department_id: z.string().uuid().optional(),
    department_name: z.string().optional(),
    is_active: z.boolean().optional(),
    doc_version: z.string().optional(),
    info: z.object({
        priority: z.string().optional(),
        budget_code: z.string().optional(),
    }),
    dimension: z.object({
        cost_center: z.string().optional(),
        project: z.string().optional(),
    }),
    created_at: z.string().datetime().optional(),
    created_by_id: z.string().uuid().optional(),
    updated_at: z.string().datetime().optional(),
    updated_by_id: z.string().uuid().optional(),
    purchase_request_detail: z.object({
        add: z.array(
            z.object({
                location_id: z.string().uuid().optional(),
                location_name: z.string().optional(),
                product_id: z.string().uuid().optional(),
                product_name: z.string().optional(),
                vendor_id: z.string().uuid().optional(),
                vendor_name: z.string().optional(),
                price_list_id: z.string().uuid().optional(),
                description: z.string().optional(),
                requested_qty: z.number().optional(),
                requested_unit_id: z.string().uuid().optional(),
                requested_unit_name: z.string().optional(),
                approved_qty: z.number().optional(),
                approved_unit_id: z.string().uuid().optional(),
                approved_unit_name: z.string().optional(),
                currency_id: z.string().uuid().optional(),
                exchange_rate: z.number().optional(),
                exchange_rate_date: z.string().optional(),
                price: z.number().optional(),
                total_price: z.number().optional(),
                foc: z.number().optional(),
                foc_unit_id: z.string().uuid().optional(),
                foc_unit_name: z.string().optional(),
                tax_type_inventory_id: z.string().uuid().optional(),
                tax_type: z.enum(["included", "none", "add"]).optional(),
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
                    specifications: z.string().optional(),
                }),
                dimension: z.object({
                    cost_center: z.string().optional(),
                    project: z.string().optional(),
                }),
            }),
        ),
    }),
})

export type PurchaseRequestPostDto = z.infer<typeof purchaseRequestSchema>;
