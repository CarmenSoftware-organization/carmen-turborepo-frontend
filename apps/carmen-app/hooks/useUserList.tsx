import { useAuth } from "@/context/AuthContext";
import { getUserList } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";

export const useUserList = () => {
    const { token, tenantId } = useAuth();

    const {
        data: userList = [],
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['users', tenantId],
        queryFn: async () => {
            if (!token || !tenantId) {
                throw new Error('Unauthorized: Missing token or tenantId');
            }
            return await getUserList(token, tenantId);
        },
        enabled: !!token && !!tenantId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const isUnauthorized = isError && (error instanceof Error && error.message.includes('Unauthorized'));

    return {
        userList,
        isLoading,
        isUnauthorized
    };
}
