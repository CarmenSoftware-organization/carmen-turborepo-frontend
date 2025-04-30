"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DELIVERY_POINT_KEYS } from "./queries";
import { getAllDeliveryPoints } from "@/services/dp.service";

interface UseDeliveryPointQueryProps {
    token: string | null | undefined;
    tenantId: string | null | undefined;
    queryParams: Record<string, string>;
    setLoginDialogOpen: (value: boolean) => void;
}

export const useDeliveryPointQuery = ({
    token,
    tenantId,
    queryParams,
    setLoginDialogOpen
}: UseDeliveryPointQueryProps) => {
    const [isUnauthorized, setIsUnauthorized] = useState(false);

    // Query for fetching delivery points
    const {
        data,
        isPending,
        refetch: refetchDeliveryPoints
    } = useQuery({
        queryKey: DELIVERY_POINT_KEYS.list(queryParams),
        queryFn: () => {
            if (!token || !tenantId) throw new Error("Unauthorized");
            return getAllDeliveryPoints(token, tenantId, queryParams);
        },
        enabled: !!token && !!tenantId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Extract data
    const deliveryPoints = data?.data ?? [];
    const totalPages = data?.paginate?.pages ?? 1;

    // Check for unauthorized responses
    useEffect(() => {
        if (data?.statusCode === 401) {
            setIsUnauthorized(true);
            setLoginDialogOpen(true);
        }
    }, [data, setLoginDialogOpen]);

    // Function to manually trigger a refetch
    const fetchDeliveryPoints = useCallback(() => {
        void refetchDeliveryPoints();
    }, [refetchDeliveryPoints]);

    return {
        deliveryPoints,
        totalPages,
        isPending,
        isUnauthorized,
        fetchDeliveryPoints
    };
}; 