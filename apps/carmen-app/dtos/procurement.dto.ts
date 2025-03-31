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
    title: z.string().min(1, "Title is required"),
    status: z.string().optional(),
    date_created: z.string().optional(),
    type: z.string().min(1, "Type is required"),
    description: z.string().min(1, "Description is required"),
    requestor: z.string().min(1, "Requestor is required"),
    department: z.string().min(1, "Department is required"),
    amount: z.number().min(0, "Amount must be greater than 0"),
    workflow_status: z.string().optional(),
});

export type PurchaseRequestDto = z.infer<typeof prFormSchema>;

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

export interface GoodsReceivedNoteDto {
    id: string;
    department: string;
    status: string;
    date_created: string;
    invoice_date: string;
    grn_number: string;
    currency: string;
    net_amount: number;
    tax_amount: number;
    amount: number;
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
