
import { z } from "zod";

export interface StoreRequisitionDto {
    id: string;
    date_created: string;
    ref_no: string;
    request_to: string;
    store_name: string;
    description: string;
    total_amount: number;
    status: string;
}

export interface StockDataItemDto {
    id: number
    name: string
    sku: string
    description: string
    location: string
    locationCode: string
    currentStock: number
    minLevel: number
    maxLevel: number
    parLevel: number
    onOrder: number
    reorderPoint: number
    lastPrice: number
    lastVendor: string
    status: string
    usage: string
    orderAmount: number
    unit: string
    selected?: boolean
}


// Store Requisition Detail DTO
export interface StoreRequisitionDetailDto {
    id: string;
    ref_no: string;
    item_name: string;
    status: string;
    date: string;
    expected_delivery_date: string;
    dp_req_from: string;
    job_code: string;
    dp_req_to: string;
    description: string;
}

export const storeRequisitionDetailSchema = z.object({
    id: z.string(),
    ref_no: z.string(),
    item_name: z.string(),
    status: z.string(),
    date: z.string(),
    expected_delivery_date: z.string(),
    dp_req_from: z.string(),
    job_code: z.string(),
    dp_req_to: z.string(),
    description: z.string()
});

// Store Requisition Items DTO
export interface StoreRequisitionItemDto {
    id: string;
    name: string;
    location_code: string;
    inventory_type: string;
    unit: string;
    required_qty: number;
    approved_qty: number;
    issued_qty: number;
    total_amount: number;
    status: string;
    product_name: string;
}

export const storeRequisitionItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    location_code: z.string(),
    inventory_type: z.string(),
    unit: z.string(),
    required_qty: z.number(),
    approved_qty: z.number(),
    issued_qty: z.number(),
    total_amount: z.number(),
    status: z.string()
});

// Stock Movement DTO
export interface StockMovementDto {
    id: string;
    code: string;
    location: string;
    location_code: string;
    product_name: string;
    lot_no: string;
    unit: string;
    stock_in: number;
    stock_out: number;
    unit_cost: number;
    total_cost: number;
}

export const stockMovementSchema = z.object({
    id: z.string(),
    code: z.string(),
    location: z.string(),
    location_code: z.string(),
    product_name: z.string(),
    lot_no: z.string(),
    unit: z.string(),
    stock_in: z.number(),
    stock_out: z.number(),
    unit_cost: z.number(),
    total_cost: z.number()
});

// Journal Entry Item DTO
export interface JournalEntryItemDto {
    id: string;
    account_name: string;
    dp_name: string;
    dp_code: string;
    description: string;
    debit: number;
    credit: number;
}

export const journalEntryItemSchema = z.object({
    id: z.string(),
    account_name: z.string(),
    dp_name: z.string(),
    dp_code: z.string(),
    description: z.string(),
    debit: z.number(),
    credit: z.number()
});

// Journal Entries DTO
export interface JournalEntriesDto {
    id: string;
    je_code: string;
    doc_type: string;
    transaction_date: string;
    status: string;
    je_ref_no: string;
    total_amount: number;
    source: string;
    description: string;
    ie_items: JournalEntryItemDto[];
}

export const journalEntriesSchema = z.object({
    id: z.string(),
    je_code: z.string(),
    doc_type: z.string(),
    transaction_date: z.string(),
    status: z.string(),
    je_ref_no: z.string(),
    total_amount: z.number(),
    source: z.string(),
    description: z.string(),
    ie_items: z.array(journalEntryItemSchema)
});