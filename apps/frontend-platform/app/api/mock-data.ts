import { UserPlatformType } from "@/types/form/form";
import { AccessControlType, BusinessUnitCluster, BusinessUnitType, BusinessUnitUserRoleType, ReportAssignmentType, ReportClusterType, ReportTemplateType, ROLE_TYPE, SettingsType, SupportType, TemplateReportType, UserType } from "@/types/main";

export const statusAdminDashboard = [
    {
        title: "Total Reports",
        value: "2345",
        description: "Generated this month",
        icon: "FileText",
    },
    {
        title: "Business Units",
        value: "24",
        description: "Across all clusters",
        icon: "Building2",
    },
    {
        title: "Active Clusters",
        value: "3",
        description: "APAC, EMEA, Americas",
        icon: "FolderTree",
    },
    {
        title: "Total Users",
        value: "573",
        description: "Active this month",
        icon: "Users",
    },
];


export const reportOverview = {
    today: 5,
    thisWeek: 12,
    active: 3,
    uptime: 99.9,
}


export const clusterOverview = [
    { name: "APAC", businessUnits: 12, status: "Active" },
    { name: "أوروبا والشرق الأوسط وأفريقيا (EMEA)", businessUnits: 7, status: "Active" },
    { name: "Américas", businessUnits: 9, status: "Active" },
    { name: "DACH (Deutschland, Österreich, Schweiz)", businessUnits: 6, status: "Active" },
    { name: "Nordiska länderna", businessUnits: 4, status: "Active" },
    { name: "Benelux (België, Nederland, Luxembourg)", businessUnits: 5, status: "Active" },
    { name: "France", businessUnits: 8, status: "Active" },
    { name: "Iberia (España y Portugal)", businessUnits: 7, status: "Active" },
    { name: "Italia", businessUnits: 6, status: "Active" },
    { name: "Regno Unito e Irlanda", businessUnits: 9, status: "Active" },
    { name: "Europa de Est", businessUnits: 5, status: "Active" },
    { name: "الشرق الأوسط", businessUnits: 6, status: "Active" },
    { name: "दक्षिण एशिया", businessUnits: 10, status: "Active" },
    { name: "เอเชียตะวันออกเฉียงใต้", businessUnits: 11, status: "Active" },
    { name: "大中华区", businessUnits: 14, status: "Active" },
    { name: "日本", businessUnits: 5, status: "Active" },
    { name: "대한민국", businessUnits: 5, status: "Active" },
    { name: "Brasil", businessUnits: 6, status: "Active" },
    { name: "México y América Central", businessUnits: 7, status: "Active" },
    { name: "Canada (Canada)", businessUnits: 4, status: "Active" },
];

export const recentActivity = [
    {
        title: "New Report",
        description: "Generated this month",
        cluster: "APAC",
        create_at: "2025-03-04",
    },
    {
        title: "System Update",
        description: "Scheduled maintenance completed",
        cluster: "EMEA",
        create_at: "2025-03-03",
    },
    {
        title: "User Access Granted",
        description: "New user added to the system",
        cluster: "AMER",
        create_at: "2025-03-02",
    },
    {
        title: "Policy Change",
        description: "Updated security policies",
        cluster: "APAC",
        create_at: "2025-03-01",
    },
    {
        title: "Bug Fix",
        description: "Resolved login issue",
        cluster: "EMEA",
        create_at: "2025-02-28",
    },
    {
        title: "Data Backup",
        description: "Completed weekly data backup",
        cluster: "APAC",
        create_at: "2025-02-27",
    },
    {
        title: "Server Migration",
        description: "Transferred to a new data center",
        cluster: "AMER",
        create_at: "2025-02-26",
    },
    {
        title: "Incident Report",
        description: "Identified and mitigated network issue",
        cluster: "EMEA",
        create_at: "2025-02-25",
    },
];

export const mockClusters: BusinessUnitCluster[] = [
    {
        id: "C-1",
        name: "US-East Cluster",
        businessUnits: ["BU-1234"],
        region: "US-East",
        status: "active"
    },
    {
        id: "C-2",
        name: "US-Central Cluster",
        businessUnits: ["BU-1235"],
        region: "US-Central",
        status: "active"
    },
    {
        id: "C-3",
        name: "APAC Cluster",
        businessUnits: ["BU-1236"],
        region: "APAC",
        status: "active"
    }
]

export const mockBusinessUnits = [
    {
        id: "BU-1234",
        name: "Grand Hotel Downtown",
        brand: "Luxury Collection",
        clusterId: "C-1",
        head: "Sarah Johnson",
        location: {
            city: "New York",
            country: "USA"
        },
        details: {
            rooms: 280,
            teams: 8,
            members: 350
        },
        configuration: {
            database: {
                host: "db-nyc-1.hotel.internal",
                name: "grand_hotel_db",
                type: "postgres"
            },
            cluster: {
                id: "C-1",
                name: "US-East Cluster"
            }
        },
        contact: {
            email: "operations.grand@luxurycollection.com",
            phone: "+1-212-555-0123",
            address: "123 Broadway, New York, NY 10013"
        },
        settings: {
            notifications: {
                email: true,
                slack: true,
                webhook: false
            },
            integrations: {
                enabled: ["supply-chain", "inventory", "procurement"],
                configurations: {}
            }
        },
        reports: [],
        status: "active",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-03-15T10:30:00Z"
    },
    {
        id: "BU-1235",
        name: "Business Tower Hotel",
        brand: "Business Hotels",
        clusterId: "C-2",
        head: "Michael Chen",
        location: {
            city: "Chicago",
            country: "USA"
        },
        details: {
            rooms: 180,
            teams: 6,
            members: 220
        },
        configuration: {
            database: {
                host: "db-chi-1.hotel.internal",
                name: "business_tower_db",
                type: "mysql"
            },
            cluster: {
                id: "C-2",
                name: "US-Central Cluster"
            }
        },
        contact: {
            email: "operations.tower@businesshotels.com",
            phone: "+1-312-555-0123",
            address: "456 Michigan Ave, Chicago, IL 60601"
        },
        settings: {
            notifications: {
                email: true,
                slack: false,
                webhook: true
            },
            integrations: {
                enabled: ["supply-chain", "maintenance"],
                configurations: {}
            }
        },
        reports: [],
        status: "active",
        createdAt: "2024-01-15T00:00:00Z",
        updatedAt: "2024-03-14T15:45:00Z"
    },
    {
        id: "BU-1236",
        name: "Beachfront Resort & Spa",
        brand: "Resort Collection",
        clusterId: "C-3",
        head: "Maria Garcia",
        location: {
            city: "Bali",
            country: "Indonesia"
        },
        details: {
            rooms: 320,
            teams: 10,
            members: 400
        },
        configuration: {
            database: {
                host: "db-bali-1.hotel.internal",
                name: "beachfront_resort_db",
                type: "postgres"
            },
            cluster: {
                id: "C-3",
                name: "APAC Cluster"
            }
        },
        contact: {
            email: "operations.beachfront@resortcollection.com",
            phone: "+62-361-555-0123",
            address: "789 Beach Road, Kuta, Bali 80361"
        },
        settings: {
            notifications: {
                email: true,
                slack: true,
                webhook: true
            },
            integrations: {
                enabled: ["supply-chain", "spa-booking", "restaurant"],
                configurations: {}
            }
        },
        reports: [],
        status: "active",
        createdAt: "2024-02-01T00:00:00Z",
        updatedAt: "2024-03-15T08:15:00Z"
    }
]

export interface MergedClusterData extends Omit<BusinessUnitCluster, 'businessUnits'> {
    businessUnits: BusinessUnitType[];
}

export const mergedClusters = mockClusters.map((cluster) => {
    const clusterBusinessUnits = mockBusinessUnits.filter(
        (bu) => bu.clusterId === cluster.id
    );

    return {
        ...cluster,
        businessUnits: clusterBusinessUnits,
    };
});

export const businessUnitsWithClusters = mockBusinessUnits.map((bu) => {
    const cluster = mockClusters.find((c) => c.id === bu.clusterId);
    if (!cluster) throw new Error(`Cluster not found for business unit ${bu.id}`);

    return {
        ...bu,
        cluster,
    };
});
export const findMergedClusterById = (clusterId: string) => {
    return mergedClusters.find((cluster) => cluster.id === clusterId);
};

export const findBusinessUnitWithCluster = (businessUnitId: string) => {
    return businessUnitsWithClusters.find((bu) => bu.id === businessUnitId);
};


export const mockUsers: UserType[] = [
    {
        id: "U-1234",
        name: "Sarah Johnson",
        email: "sarah.johnson@luxurycollection.com",
        status: "active",
        lastActive: "2024-03-15T08:30:00Z",
        platformRole: "admin"
    },
    {
        id: "U-1235",
        name: "Michael Chen",
        email: "michael.chen@businesshotels.com",
        status: "active",
        lastActive: "2024-03-15T09:15:00Z",
        platformRole: "admin"
    },
    {
        id: "U-1236",
        name: "Maria Garcia",
        email: "maria.garcia@resortcollection.com",
        status: "active",
        lastActive: "2024-03-15T07:45:00Z",
        platformRole: "admin"
    },
    {
        id: "U-1237",
        name: "John Smith",
        email: "john.smith@luxurycollection.com",
        status: "active",
        lastActive: "2024-03-15T08:00:00Z"
    },
    {
        id: "U-1238",
        name: "Emily Brown",
        email: "emily.brown@businesshotels.com",
        status: "active",
        lastActive: "2024-03-15T09:30:00Z"
    },
    {
        id: "U-1239",
        name: "David Wilson",
        email: "david.wilson@resortcollection.com",
        status: "active",
        lastActive: "2024-03-15T10:00:00Z"
    }
]

export const mockUserRoles: BusinessUnitUserRoleType[] = [
    {
        userId: "U-1234",
        businessUnitId: "BU-1234",
        roles: ["manager", "finance", "inventory"],
        lastUpdated: "2024-03-01T00:00:00Z",
        updatedBy: "supply-chain-system"
    },
    {
        userId: "U-1235",
        businessUnitId: "BU-1235",
        roles: ["manager", "procurement"],
        lastUpdated: "2024-03-01T00:00:00Z",
        updatedBy: "supply-chain-system"
    },
    {
        userId: "U-1236",
        businessUnitId: "BU-1236",
        roles: ["manager", "inventory", "spa-manager"],
        lastUpdated: "2024-03-01T00:00:00Z",
        updatedBy: "supply-chain-system"
    },
    {
        userId: "U-1237",
        businessUnitId: "BU-1234",
        roles: ["inventory", "reports"],
        lastUpdated: "2024-03-01T00:00:00Z",
        updatedBy: "supply-chain-system"
    },
    {
        userId: "U-1238",
        businessUnitId: "BU-1235",
        roles: ["procurement", "reports"],
        lastUpdated: "2024-03-01T00:00:00Z",
        updatedBy: "supply-chain-system"
    },
    {
        userId: "U-1239",
        businessUnitId: "BU-1236",
        roles: ["inventory", "restaurant-manager"],
        lastUpdated: "2024-03-01T00:00:00Z",
        updatedBy: "supply-chain-system"
    }
]


export const mappedUsers = mockUsers.map(user => {
    const userRole = mockUserRoles.find(role => role.userId === user.id);
    return {
        ...user,
        roles: userRole ? userRole.roles : []
    };
});


export const mockUserPlatform: UserPlatformType[] = [
    {
        id: "g3XBVEmN_crP",
        name: "Sarah Johnson",
        email: "sarah.johnson@luxurycollection.com",
        roles: [
            { id: "role_1", name: "manager", status: true },
            { id: "role_2", name: "finance", status: true },
            { id: "role_3", name: "inventory", status: true }
        ],
        business_units: [
            { id: "bu_1", name: "BU-1234" },
            { id: "bu_2", name: "BU-1235" },
            { id: "bu_3", name: "BU-1236" }
        ],
        status: true,
        lastActive: "2024-03-15T08:30:00Z",
        hotelGroup: "Luxury Collection",
        hotel: "The Ritz-Carlton",
        department: "Operations",
        modules: [
            { id: "module_1", name: "supply-chain" },
            { id: "module_2", name: "inventory" },
            { id: "module_3", name: "procurement" }
        ]
    },
    {
        id: "h7YBXEmN_xzT",
        name: "Michael Smith",
        email: "michael.smith@grandresorts.com",
        roles: [{ id: "role_4", name: "admin", status: true }],
        business_units: [{ id: "bu_4", name: "BU-2234" }],
        status: false,
        lastActive: "2024-03-10T12:45:00Z",
        hotelGroup: "Grand Resorts",
        hotel: "Four Seasons",
        department: "IT",
        modules: [
            { id: "module_4", name: "cybersecurity" },
            { id: "module_5", name: "networking" }
        ]
    },
    {
        id: "x9KZLQEmN_yuV",
        name: "Emily Davis",
        email: "emily.davis@elitehotels.com",
        roles: [{ id: "role_6", name: "reception", status: true }],
        business_units: [{ id: "bu_6", name: "BU-3234" }],
        status: true,
        lastActive: "2024-03-17T09:15:00Z",
        hotelGroup: "Elite Hotels",
        hotel: "Mandarin Oriental",
        department: "Front Desk",
        modules: [
            { id: "module_6", name: "reservations" },
            { id: "module_7", name: "customer-service" }
        ]
    },
    {
        id: "b5JTKVEmN_zpW",
        name: "David Brown",
        email: "david.brown@prestigehotels.com",
        roles: [{ id: "role_7", name: "housekeeping", status: true }],
        business_units: [{ id: "bu_7", name: "BU-4234" }],
        status: true,
        lastActive: "2024-03-18T14:20:00Z",
        hotelGroup: "Prestige Hotels",
        hotel: "InterContinental",
        department: "Housekeeping",
        modules: [
            { id: "module_8", name: "cleaning" },
            { id: "module_9", name: "maintenance" }
        ]
    },
    {
        id: "m2PLJXEmN_opD",
        name: "Sophia Wilson",
        email: "sophia.wilson@luxurycollection.com",
        roles: [{ id: "role_9", name: "marketing", status: true }],
        business_units: [
            { id: "bu_8", name: "BU-5234" },
            { id: "bu_9", name: "BU-5235" }
        ],
        status: false,
        lastActive: "2024-03-11T11:10:00Z",
        hotelGroup: "Luxury Collection",
        hotel: "The Peninsula",
        department: "Marketing",
        modules: [
            { id: "module_10", name: "advertising" },
            { id: "module_11", name: "CRM" }
        ]
    },
    {
        id: "w8QTZVEmN_lkH",
        name: "Daniel Martinez",
        email: "daniel.martinez@elitehotels.com",
        roles: [{ id: "role_10", name: "concierge", status: true }],
        business_units: [{ id: "bu_10", name: "BU-6234" }],
        status: true,
        lastActive: "2024-03-19T16:30:00Z",
        hotelGroup: "Elite Hotels",
        hotel: "St. Regis",
        department: "Guest Services",
        modules: [
            { id: "module_12", name: "VIP-services" },
            { id: "module_13", name: "guest-experience" }
        ]
    },
    {
        id: "k3XBVEmN_crL",
        name: "Olivia Anderson",
        email: "olivia.anderson@grandresorts.com",
        roles: [{ id: "role_11", name: "manager", status: true }],
        business_units: [
            { id: "bu_11", name: "BU-7234" },
            { id: "bu_12", name: "BU-7235" }
        ],
        status: true,
        lastActive: "2024-03-20T10:50:00Z",
        hotelGroup: "Grand Resorts",
        hotel: "Bulgari Hotels",
        department: "Events",
        modules: [
            { id: "module_14", name: "wedding-planning" },
            { id: "module_15", name: "conferences" }
        ]
    },
    {
        id: "y5NQAVEmN_mpX",
        name: "James White",
        email: "james.white@prestigehotels.com",
        roles: [{ id: "role_13", name: "security", status: true }],
        business_units: [{ id: "bu_13", name: "BU-8234" }],
        status: false,
        lastActive: "2024-03-09T22:05:00Z",
        hotelGroup: "Prestige Hotels",
        hotel: "JW Marriott",
        department: "Security",
        modules: [
            { id: "module_16", name: "monitoring" },
            { id: "module_17", name: "safety" }
        ]
    },
    {
        id: "v9MLTVEmN_xtF",
        name: "Lucas Harris",
        email: "lucas.harris@grandresorts.com",
        roles: [
            { id: "role_14", name: "finance", status: true },
            { id: "role_15", name: "operations", status: true }
        ],
        business_units: [
            { id: "bu_14", name: "BU-9234" },
            { id: "bu_15", name: "BU-9235" }
        ],
        status: true,
        lastActive: "2024-03-14T18:40:00Z",
        hotelGroup: "Grand Resorts",
        hotel: "The Savoy",
        department: "Finance",
        modules: [
            { id: "module_18", name: "accounting" },
            { id: "module_19", name: "budgeting" }
        ]
    },
    {
        id: "z4PYRVEmN_qwL",
        name: "Emma Scott",
        email: "emma.scott@elitehotels.com",
        roles: [{ id: "role_16", name: "spa", status: true }],
        business_units: [{ id: "bu_16", name: "BU-10234" }],
        status: true,
        lastActive: "2024-03-16T20:55:00Z",
        hotelGroup: "Elite Hotels",
        hotel: "Raffles Hotels",
        department: "Wellness",
        modules: [
            { id: "module_20", name: "spa-management" },
            { id: "module_21", name: "wellness-programs" }
        ]
    }
];

export const platformRoles: ROLE_TYPE[] = [
    {
        id: "platform_role_1",
        name: "Super Admin",
        scope: "Platform",
        permissions: ["Manage Users", "Manage Settings", "View Reports", "Access All Clusters"],
        count_users: 6,
        last_active: "2024-03-15T08:30:00Z"
    },
    {
        id: "platform_role_2",
        name: "Platform Manager",
        scope: "Platform",
        permissions: ["Manage Roles", "View System Logs", "Configure Security"],
        count_users: 8,
        last_active: "2024-03-15T08:30:00Z"
    },
    {
        id: "platform_role_3",
        name: "Compliance Officer",
        scope: "Platform",
        permissions: ["Audit Security", "Review Compliance", "Approve Policies"],
        count_users: 10,
        last_active: "2024-03-15T08:30:00Z"
    },
    {
        id: "platform_role_4",
        name: "Technical Support Lead",
        scope: "Platform",
        permissions: ["View Logs", "Resolve Issues", "Manage Incidents"],
        count_users: 18,
        last_active: "2024-03-15T08:30:00Z"
    },
    {
        id: "platform_role_5",
        name: "Finance Controller",
        scope: "Platform",
        permissions: ["View Financial Reports", "Approve Transactions", "Manage Billing"],
        count_users: 12,
        last_active: "2024-03-15T08:30:00Z"
    }
]

export const clusterRoles: ROLE_TYPE[] = [
    {
        id: "cluster_role_1",
        name: "Cluster Manager",
        scope: "Cluster",
        permissions: [
            "Manage Users",
            "Manage Settings",
            "View Reports",
            "Access All Clusters"
        ],
        count_users: 10,
        last_active: "2024-03-15T08:30:00Z"
    },
    {
        id: "cluster_role_2",
        name: "Regional Manager",
        scope: "Cluster",
        permissions: [
            "View Cluster Performance",
            "Assign Staff to Hotels",
            "Manage Cluster Budget"
        ],
        count_users: 11,
        last_active: "2024-03-15T08:30:00Z"
    },
    {
        id: "cluster_role_3",
        name: "Sales Manager",
        scope: "Cluster",
        permissions: [
            "Manage Sales Targets",
            "Create Sales Reports",
            "Manage Customer Relations"
        ],
        count_users: 12,
        last_active: "2024-03-15T08:30:00Z"
    },
    {
        id: "cluster_role_4",
        name: "Operations Coordinator",
        scope: "Cluster",
        permissions: [
            "Oversee Operations",
            "Manage Reservations",
            "Coordinate Maintenance"
        ],
        count_users: 18,
        last_active: "2024-03-15T08:30:00Z"
    },
    {
        id: "cluster_role_5",
        name: "IT Administrator",
        scope: "Cluster",
        permissions: [
            "Manage Network Infrastructure",
            "Ensure System Security",
            "Support Cluster Software"
        ],
        count_users: 18,
        last_active: "2024-03-15T08:30:00Z"
    },
    {
        id: "cluster_role_6",
        name: "HR Coordinator",
        scope: "Cluster",
        permissions: [
            "Manage Recruitment",
            "Administer Employee Benefits",
            "Monitor Employee Performance"
        ],
        count_users: 5,
        last_active: "2024-03-15T08:30:00Z"
    }
];

export const departmentRoles: ROLE_TYPE[] = [
    {
        id: "department_role_1",
        name: "Department Head",
        scope: "Department",
        permissions: [
            "Manage Department Budget",
            "Oversee Department Operations",
            "Approve Department Reports",
            "Manage Department Staff"
        ],
        count_users: 10,
        last_active: "2024-03-15T08:30:00Z"
    },
    {
        id: "department_role_2",
        name: "Department Manager",
        scope: "Department",
        permissions: [
            "Assign Tasks",
            "Monitor Project Progress",
            "Manage Team Meetings",
            "Handle Department Issues"
        ],
        count_users: 11,
        last_active: "2024-03-15T08:30:00Z"
    },
    {
        id: "department_role_3",
        name: "HR Specialist",
        scope: "Department",
        permissions: [
            "Manage Employee Onboarding",
            "Administer Employee Records",
            "Assist with Recruitment",
            "Resolve Employee Conflicts"
        ],
        count_users: 18,
        last_active: "2024-03-15T08:30:00Z"
    },
    {
        id: "department_role_4",
        name: "Finance Coordinator",
        scope: "Department",
        permissions: [
            "Manage Financial Reports",
            "Track Department Spending",
            "Prepare Financial Budgets",
            "Approve Expenses"
        ],
        count_users: 18,
        last_active: "2024-03-15T08:30:00Z"
    },
    {
        id: "department_role_5",
        name: "IT Support",
        scope: "Department",
        permissions: [
            "Maintain Department Software",
            "Troubleshoot Technical Issues",
            "Provide IT Support for Staff",
            "Manage Department Hardware"
        ],
        count_users: 17,
        last_active: "2024-03-15T08:30:00Z"
    },
    {
        id: "department_role_6",
        name: "Marketing Manager",
        scope: "Department",
        permissions: [
            "Create Marketing Campaigns",
            "Monitor Campaign Performance",
            "Oversee Department Communications",
            "Manage Advertising Budget"
        ],
        count_users: 17,
        last_active: "2024-03-15T08:30:00Z"
    }
];


export const mockAccessControl: AccessControlType = {
    total_users: 100,
    active_modules: 10,
    usage_warning: 3,
    excess_limits: 2,
    modules: [
        {
            name: "Finance",
            hotel_groups: "Pan Pacific",
            users: 20,
            usage: 15,
            active_users: 3,
            status: "active",
            last_active: "2024-03-15T08:30:00Z"
        },
        {
            name: "Inventory",
            hotel_groups: "The Ritz-Carlton",
            users: 15,
            usage: 10,
            active_users: 2,
            status: "Near Limit",
            last_active: "2024-03-15T08:30:00Z"
        },
        {
            name: "Reports",
            hotel_groups: "Four Seasons Hotel",
            users: 10,
            usage: 8,
            active_users: 1,
            status: "Exceeded Limit",
            last_active: "2024-03-15T08:30:00Z"
        },
        {
            name: "Procurement",
            hotel_groups: "Mandarin Oriental",
            users: 20,
            usage: 8,
            active_users: 1,
            status: "Exceeded Limit",
            last_active: "2024-03-15T08:30:00Z"
        },
        {
            name: "Spa",
            hotel_groups: "Shangri-La Hotel",
            users: 10,
            usage: 2,
            active_users: 1,
            status: "Exceeded Limit",
            last_active: "2024-03-15T08:30:00Z"
        },
        {
            name: "Restaurant",
            hotel_groups: "Waldorf Astoria",
            users: 200,
            usage: 20,
            active_users: 1,
            status: "Exceeded Limit",
            last_active: "2024-03-15T08:30:00Z"
        }
    ]
}


export const mockSupport: SupportType = {
    tickets: {
        total: 12,
        new: 2
    },
    average_response_time: {
        time: 2.4,
        response_time: -0.3
    },
    resolution_rate: {
        rate: 94,
        resolution_rate: 2
    },
    critical_issues: {
        total: 3,
        resolved: -1
    },
    support_results: [
        {
            ticket_id: "TICKET-123456",
            subject: "Network Issue",
            tenant: "Pan Pacific",
            status: "open",
            priority: "high",
            assigned: "John Doe",
            created_at: "2024-03-15T08:30:00Z",
            updated_at: "2024-03-15T08:30:00Z",
        },
        {
            ticket_id: "TICKET-123457",
            subject: "Email Not Working",
            tenant: "Grand Hotel",
            status: "open",
            priority: "medium",
            assigned: "Jane Smith",
            created_at: "2024-03-14T10:45:00Z",
            updated_at: "2024-03-14T12:00:00Z",
        },
        {
            ticket_id: "TICKET-123458",
            subject: "Software Installation",
            tenant: "TechCorp",
            status: "open",
            priority: "low",
            assigned: "Mike Johnson",
            created_at: "2024-03-13T14:00:00Z",
            updated_at: "2024-03-13T15:30:00Z",
        },
        {
            ticket_id: "TICKET-123459",
            subject: "Slow Internet",
            tenant: "Greenwood Residences",
            status: "open",
            priority: "high",
            assigned: "Alice Brown",
            created_at: "2024-03-12T09:15:00Z",
            updated_at: "2024-03-12T10:20:00Z",
        },
        {
            ticket_id: "TICKET-123460",
            subject: "Access Denied Issue",
            tenant: "Sunrise Towers",
            status: "open",
            priority: "medium",
            assigned: "Charlie Davis",
            created_at: "2024-03-11T11:45:00Z",
            updated_at: "2024-03-11T12:30:00Z",
        },
        {
            ticket_id: "TICKET-123461",
            subject: "Printer Not Responding",
            tenant: "Blue Sky Offices",
            status: "open",
            priority: "low",
            assigned: "Emma Wilson",
            created_at: "2024-03-10T16:20:00Z",
            updated_at: "2024-03-10T17:00:00Z",
        },
        {
            ticket_id: "TICKET-123462",
            subject: "System Crash",
            tenant: "CloudWorks",
            status: "open",
            priority: "high",
            assigned: "Daniel Lee",
            created_at: "2024-03-09T13:10:00Z",
            updated_at: "2024-03-09T14:45:00Z",
        },
        {
            ticket_id: "TICKET-123463",
            subject: "VPN Connection Issues",
            tenant: "SecureNet",
            status: "open",
            priority: "medium",
            assigned: "Sophia Martinez",
            created_at: "2024-03-08T07:50:00Z",
            updated_at: "2024-03-08T09:00:00Z",
        },
        {
            ticket_id: "TICKET-123464",
            subject: "Website Downtime",
            tenant: "E-Shop Inc.",
            status: "open",
            priority: "high",
            assigned: "Liam Anderson",
            created_at: "2024-03-07T22:30:00Z",
            updated_at: "2024-03-07T23:45:00Z",
        },
        {
            ticket_id: "TICKET-123465",
            subject: "Mobile App Bug",
            tenant: "FinTech Solutions",
            status: "open",
            priority: "medium",
            assigned: "Olivia Taylor",
            created_at: "2024-03-06T15:40:00Z",
            updated_at: "2024-03-06T16:50:00Z",
        },
        {
            ticket_id: "TICKET-123466",
            subject: "Database Backup Failed",
            tenant: "DataGuard",
            status: "open",
            priority: "high",
            assigned: "Noah Harris",
            created_at: "2024-03-05T04:25:00Z",
            updated_at: "2024-03-05T05:30:00Z",
        },
        {
            ticket_id: "TICKET-123467",
            subject: "Login Issue",
            tenant: "CorpSys",
            status: "open",
            priority: "low",
            assigned: "Isabella Walker",
            created_at: "2024-03-04T18:10:00Z",
            updated_at: "2024-03-04T19:20:00Z",
        },
        {
            ticket_id: "TICKET-123468",
            subject: "Server Overload",
            tenant: "MegaCloud",
            status: "open",
            priority: "high",
            assigned: "William Scott",
            created_at: "2025-03-06T09:00:00Z",
            updated_at: "2025-03-06T09:15:00Z",
        },
        {
            ticket_id: "TICKET-123469",
            subject: "Email Synchronization Issue",
            tenant: "EnterpriseX",
            status: "open",
            priority: "medium",
            assigned: "Ava King",
            created_at: "2025-03-06T11:45:00Z",
            updated_at: "2025-03-06T12:00:00Z",
        },
    ],
}

export const mockSettings: SettingsType = {
    general: {
        name: "Carmen",
        email: "support@carmensoftware.com",
        phone: "+6622840429",
        address: {
            house_number: "891/24-25",
            road: "ถนนพระราม 3 (สะพานภูมิพล)",
            sub_district: "บางโพงพาง",
            district: "ยานนาวา",
            province: "กรุงเทพฯ",
            postal_code: "10120",
        }
    },
    localization: {
        language: "th",
        timezone: "Asia/Bangkok",
    },
    maintenance: {
        enabled: true,
        message: "We are currently performing scheduled maintenance. The system will be unavailable for a short period of time. We apologize for any inconvenience this may cause.",
    }
}


export const mockReportAssignment: ReportAssignmentType[] = [
    {
        id: "assignment-1",
        type: "standard",
        status: "active",
        category: "Supply Chain",
        location: "Grand Hotel Downtown • Luxury Collection",
        description: "A daily report tracking inventory stock levels for the Grand Hotel Downtown.",
        frequency: { type: "Daily", nextReport: "2024-03-25" }
    },
    {
        id: "assignment-2",
        type: "custom",
        status: "inactive",
        category: "Warehouse Management",
        location: "Sunset Resort & Spa",
        description: "A custom stock level report for warehouse tracking.",
        frequency: { type: "Weekly", nextReport: "2024-03-30" }
    },
    {
        id: "assignment-3",
        type: "premium",
        status: "active",
        category: "Hotel Operations",
        location: "Ocean View Hotel",
        description: "A premium report providing detailed stock insights.",
        frequency: { type: "Monthly", nextReport: "2024-04-01" }
    },
    {
        id: "assignment-4",
        type: "basic",
        status: "active",
        category: "Supply Chain",
        location: "Mountain Lodge Retreat",
        description: "A basic stock level report for essential tracking.",
        frequency: { type: "Daily", nextReport: "2024-03-26" }
    },
    {
        id: "assignment-5",
        type: "detailed",
        status: "inactive",
        category: "Inventory Control",
        location: "City Center Suites",
        description: "A detailed stock level analysis report.",
        frequency: { type: "Quarterly", nextReport: "2024-06-30" }
    },
    {
        id: "assignment-6",
        type: "summary",
        status: "active",
        category: "Retail Stock",
        location: "Luxury Boutique Mall",
        description: "A summary report for retail inventory levels.",
        frequency: { type: "Weekly", nextReport: "2024-03-28" }
    },
    {
        id: "assignment-7",
        type: "custom",
        status: "active",
        category: "Warehouse Management",
        location: "Green Valley Hotel",
        description: "A custom warehouse stock report for tracking supplies.",
        frequency: { type: "Bi-Weekly", nextReport: "2024-04-05" }
    },
    {
        id: "assignment-8",
        type: "premium",
        status: "inactive",
        category: "Resort Inventory",
        location: "Tropical Paradise Resort",
        description: "A premium stock analysis report for resort supply chain.",
        frequency: { type: "Monthly", nextReport: "2024-04-10" }
    },
    {
        id: "assignment-9",
        type: "basic",
        status: "active",
        category: "Supply Chain",
        location: "Desert Mirage Hotel",
        description: "A basic inventory report for tracking essentials.",
        frequency: { type: "Daily", nextReport: "2024-03-27" }
    },
    {
        id: "assignment-10",
        type: "standard",
        status: "active",
        category: "Hotel Operations",
        location: "Skyline Business Hotel",
        description: "A standard report for business hotel stock levels.",
        frequency: { type: "Weekly", nextReport: "2024-03-29" }
    }
];


export const mockReportBusinessUnit: ReportClusterType[] = [
    {
        id: "clu_1ApXyZ",
        cluster: "APAC",
        business_unit: [
            {
                id: "bu_2BkLwP",
                name: "Grand Hotel Downtown",
                description: "A luxury hotel in the heart of the city.",
                reports: [
                    {
                        id: "rep_3CmNvQ",
                        title: "Inventory Stock Level",
                        type: "standard",
                        status: "active",
                        category: "Supply Chain",
                    },
                    {
                        id: "rep_4DpOwR",
                        title: "Quarterly Financial Report",
                        type: "detailed",
                        status: "inactive",
                        category: "Finance",
                    },
                ],
            },
            {
                id: "bu_5EqPxS",
                name: "Sunset Resort & Spa",
                description: "A tropical resort offering luxury accommodations.",
                reports: [
                    {
                        id: "rep_6FrQyT",
                        title: "Guest Amenities Stock",
                        type: "custom",
                        status: "active",
                        category: "Hotel Operations",
                    },
                    {
                        id: "rep_7GsRzU",
                        title: "Monthly Revenue Report",
                        type: "summary",
                        status: "active",
                        category: "Finance",
                    },
                ],
            },
        ],
    },
    {
        id: "clu_8HtSyV",
        cluster: "EMEA",
        business_unit: [
            {
                id: "bu_9JtTyW",
                name: "Ocean View Hotel",
                description: "A coastal luxury hotel with breathtaking views.",
                reports: [
                    {
                        id: "rep_10KuUyX",
                        title: "Food & Beverage Inventory",
                        type: "premium",
                        status: "active",
                        category: "Restaurant Management",
                    },
                ],
            },
            {
                id: "bu_11LvVyY",
                name: "Mountain Lodge Retreat",
                description: "A cozy lodge surrounded by nature.",
                reports: [
                    {
                        id: "rep_12MwWyZ",
                        title: "Housekeeping Supply Report",
                        type: "basic",
                        status: "inactive",
                        category: "Hotel Operations",
                    },
                    {
                        id: "rep_13NxXyA",
                        title: "Winter Seasonal Report",
                        type: "detailed",
                        status: "active",
                        category: "Resort Management",
                    },
                ],
            },
        ],
    },
    {
        id: "clu_14OyYzB",
        cluster: "AMER",
        business_unit: [
            {
                id: "bu_15PzZyC",
                name: "Skyline Business Hotel",
                description: "A business-oriented hotel in the city center.",
                reports: [
                    {
                        id: "rep_16QyAzD",
                        title: "Corporate Event Scheduling",
                        type: "custom",
                        status: "active",
                        category: "Event Management",
                    },
                    {
                        id: "rep_17RyBzE",
                        title: "Monthly Business Travel Analysis",
                        type: "summary",
                        status: "inactive",
                        category: "Travel Insights",
                    },
                ],
            },
            {
                id: "bu_18SyCzF",
                name: "Desert Mirage Hotel",
                description: "A luxury desert retreat offering unique experiences.",
                reports: [
                    {
                        id: "rep_19TyDzG",
                        title: "Energy Consumption Report",
                        type: "detailed",
                        status: "active",
                        category: "Sustainability",
                    },
                ],
            },
        ],
    },
];


export const mockReportTemplates: ReportTemplateType[] = [
    {
        id: "rep_1AaBbCc",
        name: "Daily Room Occupancy Report",
        category: "Hotel Operations",
        schedule: "Daily",
        data_points: 150,
        assigned_to: [
            { name: "Front Desk Manager" },
            { name: "Operations Supervisor" },
        ],
        status: "active",
        last_updated: "2025-03-01T10:30:00Z",
        created_at: "2025-02-20T08:00:00Z",
        updated_at: "2025-03-01T10:30:00Z",
    },
    {
        id: "rep_2DdEeFf",
        name: "Monthly Revenue Analysis",
        category: "Finance",
        schedule: "Monthly",
        data_points: 320,
        assigned_to: [
            { name: "Finance Manager" },
            { name: "General Manager" },
        ],
        status: "active",
        last_updated: "2025-02-28T18:45:00Z",
        created_at: "2025-01-05T09:15:00Z",
        updated_at: "2025-02-28T18:45:00Z",
    },
    {
        id: "rep_3GgHhIi",
        name: "Quarterly Customer Feedback Report",
        category: "Guest Experience",
        schedule: "Quarterly",
        data_points: 200,
        assigned_to: [
            { name: "Guest Relations Manager" },
            { name: "Marketing Director" },
        ],
        status: "draft",
        last_updated: "2025-02-15T14:20:00Z",
        created_at: "2024-12-01T11:30:00Z",
        updated_at: "2025-02-15T14:20:00Z",
    },
    {
        id: "rep_4JjKkLl",
        name: "Annual Housekeeping Efficiency Report",
        category: "Housekeeping",
        schedule: "Annually",
        data_points: 450,
        assigned_to: [
            { name: "Housekeeping Director" },
            { name: "Operations Director" },
        ],
        status: "active",
        last_updated: "2025-01-10T09:50:00Z",
        created_at: "2024-12-20T07:40:00Z",
        updated_at: "2025-01-10T09:50:00Z",
    },
    {
        id: "rep_5MmNnOo",
        name: "Energy Consumption Report",
        category: "Sustainability",
        schedule: "Monthly",
        data_points: 275,
        assigned_to: [
            { name: "Facility Manager" },
            { name: "Sustainability Coordinator" },
        ],
        status: "active",
        last_updated: "2025-02-27T17:00:00Z",
        created_at: "2024-11-15T12:10:00Z",
        updated_at: "2025-02-27T17:00:00Z",
    },
    {
        id: "rep_6PpQqRr",
        name: "Food & Beverage Inventory Report",
        category: "Restaurant Management",
        schedule: "Weekly",
        data_points: 180,
        assigned_to: [
            { name: "Executive Chef" },
            { name: "Food & Beverage Director" },
        ],
        status: "draft",
        last_updated: "2025-03-03T08:30:00Z",
        created_at: "2025-02-10T06:20:00Z",
        updated_at: "2025-03-03T08:30:00Z",
    },
    {
        id: "rep_7SsTtUu",
        name: "Guest Demographics Analysis",
        category: "Marketing",
        schedule: "Quarterly",
        data_points: 390,
        assigned_to: [
            { name: "Marketing Manager" },
            { name: "Sales Director" },
        ],
        status: "active",
        last_updated: "2025-02-20T16:15:00Z",
        created_at: "2024-10-05T10:00:00Z",
        updated_at: "2025-02-20T16:15:00Z",
    },
    {
        id: "rep_8UuVvWw",
        name: "Safety & Security Audit Report",
        category: "Security",
        schedule: "Annually",
        data_points: 500,
        assigned_to: [
            { name: "Security Chief" },
            { name: "Operations Director" },
        ],
        status: "draft",
        last_updated: "2025-01-25T13:05:00Z",
        created_at: "2024-09-01T09:30:00Z",
        updated_at: "2025-01-25T13:05:00Z",
    },
    {
        id: "rep_9WwXxYy",
        name: "Employee Satisfaction Survey Results",
        category: "Human Resources",
        schedule: "Biannually",
        data_points: 280,
        assigned_to: [
            { name: "HR Manager" },
            { name: "General Manager" },
        ],
        status: "active",
        last_updated: "2025-03-05T11:40:00Z",
        created_at: "2024-08-15T07:50:00Z",
        updated_at: "2025-03-05T11:40:00Z",
    },
    {
        id: "rep_10YyZzAa",
        name: "Local Market Competitor Analysis",
        category: "Sales & Marketing",
        schedule: "Monthly",
        data_points: 320,
        assigned_to: [
            { name: "Sales Manager" },
            { name: "Marketing Director" },
        ],
        status: "active",
        last_updated: "2025-03-02T15:25:00Z",
        created_at: "2024-07-10T12:30:00Z",
        updated_at: "2025-03-02T15:25:00Z",
    },
];

export const mockTemplateReports: TemplateReportType[] = [
    {
        id: "nanaid-1a2b3c",
        title: "Luxury Resort Analysis",
        description: "A comprehensive report on luxury resort performance.",
        type: "Financial",
        count_assigned: 5,
        last_updated: "2025-03-07T10:00:00Z",
        created_at: "2025-02-20T08:30:00Z",
        updated_at: "2025-03-05T14:45:00Z",
    },
    {
        id: "nanaid-4d5e6f",
        title: "Budget Hotel Occupancy",
        description: "Insights into budget hotel booking trends.",
        type: "Operational",
        count_assigned: 3,
        last_updated: "2025-03-06T09:15:00Z",
        created_at: "2025-01-15T07:20:00Z",
        updated_at: "2025-03-06T09:15:00Z",
    },
    {
        id: "nanaid-7g8h9i",
        title: "Guest Satisfaction Survey",
        description: "An overview of guest feedback across multiple hotels.",
        type: "Customer",
        count_assigned: 8,
        last_updated: "2025-02-28T16:30:00Z",
        created_at: "2025-01-10T10:00:00Z",
        updated_at: "2025-02-28T16:30:00Z",
    },
    {
        id: "nanaid-a1b2c3",
        title: "Hotel Revenue Breakdown",
        description: "An analysis of revenue sources within hotels.",
        type: "Financial",
        count_assigned: 6,
        last_updated: "2025-03-03T13:00:00Z",
        created_at: "2025-02-01T09:45:00Z",
        updated_at: "2025-03-03T13:00:00Z",
    },
    {
        id: "nanaid-d4e5f6",
        title: "Seasonal Booking Trends",
        description: "A study on how seasonal factors affect bookings.",
        type: "Research",
        count_assigned: 4,
        last_updated: "2025-02-25T11:20:00Z",
        created_at: "2025-01-05T12:15:00Z",
        updated_at: "2025-02-25T11:20:00Z",
    },
    {
        id: "nanaid-g7h8i9",
        title: "Housekeeping Efficiency",
        description: "A report on housekeeping performance and efficiency.",
        type: "Operational",
        count_assigned: 7,
        last_updated: "2025-03-04T15:10:00Z",
        created_at: "2025-01-25T10:30:00Z",
        updated_at: "2025-03-04T15:10:00Z",
    },
    {
        id: "nanaid-j1k2l3",
        title: "Hotel Competitor Benchmarking",
        description: "Comparison of hotel performance against competitors.",
        type: "Market",
        count_assigned: 5,
        last_updated: "2025-03-02T08:50:00Z",
        created_at: "2025-02-12T07:00:00Z",
        updated_at: "2025-03-02T08:50:00Z",
    },
    {
        id: "nanaid-m4n5o6",
        title: "Online Review Impact Study",
        description: "The effect of online reviews on hotel bookings.",
        type: "Customer",
        count_assigned: 9,
        last_updated: "2025-02-27T17:30:00Z",
        created_at: "2025-01-08T14:00:00Z",
        updated_at: "2025-02-27T17:30:00Z",
    },
    {
        id: "nanaid-p7q8r9",
        title: "Hotel Energy Consumption",
        description: "Tracking energy usage across hotel properties.",
        type: "Sustainability",
        count_assigned: 2,
        last_updated: "2025-03-01T12:40:00Z",
        created_at: "2025-02-05T10:30:00Z",
        updated_at: "2025-03-01T12:40:00Z",
    },
    {
        id: "nanaid-s1t2u3",
        title: "Luxury Suite Booking Patterns",
        description: "Trends in luxury suite reservations and spending.",
        type: "Financial",
        count_assigned: 6,
        last_updated: "2025-03-06T14:20:00Z",
        created_at: "2025-01-20T09:10:00Z",
        updated_at: "2025-03-06T14:20:00Z",
    },
];

