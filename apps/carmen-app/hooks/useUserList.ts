import { useQuery } from "@tanstack/react-query";
import { backendApi } from "@/lib/backend-api";
import { getAllApiRequest, getByIdApiRequest } from "@/lib/config.api";
import { ParamsGetDto } from "@/dtos/param.dto";

export const userRoleListKey = "users";
export const userRoleIdKey = "user-id";

export const useUserList = (token: string, buCode: string, params?: ParamsGetDto) => {
  const API_URL = `${backendApi}/api/${buCode}/users`;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [userRoleListKey, buCode, params],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      try {
        const result = await getAllApiRequest(API_URL, token, "Failed to fetch user list", params);
        return result;
      } catch (err) {
        console.error("API Error:", err);
        throw err;
      }
    },
    enabled: !!token && !!buCode,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });

  const isUnauthorized =
    isError && error instanceof Error && error.message.includes("Unauthorized");

  const getUserName = (userId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = data?.data?.find((user: any) => user.user_id === userId);
    return user?.firstname ?? "";
  };

  return {
    userList: data?.data,
    isLoading,
    isUnauthorized,
    getUserName,
    error,
  };
};

export const useUserIdQuery = (token: string, buCode: string, userId: string) => {
  const API_URL = `${backendApi}/api/${buCode}/users/${userId}`;

  const { data, isLoading, error } = useQuery({
    queryKey: [userRoleIdKey, userId],
    queryFn: async () => {
      if (!token || !buCode || !userId) {
        throw new Error("Unauthorized: Missing token, buCode or userId");
      }

      try {
        const result = await getByIdApiRequest(API_URL, token, "Failed to fetch user");
        return result;
      } catch (err) {
        console.error("API Error:", err);
        throw err;
      }
    },
    enabled: !!token && !!buCode && !!userId,
  });

  const userData = data?.data;

  return { userData, isLoading, error };
};
