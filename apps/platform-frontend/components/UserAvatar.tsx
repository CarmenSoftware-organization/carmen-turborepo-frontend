"use client"

import * as React from "react"
import { useAuth } from "@/contexts/auth-context"
import { LogOut } from "lucide-react"
import { DropdownMenu } from "@/components/ui/custom-dropdown"
import { Button } from "./ui/button"

const UserAvatar = () => {
    const { user, logoutContext } = useAuth();

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <div className="flex items-center space-x-1">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white">
                        {user?.name?.charAt(0) ?? 'U'}
                    </div>
                </div>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Label>
                    {user?.name ?? 'User'}
                </DropdownMenu.Label>
                <div className="px-4 py-1 text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                </div>
                <DropdownMenu.Separator />
                <DropdownMenu.Item onClick={logoutContext} destructive>
                    <Button variant="destructive" className="w-full">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    )
}

export default UserAvatar;
