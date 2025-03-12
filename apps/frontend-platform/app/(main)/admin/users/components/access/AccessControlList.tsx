import React from 'react'
import { fetchAccessControl } from '@/services/access-control/access-control';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Building2, Users } from 'lucide-react';
import TableAccessControl from './TableAccessControl';

const AccessControlList = async () => {
    const accessControl = await fetchAccessControl();
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{accessControl.total_users}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all modules
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Modules</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{accessControl.active_modules}</div>
                        <p className="text-xs text-muted-foreground">
                            In use across groups
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Usage Warnings</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{accessControl.usage_warning}</div>
                        <p className="text-xs text-muted-foreground">
                            Approaching limits
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Exceeded Limits</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{accessControl.excess_limits}</div>
                        <p className="text-xs text-muted-foreground">
                            Over user limits
                        </p>
                    </CardContent>
                </Card>
                {/* <pre>{JSON.stringify(accessControl, null, 2)}</pre> */}
            </div>
            <TableAccessControl modules={accessControl.modules} />
        </>
    )
}

export default AccessControlList