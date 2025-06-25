"use client";

import { useAuth } from "@/context/AuthContext";
import { getUserList } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";
import { backendApi } from "@/lib/backend-api";
import { getAllApiRequest } from "@/lib/config.api";

const API_URL = `${backendApi}/api/user`;

export const useUserList = () => {
  const { token, tenantId } = useAuth();

  console.log("🔍 useUserList Debug:", {
    token: token ? "✅ exists" : "❌ missing",
    tenantId: tenantId ? "✅ exists" : "❌ missing",
    API_URL,
    backendApi,
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", tenantId],
    queryFn: async () => {
      if (!token || !tenantId) {
        console.log("❌ Missing credentials");
        throw new Error("Unauthorized: Missing token or tenantId");
      }

      try {
        const result = await getAllApiRequest(
          API_URL,
          token,
          tenantId,
          "Failed to fetch user list",
          
        );

        return result;
      } catch (err) {
        console.error("❌ API Error details:", err);
        throw err;
      }
    },
    enabled: !!token && !!tenantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // เพิ่ม retry
    retryDelay: 1000, // delay 1 วินาที
  });

  console.log("📊 Query State:", {
    data,
    isLoading,
    isError,
    error: error?.message,
    enabled: !!token && !!tenantId,
  });

  const isUnauthorized =
    isError && error instanceof Error && error.message.includes("Unauthorized");

  const getUserName = (userId: string) => {
    const user = data?.find((user: any) => user.user_id === userId);
    return user?.firstname ?? "";
  };

  return {
    data,
    isLoading,
    isUnauthorized,
    getUserName,
  };
};
