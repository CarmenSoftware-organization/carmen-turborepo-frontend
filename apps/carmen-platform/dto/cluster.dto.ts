export interface ClusterDto {
    name: string;
    code: string;
    is_active: boolean;
    _count: {
        tb_business_unit: number;
        tb_cluster_user: number;
    };
}

export interface GetClusterDto extends ClusterDto {
    id: string;
}
