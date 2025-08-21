import { ClusterDtoId, UserProfileDto } from "@/dto/cluster.dto";
import FormCluster from "./FormCluster";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Kbd } from "@/components/ui/kbd";
import { ArrowLeftIcon, Building, Building2, Mail, Shield, User } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
interface DetailClusterProps {
    cluster?: ClusterDtoId;
    mode: "add" | "edit";
}

export default function DetailCluster({ cluster, mode }: DetailClusterProps) {
    const router = useRouter();
    const countBu = cluster?.tb_business_unit.length;
    const countUser = cluster?.tb_cluster_user.length;

    const getInitials = (firstname: string, lastname: string): string => {
        return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
    };

    const getRoleBadgeVariant = (role: string) => {
        return role === 'admin' ? 'default' : 'secondary';
    };

    const getRoleIcon = (role: string) => {
        return role === 'admin' ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />;
    };

    const formatName = (profile: UserProfileDto): string => {
        const { firstname, lastname, middlename } = profile;
        return middlename
            ? `${firstname} ${middlename} ${lastname}`
            : `${firstname} ${lastname}`;
    };

    return (
        <div className="max-w-7xl mx-auto p-2 space-y-2">
            {mode === "add" && <FormCluster />}

            <Card className="rounded-md">
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Kbd className="cursor-pointer hover:bg-accent transition-colors" onClick={() => router.push('/cluster')}>
                                <ArrowLeftIcon className="h-4 w-4" />
                            </Kbd>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">{cluster?.code} - {cluster?.name}</h1>
                                <div className="flex items-center">
                                    <Badge variant="outline" className="border-none text-base bg-card/50">
                                        <span
                                            className={cn(
                                                cluster?.is_active ? "bg-chart-2" : "bg-destructive",
                                                "size-3 rounded-full"
                                            )}
                                            aria-hidden="true"
                                        />
                                        {cluster?.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-card/50">
                                        <Building className="w-4 h-4 text-chart-3" />
                                        <span className="text-sm font-medium">{countBu}</span>
                                    </div>
                                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-card/50">
                                        <User className="w-4 h-4 text-chart-4" />
                                        <span className="text-sm font-medium">{countUser}</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                {/* Info Card */}
                <Card className="lg:col-span-1 rounded-md">
                    <CardHeader>
                        <CardTitle className="text-lg">Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{cluster?.info ?? "No information available"}</p>
                    </CardContent>
                </Card>

                {/* Business Unit Card */}
                <Card className="lg:col-span-2 rounded-md">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-chart-3" />
                            Business Units
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Name</TableHead>
                                    <TableHead>Code</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cluster?.tb_business_unit.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center">
                                            <p className="text-muted-foreground">No business units available</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    cluster?.tb_business_unit.map((unit) => (
                                        <TableRow key={unit.id} className="hover:bg-accent/50 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3/10 text-chart-3">
                                                        <Building2 className="h-4 w-4" />
                                                    </div>
                                                    <div className="font-medium">{unit.name}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/20">{unit.code}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 rounded-md">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <User className="h-5 w-5 text-chart-4" />
                            Users
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>User</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cluster?.tb_cluster_user.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center">
                                            <p className="text-muted-foreground">No users available</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    cluster?.tb_cluster_user.map((clusterUser) => (
                                        <TableRow key={clusterUser.id} className="hover:bg-accent/50 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className={clusterUser.role === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}>
                                                            {getInitials(clusterUser.user.profile.firstname, clusterUser.user.profile.lastname)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="font-medium">
                                                        {formatName(clusterUser.user.profile)}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-sm">{clusterUser.user.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getRoleBadgeVariant(clusterUser.role)} className="flex items-center gap-1 w-fit">
                                                    {getRoleIcon(clusterUser.role)}
                                                    <span className="capitalize">{clusterUser.role}</span>
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}