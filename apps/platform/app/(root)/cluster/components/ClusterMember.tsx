import { Button } from "@/components/ui/button";
import { mockClusterMembers } from "@/mock-data/cluster";
import ClusterMemberList from "./ClusterMemberList";

export default function ClusterMember() {
    const clusterMembers = mockClusterMembers;
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="">
                    <h2 className="text-2xl font-bold tracking-tight">Cluster Members</h2>
                    <p className="text-muted-foreground">
                        Manage users and roles across clusters
                    </p>
                </div>
                <Button>Add Member</Button >
            </div>
            <ClusterMemberList clusterMembers={clusterMembers} />
        </div>
    )
}
