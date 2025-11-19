import { DepartmentCreateDto, DepartmentGetListDto, DepartmentUpdateDto } from "@/dtos/department.dto";
import { ParamsGetDto } from "@/dtos/param.dto";
import { backendApi } from "@/lib/backend-api";
import {
  getAllApiRequest,
  getByIdApiRequest,
  postApiRequest,
  updateApiRequest,
  requestHeaders,
} from "@/lib/config.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import axios from "axios";

const departmentApiUrl = (buCode: string, id?: string) => {
  const baseUrl = `${backendApi}/api/config/${buCode}/departments`;
  return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const useDepartmentsQuery = (
  token: string,
  buCode: string,
  params?: ParamsGetDto
) => {
  const API_URL = departmentApiUrl(buCode);

  const { data, isLoading, error } = useQuery({
    queryKey: ["departments", buCode, params],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return await getAllApiRequest(
        API_URL,
        token,
        "Error fetching department",
        params ?? {}
      );
    },
    enabled: !!token && !!buCode,
  });

  const departments = data;
  const isUnauthorized =
    error instanceof Error && error.message.includes("Unauthorized");

  const getDepartmentName = useCallback(
    (departmentId: string) => {
      const department = departments?.find(
        (dp: DepartmentGetListDto) => dp.id === departmentId
      );
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

export const useDepartmentByIdQuery = (
  token: string,
  buCode: string,
  id: string
) => {
  const API_ID = departmentApiUrl(buCode, id);
  return useQuery({
    queryKey: ["department-id", id],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return await getByIdApiRequest(
        API_ID,
        token,
        "Error fetching department"
      );
    },
    enabled: !!token && !!buCode && !!id,
  });

};

export const useDepartmentMutation = (token: string, buCode: string) => {
  const API_URL = departmentApiUrl(buCode);
  return useMutation({
    mutationFn: async (data: DepartmentCreateDto) => {
      return await postApiRequest(
        API_URL,
        token,
        data,
        "Error creating department"
      );
    },
  });
};

export const useDepartmentUpdateMutation = (
  token: string,
  buCode: string,
  id: string
) => {
  const API_ID = departmentApiUrl(buCode, id);
  return useMutation({
    mutationFn: async (data: DepartmentUpdateDto) => {
      return await updateApiRequest(
        API_ID,
        token,
        data,
        "Error updating department",
        "PATCH"
      );
    },
  });
};

export const useDepartmentDeleteMutation = (
  token: string,
  buCode: string
) => {
  return useMutation({
    mutationFn: async (id: string) => {
      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }
      try {
        const API_URL = departmentApiUrl(buCode, id);
        const response = await axios.delete(API_URL, {
          headers: requestHeaders(token),
        });
        return response.data;
      } catch (error) {
        console.error("Error deleting department:", error);
        throw error;
      }
    },
  });
};
