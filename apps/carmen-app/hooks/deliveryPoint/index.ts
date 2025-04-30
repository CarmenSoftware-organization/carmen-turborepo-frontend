"use client";

import { useState } from "react";
import { DeliveryPointDto } from "@/dtos/config.dto";
import { formType } from "@/dtos/form.dto";
import { useAuth } from "@/context/AuthContext";
import { useDeliveryPointFilters } from "./useDeliveryPointFilters";
import { useDeliveryPointDialog } from "./useDeliveryPointDialog";
import { useDeliveryPointQuery } from "./useDeliveryPointQuery";

export { DELIVERY_POINT_KEYS } from "./queries";

interface UseDeliveryPointReturn {
    // State
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

    // Handlers
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
    const [statusOpen, setStatusOpen] = useState(false);

    // Use filter management hook
    const {
        search,
        setSearch,
        sort,
        setSort,
        filter,
        setFilter,
        handleSetFilter,
        handleSetSort,
        handlePageChange,
        queryParams,
        currentPage
    } = useDeliveryPointFilters();

    // Use dialog management hook
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);

    const {
        deliveryPoints,
        totalPages,
        isPending,
        isUnauthorized,
        fetchDeliveryPoints
    } = useDeliveryPointQuery({
        token,
        tenantId,
        queryParams,
        setLoginDialogOpen
    });

    const {
        dialogOpen,
        setDialogOpen,
        confirmDialogOpen,
        setConfirmDialogOpen,
        selectedDeliveryPoint,
        isSubmitting,
        handleAdd,
        handleEdit,
        handleToggleStatus,
        handleConfirmToggle,
        handleSubmit
    } = useDeliveryPointDialog({ token, tenantId });

    return {
        // State from query hook
        deliveryPoints,
        isPending,
        isUnauthorized,
        totalPages,

        // State from dialog hook
        isSubmitting,
        dialogOpen,
        setDialogOpen,
        confirmDialogOpen,
        setConfirmDialogOpen,
        selectedDeliveryPoint,
        loginDialogOpen,
        setLoginDialogOpen,

        // State from filters hook
        currentPage,
        search,
        setSearch,
        sort,
        setSort,
        filter,
        setFilter,

        // Local state
        statusOpen,
        setStatusOpen,

        // Handlers from filters hook
        handleSetFilter,
        handleSetSort,
        handlePageChange,

        // Handlers from query hook
        fetchDeliveryPoints,

        // Handlers from dialog hook
        handleToggleStatus,
        handleConfirmToggle,
        handleSubmit,
        handleAdd,
        handleEdit
    };
}; 