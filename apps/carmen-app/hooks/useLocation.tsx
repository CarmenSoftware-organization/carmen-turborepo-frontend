import { useQuery } from '@tanstack/react-query';
import { getAllLocations } from '@/services/location.service';
import { ParamsGetDto } from '@/dtos/param.dto';
export const useLocationsQuery = ({
    token,
    tenantId,
    params,
    enabled = true
}: {
    token: string;
    tenantId: string;
    params?: ParamsGetDto;
    enabled?: boolean;
}) => {
    return useQuery({
        queryKey: ['locations', tenantId, params],
        queryFn: () => getAllLocations(token, tenantId, params || {}),
        enabled: enabled && !!token && !!tenantId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};