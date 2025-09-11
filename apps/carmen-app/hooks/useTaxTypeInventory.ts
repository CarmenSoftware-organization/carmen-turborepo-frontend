import { useQuery } from "@tanstack/react-query";
import { ParamsGetDto } from "@/dtos/param.dto";
import { backendApi } from "@/lib/backend-api";
import { getAllApiRequest } from "@/lib/config.api";
import { TaxTypeInventoryDto } from "@/dtos/tax-type.dto";

const taxTypeInventoryApiUrl = (buCode: string, id?: string) => {
    const baseUrl = `${backendApi}/api/config/${buCode}/tax-type-inventory`;
    return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
}

export const useTaxTypeInventoryQuery = (
    token: string,
    buCode: string,
    params?: ParamsGetDto
) => {
    const API_URL = taxTypeInventoryApiUrl(buCode);

    const { data, isLoading, error } = useQuery({
        queryKey: ["tax-type-inventory", buCode, params],
        queryFn: async () => {
            if (!token || !buCode) {
                throw new Error('Unauthorized: Missing token or buCode');
            }
            return await getAllApiRequest(
                API_URL,
                token,
                "Error fetching credit note",
                params ?? {}
            );
        },
        enabled: !!token && !!buCode,
        staleTime: 5 * 60 * 1000,
    });

    const isUnauthorized = error instanceof Error && error.message.includes('Unauthorized');

    const getTaxTypeName = (id: string) => {
        const found = data?.data?.find((taxType: TaxTypeInventoryDto) => taxType.id === id);
        return found?.name ?? null;
    };

    return {
        data: data?.data as TaxTypeInventoryDto[] | undefined,
        getTaxTypeName,
        isLoading,
        error,
        isUnauthorized
    };
}; 