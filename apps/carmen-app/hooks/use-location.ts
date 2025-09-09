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
  buCode: string,
  params?: ParamsGetDto
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["locations", buCode, params],
    queryFn: () => {
      if (!token || !buCode) throw new Error("Unauthorized");
      return getAllApiRequest(
        API_URL,
        token,
        buCode,
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
  return useMutation({
    mutationFn: (data: FormLocationValues) => {
      if (!token || !buCode) throw new Error("Unauthorized");
      return postApiRequest(
        API_URL,
        token,
        buCode,
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
  const API_URL_BY_ID = `${API_URL}/${id}`;

  return useMutation({
    mutationFn: (data: FormLocationValues) => {
      return updateApiRequest(
        API_URL_BY_ID,
        token,
        buCode,
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
  const API_URL_BY_ID = `${API_URL}/${id}`;
  return useMutation({
    mutationFn: () => {
      if (!token || !buCode || !id) throw new Error("Unauthorized");
      return deleteApiRequest(
        API_URL_BY_ID,
        token,
        buCode,
        id,
        "Error deleting location"
      );
    },
  });
};
