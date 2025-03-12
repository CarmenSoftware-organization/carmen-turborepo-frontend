export interface CountItem {
    id: string;
    name: string;
    sku: string;
    description: string;
    expectedQuantity: number;
    unit: string;
}

export interface NewCountData {
    counter: string;
    department: string;
    storeName: string;
    date: string;
    notes?: string;
}

export interface CountData {
    storeName: string
    department: string
    userName: string
    date: string
    status: "pending" | "completed" | "in-progress"
    itemCount: number
    lastCountDate: string
    variance: number
    notes: string
    completedCount: number
}
