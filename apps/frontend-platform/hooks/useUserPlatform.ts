import { fetchUserPlatform } from "@/services/user/platform";
import { UserPlatformType } from "@/types/main";
import { useState, useEffect } from "react";

interface UseUserPlatformProps {
    initialData?: UserPlatformType[];
}

export const useUserPlatform = ({ initialData = [] }: UseUserPlatformProps = {}) => {
    const [users, setUsers] = useState<UserPlatformType[]>(initialData);

    useEffect(() => {
        if (initialData.length > 0) return;
        const fetchUsers = async () => {
            try {
                const data = await fetchUserPlatform();
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch user platform data:", error);
            }
        };

        fetchUsers();
    }, [initialData]);

    return { users, setUsers };
}
