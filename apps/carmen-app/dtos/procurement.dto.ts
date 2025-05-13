import { z } from "zod";

export interface PendingApprovalDto {
    id: string;
    title: string;
    no_unit: number;
    price: number;
    requestor: string;
    department: string;
    status: string;
}

export interface FlaggedDto extends PendingApprovalDto {
    flagged_reason: string;
}

export interface RecentApprovalDto extends PendingApprovalDto {
    status: string;
    date_approved: string;
}

export const prFormSchema = z.object({
    id: z.string().optional(),
    pr_no: z.string(),
    title: z.string().min(1, "Title is required"),
    status: z.string().optional(),
    date_created: z.string().optional(),
    type: z.string().min(1, "Type is required"),
    description: z.string().min(1, "Description is required"),
    requestor: z.string().min(1, "Requestor is required"),
    department: z.string().min(1, "Department is required"),
    amount: z.number().min(0, "Amount must be greater than 0"),
    delivery_date: z.string().optional(),
    workflow_status: z.string().optional(),
});

export type PurchaseRequestDto = z.infer<typeof prFormSchema>;

export const ItemPrSchema = z.object({
    id: z.string().optional(),
    location: z.string().min(1, "Location is required"),
    product_name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Description is required"),
    order_unit: z.string().min(1, "Order unit is required"),
    inv_unit: z.string().min(1, "Inventory unit is required"),
    request_qty: z.number().min(1, "Request quantity must be greater than 0"),
    on_order_qty: z.number().min(0, "On order quantity must be 0 or greater"),
    approved_qty: z.number().min(0, "Approved quantity must be 0 or greater"),
    on_hand_qty: z.number().min(0, "On hand quantity must be 0 or greater"),
    base_currency: z.string().min(1, "Base currency is required"),
    price: z.number().min(0, "Price must be 0 or greater"),
    total_price: z.number().min(0, "Total price must be 0 or greater"),
    status: z.string().optional(),
});

export type ItemDetailPrDto = z.infer<typeof ItemPrSchema>;

export interface BudgetPrDto {
    id: string;
    location: string;
    category: string;
    total_budget: number;
    dept_head_approval: number;
    po_approval: number;
    actual_gl: number;
    available_budget: number;
    current_budget: number;
}
export interface WorkflowPrDto {
    id: string;
    stage: string;
    approver: string;
    status: string;
    date_approved: string;
    comments: string;
}

export const poFormSchema = z.object({
    vendor: z.string().min(1, "Vendor is required"),
    status: z.string(),
    date_created: z.string(),
    delivery_date: z.string(),
    po_number: z.string(),
    currency: z.string(),
    net_amount: z.number(),
    tax_amount: z.number(),
    amount: z.number(),
});

export type PoFormDto = z.infer<typeof poFormSchema>;

export interface PurchaseOrderlDto {
    id: string;
    vendor: string;
    status: string;
    date_created: string;
    delivery_date: string;
    po_number: string;
    currency: string;
    net_amount: number;
    tax_amount: number;
    amount: number;
};


export interface AttachmentPrDto {
    id: string;
    name: string;
    type: string;
    size: string;
    uploadedBy: string;
    uploadedAt: string;
};

export interface ActivityPrDto {
    id: string;
    timestamp: string;
    action: {
        label: string;
        variant: "default" | "success" | "warning" | "destructive";
    };
    user: string;
    details: string;
}


export interface GoodsReceivedNoteListDto {
    id: string;
    name: string;
    grn_no: string | null;
    invoice_no: string | null;
    invoice_date: string | null;
    description: string | null;
    doc_status: string;
    doc_type: string;
    vendor_id: string | null;
    vendor_name: string | null;
    currency_id: string;
    currency_name: string;
    currency_rate: string;
    workflow_id: string | null;
    workflow_obj: string;
    workflow_history: string | null;
    current_workflow_status: string | null;
    is_consignment: boolean;
    is_cash: boolean;
    signature_image_url: string;
    received_by_id: string | null;
    received_by_name: string | null;
    received_at: string | null;
    credit_term_id: string | null;
    credit_term_name: string | null;
    credit_term_days: string | null;
    payment_due_date: string | null;
    is_active: boolean;
    note: string | null;
    info: string | null;
    dimension: string | null;
    created_at: string;
    created_by_id: string;
    updated_at: string;
    updated_by_id: string | null;
}
export interface CreditNoteDto {
    id: string;
    cdn_number: string;
    status: string;
    title: string;
    date_created: string;
    vendor: string;
    doc_no: string;
    doc_date: string;
    net_amount: number;
    tax_amount: number;
    amount: number;
}

export interface PurchaseRequestTemplateDto {
    id: string;
    title: string;
    department: string;
    status: string;
    date_created: string;
    type: string;
    prt_number: string;
    requestor: string;
    amount: number;
    workflow_status: string;
}

export interface VendorComparisonDto {
    id: string;
    vendor_name: string;
    status: boolean;
    rating: number;
    score: number;
    res_time: number;
    delivery_time: number;
}
