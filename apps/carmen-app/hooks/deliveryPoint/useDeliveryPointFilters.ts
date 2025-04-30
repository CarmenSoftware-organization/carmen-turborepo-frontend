"use client";

import { useState, useCallback, useEffect } from "react";
import { useURL } from "../useURL";

export const useDeliveryPointFilters = () => {
    const [search, setSearch] = useURL('search');
    const [sort, setSort] = useURL('sort');
    const [page, setPage] = useURL('page');
    const [filter, setFilter] = useURL('filter');
    const [statusOpen, setStatusOpen] = useState(false);

    // Reset pagination when search changes
    useEffect(() => {
        if (search) {
            setPage('');
            setSort('');
        }
    }, [search, setPage, setSort]);

    const handleSetFilter = useCallback((filterValue: string) => {
        setFilter(filterValue);
        setPage('');
    }, [setFilter, setPage]);

    const handleSetSort = useCallback((sortValue: string) => {
        setSort(sortValue);
    }, [setSort]);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage.toString());
    }, [setPage]);

    // Return query params object for API requests
    const queryParams = {
        search,
        page,
        sort,
        filter
    };

    return {
        // State values
        search,
        sort,
        page,
        filter,
        statusOpen,
        queryParams,
        currentPage: parseInt(page || '1'),

        // Setters
        setSearch,
        setSort,
        setPage,
        setFilter,
        setStatusOpen,

        // Handlers
        handleSetFilter,
        handleSetSort,
        handlePageChange
    };
}; 