import { ClusterDistributionData, InvoiceDto, LicenseUtilizationDataDto, ModuleUsageDataDto, PlanDto, RevenueDto, SubscriptionDto, SubscriptionReportDto, SubscriptionTrendData, SubscriptionUsageDto, UsageData } from "@/dto/subscription.dto";

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


export const mockSubscriptionUsage: SubscriptionUsageDto[] = [
    {
        id: "1",
        hotel_name: "Grand Palace Hotel",
        user_license: 50,
        used_user_license: 35,
        module_license: 10,
        used_module_license: 7,
        storage_license: 500,
        used_storage_license: 320,
    },
    {
        id: "2",
        hotel_name: "Ocean View Resort",
        user_license: 30,
        used_user_license: 22,
        module_license: 8,
        used_module_license: 6,
        storage_license: 300,
        used_storage_license: 180,
    },
    {
        id: "3",
        hotel_name: "Mountain Retreat Lodge",
        user_license: 40,
        used_user_license: 28,
        module_license: 12,
        used_module_license: 9,
        storage_license: 400,
        used_storage_license: 250,
    },
    {
        id: "4",
        hotel_name: "City Lights Hotel",
        user_license: 60,
        used_user_license: 45,
        module_license: 15,
        used_module_license: 10,
        storage_license: 600,
        used_storage_license: 420,
    },
];

export const usageChartData: UsageData[] = [
    { month: 'Jan', users: 520, storage: 150 },
    { month: 'Feb', users: 580, storage: 165 },
    { month: 'Mar', users: 620, storage: 180 },
    { month: 'Apr', users: 650, storage: 195 },
    { month: 'May', users: 675, storage: 210 },
    { month: 'Jun', users: 675, storage: 220 }
]

export const mockSubscriptionReport: SubscriptionReportDto = {
    subscription: 10,
    new_subscription: 2,
    revenue: 14000,
    new_revenue: 1470,
    bu: 40,
    new_bu: 4,
    cluster: 10,
    new_cluster: 5,
}


export const mockSubscriptionTrendData: SubscriptionTrendData[] = [
    { month: "Jan", active: 42, inactive: 5, total: 47 },
    { month: "Feb", active: 45, inactive: 4, total: 49 },
    { month: "Mar", active: 48, inactive: 3, total: 51 },
    { month: "Apr", active: 50, inactive: 3, total: 53 },
    { month: "May", active: 53, inactive: 2, total: 55 },
    { month: "Jun", active: 55, inactive: 2, total: 57 },
]

export const mockClusterDistributionData: ClusterDistributionData[] = [
    { name: "European Hotels", value: 45 },
    { name: "American Hotels", value: 30 },
    { name: "Asian Hotels", value: 25 },
]

export const mockLicenseUtilizationData: LicenseUtilizationDataDto[] = [
    { id: "lc-1", name: "Grand Hotel Berlin", buStaff: 22, buStaffMax: 30, clusterUsers: 15, clusterUsersMax: 20 },
    { id: "lc-2", name: "Luxury Resort Paris", buStaff: 98, buStaffMax: 150, clusterUsers: 67, clusterUsersMax: 100 },
    { id: "lc-3", name: "Seaside Hotel Barcelona", buStaff: 42, buStaffMax: 50, clusterUsers: 22, clusterUsersMax: 30 },
    { id: "lc-4", name: "City Center Hotel New York", buStaff: 187, buStaffMax: 200, clusterUsers: 92, clusterUsersMax: 100 },
]


export const mockModuleUsageData: ModuleUsageDataDto[] = [
    {
        id: "mod_001",
        name: "Accounting",
        adoptionRate: 85,
        activeUsers: 320,
        growthRate: 12,
        businessUnits: 38
    },
    {
        id: "mod_002",
        name: "Inventory",
        adoptionRate: 78,
        activeUsers: 280,
        growthRate: 8,
        businessUnits: 35
    },
    {
        id: "mod_003",
        name: "Sales",
        adoptionRate: 65,
        activeUsers: 210,
        growthRate: 15,
        businessUnits: 29
    },
    {
        id: "mod_004",
        name: "Analytics",
        adoptionRate: 60,
        activeUsers: 180,
        growthRate: 20,
        businessUnits: 27
    },
    {
        id: "mod_005",
        name: "PMS",
        adoptionRate: 45,
        activeUsers: 150,
        growthRate: 5,
        businessUnits: 20
    },
    {
        id: "mod_006",
        name: "HR",
        adoptionRate: 30,
        activeUsers: 90,
        growthRate: 10,
        businessUnits: 13
    },
];

export const mockRevenueData: RevenueDto[] = [
    { id: "rev_001", month: "Jan", revenue: 42000 },
    { id: "rev_002", month: "Feb", revenue: 45000 },
    { id: "rev_003", month: "Mar", revenue: 48000 },
    { id: "rev_004", month: "Apr", revenue: 51000 },
    { id: "rev_005", month: "May", revenue: 54000 },
    { id: "rev_006", month: "Jun", revenue: 57000 },
];

export const mockInvoices: InvoiceDto[] = [
    {
        id: "inv_001",
        invoice_number: "INV-202401",
        date: "2024-03-10",
        hotel_name: "The Ritz-Carlton Tokyo (ザ・リッツ・カールトン東京)",
        amount: 1200.5,
        status: "Paid",
    },
    {
        id: "inv_002",
        invoice_number: "INV-202402",
        date: "2024-03-15",
        hotel_name: "Mandarin Oriental Bangkok (แมนดาริน โอเรียนเต็ล กรุงเทพฯ)",
        amount: 950.75,
        status: "Pending",
    },
    {
        id: "inv_003",
        invoice_number: "INV-202403",
        date: "2024-03-20",
        hotel_name: "Hôtel de Crillon (Hôtel de Crillon, A Rosewood Hotel)",
        amount: 2100.25,
        status: "Overdue",
    },
    {
        id: "inv_004",
        invoice_number: "INV-202404",
        date: "2024-03-25",
        hotel_name: "Hotel Danieli Venice (Hotel Danieli, Venezia)",
        amount: 1800.0,
        status: "Paid",
    },
    {
        id: "inv_005",
        invoice_number: "INV-202405",
        date: "2024-03-30",
        hotel_name: "The Plaza Hotel New York",
        amount: 2500.75,
        status: "Pending",
    },
    {
        id: "inv_006",
        invoice_number: "INV-202406",
        date: "2024-04-05",
        hotel_name: "W Barcelona (Hotel W Barcelona)",
        amount: 1400.6,
        status: "Paid",
    },
    {
        id: "inv_007",
        invoice_number: "INV-202407",
        date: "2024-04-10",
        hotel_name: "Burj Al Arab Jumeirah (برج العرب جميرا)",
        amount: 3200.9,
        status: "Overdue",
    },
    {
        id: "inv_008",
        invoice_number: "INV-202408",
        date: "2024-04-15",
        hotel_name: "The Savoy London",
        amount: 2000.2,
        status: "Paid",
    },
    {
        id: "inv_009",
        invoice_number: "INV-202409",
        date: "2024-04-20",
        hotel_name: "Hotel Adlon Kempinski Berlin",
        amount: 1750.5,
        status: "Pending",
    },
    {
        id: "inv_010",
        invoice_number: "INV-202410",
        date: "2024-04-25",
        hotel_name: "The Peninsula Shanghai (上海半岛酒店)",
        amount: 1950.8,
        status: "Paid",
    },
];


export const mockPlans: PlanDto[] = [
    {
        id: "basic",
        name: "Basic",
        description: "For small hotel operations",
        price: 199,
        features: [
            "1 Business Unit",
            "Up to 30 BU Staff",
            "Up to 20 Cluster Users",
            "3 Modules included",
            "30-day grace period",
            "Standard support",
        ],
        modules: ["Accounting", "Inventory", "Sales", "Analytics", "PMS", "HR"],
        maxModules: 3,
    },
    {
        id: "professional",
        name: "Professional",
        description: "For medium-sized hotel chains",
        price: 499,
        features: [
            "Up to 3 Business Units",
            "Up to 150 BU Staff per business unit",
            "Up to 100 Cluster Users",
            "All modules included",
            "30-day grace period",
            "Priority support",
        ],
        modules: ["Accounting", "Inventory", "Sales", "Analytics", "PMS", "HR"],
        maxModules: 6,
    },
    {
        id: "enterprise",
        name: "Enterprise",
        description: "For large hotel groups",
        price: 999,
        features: [
            "Unlimited Business Units",
            "Up to 300 BU Staff per business unit",
            "Up to 500 Cluster Users",
            "All modules with premium features",
            "Extended 60-day grace period",
            "24/7 dedicated support",
        ],
        modules: ["Accounting", "Inventory", "Sales", "Analytics", "PMS", "HR"],
        maxModules: 6,
    },
];
