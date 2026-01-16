"use client";

import { backendApi, xAppId } from "@/lib/backend-api";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";

const apiUrl = `${backendApi}/api-system/user/cluster`;

export const useUserCluster = () => {
    const { accessToken } = useAuth();

    const query = useQuery({
        queryKey: ["user-cluster", accessToken],
        queryFn: async () => {
            const res = await fetch(apiUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "x-app-id": xAppId,
                },
            });

            if (!res.ok) {
                let errorMessage: string;
                try {
                    const errorData = await res.json();
                    errorMessage = errorData.message || res.statusText;
                } catch {
                    errorMessage = await res.text();
                }
                throw new Error(`Failed to fetch user cluster data: ${errorMessage}`);
            }

            return res.json();
        },
        enabled: Boolean(accessToken),
        staleTime: 5 * 60 * 1000,
        retry: 1,
    })

    return {
        ...query
    }
}
