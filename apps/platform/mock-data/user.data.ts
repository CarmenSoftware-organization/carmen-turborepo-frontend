import { BusinessUnitUserDto, ClusterUserDto, PlatformUserDto } from "@/dto/user.dto";

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
                name: "Marketing Campaigns"
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
                name: "System Administration"
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
