import { backendApi } from "@/lib/backend-api";
import { getAllApiRequest } from "@/lib/config.api";
import { useQuery } from "@tanstack/react-query";

export const usePrevWorkflow = ({
  token,
  buCode,
  workflow_id,
  stage,
}: {
  token: string;
  buCode: string;
  workflow_id: string;
  stage?: string;
}) => {
  const baseUrl = `${backendApi}/api/${buCode}/workflow/${workflow_id}/previous_stages`;
  const API_URL = stage ? `${baseUrl}?stage=${stage}` : baseUrl;

  const { data, isLoading, error } = useQuery({
    queryKey: ["previous-workflow-stages", buCode, workflow_id, stage],
    queryFn: async () => {
      if (!token || !buCode || !workflow_id) throw new Error("Unauthorized");
      return await getAllApiRequest(API_URL, token, "Error fetching previous workflow stages");
    },
    enabled: !!token && !!buCode && !!workflow_id,
  });

  return { data, isLoading, error };
};
