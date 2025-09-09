import { backendApi } from "@/lib/backend-api";
import { getAllApiRequest } from "@/lib/config.api";
import { ParamsGetDto } from "@/dtos/param.dto";

const API_URL = `${backendApi}/api/tax-type-inventory`;

export interface TaxTypeInventoryDto {
    id: string;
    name: string;
    description?: string;
    tax_rate?: number;
    is_active?: boolean;
}

export const getAllTaxTypeInventory = async (
    token: string,
    buCode: string,
    params?: ParamsGetDto
) => {
    return getAllApiRequest(
        API_URL,
        token,
        buCode,
        'Failed to fetch tax type inventory',
        params
    );
}; 