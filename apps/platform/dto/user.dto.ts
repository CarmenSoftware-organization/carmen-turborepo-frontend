export interface PlatformUserDto {
    id: string;
    name: string;
    email: string;
    role: string;
    bu_name: string;
    status: boolean;
    last_active: string;
}


export interface ClusterUserDto {
    id: string;
    name: string;
    email: string;
    hotel_group: string;
    role: string;
    module: [
        {
            id: string;
            name: string;
        }
    ],
    status: boolean;
    last_active: string;
}

export interface BusinessUnitUserDto {
    id: string;
    name: string;
    email: string;
    cluster_name: string;
    hotel_name: string;
    department: string;
    role: string;
    module: [
        {
            id: string;
            name: string;
        }
    ],
    status: boolean;
    last_active: string;
}