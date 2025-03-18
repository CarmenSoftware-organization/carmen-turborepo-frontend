"use client";

import { platformUserMockData } from "@/mock-data/user.data";
import { User } from "lucide-react";
import FilterPlatform from "./FilterPlatform";
import PlatformUserList from "./PlatformUserList";
import { useState } from "react";
import { PlatformUserDto } from "@/dto/user.dto";
import FormDialogPlatform from "./FormDialogPlatform";

export default function UserPlatform() {
    const [users, setUsers] = useState<PlatformUserDto[]>(platformUserMockData);
    const [open, setOpen] = useState(false);
    const handleAddUser = (newUser: PlatformUserDto) => {
        setUsers((prevUsers) => [newUser, ...prevUsers]);

        alert(`User added successfully: ${newUser.name}`);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="">
                    <h2 className="text-2xl font-bold tracking-tight">Platform Users</h2>
                    <p className="text-muted-foreground">
                        Manage platform-wide user access and roles
                    </p>
                </div>
                <div className="flex gap-2">
                    <FormDialogPlatform
                        open={open}
                        onOpenChange={setOpen}
                        onAddUser={handleAddUser}
                    />
                </div>
            </div>
            <div className="flex justify-end items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">
                    {users.length} users
                </p>
            </div>
            <FilterPlatform />
            <PlatformUserList users={users} />
        </div>
    );
}
