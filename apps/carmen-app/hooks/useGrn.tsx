"use client";

import { useAuth } from "@/context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { useURL } from "./useURL";
import { useQuery } from "@tanstack/react-query";
import { getAllGrn } from "@/services/grn.service";

export const useGrn = () => {
    const { token, tenantId } = useAuth();
    const [search, setSearch] = useURL('search');
    const [page, setPage] = useURL('page');
    const [sort, setSort] = useURL('sort');
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

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
        queryFn: () => getAllGrn(token || '', tenantId || '', { search, page, sort }),
        enabled: !!token && !!tenantId
    });

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage.toString());
    }, [setPage]);


    useEffect(() => {
        if (response?.status === 401) {
            setIsUnauthorized(true);
            setLoginDialogOpen(true);
        }
    }, [response]);

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
        isUnauthorized,
        loginDialogOpen,
        setLoginDialogOpen,
        dialogOpen,
        setDialogOpen,
        handlePageChange
    };
};
