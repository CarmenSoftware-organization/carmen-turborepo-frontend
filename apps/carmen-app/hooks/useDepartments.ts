import { DepartmentCreateDto, DepartmentGetListDto, DepartmentUpdateDto } from "@/dtos/department.dto";
import { ParamsGetDto } from "@/dtos/param.dto";
import { backendApi } from "@/lib/backend-api";
import {
  deleteApiRequest,
  getAllApiRequest,
  getByIdApiRequest,
  postApiRequest,
  updateApiRequest,
} from "@/lib/config.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

const API_URL = `${backendApi}/api/config/departments`;

export const useDepartmentsQuery = (
  token: string,
  tenantId: string,
  params?: ParamsGetDto
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["departments", tenantId, params],
    queryFn: async () => {
      if (!token || !tenantId) {
        throw new Error("Unauthorized: Missing token or tenantId");
      }
      return await getAllApiRequest(
        API_URL,
        token,
        tenantId,
        "Error fetching department",
        params ?? {}
      );
    },
    enabled: !!token && !!tenantId,
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
  tenantId: string,
  id: string
) => {
  const API_ID = `${API_URL}/${id}`;
  return useQuery({
    queryKey: ["department-id", id],
    queryFn: async () => {
      if (!token || !tenantId) {
        throw new Error("Unauthorized: Missing token or tenantId");
      }
      return await getByIdApiRequest(
        API_ID,
        token,
        tenantId,
        "Error fetching department"
      );
    },
    enabled: !!token && !!tenantId && !!id,
  });

};

export const useDepartmentMutation = (token: string, tenantId: string) => {
  return useMutation({
    mutationFn: async (data: DepartmentCreateDto) => {
      return await postApiRequest(
        API_URL,
        token,
        tenantId,
        data,
        "Error creating department"
      );
    },
  });
};

export const useDepartmentUpdateMutation = (
  token: string,
  tenantId: string,
  id: string
) => {
  const API_ID = `${API_URL}/${id}`;
  return useMutation({
    mutationFn: async (data: DepartmentUpdateDto) => {
      return await updateApiRequest(
        API_ID,
        token,
        tenantId,
        id,
        "Error updating department",
        "PATCH"
      );
    },
  });
};

export const useDepartmentDeleteMutation = (
  token: string,
  tenantId: string
) => {
  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteApiRequest(
        API_URL,
        token,
        tenantId,
        id,
        "Error to delete department"
      );
    },
  });
};
