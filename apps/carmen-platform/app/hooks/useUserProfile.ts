import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

export const useUserProfile = () => {
    const { accessToken } = useAuth();

    return useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            const response = await fetch('/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }

            return response.json();
        },
        enabled: !!accessToken,
        staleTime: 5 * 60 * 1000,
    });
};
