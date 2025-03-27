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

