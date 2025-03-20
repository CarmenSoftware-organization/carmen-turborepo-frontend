export interface ClusterDto {
    id: string;
    name: string;
    region: string;
    status: string;
    active_bu: number;
    total_rooms: number;
    total_employees: number;
    avg_unit: number;
    createdAt: string;
    updatedAt: string;
}

export interface ReportTemplateDto {
    id: string;
    title: string;
    department: string;
    description: string;
    assigned_cluster: number;
    createdAt: string;
    updatedAt: string;
}

export interface ClusterMemberDto {
    id: string;
    name: string;
    email: string;
    platform_role: string;
    bu_role: string;
    status: boolean;
    last_active: string;
}
