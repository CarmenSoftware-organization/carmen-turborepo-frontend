import {
  DepartmentCreateDto,
  DepartmentGetListDto,
  DepartmentUpdateDto,
} from "@/dtos/department.dto";
import { ParamsGetDto } from "@/dtos/param.dto";
import { backendApi } from "@/lib/backend-api";
import {
  getAllApiRequest,
  getByIdApiRequest,
  postApiRequest,
  updateApiRequest,
  deleteApiRequest,
} from "@/lib/config.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

const departmentApiUrl = (buCode: string, id?: string) => {
  const baseUrl = `${backendApi}/api/config/${buCode}/departments`;
  return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const departmentKey = "departments";
export const departmentIdKey = "department-id";

export const useDepartmentsQuery = (token: string, buCode: string, params?: ParamsGetDto) => {
  const API_URL = departmentApiUrl(buCode);

  const { data, isLoading, error } = useQuery({
    queryKey: [departmentKey, buCode, params],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return await getAllApiRequest(API_URL, token, "Error fetching department", params ?? {});
    },
    enabled: !!token && !!buCode,
    staleTime: 5 * 60 * 1000,
  });

  const departments = data;
  const isUnauthorized = error instanceof Error && error.message.includes("Unauthorized");

  const getDepartmentName = useCallback(
    (departmentId: string) => {
      const department = departments?.find((dp: DepartmentGetListDto) => dp.id === departmentId);
      return department?.name ?? "";
    },
    [departments]
  );

  return {
    departments,
    getDepartmentName,
    isLoading,
    error,
    isUnauthorized,
  };
};

export const useDepartmentByIdQuery = (token: string, buCode: string, id: string) => {
  const API_ID = departmentApiUrl(buCode, id);
  return useQuery({
    queryKey: [departmentIdKey, id],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return await getByIdApiRequest(API_ID, token, "Error fetching department");
    },
    enabled: !!token && !!buCode && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDepartmentMutation = (token: string, buCode: string) => {
  const API_URL = departmentApiUrl(buCode);
  return useMutation<unknown, Error, DepartmentCreateDto>({
    mutationFn: async (data: DepartmentCreateDto) => {
      return await postApiRequest(API_URL, token, data, "Error creating department");
    },
  });
};

export const useDepartmentUpdateMutation = (token: string, buCode: string, id: string) => {
  const API_ID = departmentApiUrl(buCode, id);
  return useMutation<unknown, Error, DepartmentUpdateDto>({
    mutationFn: async (data: DepartmentUpdateDto) => {
      return await updateApiRequest(API_ID, token, data, "Error updating department", "PATCH");
    },
  });
};

export const useDepartmentDeleteMutation = (token: string, buCode: string) => {
  return useMutation<unknown, Error, string>({
    mutationFn: async (id: string) => {
      const API_URL = departmentApiUrl(buCode, id);
      return await deleteApiRequest(API_URL, token, "Error deleting department");
    },
  });
};
