import { ParamsGetDto } from "@/dtos/param.dto";
import { backendApi } from "@/lib/backend-api";
import {
    getAllApiRequest,
    postApiRequest,
    updateApiRequest,
} from "@/lib/config.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { CurrencyCreateDto, CurrencyGetDto, CurrencyUpdateDto } from "@/dtos/currency.dto";

const API_URL = `${backendApi}/api/config/currencies`;

export const useCurrenciesQuery = (
    token: string,
    tenantId: string,
    params?: ParamsGetDto
) => {

    const { data, isLoading, error } = useQuery({
        queryKey: ["currencies", tenantId, params],
        queryFn: async () => {
            if (!token || !tenantId) {
                throw new Error("Unauthorized: Missing token or tenantId");
            }
            return await getAllApiRequest(
                API_URL,
                token,
                tenantId,
                "Error fetching currency",
                params ?? {}
            );
        },
        enabled: !!token && !!tenantId,
    });

    const currencies = data;
    const isUnauthorized =
        error instanceof Error && error.message.includes("Unauthorized");

    const getCurrencyName = useCallback(
        (currencyId: string) => {
            const currency = currencies?.find(
                (c: CurrencyGetDto) => c.id === currencyId
            );
            return currency?.name ?? "";
        },
        [currencies]
    );

    const getCurrencyCode = useCallback(
        (currencyId: string) => {
            const currency = currencies?.data?.find(
                (c: CurrencyGetDto) => c.id === currencyId
            );
            return currency?.code ?? "";
        },
        [currencies]
    );

    const getCurrencyExchangeRate = useCallback(
        (currencyId: string) => {
            const currency = currencies?.data?.find(
                (c: CurrencyGetDto) => c.id === currencyId
            );
            return currency?.exchange_rate ?? 0;
        },
        [currencies]
    );

    return {
        currencies,
        getCurrencyName,
        getCurrencyCode,
        getCurrencyExchangeRate,
        isLoading,
        isUnauthorized,
    };
};

export const useCurrencyMutation = (token: string, tenantId: string) => {
    return useMutation({
        mutationFn: async (data: CurrencyCreateDto) => {
            return await postApiRequest(
                API_URL,
                token,
                tenantId,
                data,
                "Error creating currency"
            );
        },
    });
};

export const useCurrencyUpdateMutation = (token: string, tenantId: string, id: string) => {
    return useMutation({
        mutationFn: async (data: CurrencyUpdateDto) => {
            return await updateApiRequest(
                `${API_URL}/${id}`,
                token,
                tenantId,
                data,
                "Error updating currency",
                "PATCH"
            );
        },
    });
};

export const useCurrencyDeleteMutation = (token: string, tenantId: string) => {
    return useMutation({
        mutationFn: async (id: string) => {
            return await updateApiRequest(
                `${API_URL}/${id}`,
                token,
                tenantId,
                { is_active: false },
                "Error deleting currency",
                "PATCH"
            );
        },
    });
};
