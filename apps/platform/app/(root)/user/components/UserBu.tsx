"use client";

import { useState } from "react";
import { BusinessUnitUserDto } from "@/dto/user.dto";
import { businessUnitUserMockData } from "@/mock-data/user.data";
import { User } from "lucide-react";
import FilterBu from "./FilterBu";
import BuUserList from "./BuUserList";
import FormDialogBu from "./FormDialogBu";

export default function UserBu() {
    const [usersBu, setUsersBu] = useState<BusinessUnitUserDto[]>(businessUnitUserMockData);
    const [open, setOpen] = useState(false);

    const handleAddUser = (newUser: BusinessUnitUserDto) => {
        setUsersBu((prevUsers) => [newUser, ...prevUsers]);

        alert(`User added successfully: ${newUser.name}`);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="">
                    <h2 className="text-2xl font-bold tracking-tight">Business Unit Staff</h2>
                    <p className="text-muted-foreground">
                        Manage business unit staff and department access
                    </p>
                </div>
                <div className="flex gap-2">
                    <FormDialogBu
                        open={open}
                        onOpenChange={setOpen}
                        onAddUser={handleAddUser}
                    />
                </div>
            </div>
            <div className="flex justify-end items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">
                    {usersBu.length} users
                </p>
            </div>
            <FilterBu />
            <BuUserList users={usersBu} />
        </div>
    )
}
