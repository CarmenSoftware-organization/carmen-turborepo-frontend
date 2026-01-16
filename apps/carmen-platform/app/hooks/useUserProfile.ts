import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { xAppId } from "@/lib/backend-api";

export const useUserProfile = () => {
    const { accessToken } = useAuth();

    return useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            const response = await fetch('/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "x-app-id": xAppId,
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
