import { ParamsGetDto } from "@/dtos/param.dto";
import { getAllApiRequest, getApiUrl } from "@/lib/config.api";
import { useQuery } from "@tanstack/react-query";

const queryKey = "permissions";

export const usePermissionQuery = (token: string, buCode: string, params?: ParamsGetDto) => {
  const isEnabled = Boolean(token) && Boolean(buCode);
  const pathName = `api/config/${buCode}/permissions`;
  const API_URL = getApiUrl(pathName);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: [queryKey, buCode],
    queryFn: async () => {
      return getAllApiRequest(API_URL, token, "Failed to fetch all permissions", params);
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    retryDelay: 1000,
  });

  const isUnauthorized = error instanceof Error && error.message.includes("Unauthorized");
  const permissions = data?.data ?? [];

  return {
    permissions,
    isLoading: isLoading || (!isEnabled && !data),
    isFetching,
    error,
    isUnauthorized,
  };
};
