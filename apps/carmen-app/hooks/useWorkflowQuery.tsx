import { useQuery } from "@tanstack/react-query";
import { backendApi } from "@/lib/backend-api";
import { enum_workflow_type } from "@/dtos/workflows.dto";
import axios from "axios";

export const useWorkflowQuery = (token: string, buCode: string, type: enum_workflow_type) => {
  const API_URL = `${backendApi}/api/${buCode}/workflow/type/${type}`;

  const { data, isLoading, error } = useQuery({
    queryKey: ["workflow", buCode, type],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      const { data } = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return data;
    },
    enabled: !!token && !!buCode,
  });

  return {
    workflows: data?.data,
    isLoading,
    error,
  };
};
