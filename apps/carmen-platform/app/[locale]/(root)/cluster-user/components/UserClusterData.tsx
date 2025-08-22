import { IUserClusterDTO, PLATFORM_ROLE } from "@/dto/cluster.dto";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActivityIcon, Building2, List, Users, Mail, User, Shield, Settings, UserCog, Headphones, Lock, Code } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, getPlatformName } from "@/lib/utils";

interface Props {
    userClusters: IUserClusterDTO[];
    view: "list" | "grid";
}

export default function UserClusterData({ userClusters, view }: Props) {
    const isTable = view === "list";
    const isGrid = view === "grid";

    const getRolIcon = (role: PLATFORM_ROLE) => {
        switch (role) {
            case PLATFORM_ROLE.SUPER_ADMIN:
                return <Shield className="h-4 w-4 text-muted-foreground" />;
            case PLATFORM_ROLE.PLATFORM_ADMIN:
                return <Settings className="h-4 w-4 text-muted-foreground" />;
            case PLATFORM_ROLE.SUPPORT_MANAGER:
                return <UserCog className="h-4 w-4 text-muted-foreground" />;
            case PLATFORM_ROLE.SUPPORT_STAFF:
                return <Headphones className="h-4 w-4 text-muted-foreground" />;
            case PLATFORM_ROLE.SECURITY_OFFICER:
                return <Lock className="h-4 w-4 text-muted-foreground" />;
            case PLATFORM_ROLE.INTEGRATION_DEVELOPER:
                return <Code className="h-4 w-4 text-muted-foreground" />;
            case PLATFORM_ROLE.USER:
                return <User className="h-4 w-4 text-muted-foreground" />;
            default:
                return <User className="h-4 w-4 text-muted-foreground" />;
        }
    };

    const getRoleBadgeVariant = (role: string) => {
        return role === 'admin' ? 'default' : 'secondary';
    };

    const getRoleIcon = (role: string) => {
        return role === 'admin' ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />;
    };

    return (
        <div>
            <div className={`${isTable ? 'block max-md:hidden' : 'hidden'}`}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center w-14">#</TableHead>
                            <TableHead>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>User Name</span>
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    <span>Email</span>
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center gap-2">
                                    <List className="w-4 h-4" />
                                    <span>Cluster</span>
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
                                    <span>Cluster Role</span>
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center gap-2">
                                    <ActivityIcon className="w-4 h-4" />
                                    <span>Platform Role</span>
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userClusters?.map((userCluster: IUserClusterDTO, index: number) => (
                            <TableRow key={userCluster.id}>
                                <TableCell className="text-center">{index + 1}</TableCell>
                                <TableCell className="font-semibold">
                                    {userCluster.user_info.firstname} {userCluster.user_info.lastname}
                                </TableCell>
                                <TableCell>{userCluster.email}</TableCell>
                                <TableCell>{userCluster.cluster.name}</TableCell>
                                <TableCell>{userCluster.business_unit.name}</TableCell>
                                <TableCell>
                                    <Badge variant={getRoleBadgeVariant(userCluster.role)} className="flex items-center gap-1 w-fit">
                                        {getRoleIcon(userCluster.role)}
                                        <span className="capitalize">{userCluster.role}</span>
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {getRolIcon(userCluster.platform_role)}
                                        {getPlatformName(userCluster.platform_role)}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className={cn(
                "grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
                isGrid ? 'grid' : 'hidden max-md:grid'
            )}>
                {userClusters?.map((userCluster: IUserClusterDTO) => (
                    <Card
                        key={userCluster.id}
                        className="group cursor-pointer hover:shadow-lg transition-all duration-200"
                    >
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold line-clamp-1 min-w-0 flex-1 leading-tight">
                                {userCluster.user_info.firstname} {userCluster.user_info.lastname}
                            </CardTitle>
                            <Badge variant={getRoleBadgeVariant(userCluster.role)} className="flex items-center gap-1 w-fit">
                                {getRoleIcon(userCluster.role)}
                                <span className="capitalize">{userCluster.role}</span>
                            </Badge>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <p className="text-sm truncate">
                                    {userCluster.email}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <List className="w-4 h-4" />
                                <p className="text-sm truncate">
                                    {userCluster.cluster.name}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                <p className="text-sm truncate">
                                    {userCluster.business_unit.name}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-sm truncate">
                                    {getRolIcon(userCluster.platform_role)}
                                </p>
                                <p className="text-sm truncate">
                                    {getPlatformName(userCluster.platform_role)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {(!userClusters || userClusters.length === 0) && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No user clusters found</h3>
                    <p className="text-muted-foreground">
                        There are no user clusters to display at the moment.
                    </p>
                </div>
            )}
        </div>
    );
}