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
