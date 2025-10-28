/**
 * Purchase Request Form Schemas - Zod validation schemas
 * Pure TypeScript interfaces moved to: dtos/purchase-request.dto.ts
 */

import { z } from "zod";
import {
    EmbeddedDepartmentSchema,
    EmbeddedLocationSchema,
    EmbeddedProductSchema,
    EmbeddedInventoryUnitSchema,
    EmbeddedWorkflowSchema,
    EmbeddedVendorSchema,
    EmbeddedCurrencySchema,
    EmbeddedDiscountSchema,
    EmbeddedTaxSchema,
    RequestedQuantityAndUnitSchema,
    ApproveQuantityAndUnitSchema,
    PriceSchema,
    InfoSchema,
    ValidateSchema
} from "@/dtos/embedded.dto";

// ========== Zod Schemas with Shared Components ==========

export const CreatePurchaseRequestDetailSchema = z.object({
    id: z.string().optional(),
    description: z.string().optional().nullable(),
    comment: z.string().optional().nullable(),
    sequence_no: z.number().optional(),
})
    .merge(EmbeddedProductSchema)
    .merge(EmbeddedInventoryUnitSchema)
    .merge(EmbeddedLocationSchema.extend({
        delivery_point_id: ValidateSchema.shape.uuid.optional(),
        delivery_date: z.string().datetime().optional(),
    }))
    .merge(EmbeddedVendorSchema)
    .merge(RequestedQuantityAndUnitSchema)
    .merge(PriceSchema)
    .merge(EmbeddedTaxSchema.partial())
    .merge(EmbeddedDiscountSchema)
    .merge(EmbeddedCurrencySchema.omit({ exchange_rate_date: true }).extend({
        exchange_rate_date: z.string().datetime().optional(),
    }))
    .merge(InfoSchema);

export enum STAGE_ROLE {
    CREATE = "create",
    APPROVE = "approve",
    PURCHASE = "purchase",
    REJECT = "reject",
    SEND_BACK = "send_back",
}

export const StageRoleSchema = z.nativeEnum(STAGE_ROLE);

export const CreatePrSchema = z.object({
    state_role: StageRoleSchema,
    body: z.object({
        pr_date: z.string(),
        requestor_id: z.string().uuid(),
        department_id: z.string().uuid(),
        workflow_id: z.string().uuid(),
        description: z.string().optional().nullable(),
        note: z.string().optional().nullable(),
    })
        .extend({
            purchase_request_detail: z.object({
                add: z.array(CreatePurchaseRequestDetailSchema).optional(),
                update: z.array(CreatePurchaseRequestDetailSchema).optional(),
                remove: z.array(z.object({ id: z.string().uuid() })).optional(),
            }).optional()
        })
}).superRefine((data, ctx) => {
    // Validate that items in add array have required fields filled
    const addItems = data.body.purchase_request_detail?.add;
    console.log('Validating add items:', addItems);
    if (addItems && addItems.length > 0) {
        addItems.forEach((item, index) => {
            console.log(`Item ${index}:`, item);
            if (!item.location_id) {
                console.log(`Item ${index} missing location_id`);
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Location is required",
                    path: ['body', 'purchase_request_detail', 'add', index, 'location_id']
                });
            }
            if (!item.product_id) {
                console.log(`Item ${index} missing product_id`);
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Product is required",
                    path: ['body', 'purchase_request_detail', 'add', index, 'product_id']
                });
            }
            if (item.requested_qty === undefined || item.requested_qty === null) {
                console.log(`Item ${index} missing requested_qty:`, item.requested_qty);
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Quantity is required",
                    path: ['body', 'purchase_request_detail', 'add', index, 'requested_qty']
                });
            } else if (typeof item.requested_qty !== 'number' || item.requested_qty < 0) {
                console.log(`Item ${index} invalid requested_qty:`, item.requested_qty);
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Quantity must be a valid number and not negative",
                    path: ['body', 'purchase_request_detail', 'add', index, 'requested_qty']
                });
            }
            if (!item.requested_unit_id) {
                console.log(`Item ${index} missing requested_unit_id`);
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Unit is required",
                    path: ['body', 'purchase_request_detail', 'add', index, 'requested_unit_id']
                });
            }
        });
    }
});

export const CreatePurchaseRequestSchema = z.object({
    description: z.string().optional().nullable(),
    requestor_id: z.string().uuid().optional(),
    pr_date: z.string(),
})
    .merge(EmbeddedWorkflowSchema)
    .merge(EmbeddedDepartmentSchema)
    .merge(InfoSchema)
    .extend({
        purchase_request_detail: z.object({
            add: z.array(CreatePurchaseRequestDetailSchema).optional(),
        }).optional()
    });

// แก้ไข: สร้าง UpdatePurchaseRequestDetailSchema แยกแทนการ extend เพื่อลด type complexity
const UpdatePurchaseRequestDetailSchema = z.object({
    id: z.string().uuid(),
    description: z.string().optional().nullable(),
    comment: z.string().optional().nullable(),
    sequence_no: z.number().optional(),
    // จาก EmbeddedProductSchema
    product_id: ValidateSchema.shape.uuid.optional(),
    // จาก EmbeddedInventoryUnitSchema
    inventory_unit_id: ValidateSchema.shape.uuid.optional(),
    // จาก EmbeddedLocationSchema + delivery point
    location_id: ValidateSchema.shape.uuid.optional(),
    delivery_point_id: ValidateSchema.shape.uuid.optional(),
    delivery_date: z.string().datetime().optional(),
    // จาก EmbeddedVendorSchema
    vendor_id: ValidateSchema.shape.uuid.optional(),
    // จาก RequestedQuantityAndUnitSchema
    requested_qty: ValidateSchema.shape.quantity.optional(),
    requested_unit_id: ValidateSchema.shape.uuid.optional(),
    requested_unit_conversion_factor: ValidateSchema.shape.price.optional(),
    // จาก ApproveQuantityAndUnitSchema
    approved_qty: ValidateSchema.shape.quantity.optional(),
    approved_unit_id: ValidateSchema.shape.uuid.optional(),
    approved_base_qty: ValidateSchema.shape.quantity.optional(),
    approved_unit_conversion_factor: ValidateSchema.shape.price.optional(),
    // จาก PriceSchema
    total_price: ValidateSchema.shape.price.optional(),
    sub_total_price: ValidateSchema.shape.price.optional(),
    net_amount: ValidateSchema.shape.price.optional(),
    price: ValidateSchema.shape.price.optional(),
    base_sub_total_price: ValidateSchema.shape.price.optional(),
    base_total_price: ValidateSchema.shape.price.optional(),
    base_net_amount: ValidateSchema.shape.price.optional(),
    base_price: ValidateSchema.shape.price.optional(),
    // จาก EmbeddedTaxSchema (partial)
    tax_profile_id: z.string().uuid().optional(),
    tax_profile_name: z.string().optional(),
    tax_rate: ValidateSchema.shape.price.optional(),
    tax_amount: ValidateSchema.shape.price.optional(),
    is_tax_adjustment: z.boolean().optional(),
    base_tax_amount: ValidateSchema.shape.price.optional(),
    total_amount: ValidateSchema.shape.price.optional(),
    // จาก EmbeddedDiscountSchema
    discount_rate: ValidateSchema.shape.price.optional(),
    discount_amount: ValidateSchema.shape.price.optional(),
    is_discount_adjustment: z.boolean().optional(),
    base_discount_amount: ValidateSchema.shape.price.optional(),
    // จาก EmbeddedCurrencySchema
    currency_id: z.string().uuid().optional(),
    exchange_rate: z.number().optional(),
    exchange_rate_date: z.string().datetime().optional(),
    // จาก InfoSchema
    note: z.string().optional().nullable(),
    info: z.any().optional().nullable(),
    dimension: z.any().optional().nullable(),
    // จาก FocSchema (partial)
    foc_qty: ValidateSchema.shape.quantity.optional(),
    foc_unit_id: z.string().uuid().optional(),
    foc_unit_conversion_rate: ValidateSchema.shape.price.optional(),
});

export const UpdatePurchaseRequestSchema = CreatePurchaseRequestSchema
    .extend({
        doc_version: z.number().optional().readonly(),
        purchase_request_detail: z.object({
            add: z.array(CreatePurchaseRequestDetailSchema).optional(),
            update: z.array(UpdatePurchaseRequestDetailSchema).optional(),
            remove: z.array(z.object({ id: z.string().uuid() })).optional(),
        }).optional(),
    });
