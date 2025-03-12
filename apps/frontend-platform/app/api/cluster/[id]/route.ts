import { NextRequest, NextResponse } from "next/server";
import { mockBusinessUnits, mockClusters } from "../../mock-data";

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const cluster = mockClusters.find((cluster) => cluster.id === id);
    const businessUnits = mockBusinessUnits.filter((businessUnit) => businessUnit.clusterId === id);

    const clusterDetails = {
        ...cluster,
        businessUnits: businessUnits
    }
    if (!cluster) {
        return NextResponse.json({ error: 'Cluster not found' }, { status: 404 });
    }
    return NextResponse.json(clusterDetails);
}
