"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { backendApi } from "@/lib/backend-api";
import { ClusterDto, GetClusterDto, } from "@/dto/cluster.dto";
import { useCallback } from "react";

const apiUrl = `${backendApi}/api-system/cluster`;

export const useCluster = () => {
    const { accessToken } = useAuth();

    const query = useQuery({
        queryKey: ["cluster", accessToken],
        queryFn: async () => {
            const res = await fetch(apiUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
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
                throw new Error(`Failed to fetch cluster data: ${errorMessage}`);
            }

            return res.json();
        },
        enabled: Boolean(accessToken),
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });

    const getClusterName = useCallback(
        (clusterId: string) => {
            const cluster = query.data?.data?.find((c: GetClusterDto) => c.id === clusterId);
            return cluster?.name ?? "";
        },
        [query.data]
    );

    return {
        ...query,
        getClusterName,
    };
};

export const useCreateCluster = () => {
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
                throw new Error('Failed to create cluster');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cluster'] });
        },
    });
};

export const useUpdateCluster = () => {
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

export const useDeleteCluster = () => {
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

export const useClusterById = (id: string) => {
    const { accessToken } = useAuth();

    return useQuery({
        queryKey: ['cluster', id, accessToken],
        queryFn: async () => {
            const response = await fetch(`${apiUrl}/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Failed to fetch cluster by id: ${text}`);
            }

            return response.json() as Promise<GetClusterDto>;
        },
        enabled: !!accessToken && !!id,
        staleTime: 5 * 60 * 1000,
    });
};