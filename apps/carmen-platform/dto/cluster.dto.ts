export interface ClusterDto {
    name: string;
    code: string;
    is_active: boolean;
}

export interface GetClusterDto extends ClusterDto {
    id: string;
}
