import { WorkflowData, WorkflowCreateModel } from "@/dtos/workflows.dto";
import { backendApi } from "@/lib/backend-api";
import { ParamsGetDto } from "@/dtos/param.dto";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllApiRequest,
  getByIdApiRequest,
  postApiRequest,
  updateApiRequest,
} from "@/lib/config.api";

interface WorkflowListProps {
  id: string;
  name: string;
  workflow_type: string;
  stages: number;
  rules: number;
  data: WorkflowData;
  is_active: string;
}

interface UseWorkflowByIdParams {
  token: string;
  buCode: string;
  id: string;
  enabled?: boolean;
}

const getWorkflowApiUrl = (buCode: string, path: string = "") => {
  const baseUrl = `${backendApi}/api/config/${buCode}/workflows`;
  return path ? `${baseUrl}/${path}` : baseUrl;
};

export const useWorkflow = (token: string, buCode: string, params?: ParamsGetDto) => {
  const API_URL = getWorkflowApiUrl(buCode);
  const { data, isLoading, error } = useQuery({
    queryKey: ["workflows", buCode, params],

    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      const data = await getAllApiRequest(
        API_URL,
        token,
        "Failed to fetch price list",
        params ?? {}
      );

      const newData = data.data.map((item: WorkflowListProps) => ({
        ...item,
        stages: item.data.stages.length,
        rules: item.data.routing_rules.length,
      }));

      return newData;
    },
    enabled: !!token && !!buCode,
  });

  const isUnauthorized = error instanceof Error && error.message.includes("Unauthorized");

  return { data: data, isLoading, error, isUnauthorized };
};

export const useWorkflowIdQuery = ({
  token,
  buCode,
  id,
  enabled = true,
}: UseWorkflowByIdParams) => {
  const API_URL_BY_ID = getWorkflowApiUrl(buCode, id);

  return useQuery({
    queryKey: ["workflow", buCode, id],
    queryFn: () => {
      if (!token || !buCode || !id) throw new Error("Unauthorized");
      return getByIdApiRequest(API_URL_BY_ID, token, "Error fetching workflow");
    },
    staleTime: 60000,
    enabled: enabled && !!token && !!buCode && !!id,
  });
};

// Mutation Hooks
export const useCreateWorkflowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      buCode,
      workflow,
    }: {
      token: string;
      buCode: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      workflow: any;
    }) => {
      if (!token || !buCode) throw new Error("Unauthorized");
      const API_URL = getWorkflowApiUrl(buCode);
      return postApiRequest(API_URL, token, workflow, "Error creating workflow");
    },
    onSuccess: (_data, variables) => {
      // Invalidate workflow list
      queryClient.invalidateQueries({ queryKey: ["workflows", variables.buCode] });
    },
  });
};

export const useUpdateWorkflowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      buCode,
      id,
      workflow,
    }: {
      token: string;
      buCode: string;
      id: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      workflow: any;
    }) => {
      if (!token || !buCode || !id) throw new Error("Unauthorized");
      const API_URL_BY_ID = getWorkflowApiUrl(buCode, id);
      return updateApiRequest(API_URL_BY_ID, token, workflow, "Error updating product", "PUT");
    },
    onSuccess: async (_data, variables) => {
      // Invalidate both list and detail queries and wait for them to refetch
      await queryClient.invalidateQueries({ queryKey: ["workflow", variables.buCode] });
      await queryClient.invalidateQueries({
        queryKey: ["workflow", variables.buCode, variables.id],
      });
    },
  });
};

export const useWorkflowMutation = (token: string, buCode: string) => {
  const API_URL = getWorkflowApiUrl(buCode);
  return useMutation({
    mutationFn: async (data: WorkflowCreateModel) => {
      return await postApiRequest(API_URL, token, data, "Error creating vendor");
    },
  });
};
