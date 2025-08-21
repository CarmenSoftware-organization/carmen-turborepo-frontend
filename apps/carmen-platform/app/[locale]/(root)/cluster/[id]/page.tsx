"use client";

import { useClusterById } from "@/app/hooks/useCluster";
import DetailCluster from "../components/DetailCluster";
import { useParams } from "next/navigation";

export default function ClusterDetail() {
    const { id } = useParams();

    const { data, isLoading, error } = useClusterById(id as string);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return <DetailCluster mode="edit" cluster={data} />;
}