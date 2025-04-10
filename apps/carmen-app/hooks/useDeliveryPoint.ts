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
    totalPages: number;
    currentPage: number;
    search: string;
    setSearch: (value: string) => void;
    sort: string;
    setSort: (value: string) => void;
    fetchDeliveryPoints: () => void;
    handleToggleStatus: (deliveryPoint: DeliveryPointDto) => void;
    handleSubmit: (data: DeliveryPointDto, mode: formType, selectedDeliveryPoint?: DeliveryPointDto) => void;
    handlePageChange: (page: number) => void;
}

export const useDeliveryPoint = (): UseDeliveryPointReturn => {
    const { token, tenantId } = useAuth();
    const [deliveryPoints, setDeliveryPoints] = useState<DeliveryPointDto[]>([]);
    const [isPending, startTransition] = useTransition();
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useURL('search');
    const [sort, setSort] = useURL('sort');
    const [page, setPage] = useURL('page');

    const fetchDeliveryPoints = useCallback(() => {
        if (!token) return;

        const fetchData = async () => {
            try {
                setIsUnauthorized(false);
                const data = await getAllDeliveryPoints(token, tenantId, {
                    search,
                    page,
                });
                if (data.statusCode === 401) {
                    setIsUnauthorized(true);
                    return;
                }
                setDeliveryPoints(data.data);
                setTotalPages(data.paginate.pages);
            } catch (error) {
                console.error('Error fetching delivery points:', error);
                toastError({ message: 'Error fetching delivery points' });
            }
        };

        startTransition(fetchData);
    }, [tenantId, token, search, page]);

    useEffect(() => {
        if (search) {
            setPage('');
        }
    }, [search, setPage]);

    useEffect(() => {
        fetchDeliveryPoints();
    }, [fetchDeliveryPoints]);

    const handleToggleStatus = useCallback((deliveryPoint: DeliveryPointDto) => {
        if (!token) return;

        const updateStatus = async () => {
            try {
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
                toastSuccess({ message: 'Delivery point status updated successfully' });
            } catch (error) {
                console.error('Error toggling delivery point status:', error);
                toastError({ message: 'Error toggling delivery point status' });
            }
        };

        startTransition(updateStatus);
    }, [token, tenantId, deliveryPoints]);

    const handleSubmit = useCallback((data: DeliveryPointDto, mode: formType, selectedDeliveryPoint?: DeliveryPointDto) => {
        if (!token) return;

        const submitAdd = async () => {
            try {
                const result = await createDeliveryPoint(token, tenantId, data);
                console.log('result', result);
                const newDeliveryPoint: DeliveryPointDto = {
                    ...data,
                    id: result.id,
                };

                const updatedPoints = [...deliveryPoints, newDeliveryPoint];
                setDeliveryPoints(updatedPoints);

                toastSuccess({ message: 'Delivery point created successfully' });
            } catch (error) {
                console.error('Error creating delivery point:', error);
                toastError({ message: 'Error creating delivery point' });
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
            } catch (error) {
                console.error('Error updating delivery point:', error);
                toastError({ message: 'Error updating delivery point' });
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
        deliveryPoints,
        isPending,
        isUnauthorized,
        totalPages,
        currentPage: parseInt(page || '1'),
        search,
        setSearch,
        sort,
        setSort,
        fetchDeliveryPoints,
        handleToggleStatus,
        handleSubmit,
        handlePageChange
    };
}; 