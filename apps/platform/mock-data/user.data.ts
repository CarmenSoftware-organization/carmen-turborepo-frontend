import { BusinessUnitUserDto, ClusterUserDto, PlatformUserDto, RoleDto } from "@/dto/user.dto";

export const platformUserMockData: PlatformUserDto[] = [
    {
        id: "p001",
        name: "John Smith",
        email: "john.smith@hotelcorp.com",
        role: "Admin",
        bu_name: "Corporate Headquarters",
        status: true,
        last_active: "2023-10-15T14:32:01Z"
    },
    {
        id: "p002",
        name: "Sarah Johnson",
        email: "sarah.johnson@hotelcorp.com",
        role: "Finance Manager",
        bu_name: "Finance Department",
        status: true,
        last_active: "2023-10-16T09:45:22Z"
    },
    {
        id: "p003",
        name: "Michael Chen",
        email: "michael.chen@hotelcorp.com",
        role: "IT Director",
        bu_name: "IT Department",
        status: true,
        last_active: "2023-10-14T16:20:45Z"
    },
    {
        id: "p004",
        name: "Lisa Wong",
        email: "lisa.wong@hotelcorp.com",
        role: "HR Director",
        bu_name: "Human Resources",
        status: false,
        last_active: "2023-09-30T11:15:30Z"
    },
    {
        id: "p005",
        name: "Robert Garcia",
        email: "robert.garcia@hotelcorp.com",
        role: "Operations Manager",
        bu_name: "Operations",
        status: true,
        last_active: "2023-10-16T13:05:12Z"
    }
]

export const clusterUserMockData: ClusterUserDto[] = [
    {
        id: "c001",
        name: "Emma Davis",
        email: "emma.davis@luxuryresorts.com",
        hotel_group: "Luxury Resorts Collection",
        role: "Cluster Manager",
        module: [
            {
                id: "m001",
                name: "Reservations"
            }
        ],
        status: true,
        last_active: "2023-10-16T08:45:11Z"
    },
    {
        id: "c002",
        name: "David Wilson",
        email: "david.wilson@citystays.com",
        hotel_group: "City Stays Group",
        role: "Financial Controller",
        module: [
            {
                id: "m003",
                name: "Accounting"
            },
            {
                id: "m004",
                name: "Administration"
            }
        ],
        status: true,
        last_active: "2023-10-15T16:30:05Z"
    },
    {
        id: "c003",
        name: "Jessica Martinez",
        email: "jessica.martinez@beachresorts.com",
        hotel_group: "Beach Resorts International",
        role: "Marketing Director",
        module: [
            {
                id: "m005",
                name: "Marketing"
            }
        ],
        status: true,
        last_active: "2023-10-14T09:20:45Z"
    },
    {
        id: "c004",
        name: "Thomas Brown",
        email: "thomas.brown@mountainretreats.com",
        hotel_group: "Mountain Retreats",
        role: "IT Manager",
        module: [
            {
                id: "m007",
                name: "Administration"
            }
        ],
        status: false,
        last_active: "2023-09-28T11:10:33Z"
    },
    {
        id: "c005",
        name: "Anna Rodriguez",
        email: "anna.rodriguez@businesshotels.com",
        hotel_group: "Business Hotels Alliance",
        role: "HR Coordinator",
        module: [
            {
                id: "m009",
                name: "Recruitment"
            }
        ],
        status: true,
        last_active: "2023-10-15T14:45:22Z"
    }
]

export const businessUnitUserMockData: BusinessUnitUserDto[] = [
    {
        id: "bu001",
        name: "Carlos Mendez",
        email: "carlos.mendez@grandhyatt.com",
        cluster_name: "Luxury Resorts Collection",
        hotel_name: "Grand Hyatt Downtown",
        department: "Front Office",
        role: "Front Desk Manager",
        module: [
            {
                id: "m011",
                name: "Check-in/Check-out"
            }
        ],
        status: true,
        last_active: "2023-10-16T07:30:15Z"
    },
    {
        id: "bu002",
        name: "Sophia Kim",
        email: "sophia.kim@prestigehotel.com",
        cluster_name: "City Stays Group",
        hotel_name: "Prestige Hotel & Spa",
        department: "Food & Beverage",
        role: "Restaurant Manager",
        module: [
            {
                id: "m013",
                name: "Restaurant Reservations"
            }
        ],
        status: true,
        last_active: "2023-10-15T19:40:22Z"
    },
    {
        id: "bu003",
        name: "James Taylor",
        email: "james.taylor@palmresort.com",
        cluster_name: "Beach Resorts International",
        hotel_name: "Palm Beach Resort",
        department: "Housekeeping",
        role: "Executive Housekeeper",
        module: [
            {
                id: "m015",
                name: "Room Cleaning"
            }
        ],
        status: true,
        last_active: "2023-10-14T16:15:30Z"
    },
    {
        id: "bu004",
        name: "Olivia Parker",
        email: "olivia.parker@alpinelodge.com",
        cluster_name: "Mountain Retreats",
        hotel_name: "Alpine Lodge & Spa",
        department: "Spa & Wellness",
        role: "Spa Director",
        module: [
            {
                id: "m017",
                name: "Appointment Scheduling"
            }
        ],
        status: false,
        last_active: "2023-10-01T10:05:45Z"
    },
    {
        id: "bu005",
        name: "Daniel Lee",
        email: "daniel.lee@executivesuites.com",
        cluster_name: "Business Hotels Alliance",
        hotel_name: "Executive Suites",
        department: "Sales",
        role: "Sales Manager",
        module: [
            {
                id: "m019",
                name: "Corporate Accounts"
            }
        ],
        status: true,
        last_active: "2023-10-16T11:25:40Z"
    },
    {
        id: "bu006",
        name: "Rachel White",
        email: "rachel.white@seasideresort.com",
        cluster_name: "Beach Resorts International",
        hotel_name: "Seaside Resort & Marina",
        department: "Maintenance",
        role: "Facilities Manager",
        module: [
            {
                id: "m021",
                name: "Work Orders"
            }
        ],
        status: true,
        last_active: "2023-10-15T13:50:18Z"
    }
]

export const mockRolePlatform: RoleDto[] = [
    {
        id: "plat-001",
        name: "Platform Admin",
        scope: "platform",
        permissions: [
            { id: "perm-001", name: "Manage Users" },
            { id: "perm-002", name: "Manage System Settings" },
            { id: "perm-003", name: "View Reports" },
        ],
        total_users: 5,
        last_active: "2025-03-17T12:30:00Z",
    },
    {
        id: "plat-002",
        name: "Super Admin",
        scope: "platform",
        permissions: [
            { id: "perm-004", name: "Full Access" },
            { id: "perm-005", name: "Manage Integrations" },
        ],
        total_users: 2,
        last_active: "2025-03-18T09:00:00Z",
    },
    {
        id: "plat-003",
        name: "Finance Controller",
        scope: "platform",
        permissions: [
            { id: "perm-006", name: "Manage Financial Reports" },
            { id: "perm-007", name: "Approve Budgets" },
        ],
        total_users: 3,
        last_active: "2025-03-15T10:20:00Z",
    },
    {
        id: "plat-004",
        name: "IT Administrator",
        scope: "platform",
        permissions: [
            { id: "perm-008", name: "Manage Servers" },
            { id: "perm-009", name: "Handle Security Protocols" },
        ],
        total_users: 4,
        last_active: "2025-03-14T14:45:00Z",
    },
    {
        id: "plat-005",
        name: "Support Manager",
        scope: "platform",
        permissions: [
            { id: "perm-010", name: "Handle Customer Queries" },
            { id: "perm-011", name: "Manage Support Tickets" },
        ],
        total_users: 6,
        last_active: "2025-03-13T16:00:00Z",
    },
];

export const mockRoleCluster: RoleDto[] = [
    {
        id: "clus-001",
        name: "Cluster Manager",
        scope: "cluster",
        permissions: [
            { id: "perm-012", name: "Manage Multiple Hotels" },
            { id: "perm-013", name: "Monitor Hotel Performance" },
        ],
        total_users: 8,
        last_active: "2025-03-16T15:45:00Z",
    },
    {
        id: "clus-002",
        name: "Operations Head",
        scope: "cluster",
        permissions: [
            { id: "perm-014", name: "Oversee Daily Operations" },
            { id: "perm-015", name: "Handle Crisis Management" },
        ],
        total_users: 5,
        last_active: "2025-03-17T08:30:00Z",
    },
    {
        id: "clus-003",
        name: "Regional Sales Manager",
        scope: "cluster",
        permissions: [
            { id: "perm-016", name: "Manage Sales Strategies" },
            { id: "perm-017", name: "Track Revenue Growth" },
        ],
        total_users: 7,
        last_active: "2025-03-15T12:10:00Z",
    },
    {
        id: "clus-004",
        name: "HR Coordinator",
        scope: "cluster",
        permissions: [
            { id: "perm-018", name: "Handle Employee Relations" },
            { id: "perm-019", name: "Recruitment & Training" },
        ],
        total_users: 6,
        last_active: "2025-03-14T18:20:00Z",
    },
    {
        id: "clus-005",
        name: "Procurement Head",
        scope: "cluster",
        permissions: [
            { id: "perm-020", name: "Manage Supplier Contracts" },
            { id: "perm-021", name: "Monitor Inventory Levels" },
        ],
        total_users: 4,
        last_active: "2025-03-12T09:50:00Z",
    },
];

export const mockRoleDepartment: RoleDto[] = [
    {
        id: "dept-001",
        name: "Front Desk Supervisor",
        scope: "department",
        permissions: [
            { id: "perm-022", name: "Manage Check-ins/Check-outs" },
            { id: "perm-023", name: "Handle Guest Complaints" },
        ],
        total_users: 10,
        last_active: "2025-03-16T07:30:00Z",
    },
    {
        id: "dept-002",
        name: "Housekeeping Manager",
        scope: "department",
        permissions: [
            { id: "perm-024", name: "Schedule Cleaning Services" },
            { id: "perm-025", name: "Maintain Room Standards" },
        ],
        total_users: 12,
        last_active: "2025-03-17T14:10:00Z",
    },
    {
        id: "dept-003",
        name: "Restaurant Supervisor",
        scope: "department",
        permissions: [
            { id: "perm-026", name: "Oversee Food Service" },
            { id: "perm-027", name: "Monitor Inventory & Orders" },
        ],
        total_users: 8,
        last_active: "2025-03-15T13:00:00Z",
    },
    {
        id: "dept-004",
        name: "Spa & Wellness Coordinator",
        scope: "department",
        permissions: [
            { id: "perm-028", name: "Manage Spa Bookings" },
            { id: "perm-029", name: "Ensure Health & Safety Compliance" },
        ],
        total_users: 6,
        last_active: "2025-03-14T10:40:00Z",
    },
    {
        id: "dept-005",
        name: "Maintenance Supervisor",
        scope: "department",
        permissions: [
            { id: "perm-030", name: "Oversee Hotel Repairs" },
            { id: "perm-031", name: "Manage Utility Systems" },
        ],
        total_users: 7,
        last_active: "2025-03-13T15:20:00Z",
    },
];




