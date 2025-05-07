"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useURL } from "./useURL";
import { useQuery } from "@tanstack/react-query";
import { getGrn } from "@/services/grn.service";

export const useGrn = () => {
    const { token, tenantId } = useAuth();
    const [search, setSearch] = useURL('search');
    const [page, setPage] = useURL('page');
    const [sort, setSort] = useURL('sort');

    useEffect(() => {
        if (search) {
            setPage('');
            setSort('');
        }
    }, [search, setPage, setSort]);

    const {
        data: response,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ['grns', tenantId, search, page, sort],
        queryFn: () => getGrn(token || '', tenantId || '', { search, page, sort }),
        enabled: !!token && !!tenantId
    });

    // Extract the actual GRN data if response is not an error
    const grns = response?.isAuthError ? [] : response ?? [];

    return {
        grns,
        isLoading,
        isError,
        error,
        refetch,
        search,
        setSearch,
        page,
        setPage,
        sort,
        setSort,
        isUnauthorized: response?.isAuthError
    };
};
