export interface TaxTypeInventoryDto {
    id: string;
    name: string;
    description?: string;
    tax_rate?: number;
    is_active?: boolean;
}