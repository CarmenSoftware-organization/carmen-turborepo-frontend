import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React from 'react'
import ClusterCard from './ClusterCard';

const ClusterComponent = () => {
    return (
        <div className='space-y-6'>
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Clusters</h2>
                    <p className="text-muted-foreground">
                        Manage cluster infrastructure and business units
                    </p>
                </div>
                <Button className="font-medium" size={'sm'}>
                    <Plus className="h-4 w-4" />
                    Add Cluster
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <ClusterCard />
            </div>
        </div>
    )
}

export default ClusterComponent;