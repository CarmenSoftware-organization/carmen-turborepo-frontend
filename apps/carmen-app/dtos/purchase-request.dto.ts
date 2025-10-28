/**
 * Purchase Request DTO - Pure TypeScript interfaces
 * Zod schemas moved to: app/.../purchase-request/_schemas/purchase-request-form.schema.ts
 */

// Import STAGE_ROLE enum for use in interfaces
import { STAGE_ROLE } from "@/app/[locale]/(root)/procurement/purchase-request/_schemas/purchase-request-form.schema";

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

// ========== Form DTOs ==========
export interface CreatePurchaseRequestDetailDto {
    id?: string;
    description?: string | null;
    comment?: string | null;
    sequence_no?: number;
    product_id?: string;
    inventory_unit_id?: string;
    location_id?: string;
    delivery_point_id?: string;
    delivery_date?: string;
    vendor_id?: string;
    requested_qty?: number;
    requested_unit_id?: string;
    requested_unit_conversion_factor?: number;
    price?: number;
    tax_profile_id?: string;
    tax_profile_name?: string;
    tax_rate?: number;
    tax_amount?: number;
    is_tax_adjustment?: boolean;
    discount_rate?: number;
    discount_amount?: number;
    is_discount_adjustment?: boolean;
    currency_id?: string;
    exchange_rate?: number;
    exchange_rate_date?: string;
    note?: string | null;
    info?: any | null;
    dimension?: any | null;
}

export interface UpdatePurchaseRequestDetailDto extends CreatePurchaseRequestDetailDto {
    id: string;
    approved_qty?: number;
    approved_unit_id?: string;
    approved_base_qty?: number;
    approved_unit_conversion_factor?: number;
    total_price?: number;
    sub_total_price?: number;
    net_amount?: number;
    base_sub_total_price?: number;
    base_total_price?: number;
    base_net_amount?: number;
    base_price?: number;
    base_tax_amount?: number;
    total_amount?: number;
    base_discount_amount?: number;
    foc_qty?: number;
    foc_unit_id?: string;
    foc_unit_conversion_rate?: number;
}

export interface PurchaseRequestCreateFormDto {
    description?: string | null;
    requestor_id?: string;
    pr_date: string;
    workflow_id?: string;
    department_id?: string;
    info?: any | null;
    dimension?: any | null;
    purchase_request_detail?: {
        add?: CreatePurchaseRequestDetailDto[];
    };
}

export interface PurchaseRequestUpdateFormDto extends PurchaseRequestCreateFormDto {
    doc_version?: number;
    purchase_request_detail?: {
        add?: CreatePurchaseRequestDetailDto[];
        update?: UpdatePurchaseRequestDetailDto[];
        remove?: { id: string }[];
    };
}

export interface CreatePrDto {
    state_role: STAGE_ROLE;
    body: {
        pr_date: string;
        requestor_id: string;
        department_id: string;
        workflow_id: string;
        description?: string | null;
        note?: string | null;
        purchase_request_detail?: {
            add?: CreatePurchaseRequestDetailDto[];
            update?: CreatePurchaseRequestDetailDto[];
            remove?: { id: string }[];
        };
    };
}

// ========== Action Types ==========
export type ActionPr = "save" | "approve" | "reject" | "review" | 'submit' | 'purchase' | 'send_back';

// Re-export Zod schemas for backward compatibility
export {
    CreatePurchaseRequestDetailSchema,
    STAGE_ROLE,
    StageRoleSchema,
    CreatePrSchema,
    CreatePurchaseRequestSchema,
    UpdatePurchaseRequestSchema,
} from "@/app/[locale]/(root)/procurement/purchase-request/_schemas/purchase-request-form.schema";
