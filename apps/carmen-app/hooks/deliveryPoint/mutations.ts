"use client";

import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query";
import { DeliveryPointDto } from "@/dtos/config.dto";
import { DELIVERY_POINT_KEYS } from "./queries";
import { createDeliveryPoint, inactiveDeliveryPoint, updateDeliveryPoint } from "@/services/dp.service";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";

type MutationCallback = () => void;

// Factory function to create mutations with consistent error handling and query invalidation
export const useDeliveryPointMutation = <T extends DeliveryPointDto, U = unknown>(
    mutationFn: (token: string, tenantId: string, data: T) => Promise<U>,
    token: string | null | undefined,
    tenantId: string | null | undefined,
    options?: {
        onSuccess?: (data: U, variables: T) => void;
        onError?: (error: Error, variables: T) => void;
        successMessage?: string;
        errorMessage?: string;
    }
): UseMutationResult<U, Error, T> => {
    const queryClient = useQueryClient();
    const { successMessage, errorMessage, onSuccess, onError } = options || {};

    return useMutation({
        mutationFn: (data: T) => {
            if (!token || !tenantId) throw new Error("Unauthorized");
            return mutationFn(token, tenantId, data);
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: DELIVERY_POINT_KEYS.lists() });
            if (successMessage) toastSuccess({ message: successMessage });
            onSuccess?.(data, variables);
        },
        onError: (error, variables) => {
            if (errorMessage) toastError({ message: errorMessage });
            onError?.(error, variables);
        },
    });
};

// Specific mutation hooks
export const useCreateDeliveryPoint = (
    token: string | null | undefined,
    tenantId: string | null | undefined,
    onSuccessCallback?: MutationCallback
) => {
    return useDeliveryPointMutation(
        createDeliveryPoint,
        token,
        tenantId,
        {
            successMessage: "Delivery point created successfully",
            errorMessage: "Error creating delivery point",
            onSuccess: () => onSuccessCallback?.(),
        }
    );
};

export const useUpdateDeliveryPoint = (
    token: string | null | undefined,
    tenantId: string | null | undefined,
    onSuccessCallback?: MutationCallback
) => {
    return useDeliveryPointMutation(
        updateDeliveryPoint,
        token,
        tenantId,
        {
            successMessage: "Delivery point updated successfully",
            errorMessage: "Error updating delivery point",
            onSuccess: () => onSuccessCallback?.(),
        }
    );
};

export const useToggleDeliveryPointStatus = (
    token: string | null | undefined,
    tenantId: string | null | undefined,
    onSuccessCallback?: MutationCallback,
    statusMessage?: string
) => {
    return useDeliveryPointMutation(
        inactiveDeliveryPoint,
        token,
        tenantId,
        {
            successMessage: statusMessage || "Delivery point status updated successfully",
            errorMessage: "Error toggling delivery point status",
            onSuccess: () => onSuccessCallback?.(),
        }
    );
}; 