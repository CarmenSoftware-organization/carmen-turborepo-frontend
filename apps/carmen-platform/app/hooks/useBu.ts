"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { backendApi } from "@/lib/backend-api";

const apiUrl = `${backendApi}/api-system/business-unit`;

interface BuPayloadDto {
  cluster_id: string;
  code: string;
  name: string;
  is_hq: boolean;
  is_active: boolean;
}

export const useBu = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["bu", accessToken],
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

export const useBuById = (id: string) => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["bu", id, accessToken],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch bu data: ${text}`);
      }

      return response.json();
    },
    enabled: !!accessToken && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateBu = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BuPayloadDto) => {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to create business unit: ${text}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bu"] });
    },
  });
};

export const useUpdateBu = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: BuPayloadDto }) => {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to update business unit: ${text}`);
      }

      return response.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bu"] });
      queryClient.invalidateQueries({ queryKey: ["bu", variables.id] });
    },
  });
};

export const useDeleteBu = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to delete business unit: ${text}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bu"] });
    },
  });
};
