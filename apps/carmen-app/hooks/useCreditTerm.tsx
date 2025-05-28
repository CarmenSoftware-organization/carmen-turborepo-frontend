import { useQuery } from "@tanstack/react-query";
import { CreditTermGetAllDto } from "@/dtos/credit-term.dto";
import { ParamsGetDto } from "@/dtos/param.dto";
import { getAllApiRequest } from "@/lib/config.api";
import { backendApi } from "@/lib/backend-api";
import { useCallback } from "react";

const API_URL = `${backendApi}/api/credit-term`;

export const useCreditTermQuery = (
    token: string,
    tenantId: string,
    params?: ParamsGetDto
) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["credit-term", tenantId, params],
        queryFn: async () => {
            if (!token || !tenantId) {
                throw new Error('Unauthorized: Missing token or tenantId');
            }
            return await getAllApiRequest(API_URL, token, tenantId, "Error fetching credit term", params ?? {});
        },
        enabled: !!token && !!tenantId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const creditTerms = data?.data.data as CreditTermGetAllDto[] | undefined;
    const isUnauthorized = error instanceof Error && error.message.includes('Unauthorized');

    const getCreditTermName = useCallback((creditTermId: string) => {
        const creditTerm = creditTerms?.find((ct: CreditTermGetAllDto) => ct.id === creditTermId);
        return creditTerm?.name ?? '';
    }, [creditTerms]);

    return {
        creditTerms,
        isLoading,
        error,
        isUnauthorized,
        getCreditTermName
    };
};
