export const statusVariantMap: Record<string, 'default' | 'green' | 'red' | 'yellow' | 'violet' | 'blue' | null | undefined> = {
    'In Process': 'yellow',
    Complete: 'green',
    Reject: 'red',
    Void: 'violet',
    Draft: 'default',
};

export interface RequisitionType {
    date: string
    refNo: string
    requestTo: string
    storeName: string
    description: string
    status: 'In Process' | 'Complete' | 'Reject' | 'Void' | 'Draft'
    totalAmount: number
}


export const requisitions: RequisitionType[] = [
    { date: '2024-01-15', refNo: 'SR-2024-001', requestTo: 'M01', storeName: 'Main Store', description: 'Monthly supplies request', status: 'In Process', totalAmount: 1500.00 },
    { date: '2024-01-14', refNo: 'SR-2024-002', requestTo: 'B01', storeName: 'Branch Store 1', description: 'Emergency stock replenishment', status: 'Complete', totalAmount: 2750.50 },
    { date: '2024-01-13', refNo: 'SR-2024-003', requestTo: 'M02', storeName: 'Main Store', description: 'Draft Requisition', status: 'Draft', totalAmount: 1000.00 },
    { date: '2024-01-12', refNo: 'SR-2024-004', requestTo: 'B02', storeName: 'Branch Store 2', description: 'Quarterly inventory update', status: 'In Process', totalAmount: 1200.00 },
    { date: '2024-01-11', refNo: 'SR-2024-005', requestTo: 'M01', storeName: 'Main Store', description: 'Office supplies restock', status: 'Complete', totalAmount: 1800.00 },
    { date: '2024-01-10', refNo: 'SR-2024-006', requestTo: 'B03', storeName: 'Branch Store 3', description: 'Emergency equipment request', status: 'Reject', totalAmount: 1500.00 },
    { date: '2024-01-09', refNo: 'SR-2024-007', requestTo: 'M02', storeName: 'Main Store', description: 'IT department supplies', status: 'In Process', totalAmount: 1000.00 },
    { date: '2024-01-08', refNo: 'SR-2024-008', requestTo: 'B01', storeName: 'Branch Store 1', description: 'Seasonal inventory preparation', status: 'Draft', totalAmount: 1100.00 },
    { date: '2024-01-07', refNo: 'SR-2024-009', requestTo: 'M01', storeName: 'Main Store', description: 'Maintenance tools request', status: 'Complete', totalAmount: 1300.00 },
    { date: '2024-01-06', refNo: 'SR-2024-010', requestTo: 'B02', storeName: 'Branch Store 2', description: 'Staff uniform order', status: 'In Process', totalAmount: 1200.00 },
    { date: '2024-01-05', refNo: 'SR-2024-011', requestTo: 'M02', storeName: 'Main Store', description: 'Marketing materials request', status: 'Void', totalAmount: 1000.00 },
    { date: '2024-01-04', refNo: 'SR-2024-012', requestTo: 'B03', storeName: 'Branch Store 3', description: 'Safety equipment restock', status: 'Complete', totalAmount: 1400.00 },
    { date: '2024-01-03', refNo: 'SR-2024-013', requestTo: 'M01', storeName: 'Main Store', description: 'Cleaning supplies order', status: 'In Process', totalAmount: 1100.00 },
    { date: '2024-01-02', refNo: 'SR-2024-014', requestTo: 'B01', storeName: 'Branch Store 1', description: 'New product samples request', status: 'Draft', totalAmount: 1000.00 },
    { date: '2024-01-01', refNo: 'SR-2024-015', requestTo: 'M02', storeName: 'Main Store', description: 'Year-end inventory count supplies', status: 'Complete', totalAmount: 1600.00 },
]

export const mockRequisition = {
    refNo: 'SR-2024-001',
    date: '2024-01-15',
    expectedDeliveryDate: '2024-01-20',
    movementType: 'Issue',
    description: 'Monthly supplies request',
    requestedFrom: 'M01 : Main Store',
    department: 'F&B Operations',
    jobCode: 'N/A : Not Available',
    process: '',
    status: 'In Process',
    items: [
        {
            id: 1,
            description: 'Thai Milk Tea (12 pack)',
            unit: 'Box',
            qtyRequired: 10,
            qtyApproved: 8,
            costPerUnit: 120.00,
            total: 960.00,
            requestDate: '2024-01-20',
            inventory: {
                onHand: 50,
                onOrder: 100,
                lastPrice: 118.00,
                lastVendor: 'Thai Beverages Co.'
            },
            itemInfo: {
                location: 'Central Kitchen',
                locationCode: 'CK001',
                itemName: 'Thai Milk Tea',
                category: 'Beverage',
                subCategory: 'Tea',
                itemGroup: 'Packaged Drinks',
                barCode: '8851234567890',
                locationType: 'direct'
            },
            qtyIssued: 5,
            approvalStatus: 'Accept'
        },
        {
            id: 2,
            description: 'Coffee Beans (1kg)',
            unit: 'Bag',
            qtyRequired: 15,
            qtyApproved: 15,
            costPerUnit: 250.00,
            total: 3750.00,
            requestDate: '2024-01-20',
            inventory: {
                onHand: 30,
                onOrder: 50,
                lastPrice: 245.00,
                lastVendor: 'Premium Coffee Supply'
            },
            itemInfo: {
                location: 'Roastery Store',
                locationCode: 'RS001',
                itemName: 'Premium Coffee Beans',
                category: 'Beverage',
                subCategory: 'Coffee',
                itemGroup: 'Raw Materials',
                barCode: '8851234567891',
                locationType: 'inventory'
            },
            qtyIssued: 10,
            approvalStatus: 'Reject'
        },
        {
            id: 3,
            description: 'Paper Cups (16oz)',
            unit: 'Pack',
            qtyRequired: 20,
            qtyApproved: 20,
            costPerUnit: 85.00,
            total: 1700.00,
            requestDate: '2024-01-20',
            inventory: {
                onHand: 100,
                onOrder: 200,
                lastPrice: 82.00,
                lastVendor: 'Packaging Solutions'
            },
            itemInfo: {
                location: 'Main Warehouse',
                locationCode: 'MW001',
                itemName: 'Paper Cup 16oz',
                category: 'Packaging',
                subCategory: 'Cups',
                itemGroup: 'Disposables',
                barCode: '8851234567892',
                locationType: 'direct'
            },
            qtyIssued: 15,
            approvalStatus: 'Accept'
        },
        {
            id: 4,
            description: 'Chocolate Syrup',
            unit: 'Bottle',
            qtyRequired: 8,
            qtyApproved: 6,
            costPerUnit: 180.00,
            total: 1080.00,
            requestDate: '2024-01-20',
            inventory: {
                onHand: 15,
                onOrder: 30,
                lastPrice: 175.00,
                lastVendor: 'Sweet Supplies Co.'
            },
            itemInfo: {
                location: 'Central Kitchen',
                locationCode: 'CK001',
                itemName: 'Chocolate Syrup',
                category: 'Ingredients',
                subCategory: 'Syrups',
                itemGroup: 'Flavorings',
                barCode: '8851234567893',
                locationType: 'direct'
            },
            qtyIssued: 4,
            approvalStatus: 'Review'
        },
        {
            id: 5,
            description: 'Plastic Straws',
            unit: 'Pack',
            qtyRequired: 25,
            qtyApproved: 25,
            costPerUnit: 45.00,
            total: 1125.00,
            requestDate: '2024-01-20',
            inventory: {
                onHand: 200,
                onOrder: 300,
                lastPrice: 43.00,
                lastVendor: 'Packaging Solutions'
            },
            itemInfo: {
                location: 'Main Warehouse',
                locationCode: 'MW001',
                itemName: 'Plastic Straw',
                category: 'Packaging',
                subCategory: 'Straws',
                itemGroup: 'Disposables',
                barCode: '8851234567894',
                locationType: 'direct'
            },
            qtyIssued: 20,
            approvalStatus: 'Accept'
        },
        {
            id: 6,
            description: 'Green Tea Powder',
            unit: 'Kg',
            qtyRequired: 5,
            qtyApproved: 4,
            costPerUnit: 320.00,
            total: 1280.00,
            requestDate: '2024-01-20',
            inventory: {
                onHand: 8,
                onOrder: 20,
                lastPrice: 315.00,
                lastVendor: 'Tea Suppliers Inc.'
            },
            itemInfo: {
                location: 'Central Kitchen',
                locationCode: 'CK001',
                itemName: 'Green Tea Powder',
                category: 'Beverage',
                subCategory: 'Tea',
                itemGroup: 'Raw Materials',
                barCode: '8851234567895',
                locationType: 'direct'
            },
            qtyIssued: 3,
            approvalStatus: 'Reject'
        }
    ],
    comments: [
        {
            id: 1,
            date: '2024-01-15',
            by: 'John Doe',
            comment: 'Approved quantities adjusted based on current stock levels'
        }
    ],
    attachments: [
        {
            id: 1,
            fileName: 'requisition_details.pdf',
            description: 'Detailed specifications',
            isPublic: true,
            date: '2024-01-15',
            by: 'John Doe'
        }
    ],
    activityLog: [
        {
            id: 1,
            date: '2024-01-15',
            by: 'John Doe',
            action: 'Created',
            log: 'Store requisition created'
        }
    ]
}

interface ApprovalLogEntry {
    id: number
    date: string
    status: 'Accept' | 'Reject' | 'Review'
    by: string
    comments: string
}

interface ApprovalLogs {
    [key: number]: ApprovalLogEntry[]
}

// Update the mock data with proper typing
export const mockApprovalLogs: ApprovalLogs = {
    1: [
        {
            id: 1,
            date: '2024-01-15 14:30',
            status: 'Accept',
            by: 'John Doe',
            comments: 'Quantity approved as requested'
        },
        {
            id: 2,
            date: '2024-01-15 10:15',
            status: 'Review',
            by: 'Jane Smith',
            comments: 'Please check stock availability'
        }
    ],
    2: [
        {
            id: 1,
            date: '2024-01-15 13:00',
            status: 'Reject',
            by: 'Mike Johnson',
            comments: 'Insufficient stock available'
        }
    ],
    3: [
        {
            id: 1,
            date: '2024-01-15 11:45',
            status: 'Accept',
            by: 'Sarah Wilson',
            comments: 'Approved as per request'
        }
    ]
} as const


// Add interface for movements
interface StockMovement {
    id: number
    movementType: string
    sourceDocument: string
    commitDate: string
    postingDate: string
    status: string
    movement: {
        source: string
        sourceName: string
        destination: string
        destinationName: string
        type: string
    }
    items: {
        id: number
        productName: string
        sku: string
        uom: string
        beforeQty: number
        inQty: number
        outQty: number
        afterQty: number
        unitCost: number
        totalCost: number
        location: {
            type: 'INV' | 'DIR'
            code: string
            name: string
            displayType: string
        }
        lots: {
            lotNo: string
            quantity: number
            uom: string
        }[]
    }[]
    totals: {
        inQty: number
        outQty: number
        totalCost: number
        lotCount: number
    }
}

// Update the mock movements data to reflect the requisition items
export const movements: StockMovement[] = [
    {
        id: 1,
        movementType: 'STORE_REQUISITION',
        sourceDocument: mockRequisition.refNo,
        commitDate: mockRequisition.date,
        postingDate: mockRequisition.date,
        status: 'Posted',
        items: mockRequisition.items.map(item => ({
            id: item.id,
            productName: item.itemInfo.itemName,
            sku: item.description,
            uom: item.unit,
            beforeQty: item.inventory.onHand,
            inQty: 0,
            outQty: item.qtyIssued || 0,
            afterQty: item.inventory.onHand - (item.qtyIssued || 0),
            unitCost: item.costPerUnit,
            totalCost: (item.qtyIssued || 0) * item.costPerUnit,
            location: {
                type: item.itemInfo.locationType === 'inventory' ? 'INV' : 'DIR',
                code: item.itemInfo.locationCode,
                name: item.itemInfo.location,
                displayType: item.itemInfo.locationType === 'inventory' ? 'Inventory' : 'Direct'
            },
            lots: [
                {
                    lotNo: `LOT-${mockRequisition.date}-${item.id.toString().padStart(3, '0')}`,
                    quantity: -(item.qtyIssued || 0),
                    uom: item.unit
                }
            ]
        })),
        movement: {
            source: 'Main Store',
            sourceName: 'Main Store',
            destination: mockRequisition.department,
            destinationName: mockRequisition.department,
            type: 'Store Requisition'
        },
        totals: {
            inQty: 0,
            outQty: mockRequisition.items.reduce((sum, item) => sum + (item.qtyIssued || 0), 0),
            totalCost: mockRequisition.items.reduce((sum, item) => sum + ((item.qtyIssued || 0) * item.costPerUnit), 0),
            lotCount: mockRequisition.items.length
        }
    }
]


interface JournalEntry {
    accountCode: string
    accountName: string
    department: {
        code: string
        name: string
    }
    costCenter: string
    description: string
    reference: string
    debit: number
    credit: number
}

interface JournalGroup {
    group: string
    description: string
    entries: JournalEntry[]
}

// Mock data for journal entries
export const mockJournalEntries: JournalGroup[] = [
    {
        group: 'Inventory Entries',
        description: 'Stock movement and cost adjustments',
        entries: [
            {
                accountCode: '1140',
                accountName: 'Inventory - Raw Materials',
                department: { code: 'F&B', name: 'F&B Operations' },
                costCenter: 'CC001',
                description: 'Stock Issue Recording',
                reference: 'SR-2024-001',
                debit: 0,
                credit: 8615.00
            },
            {
                accountCode: '5110',
                accountName: 'Cost of Goods Used',
                department: { code: 'F&B', name: 'F&B Operations' },
                costCenter: 'CC001',
                description: 'Usage Cost Recording',
                reference: 'SR-2024-001',
                debit: 8615.00,
                credit: 0
            }
        ]
    }
]


export interface RequisitionItem {
    id: string
    itemInfo: {
        location: string
        locationCode: string
        locationType: string
        itemName: string
    }
    description: string
    unit: string
    qtyRequired: number
    qtyApproved: number
    qtyIssued: number
    total: number
    approvalStatus: string
    inventory: {
        onHand: number
        onOrder: number
        lastPrice: number
        lastVendor: string
    }
}

export interface MovementItem {
    id: string
    location: {
        name: string
        code: string
        type: string
    }
    productName: string
    sku: string
    uom: string
    unitCost: number
    lots: {
        lotNo: string
        quantity: number
    }[]
}


export interface Movement {
    id: string
    sourceDocument: string
    commitDate: string
    movement: {
        source: string
        destination: string
    }
    items: MovementItem[]
}
