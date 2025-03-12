export const spotCheckData = [
    {
        storeName: "Main Kitchen Store",
        department: "F&B",
        userName: "John Doe",
        date: "2024-04-20",
        status: "pending" as const,
        itemCount: 10, // Smaller count for spot checks
        lastCountDate: "2024-03-20",
        variance: 5.2,
        notes: "Spot check of dry goods section",
        completedCount: 5
    },
    {
        storeName: "Cold Room",
        department: "F&B",
        userName: "Mike Johnson",
        date: "2024-04-18",
        status: "in-progress" as const,
        itemCount: 8,
        lastCountDate: "2024-03-18",
        variance: 0,
        notes: "Spot check in progress",
        completedCount: 3
    },
]


export interface SpotCheckDetails {
    countId: string
    counter: string
    department: string
    store: string
    date: string
    selectedItems: {
        id: string
        code: string
        name: string
        description: string
        expectedQuantity: number
        unit: string
    }[]
}