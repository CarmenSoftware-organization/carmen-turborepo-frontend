import { useQuery } from "@tanstack/react-query";
import { getAllTaxTypeInventory, TaxTypeInventoryDto } from "@/services/tax-type-inventory.service";
import { ParamsGetDto } from "@/dtos/param.dto";

export const useTaxTypeInventoryQuery = (
    token: string,
    buCode: string,
    params?: ParamsGetDto
) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["tax-type-inventory", buCode, params],
        queryFn: async () => {
            if (!token || !buCode) {
                throw new Error('Unauthorized: Missing token or buCode');
            }
            return await getAllTaxTypeInventory(token, buCode, params ?? {});
        },
        enabled: !!token && !!buCode,
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