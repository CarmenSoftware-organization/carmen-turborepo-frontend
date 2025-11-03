import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GetClusterDto } from "@/dto/cluster.dto";
import { ActivityIcon, Building2, Code, List, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useRouter } from "@/i18n/routing";

interface Props {
    readonly clusterData: GetClusterDto[];
    readonly view: "list" | "grid";
}

export default function ClusterData({
    clusterData,
    view
}: Props) {
    const router = useRouter();
    const isTable = view === "list";
    const isGrid = view === "grid";

    return (
        <div>
            {/* Table View - Hidden on mobile, shows grid instead */}
            <div className={`${isTable ? 'block max-md:hidden' : 'hidden'}`}>
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
                            <TableHead className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Building2 className="w-4 h-4" />
                                    <span>Business Unit</span>
                                </div>
                            </TableHead>
                            <TableHead className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>Cluster User</span>
                                </div>
                            </TableHead>
                            <TableHead className="text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <ActivityIcon className="w-4 h-4" />
                                    <span>Status</span>
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clusterData?.map((cluster: GetClusterDto, index: number) => (
                            <TableRow key={cluster.id}>
                                <TableCell className="text-center">{index + 1}</TableCell>
                                <TableCell className="font-semibold">
                                    <Link
                                        href={`/cluster/${cluster.id}`}
                                        className="hover:underline"
                                    >
                                        {cluster.name}
                                    </Link>
                                </TableCell>
                                <TableCell>{cluster.code}</TableCell>
                                <TableCell className="text-right">{cluster._count.tb_business_unit}</TableCell>
                                <TableCell className="text-right">{cluster._count.tb_cluster_user}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" className="gap-1.5 border-none">
                                        <span
                                            className={cn(
                                                cluster.is_active ? "bg-green-500" : "bg-red-500",
                                                "size-1.5 rounded-full"
                                            )}
                                            aria-hidden="true"
                                        />
                                        {cluster.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className={cn(
                "grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
                isGrid ? 'grid' : 'hidden max-md:grid'
            )}>
                {clusterData?.map((cluster: GetClusterDto) => (
                    <Card
                        key={cluster.id}
                        onClick={() => router.push(`/cluster/${cluster.id}`)}
                        className="group cursor-pointer hover:shadow-lg hover:shadow-primary/5 hover:bg-card/80 transition-all duration-200"
                    >
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold line-clamp-1 min-w-0 flex-1 leading-tight group-hover:text-primary transition-colors">
                                {cluster.code}
                            </CardTitle>
                            <Badge variant="outline" className="gap-1.5 border-none">
                                <span
                                    className={cn(
                                        cluster.is_active ? "bg-green-500" : "bg-red-500",
                                        "size-1.5 rounded-full"
                                    )}
                                    aria-hidden="true"
                                />
                                {cluster.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center gap-2 rounded-lg">
                                <List className="w-4 h-4 text-primary" />
                                <p className="text-sm font-semibold truncate">
                                    {cluster.name}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-2 rounded-lg">
                                    <Building2 className="w-4 h-4  text-orange-700" />
                                    <p className="font-bold text-lg leading-none">
                                        {cluster._count.tb_business_unit}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 rounded-lg">
                                    <Users className="w-4 h-4 text-purple-700" />
                                    <p className="font-bold text-lg leading-none">
                                        {cluster._count.tb_cluster_user}
                                    </p>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {(!clusterData || clusterData.length === 0) && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Building2 className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No clusters found</h3>
                    <p className="text-muted-foreground">
                        There are no clusters to display at the moment.
                    </p>
                </div>
            )}
        </div>
    )
};