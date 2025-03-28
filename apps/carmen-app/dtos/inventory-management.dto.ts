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
