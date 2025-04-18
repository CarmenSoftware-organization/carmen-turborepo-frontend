"use client";

import { useState, useCallback, useTransition, useEffect } from "react";
import { DeliveryPointDto } from "@/dtos/config.dto";
import { formType } from "@/dtos/form.dto";
import { createDeliveryPoint, getAllDeliveryPoints, updateDeliveryPoint } from "@/services/dp.service";
import { useAuth } from "@/context/AuthContext";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useURL } from "./useURL";

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
    const { token, tenantId } = useAuth();
    const [deliveryPoints, setDeliveryPoints] = useState<DeliveryPointDto[]>([]);
    const [isPending, startTransition] = useTransition();
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedDeliveryPoint, setSelectedDeliveryPoint] = useState<DeliveryPointDto | undefined>();
    const [statusOpen, setStatusOpen] = useState(false);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useURL('search');
    const [sort, setSort] = useURL('sort');
    const [page, setPage] = useURL('page');
    const [filter, setFilter] = useURL('filter');

    const fetchDeliveryPoints = useCallback(() => {
        if (!token) return;

        const fetchData = async () => {
            try {
                setIsUnauthorized(false);
                setIsSubmitting(true);
                const data = await getAllDeliveryPoints(token, tenantId, {
                    search,
                    page,
                    sort,
                    filter
                });
                console.log('data >><<><<', data);

                if (data.statusCode === 401) {
                    setIsUnauthorized(true);
                    setLoginDialogOpen(true);
                    return;
                }
                setDeliveryPoints(data.data);
                setTotalPages(data.paginate.pages);
            } catch (error) {
                console.error('Error fetching delivery points:', error);
                toastError({ message: 'Error fetching delivery points' });
            } finally {
                setIsSubmitting(false);
            }
        };

        startTransition(fetchData);
    }, [tenantId, token, search, page, sort, filter]);

    useEffect(() => {
        if (search) {
            setPage('');
            setSort('');
        }
    }, [search, setPage, setSort]);

    useEffect(() => {
        fetchDeliveryPoints();
    }, [fetchDeliveryPoints]);

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

    const performToggleStatus = useCallback(async (deliveryPoint: DeliveryPointDto) => {
        if (!token) return;

        try {
            setIsSubmitting(true);
            const updatedDeliveryPoint = {
                ...deliveryPoint,
                is_active: !deliveryPoint.is_active
            };
            await updateDeliveryPoint(token, tenantId, updatedDeliveryPoint);

            const id = deliveryPoint.id;
            const updatedPoints = deliveryPoints.map(dp =>
                dp.id === id ? updatedDeliveryPoint : dp
            );

            setDeliveryPoints(updatedPoints);
            toastSuccess({ message: `Delivery point ${!deliveryPoint.is_active ? 'activated' : 'deactivated'} successfully` });
        } catch (error) {
            console.error('Error toggling delivery point status:', error);
            toastError({ message: 'Error toggling delivery point status' });
        } finally {
            setIsSubmitting(false);
            setConfirmDialogOpen(false);
            setSelectedDeliveryPoint(undefined);
        }
    }, [token, tenantId, deliveryPoints]);

    const handleToggleStatus = useCallback((deliveryPoint: DeliveryPointDto) => {
        if (!deliveryPoint.id) {
            toastError({ message: 'Invalid delivery point ID' });
            return;
        }

        if (deliveryPoint.is_active) {
            setSelectedDeliveryPoint(deliveryPoint);
            setConfirmDialogOpen(true);
        } else {
            startTransition(() => {
                performToggleStatus(deliveryPoint);
            });
        }
    }, [performToggleStatus, startTransition]);

    const handleConfirmToggle = useCallback(() => {
        if (selectedDeliveryPoint) {
            startTransition(() => {
                performToggleStatus(selectedDeliveryPoint);
            });
        }
    }, [selectedDeliveryPoint, performToggleStatus, startTransition]);

    const handleSubmit = useCallback((data: DeliveryPointDto, mode: formType, selectedDeliveryPoint?: DeliveryPointDto) => {
        if (!token) return;
        setIsSubmitting(true);

        const submitAdd = async () => {
            try {
                const result = await createDeliveryPoint(token, tenantId, data);
                const newDeliveryPoint: DeliveryPointDto = {
                    ...data,
                    id: result.id,
                };

                const updatedPoints = [...deliveryPoints, newDeliveryPoint];
                setDeliveryPoints(updatedPoints);

                toastSuccess({ message: 'Delivery point created successfully' });
                setDialogOpen(false);
                setSelectedDeliveryPoint(undefined);
            } catch (error) {
                console.error('Error creating delivery point:', error);
                toastError({ message: 'Error creating delivery point' });
            } finally {
                setIsSubmitting(false);
            }
        };

        const submitEdit = async () => {
            try {
                const updatedDeliveryPoint: DeliveryPointDto = {
                    ...data,
                    id: selectedDeliveryPoint?.id
                };
                await updateDeliveryPoint(token, tenantId, updatedDeliveryPoint);

                const id = updatedDeliveryPoint.id;
                const updatedPoints = deliveryPoints.map(dp =>
                    dp.id === id ? updatedDeliveryPoint : dp
                );

                setDeliveryPoints(updatedPoints);
                toastSuccess({ message: 'Delivery point updated successfully' });
                setDialogOpen(false);
                setSelectedDeliveryPoint(undefined);
            } catch (error) {
                console.error('Error updating delivery point:', error);
                toastError({ message: 'Error updating delivery point' });
            } finally {
                setIsSubmitting(false);
            }
        };

        if (mode === formType.ADD) {
            startTransition(submitAdd);
        } else {
            startTransition(submitEdit);
        }
    }, [token, tenantId, deliveryPoints]);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage.toString());
    }, [setPage]);

    return {
        // State
        deliveryPoints,
        isPending,
        isUnauthorized,
        isSubmitting,
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