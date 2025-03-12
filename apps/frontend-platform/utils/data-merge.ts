import { BusinessUnitCluster, BusinessUnitType } from "@/types/main";
import { mockClusters, mockBusinessUnits } from "@/app/api/mock-data";

export interface MergedClusterData extends Omit<BusinessUnitCluster, 'businessUnits'> {
    businessUnits: BusinessUnitType[];
}

export const getMergedClusterData = () => {
    return mockClusters.map((cluster) => {
        const clusterBusinessUnits = mockBusinessUnits.filter(
            (bu) => bu.clusterId === cluster.id
        );

        return {
            ...cluster,
            businessUnits: clusterBusinessUnits,
        };
    });
};

export const getMergedClusterById = (clusterId: string) => {
    const cluster = mockClusters.find((c) => c.id === clusterId);
    if (!cluster) return undefined;

    const clusterBusinessUnits = mockBusinessUnits.filter(
        (bu) => bu.clusterId === clusterId
    );

    return {
        ...cluster,
        businessUnits: clusterBusinessUnits,
    };
};

export const getBusinessUnitsWithClusters = () => {
    return mockBusinessUnits.map((bu) => {
        const cluster = mockClusters.find((c) => c.id === bu.clusterId);
        if (!cluster) throw new Error(`Cluster not found for business unit ${bu.id}`);

        return {
            ...bu,
            cluster,
        };
    });
}; 