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