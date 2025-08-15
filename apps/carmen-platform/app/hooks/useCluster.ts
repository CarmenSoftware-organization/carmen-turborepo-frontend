"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { backendApi } from "@/lib/backend-api";

export const useCluster = () => {
    const { accessToken } = useAuth();
    const apiUrl = `${backendApi}/api-system/cluster`;

    return useQuery({
        queryKey: ['cluster', accessToken],
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

};