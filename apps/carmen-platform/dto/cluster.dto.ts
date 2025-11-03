// Create/Update Cluster Payload
export interface ClusterPayloadDto {
    name: string;
    code: string;
    is_active: boolean;
}

// Get All Clusters
export interface ClusterDto extends ClusterPayloadDto {
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

export enum PLATFORM_ROLE {
    SUPER_ADMIN = "super_admin",
    PLATFORM_ADMIN = "platform_admin",
    SUPPORT_MANAGER = "support_manager",
    SUPPORT_STAFF = "support_staff",
    SECURITY_OFFICER = "security_officer",
    INTEGRATION_DEVELOPER = "integration_developer",
    USER = "user",
}

enum CLUSTER_USER_ROLE {
    ADMIN = "admin",
    USER = "user",
}

export interface UserDto {
    id: string;
    email: string;
    platform_role: PLATFORM_ROLE;
    profile: UserProfileDto;
}

export interface UserProfileDto {
    firstname: string;
    lastname: string;
    middlename: string;
}


export interface IUserClusterDTO {
    id: string;
    email: string;
    platform_role: PLATFORM_ROLE;
    role: CLUSTER_USER_ROLE;
    cluster: {
        id: string;
        name: string
    };
    user_info: {
        firstname: string;
        lastname: string;
        middlename: string
    };
    business_unit: {
        id: string;
        name: string;
        code: string
    };
};
