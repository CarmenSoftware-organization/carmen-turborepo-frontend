import { fetchClusterById } from '@/services/cluster/cluster-list';
import React from 'react'

const ClusterPage = async ({ params }: { params: { id: string } }) => {
    const cluster = await fetchClusterById(params.id);
    return (
        <div>
            <h1>{cluster.name}</h1>
        </div>
    )
}

export default ClusterPage;