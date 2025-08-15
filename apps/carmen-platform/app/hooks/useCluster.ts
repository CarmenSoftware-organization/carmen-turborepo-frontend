"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { backendApi } from "@/lib/backend-api";
import { ClusterDto } from "@/dto/cluster.dto";

const apiUrl = `${backendApi}/api-system/cluster`;

export const useCluster = () => {
    const { accessToken } = useAuth();

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

export const clusterMutation = () => {
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: ClusterDto) => {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cluster'] });
        },
    });
};

export const updateClusterMutation = () => {
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: ClusterDto }) => {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to update cluster');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cluster'] });
        },
    });
};

export const deleteClusterMutation = () => {
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete cluster');
            }

            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cluster'] });
        },
    });
};
