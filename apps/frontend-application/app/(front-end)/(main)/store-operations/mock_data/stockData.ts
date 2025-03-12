export interface Item {
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

export const stockLevels = [
    { month: 'Jan', level: 150 },
    { month: 'Feb', level: 180 },
    { month: 'Mar', level: 120 },
    { month: 'Apr', level: 200 },
    { month: 'May', level: 160 },
    { month: 'Jun', level: 140 },
];

export const stockData = [
    {
        id: 1,
        name: 'Thai Milk Tea',
        description: 'Premium Thai tea powder with creamer (12 sachets/box)',
        sku: 'BEV-001',
        location: 'Central Kitchen',
        locationCode: 'CK-001',
        currentStock: 25,
        minLevel: 30,
        maxLevel: 100,
        parLevel: 80,
        onOrder: 50,
        reorderPoint: 40,
        lastPrice: 45.99,
        lastVendor: 'Thai Beverage Co.',
        status: 'low',
        usage: 'high',
        orderAmount: 0,
        unit: 'Box'
    },
    {
        id: 2,
        name: 'Coffee Beans',
        description: 'Premium Arabica whole beans (1kg/bag)',
        sku: 'BEV-002',
        location: 'Roastery Store',
        locationCode: 'RS-001',
        currentStock: 45,
        minLevel: 20,
        maxLevel: 80,
        parLevel: 60,
        onOrder: 0,
        reorderPoint: 30,
        lastPrice: 28.50,
        lastVendor: 'Global Coffee Suppliers',
        status: 'normal',
        usage: 'medium',
        orderAmount: 0,
        unit: 'Bag'
    }
]