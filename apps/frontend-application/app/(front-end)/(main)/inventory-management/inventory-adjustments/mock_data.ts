export const mockAdjustments = [
    {
        id: "ADJ-2024-001",
        date: "2024-01-15",
        type: "IN",
        status: "Posted",
        location: "Main Warehouse",
        reason: "Physical Count Variance",
        items: 12,
        totalValue: 2845.50
    },
    {
        id: "ADJ-2024-002",
        date: "2024-01-16",
        type: "OUT",
        status: "Posted",
        location: "Main Warehouse",
        reason: "Damaged Goods",
        items: 3,
        totalValue: 567.80
    },
    {
        id: "ADJ-2024-003",
        date: "2024-01-17",
        type: "IN",
        status: "Posted",
        location: "Production Store",
        reason: "System Reconciliation",
        items: 8,
        totalValue: 1234.60
    },
    {
        id: "ADJ-2024-004",
        date: "2024-01-18",
        type: "OUT",
        status: "Draft",
        location: "Main Warehouse",
        reason: "Quality Control Rejection",
        items: 5,
        totalValue: 890.25
    },
    {
        id: "ADJ-2024-005",
        date: "2024-01-18",
        type: "IN",
        status: "Draft",
        location: "Production Store",
        reason: "Spot Check Variance",
        items: 4,
        totalValue: 445.75
    },
    {
        id: "ADJ-2024-006",
        date: "2024-01-19",
        type: "OUT",
        status: "Voided",
        location: "Main Warehouse",
        reason: "Expired Items",
        items: 15,
        totalValue: 3567.90
    },
    {
        id: "ADJ-2024-007",
        date: "2024-01-19",
        type: "IN",
        status: "Posted",
        location: "Production Store",
        reason: "Production Yield Variance",
        items: 6,
        totalValue: 789.30
    },
    {
        id: "ADJ-2024-008",
        date: "2024-01-20",
        type: "OUT",
        status: "Draft",
        location: "Main Warehouse",
        reason: "Theft/Loss",
        items: 2,
        totalValue: 234.50
    }
]


interface AdjustmentItem {
    id: string
    productName: string
    sku: string
    description?: string
    location: string
    locationCode: string
    uom: string
    requiredQuantity: number
    approvedQuantity: number
    issuedQuantity: number
    price: number
    status: 'pending' | 'approved' | 'rejected' | 'completed'
    onHand: number
    onOrder: number
    lastPrice?: number
    lastVendor?: string
    lots: {
        id: string
        lotNumber: string
        quantity: number
        uom: string
    }[]
    unitCost: number
    totalCost: number
}

interface InventoryAdjustment {
    id: string
    date: string
    type: string
    status: string
    location: string
    locationCode: string
    department: string
    reason: string
    description: string
    items: AdjustmentItem[]
    totals: {
        inQty: number
        outQty: number
        totalCost: number
    }
}

export interface Item {
    id: string
    code: string
    name: string
    description?: string
    unit: string
    quantity: number
    currentStock: number
    adjustedStock: number
    status: 'good' | 'damaged' | 'expired'
}

export const mockAdjustment: InventoryAdjustment = {
    id: "ADJ-2024-001",
    date: "2024-01-15",
    type: "IN",
    status: "Posted",
    location: "Main Warehouse",
    locationCode: "WH-001",
    department: "Warehouse",
    reason: "Physical Count Variance",
    description: "Adjustment based on monthly physical inventory count",
    items: [
        {
            id: "ITEM-001",
            productName: "Organic Quinoa",
            sku: "GRN-QNA-001",
            description: "Premium organic white quinoa, high in protein and gluten-free",
            location: "Main Warehouse",
            locationCode: "WH-001",
            uom: "KG",
            requiredQuantity: 25,
            approvedQuantity: 25,
            issuedQuantity: 25,
            price: 45.50,
            status: 'pending',
            onHand: 50,
            onOrder: 20,
            lastPrice: 45.50,
            lastVendor: 'Vendor A',
            lots: [
                {
                    id: "LOT-001",
                    lotNumber: "L240115-001",
                    quantity: 25,
                    uom: "KG"
                },
                {
                    id: "LOT-002",
                    lotNumber: "L240115-002",
                    quantity: -8,
                    uom: "KG"
                }
            ],
            unitCost: 45.50,
            totalCost: 772.50,
        },
        {
            id: "ITEM-002",
            productName: "Brown Rice",
            sku: "GRN-RCE-002",
            description: "Whole grain brown rice, rich in fiber and nutrients",
            location: "Main Warehouse",
            locationCode: "WH-001",
            uom: "KG",
            requiredQuantity: 50,
            approvedQuantity: 50,
            issuedQuantity: 50,
            price: 28.75,
            status: 'pending',
            onHand: 70,
            onOrder: 30,
            lastPrice: 28.75,
            lastVendor: 'Vendor B',
            lots: [
                {
                    id: "LOT-003",
                    lotNumber: "L240115-003",
                    quantity: 50,
                    uom: "KG"
                },
                {
                    id: "LOT-004",
                    lotNumber: "L240115-004",
                    quantity: -15,
                    uom: "KG"
                }
            ],
            unitCost: 28.75,
            totalCost: 1006.25,
        },
        {
            id: "ITEM-003",
            productName: "Chia Seeds",
            sku: "GRN-CHA-003",
            description: "Organic black chia seeds, high in omega-3 fatty acids",
            location: "Main Warehouse",
            locationCode: "WH-001",
            uom: "KG",
            requiredQuantity: 30,
            approvedQuantity: 30,
            issuedQuantity: 30,
            price: 53.35,
            status: 'pending',
            onHand: 40,
            onOrder: 10,
            lastPrice: 53.35,
            lastVendor: 'Vendor C',
            lots: [
                {
                    id: "LOT-005",
                    lotNumber: "L240115-005",
                    quantity: 30,
                    uom: "KG"
                },
                {
                    id: "LOT-006",
                    lotNumber: "L240115-006",
                    quantity: -10,
                    uom: "KG"
                }
            ],
            unitCost: 53.35,
            totalCost: 1066.75,
        }
    ],
    totals: {
        inQty: 105,
        outQty: 33,
        totalCost: 2845.50
    }
}

interface JournalEntry {
    id: string
    account: string
    accountName: string
    debit: number
    credit: number
    department: string
    reference: string
}

interface JournalHeader {
    status: string
    journalNo: string
    postingDate: string
    postingPeriod: string
    description: string
    reference: string
    createdBy: string
    createdAt: string
    postedBy: string
    postedAt: string
}

export const mockJournalEntries: {
    header: JournalHeader
    entries: JournalEntry[]
} = {
    header: {
        status: "Posted",
        journalNo: "JE-2024-001",
        postingDate: "2024-01-15",
        postingPeriod: "2024-01",
        description: "Inventory Adjustment - Physical Count Variance",
        reference: "ADJ-2024-001",
        createdBy: "John Smith",
        createdAt: "2024-01-15 09:30:00",
        postedBy: "Sarah Johnson",
        postedAt: "2024-01-15 14:45:00"
    },
    entries: [
        {
            id: "JE-001",
            account: "1310",
            accountName: "Raw Materials Inventory",
            debit: 2845.50,
            credit: 0,
            department: "Warehouse",
            reference: "ADJ-2024-001"
        },
        {
            id: "JE-002",
            account: "5110",
            accountName: "Inventory Variance",
            debit: 0,
            credit: 2845.50,
            department: "Warehouse",
            reference: "ADJ-2024-001"
        }
    ]
}

export interface Comment {
    id: string
    user: string
    avatar: string
    content: string
    timestamp: string
    attachments?: string[]
}

export interface Attachment {
    id: string
    name: string
    size: string
    uploadedBy: string
    uploadedAt: string
    type: string
}

export interface AuditLog {
    id: string
    user: string
    action: string
    timestamp: string
    details?: string
}

// Mock data
export const mockComments: Comment[] = [
    {
        id: '1',
        user: 'John Doe',
        avatar: '/avatars/john-doe.png',
        content: 'Added new items to the adjustment.',
        timestamp: '2024-01-15 09:30 AM',
    },
    {
        id: '2',
        user: 'Jane Smith',
        avatar: '/avatars/jane-smith.png',
        content: 'Updated quantities based on stock count.',
        timestamp: '2024-01-15 02:15 PM',
        attachments: ['count_sheet.pdf'],
    },
]

export const mockAttachments: Attachment[] = [
    {
        id: '1',
        name: 'count_sheet.pdf',
        size: '2.4 MB',
        uploadedBy: 'Jane Smith',
        uploadedAt: '2024-01-15 02:15 PM',
        type: 'pdf',
    },
    {
        id: '2',
        name: 'inventory_photos.zip',
        size: '15.7 MB',
        uploadedBy: 'John Doe',
        uploadedAt: '2024-01-15 09:30 AM',
        type: 'zip',
    },
]

export const mockAuditLogs: AuditLog[] = [
    {
        id: '1',
        user: 'John Doe',
        action: 'Created adjustment',
        timestamp: '2024-01-15 09:00 AM',
        details: 'Initial creation of inventory adjustment',
    },
    {
        id: '2',
        user: 'Jane Smith',
        action: 'Updated quantities',
        timestamp: '2024-01-15 02:15 PM',
        details: 'Modified quantities for items based on physical count',
    },
    {
        id: '3',
        user: 'John Doe',
        action: 'Added comment',
        timestamp: '2024-01-15 09:30 AM',
    },
]
interface Lot {
    lotNo: string
    quantity: number
    uom: string
}
export interface StockMovementItem {
    id: string
    productName: string
    sku: string
    lots: Lot[]
    uom: string
    unitCost: number
    totalCost: number
    location: {
        name: string
        code: string
    }
}