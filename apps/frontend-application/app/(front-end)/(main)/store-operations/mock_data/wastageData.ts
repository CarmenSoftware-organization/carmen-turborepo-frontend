export const monthlyWastage = [
    { month: 'Jan', value: 2500 },
    { month: 'Feb', value: 1800 },
    { month: 'Mar', value: 3200 },
    { month: 'Apr', value: 2200 },
    { month: 'May', value: 2800 },
    { month: 'Jun', value: 1900 }
];

export const wastageByReason = [
    { name: 'Expiration', value: 45 },
    { name: 'Damage', value: 25 },
    { name: 'Quality Issues', value: 20 },
    { name: 'Other', value: 10 }
];

export const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16'];

export const wastageRecords = [
    {
        id: 1,
        date: '2024-01-15',
        itemCode: 'BEV-001',
        itemName: 'Thai Milk Tea (12 pack)',
        quantity: 5,
        unitCost: 45.99,
        totalLoss: 229.95,
        reason: 'Expiration',
        reportedBy: 'John Smith',
        status: 'Pending Review'
    },
    {
        id: 2,
        date: '2024-01-14',
        itemCode: 'BEV-002',
        itemName: 'Coffee Beans (1kg)',
        quantity: 2,
        unitCost: 28.50,
        totalLoss: 57.00,
        reason: 'Quality Issues',
        reportedBy: 'Jane Doe',
        status: 'Approved'
    }
];