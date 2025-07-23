export interface ProductLocationGetDto {
    id: string;
    name: string;
    code: string;
    inventory_unit: {
        id: string;
        name: string;
    }
}

