import { useQuery } from "@tanstack/react-query";
import { backendApi } from "@/lib/backend-api";
import { enum_workflow_type } from "@/dtos/workflows.dto";
import axios from "axios";
export const useWorkflowQuery = (
    token: string,
    tenantId: string,
    type: enum_workflow_type,
) => {
    const API_URL = `${backendApi}/api/workflow/type/${type}`;

    const { data, isLoading, error } = useQuery({
        queryKey: ["workflow", tenantId, type],
        queryFn: async () => {
            if (!token || !tenantId) {
                throw new Error('Unauthorized: Missing token or tenantId');
            }

            const { data } = await axios.get(API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Tenant-Id': tenantId,
                },
            });

            return data;
        },
        enabled: !!token && !!tenantId,
    });

    return {
        workflows: data?.data,
        isLoading,
        error,
    };
}