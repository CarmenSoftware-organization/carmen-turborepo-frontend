import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllClusters, postCluster } from "@/services/cluster.service";
import { ClusterPostDto } from "@/dtos/cluster.dto";

export const useClusterQuery = (token: string) => {
    return useQuery({
        queryKey: ["clusters"],
        queryFn: async () => {
            const data = await getAllClusters(token);
            return data;
        },
        enabled: !!token,
    });
};

export const useClusterMutation = (token: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (clusterData: ClusterPostDto) => postCluster(token, clusterData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clusters"] });
        },
    });
}; 