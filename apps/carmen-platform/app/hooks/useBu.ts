"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { backendApi } from "@/lib/backend-api";

const apiUrl = `${backendApi}/api-system/business-unit`;

export const useBu = () => {
    const { accessToken } = useAuth();

    return useQuery({
        queryKey: ['bu', accessToken],
        queryFn: async () => {
            const response = await fetch(apiUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Failed to fetch cluster data: ${text}`);
            }

            return response.json();
        },
        enabled: !!accessToken,
        staleTime: 5 * 60 * 1000,
    });
}