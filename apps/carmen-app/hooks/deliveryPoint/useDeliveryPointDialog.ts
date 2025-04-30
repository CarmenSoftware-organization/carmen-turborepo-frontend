"use client";

import { useState, useCallback } from "react";
import { DeliveryPointDto } from "@/dtos/config.dto";
import { formType } from "@/dtos/form.dto";
import { useCreateDeliveryPoint, useUpdateDeliveryPoint, useToggleDeliveryPointStatus } from "./mutations";
import { toastError } from "@/components/ui-custom/Toast";

interface UseDeliveryPointDialogProps {
    token: string | null | undefined;
    tenantId: string | null | undefined;
}

export const useDeliveryPointDialog = ({ token, tenantId }: UseDeliveryPointDialogProps) => {
    // Dialog states
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedDeliveryPoint, setSelectedDeliveryPoint] = useState<DeliveryPointDto | undefined>();
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);

    // Create mutation with success callback
    const createMutation = useCreateDeliveryPoint(token, tenantId, () => {
        setDialogOpen(false);
    });

    // Update mutation with success callback
    const updateMutation = useUpdateDeliveryPoint(token, tenantId, () => {
        setDialogOpen(false);
        setSelectedDeliveryPoint(undefined);
    });

    // Toggle status mutation with success callback
    const activateMutation = useToggleDeliveryPointStatus(token, tenantId, undefined,
        "Delivery point activated successfully");

    const deactivateMutation = useToggleDeliveryPointStatus(token, tenantId, () => {
        setConfirmDialogOpen(false);
        setSelectedDeliveryPoint(undefined);
    }, "Delivery point deactivated successfully");

    // Combined submission status
    const isSubmitting = createMutation.isPending ||
        updateMutation.isPending ||
        activateMutation.isPending ||
        deactivateMutation.isPending;

    // Form submission handler
    const handleSubmit = useCallback((data: DeliveryPointDto, mode: formType, selectedDP?: DeliveryPointDto) => {
        if (!token) return;

        if (mode === formType.ADD) {
            createMutation.mutate(data);
        } else {
            const updatedDeliveryPoint: DeliveryPointDto = {
                ...data,
                id: selectedDP?.id
            };
            updateMutation.mutate(updatedDeliveryPoint);
        }
    }, [token, createMutation, updateMutation]);

    // Add handler
    const handleAdd = useCallback(() => {
        setSelectedDeliveryPoint(undefined);
        setDialogOpen(true);
    }, []);

    // Edit handler
    const handleEdit = useCallback((deliveryPoint: DeliveryPointDto) => {
        setSelectedDeliveryPoint(deliveryPoint);
        setDialogOpen(true);
    }, []);

    // Toggle status handler
    const handleToggleStatus = useCallback((deliveryPoint: DeliveryPointDto) => {
        if (!deliveryPoint.id) {
            toastError({ message: 'Invalid delivery point ID' });
            return;
        }

        if (deliveryPoint.is_active) {
            setSelectedDeliveryPoint(deliveryPoint);
            setConfirmDialogOpen(true);
        } else {
            activateMutation.mutate(deliveryPoint);
        }
    }, [activateMutation]);

    // Confirm toggle handler
    const handleConfirmToggle = useCallback(() => {
        if (selectedDeliveryPoint) {
            deactivateMutation.mutate(selectedDeliveryPoint);
        }
    }, [selectedDeliveryPoint, deactivateMutation]);

    return {
        // Dialog states
        dialogOpen,
        setDialogOpen,
        confirmDialogOpen,
        setConfirmDialogOpen,
        selectedDeliveryPoint,
        loginDialogOpen,
        setLoginDialogOpen,
        isSubmitting,

        // Dialog handlers
        handleAdd,
        handleEdit,
        handleToggleStatus,
        handleConfirmToggle,
        handleSubmit
    };
}; 