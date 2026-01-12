import { backendApi } from "@/lib/backend-api";
import { getAllApiRequest } from "@/lib/config.api";
import { useQuery } from "@tanstack/react-query";

export const useWorkflowStageQuery = (token: string, buCode: string) => {
  const API_URL = `${backendApi}/api/${buCode}/purchase-request/workflow-stages`;
  const { data, isLoading, error } = useQuery({
    queryKey: ["workflow-stages", buCode],
    queryFn: () => getAllApiRequest(API_URL, token, "Error fetching workflow stages"),
    enabled: !!token && !!buCode,
  });

  const workflowData = data?.data;

  return { data: workflowData, isLoading, error };
};
