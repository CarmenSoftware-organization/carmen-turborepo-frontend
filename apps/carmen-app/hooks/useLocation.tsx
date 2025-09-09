import { useQuery } from '@tanstack/react-query';
import { getAllLocations, getLocationByIdService } from '@/services/location.service';
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

export const useLocationsQueryV2 = ({
    token,
    buCode,
    params,
}: {
    token: string;
    buCode: string;
    params?: ParamsGetDto;
}) => {
    return useQuery({
        queryKey: ['locations', buCode, params],
        queryFn: () => getAllLocations(token, buCode, params || {}),
        enabled: !!token && !!buCode,
    });
};


export const useLocationByIdQuery = ({
    token,
    tenantId,
    id,
    enabled = true
}: {
    token: string;
    tenantId: string;
    id: string;
    enabled?: boolean;
}) => {
    return useQuery({
        queryKey: ['location', tenantId, id],
        queryFn: () => getLocationByIdService(token, tenantId, id),
        enabled: enabled && !!token && !!tenantId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        retryDelay: 500,
    });
};
