import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/context/AuthContext';
import * as m from '@/paraglide/messages.js';
import Link from 'next/link';

const UserProfile = () => {
	const { handleLogout, authState } = useAuth();
	const firstChar = authState.user?.username?.charAt(0).toUpperCase();
	return (
		<DropdownMenu data-id="user-profile-dropdown-menu">
			<DropdownMenuTrigger asChild data-id="user-profile-dropdown-menu-trigger">
				<Button
					variant="ghost"
					className="relative h-8 w-8 rounded-full"
					data-id="user-profile-dropdown-menu-trigger-button"
				>
					<Avatar
						className="h-8 w-8"
						data-id="user-profile-dropdown-menu-trigger-button-avatar"
					>
						<AvatarImage
							src="/placeholder.svg?height=32&width=32"
							alt="@johndoe"
							data-id="user-profile-dropdown-menu-trigger-button-avatar-image"
						/>
						<AvatarFallback data-id="user-profile-dropdown-menu-trigger-button-avatar-fallback">
							{firstChar}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-56"
				align="end"
				forceMount
				data-id="user-profile-dropdown-menu-content"
			>
				<DropdownMenuLabel
					className="font-normal"
					data-id="user-profile-dropdown-menu-label"
				>
					<div
						className="flex flex-col space-y-1"
						data-id="user-profile-dropdown-menu-label-username-container"
					>
						<p
							className="text-sm font-medium leading-none"
							data-id="user-profile-dropdown-menu-label-username"
						>
							{authState.user?.username}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator data-id="user-profile-dropdown-menu-separator" />
				<DropdownMenuItem
					className="cursor-pointer"
					data-id="user-profile-dropdown-menu-item-edit-profile"
				>
					<Link
						href={'/profile'}
						className="flex"
						data-id="user-profile-dropdown-menu-item-edit-profile-link"
					>
						<User
							className="mr-2 h-4 w-4"
							data-id="user-profile-dropdown-menu-item-user-icon"
						/>
						<span data-id="user-profile-dropdown-menu-item-edit-profile-text">
							{m.edit_profile()}
						</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem
					className="cursor-pointer"
					data-id="user-profile-dropdown-menu-item-settings"
				>
					<Link
						href={'/settings'}
						className="flex"
						data-id="user-profile-dropdown-menu-item-settings-link"
					>
						<Settings
							className="mr-2 h-4 w-4"
							data-id="user-profile-dropdown-menu-item-settings-icon"
						/>
						<span data-id="user-profile-dropdown-menu-item-settings-text">
							{m.settings()}
						</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator data-id="user-profile-dropdown-menu-separator" />
				<DropdownMenuItem
					className="cursor-pointer"
					onClick={() => {
						handleLogout();
					}}
					data-id="user-profile-dropdown-menu-item-logout"
				>
					<LogOut
						className="mr-2 h-4 w-4"
						data-id="user-profile-dropdown-menu-item-logout-icon"
					/>
					<span data-id="user-profile-dropdown-menu-item-logout-text">
						{m.logout()}
					</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserProfile