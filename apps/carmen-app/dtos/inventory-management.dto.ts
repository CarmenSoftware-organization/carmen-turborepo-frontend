export interface InventoryAdjustmentDTO {
    id: string;
    adj_no: string;
    adj_date: string;
    type: string;
    location: string;
    reason: string;
    item_count: number;
    status: string;
    total_value: number;
}

export interface PeriodEndDto {
    id: string;
    pe_no: string;
    pe_date: string;
    start_date: string;
    end_date: string;
    status: string;
    created_by: string;
    completed_at: string;
    note: string;
}
