import { ReportAssignmentType, ReportClusterType, ReportTemplateType } from "@/dto/report.dto";

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
