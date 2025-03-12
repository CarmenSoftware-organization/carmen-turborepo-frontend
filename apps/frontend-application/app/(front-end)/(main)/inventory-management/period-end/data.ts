
export interface PeriodEndRecord {
    id: string
    period: string
    startDate: Date
    endDate: Date
    status: 'open' | 'in_progress' | 'closed'
    completedBy?: string
    completedAt?: Date
    notes?: string
}

export const mockPeriodEndRecords: PeriodEndRecord[] = [
    {
        id: "PE-2024-01",
        period: "January 2024",
        startDate: new Date(2024, 0, 1),
        endDate: new Date(2024, 0, 31),
        status: 'closed',
        completedBy: "John Doe",
        completedAt: new Date(2024, 1, 2),
        notes: "All reconciliations completed"
    },
    {
        id: "PE-2024-02",
        period: "February 2024",
        startDate: new Date(2024, 1, 1),
        endDate: new Date(2024, 1, 29),
        status: 'in_progress',
        notes: "Physical count in progress"
    },
    {
        id: "PE-2024-03",
        period: "March 2024",
        startDate: new Date(2024, 2, 1),
        endDate: new Date(2024, 2, 31),
        status: 'open'
    }
]

interface PeriodEndDetail {
    id: string
    period: string
    startDate: Date
    endDate: Date
    status: 'open' | 'in_progress' | 'closed'
    completedBy?: string
    completedAt?: Date
    notes?: string
    tasks: {
        id: string
        name: string
        status: 'pending' | 'completed'
        completedBy?: string
        completedAt?: Date
    }[]
    adjustments: {
        id: string
        type: string
        amount: number
        reason: string
        status: string
        createdBy: string
        createdAt: Date
    }[]
}

export const mockPeriodEndDetail: PeriodEndDetail = {
    id: "PE-2024-02",
    period: "February 2024",
    startDate: new Date(2024, 1, 1),
    endDate: new Date(2024, 1, 29),
    status: 'in_progress',
    notes: "Physical count in progress",
    tasks: [
        {
            id: "TASK-001",
            name: "Complete Physical Count",
            status: 'completed',
            completedBy: "Jane Smith",
            completedAt: new Date(2024, 1, 25)
        },
        {
            id: "TASK-002",
            name: "Reconcile Inventory Adjustments",
            status: 'pending'
        },
        {
            id: "TASK-003",
            name: "Review Variances",
            status: 'pending'
        },
        {
            id: "TASK-004",
            name: "Post Period End Entries",
            status: 'pending'
        }
    ],
    adjustments: [
        {
            id: "ADJ-001",
            type: "Physical Count Variance",
            amount: -1250.75,
            reason: "Count discrepancy in main warehouse",
            status: "pending",
            createdBy: "John Doe",
            createdAt: new Date(2024, 1, 26)
        },
        {
            id: "ADJ-002",
            type: "Damaged Goods Write-off",
            amount: -750.00,
            reason: "Storm damage to storage area",
            status: "approved",
            createdBy: "Jane Smith",
            createdAt: new Date(2024, 1, 24)
        }
    ]
}