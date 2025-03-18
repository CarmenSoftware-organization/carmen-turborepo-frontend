export interface ModuleDto {
    id: string;
    name: string;
    description: string;
    available_plans: {
        id: string;
        name: string;
    }[];
    status: boolean;
    created_at: string;
    updated_at: string;
}
