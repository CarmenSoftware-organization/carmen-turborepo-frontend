export interface PendingRequest {
    id: number;
    item: string;
    quantity: number;
    urgency: 'Low' | 'Medium' | 'High';
    total: number;
    requester: string;
    department: string;
}

export interface FlaggedRequest extends PendingRequest {
    flag: string;
}

// Data Separation: Request Arrays
export const PENDING_REQUESTS: PendingRequest[] = [
    {
        id: 1,
        item: 'Bed Linens',
        quantity: 200,
        urgency: 'Medium',
        total: 5000,
        requester: 'Alice Johnson',
        department: 'Housekeeping',
    },
    {
        id: 2,
        item: 'Coffee Makers',
        quantity: 50,
        urgency: 'Low',
        total: 2500,
        requester: 'Bob Smith',
        department: 'F&B',
    },
    {
        id: 3,
        item: 'Desk Chairs',
        quantity: 30,
        urgency: 'Medium',
        total: 4500,
        requester: 'Carol Davis',
        department: 'Admin',
    },
];

export const FLAGGED_REQUESTS: FlaggedRequest[] = [
    {
        id: 4,
        item: 'Smart TVs',
        quantity: 100,
        urgency: 'High',
        total: 50000,
        requester: 'David Brown',
        department: 'IT',
        flag: 'High value request',
    },
    {
        id: 5,
        item: 'Luxury Toiletries',
        quantity: 1000,
        urgency: 'Medium',
        total: 15000,
        requester: 'Eva Prince',
        department: 'Housekeeping',
        flag: 'Exceeds usual quantity',
    },
];

export const getUrgencyBadgeClasses = (urgency: string) => {
    switch (urgency) {
        case 'High':
            return 'border-red-500 text-red-700';
        case 'Medium':
            return 'border-yellow-500 text-yellow-700';
        default:
            return 'border-green-500 text-green-700';
    }
};

export interface ApprovalActivity {
    action: 'Approved' | 'Rejected' | 'Approved with changes';
    request: string;
    department: string;
    amount: number;
    time: string;
}

export const RECENT_ACTIVITIES: ApprovalActivity[] = [
    {
        action: 'Approved',
        request: 'Towels - 500 units',
        department: 'Housekeeping',
        amount: 3000,
        time: '2 hours ago',
    },
    {
        action: 'Rejected',
        request: 'Luxury Pens - 1000 units',
        department: 'Front Desk',
        amount: 5000,
        time: '1 day ago',
    },
    {
        action: 'Approved with changes',
        request: 'Desk Lamps - 100 units',
        department: 'Maintenance',
        amount: 2000,
        time: '2 days ago',
    },
];

export const getBadgeClasses = (action: ApprovalActivity['action']) => {
    switch (action) {
        case 'Approved':
            return 'bg-green-100 text-green-800';
        case 'Rejected':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-yellow-100 text-yellow-800';
    }
};

export interface Notification {
    message: string;
    time: string;
}

export const notifications: Notification[] = [
    {
        message:
            'Urgent request from Maintenance: 20 A/C units need immediate approval',
        time: '10 minutes ago',
    },
    {
        message: 'Monthly inventory report is ready for review',
        time: '1 hour ago',
    },
    {
        message: 'New supplier added for kitchen equipment',
        time: '3 hours ago',
    },
];
