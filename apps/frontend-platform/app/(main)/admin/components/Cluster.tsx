import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { fetchClusterOverview } from '@/services/dashboard/report'
import { ClusterType } from '@/types/main'
import { FolderTree } from 'lucide-react'
import React from 'react'

const Cluster = async () => {
    const clusterOverview = await fetchClusterOverview()
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cluster Overview</CardTitle>
                <FolderTree className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <ScrollArea className="h-[287px]">
                <CardContent className="space-y-4">
                    {clusterOverview.map((cluster: ClusterType) => (
                        <div key={cluster.name} className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-1">
                                <div className="font-medium">{cluster.name}</div>
                                <div className="text-sm text-muted-foreground">{cluster.businessUnits} Business Units</div>
                            </div>
                            <Badge>{cluster.status}</Badge>
                        </div>
                    ))}
                </CardContent>

            </ScrollArea>

        </Card>
    )
}

export default Cluster