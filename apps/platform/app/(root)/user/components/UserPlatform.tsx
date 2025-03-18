import { platformUserMockData } from "@/mock-data/user.data";
import { User } from "lucide-react";
import FilterPlatform from "./FilterPlatform";
import PlatformUserList from "./PlatformUserList";

export default function UserPlatform() {
    const users = platformUserMockData
    return (
        <div className="space-y-4"  >
            <div className="flex justify-between items-center">
                <div className="">
                    <h2 className="text-2xl font-bold tracking-tight">Platform Users</h2>
                    <p className="text-muted-foreground">
                        Manage platform-wide user access and roles
                    </p>
                </div>
                <div className="flex gap-2">
                    <User />
                    <p className="text-muted-foreground text-md">
                        {users.length} users
                    </p>
                </div>
            </div>
            <FilterPlatform />
            <PlatformUserList />
        </div>
    )
}
