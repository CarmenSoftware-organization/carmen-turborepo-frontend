import { SubscriptionDto } from "@/dto/subscription.dto";

export const mockSubscription: SubscriptionDto[] = [
    {
        id: "sub_001",
        name: "Luxury Hotel Finder Premium",
        status: true,
        description: "Access to premium luxury hotel listings worldwide with exclusive discounts and priority booking",
        price: 129.99,
        period: "monthly",
        next_billing_date: "2023-12-15T00:00:00Z",
        active_module: [
            {
                id: "mod_001",
                name: "Luxury Listings"
            }
        ],
        total_users: 1250,
        bu_users: 450,
        cluster_users: 300,
        platform_users: 500,
        created_at: "2023-01-10T14:30:00Z",
        updated_at: "2023-11-05T09:15:00Z"
    },
    {
        id: "sub_002",
        name: "Business Travel Solution",
        status: true,
        description: "Corporate hotel booking management system with expense tracking and team management",
        price: 299.99,
        period: "monthly",
        next_billing_date: "2023-12-20T00:00:00Z",
        active_module: [
            {
                id: "mod_003",
                name: "Corporate Bookings"
            }
        ],
        total_users: 3500,
        bu_users: 1200,
        cluster_users: 800,
        platform_users: 1500,
        created_at: "2022-11-15T10:45:00Z",
        updated_at: "2023-11-10T16:20:00Z"
    },
    {
        id: "sub_003",
        name: "Hotel Chain Management Basic",
        status: false,
        description: "Essential tools for small hotel chains to manage properties, bookings, and customer data",
        price: 199.99,
        period: "monthly",
        next_billing_date: "2023-12-05T00:00:00Z",
        active_module: [
            {
                id: "mod_005",
                name: "Property Management"
            }
        ],
        total_users: 850,
        bu_users: 300,
        cluster_users: 200,
        platform_users: 350,
        created_at: "2023-03-22T08:15:00Z",
        updated_at: "2023-10-30T11:45:00Z"
    },
    {
        id: "sub_004",
        name: "Global Hotel Analytics Enterprise",
        status: true,
        description: "Advanced analytics platform for major hotel chains with global presence, including market trends and competitive analysis",
        price: 599.99,
        period: "monthly",
        next_billing_date: "2023-12-25T00:00:00Z",
        active_module: [
            {
                id: "mod_006",
                name: "Global Analytics"
            }
        ],
        total_users: 5000,
        bu_users: 1800,
        cluster_users: 1200,
        platform_users: 2000,
        created_at: "2022-07-05T13:20:00Z",
        updated_at: "2023-11-15T14:30:00Z"
    },
    {
        id: "sub_005",
        name: "Boutique Hotel Promotion Suite",
        status: true,
        description: "Marketing and promotion tools specifically designed for boutique and independent hotels",
        price: 149.99,
        period: "monthly",
        next_billing_date: "2023-12-18T00:00:00Z",
        active_module: [
            {
                id: "mod_009",
                name: "Social Media Integration"
            }
        ],
        total_users: 720,
        bu_users: 250,
        cluster_users: 170,
        platform_users: 300,
        created_at: "2023-02-18T09:30:00Z",
        updated_at: "2023-11-02T10:15:00Z"
    }
]