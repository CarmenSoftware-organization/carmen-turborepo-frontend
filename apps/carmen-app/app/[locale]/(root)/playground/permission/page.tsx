import Link from "next/link";
import { usersPermissionTest } from "./permissionData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PermissionPage() {
    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                Permission Testing Playground
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {usersPermissionTest.map(user => (
                    <Link key={user.id} href={`/playground/permission/${user.id}`}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {user.name}
                                </CardTitle>
                                <CardDescription className="capitalize">
                                    {user.role}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Permissions:
                                    </p>
                                    {user.permissions.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {user.permissions.map(permission => (
                                                <Badge key={permission} variant="secondary">
                                                    {permission}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <Badge variant="destructive">No Permissions</Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
