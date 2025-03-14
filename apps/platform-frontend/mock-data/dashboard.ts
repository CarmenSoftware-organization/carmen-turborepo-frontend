import { ClusterOverview, RecentActivity, ReportOverview, StatusDashboard } from "@/dto/dashboard";

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

export const reportOverview: ReportOverview = {
    today: 5,
    thisWeek: 12,
    active: 3,
    uptime: 99.9,
}

export const clusterOverview: ClusterOverview[] = [
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


export const recentActivity: RecentActivity[] = [
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

