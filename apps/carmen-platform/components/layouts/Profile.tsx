"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "../ui/avatar"
import Image from 'next/image'
import { useAuth } from "@/app/context/AuthContext";

export default function Profile() {
    const { handleLogout, user } = useAuth();
    const userEmail = user.email;
    const userFullName = user.user_info.firstname + ' ' + user.user_info.lastname;

    const userInitials = userFullName.split(' ').map(name => name[0]).join('').toUpperCase();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">{userFullName}</p>
                            <p className="text-sm text-muted-foreground">{userEmail}</p>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                    <Image src="/icons/profile.svg" alt="logo" width={25} height={25} />
                    Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <Image src="/icons/logout.svg" alt="logo" width={25} height={25} />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}