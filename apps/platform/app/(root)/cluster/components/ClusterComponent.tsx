import { Button } from "@/components/ui/button";
import ClusterList from "./ClusterList";
import { mockClusters } from "@/mock-data/cluster";

export default function ClusterComponent() {
    const clusters = mockClusters;
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="">
                    <h2 className="text-2xl font-bold tracking-tight">Clusters</h2>
                    <p className="text-muted-foreground">
                        Manage cluster infrastructure and business units
                    </p>
                </div>
                <Button>Add Cluster</Button>
            </div>
            <ClusterList clusters={clusters} />
        </div>
    )
}

