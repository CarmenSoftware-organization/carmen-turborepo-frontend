import React from 'react'
import { fetchAdminStatus } from '@/services/dashboard/admin-status'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatItem } from '@/types/main';
import { FileText, Building2, FolderTree, Users } from "lucide-react";

const iconMap = {
    "FileText": FileText,
    "Building2": Building2,
    "FolderTree": FolderTree,
    "Users": Users
};

const DashboardStatus = async () => {

    const statusData = await fetchAdminStatus() as StatItem[];

    const DisplayData = statusData.map((stat: StatItem, index: number) => {
        const IconComponent = iconMap[stat.icon as keyof typeof iconMap];
        return (
            <Card key={index}>
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

    return DisplayData;
};

export default DashboardStatus;