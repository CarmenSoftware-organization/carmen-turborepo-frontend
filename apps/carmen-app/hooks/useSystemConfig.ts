import { getAllSystemUnitBu } from "@/services/system.service";
import { useQuery } from "@tanstack/react-query";

export const useSystemUnitBuQuery = (token: string) => {
    return useQuery({
        queryKey: ["system-unit-bu"],
        queryFn: async () => {
            const data = await getAllSystemUnitBu(token);
            return data;
        },
        enabled: !!token,
    });
}