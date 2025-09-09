import { useQuery } from '@tanstack/react-query';
import { ParamsGetDto } from '@/dtos/param.dto';
import { backendApi } from '@/lib/backend-api';
import { getAllApiRequest, getByIdApiRequest } from '@/lib/config.api';

const locationApiUrl = (buCode: string, id?: string) => {
    const baseUrl = `${backendApi}/api/config/${buCode}/locations`;
    return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const useLocationsQuery = ({
    token,
    buCode,
    params,
}: {
    token: string;
    buCode: string;
    params?: ParamsGetDto;
}) => {
    const API_URL = locationApiUrl(buCode);
    const { data, isLoading, error } = useQuery({
        queryKey: ['locations', buCode, params],
        queryFn: async () => {
            try {
                const result = await getAllApiRequest(
                    API_URL,
                    token,
                    "Error fetching locations",
                    params
                );
                return result;
            } catch (error) {
                console.log('error', error);
                throw error;
            }
        }, enabled: !!token && !!buCode,
    });
    return { data, isLoading, error };
};

export const useLocationByIdQuery = ({
    token,
    buCode,
    id,
    enabled = true
}: {
    token: string;
    buCode: string;
    id: string;
    enabled?: boolean;
}) => {
    const API_URL = locationApiUrl(buCode, id);
    const { data, isLoading, error } = useQuery({
        queryKey: ['location', buCode, id],
        queryFn: async () => {
            try {
                const result = await getByIdApiRequest(
                    API_URL,
                    token,
                    "Error fetching location",
                );
                return result;
            } catch (error) {
                console.log('error', error);
                throw error;
            }
        },
        enabled: enabled && !!token && !!buCode,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        retryDelay: 500,
    });
    return { data, isLoading, error };
};
