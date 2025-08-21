import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GetClusterDto } from "@/dto/cluster.dto";
import { ActivityIcon, Building2, Code, List, SquarePen, Trash2, Users } from "lucide-react";
import FormClusterDialog from "./FormClusterDialog";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

interface Props {
    readonly clusterData: GetClusterDto[];
    readonly handleDelete: (cluster: GetClusterDto) => void;
    readonly view: "list" | "grid";
}

export default function ClusterData({
    clusterData,
    handleDelete,
    view
}: Props) {

    return (
        <div>
            {view === "list" && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center w-14">#</TableHead>
                            <TableHead>
                                <div className="flex items-center gap-2">
                                    <List className="w-4 h-4" />
                                    <span>Name</span>
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center gap-2">
                                    <Code className="w-4 h-4" />
                                    <span>Code</span>
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    <span>Business Unit</span>
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>Cluster User</span>
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center gap-2">
                                    <ActivityIcon className="w-4 h-4" />
                                    <span>Status</span>
                                </div>
                            </TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clusterData?.map((cluster: GetClusterDto, index: number) => (
                            <TableRow key={cluster.id}>
                                <TableCell className="text-center">{index + 1}</TableCell>
                                <TableCell>
                                    <Link href={`/cluster/${cluster.id}`}>
                                        {cluster.name}
                                    </Link>
                                </TableCell>
                                <TableCell>{cluster.code}</TableCell>

                                <TableCell>{cluster._count.tb_business_unit}</TableCell>
                                <TableCell>{cluster._count.tb_cluster_user}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="gap-1.5">
                                        <span
                                            className={cn(cluster.is_active ? "bg-green-500" : "bg-red-500", "size-1.5 rounded-full")}
                                            aria-hidden="true"
                                        ></span>
                                        {cluster.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="hover:bg-transparent hover:text-destructive"
                                        onClick={() => handleDelete(cluster)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            {view === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clusterData?.map((cluster: GetClusterDto) => (
                        <Card key={cluster.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-lg font-semibold line-clamp-2">
                                        {cluster.name}
                                    </CardTitle>
                                    <Badge variant="outline" className="shrink-0">
                                        <span
                                            className={cn(cluster.is_active ? "bg-green-500" : "bg-red-500", "size-1.5 rounded-full")}
                                            aria-hidden="true"
                                        ></span>
                                        {cluster.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                <div className="flex items-center gap-2 text-sm">
                                    <Code className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">Code:</span>
                                    <span className="px-2 py-1 rounded text-xs">
                                        {cluster.code}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <Building2 className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">Business Units:</span>
                                    <span className="font-semibold">{cluster._count.tb_business_unit}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <Users className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">Cluster Users:</span>
                                    <span className="font-semibold">{cluster._count.tb_cluster_user}</span>
                                </div>

                                <div className="flex items-center gap-2 justify-end">
                                    <FormClusterDialog
                                        mode="edit"
                                        clusterData={cluster}
                                        trigger={
                                            <Button variant="outline" size="sm">
                                                <SquarePen className="w-4 h-4" />
                                            </Button>
                                        }
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="hover:text-destructive hover:border-destructive"
                                        onClick={() => handleDelete(cluster)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}