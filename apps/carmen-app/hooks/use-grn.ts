import { useMutation, useQuery } from "@tanstack/react-query";
import { ParamsGetDto } from "@/dtos/param.dto";
import { backendApi } from "@/lib/backend-api";
import {
  getAllApiRequest,
  getByIdApiRequest,
  postApiRequest,
  updateApiRequest,
  requestHeaders,
} from "@/lib/config.api";
import { CreateGRNDto, GoodsReceivedNoteListDto } from "@/dtos/grn.dto";
import axios from "axios";
import { useCallback } from "react";

const grnApiUrl = (buCode: string, id?: string) => {
  const baseUrl = `${backendApi}/api/config/${buCode}/good-received-note`;
  return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

/**
 * Query all GRNs with params
 */
export const useGrnQuery = (
  token: string,
  buCode: string,
  params?: ParamsGetDto
) => {
  const API_URL = grnApiUrl(buCode);
  const { data, isLoading, error } = useQuery({
    queryKey: ["grn", buCode, params],
    queryFn: () =>
      getAllApiRequest(API_URL, token, "Error fetching GRNs", params),
    enabled: !!token && !!buCode,
  });

  const getGrnNo = useCallback(
    (id: string) => {
      const found = data?.data?.find(
        (grn: GoodsReceivedNoteListDto) => grn.id === id
      );
      return found?.grn_no ?? null;
    },
    [data]
  );

  return { data, isLoading, error, getGrnNo };
};

/**
 * Query GRN by ID
 */
export const useGrnByIdQuery = (
  token: string,
  buCode: string,
  id: string
) => {
  const API_URL = grnApiUrl(buCode, id);
  const { data, isLoading, error } = useQuery({
    queryKey: ["grn", buCode, id],
    queryFn: () => getByIdApiRequest(API_URL, token, "Error fetching GRN"),
    enabled: !!token && !!buCode && !!id,
  });
  return { data, isLoading, error };
};

/**
 * Create GRN mutation
 */
export const useGrnMutation = (token: string, buCode: string) => {
  const API_URL = grnApiUrl(buCode);
  return useMutation({
    mutationFn: (data: CreateGRNDto) =>
      postApiRequest(API_URL, token, data, "Error creating GRN"),
  });
};

/**
 * Update GRN mutation
 */
export const useGrnUpdate = (token: string, buCode: string, id: string) => {
  const API_URL = grnApiUrl(buCode, id);
  return useMutation({
    mutationFn: (data: CreateGRNDto) =>
      updateApiRequest(API_URL, token, data, "Error updating GRN", "PATCH"),
  });
};

/**
 * Delete GRN mutation
 */
export const useGrnDelete = (token: string, buCode: string) => {
  return useMutation({
    mutationFn: async (id: string) => {
      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }
      try {
        const API_URL_BY_ID = grnApiUrl(buCode, id);
        const response = await axios.delete(API_URL_BY_ID, {
          headers: requestHeaders(token),
        });
        return response.data;
      } catch (error) {
        console.error("Error deleting GRN:", error);
        throw error;
      }
    },
  });
};

// Backward compatibility aliases
export const useUpdateCreditNote = useGrnUpdate;
