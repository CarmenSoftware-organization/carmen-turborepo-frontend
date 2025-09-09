import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getUserProfileService,
    updateUserBusinessUnitService,
} from "@/services/auth.service";

// Query keys for better cache management
export const authQueryKeys = {
    userProfile: ["userProfile"] as const,
    businessUnit: (buCode: string) => ["businessUnit", buCode] as const,
};

// Hook สำหรับ query user profile
export const useUserProfileQuery = (token: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: authQueryKeys.userProfile,
        queryFn: () => getUserProfileService(token),
        enabled: !!token && enabled,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        retry: 1,
    });
};

// Hook สำหรับ mutation การเปลี่ยน business unit
export const useUpdateBusinessUnitMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ token, buCode }: { token: string; buCode: string }) =>
            updateUserBusinessUnitService(token, buCode),
        onSuccess: (data, variables) => {
            // Invalidate และ refetch user profile หลังจากเปลี่ยน business unit
            queryClient.invalidateQueries({
                queryKey: authQueryKeys.userProfile,
            });

            // อัปเดต tenant ID ใน sessionStorage
            if (typeof window !== "undefined") {
                sessionStorage.setItem("tenant_id", variables.buCode);
            }
        },
        onError: (error) => {
            console.error("Failed to update business unit:", error);
        },
    });
};

// Hook สำหรับจัดการ cache การ logout
export const useAuthCache = () => {
    const queryClient = useQueryClient();

    const clearAuthCache = () => {
        queryClient.removeQueries({
            queryKey: authQueryKeys.userProfile,
        });
        queryClient.clear();
    };

    return { clearAuthCache };
}; 