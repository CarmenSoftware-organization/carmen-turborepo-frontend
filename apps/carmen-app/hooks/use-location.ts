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

const locationApiUrl = (buCode: string, id?: string) => {
  const baseUrl = `${backendApi}/api/config/${buCode}/locations`;
  return id ? `${baseUrl}/${id}` : `${baseUrl}`;
};

export const useLocationQuery = (
  token: string,
  buCode: string,
  params?: ParamsGetDto
) => {
  const API_URL = locationApiUrl(buCode);

  const { data, isLoading, error } = useQuery({
    queryKey: ["locations", buCode, params],
    queryFn: () => {
      if (!token || !buCode) throw new Error("Unauthorized");
      return getAllApiRequest(
        API_URL,
        token,
        "Error fetching locations",
        params
      );
    },
    enabled: !!token && !!buCode,
  });

  const getLocationName = useCallback((locationId: string) => {
    const location = data?.data.find((l: StoreLocationDto) => l.id === locationId);
    return location?.name ?? "";
  }, [data]);

  return { data, isLoading, error, getLocationName };
};

export const useLocationMutation = (token: string, buCode: string) => {
  const API_URL = locationApiUrl(buCode);
  return useMutation({
    mutationFn: (data: FormLocationValues) => {
      if (!token || !buCode) throw new Error("Unauthorized");
      return postApiRequest(
        API_URL,
        token,
        data,
        "Error creating location"
      );
    },
  });
};

export const useUpdateLocation = (
  token: string,
  buCode: string,
  id: string
) => {
  const API_URL_BY_ID = locationApiUrl(buCode, id);
  return useMutation({
    mutationFn: (data: FormLocationValues) => {
      return updateApiRequest(
        API_URL_BY_ID,
        token,
        data,
        "Error updating location",
        "PATCH"
      );
    },
  });
};

export const useDeleteLocation = (
  token: string,
  buCode: string,
  id: string
) => {
  const API_URL_BY_ID = locationApiUrl(buCode, id);
  return useMutation({
    mutationFn: () => {
      if (!token || !buCode || !id) throw new Error("Unauthorized");
      return deleteApiRequest(
        API_URL_BY_ID,
        token,
        id,
        "Error deleting location"
      );
    },
  });
};
