import { useQuery } from "@tanstack/react-query";
import { backendApi } from "@/lib/backend-api";
import { getAllApiRequest } from "@/lib/config.api";

export const useUserList = (token: string, buCode: string) => {
  const API_URL = `${backendApi}/api/${buCode}/users`;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", buCode],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      try {
        const result = await getAllApiRequest(
          API_URL,
          token,
          "Failed to fetch user list"
        );
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
  };
};
