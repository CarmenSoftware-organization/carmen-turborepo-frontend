import { ClusterPostDto } from "@/dtos/cluster.dto";
import { backendApi } from "@/lib/backend-api";
import axios from "axios";

const API_CLUSTER = `${backendApi}/api-system/cluster`;

export const getAllClusters = async (token: string) => {
    try {
        const response = await axios.get(API_CLUSTER, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error: any) {
        console.error("Get cluster failed:", error.response?.data ?? error.message);
        return error;
    }
}

export const postCluster = async (token: string, clusterData: ClusterPostDto) => {
    try {
        const response = await axios.post(API_CLUSTER, clusterData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error: any) {
        console.error("Post cluster failed:", error.response?.data ?? error.message);
        return error;
    }
}
