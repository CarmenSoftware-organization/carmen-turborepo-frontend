"use client";

import { ClusterUserDto } from "@/dto/user.dto";
import { clusterUserMockData } from "@/mock-data/user.data";
import { User } from "lucide-react";
import { useState } from "react";
import FilterCluster from "./FilterCluster";
import FormDialogCluster from "./FormDialogCluster";
import ClusterUserList from "./ClusterUserList";

export default function UserCluster() {
    const [usersCluster, setUsersCluster] = useState<ClusterUserDto[]>(clusterUserMockData);
    const [open, setOpen] = useState(false);
    const handleAddUser = (newUser: ClusterUserDto) => {
        setUsersCluster((prevUsers) => [newUser, ...prevUsers]);

        alert(`User added successfully: ${newUser.name}`);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="">
                    <h2 className="text-2xl font-bold tracking-tight">Cluster Users</h2>
                    <p className="text-muted-foreground">
                        Manage users and access across hotel groups
                    </p>
                </div>
                <div className="flex gap-2">
                    <FormDialogCluster
                        open={open}
                        onOpenChange={setOpen}
                        onAddUser={handleAddUser}
                    />
                </div>
            </div>
            <div className="flex justify-end items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">
                    {usersCluster.length} users
                </p>
            </div>
            <FilterCluster />
            <ClusterUserList users={usersCluster} />
        </div>
    )
}
