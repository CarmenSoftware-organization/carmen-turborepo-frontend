import { StatusDashboard } from "@/dto/dashboard";

export const statusDashboard: StatusDashboard[] = [
    {
        id: "db-001",
        title: "Total Reports",
        value: "2345",
        description: "Generated this month",
        icon: "FileText",
    },
    {
        id: "db-002",
        title: "Business Units",
        value: "24",
        description: "Across all clusters",
        icon: "Building2",
    },
    {
        id: "db-003",
        title: "Active Clusters",
        value: "3",
        description: "APAC, EMEA, Americas",
        icon: "FolderTree",
    },
    {
        id: "db-004",
        title: "Total Users",
        value: "573",
        description: "Active this month",
        icon: "Users",
    },
];