import { useMutation, useQuery } from "@tanstack/react-query";
import { ParamsGetDto } from "@/dtos/param.dto";
import { ActionPr, CreatePrDto, PurchaseRequestUpdateFormDto } from "@/dtos/purchase-request.dto";
import { backendApi } from "@/lib/backend-api";
import {
  getAllApiRequest,
  postApiRequest,
  updateApiRequest,
  getByIdApiRequest,
} from "@/lib/config.api";
import axios from "axios";

export const usePurchaseRequest = (
  token: string,
  buCode: string,
  params?: ParamsGetDto,
  type?: string
) => {
  const PR_URL = `${backendApi}/api/purchase-request`;

  const MY_PENDING = `${backendApi}/api/my-pending/purchase-request`;

  const API_URL = type === "my-pending" ? MY_PENDING : PR_URL;

  const { data, isLoading, error } = useQuery({
    queryKey: ["purchase-request", buCode, params, type],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      const queryParams = { ...params, bu_code: API_URL === MY_PENDING ? undefined : buCode };

      return await getAllApiRequest(
        API_URL,
        token,
        "Error fetching PRs",
        API_URL === MY_PENDING ? undefined : queryParams
      );
    },
    enabled: !!token && !!buCode,
  });

  const prs = data;

  return { prs, isLoading, error };
};

export const usePurchaseRequestById = (token: string, buCode: string, id: string) => {
  const API_URL_ID = `${backendApi}/api/${buCode}/purchase-request/${id}`;

  const { data, isLoading, error } = useQuery({
    queryKey: ["purchase-request", buCode, id],
    queryFn: async () => {
      return await getByIdApiRequest(API_URL_ID, token, "Error fetching purchase request");
    },
    enabled: !!token && !!buCode && !!id,
  });
  const purchaseRequest = data;
  return { purchaseRequest, isLoading, error };
};

export const useCreatePr = (token: string, buCode: string) => {
  const API_URL = `${backendApi}/api/${buCode}/purchase-request`;
  return useMutation({
    mutationFn: async (payload: CreatePrDto) => {
      return await postApiRequest(API_URL, token, payload, "Error creating PR");
    },
  });
};

export const useUpdatePr = (token: string, buCode: string) => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
      action,
    }: {
      id: string;
      data: PurchaseRequestUpdateFormDto;
      action?: ActionPr;
    }) => {
      let API_URL_ID = `${backendApi}/api/${buCode}/purchase-request/${id}`;
      if (action) {
        API_URL_ID += `/${action}`;
      }
      return await updateApiRequest(API_URL_ID, token, data, "Error updating PR", "PUT");
    },
  });
};

export const useDeletePr = (token: string, buCode: string) => {
  return useMutation({
    mutationFn: async (id: string) => {
      const API_URL_ID = `${backendApi}/api/${buCode}/purchase-request/${id}`;
      const res = await axios.delete(API_URL_ID, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
  });
};

export const useUpdateUPr = (token: string, buCode: string, id: string, action?: ActionPr) => {
  return useMutation({
    mutationFn: async (data: PurchaseRequestUpdateFormDto) => {
      let API_URL_ID = `${backendApi}/api/${buCode}/purchase-request/${id}`;
      if (action) {
        API_URL_ID += `/${action}`;
      }
      return await updateApiRequest(API_URL_ID, token, data, "Error updating PR", "PATCH");
    },
  });
};
