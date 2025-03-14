export interface BusinessUnitTableDto {
    id: string;
    name: string;
    cluster: string;
    brand: string;
    location: string;
    rooms: number;
    status: string;
    created_at: string;
    updated_at: string;
}


export interface BuFormDto {
    buName: string;
    brand: {
        id: string;
        name: string;
    }
    cluster: {
        id: string;
        name: string;
    }
    head_manager: {
        id: string;
        name: string;
    }
    locations: [
        {
            id: string;
            name: string;
        }
    ]
    contact_details: {
        email: string;
        phone: string;
        address: string;
    }
    properties: {
        rooms: number;
        teams: number;
        members: number;
    }
    database_config: {
        host: string;
        name: string;
        type: string;
    }
    notifications: {
        email: boolean;
        sms: boolean;
    }
}
