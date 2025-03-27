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

export interface PurchaseRequestDto {
    id: string;
    title: string;
    status: string;
    date_created: string;
    type: string;
    description: string;
    requestor: string;
    department: string;
    amount: number;
    workflow_status: string;
}


export interface PurchaseOrderlDto {
    id: string;
    department: string;
    status: string;
    date_created: string;
    delivery_date: string;
    po_number: string;
    currency: string;
    net_amount: number;
    tax_amount: number;
    amount: number;
}

