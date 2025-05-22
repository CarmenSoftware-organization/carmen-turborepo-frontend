import { SystemBuFormValue } from "@/dtos/system.dto";
import { createSystemUnitBu, getAllSystemUnitBu } from "@/services/system.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useSystemUnitBuQuery = (token: string) => {
    return useQuery({
        queryKey: ["system-unit-bu"],
        queryFn: async () => {
            const data = await getAllSystemUnitBu(token);
            return data;
        },
        enabled: !!token,
    });
};


export const useCreateSystemUnitBuMutation = (token: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: SystemBuFormValue) => {
            if (!token) {
                throw new Error("Authentication token is required");
            }
            return await createSystemUnitBu(token, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["system-unit-bu"] });
        },
    });
};
