import { INVENTORY_TYPE } from "@/constants/enum";
import { DeliveryPointGetDto } from "./delivery-point.dto";

export enum PHYSICAL_COUNT_TYPE {
    YES = "yes",
    NO = "no",
}

export interface UserLocationDto {
    id: string;
    firstname: string;
    lastname: string;
}

export interface ProductLocationDto {
    id: string;
    name: string;
}

export interface LocationByIdDto {
    id: string;
    name: string;
    location_type: INVENTORY_TYPE;
    physical_count_type: PHYSICAL_COUNT_TYPE;
    description: string;
    is_active: boolean;
    user_location: UserLocationDto[];
    product_location: ProductLocationDto[];
    delivery_point: DeliveryPointGetDto;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info?: any;
}

export interface StoreLocationDto {
    id?: string;
    name: string;
    location_type: INVENTORY_TYPE;
    description?: string;
    is_active: boolean;
    delivery_point: DeliveryPointGetDto;
}

export interface FormLocationValues {
    id?: string;
    name: string;
    location_type: INVENTORY_TYPE;
    description?: string;
    physical_count_type: PHYSICAL_COUNT_TYPE;
    is_active: boolean;
    delivery_point_id: string;
    users: {
        add: { id: string }[];
        remove: { id: string }[];
    };
    products: {
        add: { id: string }[];
        remove: { id: string }[];
    };
}

export interface CreateStoreLocationDto {
    name: string;
    location_type: INVENTORY_TYPE;
    description?: string;
    is_active: boolean;
    delivery_point_id: string;
    physical_count_type: PHYSICAL_COUNT_TYPE;
    users?: {
        add: { user_id: string }[];
        remove: { user_id: string }[];
    };
    info?: {
        floor: number;
        building: string;
        capacity: number;
        responsibleDepartment: string;
        itemCount: number;
        lastCount: string;
    };
}

export interface LocationResponse {
    id: string;
    name: string;
    location_type: INVENTORY_TYPE;
    physical_count_type: PHYSICAL_COUNT_TYPE;
    description: string;
    is_active: boolean;
    delivery_point: {
        id: string;
        name: string;
        is_active: boolean;
    };
};

export interface UserItemTransfer {
    user_id: string;
    firstname: string;
    lastname: string;
}