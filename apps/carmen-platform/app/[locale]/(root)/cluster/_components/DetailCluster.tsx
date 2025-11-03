"use client";

import { ClusterDtoId, PLATFORM_ROLE, UserProfileDto } from "@/dto/cluster.dto";
import FormCluster from "./FormCluster";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, getPlatformName } from "@/lib/utils";
import { Kbd } from "@/components/ui/kbd";
import { ArrowLeftIcon, Building2, Code, Headphones, Mail, Settings, Shield, SquarePenIcon, User, UserCog, Lock } from "lucide-react";
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
import { useState } from "react";
interface DetailClusterProps {
    cluster?: ClusterDtoId;
    mode: "add" | "edit" | "view";
}

export default function DetailCluster({ cluster, mode }: DetailClusterProps) {
    const router = useRouter();
    const countBu = cluster?.tb_business_unit.length;
    const countUser = cluster?.tb_cluster_user.length;
    const [currentMode, setCurrentMode] = useState<"add" | "edit" | "view">(mode);

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

    return (
        <div className="max-w-7xl mx-auto p-2 space-y-2">
            {currentMode === "add" || currentMode === "edit" ? (
                <FormCluster mode={currentMode} setMode={setCurrentMode} />
            ) : (
                <>
                    <Card className="rounded-md">
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Kbd className="cursor-pointer hover:bg-accent transition-colors" onClick={() => router.push('/cluster')}>
                                        <ArrowLeftIcon className="h-4 w-4" />
                                    </Kbd>
                                    <h1 className="text-2xl font-bold text-foreground">{cluster?.code} - {cluster?.name}</h1>
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
                                </div>
                                <div className="flex items-center gap-2">
                                    <Kbd onClick={() => setCurrentMode("edit")}>
                                        <SquarePenIcon />
                                    </Kbd>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                        <Card className="lg:col-span-1 rounded-md">
                            <CardHeader>
                                <CardTitle className="text-lg">Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-muted-foreground">{cluster?.info ?? "No information available"}</p>
                            </CardContent>
                        </Card>

                        {/* Business Unit Card */}
                        <Card className="lg:col-span-2 rounded-md">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-primary" />
                                    Business Units ({countBu})
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
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-primary">
                                                                <Building2 className="h-4 w-4" />
                                                            </div>
                                                            <div className="font-medium">{unit.name}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{unit.code}</Badge>
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
                                    Users ({countUser})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead>User</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Platform Role</TableHead>
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
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm">{clusterUser.user.email}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {getRolIcon(clusterUser.user.platform_role)}
                                                            {getPlatformName(clusterUser.user.platform_role)}
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
                </>
            )}
        </div>
    )
}