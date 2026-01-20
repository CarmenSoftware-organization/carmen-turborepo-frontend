import { useMutation, useQuery } from "@tanstack/react-query";
import { backendApi } from "@/lib/backend-api";
import { ParamsGetDto } from "@/dtos/param.dto";
import {
  getAllApiRequest,
  postApiRequest,
  updateApiRequest,
  requestHeaders,
} from "@/lib/config.api";
import { useCallback } from "react";
import { RoleDto, RoleCreateDto, RoleUpdateDto } from "@/dtos/role.dto";
import axios from "axios";

const roleApiUrl = (buCode: string, id?: string) => {
  const baseUrl = `${backendApi}/api/config/${buCode}/application-roles`;
  return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const useRoleQuery = ({
  token,
  buCode,
  params,
}: {
  token: string;
  buCode: string;
  params?: ParamsGetDto;
}) => {
  const API_URL = roleApiUrl(buCode);

  const { data, isLoading, error } = useQuery({
    queryKey: ["roles", buCode, params],
    queryFn: async () => {
      try {
        const result = await getAllApiRequest(API_URL, token, "Error fetching roles", params);
        return result;
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    },
    enabled: !!token && !!buCode,
  });

  const getRoleName = useCallback(
    (roleId: string) => {
      const role = data?.data.find((r: RoleDto) => r.id === roleId);
      return role?.application_role_name || role?.name || "";
    },
    [data]
  );

  const roles = data?.data;
  return { roles, isLoading, error, getRoleName };
};

export const useRoleMutation = (token: string, buCode: string) => {
  const API_URL = roleApiUrl(buCode);
  return useMutation({
    mutationFn: async (data: RoleCreateDto) => {
      if (!token || !buCode) throw new Error("Unauthorized");
      return await postApiRequest(API_URL, token, data, "Error creating role");
    },
  });
};

export const useUpdateRole = (token: string, buCode: string) => {
  return useMutation({
    mutationFn: async (data: RoleUpdateDto) => {
      if (!token || !buCode || !data.id) throw new Error("Unauthorized");
      const API_URL_BY_ID = roleApiUrl(buCode, data.id);
      return await updateApiRequest(API_URL_BY_ID, token, data, "Error updating role", "PUT");
    },
  });
};

export const useDeleteRole = (token: string, buCode: string) => {
  return useMutation({
    mutationFn: async (id: string) => {
      if (!token || !buCode || !id) throw new Error("Unauthorized");
      try {
        const API_URL_BY_ID = roleApiUrl(buCode, id);
        const response = await axios.delete(API_URL_BY_ID, {
          headers: requestHeaders(token),
        });
        return response.data;
      } catch (error) {
        console.error("Error deleting role:", error);
        throw error;
      }
    },
  });
};

export const useRoleByIdQuery = (token: string, buCode: string, id: string) => {
  const API_URL = roleApiUrl(buCode, id);

  const { data, isLoading, error } = useQuery({
    queryKey: ["role-id", id],
    queryFn: async () => {
      try {
        const result = await getAllApiRequest(API_URL, token, "Error fetching role");
        return result;
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    },
    enabled: !!token && !!buCode && !!id,
  });

  const roleData = data?.data;

  return { roleData, isLoading, error };
};

export const useAssignRoleToUser = (token: string, buCode: string) => {
  return useMutation({
    mutationFn: async (data: { user_id: string; application_role_id: string }) => {
      if (!token || !buCode || !data.user_id) throw new Error("Unauthorized");
      const pathName = `api/config/${buCode}/user-application-roles`;
      const API_URL = `${backendApi}/${pathName}`;
      return await postApiRequest(API_URL, token, data, "Error assigning role to user");
    },
  });
};
