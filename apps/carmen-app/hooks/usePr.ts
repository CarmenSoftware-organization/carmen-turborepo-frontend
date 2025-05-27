"use client";

import { toastError } from "@/components/ui-custom/Toast";
import { useAuth } from "@/context/AuthContext";
import { GetAllPrDto, PrSchemaV2Dto } from "@/dtos/pr.dto";
import { createPrService, getAllPrService, getPrByIdService } from "@/services/pr.service";
import { useCallback, useEffect, useState } from "react";
import { PaginationDto } from "@/dtos/pagination.dto";
import { useURL } from "./useURL";
import { useQueryClient, useMutation } from "@tanstack/react-query";

// Type for the PR data with pagination
export interface PurchaseRequestResponse {
    data: GetAllPrDto[];
    paginate: PaginationDto;
}

export const usePr = () => {
    const { token, tenantId } = useAuth();
    const [purchaseRequests, setPurchaseRequests] = useState<GetAllPrDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [page, setPage] = useURL('page');
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useURL('search');
    const [filter, setFilter] = useURL('filter');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');

    useEffect(() => {
        if (search) {
            setPage('');
            setSort('');
        }
    }, [search, setPage, setSort]);

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            try {
                setIsLoading(true);
                const result = await getAllPrService(token, tenantId, {
                    page,
                    sort,
                    search
                });

                // Handle unauthorized response
                if (result.status === 401) {
                    setIsUnauthorized(true);
                    setLoginDialogOpen(true);
                    return;
                }

                console.log('result', result);


                if (result?.data) {
                    setPurchaseRequests(result.data);
                    setTotalPages(result.paginate.pages);
                }
            } catch (error) {
                console.error('Error fetching PRs:', error);
                toastError({ message: 'Error fetching PRs' });
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [token, tenantId]);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage.toString());
    }, [setPage]);


    return {
        purchaseRequests,
        setPurchaseRequests,
        isLoading,
        setIsLoading,
        isUnauthorized,
        loginDialogOpen,
        setLoginDialogOpen,
        page,
        setPage,
        totalPages,
        setTotalPages,
        search,
        setSearch,
        filter,
        setFilter,
        statusOpen,
        setStatusOpen,
        sort,
        setSort,
        handlePageChange
    };
}

export const usePrMutation = (token: string, tenantId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (prData: PrSchemaV2Dto) => createPrService(token, tenantId, prData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prs"] });
        },
    });
}; 