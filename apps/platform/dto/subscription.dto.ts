export interface SubscriptionDto {
    id: string;
    name: string;
    status: boolean;
    description: string;
    price: number;
    period: string;
    next_billing_date: string;
    active_module: [
        {
            id: string;
            name: string;
        }
    ],
    total_users: number;
    bu_users: number;
    cluster_users: number;
    platform_users: number;
    created_at: string;
    updated_at: string;
}


export interface SubscriptionUsageDto {
    id: string;
    hotel_name: string;
    user_license: number;
    used_user_license: number;
    module_license: number;
    used_module_license: number;
    storage_license: number;
    used_storage_license: number;
}


export interface UsageData {
    month: string
    users: number
    storage: number
}

export interface SubscriptionReportDto {
    subscription: number;
    new_subscription: number;
    revenue: number;
    new_revenue: number;
    bu: number;
    new_bu: number;
    cluster: number;
    new_cluster: number;
}

export interface SubscriptionTrendData {
    month: string;
    active: number;
    inactive: number;
    total: number;
}

export interface ClusterDistributionData {
    name: string;
    value: number;
}

export interface LicenseUtilizationDataDto {
    id: string;
    name: string;
    buStaff: number;
    buStaffMax: number;
    clusterUsers: number;
    clusterUsersMax: number;
}
