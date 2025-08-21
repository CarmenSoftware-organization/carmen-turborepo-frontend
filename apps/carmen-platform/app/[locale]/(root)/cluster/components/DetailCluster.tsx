interface DetailClusterProps {
    cluster?: any;
    mode: "add" | "edit";
}

export default function DetailCluster({ cluster, mode }: DetailClusterProps) {
    return <div>DetailCluster {mode}</div>;
}