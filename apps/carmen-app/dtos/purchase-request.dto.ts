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
    // EmbeddedPriceListSchema,
    RequestedQuantityAndUnitSchema,
    ApproveQuantityAndUnitSchema,
    PriceSchema,
    InfoSchema,
    FocSchema,
    ValidateSchema
} from "./embedded.dto";

// ========== Base Interfaces ==========
export interface AuditInfo {
    doc_version: string;
    created_at: string;
    created_by_id: string;
    updated_at: string;
    updated_by_id?: string;
    deleted_at?: string;
    deleted_by_id?: string;
}

export interface WorkflowInfo {
    workflow_id?: string;
    workflow_name: string;
    workflow_current_stage: string;
    workflow_previous_stage?: string | null;
    workflow_next_stage?: string | null;
    workflow_history?: any;
}

export interface RequestorInfo {
    requestor_id?: string;
    requestor_name: string;
    department_id?: string;
    department_name: string;
}

export interface BasePurchaseRequest {
    id: string;
    pr_no: string;
    pr_date: string;
    description: string;
    pr_status: string;
}

export interface WorkflowActionInfo {
    user_action: string | null;
    last_action: string;
    last_action_at_date: string | null;
    last_action_by_id: string | null;
    last_action_by_name: string | null;
}

// ========== Simplified Product & Location Interfaces ==========
export interface ProductInfo {
    product_id: string;
    product_name: string;
    product_local_name: string | null;
}

export interface LocationInfo {
    location_id: string;
    location_name: string;
    delivery_point_id: string;
    delivery_point_name: string;
    delivery_date: string;
}

export interface UnitInfo {
    inventory_unit_id: string;
    inventory_unit_name: string;
}

// ========== Vendor & Pricing Interfaces ==========
export interface VendorInfo {
    vendor_id: string;
    vendor_name: string;
}

export interface PriceListInfo {
    pricelist_detail_id: string | null;
    pricelist_no: string | null;
    pricelist_unit: string;
    pricelist_price: string;
}

export interface CurrencyInfo {
    currency_id: string;
    currency_name: string;
    exchange_rate: number;
    exchange_rate_date: string;
}

// ========== Quantity Interfaces ==========
export interface QuantityInfo {
    requested_qty: number;
    requested_unit_id: string;
    requested_unit_name: string;
    requested_unit_conversion_factor: number;
    requested_base_qty: number;
}

export interface ApprovedQuantityInfo {
    approved_qty: number;
    approved_unit_id: string;
    approved_unit_name: string;
    approved_unit_conversion_factor: number;
    approved_base_qty: number;
}

export interface FocQuantityInfo {
    foc_qty: number;
    foc_unit_id: string;
    foc_unit_name: string;
    foc_unit_conversion_factor: number;
    foc_base_qty: number;
}

// ========== Tax & Discount Interfaces ==========
export interface TaxInfo {
    tax_profile_id: string | null;
    tax_profile_name: string | null;
    tax_rate: number;
    tax_amount: number;
    base_tax_amount: number;
    is_tax_adjustment: boolean;
}

export interface DiscountInfo {
    discount_rate: number;
    discount_amount: number;
    base_discount_amount: number;
    is_discount_adjustment: boolean;
}

// ========== Price Calculation Interface ==========
export interface PriceCalculation {
    sub_total_price: number | null;
    net_amount: number;
    total_price: number;
    base_price: number | null;
    base_sub_total_price: number | null;
    base_net_amount: number;
    base_total_price: number;
}

export interface DetailCommonInfo {
    sequence_no: number;
    description: string;
    comment: string | null;
    history?: any;
    stages_status?: any;
    info?: any;
    dimension?: any;
}

// ========== Composed Interfaces ==========
export interface PurchaseRequestDetailDto {
    price: number;
    total_price: number;
}

export interface PurchaseRequestListDto extends
    BasePurchaseRequest,
    Pick<RequestorInfo, 'requestor_name' | 'department_name'>,
    Pick<WorkflowInfo, 'workflow_name' | 'workflow_current_stage'> {
    purchase_request_detail: PurchaseRequestDetailDto[];
    total_amount: number;
}

export interface OnHandOnOrder {
    on_hand_qty: number;
    on_order_qty: number;
    re_order_qty: number;
    re_stock_qty: number;
}

export interface PurchaseRequestDetail extends
    Pick<BasePurchaseRequest, 'id'>,
    ProductInfo,
    LocationInfo,
    UnitInfo,
    VendorInfo,
    PriceListInfo,
    CurrencyInfo,
    QuantityInfo,
    ApprovedQuantityInfo,
    FocQuantityInfo,
    TaxInfo,
    DiscountInfo,
    PriceCalculation,
    DetailCommonInfo,
    OnHandOnOrder,
    AuditInfo {
    purchase_request_id: string;
}


export interface PurchaseRequestByIdDto extends
    BasePurchaseRequest,
    WorkflowInfo,
    WorkflowActionInfo,
    RequestorInfo,
    AuditInfo {
    note: string;
    info?: any;
    dimension?: any;
    purchase_request_detail: PurchaseRequestDetail[];
}

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
        delivery_date: ValidateSchema.shape.date.optional(),
    }))
    .merge(EmbeddedVendorSchema)
    .merge(RequestedQuantityAndUnitSchema)
    .merge(PriceSchema)
    .merge(EmbeddedTaxSchema.partial())
    .merge(EmbeddedDiscountSchema)
    .merge(EmbeddedCurrencySchema)
    .merge(InfoSchema);

export enum STAGE_ROLE {
    CREATE = "create",
    APPROVE = "approve",
    PURCHASE = "purchase",
    REJECT = "reject",
    SEND_BACK = "send_back",
};

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
})

export type CreatePrDto = z.infer<typeof CreatePrSchema>;

export const CreatePurchaseRequestSchema = z.object({
    description: z.string().optional().nullable(), // Fixed typo: desceiption -> description
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

export type PurchaseRequestCreateFormDto = z.infer<typeof CreatePurchaseRequestSchema>;

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
    delivery_date: ValidateSchema.shape.date.optional(),
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
    exchange_rate_date: ValidateSchema.shape.date.optional(),
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

export type PurchaseRequestUpdateFormDto = z.infer<typeof UpdatePurchaseRequestSchema>;

// ========== Additional Type Exports ==========
export type CreatePurchaseRequestDetailDto = z.infer<typeof CreatePurchaseRequestDetailSchema>;
export type UpdatePurchaseRequestDetailDto = z.infer<typeof UpdatePurchaseRequestDetailSchema>;

export type ActionPr = "save" | "approve" | "reject" | "review" | 'submit' | 'purchase' | 'send_back';
