import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClusterDto } from "@/dto/cluster.dto";
import { Badge } from "@/components/ui/badge";
import { FolderTree, Globe } from "lucide-react";

interface Props {
    readonly clusters: ClusterDto[];
}

export default function ClusterList({ clusters }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clusters.map((cluster) => {
                const statusColorMap = {
                    "Active": "bg-green-500",
                    "Maintenance": "bg-yellow-500",
                    "Inactive": "bg-gray-500",
                    "Pending": "bg-blue-500"
                };

                const badgeColor = statusColorMap[cluster.status as keyof typeof statusColorMap] || "bg-blue-500";

                return (
                    <Card key={cluster.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <FolderTree className="w-4 h-4 text-muted-foreground" />
                                    {cluster.name}
                                </CardTitle>
                                <Badge className={badgeColor}>
                                    {cluster.status}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-gray-500">{cluster.region}</p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500">Active BU</p>
                                    <p className="font-medium">{cluster.active_bu}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500">Total Rooms</p>
                                    <p className="font-medium">{cluster.total_rooms}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500">Employees</p>
                                    <p className="font-medium">{cluster.total_employees}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500">Avg. Unit</p>
                                    <p className="font-medium">{cluster.avg_unit}</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-2 border-t border-gray-200">
                                <p className="text-xs text-gray-500">Created: {new Date(cluster.createdAt).toLocaleDateString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
