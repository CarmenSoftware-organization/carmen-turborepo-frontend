import { ClusterDto, ClusterMemberDto, ReportTemplateDto } from "@/dto/cluster.dto";

export const mockClusters: ClusterDto[] = [
    {
        id: "oiaoidhj",
        name: "Cluster 1",
        region: "US-East",
        status: "Active",
        active_bu: 1,
        total_rooms: 100,
        total_employees: 100,
        avg_unit: 100,
        createdAt: "2021-01-01",
        updatedAt: "2021-01-01"
    },
    {
        id: "n82jd9sk",
        name: "Cluster 2",
        region: "US-West",
        status: "Active",
        active_bu: 3,
        total_rooms: 150,
        total_employees: 215,
        avg_unit: 72,
        createdAt: "2021-02-15",
        updatedAt: "2022-05-12"
    },
    {
        id: "p39dkslq",
        name: "Cluster 3",
        region: "Europe-Central",
        status: "Maintenance",
        active_bu: 2,
        total_rooms: 85,
        total_employees: 120,
        avg_unit: 60,
        createdAt: "2021-03-22",
        updatedAt: "2023-01-04"
    },
    {
        id: "h7jfn3ld",
        name: "Cluster 4",
        region: "Asia-Pacific",
        status: "Active",
        active_bu: 4,
        total_rooms: 210,
        total_employees: 320,
        avg_unit: 80,
        createdAt: "2021-04-10",
        updatedAt: "2022-11-30"
    },
    {
        id: "m4kd9s7a",
        name: "Cluster 5",
        region: "Canada",
        status: "Inactive",
        active_bu: 0,
        total_rooms: 75,
        total_employees: 0,
        avg_unit: 0,
        createdAt: "2021-06-18",
        updatedAt: "2023-03-15"
    },
    {
        id: "g57dk2ps",
        name: "Cluster 6",
        region: "South America",
        status: "Active",
        active_bu: 2,
        total_rooms: 95,
        total_employees: 130,
        avg_unit: 65,
        createdAt: "2021-08-05",
        updatedAt: "2022-09-22"
    },
    {
        id: "y38sdl2k",
        name: "Cluster 7",
        region: "US-Central",
        status: "Active",
        active_bu: 3,
        total_rooms: 175,
        total_employees: 245,
        avg_unit: 82,
        createdAt: "2021-09-14",
        updatedAt: "2023-02-28"
    },
    {
        id: "z92kds7l",
        name: "Cluster 8",
        region: "Europe-North",
        status: "Pending",
        active_bu: 1,
        total_rooms: 120,
        total_employees: 50,
        avg_unit: 120,
        createdAt: "2021-10-30",
        updatedAt: "2022-12-10"
    },
    {
        id: "b47slp0d",
        name: "Cluster 9",
        region: "Middle East",
        status: "Active",
        active_bu: 2,
        total_rooms: 110,
        total_employees: 185,
        avg_unit: 92,
        createdAt: "2021-11-25",
        updatedAt: "2023-04-05"
    },
    {
        id: "q73jdnc9",
        name: "Cluster 10",
        region: "Australia",
        status: "Maintenance",
        active_bu: 1,
        total_rooms: 90,
        total_employees: 115,
        avg_unit: 90,
        createdAt: "2021-12-17",
        updatedAt: "2022-10-08"
    }
]

export const mockReportTemplates: ReportTemplateDto[] = [
    {
        id: "oiaoidhj",
        title: "Report Template 1",
        department: "Sales",
        description: "Report Template 1 Description",
        assigned_cluster: 12,
        createdAt: "2021-01-01",
        updatedAt: "2021-01-01"
    },
    {
        id: "ppasdas9",
        title: "Report Template 1",
        department: "Sales",
        description: "Report Template 1 Description",
        assigned_cluster: 1,
        createdAt: "2021-01-01",
        updatedAt: "2021-01-01"
    },
    {
        id: "989asdk",
        title: "Report Template 1",
        department: "Sales",
        description: "Report Template 1 Description",
        assigned_cluster: 10,
        createdAt: "2021-01-01",
        updatedAt: "2021-01-01"
    }
]

export const mockClusterMembers: ClusterMemberDto[] = [
    {
        id: "mb-111",
        name: "John Doe",
        email: "john.doe@example.com",
        platform_role: "Admin",
        bu_role: "General Manager",
        status: true,
        last_active: "2023-05-15",
    },
    {
        id: "mb-222",
        name: "Emma Wilson",
        email: "emma.wilson@example.com",
        platform_role: "Manager",
        bu_role: "Operations Director",
        status: true,
        last_active: "2023-05-18",
    },
    {
        id: "mb-333",
        name: "Michael Chen",
        email: "michael.chen@example.com",
        platform_role: "User",
        bu_role: "Front Desk Manager",
        status: true,
        last_active: "2023-05-10",
    },
    {
        id: "mb-444",
        name: "Sophia Rodriguez",
        email: "sophia.rodriguez@example.com",
        platform_role: "Manager",
        bu_role: "HR Director",
        status: true,
        last_active: "2023-05-17",
    },
    {
        id: "mb-555",
        name: "Alexander Kim",
        email: "alexander.kim@example.com",
        platform_role: "User",
        bu_role: "Maintenance Supervisor",
        status: false,
        last_active: "2023-04-22",
    },
    {
        id: "mb-666",
        name: "Olivia Johnson",
        email: "olivia.johnson@example.com",
        platform_role: "Admin",
        bu_role: "Regional Director",
        status: true,
        last_active: "2023-05-19",
    },
    {
        id: "mb-777",
        name: "William Smith",
        email: "william.smith@example.com",
        platform_role: "User",
        bu_role: "Financial Analyst",
        status: true,
        last_active: "2023-05-12",
    },
    {
        id: "mb-888",
        name: "Ava Martinez",
        email: "ava.martinez@example.com",
        platform_role: "User",
        bu_role: "Housekeeping Manager",
        status: false,
        last_active: "2023-03-30",
    },
    {
        id: "mb-999",
        name: "James Taylor",
        email: "james.taylor@example.com",
        platform_role: "Manager",
        bu_role: "Food & Beverage Director",
        status: true,
        last_active: "2023-05-16",
    },
    {
        id: "mb-000",
        name: "Isabella Brown",
        email: "isabella.brown@example.com",
        platform_role: "User",
        bu_role: "Sales Coordinator",
        status: true,
        last_active: "2023-05-14",
    }
]
