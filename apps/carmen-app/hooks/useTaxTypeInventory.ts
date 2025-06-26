import { useQuery } from "@tanstack/react-query";
import { getAllTaxTypeInventory, TaxTypeInventoryDto } from "@/services/tax-type-inventory.service";
import { ParamsGetDto } from "@/dtos/param.dto";

export const useTaxTypeInventoryQuery = (
    token: string,
    tenantId: string,
    params?: ParamsGetDto
) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["tax-type-inventory", tenantId, params],
        queryFn: async () => {
            if (!token || !tenantId) {
                throw new Error('Unauthorized: Missing token or tenantId');
            }
            return await getAllTaxTypeInventory(token, tenantId, params ?? {});
        },
        enabled: !!token && !!tenantId,
        staleTime: 5 * 60 * 1000, // 5 minutes
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