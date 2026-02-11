import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { backendApi } from "@/lib/backend-api";
import { ParamsGetDto } from "@/dtos/param.dto";
import { SrDto } from "@/dtos/sr.dto";
import {
  getAllApiRequest,
  postApiRequest,
  updateApiRequest,
  deleteApiRequest,
  getByIdApiRequest,
} from "@/lib/config.api";

interface Paginate {
  total: number;
  page: number;
  perpage: number;
  pages: number;
}

export const srKey = "store-requisition";
export const srDetailKey = "store-requisition-id";

const srApiUrl = (buCode: string, id?: string) => {
  const baseUrl = `${backendApi}/api/${buCode}/store-requisition`;
  return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const useStoreRequisitionQuery = ({
  token,
  buCode,
  params,
}: {
  token: string;
  buCode: string;
  params?: ParamsGetDto;
}) => {
  const API_URL = `${backendApi}/api/store-requisition?bu_code=${buCode}`;

  const { data, isLoading, error } = useQuery({
    queryKey: [srKey, buCode, params],
    queryFn: () => getAllApiRequest(API_URL, token, "Error fetching SR", params),
    enabled: !!token && !!buCode,
  });

  const srData = data?.data?.flatMap((item: { data: SrDto[]; paginate: Paginate }) => item.data);
  const paginate = data?.data?.find((item: { paginate: Paginate }) => item.paginate)?.paginate;

  const isUnauthorized = error instanceof Error && error.message.includes("Unauthorized");

  return { srData, paginate, isLoading, error, isUnauthorized };
};

export const useSrById = (token: string, buCode: string, id: string) => {
  const API_ID = srApiUrl(buCode, id);

  const { data, isLoading, error } = useQuery({
    queryKey: [srDetailKey, buCode, id],
    queryFn: async () => {
      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      return await getByIdApiRequest(API_ID, token, "Error fetching store requisition details");
    },
    enabled: !!token && !!buCode && !!id,
  });

  const isUnauthorized = error instanceof Error && error.message.includes("Unauthorized");

  return {
    data,
    isLoading,
    error,
    isUnauthorized,
  };
};

export const useCreateSr = (token: string, buCode: string) => {
  const queryClient = useQueryClient();
  const API_URL = srApiUrl(buCode);

  return useMutation({
    mutationFn: async (data: any) => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      return await postApiRequest(API_URL, token, data, "Error creating store requisition");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [srKey, buCode] });
    },
  });
};

export const useUpdateSr = (token: string, buCode: string, id: string) => {
  const queryClient = useQueryClient();
  const API_ID = srApiUrl(buCode, id);

  return useMutation({
    mutationFn: async (data: any) => {
      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }

      return await updateApiRequest(API_ID, token, data, "Error updating store requisition", "PUT");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [srKey, buCode] });
      queryClient.invalidateQueries({ queryKey: [srDetailKey, buCode, id] });
    },
  });
};

export const useDeleteSr = (token: string, buCode: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      const API_URL = srApiUrl(buCode, id);
      return await deleteApiRequest(API_URL, token, "Error deleting store requisition");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [srKey, buCode] });
    },
  });
};
