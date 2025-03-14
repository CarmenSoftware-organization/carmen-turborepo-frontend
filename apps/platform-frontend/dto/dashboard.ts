export interface StatusDashboard {
    id: string;
    title: string;
    value: string;
    description: string;
    icon: string;
}


export interface ReportOverview {
    today: number;
    thisWeek: number;
    active: number;
    uptime: number;
}

export interface ClusterOverview {
    name: string;
    businessUnits: number;
    status: string;
}

export interface RecentActivity {
    title: string;
    description: string;
    cluster: string;
    create_at: string;
}

