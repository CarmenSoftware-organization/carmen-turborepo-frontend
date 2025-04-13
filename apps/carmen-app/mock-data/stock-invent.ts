import { InventoryDataDto } from "@/dtos/product.dto";

export const mockStockInventoryData: InventoryDataDto = {
    totalStock: {
        onHand: 3300,
        onOrder: 500
    },
    locations: [
        {
            code: 'WH-001',
            name: 'Main Warehouse',
            type: 'Primary',
            onHand: 1500,
            onOrder: 500,
            minimum: 1000,
            maximum: 3000,
            reorderPoint: 1200,
            parLevel: 2000
        },
        {
            code: 'WH-002',
            name: 'Secondary Warehouse',
            type: 'Secondary',
            onHand: 1000,
            onOrder: 0,
            minimum: 800,
            maximum: 2000,
            reorderPoint: 1000,
            parLevel: 1500
        },
        {
            code: 'WH-003',
            name: 'Distribution Center',
            type: 'Distribution',
            onHand: 800,
            onOrder: 0,
            minimum: 500,
            maximum: 1500,
            reorderPoint: 600,
            parLevel: 1000
        }
    ],
    aggregateSettings: {
        minimum: 2300,
        maximum: 6500,
        reorderPoint: 2800,
        parLevel: 4500
    }
};