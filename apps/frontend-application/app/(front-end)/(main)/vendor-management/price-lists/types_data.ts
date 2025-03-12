export interface Pricelist {
    id: string
    name: string
    description: string
    startDate: string
    endDate: string
    isActive: boolean
}

export const pricelistData = {
    total: 10,
    pricelists: [
        {
            id: "PL001",
            name: "Summer Sale 2023",
            description: "Special discounts for summer products",
            startDate: "2023-06-01",
            endDate: "2023-08-31",
            isActive: true
        },
        {
            id: "PL002",
            name: "Back to School 2023",
            description: "Discounts on school supplies",
            startDate: "2023-08-15",
            endDate: "2023-09-15",
            isActive: true
        },
        {
            id: "PL003",
            name: "Holiday Season 2023",
            description: "Festive discounts on various products",
            startDate: "2023-11-25",
            endDate: "2023-12-31",
            isActive: false
        },
        {
            id: "PL004",
            name: "Spring Collection 2024",
            description: "New arrivals for spring season",
            startDate: "2024-03-01",
            endDate: "2024-05-31",
            isActive: false
        },
        {
            id: "PL005",
            name: "Clearance Sale",
            description: "Year-round discounts on clearance items",
            startDate: "2023-01-01",
            endDate: "2023-12-31",
            isActive: true
        }
    ]
}