import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchClusters } from '@/services/cluster/cluster-list';
import { BusinessUnitType } from '@/types/main';
import { Building2, Eye, FolderTree, Globe, Users } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const ClusterCard = async () => {
    const clusters = await fetchClusters();

    console.log('clusters aaaa', clusters);

    const displayClusters = clusters.map((cluster: BusinessUnitType) => (
        <Card key={cluster.id}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                            <FolderTree className="h-5 w-5 text-muted-foreground" />
                            {cluster.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{cluster?.cluster?.region}</span>
                            <Badge variant="outline">{cluster.status}</Badge>
                        </div>
                    </div>
                    <Link href={`/admin/clusters/${cluster.cluster.id}`}>
                        <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Business Units</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Teams</span>
                            <span>{cluster.details.teams}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Total Rooms</span>
                            <span>{cluster.details.rooms}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Members</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Total Members</span>
                            <span>{cluster.details.members}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Avg per Unit</span>
                            <span>{Math.round(cluster.details.members / cluster.details.teams)}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    ))
    return displayClusters;
}

export default ClusterCard;