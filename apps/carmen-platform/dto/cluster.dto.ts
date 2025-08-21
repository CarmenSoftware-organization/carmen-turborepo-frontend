// Get All Clusters
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


export interface ClusterDtoId {
    id: string;
    name: string;
    code: string;
    is_active: boolean;
    info: string | null;
    tb_business_unit: BusinessUnitDto[];
    tb_cluster_user: ClusterUserDto[];
}

interface BusinessUnitDto {
    id: string;
    name: string;
    code: string;
}

interface ClusterUserDto {
    id: string;
    user_id: string;
    role: string;
    user: UserDto;
}

export interface UserDto {
    id: string;
    email: string;
    profile: UserProfileDto;
}

export interface UserProfileDto {
    firstname: string;
    lastname: string;
    middlename: string;
}
