import { useMutation, useQuery } from "@tanstack/react-query";
import { backendApi } from "@/lib/backend-api";
import { ParamsGetDto } from "@/dtos/param.dto";
import {
  getAllApiRequest,
  postApiRequest,
  updateApiRequest,
  requestHeaders,
  getByIdApiRequest,
} from "@/lib/config.api";
import { RoleCreateDto, RoleUpdateDto } from "@/dtos/role.dto";
import axios from "axios";

const roleApiUrl = (buCode: string, id?: string) => {
  const baseUrl = `${backendApi}/api/config/${buCode}/application-roles`;
  return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const roleKeyList = "roles";
export const roleKeyDetails = "role-id";

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
    queryKey: [roleKeyList, buCode, params],
    queryFn: () => getAllApiRequest(API_URL, token, "Error fetching roles", params),
    enabled: !!token && !!buCode,
    staleTime: 5 * 60 * 1000,
  });

  const roles = data?.data;
  const paginate = data?.paginate;
  return { roles, paginate, isLoading, error };
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
    queryKey: [roleKeyDetails, id],
    queryFn: () => getByIdApiRequest(API_URL, token, "Error fetching role"),
    enabled: !!token && !!buCode && !!id,
    staleTime: 5 * 60 * 1000,
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

export const useUserRoleIdQuery = (token: string, buCode: string, userId: string) => {
  const API_URL = `${backendApi}/api/config/${buCode}/user-application-roles/${userId}`;

  const { data, isLoading, error } = useQuery({
    queryKey: [roleKeyDetails, userId],
    queryFn: async () => {
      if (!token || !buCode || !userId) {
        throw new Error("Unauthorized: Missing token, buCode or userId");
      }
      try {
        const result = await getByIdApiRequest(API_URL, token, "Failed to fetch user roles");
        return result;
      } catch (err) {
        console.error("API Error:", err);
        throw err;
      }
    },
    enabled: !!token && !!buCode && !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const userData = data?.data;

  return {
    userData,
    isLoading,
    error,
  };
};

export const useUpdateUserRoles = (token: string, buCode: string) => {
  return useMutation({
    mutationFn: async (data: {
      user_id: string;
      application_role_id: { add?: string[]; remove?: string[] };
    }) => {
      if (!token || !buCode || !data.user_id) throw new Error("Unauthorized");
      const pathName = `api/config/${buCode}/user-application-roles`;
      const API_URL = `${backendApi}/${pathName}`;
      return await updateApiRequest(API_URL, token, data, "Error updating user roles", "PATCH");
    },
  });
};
