import React from 'react'
import { FileText, Building2, FolderTree, Users } from "lucide-react";
import { getStatusDashboard } from '@/services/dashboard';
import { StatusDashboard } from '@/dto/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'


const iconMap = {
    "FileText": FileText,
    "Building2": Building2,
    "FolderTree": FolderTree,
    "Users": Users
};
const DashboardStatus = async () => {

    const dashboardStatus = await getStatusDashboard();

    const DisplayData = dashboardStatus.map((stat: StatusDashboard) => {
        const IconComponent = iconMap[stat.icon as keyof typeof iconMap];
        return (
            <Card key={stat.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    {IconComponent && <IconComponent className="h-4 w-4 text-muted-foreground" />}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                        {stat.description}
                    </p>
                </CardContent>
            </Card>
        );
    });

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {DisplayData}
        </div>
    )
}

export default DashboardStatus