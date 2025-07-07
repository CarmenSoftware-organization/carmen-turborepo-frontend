import { useMutation, useQuery } from "@tanstack/react-query";
import { backendApi } from "@/lib/backend-api";
import { ParamsGetDto } from "@/dtos/param.dto";
import {
  deleteApiRequest,
  getAllApiRequest,
  postApiRequest,
  updateApiRequest,
} from "@/lib/config.api";
import { useCallback } from "react";
import { FormLocationValues, StoreLocationDto } from "@/dtos/config.dto";

const API_URL = `${backendApi}/api/config/locations`;

export const useLocationQuery = (
  token: string,
  tenantId: string,
  params?: ParamsGetDto
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["locations", tenantId, params],
    queryFn: () => {
      if (!token || !tenantId) throw new Error("Unauthorized");
      return getAllApiRequest(
        API_URL,
        token,
        tenantId,
        "Error fetching locations",
        params
      );
    },
    enabled: !!token && !!tenantId,
  });

  const getLocationName = useCallback((locationId: string) => {
    const location = data?.data.find((l: StoreLocationDto) => l.id === locationId);
    return location?.name ?? "";
  }, [data]);

  return { data, isLoading, error, getLocationName };
};

export const useLocationMutation = (token: string, tenantId: string) => {
  return useMutation({
    mutationFn: (data: FormLocationValues) => {
      if (!token || !tenantId) throw new Error("Unauthorized");
      return postApiRequest(
        API_URL,
        token,
        tenantId,
        data,
        "Error creating location"
      );
    },
  });
};

export const useUpdateLocation = (
  token: string,
  tenantId: string,
  id: string
) => {
  const API_URL_BY_ID = `${API_URL}/${id}`;
  
  return useMutation({
    mutationFn: (data: FormLocationValues) => {
      return updateApiRequest(
        API_URL_BY_ID,
        token,
        tenantId,
        data,
        "Error updating location",
        "PATCH"
      );
    },
  });
};

export const useDeleteLocation = (
  token: string,
  tenantId: string,
  id: string
) => {
  const API_URL_BY_ID = `${API_URL}/${id}`;
  return useMutation({
    mutationFn: () => {
      if (!token || !tenantId || !id) throw new Error("Unauthorized");
      return deleteApiRequest(
        API_URL_BY_ID,
        token,
        tenantId,
        id,
        "Error deleting location"
      );
    },
  });
};
