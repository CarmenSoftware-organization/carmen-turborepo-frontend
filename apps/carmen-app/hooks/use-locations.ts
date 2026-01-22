import { useMutation, useQuery } from "@tanstack/react-query";
import { backendApi } from "@/lib/backend-api";
import { ParamsGetDto } from "@/dtos/param.dto";
import {
  getAllApiRequest,
  getByIdApiRequest,
  postApiRequest,
  updateApiRequest,
  requestHeaders,
} from "@/lib/config.api";
import { useCallback } from "react";
import { FormLocationValues, LocationResponse, StoreLocationDto } from "@/dtos/location.dto";
import axios from "axios";

const locationApiUrl = (buCode: string, id?: string) => {
  const baseUrl = `${backendApi}/api/config/${buCode}/locations`;
  return id ? `${baseUrl}/${id}` : `${baseUrl}`;
};

/**
 * Hook สำหรับ query locations ทั้งหมด (รองรับทั้ง object และ positional params)
 */
export const useLocationsQuery = (
  tokenOrParams: string | { token: string; buCode: string; params?: ParamsGetDto },
  buCodeOrUndefined?: string,
  paramsOrUndefined?: ParamsGetDto
) => {
  // รองรับทั้ง 2 รูปแบบการเรียกใช้
  const isObjectParam = typeof tokenOrParams === "object";
  const token = isObjectParam ? tokenOrParams.token : tokenOrParams;
  const buCode = isObjectParam ? tokenOrParams.buCode : buCodeOrUndefined!;
  const params = isObjectParam ? tokenOrParams.params : paramsOrUndefined;

  const API_URL = locationApiUrl(buCode);

  const { data, isLoading, error } = useQuery({
    queryKey: ["locations", buCode, params],
    queryFn: async () => {
      if (!token || !buCode) throw new Error("Unauthorized");
      try {
        const result = await getAllApiRequest(
          API_URL,
          token,
          "Error fetching locations",
          params
        );
        return result;
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    },
    enabled: !!token && !!buCode,
  });

  const getLocationName = useCallback(
    (locationId: string) => {
      const location = data?.data?.find((l: StoreLocationDto) => l.id === locationId);
      return location?.name ?? "";
    },
    [data]
  );

  return { data, isLoading, error, getLocationName };
};

/**
 * Hook สำหรับ query location by ID (รองรับทั้ง object และ positional params)
 */
export const useLocationByIdQuery = (
  tokenOrParams:
    | string
    | { token: string; buCode: string; id: string; enabled?: boolean },
  buCodeOrUndefined?: string,
  idOrUndefined?: string,
  enabledOrUndefined?: boolean
) => {
  // รองรับทั้ง 2 รูปแบบการเรียกใช้
  const isObjectParam = typeof tokenOrParams === "object";
  const token = isObjectParam ? tokenOrParams.token : tokenOrParams;
  const buCode = isObjectParam ? tokenOrParams.buCode : buCodeOrUndefined!;
  const id = isObjectParam ? tokenOrParams.id : idOrUndefined!;
  const enabled = isObjectParam
    ? tokenOrParams.enabled ?? true
    : enabledOrUndefined ?? true;

  const API_URL = locationApiUrl(buCode, id);

  const { data, isLoading, error } = useQuery({
    queryKey: ["location", buCode, id],
    queryFn: async () => {
      try {
        const result = await getByIdApiRequest(
          API_URL,
          token,
          "Error fetching location"
        );
        return result;
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    },
    enabled: enabled && !!token && !!buCode,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: 500,
  });

  return { data, isLoading, error };
};

/**
 * Hook สำหรับ create location
 */
export const useLocationMutation = (token: string, buCode: string) => {
  const API_URL = locationApiUrl(buCode);
  return useMutation({
    mutationFn: (data: FormLocationValues) => {
      if (!token || !buCode) throw new Error("Unauthorized");
      return postApiRequest<FormLocationValues, { data: LocationResponse }>(API_URL, token, data, "Error creating location");
    },
  });
};

/**
 * Hook สำหรับ update location
 */
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

/**
 * Hook สำหรับ delete location
 */
export const useDeleteLocation = (token: string, buCode: string) => {
  return useMutation({
    mutationFn: async (id: string) => {
      if (!token || !buCode || !id) throw new Error("Unauthorized");
      try {
        const API_URL_BY_ID = locationApiUrl(buCode, id);
        const response = await axios.delete(API_URL_BY_ID, {
          headers: requestHeaders(token),
        });
        return response.data;
      } catch (error) {
        console.error("Error deleting location:", error);
        throw error;
      }
    },
  });
};

// Backward compatibility exports
export const useLocationQuery = useLocationsQuery;
