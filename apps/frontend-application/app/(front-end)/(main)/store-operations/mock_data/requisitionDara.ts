interface Requisition {
    date: string
    refNo: string
    requestTo: string
    storeName: string
    description: string
    status: 'In Process' | 'Complete' | 'Reject' | 'Void' | 'Draft'
    totalAmount: number
}

export const requisitions: Requisition[] = [
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
