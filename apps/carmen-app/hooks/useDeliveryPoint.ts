"use client";

import { useState, useCallback, useEffect } from "react";
import { DeliveryPointDto } from "@/dtos/config.dto";
import { formType } from "@/dtos/form.dto";
import { useAuth } from "@/context/AuthContext";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useURL } from "./useURL";
import { useDeliveryPointQuery } from "./useDeliveryPointQuery";

interface UseDeliveryPointReturn {
    deliveryPoints: DeliveryPointDto[];
    isPending: boolean;
    isUnauthorized: boolean;
    isSubmitting: boolean;
    dialogOpen: boolean;
    setDialogOpen: (value: boolean) => void;
    confirmDialogOpen: boolean;
    setConfirmDialogOpen: (value: boolean) => void;
    selectedDeliveryPoint: DeliveryPointDto | undefined;
    statusOpen: boolean;
    setStatusOpen: (value: boolean) => void;
    loginDialogOpen: boolean;
    setLoginDialogOpen: (value: boolean) => void;
    totalPages: number;
    currentPage: number;
    search: string;
    setSearch: (value: string) => void;
    sort: string;
    setSort: (value: string) => void;
    filter: string;
    setFilter: (value: string) => void;
    handleSetFilter: (filterValue: string) => void;
    handleSetSort: (sortValue: string) => void;
    fetchDeliveryPoints: () => void;
    handleToggleStatus: (deliveryPoint: DeliveryPointDto) => void;
    handleConfirmToggle: () => void;
    handleSubmit: (data: DeliveryPointDto, mode: formType, selectedDeliveryPoint?: DeliveryPointDto) => void;
    handlePageChange: (page: number) => void;
    handleAdd: () => void;
    handleEdit: (deliveryPoint: DeliveryPointDto) => void;
}

export const useDeliveryPoint = (): UseDeliveryPointReturn => {
    const { token } = useAuth();
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedDeliveryPoint, setSelectedDeliveryPoint] = useState<DeliveryPointDto | undefined>();
    const [statusOpen, setStatusOpen] = useState(false);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [search, setSearch] = useURL('search');
    const [sort, setSort] = useURL('sort');
    const [page, setPage] = useURL('page');
    const [filter, setFilter] = useURL('filter');

    const {
        useGetDeliveryPoints,
        createDeliveryPointMutation,
        updateDeliveryPointMutation,
        toggleDeliveryPointStatusMutation
    } = useDeliveryPointQuery();

    const queryParams = {
        search,
        page,
        sort,
        filter
    };

    const {
        data,
        isPending,
        refetch: fetchDeliveryPoints
    } = useGetDeliveryPoints(queryParams);

    const deliveryPoints = data?.data || [];
    const totalPages = data?.paginate?.pages || 1;

    // Check for unauthorized responses
    useEffect(() => {
        if (data?.statusCode === 401) {
            setIsUnauthorized(true);
            setLoginDialogOpen(true);
        }
    }, [data]);

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

    const handleAdd = useCallback(() => {
        setSelectedDeliveryPoint(undefined);
        setDialogOpen(true);
    }, []);

    const handleEdit = useCallback((deliveryPoint: DeliveryPointDto) => {
        setSelectedDeliveryPoint(deliveryPoint);
        setDialogOpen(true);
    }, []);

    const handleToggleStatus = useCallback((deliveryPoint: DeliveryPointDto) => {
        if (!deliveryPoint.id) {
            toastError({ message: 'Invalid delivery point ID' });
            return;
        }

        if (deliveryPoint.is_active) {
            setSelectedDeliveryPoint(deliveryPoint);
            setConfirmDialogOpen(true);
        } else {
            toggleDeliveryPointStatusMutation.mutate(deliveryPoint, {
                onSuccess: () => {
                    toastSuccess({ message: 'Delivery point activated successfully' });
                },
                onError: () => {
                    toastError({ message: 'Error toggling delivery point status' });
                }
            });
        }
    }, [toggleDeliveryPointStatusMutation]);

    const handleConfirmToggle = useCallback(() => {
        if (selectedDeliveryPoint) {
            toggleDeliveryPointStatusMutation.mutate(selectedDeliveryPoint, {
                onSuccess: () => {
                    toastSuccess({ message: 'Delivery point deactivated successfully' });
                    setConfirmDialogOpen(false);
                    setSelectedDeliveryPoint(undefined);
                },
                onError: () => {
                    toastError({ message: 'Error toggling delivery point status' });
                }
            });
        }
    }, [selectedDeliveryPoint, toggleDeliveryPointStatusMutation]);

    const handleSubmit = useCallback((data: DeliveryPointDto, mode: formType, selectedDP?: DeliveryPointDto) => {
        if (!token) return;

        if (mode === formType.ADD) {
            createDeliveryPointMutation.mutate(data, {
                onSuccess: () => {
                    toastSuccess({ message: 'Delivery point created successfully' });
                    setDialogOpen(false);
                },
                onError: () => {
                    toastError({ message: 'Error creating delivery point' });
                }
            });
        } else {
            const updatedDeliveryPoint: DeliveryPointDto = {
                ...data,
                id: selectedDP?.id
            };

            updateDeliveryPointMutation.mutate(updatedDeliveryPoint, {
                onSuccess: () => {
                    toastSuccess({ message: 'Delivery point updated successfully' });
                    setDialogOpen(false);
                    setSelectedDeliveryPoint(undefined);
                },
                onError: () => {
                    toastError({ message: 'Error updating delivery point' });
                }
            });
        }
    }, [token, createDeliveryPointMutation, updateDeliveryPointMutation]);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage.toString());
    }, [setPage]);

    return {
        // State
        deliveryPoints,
        isPending,
        isUnauthorized,
        isSubmitting: createDeliveryPointMutation.isPending ||
            updateDeliveryPointMutation.isPending ||
            toggleDeliveryPointStatusMutation.isPending,
        dialogOpen,
        setDialogOpen,
        confirmDialogOpen,
        setConfirmDialogOpen,
        selectedDeliveryPoint,
        statusOpen,
        setStatusOpen,
        loginDialogOpen,
        setLoginDialogOpen,
        totalPages,
        currentPage: parseInt(page || '1'),
        search,
        setSearch,
        sort,
        setSort,
        filter,
        setFilter,

        // Status helper
        handleSetFilter,

        // Sort helper
        handleSetSort,

        // Functions
        fetchDeliveryPoints,
        handleToggleStatus,
        handleConfirmToggle,
        handleSubmit,
        handlePageChange,
        handleAdd,
        handleEdit
    };
}; 